import { Collection } from "discord.js";
import { checkPermissions } from "./checkPermissions.js";
import { i18n } from "./i18n.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cooldowns = new Collection();

export function messageCreate(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases?.includes(commandName));

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
      checkPermissions(command, message);
      command.execute(message, args);
    } catch (error) {
      console.error(error);

      if (error.message.includes("permissions")) {
        message.reply(error.toString()).catch(console.error);
      } else {
        message.reply(i18n.__("common.errorCommand")).catch(console.error);
      }
    }
  });
}
