const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "unmute",
  description: "Unmute the music volume.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.volume <= 0) {
      queue.volume = volumeold;
      queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);;
      return queue.textChannel.send(`${user} 🔊 unmuted the music!`).catch(console.error);
    }
  }
};
