const loadPlaylist = require("../models/playlistSchema");
const i18n = require("i18n");
const { LOCALE } = require("../util/EvobotUtil");
i18n.setLocale(LOCALE);
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "playlist-list",
  cooldown: 5,
  aliases: ["pl-list", "pl-l"],
  description: i18n.__("playlist-list.description"),
  async execute(message, args) {
    let member = message.author;
    let mention = message.mentions.users.first();
    if (mention) {
      args.shift();
      member = mention;
    }

    let fetchList;
    fetchList = await loadPlaylist.find({
      userID: member.id
    });

    if (!fetchList.length) {
      return message.channel.send(i18n.__("playlist-play.playlistNotFound"));
    }

    if (!args[0]) {
      const embeds2 = generateListEmbed(message, fetchList);
      return await message.channel.send(embeds2);
    }

    const pName = args.join(" ");
    fetchList = await loadPlaylist.findOne({
      userID: member.id,
      playlistName: pName
    });

    if (!fetchList) {
      return message.channel.send(i18n.__("playlist-list.noPlaylistSaved"));
    }

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, fetchList);

    const queueEmbed = await message.channel.send(
      `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      embeds[currentPage]
    );

    try {
      await queueEmbed.react("⏪");
      await queueEmbed.react("◀️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("▶️");
      await queueEmbed.react("⏩");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) => ["⏪", "◀️", "⏹", "▶️", "⏩"].includes(reaction.emoji.name);
    const collector = queueEmbed.createReactionCollector(filter, {
      time: 3 * 60 * 1000
    });

    collector.on("collect", async (reaction, user) => {
      if (user.bot) return;
      await reaction.users.remove(user.id);
      try {
        if (reaction.emoji.name === "▶️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === "◀️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === "⏩") {
          if (currentPage === embeds.length - 1) return;
          currentPage = embeds.length - 1;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        } else if (reaction.emoji.name === "⏪") {
          if (currentPage === 0) return;
          currentPage = 0;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        } else {
          message.delete();
          queueEmbed.delete();
          collector.stop();
        }
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    });

    collector.on("end", () => {
      setTimeout(() => {
        if (!queueEmbed.deleted) {
          queueEmbed.reactions.removeAll();
        }
      }, 500);
    });
  }
};

function generateQueueEmbed(message, list) {
  let queue = list.playlistArray;
  let embeds = [];
  let k = 10;

  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;

    const info = current
      .map(
        (track) =>
          `**\`${++j}.\`** ${track.duration == -1 ? "" : `\`[${msConversion(track.duration * 1000)}]\` - `}[${
            track.title
          }](${track.url})`
      )
      .join("\n");
    let totalDuration = 0;
    queue.forEach((song) => {
      totalDuration = song.duration + totalDuration;
    });
    const embed = new MessageEmbed()
      .setTitle(`Playlist: \n`)
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`**\`${list.playlistName}\`**\n\n${info}`)
      .setFooter(`🎵 ${queue.length}  •  🕒 ${msConversion(totalDuration * 1000)}`);
    embeds.push(embed);
  }
  return embeds;
}

function generateListEmbed(message, list) {
  let embeds = [];
  let k = 10;
  for (let i = 0; i <= 10; i++) {
    const current = list.slice(i, k);

    let j = i;
    const info = current.map((pl) => `**${++j}** - \`${pl.playlistName}\``).join("\n");

    const embed = new MessageEmbed()
      .setAuthor(`${message.author.username}'s Playlists\n`, message.author.displayAvatarURL())
      .setDescription(info)
      .setFooter(`Playlist (${list.length} / 10)`)
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}

function msConversion(millis) {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = "" + sec;
  sec = ("00" + sec).substring(sec.length);

  if (hrs > 0) {
    min = "" + min;
    min = ("00" + min).substring(min.length);
    return hrs + ":" + min + ":" + sec;
  } else {
    return min + ":" + sec;
  }
}
