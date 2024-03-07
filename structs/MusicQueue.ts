import {
  AudioPlayer,
  AudioPlayerPlayingState,
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
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  GuildMember,
  Interaction,
  Message,
  TextChannel
} from "discord.js";
import { promisify } from "node:util";
import { bot } from "../index";
import { QueueOptions } from "../interfaces/QueueOptions";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { Song } from "./Song";
import { safeReply } from "../utils/safeReply";

const wait = promisify(setTimeout);

export class MusicQueue {
  public readonly interaction: CommandInteraction;
  public readonly connection: VoiceConnection;
  public readonly player: AudioPlayer;
  public readonly textChannel: TextChannel;
  public readonly bot = bot;

  public resource: AudioResource;
  public songs: Song[] = [];
  public volume = config.DEFAULT_VOLUME || 100;
  public loop = false;
  public muted = false;
  public waitTimeout: NodeJS.Timeout | null;
  private queueLock = false;
  private readyLock = false;
  private stopped = false;

  /**
   * Constructs a new MusicQueue instance, setting up the audio player,
   * voice connection, and event listeners to manage voice state changes
   * and audio playback. It also handles network state changes to ensure
   * a stable connection for audio streaming.
   * @param options
   */
  public constructor(options: QueueOptions) {
    Object.assign(this, options);

    this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    this.connection.subscribe(this.player);

    const networkStateChangeHandler = (
      oldNetworkState: VoiceConnectionState,
      newNetworkState: VoiceConnectionState
    ) => {
      const newUdp = Reflect.get(newNetworkState, "udp");
      clearInterval(newUdp?.keepAliveInterval);
    };

    this.connection.on("stateChange", async (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
      Reflect.get(oldState, "networking")?.off("stateChange", networkStateChangeHandler);
      Reflect.get(newState, "networking")?.on("stateChange", networkStateChangeHandler);

      if (newState.status === VoiceConnectionStatus.Disconnected) {
        if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
          try {
            this.stop();
          } catch (e) {
            console.log(e);
            this.stop();
          }
        } else if (this.connection.rejoinAttempts < 5) {
          await wait((this.connection.rejoinAttempts + 1) * 5_000);
          this.connection.rejoin();
        } else {
          this.connection.destroy();
        }
      } else if (
        !this.readyLock &&
        (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
      ) {
        this.readyLock = true;
        try {
          await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
        } catch {
          if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            try {
              this.connection.destroy();
            } catch {}
          }
        } finally {
          this.readyLock = false;
        }
      }
    });

    this.player.on("stateChange", async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
      if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
        if (this.loop && this.songs.length) {
          this.songs.push(this.songs.shift()!);
        } else {
          this.songs.shift();
          if (!this.songs.length) return this.stop();
        }

        if (this.songs.length || this.resource.audioPlayer) this.processQueue();
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
    if (this.waitTimeout !== null) clearTimeout(this.waitTimeout);
    this.waitTimeout = null;
    this.stopped = false;
    this.songs = this.songs.concat(songs);
    this.processQueue();
  }

  public stop() {
    if (this.stopped) return;

    this.stopped = true;
    this.loop = false;
    this.songs = [];
    this.player.stop();

    !config.PRUNING && this.textChannel.send(i18n.__("play.queueEnded")).catch(console.error);

    if (this.waitTimeout !== null) return;

    this.waitTimeout = setTimeout(() => {
      if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
        try {
          this.connection.destroy();
        } catch {}
      }
      bot.queues.delete(this.interaction.guild!.id);

      !config.PRUNING && this.textChannel.send(i18n.__("play.leaveChannel"));
    }, config.STAY_TIME * 1000);
  }

  /**
   * Processes the song queue for playback. This method checks if the queue is locked or if the player
   * is busy. If not, it proceeds to play the next song in the queue. This method is also responsible
   * for handling playback errors and retrying song playback when necessary. It ensures that the queue
   * continues to play smoothly, handling transitions between songs, including loop and stop behaviors.
   */
  public async processQueue(): Promise<void> {
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

  private async handleSkip(interaction: ButtonInteraction): Promise<void> {
    await this.bot.slashCommandsMap.get("skip")!.execute(interaction);
  }

  private async handlePlayPause(interaction: ButtonInteraction): Promise<void> {
    if (this.player.state.status === AudioPlayerStatus.Playing) {
      await this.bot.slashCommandsMap.get("pause")!.execute(interaction);
    } else {
      await this.bot.slashCommandsMap.get("resume")!.execute(interaction);
    }
  }

  private async handleMute(interaction: ButtonInteraction): Promise<void> {
    if (!canModifyQueue(interaction.member as GuildMember)) return;

    this.muted = !this.muted;

    if (this.muted) {
      this.resource.volume?.setVolumeLogarithmic(0);

      safeReply(interaction, i18n.__mf("play.mutedSong", { author: interaction.user })).catch(console.error);
    } else {
      this.resource.volume?.setVolumeLogarithmic(this.volume / 100);

      safeReply(interaction, i18n.__mf("play.unmutedSong", { author: interaction.user })).catch(console.error);
    }
  }

  private async handleDecreaseVolume(interaction: ButtonInteraction): Promise<void> {
    if (this.volume == 0) return;

    if (!canModifyQueue(interaction.member as GuildMember)) return;

    this.volume = Math.max(this.volume - 10, 0);

    this.resource.volume?.setVolumeLogarithmic(this.volume / 100);

    safeReply(interaction, i18n.__mf("play.decreasedVolume", { author: interaction.user, volume: this.volume })).catch(
      console.error
    );
  }

  private async handleIncreaseVolume(interaction: ButtonInteraction): Promise<void> {
    if (this.volume == 100) return;

    if (!canModifyQueue(interaction.member as GuildMember)) return;

    this.volume = Math.min(this.volume + 10, 100);

    this.resource.volume?.setVolumeLogarithmic(this.volume / 100);

    safeReply(interaction, i18n.__mf("play.increasedVolume", { author: interaction.user, volume: this.volume })).catch(
      console.error
    );
  }

  private async handleLoop(interaction: ButtonInteraction): Promise<void> {
    await this.bot.slashCommandsMap.get("loop")!.execute(interaction);
  }

  private async handleShuffle(interaction: ButtonInteraction): Promise<void> {
    await this.bot.slashCommandsMap.get("shuffle")!.execute(interaction);
  }

  private async handleStop(interaction: ButtonInteraction): Promise<void> {
    await this.bot.slashCommandsMap.get("stop")!.execute(interaction);
  }

  private commandHandlers = new Map([
    ["skip", this.handleSkip],
    ["play_pause", this.handlePlayPause],
    ["mute", this.handleMute],
    ["decrease_volume", this.handleDecreaseVolume],
    ["increase_volume", this.handleIncreaseVolume],
    ["loop", this.handleLoop],
    ["shuffle", this.handleShuffle],
    ["stop", this.handleStop]
  ]);

  private createButtonRow() {
    const firstRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("skip").setLabel("⏭").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("play_pause").setLabel("⏯").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("mute").setLabel("🔇").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("decrease_volume").setLabel("🔉").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("increase_volume").setLabel("🔊").setStyle(ButtonStyle.Secondary)
    );
    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("loop").setLabel("🔁").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("shuffle").setLabel("🔀").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("stop").setLabel("⏹").setStyle(ButtonStyle.Secondary)
    );

    return [firstRow, secondRow];
  }

  /**
   * Sets up a message component collector for the playing message to handle
   * button interactions. This collector listens for button clicks and dispatches
   * commands based on the custom ID of the clicked button. It supports functionalities
   * like skip, stop, play/pause, volume control, and more. The collector is also
   * responsible for stopping itself when the corresponding song is skipped or stopped,
   * ensuring that interactions are only valid for the current playing song.
   */
  private async sendPlayingMessage(newState: AudioPlayerPlayingState) {
    const song = (newState.resource as AudioResource<Song>).metadata;

    let playingMessage: Message;

    try {
      playingMessage = await this.textChannel.send({
        content: song.startMessage(),
        components: this.createButtonRow()
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) this.textChannel.send(error.message);
      return;
    }

    const filter = (i: Interaction) => i.isButton() && i.message.id === playingMessage.id;

    const collector = playingMessage.createMessageComponentCollector({
      filter,
      time: song.duration > 0 ? song.duration * 1000 : 60000
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.isButton()) return;
      if (!this.songs) return;

      const handler = this.commandHandlers.get(interaction.customId);

      if (["skip", "stop"].includes(interaction.customId)) collector.stop();

      if (handler) await handler.call(this, interaction);
    });

    collector.on("end", () => {
      // Remove the buttons when the song ends
      playingMessage.edit({ components: [] }).catch(console.error);

      // Delete the message if pruning is enabled
      if (config.PRUNING) {
        setTimeout(() => {
          playingMessage.delete().catch();
        }, 3000);
      }
    });
  }
}
