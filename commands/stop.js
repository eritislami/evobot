const { canModifyQueue, LOCALE } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "stop",
  description: i18n.__('stop.description'),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);
  }
};
