import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction } from "discord.js";
import { bot } from "../index";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription(i18n.__("remove.description"))
    .addStringOption((option) =>
      option.setName("slot").setDescription(i18n.__("remove.description")).setRequired(true)
    ),
  execute(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    const removeArgs = interaction.options.getString("slot");

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue)
      return interaction.reply({ content: i18n.__("remove.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    if (!removeArgs)
      return interaction.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }), ephemeral: true });

    const songs = removeArgs.split(",").map((arg: any) => parseInt(arg));

    let removed: Song[] = [];

    if (pattern.test(removeArgs)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.find((songIndex: any) => songIndex - 1 === index)) removed.push(item);
        else return true;
      });

      interaction.reply(
        i18n.__mf("remove.result", {
          title: removed.map((song) => song.title).join("\n"),
          author: interaction.user.id
        })
      );
    } else if (!isNaN(+removeArgs) && +removeArgs >= 1 && +removeArgs <= queue.songs.length) {
      return interaction.reply(
        i18n.__mf("remove.result", {
          title: queue.songs.splice(+removeArgs - 1, 1)[0].title,
          author: interaction.user.id
        })
      );
    } else {
      return interaction.reply({ content: i18n.__mf("remove.usageReply", { prefix: bot.prefix }) });
    }
  }
};
