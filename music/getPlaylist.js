import SoundCloud from "soundcloud-downloader";
import youtube from "youtube-sr";
import { config } from "../utils/config.js";
import { i18n } from "../utils/i18n.js";

const { MAX_PLAYLIST_SIZE } = config;
const scdl = SoundCloud.create();
const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;

export async function getPlaylist({ message, args }) {
  const search = args.join(" ");
  const url = args[0];
  const urlValid = pattern.test(args[0]);

  let playlist = null;
  let videos = [];

  if (urlValid) {
    try {
      playlist = await youtube.getPlaylist(url);
      videos = playlist.videos.slice(0, MAX_PLAYLIST_SIZE - 1);
    } catch (error) {
      console.error(error);
      return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
    }
  } else if (scdl.isValidUrl(args[0])) {
    if (args[0].includes("/sets/")) {
      message.reply(i18n.__("playlist.fetchingPlaylist"));

      playlist = await scdl.getSetInfo(args[0]);
      videos = playlist.tracks.map((track) => ({
        title: track.title,
        url: track.permalink_url,
        duration: track.duration / 1000
      }));
    }
  } else {
    try {
      const result = await youtube.searchOne(search, "playlist");
      playlist = await youtube.getPlaylist(result.url);
      videos = playlist.videos.slice(0, MAX_PLAYLIST_SIZE - 1);
    } catch (error) {
      console.error(error);
      return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
    }
  }

  videos = videos
    .filter((video) => video.title != "Private video" && video.title != "Deleted video")
    .map((video) => {
      return {
        title: video.title,
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration / 1000
      };
    });

  return { playlist, videos };
}
