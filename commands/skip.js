const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "ข้ามเพลงที่กำลังเล่นอยู่",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("ไม่มีอะไรเล่นที่ฉันจะข้ามไปให้คุณได้").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ข้ามเพลง`).catch(console.error);
  }
};
