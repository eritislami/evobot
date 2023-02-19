import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription(i18n.__("pause.description")),
  execute(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply({ content: i18n.__("pause.errorNotQueue") }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.pause()) {
      const content = { content: i18n.__mf("pause.result", { author: interaction.user.id }) };

      if (interaction.replied) interaction.followUp(content).catch(console.error);
      else interaction.reply(content).catch(console.error);

      return true;
    }
  }
};
