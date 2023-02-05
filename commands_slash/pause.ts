import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription(i18n.__("pause.description")),
  execute(interaction: CommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply({content: i18n.__("pause.errorNotQueue")}).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (queue.player.pause()) {
      interaction.reply({content: i18n.__mf("pause.result", { author: interaction.user.id })}).catch(console.error);

      return true;
    }
  }
};
