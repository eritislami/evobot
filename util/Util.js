const {
  TOKEN,
  YOUTUBE_API_KEY,
  SOUNDCLOUD_CLIENT_ID,
  PREFIX,
  MAX_PLAYLIST_SIZE,
  PRUNING,
  STAY_TIME,
  DEFAULT_VOLUME,
  LOCALE
} = process.env;

exports.canModifyQueue = (member) => member.voice.channelID === member.guild.voice.channelID;

let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

exports.TOKEN = config?.TOKEN ?? TOKEN;
exports.YOUTUBE_API_KEY = config?.YOUTUBE_API_KEY ?? YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config?.SOUNDCLOUD_CLIENT_ID ?? SOUNDCLOUD_CLIENT_ID;
exports.PREFIX = (config?.PREFIX ?? PREFIX) || "/";
exports.MAX_PLAYLIST_SIZE = (config?.MAX_PLAYLIST_SIZE ?? parseInt(MAX_PLAYLIST_SIZE)) || 10;
exports.PRUNING = config?.PRUNING ?? PRUNING === "true";
exports.STAY_TIME = (config?.STAY_TIME ?? parseInt(STAY_TIME)) || 30;
exports.DEFAULT_VOLUME = (config?.DEFAULT_VOLUME ?? parseInt(DEFAULT_VOLUME)) || 100;
exports.LOCALE = (config?.LOCALE ?? LOCALE) || "en";
