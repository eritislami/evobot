import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";
import { i18n } from "../utils/i18n";

export default {
  data: new SlashCommandBuilder().setName("invite").setDescription(i18n.__("invite.description")),
  execute(interaction: ChatInputCommandInteraction) {
    const inviteEmbed = new EmbedBuilder().setTitle(i18n.__mf("Invite me to your server!"));

    // return interaction with embed and button to invite the bot
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(i18n.__mf("Invite"))
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${
            interaction.client.user!.id
          }&permissions=8&scope=bot%20applications.commands`
        )
    );

    return interaction.reply({ embeds: [inviteEmbed], components: [actionRow] }).catch(console.error);
  }
};
