const { canModifyQueue } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: i18n.__("skip.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    var skipPermission = (message.member.roles.cache.has('740630695373963334') || // Lich
                          message.member.roles.cache.has('898215498146250822') || // Guardian
                          message.member.roles.cache.has('740630138873577544') || // Necromancer
                          message.member.roles.cache.has('740630795613634651') || // Wight
                          message.member.roles.cache.has('740630795684675624')    // Ghoul
                         )
    if (!skipPermission) return message.reply(i18n.__("skip.permissionError")).catch(console.error);
    if (!queue) return message.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");


    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(i18n.__mf("skip.result", { author: message.author })).catch(console.error);
  }
};
