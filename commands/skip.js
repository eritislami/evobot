const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      const noQ2Skip = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Unable to Skip')
      .setDescription(`There is nothing playing that I could skip for you`)
      
      return message.reply(noQ2Skip).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    
    const skipped = new MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Skipped')
      .setDescription(`${message.author.tag} skipped the song`)
    
    queue.textChannel.send(skipped).catch(console.error);
  }
};
