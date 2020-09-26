const { canModifyQueue } = require("../util/EvobotUtil");
const { REMOVE } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "remove",
  description: REMOVE.description,
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(REMOVE.no_queue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(format(REMOVE.usage,message.client.prefix));

    if (isNaN(args[0])) return message.reply(format(REMOVE.usage,message.client.prefix));

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(format(REMOVE.remove,message.author,song[0].title));

  }
};
