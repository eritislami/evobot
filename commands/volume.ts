import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription(i18n.__("volume.description"))
    .addIntegerOption((option) => option.setName("volume").setDescription(i18n.__("volume.description"))),
  execute(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const volumeArg = interaction.options.getInteger("volume");

    if (!queue)
      return interaction.reply({ content: i18n.__("volume.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!))
      return interaction.reply({ content: i18n.__("volume.errorNotChannel"), ephemeral: true }).catch(console.error);

    if (!volumeArg || volumeArg === queue.volume)
      return interaction
        .reply({ content: i18n.__mf("volume.currentVolume", { volume: queue.volume }) })
        .catch(console.error);

    if (isNaN(volumeArg))
      return interaction.reply({ content: i18n.__("volume.errorNotNumber"), ephemeral: true }).catch(console.error);

    if (Number(volumeArg) > 100 || Number(volumeArg) < 0)
      return interaction.reply({ content: i18n.__("volume.errorNotValid"), ephemeral: true }).catch(console.error);

    queue.volume = volumeArg;
    queue.resource.volume?.setVolumeLogarithmic(volumeArg / 100);

    return interaction.reply({ content: i18n.__mf("volume.result", { arg: volumeArg }) }).catch(console.error);
  }
};
