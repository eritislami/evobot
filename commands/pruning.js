const fs = require("fs");
const { LOCALE } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  description: i18n.__('pruning.description'),
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send(i18n.__("pruning.errorWritingFile")).catch(console.error);
      }

      return message.channel
        .send(
          i18n.__("pruning.result", {
            loop: config.PRUNING ? i18n.__("common.enabled") : i18n.__("common.disabled")
          })
        )
        .catch(console.error);
    });
  }
};
