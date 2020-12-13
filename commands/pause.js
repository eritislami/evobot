const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "สำหรับหยุดเพลงชั่วคราว",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("ไม่มีเพลงที่กำลังเล่นในขณะนี้").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ หยุดเพลงชั่วคราว`).catch(console.error);
    }
  }
};
