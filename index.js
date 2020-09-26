const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const Discord = require("discord.js")
const { join } = require("path");
const { TOKEN, } = require("./config.json");
const serverstats = require("./servers.json");
const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`%help ,Users ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}, Guilds ${client.guilds.cache.size}`);
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
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});


client.on("message" , msg =>{

  if (msg.content.startsWith(`${prefix}support`)) {
  
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription("**Press the button to Support The Server**")
      .setTitle("Support")
       .setURL("https://discord.gg/YRvXfTX")
      .setFooter(msg.author.tag ,msg.author.displayAvatarURL())
      msg.channel.send(embed)
      }

})

client.on("message" , msg =>{

  if (msg.content.startsWith(`${prefix}invite`)) {
  
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription("**Press the button to invite the Bot to your server**")
      .setTitle("Add To Your Server")
       .setURL("https://discord.com/oauth2/authorize?client_id=744293924625055796&scope=bot&permissions=45481409")
      .setFooter(msg.author.tag ,msg.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
      msg.channel.send(embed)
      }
      
      
  
  })
  
  //
  client.on('message', message => {
    if(message.content === `${prefix}server avatar`){
      
        const embed = new  Discord.MessageEmbed()
        .setColor()
        .setTitle("Avatar Link")
        .setAuthor(message.author.tag , message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
        .setURL(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}))
        .setImage(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}))
        .setFooter(`Requested by ${message.author.tag}`)
        message.channel.send(embed)
    }

    
    })
  
  
  
   client.on('message', message => {
    if(message.content.startsWith(`${prefix}avatar`)){
    
        
        if(message.mentions.users.size){
            let member=message.mentions.users.first()
        if(member){
            const emb=new Discord.MessageEmbed()
            .setImage(member.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setTitle("Avatar Link")
            .setAuthor(member.tag , member.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setURL(member.avatarURL({format: 'png', dynamic: true, size: 1024}))
            .setFooter(`Requested by ${message.author.tag}`)
            message.channel.send(emb)
            
        }
        else{
            message.channel.send("Sorry none found with that name")

        }
        }else{
            const emb=new Discord.MessageEmbed()
            .setImage(message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setTitle("Avatar Link")
            .setAuthor(message.author.tag , message.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setURL(message.author.avatarURL({format: 'png', dynamic: true, size: 1024}))
            .setFooter(`Requested by ${message.author.tag}`)
            message.channel.send(emb)
        }
    }
})

  if (!serverstats[message.guild.id]){
       serverstats[message.guild.id] = {
           prefix: "&"
       }
  }

fs.writefile("./servers.json", JSON.stringfly(serverstats), err =>{
    if(err){
        console.log(err);
    }
})
           
let prefix = serverstats[message.guild.id].prefix;

client.on('message', msg => {
  if (msg.content  === `${prefix}help`) {
      const embed = new Discord.MessageEmbed()
      .setColor("#B8C8FF")
      .setTimestamp()
      .setDescription(`
__Music Commands:__
**%play**  Plays a song with the given name or url. 
**%np**  Shows what song the bot is currently playing.
**%aliases**  List command aliases.
**%pause**  Pauses the currently playing track.
**%resume**  Resume paused music.
**%stop**  Stop the current song and clears the entire music queue.
**%skip**  Skips the currently playing song.
**%skipto** Skip to the selected queue number.
**%queue**  Display the queue of the current tracks in the playlist.
**%vol** Changes/Shows the current volume.
**%loop** Toggle music loop.
**%lyrics** Get lyrics for the currently playing song.
**%playlist** Play a playlist from YouTube.
**%pruning** Toggle pruning of bot message.
**%remove** Remove song from the queue.
**%search** Search and select videos to play.
**%shuffle** Shuffle queue.


__Info Commands:__
**%user**
**%info**
**%avatar**
**%server avatar**
**%ping**

__Normal Commands:__
**%invite**
**%support**
**%vote**
      `)
      .setAuthor(msg.author.tag , msg.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
      msg.channel.send(embed)
  }

  })
  

  client.on("message", msg =>{
    if (msg.content === `${prefix}info`) {
     
        const embed = new Discord.MessageEmbed()
        
        .setColor("#f6f7fa")
        .addField("Name Bot" ,client.user.tag)
        .addField("ID Bot" , client.user.id , true)
        .addField("Users" ,client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
        .addField("Guilds" , client.guilds.cache.size , true)
       .setThumbnail(client.user.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
       .setFooter("Info about Remix!")
 
       msg.channel.send(embed)
       

    }

    })

if(message.content === "prefix"){
    message.channel.sent("Die Prefix ist **"+serverstats[message.guild.id].prefix+"**.");
}
                         
if(message.content. startwith(prefix+"setprefix")){
    let newprefix = message.content.split(" ").slice(1).join("");
      
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Du hast keian Rechte!");
      
    serverstats[message.guild.id].prefix = newprefix;
      
    message.channel.sent("Die new Prefix ist **"+newprefix+"**,");
      
    fs.writefile("./servers.json",JSON.stringify(serverstats),function(err){
        if(err) console.log(err);
    })
      
}
  
      
 client.on(`message`, msg => {
        if  (msg.content.startsWith(`${prefix}user`)) {
   

            const embed  = new Discord.MessageEmbed()
            
        
        
             .setColor("4f65ff")
              
            .setDescription(" User Information")
            .setTimestamp()
            .addField("Username" , `<@${msg.author.id}>`)
            .addField("Your ID" , msg.author.id)
            .addField("Joined Discord" , msg.author.createdAt.toLocaleDateString())
            .addField("Joined Server" , msg.guild.joinedAt.toLocaleDateString())
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setThumbnail(msg.author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
         
        
            msg.channel.send(embed)
        }
    })


client.on("message" , msg => {     
    if (msg.content.startsWith(`${prefix}ping`)) {
        msg.channel.send(' **Your ping is** `' + `${Date.now() - msg.createdTimestamp}` + ' ms`') 
       
    }
        })


client.login(process.env.TOKEN);
