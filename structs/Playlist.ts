import youtube, { Playlist as YoutubePlaylist } from "youtube-sr";
import { config } from "../utils/config";
import { Song } from "./Song";

const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/i;

export class Playlist {
  public data: YoutubePlaylist;
  public videos: Song[];

  public constructor(playlist: YoutubePlaylist) {
    this.data = playlist;

    this.videos = this.data.videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .slice(0, config.MAX_PLAYLIST_SIZE - 1)
      .map((video) => {
        return new Song({
          title: video.title!,
          url: `https://youtube.com/watch?v=${video.id}`,
          duration: video.duration / 1000
        });
      });
  }

  public static async from(url: string = "", search: string = "") {
    const urlValid = pattern.test(url);
    let playlist;

    if (urlValid) {
      playlist = await youtube.getPlaylist(url);
    } else {
      const result = await youtube.searchOne(search, "playlist");

      playlist = await youtube.getPlaylist(result.url!);
    }

    return new this(playlist);
  }
}
