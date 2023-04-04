import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { i18n } from "../utils/i18n";
import { videoPattern, isURL } from "../utils/patterns";
const { stream , video_basic_info } = require('play-dl');

export interface SongData {
  url: string;
  title: string;
  duration: number;
}

export class Song {
  public readonly url: string;
  public readonly title: string;
  public readonly duration: number;

  public constructor({ url, title, duration }: SongData) {
    this.url = url;
    this.title = title;
    this.duration = duration;
  }

  public static async from(url: string = "", search: string = "") {
    const isYoutubeUrl = videoPattern.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await video_basic_info(url);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    } 
    else {
      const result = await youtube.searchOne(search);

      result ? null : console.log(`No results found for ${search}`); // This is for handling the case where no results are found (spotify links for example)

      if (!result) {
        let err = new Error(`No search results found for ${search}`);
        err.name = "NoResults";
        if (isURL.test(url)) err.name = "InvalidURL";

        throw err;
      }

      songInfo = await video_basic_info(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    let playStream;

    let type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

    const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

    if (source === "youtube") {
      playStream = await stream(this.url);
    }

    if (!stream) return;

    return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
  }

  public startMessage() {
    return i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
  }
}
