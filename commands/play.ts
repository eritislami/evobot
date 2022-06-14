import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";

export default {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: i18n.__("play.description"),
  permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
  async execute(message: Message, args: string[]) {
    const { channel } = message.member!.voice;

    if (!channel) return message.reply(i18n.__("play.errorNotChannel")).catch(console.error);

    const queue = bot.queues.get(message.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return message
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }))
        .catch(console.error);

    if (!args.length) return message.reply(i18n.__mf("play.usageReply", { prefix: bot.prefix })).catch(console.error);

    const url = args[0];

    const loadingReply = await message.reply("⏳ Loading...");

    // Start the playlist if playlist url was provided
    if (playlistPattern.test(args[0])) {
      await loadingReply.delete();
      return bot.commands.get("playlist")!.execute(message, args);
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

    if (queue) {
      queue.songs.push(song);

      return message
        .reply(i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
        .catch(console.error);
    }

    const newQueue = new MusicQueue({
      message,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(message.guild!.id, newQueue);

    newQueue.enqueue(song);
  }
};
