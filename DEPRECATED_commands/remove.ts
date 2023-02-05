import { Message } from "discord.js";
import { bot } from "../index";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

export default {
  name: "remove",
  aliases: ["rm"],
  description: i18n.__("remove.description"),
  execute(message: Message, args: any[]) {
    const queue = bot.queues.get(message.guild!.id);

    if (!queue) return message.reply(i18n.__("remove.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(message.member!)) return i18n.__("common.errorNotChannel");

    if (!args.length) return message.reply(i18n.__mf("remove.usageReply", { prefix: bot.prefix }));

    const removeArgs = args.join("");

    const songs = removeArgs.split(",").map((arg) => parseInt(arg));

    let removed: Song[] = [];

    if (pattern.test(removeArgs)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
        else return true;
      });

      queue.textChannel.send(
        i18n.__mf("remove.result", {
          title: removed.map((song) => song.title).join("\n"),
          author: message.author.id
        })
      );
    } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
      return queue.textChannel.send(
        i18n.__mf("remove.result", {
          title: queue.songs.splice(args[0] - 1, 1)[0].title,
          author: message.author.id
        })
      );
    } else {
      return message.reply(i18n.__mf("remove.usageReply", { prefix: bot.prefix }));
    }
  }
};
