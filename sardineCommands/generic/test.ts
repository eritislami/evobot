import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { CommandBuilder } from '../../interfaces/Command.js';

const command = new CommandBuilder();
command.data = new SlashCommandBuilder().setName('test').setDescription('Test command');
command.execute = async (interaction: ChatInputCommandInteraction) => {
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId('0').setLabel('Click').setStyle(ButtonStyle.Danger)
	);

	return interaction
		.reply({
			content: 'Dont touch the button',
			components: [row],
		})
		.catch(console.error);
};

export default command;
