const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  description: "Show the music queue and now playing.",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

    let queueEmbed = new MessageEmbed()
      .setTitle("EvoBot Music Queue")
      .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`))
      .setColor("#F8AA2A");

    queueEmbed.setTimestamp();
    return message.channel.send(queueEmbed);
  }
};
