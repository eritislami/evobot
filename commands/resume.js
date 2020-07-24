const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resumir",
  aliases: ["r"],
  description: "Resume a música atual",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nada está tocando.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ resumindo a músicas!`).catch(console.error);
    }

    return message.reply("The queue is not paused.").catch(console.error);
  }
};
