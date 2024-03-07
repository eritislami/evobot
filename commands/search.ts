import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js";
import youtube, { Video } from "youtube-sr";
import { bot } from "..";
import { i18n } from "../utils/i18n";

export default {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription(i18n.__("search.description"))
    .addStringOption((option) =>
      option.setName("query").setDescription(i18n.__("search.optionQuery")).setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("query", true);
    const member = interaction.guild!.members.cache.get(interaction.user.id);

    if (!member?.voice.channel)
      return interaction.reply({ content: i18n.__("search.errorNotChannel"), ephemeral: true }).catch(console.error);

    const search = query;

    await interaction.reply("⏳ Loading...").catch(console.error);

    let results: Video[] = [];

    try {
      results = await youtube.search(search, { limit: 10, type: "video" });
    } catch (error) {
      console.error(error);
      interaction.editReply({ content: i18n.__("common.errorCommand") }).catch(console.error);
      return;
    }

    if (!results || !results[0]) {
      interaction.editReply({ content: i18n.__("search.noResults") });
      return;
    }

    const options = results!.map((video) => {
      return {
        label: video.title ?? "",
        value: video.url
      };
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("search-select")
        .setPlaceholder("Nothing selected")
        .setMinValues(1)
        .setMaxValues(10)
        .addOptions(options)
    );

    const followUp = await interaction.followUp({
      content: "Choose songs to play",
      components: [row]
    });

    followUp
      .awaitMessageComponent({
        time: 30000
      })
      .then((selectInteraction) => {
        if (!(selectInteraction instanceof StringSelectMenuInteraction)) return;

        selectInteraction.update({ content: "⏳ Loading the selected songs...", components: [] });

        bot.slashCommandsMap
          .get("play")!
          .execute(interaction, selectInteraction.values[0])
          .then(() => {
            selectInteraction.values.slice(1).forEach((url) => {
              bot.slashCommandsMap.get("play")!.execute(interaction, url);
            });
          });
      })
      .catch(console.error);
  }
};
