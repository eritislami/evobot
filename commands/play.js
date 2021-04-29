const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY } = require("../util/MusicCore.js");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const ytdl = require("ytdl-core");


module.exports = {
  name: "播放",
  cooldown: 3,
  aliases: ["p"],
  async execute(message, args, reaction, user) {
    if (!args.length)
      return message
        .reply("指令參數錯誤！正確用法：>播放 <關鍵字>")
        .catch(console.error);
    if (message.channel.activeCollector) return message.reply("你已經開啓了一個搜索！請先對上一個搜索進行回應！");
    if (!message.member.voice.channel)
      return message.reply("你需要先加入一個語音頻道！").catch(console.error);

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    //playlist Func
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("youtube列表").execute(message, args);
    }

    if (videoPattern.test(args[0]) && !playlistPattern.test(args[0])) {
      return message.client.commands.get("playFunc").execute(message, args);
    }

    //url play
    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1, { part: "snippet" });
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    //defined embed
    let resultsEmbed = new MessageEmbed()
      .setTitle("請輸入想要播放的歌曲的代號！")
      .setDescription(`關鍵字 *${search}*  的搜索結果`)
      .setColor("#87cefa");

    const newRstEmbed = new MessageEmbed()
      .setTitle("搜索终止！")
      .setDescription("用户终止了搜索！")
      .setColor("#FF0000");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));
      var resultsMessage = await message.channel.send(resultsEmbed)
      await resultsMessage.react('1️⃣');
      await resultsMessage.react('2️⃣');
      await resultsMessage.react('3️⃣');
      await resultsMessage.react('4️⃣');
      await resultsMessage.react('5️⃣');
      await resultsMessage.react('6️⃣');
      await resultsMessage.react('7️⃣');
      await resultsMessage.react('8️⃣');
      await resultsMessage.react('9️⃣');
      await resultsMessage.react('🔟');
      await resultsMessage.react('❌');
    } catch (error) {
      console.error(error)
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = resultsMessage.createReactionCollector(filter);
    var exit = false;

    collector.on('collect', (reaction, user, reactionCollector) => {
      switch (reaction.emoji.name) {
        case "❌":
          resultsMessage.edit(newRstEmbed).catch(console.error);
          resultsMessage.reactions.removeAll().catch(console.error);
          exit = true;
          if (exit) {
            message.channel.activeCollector = false;
          }
          break;

        case "1️⃣":
          const choice1 = resultsEmbed.fields[parseInt(1) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice1]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "2️⃣":
          const choice2 = resultsEmbed.fields[parseInt(2) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice2]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "3️⃣":
          const choice3 = resultsEmbed.fields[parseInt(3) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice3]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "4️⃣":
          const choice4 = resultsEmbed.fields[parseInt(4) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice4]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "5️⃣":
          const choice5 = resultsEmbed.fields[parseInt(5) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice5]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "6️⃣":
          const choice6 = resultsEmbed.fields[parseInt(6) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice6]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "7️⃣":
          const choice7 = resultsEmbed.fields[parseInt(7) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice7]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "8️⃣":
          const choice8 = resultsEmbed.fields[parseInt(8) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice8]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "9️⃣":
          const choice9 = resultsEmbed.fields[parseInt(9) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice9]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;

        case "🔟":
          const choice10 = resultsEmbed.fields[parseInt(10) - 1].name;
          message.client.commands.get("playFunc").execute(message, [choice10]);
          resultsMessage.delete().catch(console.error);
          message.channel.activeCollector = false;
          break;
      }
    });
    if (exit) return
  }
}
