const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "Get lyrics for the currently playing song",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is nothing playing.").catch(console.error);

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Lyrics")
      .setDescription(
        (await lyricsFinder(queue.songs[0].title, "")) || `No lyrics found for ${queue.songs[0].title}`
      )
      .setColor("#F8AA2A")
      .setTimestamp();

    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
