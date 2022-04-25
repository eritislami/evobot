import { i18n } from "../utils/i18n.js";
import { existsSync } from "fs";
import { generateQueue } from "../utils/queue.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus
} from "@discordjs/voice";

export default {
  name: "clip",
  description: i18n.__("clip.description"),
  async execute(message, args) {
    const { channel } = message.member.voice;
    if (!channel) return message.reply(i18n.__("clip.errorNotChannel")).catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (queue) return message.reply(i18n.__("clip.errorQueue"));

    if (!args.length)
      return message
        .reply(i18n.__mf("clip.usagesReply", { prefix: message.client.prefix }))
        .catch(console.error);

    if (args[0].includes(".mp3")) args[0] = args[0].replace(".mp3", "");

    if (!existsSync(`./sounds/${args[0]}.mp3`))
      return message.reply(i18n.__("common.errorCommand")).catch(console.error);

    const queueConstruct = generateQueue(message.channel, channel);

    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.resource = createAudioResource(`./sounds/${args[0]}.mp3`, {
        inputType: StreamType.Arbitrary
      });

      queueConstruct.player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
      });

      queueConstruct.player.play(queueConstruct.resource);

      await entersState(queueConstruct.player, AudioPlayerStatus.Playing, 5e3);

      queueConstruct.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      });

      await entersState(queueConstruct.connection, VoiceConnectionStatus.Ready, 30e3);

      queueConstruct.connection.subscribe(queueConstruct.player);

      await queueConstruct.textChannel.send(
        i18n.__mf("play.startedPlaying", { title: `${args[0]}.mp3`, url: "" })
      );
    } catch (error) {
      console.error(error.message);
      return message.reply("error");
    }
  }
};
