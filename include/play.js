  const ytdl = require("ytdl-core-discord");
  const scdl = require("soundcloud-downloader").default;
  const { canModifyQueue, STAY_TIME, LOCALE } = require("../util/EvobotUtil");
  const i18n = require("i18n");
  i18n.setLocale(LOCALE);

  module.exports = {
    async play(song, message) {
      const { SOUNDCLOUD_CLIENT_ID } = require("../util/EvobotUtil");

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
          if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
          queue.channel.leave();
          queue.textChannel.send(i18n.__("play.leaveChannel"));
        }, STAY_TIME * 1000);
        queue.textChannel.send(i18n.__("play.queueEnded")).catch(console.error);
        return message.client.queue.delete(message.guild.id);
      }

      let stream = null;
      let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

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

      queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

      const dispatcher = queue.connection
        .play(stream, { type: streamType })
        .on("finish", () => {
          if (collector && !collector.ended) collector.stop();

          if (queue.loop) {
            // if loop is on, push the song back at the end of the queue
            // so it can repeat endlessly
            let lastSong = queue.songs.shift();
            queue.songs.push(lastSong);
            module.exports.play(queue.songs[0], message);
          } else {
            // Recursively play the next song
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
          }
        })
        .on("error", (err) => {
          console.error(err);
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        });
      dispatcher.setVolumeLogarithmic(queue.volume / 100);

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
        await playingMessage.react("⏹");
      } catch (error) {
        console.error(error);
      }

      const filter = (reaction, user) => user.id !== message.client.user.id;
      var collector = playingMessage.createReactionCollector(filter, {
        time: song.duration > 0 ? song.duration * 1000 : 600000
      });

      collector.on("collect", (reaction, user) => {
        if (!queue) return;
        const member = message.guild.member(user);

        switch (reaction.emoji.name) {
          case "⏭":
            queue.playing = true;
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
            queue.connection.dispatcher.end();
            queue.textChannel.send(i18n.__mf("play.skipSong", { author: user })).catch(console.error);
            collector.stop();
            break;

          case "⏯":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
            if (queue.playing) {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.pause(true);
              queue.textChannel.send(i18n.__mf("play.pauseSong", { author: user })).catch(console.error);
            } else {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.resume();
              queue.textChannel.send(i18n.__mf("play.resumeSong", { author: user })).catch(console.error);
            }
            break;

          case "🔇":
            reaction.users.remove(user).catch(console.error);
            if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
            if (queue.volume <= 0) {
              queue.volume = 100;
              queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
              queue.textChannel.send(i18n.__mf("play.unmutedSong", { author: user })).catch(console.error);
            } else {
              queue.volume = 0;
              queue.connection.dispatcher.setVolumeLogarithmic(0);
              queue.textChannel.send(i18n.__mf("play.mutedSong", { author: user })).catch(console.error);
            }
            break;

          case "🔉":
            reaction.users.remove(user).catch(console.error);
            if (queue.volume == 0) return;
            if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
      switch (reaction.emoji.name) {
        
        case "📄":
          reaction.users.remove(user).catch(console.error);
          if (!queue) return message.channel.send("暫時沒有播放中的歌曲！").catch(console.error);
          let lyrics = null;

          try {
            lyrics = lyricsFinder(queue.songs[0].title);
            if (!lyrics) lyrics = `沒有找到 ${queue.songs[0].title} 的歌詞！`;
          } catch (error) {
            lyrics = `沒有找到 ${queue.songs[0].title} 的歌詞.`;
          }

          let lyricsEmbed = new MessageEmbed()
            .setTitle("目前播放中歌曲的歌詞")
            .setDescription(lyrics)
            .setColor("#F8AA2A")
            .setTimestamp();

          if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
          return message.channel.send(lyricsEmbed).catch(console.error);
          break;

        case "❓":
          reaction.users.remove(user).catch(console.error);
          const song = queue.songs[0];
          const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
          const left = song.duration - seek;

          let nowPlaying = new MessageEmbed()
            .setTitle("正在播放的歌曲")
            .setDescription(`${song.title}\n${song.url}`)
            .setColor("#87cefa")
            .setAuthor(message.client.user.username);

          if (song.duration > 0) {
            nowPlaying.addField(
              "\u200b",
              new Date(seek * 1000).toISOString().substr(11, 8) +
              "[" +
              createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
              "]" +
              (song.duration == 0 ? " ◉ 直播" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
              false
            );
            nowPlaying.setFooter("剩餘: " + new Date(left * 1000).toISOString().substr(11, 8));
          }

          return message.channel.send(nowPlaying);
          break;

        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`⏩ ${user}跳過音樂！`).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(`⏸ ${user}暫停音樂！`).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`▶ ${user}重新開始音樂！`).catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(`🔊 ${user} 解除靜音音樂！`).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(`🔇 ${user}靜音音樂！`).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(`🔉 ${user} 降低音樂音量！目前音量：${queue.volume}%`)
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(`🔊 ${user} 增加音樂音量！目前音量：${queue.volume}%`)
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(`🔁 ${user} ${queue.loop ? "**開啓**" : "**關閉**"}了循環播放！`).catch(console.error);
          break;

        case "🔀":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          let songs = queue.songs;
          for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
          }
          queue.songs = songs;
          message.client.queue.set(message.guild.id, queue);
          queue.textChannel.send(`${message.author} 🔀 將播放列表設爲隨機播放了！`).catch(console.error);
          break;

        case "⏹":
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(`⏹ ${user}停止了音樂！`).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
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
          playingMessage.delete({ timeout: 3000 }).catch(console.error);
        }
      });
    }
  };
