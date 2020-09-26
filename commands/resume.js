const { canModifyQueue } = require("../util/EvobotUtil");
const { RESUME } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: RESUME.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(RESUME.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(format(RESUME.resume,message.author)).catch(console.error);
    }

    return message.reply(RESUME.paused).catch(console.error);
  }
};
