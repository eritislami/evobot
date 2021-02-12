/**
 * Module Imports
 */
let evobot;
(function main(){
  evobot = require("/app/index.js");
})();

(function shipmod(){
  const { Client, Collection } = require("discord.js");
  const { readdirSync } = require("fs");
  const { join } = require("path");
  let { TOKEN, PREFIX, LOCALE } = require("./util/EvobotUtil");
  PREFIX =  '_';
  TOKEN = process.env.SHIPMOD_TOKEN;
  const path = require("path");
  const i18n = require("i18n");
  
  const voiceLink = require('./modules/voicetext-channel-linking.js')

  const client = new Client({ 
    disableMentions: "everyone",
    restTimeOffset: 0
  });

  client.login(TOKEN);
  client.commands = new Collection();
  client.prefix = PREFIX;
  client.queue = new Map();
  const cooldowns = new Collection();
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  i18n.configure({
    locales: ["en", "es", "ko", "fr", "tr", "pt_br", "zh_cn", "zh_tw"],
    directory: path.join(__dirname, "locales"),
    defaultLocale: "en",
    objectNotation: true,
    register: global,

    logWarnFn: function (msg) {
      console.log("warn", msg);
    },

    logErrorFn: function (msg) {
      console.log("error", msg);
    },

    missingKeyFn: function (locale, value) {
      return value;
    },

    mustacheConfig: {
      tags: ["{{", "}}"],
      disable: false
    }
  });

  /**
   * Client Events
   */
  client.on("ready", () => {
    console.log(`${client.user.username} ready!`);
    client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
  });
  client.on("warn", (info) => console.log(info));
  client.on("error", console.error);

  /**
   * Import all commands
   */
  const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
  }

  client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    keepAlive();

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply(i18n.__("common.errorCommend")).catch(console.error);
    }
  });
  
  
  client.on("voiceChannelSwitch", async (member,newChannel,oldChannel) => {
    // voiceLink.switchVoice(oldChannel,newChannel,member,guildCashe)
  });

  client.on("voiceChannelJoin", async (member,newChannel) => {
   // voiceLink.enterVoice(newChannel,member,guildCashe)
  });

  client.on("voiceChannelLeave", async (member,oldChannel) => {
    // voiceLink.exitVoice(oldChannel,member,guildCashe)
  });
  
  
  //server handler
  setTimeout(function(){
    var keptAlive=function(){
      const Guild = client.guilds.cache.get("690661623831986266"); // Getting the guild.
      let members = [Guild.members.cache.get("500468522468507648")]; // Getting shipwash

      for(var i=0,l=members.length;i<l;i++){
        var member= members[i];

        // Checking if the member is connected to a VoiceChannel.
        if (member.voice.channel) { 
            // The member is connected to a voice channel.
            // https://discord.js.org/#/docs/main/stable/class/VoiceState
            keepAlive();
            return true
            //console.log(`${member.user.tag} is connected to ${member.voice.channel.name}!`);
        } else {
            // The member is not connected to a voice channel.
            console.log(`${member.user.tag} is not connected.`);
        };

        //see if last message was 30 minutes old
        var ttl=30*60*1000;
        var date = member.lastMessage.createdAt
        if((Date.now() - date) < ttl) { //is user active in the last 30 minutes?
           keepAlive();
           return true
        }

        //check user activity status

        if(member.presence.status == 'online'){
            keepAlive();
            return true
        }

      } //end for
    };

    if(!keptAlive()){
      client.channels.cache.get('805549728099860480').send('Bot will sign off in '+(Date.now()-lastKeepAlive).toString());
    }
  },29*60*1000);

  const request = require('request');
  let lastKeepAlive=null;
  function keepAlive(){
    request("https://"+process.env.HEROKU_APP_NAME+".herokuapp.com", (err, res, body) => {
      if (err) { return console.log(err); }
      //console.log(body.url);
      //console.log(body.explanation);
    });
    lastKeepAlive=Date.now();
  };

  const http = require('http');
  const requestListener = function (req, res) {
    res.writeHead(200);
    res.end('Hello, World!');
  }

  const server = http.createServer(requestListener);
  server.listen(process.env.PORT||80);
})();

