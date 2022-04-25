import { i18n } from "../utils/i18n.js";
import { canModifyQueue } from "../utils/queue.js";

export default {
  name: "volume",
  aliases: ["v"],
  description: i18n.__("volume.description"),
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(i18n.__("volume.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(i18n.__("volume.errorNotChannel")).catch(console.error);

    if (!args[0])
      return message.reply(i18n.__mf("volume.currentVolume", { volume: queue.volume })).catch(console.error);

    if (isNaN(args[0])) return message.reply(i18n.__("volume.errorNotNumber")).catch(console.error);

    if (Number(args[0]) > 100 || Number(args[0]) < 0)
      return message.reply(i18n.__("volume.errorNotValid")).catch(console.error);

    queue.volume = args[0];
    queue.resource.volume?.setVolumeLogarithmic(args[0] / 100);

    return message.reply(i18n.__mf("volume.result", { arg: args[0] })).catch(console.error);
  }
};
