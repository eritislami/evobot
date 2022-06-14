import { Message, MessageEmbed, TextChannel } from "discord.js";
import youtube from "youtube-sr";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

type CustomTextChannel = TextChannel & { activeCollector: boolean };

export default {
  name: "search",
  description: i18n.__("search.description"),
  async execute(message: Message, args: any[]) {
    if (!args.length)
      return message
        .reply(i18n.__mf("search.usageReply", { prefix: bot.prefix, name: module.exports.name }))
        .catch(console.error);

    if ((message.channel as CustomTextChannel).activeCollector)
      return message.reply(i18n.__("search.errorAlreadyCollector"));

    if (!message.member?.voice.channel) return message.reply(i18n.__("search.errorNotChannel")).catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(i18n.__("search.resultEmbedTitle"))
      .setDescription(i18n.__mf("search.resultEmbedDesc", { search: search }))
      .setColor("#F8AA2A");

    try {
      const results = await youtube.search(search, { limit: 10, type: "video" });

      results.map((video, index) =>
        resultsEmbed.addField(`https://youtube.com/watch?v=${video.id}`, `${index + 1}. ${video.title}`)
      );

      let resultsMessage = await message.channel.send({ embeds: [resultsEmbed] });

      function filter(msg: Message) {
        const pattern = /^[1-9][0]?(\s*,\s*[1-9][0]?)*$/;
        return pattern.test(msg.content);
      }

      (message.channel as CustomTextChannel).activeCollector = true;

      const response = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] });
      const reply = response.first()!.content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await bot.commands.get("play")!.execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice: any = resultsEmbed.fields[parseInt(response.first()?.toString()!) - 1].name;
        bot.commands.get("play")!.execute(message, [choice]);
      }

      (message.channel as CustomTextChannel).activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first()!.delete().catch(console.error);
    } catch (error: any) {
      console.error(error);
      (message.channel as CustomTextChannel).activeCollector = false;
      message.reply(i18n.__("common.errorCommand")).catch(console.error);
    }
  }
};
