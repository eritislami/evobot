
//spindle modules
const configHandler = require('./spindle-modules/config-handler.js');
const menuHandler = require('./spindle-modules/menu-handler.js');
const commandHandler = require('./spindle-modules/command-handler.js')
const guildHandler = require('./spindle-modules/guild-handler.js')
const voiceLink = require('./spindle-modules/voicelink-handler.js')

var guildCashe = {}
var config = configHandler.fetchConfig();
var tokens = configHandler.fetchTokens();

//node modules
let Eris = require('eris')
let postGres = require('pg')

let bot = new Eris(tokens.discord);
let db = new postGres.Client(tokens.database)

startup()

function startup(){ //connects to postgres, fetches the guild cashe, and connects to discord
  if (tokens.discord === configHandler.defaultTokens.discord || !(tokens.discord)){
    console.log("**********************************************************************\n****** please place your discord bot token into the tokens file ******\n**********************************************************************")
    } else if (tokens.database === configHandler.defaultTokens.database || !(tokens.database)) {
      console.log("**********************************************************************\n**** please place your postgres database url into the tokens file ****\n**********************************************************************")
    } else {
      console.log("connecting to postgres...")
      db.connect(function (err) {
        if (err) {
          return console.error("could not connect to postgres ", err);
        } else {
          console.log("connected!\nfetching guild cashe...")
          db.query('SELECT * FROM servers',[], (err, res) => {
            if (err) {
              console.log("error fetching guild cashe");
            } else {
              let remoteCashe = res.rows
              for(let i=0; i<res.rows.length; i++){
                guildCashe[remoteCashe[i]['id']] = remoteCashe[i]['settings']
              }
              console.log('guilds: ' + Object.keys(guildCashe))
              bot.connect();
            }
          });
        }
      });
    }
}


bot.on("ready", async () => {
  console.log("connected!\nready!");
  console.log("setting status")
  bot.editStatus("online",{name:"for |help",type:2})
});

bot.on("guildCreate", async (guild) => { //adds a new guild to the cashe and storage when the bot joins a new guild
  guildHandler.newGuild(guild,db,guildCashe,config.commandChar);
});

bot.on("messageReactionAdd", async (msg, reaction, userID) => {
   /*place menu handler here*/
});

bot.on("messageCreate", async (msg) => {
  commandHandler.handler(bot,msg,guildCashe,db,config)
});

bot.on("voiceChannelSwitch", async (member,newChannel,oldChannel) => {
  voiceLink.switchVoice(oldChannel,newChannel,member,guildCashe)
});

bot.on("voiceChannelJoin", async (member,newChannel) => {
  voiceLink.enterVoice(newChannel,member,guildCashe)
});

bot.on("voiceChannelLeave", async (member,oldChannel) => {
  voiceLink.exitVoice(oldChannel,member,guildCashe)
});
