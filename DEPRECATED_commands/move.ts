import move from "array-move";
import { Message } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";

export default {
  name: "move",
  aliases: ["mv"],
  description: i18n.__("move.description"),
  execute(message: Message, args: number[]) {
    const queue = bot.queues.get(message.guild!.id);

    if (!queue) return message.reply(i18n.__("move.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(message.member!)) return;

    if (!args.length) return message.reply(i18n.__mf("move.usagesReply", { prefix: bot.prefix }));

    if (isNaN(args[0]) || args[0] <= 1)
      return message.reply(i18n.__mf("move.usagesReply", { prefix: bot.prefix }));

    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);

    queue.textChannel.send(
      i18n.__mf("move.result", {
        author: message.author,
        title: song.title,
        index: args[1] == 1 ? 1 : args[1]
      })
    );
  }
};
