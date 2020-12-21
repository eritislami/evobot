const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "Get lyrics for the currently playing song",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is nothing playing.").catch(console.error);
    function sendLyrics(lyrics) {
      charLength = lyrics.length;
      if (charLength < 2048) {
        cantEmbeds = 1
      }
      else {
        for (let i = 2; i < 10; i++) {
          if (charLength < 2048 * i) {
            cantEmbeds = i
            break;
          }
        }
      }
      function embeds(lyrics, cant) {
        String.prototype.trimEllip = function (length) {
          return this.length > length ? this.substring(0, length) : this;
        }
        let lyricsEmbed = new MessageEmbed()
          .setTitle(queue.songs[0].title)
          .setDescription(lyrics.trimEllip(2047))
          .setColor("#F8AA2A")
        message.channel.send(lyricsEmbed).catch(console.error);
        lyrics = lyrics.replace(lyrics.trimEllip(2047), '');
        for (let i = 2; i <= cant; i++) {

          let lyricsEmbed = new MessageEmbed()
            .setDescription(lyrics.trimEllip(2047))
            .setColor("#F8AA2A")
            .setTimestamp();
          message.channel.send(lyricsEmbed).catch(console.error);
          lyrics = lyrics.replace(lyrics.trimEllip(2048), '');
        }
      }
      embeds(lyrics, cantEmbeds);
    }
    try {
      lyrics = await lyricsFinder(queue.songs[0].title);
      if (lyrics < 2) {
        const url = 'https://api.lxndr.live/lyrics/?song=' + encodeURI(queue.songs[0].title);
        console.log(url)
        fetch(url)
          .then(response => response.json())
          .then(data => {
            sendLyrics(data.lyrics);
          });
      } else {
        sendLyrics(lyrics);
      }
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
      message.channel.send(lyrics)
      console.log(error)
    }
  }
};
