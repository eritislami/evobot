exports.canModifyQueue = (member) => {
  const { channelID } = member.voice;
  const botChannel = member.guild.voice.channelID;

  if (channelID !== botChannel) {
    return;
  }

  return true;
};

var DJ_PERMISSION_OBJ='';
exports.isDJ = (member,message) => {
  /**
   * Role checking logic
   */
  if (!DJ_PERMISSION_OBJ) {
    DJ_PERMISSION_OBJ = message.guild.roles.cache.find(role => role.name === DJ_ROLE)
  };

  if(DJ_PERMISSION_OBJ && !message.member.roles.cache.has(DJ_PERMISSION_OBJ.id)) {
     message.reply(`Only users with the ${DJ_ROLE} role can access this feature!`);
     return false;
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
var DJ_ROLE = config ? config.DJ_ROLE : process.env.DJ_ROLE;
