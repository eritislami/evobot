const move = require("array-move");
const { canModifyQueue } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
  name: "move",
  aliases: ["mv"],
  description: i18n.__("move.description"),
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n.__("move.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(i18n.__mf("move.usagesReply", { prefix: message.client.prefix }));
    if (isNaN(args[0]) || args[0] <= 1)
      return message.reply(i18n.__mf("move.usagesReply", { prefix: message.client.prefix }));

    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
    queue.textChannel.send(
      i18n.__mf("move.result", {
        author: message.author,
        title: song.title,
        index: args[1] == 1 ? 1 : args[1]
      })
    );
  }
};
