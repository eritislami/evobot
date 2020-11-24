const {MessageEmbed} = require("discord.js");
const {TENOR_API_KEY} = require("../config.json");
const fetch = require("node-fetch");

module.exports = {
    name: "gif",
    cooldown: 2,
    aliases: ["tenor", "g"],
    description: "Gets gif from Tenor Gif Keyboard",
    execute(message) {
        if (!message.content.split(" ")[1]) {
            return message.channel.send("Usage: /gif [your search query]");
        }
        fetch(`https://api.tenor.com/v1/random?key=${TENOR_API_KEY}&q=${message.content.split(" ")[1]}&limit=1`)
        .then(res => res.json())
        .then(json => {
            return message.channel.send(json.results[0].url).catch(console.error);
        })
        .catch(e => {
            var a = new MessageEmbed()
                .setTitle("Error!")
                .setDescription("Failed to find gif that matched your query")
                .setColor("ff0000");
            return message.channel.send(a).catch(console.error);
        });
    }
}