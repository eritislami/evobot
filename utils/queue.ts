import { GuildMember } from "discord.js";

export const canModifyQueue = (member: GuildMember) =>
  member.voice.channelId === member.guild.me!.voice.channelId;
