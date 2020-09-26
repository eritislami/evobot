const { canModifyQueue } = require("../util/EvobotUtil");
const { SKIP } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: SKIP.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply(SKIP.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(format(SKIP.skip,message.author)).catch(console.error);
  }
};
