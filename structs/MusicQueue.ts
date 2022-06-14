import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  entersState,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionState,
  VoiceConnectionStatus
} from "@discordjs/voice";
import { Message, TextChannel, User } from "discord.js";
import { promisify } from "node:util";
import { bot } from "../index";
import { QueueOptions } from "../interfaces/QueueOptions";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { Song } from "./Song";

const wait = promisify(setTimeout);

export class MusicQueue {
  public readonly message: Message;
  public readonly connection: VoiceConnection;
  public readonly player: AudioPlayer;
  public readonly textChannel: TextChannel;
  public readonly bot = bot;

  public resource: AudioResource;
  public songs: Song[] = [];
  public volume = config.DEFAULT_VOLUME || 100;
  public loop = false;
  public muted = false;
  public queueLock = false;
  public readyLock = false;

  public constructor(options: QueueOptions) {
    Object.assign(this, options);

    this.textChannel = options.message.channel as TextChannel;
    this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    this.connection.subscribe(this.player);

    this.connection.on("stateChange" as any, async (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
          try {
            await entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000);
          } catch {
            this.connection.destroy();
          }
        } else if (this.connection.rejoinAttempts < 5) {
          await wait((this.connection.rejoinAttempts + 1) * 5_000);
          this.connection.rejoin();
        } else {
          this.connection.destroy();
        }
      } else if (newState.status === VoiceConnectionStatus.Destroyed) {
        // this.stop();
      } else if (
        !this.readyLock &&
        (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
      ) {
        this.readyLock = true;
        try {
          await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
        } catch {
          if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
        } finally {
          this.readyLock = false;
        }
      }
    });

    this.player.on("stateChange" as any, async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
      if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
        if (this.loop && this.songs.length) {
          this.songs.push(this.songs.shift()!);
        } else {
          this.songs.shift();
        }

        this.processQueue();
      } else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
        this.sendPlayingMessage(newState);
      }
    });

    this.player.on("error", (error) => {
      console.error(error);
      if (this.loop && this.songs.length) {
        this.songs.push(this.songs.shift()!);
      } else {
        this.songs.shift();
      }
      this.processQueue();
    });
  }

  public enqueue(...songs: Song[]) {
    this.songs = this.songs.concat(songs);
    this.processQueue();
  }

  public stop() {
    this.queueLock = true;
    this.loop = false;
    this.songs = [];
    this.player.stop();
    bot.queues.delete(this.message.guild!.id);

    !config.PRUNING && this.textChannel.send(i18n.__("play.queueEnded")).catch(console.error);

    setTimeout(() => {
      if (
        this.player.state.status !== AudioPlayerStatus.Idle ||
        this.connection.state.status === VoiceConnectionStatus.Destroyed
      )
        return;

      this.connection.destroy();

      !config.PRUNING && this.textChannel.send(i18n.__("play.leaveChannel"));
    }, 100);
  }

  private async processQueue(): Promise<void> {
    if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) {
      return;
    }

    if (!this.songs.length) {
      return this.stop();
    }

    this.queueLock = true;

    const next = this.songs[0];

    try {
      const resource = await next.makeResource();

      this.resource = resource!;
      this.player.play(this.resource);
      this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
    } catch (error) {
      console.error(error);

      return this.processQueue();
    } finally {
      this.queueLock = false;
    }
  }

  private async sendPlayingMessage(newState: any) {
    const song = (newState.resource as AudioResource<Song>).metadata;

    let playingMessage: Message;

    try {
      playingMessage = await this.textChannel.send((newState.resource as AudioResource<Song>).metadata.startMessage());

      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("🔀");
      await playingMessage.react("⏹");
    } catch (error: any) {
      console.error(error);
      this.textChannel.send(error.message);
      return;
    }

    const filter = (reaction: any, user: User) => user.id !== this.textChannel.client.user!.id;

    const collector = playingMessage.createReactionCollector({
      filter,
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", async (reaction, user) => {
      if (!this.songs) return;

      const member = await playingMessage.guild!.members.fetch(user);

      switch (reaction.emoji.name) {
        case "⏭":
          reaction.users.remove(user).catch(console.error);
          await this.bot.commands.get("skip")!.execute(this.message);
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (this.player.state.status == AudioPlayerStatus.Playing) {
            await this.bot.commands.get("pause")!.execute(this.message);
          } else {
            await this.bot.commands.get("resume")!.execute(this.message);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          this.muted = !this.muted;
          if (this.muted) {
            this.resource.volume?.setVolumeLogarithmic(0);
            this.textChannel.send(i18n.__mf("play.mutedSong", { author: user })).catch(console.error);
          } else {
            this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
            this.textChannel.send(i18n.__mf("play.unmutedSong", { author: user })).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (this.volume == 0) return;
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          this.volume = Math.max(this.volume - 10, 0);
          this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
          this.textChannel
            .send(i18n.__mf("play.decreasedVolume", { author: user, volume: this.volume }))
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (this.volume == 100) return;
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          this.volume = Math.min(this.volume + 10, 100);
          this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
          this.textChannel
            .send(i18n.__mf("play.increasedVolume", { author: user, volume: this.volume }))
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          await this.bot.commands.get("loop")!.execute(this.message);
          break;

        case "🔀":
          reaction.users.remove(user).catch(console.error);
          await this.bot.commands.get("shuffle")!.execute(this.message);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          await this.bot.commands.get("stop")!.execute(this.message);
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);

      if (config.PRUNING) {
        setTimeout(() => {
          playingMessage.delete().catch();
        }, 3000);
      }
    });
  }
}
