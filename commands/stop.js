const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    const embedA = new MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Empty Queue')
    .setDescription('There is nothing in the queue')
    
    if (!queue) return message.reply(embedA).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    
    const embedB = new MessageEmbed()
    .setColor(0x7289da)
    .setTimestamp()
    .setTitle('Stopped!')
    .setDescription(`${message.author.tag} stooped the music`)
    
    queue.textChannel.send(embedB).catch(console.error);
  }
};
