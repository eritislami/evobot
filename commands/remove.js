const { canModifyQueue, LOCALE } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: i18n.__("remove.description"),
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n.__("remove.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
    if (!args.length) return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));

    const arguments = args.join("");
    const songs = arguments.split(",").map((str) => str.trim());
    let removed = [];

    if (pattern.test(arguments) && songs.every((value) => value < queue.songs.length)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.every((value) => value - 1 != index)) {
          return true;
        } else {
          removed.push(item);
        }
      });

      queue.textChannel.send(
        `${message.author} ❌ removed **${removed.map((song) => song.title).join("\n")}** from the queue.`
      );
    } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
      return queue.textChannel.send(
        `${message.author} ❌ removed **${queue.songs.splice(args[0] - 1, 1)[0].title}** from the queue.`
      );
    } else {
      return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));
    }
  }
};
