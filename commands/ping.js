module.exports = {
  name: "ping",
  description: "Test the bots response time.",
  execute(message) {
  
    const data = [];
      
    data.push(`Response Time: \`${Date.now() - message.createdTimestamp}\` Millisecond's.`);
    data.push(`Discord Application Programming Interface: \`${Math.round(message.client.ws.ping)}\` Millisecond's.`);

    message.channel.send(data, { split: true });
  },
};
