import type { InteractionResponse, ChatInputCommandInteraction } from 'discord.js';
import { TextChannel, SlashCommandBuilder } from 'discord.js';
import { CommandBuilder } from '../../interfaces/Command.js';
import { getGif } from '../../../assets/gifs/tenorCollections.js';

/**
 * Command to post a random good night gif
 * @date 3/11/2023 - 2:12:22 AM
 *
 * @type {CommandBuilder}
 */
const command = new CommandBuilder();
command.data = new SlashCommandBuilder().setName('gng').setDescription('Good Night Gaming');
command.execute = async (interaction: ChatInputCommandInteraction) => {
	return interaction.reply('Good Night Gaming').then(async (value: InteractionResponse) => {
		if (value.interaction.channel instanceof TextChannel) {
			await value.interaction.channel.send(getGif('gng'));
		}
	});
};

export default command;
