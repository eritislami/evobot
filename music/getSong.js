import SoundCloud from "soundcloud-downloader";
import youtube from "youtube-sr";
import ytdl from "ytdl-core";
import { i18n } from "../utils/i18n.js";
import { scRegex, videoPattern } from "../utils/patterns.js";

const scdl = SoundCloud.create();

export async function getSong({ message, args }) {
  const search = args.join(" ");
  const url = args[0];
  const urlValid = videoPattern.test(url);

  let songInfo = null;
  let song = null;

  if (urlValid) {
    songInfo = await ytdl.getInfo(url);

    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: songInfo.videoDetails.lengthSeconds
    };
  } else if (scRegex.test(url)) {
    const trackInfo = await scdl.getInfo(url);

    song = {
      title: trackInfo.title,
      url: trackInfo.permalink_url,
      duration: Math.ceil(trackInfo.duration / 1000)
    };
  } else {
    try {
      const result = await youtube.searchOne(search);

      if (!result) {
        message.reply(i18n.__("play.songNotFound")).catch(console.error);
        return;
      }

      songInfo = await ytdl.getInfo(`https://youtube.com/watch?v=${result.id}`);
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

  return song;
}
