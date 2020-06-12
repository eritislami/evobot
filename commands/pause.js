const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  execute(message) {
    if (!canModifyQueue(message.member)) return

    const queue = message.client.queue.get(message.guild.id);
    if (queue && queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error);
    }
    
    return message.reply("There is nothing playing.").catch(console.error);
  }
};
