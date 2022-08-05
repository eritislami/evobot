import { Message } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { playlistPattern } from "../utils/patterns";
import { Song } from "../structs/Song";

export default {
  name: "playskip",
  cooldown: 10,
  aliases: ["pskip"],
  description: i18n.__("playskip.description"),
  permissions: ["MANAGE_MESSAGES"],
  async execute(message: Message, args: string[]) {
    const queue = bot.queues.get(message.guild!.id);
    const url = args[0];

    if (!queue) {
      await bot.commands.get("play")!.execute(message, args);
      return
    }

    if (!canModifyQueue(message.member!)) return i18n.__("common.errorNotChannel");

    const loadingReply = await message.reply("⏳ Loading...");

    if (playlistPattern.test(url)) {
      await loadingReply.delete();
      return message.reply(i18n.__mf("playskip.errorPlaylist", { prefix: bot.prefix })).catch(console.error);
    }

    let song;

    try {
      song = await Song.from(url, args.join(" "));
    } catch (error) {
      console.error(error);
      return message.reply(i18n.__("common.errorCommand")).catch(console.error);
    } finally {
      await loadingReply.delete();
    }

    queue.songs.splice(1, 0, song)

    queue.player.stop();

    return message
        .reply(i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
        .catch(console.error);
  }
};
