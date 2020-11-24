const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");
const { MEME_SUBREDDITS } = require("../config.json");

module.exports = {
    name: "reddit",
    cooldown: 2,
    aliases: ["red", "meme"],
    description: "Gets random meme from reddit",
    execute(message, args) {
        var random = MEME_SUBREDDITS[Math.floor(Math.random() * MEME_SUBREDDITS.length)];
        randomPuppy(random).then(img => {
            var embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Random meme")
            .setFooter(`Downloaded from: r/${random} subreddit`)
            .setImage(img)
            .setDescription("URL to image: " + img)
        return message.channel.send(embed);
        });
    }
}