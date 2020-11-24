const fetch = require("node-fetch");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "trumptweet",
    aliases: ["tt"],
    description: "Sends your message as Donald Trump tweet",
    async execute(message) {
        var split = message.content.substr(message.content.indexOf(" ") + 1);
        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${split}`))
        .catch(console.error);
        const json = await res.json()
        .catch(console.error);

        var a = new MessageEmbed()
            .setImage(json.message)
            .setColor("1A91DA");
        return message.channel.send(a);
    }
};