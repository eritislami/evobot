import { SlashCommandBuilder, CommandInteraction, Message, EmbedBuilder, TextChannel } from "discord.js";
import youtube from "youtube-sr";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

type CustomTextChannel = TextChannel & { activeCollector: boolean };

export default {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription(i18n.__("search.description"))
    .addStringOption((option) => option.setName("query").setDescription(i18n.__("search.optionQuery")).setRequired(true)),
  async execute(interaction: CommandInteraction) {
    // @ts-ignore
    const query = interaction.options.getString("query", true);
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    if (!query)
      return interaction
        .reply({content: i18n.__mf("search.usageReply", { prefix: bot.prefix, name: module.exports.name }), ephemeral: true})
        .catch(console.error);

    if ((interaction.channel as CustomTextChannel).activeCollector)
      return interaction.reply({content: i18n.__("search.errorAlreadyCollector"), ephemeral: true}).catch(console.error);

    if (!guildMemer?.voice.channel) return interaction.reply({content: i18n.__("search.errorNotChannel"), ephemeral: true}).catch(console.error);

    const search = query;

    let resultsEmbed = new EmbedBuilder()
      .setTitle(i18n.__("search.resultEmbedTitle"))
      .setDescription(i18n.__mf("search.resultEmbedDesc", { search: search }))
      .setColor("#F8AA2A");

    try {
      const results = await youtube.search(search, { limit: 10, type: "video" });

      results.map((video, index) =>
        resultsEmbed.addFields({
          name: `https://youtube.com/watch?v=${video.id}`,
          value: `${index + 1}. ${video.title}`
        })
      );

      await interaction.reply({ embeds: [resultsEmbed] });

      let resultsMessage = await interaction.fetchReply();

      function filter(msg: Message) {
        const pattern = /^[1-9][0]?(\s*,\s*[1-9][0]?)*$/;
        return pattern.test(msg.content);
      }

      (interaction.channel as CustomTextChannel).activeCollector = true;

      const response = await interaction.channel!.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] });
      const reply = response.first()!.content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await bot.slashCommandsMap.get("play")!.execute(interaction, [resultsEmbed.data.fields![parseInt(song) - 1].name]);
        }
      } else {
        const choice: any = resultsEmbed.data.fields![parseInt(response.first()?.toString()!) - 1].name;

        bot.slashCommandsMap.get("play")!.execute(interaction, choice);
      }

      (interaction.channel as CustomTextChannel).activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first()!.delete().catch(console.error);
    } catch (error: any) {
      console.error(error);
      (interaction.channel as CustomTextChannel).activeCollector = false;
      interaction.reply({content: i18n.__("common.errorCommand"), ephemeral: true}).catch(console.error);
    }
  }
};
