const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "letras",
  aliases: ["ly"],
  description: "Mostra as letras da música atual",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Nada está tocando.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `Letras para ${queue.songs[0].title} não encontradas.`;
    } catch (error) {
      lyrics = `etras para ${queue.songs[0].title} não encontradas.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Letras")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
