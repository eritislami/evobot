const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    
    const noQ = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Empty Queue')
      .setDescription(`There is nothing in the queue`)
    
    if (!queue) return message.reply(noQ).catch(console.error);
    if (!canModifyQueue(message.member))
      const neededVC = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Error!')
      .setDescription(`You need to join a voice channel first`)
      
      return message.reply(neededVC).catch(console.error);

    const currentVolume = new MessageEmbed()
      .setColor(0xd3d3d3)
      .setTimestamp()
      .setTitle('Volume')
      .setDescription(`The current volume is: **${queue.volume}**`)
    
    if (!args[0]) return message.reply(currentVolume).catch(console.error);
    
    const setVolume = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Input Invalid')
      .setDescription(`Please use a number to set the volume`)
    
    if (isNaN(args[0])) return message.reply(setVolume).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Please use a number between 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    const vol = new MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Set!')
      .setDescription(`Volume set to: **${args[0]}%**`)
    
    return queue.textChannel.send(vol).catch(console.error);
  }
};
