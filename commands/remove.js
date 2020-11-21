const { canModifyQueue, LOCALE } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: i18n.__("remove.description"),
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(i18n.__("remove.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    if (!args.length) return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));
    if (isNaN(args[0]))
      return message.reply(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }));

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(i18n.__mf("remove.result", { author: message.author, title: song[0].title }));
  }
};
