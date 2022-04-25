const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const { canModifyQueue, STAY_TIME } = require("../util/Util");
const i18n = require("../util/i18n");
const { createAudioResource, StreamType, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  async play(song, message, silent = false) {
    const { SOUNDCLOUD_CLIENT_ID } = require("../util/Util");

    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      setTimeout(function () {
        // if (message.guild.me.voice.channel) return;
        queue.connection.destroy();
        !PRUNING && queue.textChannel.send(i18n.__("play.leaveChannel"));
      }, STAY_TIME * 1000);

      !PRUNING && queue.textChannel.send(i18n.__("play.queueEnded")).catch(console.error);

      return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    const streamType = song.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(
        i18n.__mf("play.queueError", { error: error.message ? error.message : error })
      );
    }

    queue.resource = createAudioResource(stream, { inputType: streamType, inlineVolume: true });
    queue.resource.volume?.setVolumeLogarithmic(queue.volume / 100);

    queue.player.play(queue.resource);

    queue.player.on("error", (err) => {
      console.error(err);
      queue.songs.shift();
      module.exports.play(queue.songs[0], message);
    });

    queue.player.on(AudioPlayerStatus.Idle, () => {
      if (collector && !collector.ended) collector.stop();

      if (queue.loop && queue.songs.length > 0) {
        let lastSong = queue.songs.shift();
        queue.songs.push(lastSong);
        module.exports.play(queue.songs[0], message, queue.songs[0].url == lastSong.url);
      } else {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }
    });

    queue.connection.subscribe(queue.player);

    if (!silent) {
      try {
        var playingMessage = await queue.textChannel.send(
          i18n.__mf("play.startedPlaying", { title: song.title, url: song.url })
        );
        await playingMessage.react("⏭");
        await playingMessage.react("⏯");
        await playingMessage.react("🔇");
        await playingMessage.react("🔉");
        await playingMessage.react("🔊");
        await playingMessage.react("🔁");
        await playingMessage.react("🔀");
        await playingMessage.react("⏹");
      } catch (error) {
        console.error(error);
      }

      const filter = (reaction, user) => user.id !== message.client.user.id;

      var collector = playingMessage.createReactionCollector({
        filter,
        time: song.duration > 0 ? song.duration * 1000 : 600000
      });

      collector.on("collect", async (reaction, user) => {
        if (!queue) return;
        const member = await message.guild.members.fetch(user);

        switch (reaction.emoji.name) {
          case "⏭":
            queue.playing = true;
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.player.stop();
            queue.textChannel.send(i18n.__mf("play.skipSong", { author: user })).catch(console.error);
            collector.stop();
            break;

          case "⏯":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            if (queue.playing) {
              queue.playing = !queue.playing;
              queue.player.pause();
              queue.textChannel.send(i18n.__mf("play.pauseSong", { author: user })).catch(console.error);
            } else {
              queue.playing = !queue.playing;
              queue.player.unpause();
              queue.textChannel.send(i18n.__mf("play.resumeSong", { author: user })).catch(console.error);
            }
            break;

          case "🔇":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.muted = !queue.muted;
            if (queue.muted) {
              queue.resource.volume.setVolumeLogarithmic(0);
              queue.textChannel.send(i18n.__mf("play.mutedSong", { author: user })).catch(console.error);
            } else {
              queue.resource.volume.setVolumeLogarithmic(queue.volume / 100);
              queue.textChannel.send(i18n.__mf("play.unmutedSong", { author: user })).catch(console.error);
            }
            break;

          case "🔉":
            reaction.users.remove(user).catch(console.error);
            if (queue.volume == 0) return;
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.volume = Math.max(queue.volume - 10, 0);
            queue.resource.volume.setVolumeLogarithmic(queue.volume / 100);
            queue.textChannel
              .send(i18n.__mf("play.decreasedVolume", { author: user, volume: queue.volume }))
              .catch(console.error);
            break;

          case "🔊":
            reaction.users.remove(user).catch(console.error);
            if (queue.volume == 100) return;
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.volume = Math.min(queue.volume + 10, 100);
            queue.resource.volume.setVolumeLogarithmic(queue.volume / 100);
            queue.textChannel
              .send(i18n.__mf("play.increasedVolume", { author: user, volume: queue.volume }))
              .catch(console.error);
            break;

          case "🔁":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.loop = !queue.loop;
            queue.textChannel
              .send(
                i18n.__mf("play.loopSong", {
                  author: user,
                  loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off")
                })
              )
              .catch(console.error);
            break;

          case "🔀":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");

            let songs = queue.songs;
            for (let i = songs.length - 1; i > 1; i--) {
              let j = 1 + Math.floor(Math.random() * i);
              [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            queue.songs = songs;

            queue.textChannel.send(i18n.__mf("shuffle.result", { author: user })).catch(console.error);
            break;

          case "⏹":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member, queue)) return i18n.__("common.errorNotChannel");
            queue.songs = [];
            queue.textChannel.send(i18n.__mf("play.stopSong", { author: user })).catch(console.error);
            if (!queue.player.stop()) queue.connection.destroy();
            collector.stop();
            break;

          default:
            reaction.users.remove(user).catch(console.error);
            break;
        }
      });

      collector.on("end", () => {
        playingMessage.reactions.removeAll().catch(console.error);
        if (PRUNING && playingMessage && !playingMessage.deleted) {
          setTimeout(() => {
            playingMessage.delete().catch(console.error);
          }, 3000);
        }
      });
    }
  }
};
