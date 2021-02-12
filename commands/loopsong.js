const { canModifyQueue, LOCALE } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "loopsong",
  aliases: ["ls"],
  description: i18n.__("loop.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n.__("loop.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    // toggle from false to true and reverse
    queue.loopSong = !queue.loopSong;
    return queue.textChannel
      .send(`Loop song is now ${queue.loopSong ? "ON" : "OFF"}`)
      .catch(console.error);
  }
};
