const { canModifyQueue } = require("../util/EvobotUtil");
const { LOOP,ERROR } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: LOOP.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(ERROR.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(format(LOOP.loop_status, queue.loop ? LOOP.on:LOOP.off))
      .catch(console.error);
  }
};
