import { i18n } from "../utils/i18n";
import { readdir } from "fs";
import { Message } from "discord.js";

export default {
  name: "clips",
  description: i18n.__("clips.description"),
  execute(message: Message) {
    readdir("./sounds", function (err, files) {
      if (err) return console.log("Unable to read directory: " + err);

      let clips: string[] = [];

      files.forEach(function (file) {
        clips.push(file.substring(0, file.length - 4));
      });

      message.reply(`${clips.join(" ")}`).catch(console.error);
    });
  }
};
