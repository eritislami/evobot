import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skipto",
  aliases: ["st"],
  description: i18n.__("skipto.description"),
  execute(message: Message, args: Array<any>) {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(i18n.__mf("skipto.usageReply", { prefix: bot.prefix, name: module.exports.name }))
        .catch(console.error);

    const queue = bot.queues.get(message.guild!.id);

    if (!queue) return message.reply(i18n.__("skipto.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(message.member!)) return i18n.__("common.errorNotChannel");

    if (args[0] > queue.songs.length)
      return message
        .reply(i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }))
        .catch(console.error);

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift()!);
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.player.stop();

    queue.textChannel
      .send(i18n.__mf("skipto.result", { author: message.author, arg: args[0] - 1 }))
      .catch(console.error);
  }
};
