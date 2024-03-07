import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { safeReply } from "../utils/safeReply";

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription(i18n.__("resume.description")),
  execute(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!queue)
      return interaction.reply({ content: i18n.__("resume.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.unpause()) {
      const content = i18n.__mf("resume.resultNotPlaying", { author: interaction.user.id });

      safeReply(interaction, content);

      return true;
    }

    const content = i18n.__("resume.errorPlaying");

    safeReply(interaction, content);

    return false;
  }
};
