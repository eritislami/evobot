const { canModifyQueue } = require("../util/EvobotUtil");
const { VOLUME } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: VOLUME.description,
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(VOLUME.nothing_playing).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(VOLUME.need_to_join).catch(console.error);

    if (!args[0]) return message.reply(format(VOLUME.current_volume,queue.volume)).catch(console.error);
    if (isNaN(args[0])) return message.reply(VOLUME.use_number).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply(VOLUME.range).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(format(VOLUME.set_volume,args[0])).catch(console.error);
  }
};
