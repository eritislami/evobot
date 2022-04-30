import YouTubeAPI from "simple-youtube-api";
import SoundCloud from "soundcloud-downloader";
import ytdl from "ytdl-core";
import { config } from "../utils/config.js";
import { scRegex, videoPattern } from "../utils/patterns.js";

const { SOUNDCLOUD_CLIENT_ID, YOUTUBE_API_KEY } = config;
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = SoundCloud.create();

export async function getSong({ message, args }) {
  const search = args.join(" ");
  const url = args[0];
  const urlValid = videoPattern.test(args[0]);

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
    const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);

    song = {
      title: trackInfo.title,
      url: trackInfo.permalink_url,
      duration: Math.ceil(trackInfo.duration / 1000)
    };
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

  return song;
}
