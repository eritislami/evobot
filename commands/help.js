const { prefix } = require("../config/config.json");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: "commands",
  usage: "[command name]",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(commands.map((command) => command.name).join(", "));
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

      return message.channel.send(data, { split: true });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) { return message.reply("that's not a valid command!");}

    data.push(`❯ **Name:** ${command.name}`);
    data.push(`❯ **Description:** ${command.description || "No Description provided."}`);
    data.push(`❯ **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`);
    data.push(`❯ **Usage:** ${command.usage? `\`${prefix}${command.name} ${command.usage}\``: "No Usage"}`);
    data.push(`❯ **Cooldown:** ${command.cooldown ? `\`${command.cooldown} Second's\`` : "No cooldown."}`
    );

    message.channel.send(data, { split: true });
  },
};
