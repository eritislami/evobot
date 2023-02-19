import { VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, TextChannel } from "discord.js";

export interface QueueOptions {
  interaction: CommandInteraction;
  textChannel: TextChannel;
  connection: VoiceConnection;
}
