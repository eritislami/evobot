const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "mute",
  aliases: ["silent"],
  description: "Silent the music volume",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    global.volumeold = queue.volume;
    queue.volume = 0;
    queue.connection.dispatcher.setVolumeLogarithmic(0);
    queue.textChannel.send(`${message.author} 🔇 muted the music!`).catch(console.error);
  }
};
