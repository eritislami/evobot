import { Client, Collection, Snowflake } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/Command";
import { checkPermissions } from "../utils/checkPermissions";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { MissingPermissionsException } from "../utils/MissingPermissionsException";
import { MusicQueue } from "./MusicQueue";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class Bot {
  public readonly prefix = config.PREFIX;
  public commands = new Collection<string, Command>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();
  public queues = new Collection<Snowflake, MusicQueue>();

  public constructor(public readonly client: Client) {
    this.client.login(config.TOKEN);

    this.client.on("ready", () => {
      console.log(`${this.client.user!.username} ready!`);
      client.user!.setActivity(`${this.prefix}help and ${this.prefix}play`, { type: "LISTENING" });
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.importCommands();
    this.onMessageCreate();
  }

  private async importCommands() {
    const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = await import(join(__dirname, "..", "commands", `${file}`));
      this.commands.set(command.default.name, command.default);
    }
  }

  private async onMessageCreate() {
    this.client.on("messageCreate", async (message: any) => {
      if (message.author.bot || !message.guild) return;

      const prefixRegex = new RegExp(`^(<@!?${this.client.user!.id}>|${escapeRegex(this.prefix)})\\s*`);
      if (!prefixRegex.test(message.content)) return;

      const [, matchedPrefix] = message.content.match(prefixRegex);

      const args: string[] = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      // @ts-ignore
      const command =
        // @ts-ignore
        this.commands.get(commandName!) ?? this.commands.find((cmd) => cmd.aliases?.includes(commandName));

      if (!command) return;

      if (!this.cooldowns.has(command.name)) {
        this.cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps: any = this.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 1) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name }));
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      try {
        const permissionsCheck: any = await checkPermissions(command, message);

        if (permissionsCheck.result) {
          command.execute(message, args);
        } else {
          throw new MissingPermissionsException(permissionsCheck.missing);
        }
      } catch (error: any) {
        console.error(error);

        if (error.message.includes("permissions")) {
          message.reply(error.toString()).catch(console.error);
        } else {
          message.reply(i18n.__("common.errorCommand")).catch(console.error);
        }
      }
    });
  }
}
