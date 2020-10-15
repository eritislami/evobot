const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const { NOWPLAYING,ERROR } = require(`../lang/${require("../config.json").LANGUAGE}.json`);

module.exports = {
  name: "np",
  description: NOWPLAYING.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(ERROR.nothing_playing).catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle(NOWPLAYING.nowPlayingEmbed.title)
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor(NOWPLAYING.nowPlayingEmbed.author)
      .addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? NOWPLAYING.nowPlayingEmbed.live : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );

    if (song.duration > 0)
      nowPlaying.setFooter(NOWPLAYING.nowPlayingEmbed.time_remaining + new Date(left * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
