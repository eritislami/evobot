import type { InteractionResponse, ChatInputCommandInteraction } from 'discord.js';
import { TextChannel, SlashCommandBuilder } from 'discord.js';
import { getGif } from '../../../assets/gifs/tenorCollections.js';
import { CommandBuilder } from '../../interfaces/Command.js';

/**
 * Command to hate mondays
 * @date 3/11/2023 - 2:12:22 AM
 *
 * @type {CommandBuilder}
 */
const command = new CommandBuilder();
command.data = new SlashCommandBuilder().setName('ihm').setDescription('I Hate Mondays');
command.execute = async (interaction: ChatInputCommandInteraction) => {
	const today: Date = new Date(Date.now());

	if (today.getDay() !== 1) {
		return interaction.reply({ content: "It's not monday...", ephemeral: true });
	}

	return interaction.reply('I Hate Mondays').then(async (value: InteractionResponse) => {
		if (value.interaction.channel instanceof TextChannel) {
			await value.interaction.channel.send(getGif('ihm'));
		}
	});
};

export default command;
