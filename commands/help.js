const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("Evobot Help")
      .setDescription(`Music Commands:

**%play**  Plays a song with the given name or url. 

**%np**  Shows what song the bot is currently playing.

**%aliases**  List command aliases.

**%pause**  Pauses the currently playing track.

**%resume**  Resume paused music.

**%stop**  Stop the current song and clears the entire music queue.

**%skip**  Skips the currently playing song.

**%skipto** Skip to the selected queue number.

**%queue**  Display the queue of the current tracks in the playlist.

**%vol** Changes/Shows the current volume.

**%loop** Toggle music loop.

**%lyrics** Get lyrics for the currently playing song.

**%playlist** Play a playlist from YouTube.

**%pruning** Toggle pruning of bot message.

**%remove** Remove song from the queue.

**%search** Search and select videos to play.

**%shuffle** Shuffle queue.

Info Commands:

**%user**

**%info**

**%avatar**

**%server avatar**

**%ping**

Normal Commands:

**%invite**

**%support**

**%vote**`)
      .setColor("#F8AA2A");


      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
