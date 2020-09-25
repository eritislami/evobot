const { MessageEmbed } = require("discord.js");
const { HELP } = require(`../lang/${require("../config.json").LANGUAGE}.json`);



module.exports = {
  name: "help",
  aliases: ["h"],
  description: HELP.description,
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle(HELP.helpEmbed.title)
      .setDescription(HELP.helpEmbed.description)
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
