import { MessageEmbed } from "discord.js";
import { getPlaylist } from "../music/getPlaylist.js";
import { startQueue } from "../music/startQueue.js";
import { i18n } from "../utils/i18n.js";
import { generateQueue } from "../utils/queue.js";

export default {
  name: "playlist",
  cooldown: 5,
  aliases: ["pl"],
  description: i18n.__("playlist.description"),
  permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
  async execute(message, args) {
    const { channel } = message.member.voice;
    const queue = message.client.queue.get(message.guild.id);

    if (!args.length)
      return message
        .reply(i18n.__mf("playlist.usagesReply", { prefix: message.client.prefix }))
        .catch(console.error);

    if (!channel) return message.reply(i18n.__("playlist.errorNotChannel")).catch(console.error);

    if (queue && channel.id !== queue.channel.id)
      return message
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user.username }))
        .catch(console.error);

    const { playlist, videos } = await getPlaylist({ message, args });

    if (queue) {
      queue.songs.push(...videos);
    } else {
      const queueConstruct = generateQueue(message.channel, channel);
      queueConstruct.songs.push(...videos);

      message.client.queue.set(message.guild.id, queueConstruct);

      startQueue({ message, channel });
    }

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setDescription(videos.map((song, index) => `${index + 1}. ${song.title}`).join("\n"))
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + i18n.__("playlist.playlistCharLimit");

    message
      .reply({
        content: i18n.__mf("playlist.startedPlaylist", { author: message.author }),
        embeds: [playlistEmbed]
      })
      .catch(console.error);
  }
};
