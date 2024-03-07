import { ButtonInteraction, CommandInteraction } from "discord.js";

export async function safeReply(interaction: CommandInteraction | ButtonInteraction, content: string) {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(content);
    } else {
      await interaction.reply(content);
    }
  } catch (error) {
    console.error(error);
  }
}
