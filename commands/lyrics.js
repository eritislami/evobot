const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { LYRICS } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const util = require('util');

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: LYRICS.description,
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(LYRICS.nothing_playing).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = util.format(LYRICS.no_lyrics,${queue.songs[0].title});
    } catch (error) {
      lyrics = util.format(LYRICS.no_lyrics,${queue.songs[0].title});
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(LYRICS.lyricsEmbed.title)
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
