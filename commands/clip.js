const i18n = require("../util/i18n");
const fs = require("fs");

module.exports = {
  name: "clip",
  description: i18n.__("clip.description"),
  async execute(message, args) {
    const { channel } = message.member.voice;
    const queue = message.client.queue.get(message.guild.id);

    if (!args.length)
      return message
        .reply(i18n.__mf("clip.usagesReply", { prefix: message.client.prefix }))
        .catch(console.error);
    if (queue) return message.reply(i18n.__("clip.errorQueue"));
    if (!channel) return message.reply(i18n.__("clip.errorNotChannel")).catch(console.error);

    if (args[0].includes(".mp3")) args[0] = args[0].replace(".mp3", "");

    if (!fs.existsSync(`./sounds/${args[0]}.mp3`))
      return message.reply(i18n.__("common.errorCommand")).catch(console.error);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      muted: false,
      playing: true
    };

    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      const dispatcher = queueConstruct.connection
        .play(`./sounds/${args[0]}.mp3`)
        .on("finish", () => {
          message.client.queue.delete(message.guild.id);
          channel.leave();
        })
        .on("error", (err) => {
          message.client.queue.delete(message.guild.id);
          channel.leave();
          console.error(err);
        });
      dispatcher.setVolumeLogarithmic(queueConstruct.volume / 100);

      await queueConstruct.textChannel.send(
        i18n.__mf("play.startedPlaying", { title: `${args[0]}.mp3`, url: "" })
      );
    } catch (error) {
      console.error(error);
    }
  }
};
