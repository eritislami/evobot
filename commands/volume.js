const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "เปลี่ยนระดับเสียงของเพลงที่กำลังเล่นอยู่",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("ไม่มีเพลงที่กำลังเล่นในขณะนี้").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("คุณต้องเข้าร่วมช่องสนทนาเสียงก่อน!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 ระดับเสียงปัจจุบันคือ: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("โปรดใช้ตัวเลขเพื่อตั้งระดับเสียง").catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0 )
      return message.reply("โปรดใช้ตัวเลขระหว่าง 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`ตั้งค่าระดับเสียงเป็น: **${args[0]}%**`).catch(console.error);
  }
};
