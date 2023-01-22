import { GuildMember } from "discord.js";

export const canModifyQueue = (member: GuildMember) =>
  member.voice.channelId === member.guild.members.me!.voice.channelId;
