const { MessageEmbed, splitMessage } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ['q'],
  description: "Show the music queue and now playing.",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);
    const description = serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`);

    let queueEmbed = new MessageEmbed()
    .setTitle("EvoBot Music Queue")
    .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`))
    .setColor("#F8AA2A");

    const splitDescription = splitMessage(description, { maxLength: 2048, char: '\n', prepend: '', append: '' });
	splitDescription.forEach(async m => {
        queueEmbed.setDescription(m);
        message.channel.send(queueEmbed);
	});

  }
};
