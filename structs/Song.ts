import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { getInfo } from "ytdl-core";
import ytdl from "ytdl-core-discord";
import { i18n } from "../utils/i18n";
import { videoPattern } from "../utils/patterns";

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
    // const isScUrl = scRegex.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await getInfo(url);

      return new this({
        url: songInfo.videoDetails.video_url,
        title: songInfo.videoDetails.title,
        duration: parseInt(songInfo.videoDetails.lengthSeconds)
      });
    } else {
      const result = await youtube.searchOne(search);

      songInfo = await getInfo(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: songInfo.videoDetails.video_url,
        title: songInfo.videoDetails.title,
        duration: parseInt(songInfo.videoDetails.lengthSeconds)
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    let stream;

    let type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

    const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

    if (source === "youtube") {
      stream = await ytdl(this.url, { highWaterMark: 1 << 25 });
    }

    if (!stream) return;

    return createAudioResource(stream, { metadata: this, inputType: type, inlineVolume: true });
  }

  public startMessage() {
    return i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
  }
}
