const { canModifyQueue } = require("../util/EvobotUtil");
const { STOP } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "stop",
  description: STOP.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(STOP.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(format(STOP.stopped,message.author)).catch(console.error);
  }
};
