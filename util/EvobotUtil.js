exports.canModifyQueue = (member) => {
  const { channelID } = member.voice;
  const botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    return;
  }

  return true;
};

let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;
exports.MAX_PLAYLIST_SIZE = config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE;
exports.PRUNING = config ? config.PRUNING : process.env.PRUNING;
exports.STAY_TIME = config ? config.STAY_TIME : process.env.STAY_TIME;
exports.DEFAULT_VOLUME = config ? config.DEFAULT_VOLUME: process.env.DEFAULT_VOLUME;
exports.LOCALE = config ? config.LOCALE : process.env.LOCALE;