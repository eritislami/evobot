import { Message } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

export default {
  name: "uptime",
  aliases: ["up"],
  description: i18n.__("uptime.description"),
  execute(message: Message) {
    let seconds = Math.floor(bot.client.uptime! / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return message
      .reply(i18n.__mf("uptime.result", { days: days, hours: hours, minutes: minutes, seconds: seconds }))
      .catch(console.error);
  }
};
