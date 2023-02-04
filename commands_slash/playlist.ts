import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueueSlash";
import { Playlist } from "../structs/Playlist";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";

export default {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription(i18n.__("playlist.description"))
    .addStringOption((option) =>option.setName("playlist").setDescription("The playlist you want to play").setRequired(true)),
  cooldown: 5,
  permissions: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages
  ],
  async execute(interaction: CommandInteraction) {
      // @ts-ignore
      var argSongName = interaction.options.getString("playlist");
      // @ts-ignore
      var playSongName = interaction.options.getString("song")

    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    
    const { channel } = guildMemer!.voice;

    const queue = bot.queues.get(interaction.guild!.id);

    if(!argSongName) argSongName = playSongName;

    if (!argSongName)
      if(interaction.replied)
        return
      else
        return interaction.reply({content: i18n.__mf("playlist.usagesReply", { prefix: bot.prefix }), ephemeral: true}).catch(console.error);

    if (!channel) return interaction.reply({content: i18n.__("playlist.errorNotChannel"), ephemeral: true}).catch(console.error);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      if(interaction.replied)
        return interaction
          .editReply({content: i18n.__mf("play.errorNotInSameChannel", { user: interaction.client.user!.username })})
          .catch(console.error);
      else
        return interaction
          .reply({content: i18n.__mf("play.errorNotInSameChannel", { user: interaction.client.user!.username }), ephemeral: true})
          .catch(console.error);

    let playlist;

    try {
      playlist = await Playlist.from(argSongName, argSongName);
    } catch (error) {
      console.error(error);
      if(interaction.replied) return interaction.editReply({content: i18n.__("playlist.errorNotFoundPlaylist")}).catch(console.error);
      else return interaction.reply({content: i18n.__("playlist.errorNotFoundPlaylist"), ephemeral: true}).catch(console.error);
    }

    if (queue) {
      queue.songs.push(...playlist.videos);
    } else {
      const newQueue = new MusicQueue({
        // @ts-ignore
        interaction,
        textChannel: interaction.channel,
        connection: joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        })
      });
      
      // @ts-ignore
      bot.queues.set(interaction.guild!.id, newQueue);
      newQueue.songs.push(...playlist.videos);

      newQueue.enqueue(playlist.videos[0]);
    }

    let playlistEmbed = new EmbedBuilder()
      .setTitle(`${playlist.data.title}`)
      .setDescription(playlist.videos.map((song: Song, index: number) => `${index + 1}. ${song.title}`).join("\n"))
      .setURL(playlist.data.url!)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (playlistEmbed.data.description!.length >= 2048)
      playlistEmbed.setDescription(
        playlistEmbed.data.description!.substr(0, 2007) + i18n.__("playlist.playlistCharLimit")
      );

    if(interaction.replied)
      return interaction
        .editReply({
          content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
          embeds: [playlistEmbed]
        })
    interaction
      .reply({
        content: i18n.__mf("playlist.startedPlaylist", { author: interaction.user.id }),
        embeds: [playlistEmbed]
      })
      .catch(console.error);
  }
};
