import { i18n } from "../utils/i18n";
import { readdir } from "fs";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clips")
        .setDescription(i18n.__("clips.description")),
  execute(interaction: CommandInteraction) {
    readdir("./sounds", function (err, files) {
      if (err) return console.log("Unable to read directory: " + err);

      let clips: string[] = [];

      files.forEach(function (file) {
        clips.push(file.substring(0, file.length - 4));
      });

      const clipsEmbed = new EmbedBuilder()
        .setTitle(i18n.__mf(`Clips for \`${interaction.client.user!.username}\``))
        .setDescription("- " + clips.join("\n- "))
        interaction.reply({embeds: [clipsEmbed]}).catch(console.error);
    });
  }
};
