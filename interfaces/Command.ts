import { SlashCommandBuilder } from "discord.js";

export interface Command {
  permissions?: string[];
  cooldown?: number;
  data: SlashCommandBuilder;
  execute(...args: any): any;
}
