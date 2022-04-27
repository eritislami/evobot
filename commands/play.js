import {
  createAudioPlayer,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior
} from "@discordjs/voice";
import https from "https";
import YouTubeAPI from "simple-youtube-api";
import Scdl from "soundcloud-downloader";
import ytdl from "ytdl-core";
import { play } from "../include/play.js";
import { generateQueue } from "../utils/queue.js";
import { config } from "../utils/config.js";
import { i18n } from "../utils/i18n.js";
import { videoPattern, playlistPattern, scRegex, mobileScRegex } from "../utils/patterns.js";

const { SOUNDCLOUD_CLIENT_ID, YOUTUBE_API_KEY } = config;
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = Scdl.create();

export default {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: i18n.__("play.description"),
  permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
  async execute(message, args) {
    const { channel } = message.member.voice;
    if (!channel) return message.reply(i18n.__("play.errorNotChannel")).catch(console.error);

    const queue = message.client.queue.get(message.guild.id);

    if (queue && channel.id !== queue.channel.id)
      return message
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user.username }))
        .catch(console.error);

    if (!args.length)
      return message
        .reply(i18n.__mf("play.usageReply", { prefix: message.client.prefix }))
        .catch(console.error);

    const search = args.join(" ");
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (
      (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) ||
      (scdl.isValidUrl(url) && url.includes("/sets/"))
    ) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply(i18n.__("play.songNotFound")).catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }

      return message.reply("Following url redirection...").catch(console.error);
    }

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1, { part: "id" });

        if (!results.length) {
          message.reply(i18n.__("play.songNotFound")).catch(console.error);
          return;
        }

        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);

        if (error.message.includes("410")) {
          return message.reply(i18n.__("play.songAccessErr")).catch(console.error);
        } else {
          return message.reply(error.message).catch(console.error);
        }
      }
    }

    if (queue) {
      queue.songs.push(song);

      return message
        .reply(i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
        .catch(console.error);
    }

    const queueConstruct = generateQueue(message.channel, channel);

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
      });

      queueConstruct.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      });

      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);

      getVoiceConnection(channel.guild.id).destroy();

      return message.reply(i18n.__mf("play.cantJoinChannel", { error: error })).catch(console.error);
    }
  }
};
