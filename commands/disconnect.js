const { canModifyQueue } = require("../util/Util");
const i18n = require("i18n");

module.exports = {
  name: "disconnect",
  aliases: ["dc"],
  description: i18n.__('disconnect.description'),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    const { channel } = message.member.voice;

    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    if (queue){
        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);
    }

    channel.leave();

  }
};