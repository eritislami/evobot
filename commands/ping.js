module.exports = {
  name: "ping",
  cooldown: 10,
  description: "แสดงค่าปิงของบอท",
  execute(message) {
    message.reply(`📈 Average ping to API: ${Math.round(message.client.ws.ping)} ms`).catch(console.error);
  }
};
