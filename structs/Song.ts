import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { i18n } from "../utils/i18n";
import { videoPattern, isURL } from "../utils/patterns";

const ytdl = require('@distube/ytdl-core');

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
      try {
        songInfo = await ytdl.getBasicInfo(url);
        console.log("YouTube Link:", url); // Nur den YouTube-Link anzeigen
      } catch (error) {
        console.error("Fehler beim Abrufen der Song-Info:", error);
        throw error;
      }

      return new this({
        url: songInfo.videoDetails.video_url,
        title: songInfo.videoDetails.title,
        duration: parseInt(songInfo.videoDetails.lengthSeconds)
      });
    } else {
      const result = await youtube.searchOne(search);

      if (!result) {
        let err = new Error(`No search results found for ${search}`);
        err.name = "NoResults";
        if (isURL.test(url)) err.name = "InvalidURL";
        throw err;
      }

      try {
        songInfo = await ytdl.getBasicInfo(`https://youtube.com/watch?v=${result.id}`);
        console.log("YouTube Link:", `https://youtube.com/watch?v=${result.id}`); // Nur den YouTube-Link anzeigen
      } catch (error) {
        console.error("Fehler beim Abrufen der Song-Info (Suche):", error);
        throw error;
      }

      return new this({
        url: songInfo.videoDetails.video_url,
        title: songInfo.videoDetails.title,
        duration: parseInt(songInfo.videoDetails.lengthSeconds)
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Song> | void> {
    let playStream;

    if (!this.url) {
      console.error("URL ist undefined oder null.");
      return;
    }

    try {
      if (this.url.includes("youtube")) {
        playStream = await ytdl(this.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1 << 25 // Erhöhen der Puffergröße
        });
      } else {
        // Handhabung für andere Quellen falls benötigt
      }
    } catch (error) {
      console.error("Fehler beim Abrufen des Streams:", error);
      return;
    }

    if (!playStream) {
      console.error("Stream konnte nicht abgerufen werden.");
      return;
    }

    return createAudioResource(playStream, { metadata: this, inputType: StreamType.Arbitrary, inlineVolume: true });
  }

  public startMessage() {
    return i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
  }
}
