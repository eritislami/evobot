const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "Show now playing song",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);
    const song = serverQueue.songs[0];

    let nowPlaying = new MessageEmbed()
      .setTitle("Now playing")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor("EvoBot")
      .setTimestamp();

    if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
