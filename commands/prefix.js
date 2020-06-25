const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");

module.exports = {
  name: "prefix",
  cooldown: 3,
  aliases: ["pf"],
  description: "Change the bot\'s prefix",
  async execute(message, args) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(`You need to be an administrator to do this ${message.author}`)
    }
    if (args.length) {
      // if there's at least one argument, set the prefix
      await prefixes.set(message.guild.id, args[0]);
      return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
    }

    return message.channel.send(
      `Prefix is \`${(await prefixes.get(message.guild.id)) || globalPrefix}\``
    );
  }
}