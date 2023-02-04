import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { bot } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription(i18n.__("shuffle.description")),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue) return interaction.reply({content: i18n.__("shuffle.errorNotQueue"), ephemeral: true}).catch(console.error);

    if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

    let songs = queue.songs;

    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }

    queue.songs = songs;

    queue.textChannel.send(i18n.__mf("shuffle.result", { author: interaction.user.id })).catch(console.error);
  }
};
