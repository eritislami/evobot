const savePlaylist = require("../models/playlistSchema");
const i18n = require("i18n");
const { LOCALE } = require("../util/EvobotUtil");
i18n.setLocale(LOCALE);

module.exports = {
  name: "playlist-save",
  cooldown: 30,
  aliases: ["pl-save", "pl-s"],
  description: i18n.__("playlist-save.description"),
  async execute(message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send(i18n.__("playlist-save.errorNotQueue"));
    }

    let queue = serverQueue.songs;
    const pName = args.join(" ");

    if (!args[0]) {
      return message.channel.send(i18n.__("playlist-save.noPlaylistName"));
    }

    let fetchList = await savePlaylist.find({
      userID: message.author.id
    });
    if (fetchList.length >= 10) {
      return message.channel.send(i18n.__("playlist-save.reachedSaveLimit"));
    }

    let pNameFinder = await savePlaylist.find({
      userID: message.author.id,
      playlistName: pName
    });
    if (pNameFinder.length > 0) {
      return message.channel.send(i18n.__("playlist-save.samePlaylistName"));
    }

    if (pName.length > 32) {
      return message.channel.send(i18n.__("playlist-save.playlistNameLong"));
    }

    const data = new savePlaylist({
      username: message.author.tag,
      userID: message.author.id,
      playlistName: pName,
      playlistArray: queue
    });
    data.save((err) => {
      if (err) console.error(err);
    });
    console.log(data)
    return message.channel.send(i18n.__("playlist-save.playlistSaved"));
  }
};
