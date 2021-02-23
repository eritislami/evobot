const delPlaylist = require("../models/playlistSchema");
const i18n = require("i18n");
const { LOCALE } = require("../util/EvobotUtil");
i18n.setLocale(LOCALE);

module.exports = {
  name: "playlist-delete",
  cooldown: 5,
  aliases: ["pl-del", "pl-d"],
  description: i18n.__("playlist-delete.description"),
  async execute(message, args) {
    if (!args[0]) {
      return message.channel.send(i18n.__("playlist-save.noPlaylistName"));
    }

    const pName = args.join(" ");
    let fetchList = await delPlaylist.find({
      userID: message.author.id,
      playlistName: pName
    });

    if (fetchList.length == 0) {
      return message.channel.send(i18n.__("playlist-delete.noPlaylistFound"));
    }

    delPlaylist.deleteOne(
      {
        userID: message.author.id,
        playlistName: pName
      },
      function (err) {
        if (err) console.log(err);
      }
    );

    return message.channel.send(i18n.__("playlist-delete.playlistDeleted"));
  }
};
