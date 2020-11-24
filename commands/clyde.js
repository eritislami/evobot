const fetch = require("node-fetch");

module.exports = {
    name: "clyde",
    aliases: ["cl"],
    description: "Sends your message as clyde",
    async execute(message) {
        var split = message.content.substr(message.content.indexOf(" ") + 1);
        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${split}`));
        const json = await res.json();
        return message.channel.send(json.message);
    }
};