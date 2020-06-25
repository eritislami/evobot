const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");

module.exports = {
  name: "prefix",
  cooldown: 3,
  aliases: ["pf"],
  description: "Change the bot\'s prefix",
  async execute(message, args) {
    // if there's at least one argument, set the prefix
    if (args.length) {
      await prefixes.set(message.guild.id, args[0]);
      return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
    }

    return message.channel.send(
      `Prefix is \`${(await prefixes.get(message.guild.id)) || globalPrefix}\``
    );
  }
}