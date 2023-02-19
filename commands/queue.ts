import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  MessageReaction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  User
} from "discord.js";
import { bot } from "../index";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription(i18n.__("queue.description")),
  cooldown: 5,
  permissions: [PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.ManageMessages],
  async execute(interaction: ChatInputCommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    if (!queue || !queue.songs.length) return interaction.reply({ content: i18n.__("queue.errorNotQueue") });

    let currentPage = 0;
    const embeds = generateQueueEmbed(interaction, queue.songs);

    await interaction.reply("⏳ Loading queue...");

    if (interaction.replied)
      await interaction.editReply({
        content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
        embeds: [embeds[currentPage]]
      });

    const queueEmbed = await interaction.fetchReply();

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");
    } catch (error: any) {
      console.error(error);
      (interaction.channel as TextChannel).send(error.message).catch(console.error);
    }

    const filter = (reaction: MessageReaction, user: User) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && interaction.user.id === user.id;

    const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(interaction.user.id);
      } catch (error: any) {
        console.error(error);
        return (interaction.channel as TextChannel).send(error.message).catch(console.error);
      }
    });
  }
};

function generateQueueEmbed(interaction: CommandInteraction, songs: Song[]) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < songs.length; i += 10) {
    const current = songs.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

    const embed = new EmbedBuilder()
      .setTitle(i18n.__("queue.embedTitle"))
      .setThumbnail(interaction.guild?.iconURL()!)
      .setColor("#F8AA2A")
      .setDescription(i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info }))
      .setTimestamp();
    embeds.push(embed);
  }

  return embeds;
}
