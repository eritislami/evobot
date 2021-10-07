/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, STAY_TIME } = require("./util/Util");
const i18n = require("./util/i18n");

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
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

let channelsToPrune = [];

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (newVoiceState.channel) {
    if (newVoiceState.channel.members.size > 1) {
      channelsToPrune = channelsToPrune.filter((v) => v.who != newVoiceState.guild.id);
    }
  }
  if (oldVoiceState.channel && !newVoiceState.channel) {
    if (oldVoiceState.channel.members.size === 1) {
      channelsToPrune.push({
        who: oldVoiceState.guild.id,
        when: new Date().valueOf() + STAY_TIME * 1000
      });
    }
  }
});

setInterval(() => {
  channelsToPrune.forEach(({ who, when }, i) => {
    if (new Date().valueOf() > when) {
      const connection = client.queue.get(who);
      connection.textChannel.send(i18n.__("play.leaveEmptyChannel"));
      connection.connection.disconnect();
      channelsToPrune[i].deleted = true;
    }
  });

  channelsToPrune = channelsToPrune.filter((v) => !v.deleted);
}, 1000);

// /* Check if someone still on voice channel */
// setInterval(() => {
//   if (client.queue.size > 0) {
//     client.queue.forEach((value, key) => {
//       const membersManager = value.channel.guild.members.cache;
//       console.log(`Hay ${membersManager.size - 1} personas escuchando`);
//     });
//   }
// }, 1 * 1000);

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
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
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommand")).catch(console.error);
  }
});
