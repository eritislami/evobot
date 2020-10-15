const { canModifyQueue } = require("../util/EvobotUtil");
const { SHUFFLE,ERROR } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "shuffle",
  description: SHUFFLE.description,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(ERROR.no_queue).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(format(SHUFFLE.shuffle,message.author)).catch(console.error);
  }
};
