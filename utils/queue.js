import { config } from "./config.js";

export const canModifyQueue = (member) => member.voice.channelId === member.guild.me.voice.channelId;

export function generateQueue(text, voice) {
  return {
    textChannel: text,
    channel: voice,
    connection: null,
    player: null,
    resource: null,
    songs: [],
    loop: false,
    volume: config.DEFAULT_VOLUME || 100,
    muted: false
  };
}
