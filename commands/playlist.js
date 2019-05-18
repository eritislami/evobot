const { YOUTUBE_API_KEY } = require("../config.json")
const ytdlDiscord = require("ytdl-core-discord")
const YouTubeAPI = require("simple-youtube-api")
const youtube = new YouTubeAPI(YOUTUBE_API_KEY)

module.exports = {
  name: "playlist",
  description: "Play a playlist from youtube",
  async execute(message, args) {
    const { channel } = message.member.voice

    if (!args.length) return message.reply("Usage: /playlist <YouTube Playlist URL | Playlist Name>").catch(console.error)
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error)

    const permissions = channel.permissionsFor(message.client.user)
    if (!permissions.has("CONNECT")) return message.reply("Cannot connect to voice channel, missing permissions")
    if (!permissions.has("SPEAK")) return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!")

    const search = args.join(" ")
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/ig;
    const url = args[0]
    const urlValid = pattern.test(args[0])

    const serverQueue = message.client.queue.get(message.guild.id)
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      volume: 100,
      playing: true
    }

    let song = null
    let playlist = null
    let videos = []

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" })
        videos = await playlist.getVideos(undefined, { part: "snippet" })
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" })
        playlist = results[0]
        videos = await playlist.getVideos(undefined, { part: "snippet" })
      } catch (error) {
        console.error(error)
      }
    }

    videos.forEach((video, index) => {
      song = {
        index: index + 1,
        title: video.title,
        url: video.url
      }

      if (serverQueue) {
        serverQueue.songs.push(song)
        message.channel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`).catch(console.error)
      } else {
        queueConstruct.songs.push(song)
      }
    })

    message.channel.send(`${message.author} 📃 Added a playlist - **${playlist.title}** <${playlist.url}>

${queueConstruct.songs.map(song => song.index + ". " + song.title).join("\n")}
    `, { split: true }).catch(console.error)

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct)

    const play = async song => {
      const queue = message.client.queue.get(message.guild.id)
      if (!song) {
        queue.channel.leave()
        message.client.queue.delete(message.guild.id)
        return queue.textChannel.send("🚫 Music queue ended.").catch(console.error)
      }

      const options = { filter: "audioonly", quality: "highestaudio" }
      const dispatcher = queue.connection.play(await ytdlDiscord(song.url, options), { type: "opus", passes: 3 })
        .on("end", () => {
          queue.songs.shift()
          play(queue.songs[0])
        })
        .on("error", error => console.log(error))
      dispatcher.setVolumeLogarithmic(queue.volume / 100)
      queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`).catch(console.error)
    }

    if (!serverQueue) {
      try {
        const connection = await channel.join()
        queueConstruct.connection = connection
        play(queueConstruct.songs[0])
      } catch (error) {
        console.error(`Could not join voice channel: ${error}`)
        message.client.queue.delete(message.guild.id)
        await channel.leave()
        return message.channel.send(`Could not join the channel: ${error}`).catch(console.error)
      }
    }
  }
}
