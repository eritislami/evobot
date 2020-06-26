/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json");
const Keyv = require("keyv");

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const prefixes = new Keyv("sqlite://db.sqlite");
const guildVolumes = new Keyv("sqlite://db.sqlite");
const globalPrefix = PREFIX;

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}help`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  let args;

  if (message.guild) {
    const botTag = `<@!${message.client.user.id}> `;
    let prefix;
    const guildPrefix = await prefixes.get(message.guild.id);
    
    if (message.content.startsWith(botTag)) {
      prefix = botTag; //used only for cmd processing
      message.client.prefix = guildPrefix ? guildPrefix : globalPrefix; //used in commands
    } else if (message.content.startsWith(globalPrefix) && !guildPrefix) {
      prefix = globalPrefix;
      message.client.prefix = globalPrefix;
    } else {
      const guildPrefix = await prefixes.get(message.guild.id);
      if (message.content.startsWith(guildPrefix)) {
      prefix = guildPrefix;
      message.client.prefix = guildPrefix;
      }
    }
    if (!prefix) return;
    args = message.content.slice(prefix.length).split(/\s+/);
  } else {
    const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
    args = message.content.slice(slice).split(/\s+/);
  }

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});
