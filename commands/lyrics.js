const { MessageEmbed } = require("discord.js");
const genius = require('genius-lyrics-api');
const { GENIUS_TOKEN } = require('../util/EvobotUtil')

module.exports = {
  name: "lyrics",
  aliases: ["l"],
  description: "Get lyrics for the currently playing song",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is nothing playing.").catch(console.error);

    let lyrics = null;

    const options = {
      apiKey: GENIUS_TOKEN,
      title: song.title,
      artist: "",
      optimizeQuery: true
    };

    try {
      lyrics = await genius.getLyrics(options);
      if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}`
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`${queue.songs[0].title} — Lyrics`)
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
