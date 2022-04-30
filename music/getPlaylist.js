import YouTubeAPI from "simple-youtube-api";
import SoundCloud from "soundcloud-downloader";
import { config } from "../utils/config.js";

const { MAX_PLAYLIST_SIZE, SOUNDCLOUD_CLIENT_ID, YOUTUBE_API_KEY } = config;
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
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
      playlist = await youtube.getPlaylist(url, { part: "snippet" });
      videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
    } catch (error) {
      console.error(error);
      return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
    }
  } else if (scdl.isValidUrl(args[0])) {
    if (args[0].includes("/sets/")) {
      message.reply(i18n.__("playlist.fetchingPlaylist"));

      playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
      videos = playlist.tracks.map((track) => ({
        title: track.title,
        url: track.permalink_url,
        duration: track.duration / 1000
      }));
    }
  } else {
    try {
      const results = await youtube.searchPlaylists(search, 1, { part: "id" });

      playlist = results[0];
      videos = await playlist.getVideos(MAX_PLAYLIST_SIZE, { part: "snippet" });
    } catch (error) {
      console.error(error);
      return message.reply(error.message).catch(console.error);
    }
  }

  videos = videos
    .filter((video) => video.title != "Private video" && video.title != "Deleted video")
    .map((video) => {
      return {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };
    });

  return { playlist, videos };
}
