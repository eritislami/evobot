import { writeFile } from "fs";
import { readFile } from "fs/promises";
import { i18n } from "../utils/i18n.js";

export default {
  name: "pruning",
  description: i18n.__("pruning.description"),
  async execute(message) {
    let config;

    try {
      config = JSON.parse(await readFile(new URL("../config.json", import.meta.url)));
    } catch (error) {
      config = undefined;
    }

    if (!config) return;

    config.PRUNING = !config.PRUNING;

    writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send(i18n.__("pruning.errorWritingFile")).catch(console.error);
      }

      return message.channel
        .send(
          i18n.__mf("pruning.result", {
            result: config.PRUNING ? i18n.__("common.enabled") : i18n.__("common.disabled")
          })
        )
        .catch(console.error);
    });
  }
};
