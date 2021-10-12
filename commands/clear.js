const { canModifyQueue } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
  name: "clear",
  aliases: [],
  description: i18n.__("clear.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n.__("clear.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    queue.songs = queue.songs.splice(0, 1);

    queue.textChannel.send(
      i18n.__mf("clear.result", {
        author: message.author.id
      })
    );
  }
};
