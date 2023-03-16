import {
	ApplicationCommandDataResolvable,
	Client,
	Collection,
	Events,
	Interaction,
	REST,
	Routes,
	Snowflake,
} from 'discord.js';
import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path, { join } from 'node:path';
import { Command } from '../interfaces/Command';
import { checkPermissions, PermissionResult } from '../utils/checkPermissions';
import { config } from '../utils/config';
import { i18n } from '../utils/i18n';
import { logger } from '../utils/logger';
import { MissingPermissionsException } from '../utils/MissingPermissionsException';
import { MusicQueue } from './MusicQueue';

export class Bot {
	public readonly prefix = config.PREFIX;
	public commands = new Collection<string, Command>();
	public slashCommands = new Array<ApplicationCommandDataResolvable>();
	public slashCommandsMap = new Collection<string, Command>();
	public cooldowns = new Collection<string, Collection<Snowflake, number>>();
	public queues = new Collection<Snowflake, MusicQueue>();

	public constructor(public readonly client: Client) {
		this.loadEvents()
			.then(() => {
				// After loading events login
				this.client
					.login(config.TOKEN)
					.then(() => {
						logger.info(`Client logged in`);
					})
					.catch((error: unknown) => {
						logger.error(`Error logging in`);
						logger.error(error);
					});
			})
			.catch((error: unknown) => {
				logger.error(`Error Loading Events`);
				logger.error(error);
			});
	}

	private async loadEvents() {
		const eventPath: string = fileURLToPath(new URL(join('..', 'events'), import.meta.url));
		return readdir(eventPath).then((files: string[]) => {
			const promises: Promise<any>[] = [];
			for (const file of files) {
				const filePath = pathToFileURL(path.join(eventPath, file));
				promises.push(
					import(filePath.pathname).then((value: DiscordEventListener) => {
						const eventListener = value.default as DiscordEventListener;
						logger.info(`Loading Event ${eventListener.name}`);
						// logger.debug(eventListener);
						if (eventListener.once) {
							client
								.once(eventListener.name, async (...args) => eventListener.execute(...args))
								.eventNames();
							logger.debug(`Registered ${eventListener.name} event once`);
						} else {
							client
								.on(eventListener.name, async (...args) => eventListener.execute(...args))
								.eventNames();
							logger.debug(`Registered ${eventListener.name} event`);
						}
					})
				);
			}

			return Promise.all(promises);
		});
	}

	private async registerSlashCommands() {
		const rest = new REST({ version: '9' }).setToken(config.TOKEN);

		const commandFiles = readdirSync(join(__dirname, '..', 'commands')).filter(
			(file) => !file.endsWith('.map')
		);

		for (const file of commandFiles) {
			const command = await import(join(__dirname, '..', 'commands', `${file}`));

			this.slashCommands.push(command.default.data);
			this.slashCommandsMap.set(command.default.data.name, command.default);
		}

		await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
	}

	private async onInteractionCreate() {
		this.client.on(Events.InteractionCreate, async (interaction: Interaction): Promise<any> => {
			if (!interaction.isChatInputCommand()) return;

			const command = this.slashCommandsMap.get(interaction.commandName);

			if (!command) return;

			if (!this.cooldowns.has(interaction.commandName)) {
				this.cooldowns.set(interaction.commandName, new Collection());
			}

			const now = Date.now();
			const timestamps: any = this.cooldowns.get(interaction.commandName);
			const cooldownAmount = (command.cooldown || 1) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({
						content: i18n.__mf('common.cooldownMessage', {
							time: timeLeft.toFixed(1),
							name: interaction.commandName,
						}),
						ephemeral: true,
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				const permissionsCheck: PermissionResult = await checkPermissions(command, interaction);

				if (permissionsCheck.result) {
					command.execute(interaction);
				} else {
					throw new MissingPermissionsException(permissionsCheck.missing);
				}
			} catch (error: any) {
				console.error(error);

				if (error.message.includes('permissions')) {
					interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
				} else {
					interaction
						.reply({ content: i18n.__('common.errorCommand'), ephemeral: true })
						.catch(console.error);
				}
			}
		});
	}
}
