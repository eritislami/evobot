import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { safeReply } from "../utils/safeReply";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription(i18n.__("pause.description")),
  execute(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.pause()) {
      const content = i18n.__mf("pause.result", { author: interaction.user.id });

      safeReply(interaction, content);

      return true;
    }
  }
};
