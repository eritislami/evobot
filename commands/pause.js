const { canModifyQueue } = require("../util/EvobotUtil");
const { PAUSE,ERROR } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "pause",
  description: PAUSE.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(ERROR.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(format(PAUSE.paused_music,message.author)).catch(console.error);
    }
  }
};
