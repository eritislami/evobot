const { canModifyQueue } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: i18n.__("skip.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
    if (!message.member.roles.cache.has('740630695373963334')) return i18n.__("common.permissionError");

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(i18n.__mf("skip.result", { author: message.author })).catch(console.error);
  }
};
