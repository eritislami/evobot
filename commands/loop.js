const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "repetir",
  aliases: ['l'],
  description: "Muda repetição",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nada estaá tocando.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`Repeticão ${queue.loop ? "**ligada**" : "**desligada**"}`)
      .catch(console.error);
  }
};
