const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove song from the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    
    
      const emptyQueue = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Empty Queue')
      .setDescription('There is nothing in the queue')
    
    if (!queue) return message.channel.send(emptyQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    
      const noArgs = new MessageEmbed()
      .setColor(0xd3d3d3)
      .setTimestamp()
      .setTitle('Usage')
      .setDescription(`${message.client.prefix}remove <Queue Number>`)
      
      
      const NaNer = new MessageEmbed()
      .setColor(0xd3d3d3)
      .setTimestamp()
      .setTitle('Usage')
      .setDescription(`${message.client.prefix}remove <Queue Number>`)
    
    if (!args.length) return message.reply(noArgs);
    if (isNaN(args[0])) return message.reply(NaNer);

    const song = queue.songs.splice(args[0] - 1, 1);
    
    
      const remov = new MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Song Removed from Queue')
      .setDescription(`${message.author.tag} removed **${song[0].title}** from the queue`)
    
    queue.textChannel.send(remov);
  }
};
