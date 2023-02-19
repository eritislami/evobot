import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription(i18n.__("skipto.description"))
    .addIntegerOption((option) =>
      option.setName("number").setDescription(i18n.__("skipto.args.number")).setRequired(true)
    ),
  execute(interaction: ChatInputCommandInteraction) {
    const playlistSlotArg = interaction.options.getInteger("number");
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!playlistSlotArg || isNaN(playlistSlotArg))
      return interaction
        .reply({
          content: i18n.__mf("skipto.usageReply", { prefix: bot.prefix, name: module.exports.name }),
          ephemeral: true
        })
        .catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue)
      return interaction.reply({ content: i18n.__("skipto.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (playlistSlotArg > queue.songs.length)
      return interaction
        .reply({ content: i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }), ephemeral: true })
        .catch(console.error);

    if (queue.loop) {
      for (let i = 0; i < playlistSlotArg - 2; i++) {
        queue.songs.push(queue.songs.shift()!);
      }
    } else {
      queue.songs = queue.songs.slice(playlistSlotArg - 2);
    }

    queue.player.stop();

    interaction
      .reply({ content: i18n.__mf("skipto.result", { author: interaction.user.id, arg: playlistSlotArg - 1 }) })
      .catch(console.error);
  }
};
