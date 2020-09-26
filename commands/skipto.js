const { canModifyQueue } = require("../util/EvobotUtil");
const { SKIPTO } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: SKIPTO.description,
  execute(message, args) {
    if (!args.length)
      return message
        .reply(format(SKIPTO.usage,message.client.prefix,module.exports.name))
        .catch(console.error);

    if (isNaN(args[0]))
      return message
        .reply(format(SKIPTO.usage,message.client.prefix,module.exports.name))
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(SKIPTO.no_queue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(format(SKIPTO.queue,queue.songs.length)).catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    queue.textChannel.send(format(SKIPTO.skip,message.author,args[0] - 1)).catch(console.error);
  }
};
