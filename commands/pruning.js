const fs = require("fs");
let config;
const { MessageEmbed } = require('discord.js');

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  description: "Toggle pruning of bot messages",
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        
        
      const pruneErr = new MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Error!')
      .setDescription('There was an error writing to the file')
        
        return message.channel.send(pruneErr).catch(console.error);
      }
      
      const pruneMsg = new MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Prune')
      .setDescription(`Message pruning is ${config.PRUNING ? "**enabled**" : "**disabled**"}`)
      
      return message.channel
        .send(pruneMsg)
        .catch(console.error);
    });
  }
};
