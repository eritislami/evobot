const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
<<<<<<< HEAD
const scdl = require("soundcloud-downloader");
const ytdl = require("ytdl-core");
const scdl = require("soundcloud-downloader").default;
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE } = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
=======
const scdl = require("soundcloud-downloader").default;

const {
  YOUTUBE_API_KEY,
  SOUNDCLOUD_CLIENT_ID,
  MAX_PLAYLIST_SIZE,
  DEFAULT_VOLUME,
  LOCALE
} = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const i18n = require("i18n");

i18n.setLocale(LOCALE);
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1

module.exports = {
  name: "playlist",
  cooldown: 5,
  aliases: ["pl"],
<<<<<<< HEAD
  description: "Play a playlist from youtube",
=======
  description: i18n.__("playlist.description"),
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
  async execute(message, args) {
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!args.length)
      return message
<<<<<<< HEAD
        .reply(`Usage: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
        .catch(console.error);
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Cannot connect to voice channel, missing permissions");
    if (!permissions.has("SPEAK"))
      return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!");

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);
=======
        .reply(i18n.__mf("playlist.usageReply", { prefix: message.client.prefix }))
        .catch(console.error);
    if (!channel) return message.reply(i18n.__("playlist.errorNotChannel")).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.reply(i18n.__("playlist.missingPermissionConnect"));
    if (!permissions.has("SPEAK")) return message.reply(i18n.__("missingPermissionSpeak"));

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user }))
        .catch(console.error);
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);
<<<<<<< HEAD
    const spotifyPattern = /^.*(https:\/\/open\.spotify\.com)([^#\&\?]*).*/gi;
    const spotifyValid = spotifyPattern.test(args[0]);
=======

>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
<<<<<<< HEAD
      volume: 100,
=======
      volume: DEFAULT_VOLUME || 100,
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
      playing: true
    };

    let playlist = null;
    let videos = [];
<<<<<<< HEAD
=======

>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
<<<<<<< HEAD
        return message.reply("Playlist not found :(").catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send("⌛ fetching the playlist...");
=======
        return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send(i18n.__("playlist.fetchingPlaylist"));
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
<<<<<<< HEAD
    }
    else if(spotifyValid) {
      const msg = await message.channel.send("⚙️ [0/10] Converting Spotify Playlist into Youtube Playlist");
        const linkPattern = /.*?\?/gi;
        let spotifyLink = url.split("/");
        spotifyLink = spotifyLink[spotifyLink.length-1].match(linkPattern)[0].slice(0, -1);
        try {
          let BasePlaylist = await message.client.spotify.getPlaylistInfo(spotifyLink);
          playlist = {
            title: BasePlaylist.title,
            url: args[0]
          };
          for(let i in BasePlaylist.tracks) {
            msg.edit(`⚙️ [${i + 1}/10] Converting Spotify Playlist into Youtube Playlist`)
            try {
            const results = await youtube.searchVideos(`${BasePlaylist.tracks[i].track.artists[0].name} - ${BasePlaylist.tracks[i].track.name}`, 1);
            songInfo = await ytdl.getInfo(results[0].url);
            } catch (error) {
              console.error(error);
              return message.reply(error.message).catch(console.error);
            }
            song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url,
              duration: songInfo.videoDetails.lengthSeconds
            };
            videos.push(song);
          };
        } catch(error){
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
        msg.delete()
      }
    else {
=======
    } else {
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }
<<<<<<< HEAD
    const newSongs = videos.map((video) => {
      return (song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      });
    });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
    const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
=======

    const newSongs = videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .map((video) => {
        return (song = {
          title: video.title,
          url: video.url,
          duration: video.durationSeconds
        });
      });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
<<<<<<< HEAD
        playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

    message.channel.send(`${message.author} Started a playlist`, playlistEmbed);
=======
        playlistEmbed.description.substr(0, 2007) + i18n.__("playlist.playlistCharLimit");

    message.channel.send(i18n.__mf("playlist.startedPlaylist", { author: message.author }), playlistEmbed);
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);

      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
<<<<<<< HEAD
        return message.channel.send(`Could not join the channel: ${error.message}`).catch(console.error);
      }
    }
  }
};
=======
        return message.channel.send(i18n.__("play.cantJoinChannel", { error: error })).catch(console.error);
      }
    }
  }
};
>>>>>>> 9b37eea244e7dfeceede23fd934e8f239be3fde1
