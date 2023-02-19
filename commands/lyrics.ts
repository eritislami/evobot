import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { bot } from "../index";

export default {
  data: new SlashCommandBuilder().setName("lyrics").setDescription(i18n.__("lyrics.description")),
  async execute(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length) return interaction.reply(i18n.__("lyrics.errorNotQueue")).catch(console.error);

    await interaction.reply("⏳ Loading...").catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
      lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new EmbedBuilder()
      .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
      .setDescription(lyrics.length >= 4096 ? `${lyrics.substr(0, 4093)}...` : lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    return interaction.editReply({ content: "", embeds: [lyricsEmbed] }).catch(console.error);
  }
};
