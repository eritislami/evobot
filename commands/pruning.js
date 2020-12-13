const fs = require("fs");
let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  description: "สลับการตัดข้อความบอท",
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("เกิดข้อผิดพลาดในการเขียนไฟล์").catch(console.error);
      }

      return message.channel
        .send(`การตัดแต่งข้อความ ${config.PRUNING ? "**enabled**" : "**disabled**"}`)
        .catch(console.error);
    });
  }
};
