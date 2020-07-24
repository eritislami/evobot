const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pausar",
  description: "Pausa a música",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nada está tocando.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ pausou a música.`).catch(console.error);
    }
  }
};
