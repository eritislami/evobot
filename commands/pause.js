const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    const emptyQueue = new MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Empty Queue')
    .setDescription('There is nothing playing')
    
    if (!queue) return message.reply(emptyQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      
      const paused = new MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Paused')
    .setDescription(`${message.author} ⏸ paused the music`)
     
      return queue.textChannel.send(paused).catch(console.error);
    }
  }
};
