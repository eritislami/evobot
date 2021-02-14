const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const ytsr = require('ytsr');
const { getTracks } = require('spotify-url-info');
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

module.exports = {
  name: "playlist",
  cooldown: 5,
  aliases: ["pl"],
  description: i18n.__("playlist.description"),
  async execute(message, args) {
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!args.length)
      return message
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

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0]);
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    let newSongs = null;
    let playlist = null;
    let videos = [];
    let waitMessage = null;

    if (spotifyPlaylistValid) {
      try {
        waitMessage = await message.channel.send('fetching playlist...')
        let playlistTrack = await getTracks(url);
        if (playlistTrack > MAX_PLAYLIST_SIZE) {
          playlistTrack.length = MAX_PLAYLIST_SIZE
        }
        const spotfiyPl = await Promise.all(playlistTrack.map(async (track) => {
          let result;
          const ytsrResult = await ytsr((`${track.name} - ${track.artists ? track.artists[0].name : ''}`), { limit: 1 });
          result = ytsrResult.items[0];
          return (song = {
            title: result.title,
            url: result.url,
            duration: result.duration ? this.convert(result.duration) : undefined,
            thumbnail: result.thumbnails ? result.thumbnails[0].url : undefined
          });
        }));
        const result = await Promise.all(spotfiyPl.filter((song) => song.title != undefined || song.duration != undefined));
        videos = result;
      } catch (err) {
        console.log(err);
        return message.channel.send(err ? err.message : 'There was an error!');
      }
    } else if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send(i18n.__("playlist.fetchingPlaylist"));
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    newSongs = videos
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
      .setTitle(`${playlist ? playlist.title : 'Spotify Playlist'}`)
      .setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
      .setURL(playlist ? playlist.url : 'https://www.spotify.com/')
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + i18n.__("playlist.playlistCharLimit");

    waitMessage ? waitMessage.delete() : null
    message.channel.send(i18n.__mf("playlist.startedPlaylist", { author: message.author }), playlistEmbed);

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
        return message.channel.send(i18n.__("play.cantJoinChannel", { error: error })).catch(console.error);
      }
    }
  },
  convert(second) {
    const a = second.split(':');
    let rre
    if (a.length == 2) {
      rre = (+a[0]) * 60 + (+a[1])
    } else {
      rre = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
    }

    return rre;
  }
};