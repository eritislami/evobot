import { VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";

export interface QueueOptions {
  connection: VoiceConnection;
  message: Message;
}
