import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern, youtubeURLPattern, appleMusicPattern, spotifyPattern } from "../utils/patterns";
import axios from 'axios';
import { convertToYouTubeLink } from '../utils/musicLinkConverter';

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(i18n.__("play.description"))
    .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true)),
  cooldown: 3,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
  async execute(interaction: ChatInputCommandInteraction) {
    let argSongName = interaction.options.getString("song")!;

    const guildMember = interaction.guild!.members.cache.get(interaction.user.id);
    const { channel } = guildMember!.voice;

    if (!channel)
      return interaction.reply({ content: i18n.__("play.errorNotChannel"), ephemeral: true }).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return interaction
        .reply({
          content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }),
          ephemeral: true
        })
        .catch(console.error);

    if (!argSongName)
      return interaction
        .reply({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix }), ephemeral: true })
        .catch(console.error);

    if (interaction.replied) await interaction.editReply("⏳ Loading...").catch(console.error);
    else await interaction.reply("⏳ Loading...");

    if (playlistPattern.test(argSongName)) {
      await interaction.editReply("🔗 Link is playlist").catch(console.error);
      return bot.slashCommandsMap.get("playlist")!.execute(interaction);
    }

    let songUrl: string | null = argSongName;

    if (appleMusicPattern.test(argSongName) || spotifyPattern.test(argSongName)) {
      songUrl = await convertToYouTubeLink(argSongName, appleMusicPattern.test(argSongName) ? 'appleMusic' : 'spotify');
      if (!songUrl) {
        return interaction.editReply({ content: i18n.__("play.errorNoResults") }).catch(console.error);
      }
    }

    let song;

    try {
      song = await Song.from(songUrl, argSongName);
    } catch (error: any) {
      console.error(error);
      return interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
    }

    if (queue) {
      queue.enqueue(song);
      return (interaction.channel as TextChannel)
        .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: interaction.user.id }) })
        .catch(console.error);
    }

    const newQueue = new MusicQueue({
      interaction,
      textChannel: interaction.channel! as TextChannel,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(interaction.guild!.id, newQueue);
    newQueue.enqueue(song);
    interaction.deleteReply().catch(console.error);
  }
};