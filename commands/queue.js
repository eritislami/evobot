const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { QUEUE,ERROR } = require(`../lang/${require("../config.json").LANGUAGE}.json`);

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: QUEUE.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(ERROR.nothing_playing).catch(console.error);

    const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

    let queueEmbed = new MessageEmbed()
      .setTitle(QUEUE.queueEmbed.title)
      .setDescription(description)
      .setColor("#F8AA2A");

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};
