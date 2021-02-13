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
    process.exit(1);
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
  //console.log(`${client.user.username} ready!`);
  //client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
  wakeHandler(client);
  client.destroy();
  process.exit();
});
client.on("warn", (info) => {
  console.log(info);
});
client.on("error", (e) => {
  console.error(e);
  process.exit(1);
});



const request = require('request');
let lastKeepAlive=null;
function keepAlive(string){
  var website="https://"+process.env.HEROKU_APP_NAME+".herokuapp.com";
  console.log('KeepAlive - Pinging '+website+' for reason:'+string);
  request({
    url: website,
    timeout: 5000
}, (err, res, body) => {
    if (err) { 
      console.log(err);
      process.exit(1);
    }
    console.log('successfully pinged '+website);
    process.exit(0);
    //console.log(body.url);
    //console.log(body.explanation);
  });
  lastKeepAlive=Date.now();
};




//wake handler
function wakeHandler(client){
  const Guild = client.guilds.cache.get("690661623831986266"); // Getting the guild.
//   const owners = ['500468522468507648','500467960914116609']; // Getting shipwash
//   for(var i=0,l=owners.length;i<l;i++){
//     //check user activity status
//     var member=Guild.members.cache.get(owners[i]);
//     if(member.presence.status == 'online'){
//       keepAlive(member.displayName+' is online');
//       return true
//     }
//   }

  var keptAlive=Guild.members.cache.some(function(member){
    if(member.user.bot){
      return false;
    }
    // Checking if the member is connected to a VoiceChannel.
    if (member.voice.channel && member.voice.channel.id !== Guild.afkChannelID) { 
        // The member is connected to a voice channel.
        // https://discord.js.org/#/docs/main/stable/class/VoiceState
        keepAlive(member.displayName+' is in a usable voice channel');
        return true
        //console.log(`${member.user.tag} is connected to ${member.voice.channel.name}!`);
    } //else {
        // The member is not connected to a voice channel.
      //  console.log(`${member.user.tag} is not connected.`);
    //};

    //see if last message was 30 minutes old
    var ttl=30*60*1000;
    var lastMessage= member.lastMessage;
    if(lastMessage){
      var date = lastMessage.createdAt
      if((Date.now() - date) < ttl) { //is user active in the last 30 minutes?
         keepAlive(member.displayName+' sent a message recently');
         return true
      }
    }
  }); //end some
};




