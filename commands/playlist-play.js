const { DEFAULT_VOLUME, LOCALE } = require("../util/EvoBotUtil");
const { play } = require("../include/play");
const playPlaylist = require("../models/playlistSchema");
const i18n = require("i18n");
i18n.setLocale(LOCALE);

module.exports = {
  name: "playlist-play",
  cooldown: 5,
  aliases: ["pl-play", "pl-p"],
  description: i18n.__("playlist-play.description"),
  async execute(message, args) {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send(i18n.__("play.errorNotChannel"));
    }

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
      return message.channel.send(i18n.__("play.missingPermissionConnect"));
    }
    if (!permissions.has("SPEAK")) {
      return message.channel.send(i18n.__("play.missingPermissionSpeak"));
    }

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    if (serverQueue && channel !== message.guild.me.voice.channel) {
      return message.channel.send(i18n.__("play.errorNotInSameChannel", { user: message.client.user }));
    }

    if (!args[0]) {
      return message.channel.send(i18n.__("playlist-save.noPlaylistName"));
    }

    let member = message.author;
    const pName = args.join(" ");

    let fetchList;
    fetchList = await playPlaylist.findOne({
      userID: member.id,
      playlistName: pName
    });

    if (!fetchList) {
      return message.channel.send(i18n.__("playlist-play.playlistNotFound"));
    }

    try {
      fetchList.playlistArray.map((arr) => {
        if (arr) {
          serverQueue ? serverQueue.songs.push(arr) : queueConstruct.songs.push(arr);
        }
      });
    } catch (error) {
      console.error(error);
      return message.reply(error.message).catch(console.error);
    }

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);

      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(i18n.__("play.cantJoinChannel", { error: error })).catch(console.error);
      }
    }

    return message.channel.send(i18n.__("playlist-play.playlistAdded"));
  }
};
