const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Toggle music loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    const emptyQueue = new MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Empty Queue')
    .setDescription('There is nothing playing')
    
    if (!queue) return message.reply(emptyQueue);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    const loop = new MessageEmbed()
    .setColor(0x7289da)
    .setTimestamp()
    .setTitle('Loop')
    .setDescription(`Loop is now set to ${queue.loop ? "**on**" : "**off**"}`)
    return queue.textChannel.send(loop);
  }
};
