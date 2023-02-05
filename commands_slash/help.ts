import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";

export default {
  data: new SlashCommandBuilder()
      .setName("help")
      .setDescription(i18n.__("help.description")),
  async execute(interaction: CommandInteraction) {
    let commands = bot.slashCommandsMap;

    let helpEmbed = new EmbedBuilder()
      .setTitle(i18n.__mf("help.embedTitle", { botname: interaction.client.user!.username }))
      .setDescription(i18n.__("help.embedDescription"))
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      // @ts-ignore
      cmd = cmd.data;
      helpEmbed.addFields({
        name: `**${bot.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        value: `${cmd.description}`,
        inline: true
      });
    });

    helpEmbed.setTimestamp();

    return interaction.reply({ embeds: [helpEmbed] }).catch(console.error);
  }
};
