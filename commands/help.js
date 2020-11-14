const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "List all of my commands or info about a specific command.",
  usage: "[command]",
  execute(message, args, client) {

    const embed = new Discord.MessageEmbed()

    .setColor(`#0x2F3136`)
    .setFooter(`Requested by: ${message.author.tag}`,message.author.displayAvatarURL())
    .setTimestamp();

		const { commands } = message.client;


    if (!args.length) {
      embed.setTitle('Help | Information.')
      embed.setDescription([
        `View help information for ${message.client.user.username}. \n (Do \`${message.client.prefix}help <command>\` for specific help information).`,
        `\`<>\` Means needed and \`()\` it is optional but don't include those.`,
      ].join("\n"));

      embed.addField("Command's:", `${commands.map(command => command.name).join(', ')}`)
      embed.addField('Found an issue?', `Please report to Erit Islami via the [GitHub](https://github.com/eritislami/evobot).`)
      embed.setThumbnail(`${message.client.user.displayAvatarURL({size: 4096})}`)
      return message.channel.send(embed);
    }

    const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${message.client.prefix}help\` for the list of the commands.`).setColor(`#0x2F3136`));
    
    embed.setTitle(`${command.name} | Help Information.`)
    embed.setDescription([
      `❯ Description: ${command.description || "No Description provided."}\n`,
			`**❯ Usage:** ${command.usage ? `\`${message.client.prefix}${command.name} ${command.usage}\`` : "No Usage."}`,
      `**❯ Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`,
      `**❯ Cooldown:** ${command.cooldown ? `\`${command.cooldown} Second's\`` : "No cooldown."}`
		].join("\n"));

		return message.channel.send(embed);
  },
};
