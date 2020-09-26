const fs = require("fs");
const config = require("../config.json");
const { PRUNING } = require(`../lang/${require("../config.json").LANGUAGE}.json`);
const {format} = require('util');

module.exports = {
  name: "pruning",
  description: PRUNING.description,
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send(PRUNING.error_writing).catch(console.error);
      }

      return message.channel
        .send(format(PRUNING.message_enable_disable, config.PRUNING ? PRUNING.enabled:PRUNING.disabled))
        .catch(console.error);
    });
  }
};
