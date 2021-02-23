const editPlaylist = require("../models/playlistSchema");
const ytdl = require("ytdl-core");
const i18n = require("i18n");
const { LOCALE } = require("../util/EvobotUtil");
i18n.setLocale(LOCALE);
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "playlist-edit",
  cooldown: 5,
  aliases: ["pl-edit", "pl-e"],
  description: i18n.__("playlist-edit.description"),
  async execute(message, args) {
    const pName = args.join(" ");
    if (!pName) {
      return message.channel.send(i18n.__("playlist-save.noPlaylistName"));
    }

    let fetchList;
    let songInfo;
    let song;

    fetchList = await editPlaylist.findOne({
      userID: message.author.id,
      playlistName: pName
    });

    if (!fetchList) {
      return message.channel.send(i18n.__("playlist-delete.noPlaylistFound"));
    }
    let embed = new MessageEmbed();

    embed
      .setTitle("Please choose what you want to edit")
      .setDescription(
        "🎵 Add a song to playlist\n🗑️ Remove a song from playlist\n🏷️ Rename a playlist\n❌ Cancel"
      );

    const editEmbed = await message.channel.send(embed);
    try {
      await editEmbed.react("🎵");
      await editEmbed.react("🗑️");
      await editEmbed.react("🏷️");
      await editEmbed.react("❌");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) => ["🎵", "🗑️", "🏷️", "❌"].includes(reaction.emoji.name);
    const collector = editEmbed.createReactionCollector(filter, {
      time: 60000
    });

    collector.on("collect", async (reaction, user) => {
      if (user.bot) return;
      try {
        if (reaction.emoji.name === "🎵") {
          let filter = (m) => m.author.id === message.author.id;
          embed.setTitle("").setDescription("Please enter a YouTube URL to the song");
          editEmbed.edit(embed);
          editEmbed.reactions.removeAll();
          editEmbed.react("❌").then(() => {
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ["time"]
              })
              .then(async (message) => {
                if (collector.ended) return;
                message = message.first();
                let url = message.content;
                const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                const urlValid = videoPattern.test(url);

                if (urlValid) {
                  try {
                    songInfo = await ytdl.getInfo(url);
                    song = {
                      title: songInfo.videoDetails.title,
                      url: songInfo.videoDetails.video_url,
                      duration: songInfo.videoDetails.lengthSeconds
                    };
                  } catch (error) {
                    console.error(error);
                    return message.reply(error.message).catch(console.error);
                  }

                  await editPlaylist.updateOne(
                    {
                      userID: message.author.id,
                      playlistName: pName
                    },
                    {
                      $push: {
                        playlistArray: song
                      }
                    }
                  );
                  embed
                    .setTitle("✅ Success!")
                    .setDescription(`Added [${song.title}](${song.url}) to \`${pName}\``);
                  editEmbed.reactions.removeAll();
                  return editEmbed.edit(embed);
                } else {
                  errEmbed.setTitle(":x: Error").setDescription("Please enter a vaild YouTube URL!");
                  editEmbed.reactions.removeAll();
                  return editEmbed.edit(errEmbed);
                }
              });
          });
        }
        if (reaction.emoji.name === "🗑️") {
          let filter = (m) => m.author.id === message.author.id;
          embed.setDescription("Please the song title or number that the song is listed at").setTitle("");
          editEmbed.edit(embed);
          editEmbed.reactions.removeAll();
          editEmbed.react("❌").then(() => {
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ["time"]
              })
              .then(async (message) => {
                if (collector.ended) return;
                message = message.first();
                let findOne = await editPlaylist.findOne({
                  userID: message.author.id,
                  playlistName: pName
                });
                if (isNaN(message.content)) {
                  let findSongByName = findOne.playlistArray.find((song) => {
                    if (song.title.includes(message.content)) {
                      return song;
                    } else {
                      return null;
                    }
                  });
                  if (findSongByName) {
                    await editPlaylist.updateOne(
                      {
                        userID: message.author.id,
                        playlistName: pName
                      },
                      {
                        $pull: {
                          playlistArray: findSongByName
                        }
                      }
                    );
                    embed
                      .setTitle("✅ Success!")
                      .setDescription(
                        `Removed [${findSongByName.title}](${findSongByName.url}) from \`${pName}\``
                      );
                    editEmbed.reactions.removeAll();
                    return editEmbed.edit(embed);
                  } else {
                    errEmbed
                      .setTitle(":x: Error")
                      .setDescription(`Can't find song named \`${message.content}\` in \`${pName}\`!`);
                    editEmbed.reactions.removeAll();
                    return editEmbed.edit(errEmbed);
                  }
                }

                let num = message.content - 1;
                if (!findOne.playlistArray[num]) {
                  errEmbed
                    .setTitle(":x: Error")
                    .setDescription(`Can't find song \`#${num + 1}\` in \`${pName}\`!`);
                  editEmbed.reactions.removeAll();
                  return editEmbed.edit(errEmbed);
                }

                await editPlaylist.updateOne(
                  {
                    userID: message.author.id,
                    playlistName: pName
                  },
                  {
                    $pull: {
                      playlistArray: findOne.playlistArray[num]
                    }
                  }
                );
                embed
                  .setTitle("✅ Success!")
                  .setDescription(
                    `Removed [${findOne.playlistArray[num].title}](${findOne.playlistArray[num].url}) from \`${pName}\``
                  );
                editEmbed.reactions.removeAll();
                return editEmbed.edit(embed);
              });
          });
        }
        if (reaction.emoji.name === "🏷️") {
          let filter = (m) => m.author.id === message.author.id;
          embed.setDescription("Please enter a new playlist name").setTitle("");
          editEmbed.edit(embed);
          editEmbed.reactions.removeAll();
          editEmbed.react("❌").then(() => {
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ["time"]
              })
              .then(async (message) => {
                if (collector.ended) return;
                message = message.first();
                let newPName = message.content;
                if (newPName === pName) {
                  errEmbed.setTitle(":x: Error").setDescription(`This playlist is already named ${pName}`);
                  editEmbed.reactions.removeAll();
                  return editEmbed.edit(errEmbed);
                }
                await editPlaylist.updateOne(
                  {
                    userID: message.author.id,
                    playlistName: pName
                  },
                  {
                    $set: {
                      playlistName: newPName
                    }
                  }
                );
                embed.setTitle("✅ Success!").setDescription(`Renamed \`${pName}\` to \`${newPName}\``);
                editEmbed.reactions.removeAll();
                return editEmbed.edit(embed);
              });
          });
        }
        if (reaction.emoji.name === "❌") {
          if (collector.ended) return;
          collector.stop();
          embed.setTitle("").setDescription("Playlist edit has been cancelled successfully");
          editEmbed.edit(embed);
          editEmbed.reactions.removeAll();
        }
      } catch (error) {
        console.error(error);
        return sendError("An error has occured while editing the playlist!", message.channel);
      }
    });
  }
};
