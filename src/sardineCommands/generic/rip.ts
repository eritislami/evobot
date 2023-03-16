import { type ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { CommandBuilder } from '../../../interfaces/Command.js';

const command = new CommandBuilder();
command.data = new SlashCommandBuilder()
	.setName('rip')
	.setDescription('Pay respects to the fallen');
command.execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction
		.reply('Rip Capybara 02-01-2023. React :regional_indicator_f: to pay respects')
		.catch(console.error);
};

export default command;
