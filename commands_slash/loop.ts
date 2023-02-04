import { SlashCommandBuilder, CommandInteraction, GuildMember } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription(i18n.__("loop.description")),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    // console.log(interaction.user);
    // define guildMember as <GuildMember>
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);
    if (!queue) return interaction.reply({content: i18n.__("loop.errorNotQueue"), ephemeral: true}).catch(console.error);
    if (!guildMemer || !canModifyQueue(guildMemer)) return i18n.__("common.errorNotChannel");

    queue.loop = !queue.loop;

    return interaction
      .reply({content: i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })})
      .catch(console.error);
  }
};
