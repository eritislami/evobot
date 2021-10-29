const i18n = require("../util/i18n");
const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const spotifyToYt = require("spotify-to-yt");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE, DEFAULT_VOLUME } = require("../util/Util");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

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
        .reply(i18n.__mf("playlist.usagesReply", { prefix: message.client.prefix }))
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
    const spotifyRegex = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/gm;
    const url = args[0];
    const urlValid = pattern.test(args[0]);
    const spotifyUrlValid = spotifyRegex.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME,
      muted: false,
      playing: true
    };

    let playlist = null;
    let videos = [];

    if (urlValid) {
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
    } else if (spotifyUrlValid) {
      message.channel.send(i18n.__("playlist.convertingSpotifyPlaylist"));
      try {
        let convertedSongs = await spotifyToYt.playListGet(url)

        //Set the playlist attributes
        playlist = {
          title: convertedSongs.info.name,
          url: convertedSongs.info.external_urls.spotify,
        };
        //Get the details of the videos in youtube
        var convertedSongsYTDetails = new Array();
        for (let i = 0; i < convertedSongs.songs.length; i++) {
          convertedSongsYT = await ytdl.getInfo(convertedSongs.songs[i])
          convertedSongsYTDetails[i] = convertedSongsYT.videoDetails
        }
        //Set the details of the songs
        videos = convertedSongsYTDetails.map((videoDetails) => ({
          title: videoDetails.title,
          url: videoDetails.video_url,
          duration: videoDetails.lengthSeconds
        }));

      } catch (error) {
        console.error(error);
        return message.reply(i18n.__("playlist.errorNotFoundPlaylist")).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "id" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

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
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + i18n.__("playlist.playlistCharLimit");

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
        return message.channel.send(i18n.__mf("play.cantJoinChannel", { error: error })).catch(console.error);
      }
    }
  }
};
