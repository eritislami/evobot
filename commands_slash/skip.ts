import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { bot } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription(i18n.__("skip.description")),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue) return interaction.reply(i18n.__("skip.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    queue.player.stop(true);

    interaction.reply({content: i18n.__mf("skip.result", { author: interaction.user.id })}).catch(console.error);
  }
};
