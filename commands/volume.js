const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Muda o volume da música atual",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Não tem nada tocando.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Voceê precisa entrar em um canal de voz primeiro!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 Volume atual: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Por favor use somente números.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Por favor use números entre 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Volume alterado para: **${args[0]}%**`).catch(console.error);
  }
};
