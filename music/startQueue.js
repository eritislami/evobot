import {
  AudioPlayerStatus,
  createAudioPlayer,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionDisconnectReason,
  VoiceConnectionStatus
} from "@discordjs/voice";
import { promisify } from "node:util";
import { processQueue } from "./processQueue.js";
import { i18n } from "../utils/i18n.js";

const wait = promisify(setTimeout);

export async function startQueue({ message, channel }) {
  const queue = message.client.queue.get(message.guild.id);

  queue.connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  try {
    await entersState(queue.connection, VoiceConnectionStatus.Ready, 30e3);
  } catch (error) {
    console.error(error);

    getVoiceConnection(channel.guild.id)?.destroy();
    message.client.queue.delete(message.guild.id);

    return message.reply(i18n.__mf("play.cantJoinChannel", { error }));
  }

  queue.connection.on("error", console.warn);

  queue.connection.on("stateChange", async (oldState, newState) => {
    if (newState.status === VoiceConnectionStatus.Disconnected) {
      if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
        try {
          await entersState(queue.connection, VoiceConnectionStatus.Connecting, 5_000);
        } catch {
          queue.connection.destroy();
        }
      } else if (queue.connection.rejoinAttempts < 5) {
        await wait((queue.connection.rejoinAttempts + 1) * 5_000);
        queue.connection.rejoin();
      } else {
        queue.connection.destroy();
      }
    } else if (newState.status === VoiceConnectionStatus.Destroyed) {
      /**
       * Once destroyed, stop the subscription.
       */
      queue.loop = false;
      queue.songs = [];
      queue.player.stop();
    } else if (
      !queue.readyLock &&
      (newState.status === VoiceConnectionStatus.Connecting ||
        newState.status === VoiceConnectionStatus.Signalling)
    ) {
      queue.readyLock = true;

      try {
        await entersState(queue.connection, VoiceConnectionStatus.Ready, 20_000);
      } catch {
        if (queue.connection.state.status !== VoiceConnectionStatus.Destroyed) queue.connection.destroy();
      } finally {
        queue.readyLock = false;
      }
    }
  });

  queue.player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause
    }
  });

  queue.player.on("error", (err) => {
    console.error(err);
    queue.songs.shift();
    processQueue(queue.songs[0], message);
  });

  queue.player.on("stateChange", async (oldState, newState) => {
    /**
     * Song ends
     */
    if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
      if (!queue.collector?.ended) queue.collector.stop();

      if (
        queue.processing ||
        queue.player.state.status !== AudioPlayerStatus.Idle ||
        queue.songs.length === 0
      ) {
        return;
      }

      queue.processing = true;

      if (queue.loop && queue.songs.length > 0) {
        let lastSong = queue.songs.shift();
        queue.songs.push(lastSong);
        queue.processing = false;
        processQueue(queue.songs[0], message);
      } else {
        queue.songs.shift();
        queue.processing = false;
        processQueue(queue.songs[0], message);
      }
    }
  });

  queue.connection.subscribe(queue.player);

  processQueue(queue.songs[0], message);
}
