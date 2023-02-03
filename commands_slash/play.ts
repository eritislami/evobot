import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder, CommandInteraction, PermissionsBitField } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueueSlash";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";
export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(i18n.__("play.description"))
        .addStringOption(option => option.setName("song").setDescription("The song you want to play").setRequired(true)),
  cooldown: 3,
  permissions: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages
  ],
  async execute(interaction: CommandInteraction) {
    // get song 
    // @ts-ignore
    const argSongName = interaction.options.getString("song");

    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    
    const { channel } = guildMemer!.voice;

    if (!channel) return interaction.reply({content: i18n.__("play.errorNotChannel"), ephemeral: true}).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return interaction
        .reply({content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }), ephemeral: true})
        .catch(console.error);

    if (!argSongName) return interaction.reply({content: i18n.__mf("play.usageReply", { prefix: bot.prefix }), ephemeral: true}).catch(console.error);

    const url = argSongName;

    const loadingReply = await interaction.channel?.send("⏳ Loading...");

    // Start the playlist if playlist url was provided
    if (playlistPattern.test(url)) {
    // @ts-ignore
      await loadingReply.delete().catch(console.error);
    // TODO: IMPLEMENT PLAYLIST SLASH COMMAND
      return interaction.reply(`TODO: IMPLEMENT PLAYLIST SLASH COMMAND`);
    //   return bot.commands.get("playlist")!.execute(message, args);
    }

    let song;

    try {
      song = await Song.from(url, url);
    } catch (error: any) {
      if (error.name == "NoResults") return interaction.reply({content: i18n.__mf("play.errorNoResults", {'url': `<${url}>`}), ephemeral: true}).catch(console.error);
      if (error.name == "InvalidURL") return interaction.reply({content: i18n.__mf("play.errorInvalidURL", {'url': `<${url}>`}), ephemeral: true}).catch(console.error);

      console.error(error);
      return interaction.reply({content: i18n.__("common.errorCommand"), ephemeral: true}).catch(console.error);
    } finally {
    // @ts-ignore
      await loadingReply.delete();
    }

    if (queue) {
      queue.enqueue(song);

      return interaction
        .reply({content: i18n.__mf("play.queueAdded", { title: song.title, author: `${interaction.user.username}#${interaction.user.discriminator}` }), ephemeral: true})
        .catch(console.error);
    }
    
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

    newQueue.enqueue(song);
  }
};
