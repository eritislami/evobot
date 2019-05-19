const ytdlDiscord = require("ytdl-core-discord")

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id)
    if (!song) {
      queue.channel.leave()
      message.client.queue.delete(message.guild.id)
      return queue.textChannel.send("🚫 Music queue ended.").catch(console.error)
    }

    const options = { filter: "audioonly", quality: "highestaudio" }
    const dispatcher = queue.connection.play(await ytdlDiscord(song.url, options), { type: "opus", passes: 3 })
      .on("end", () => {
        // Recursively play the next song
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      })
      .on("error", error => console.error(error))
    dispatcher.setVolumeLogarithmic(queue.volume / 100)

    let playingMessage = null

    try {
      playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`)
      await playingMessage.react("⏭")
      await playingMessage.react("⏸")
      await playingMessage.react("▶")
      await playingMessage.react("⏹")
    } catch (error) {
      console.error(error)
    }

    const filter = (reaction, user) => user.id !== message.client.user.id
    const collector = playingMessage.createReactionCollector(filter, { time: song.duration * 1000 })

    collector.on("collect", (reaction, user) => {
      // Stop if there is no queue on the server
      if (!queue) return

      switch (reaction.emoji.name) {
        case "⏭":
          queue.connection.dispatcher.end()
          queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error)
          collector.stop()
          playingMessage.reactions.removeAll()
          break;

        case "⏸":
          if (!queue.playing) break;
          queue.playing = false
          queue.connection.dispatcher.pause()
          queue.textChannel.send(`${user} ⏸ paused the music.`).catch(console.error)
          break;

        case "▶":
          if (queue.playing) break;
          queue.playing = true
          queue.connection.dispatcher.resume()
          queue.textChannel.send(`${user} ▶ resumed the music!`).catch(console.error)
          break;

        case "⏹":
          queue.songs = []
          queue.connection.dispatcher.end()
          queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error)
          collector.stop()
          playingMessage.reactions.removeAll()
          break;

        default:
          break;
      }
    })

    collector.on("end", () => {
      playingMessage.reactions.removeAll()
    })
  }
}