import { TextChannel, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { CommandBuilder } from '../../interfaces/Command.js';
import { getReactionGif } from '../../../assets/gifs/tenorCollections.js';

/**
 * Command to post a random good evening gif
 * @date 3/11/2023 - 2:12:22 AM
 *
 * @type {CommandBuilder}
 */
const command = new CommandBuilder();
command.data = new SlashCommandBuilder()
	.setName('react')
	.setDescription('Someone posted something super interesting and you must let them know');
command.execute = async (interaction: ChatInputCommandInteraction) => {
	if (interaction.channel instanceof TextChannel) {
		return interaction.channel.messages
			.fetch({ limit: 1 })
			.then(async (messages) => {
				await messages.last()?.reply(getReactionGif('react'));
			})
			.finally(() => {
				void interaction.reply({ content: 'Reaction sent', fetchReply: true, ephemeral: true });
			});
	}
};

export default command;
