import { i18n } from "../utils/i18n.js";
import { readdir } from "fs";

export default {
  name: "clips",
  description: i18n.__("clips.description"),
  execute(message) {
    readdir("./sounds", function (err, files) {
      if (err) return console.log("Unable to read directory: " + err);

      let clips = [];

      files.forEach(function (file) {
        clips.push(file.substring(0, file.length - 4));
      });

      message.reply(`${clips.join(" ")}`).catch(console.error);
    });
  }
};
