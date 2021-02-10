async function syncVoiceChannels(){

}

function switchVoice(oldChannel,newChannel,user,guildCashe){
  if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']] && guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    console.log("New and old channels are linked channels.")
    let newTextChannels = newChannel.guild.channels.filter((item) => {
      for (var i = 0; i < (guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]).length; i++) {
        if(item['id'] === guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']][i]){
          return true;
        }
      }
    });
    let oldTextChannels = oldChannel.guild.channels.filter((item) => {
      for (var i = 0; i < (guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]).length; i++) {
        if(item['id'] === guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']][i]){
          return true;
        }
      }
    });


    let filteredNewTextChannels = newTextChannels
    let filteredOldTextChannels = oldTextChannels

    for (var i = 0; i < newTextChannels.length; i++) {
      for (var b = 0; b < oldTextChannels.length; b++) {
        if (oldTextChannels[b] === newTextChannels[i]){
          filteredNewTextChannels[i] = "none"
          filteredOldTextChannels[b] = "none"
        }
      }
    }


    //remove permissions for old text channels
    if(Array.isArray(oldTextChannels)){
      for (var i = 0; i < oldTextChannels.length; i++) {
        if(oldTextChannels[i] != "none"){
          oldTextChannels[i].deletePermission(user.id)
        }
      }
    } else {
      if(oldTextChannels != "none"){
        oldTextChannels.deletePermission(user.id)
      }
    }

    //add permissions for allowed text channels
    if(Array.isArray(newTextChannels)){
      for (var i = 0; i < newTextChannels.length; i++) {
        if(newTextChannels[i] != "none"){
          newTextChannels[i].editPermission(user.id,1024,0,'member')
        }
      }
    } else {
      if(newTextChannels != "none"){
        newTextChannels.editPermission(user.id,1024,0,'member')
      }
    }
  } else if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    exitVoice(oldChannel,user,guildCashe);
  } else if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]){
    enterVoice(newChannel,user,guildCashe);
  }
}

function enterVoice(newChannel,user,guildCashe){
  console.log('user ' + user.id + ' joined channel ' + newChannel.id)
  if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]){
    console.log('new channel a is linked channel')
    let textChannels = newChannel.guild.channels.filter((item) => {
      for (var i = 0; i < (guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]).length; i++) {
        if(item['id'] === guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']][i]){
          return true;
        }
      }
    });
    console.log('linked channels: ' + textChannels)
    if(Array.isArray(textChannels)){
      for (var i = 0; i < textChannels.length; i++) {
        textChannels[i].editPermission(user.id,1024,0,'member')
      }
    } else {
      textChannels.editPermission(user.id,1024,0,'member')
    }
  }
}

function exitVoice(oldChannel,user,guildCashe){
  console.log('user ' + user.id + ' left channel ' + oldChannel.id)
  if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    console.log('old channel a is linked channel')
    let textChannels = oldChannel.guild.channels.filter((item) => {
      for (var i = 0; i < (guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]).length; i++) {
        if(item['id'] === guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']][i]){
          return true;
        }
      }
    });
    if(Array.isArray(textChannels)){
      for (var i = 0; i < textChannels.length; i++) {
        textChannels[i].deletePermission(user.id)
      }
    } else {
      textChannels.deletePermission(user.id)
    }
  }
}

async function addVoiceLink(args,msg,guildCashe,bot,db,maxChannels){
  let options = {'userIDs':msg.author.id}
  let guild = msg.channel.guild
  let member = guild.fetchMembers(options);
  member = (await member)[0];
  if(member.permission.has('manageChannels') || member.id == '229331045726552066'){
    if(member.voiceState.channelID != null){
      let voiceChannel = member.voiceState.channelID
      let textChannel = msg.channel.id
      console.log("linking voice channel: "+voiceChannel+" to text channel: "+textChannel)
      console.log("test1: "+(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]))
      if(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]){
          if(Array.isArray(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel])){
            if((guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length <= maxChannels){
              (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).push(textChannel)
              console.log("pushed text channel to cashe")
              bot.createMessage(msg.channel.id,"Linked additional text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
            } else {
              console.log('currently linked channels: ' + (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length)
              bot.createMessage(msg.channel.id,"Unable to link this channel. You have already linked the maximum number of channels linked to that voice channel.");
            }
          } else {
            guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel][0] = guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]
            guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel][1] = textChannel
            bot.createMessage(msg.channel.id,"Linked additional text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
          }
      } else {
        guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = [textChannel]
        bot.createMessage(msg.channel.id,"Linked text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
      }
      if(!guildCashe[guild['id']]['linkedChannels']['enabled']){
        guildCashe[guild['id']]['linkedChannels']['enabled'] = true
      }
      console.log("guild id: " + guild.id +'\nguild cashe: ' + JSON.stringify(guildCashe[guild['id']]))
      db.query('UPDATE servers SET settings = $1 WHERE id = ($2)',[JSON.stringify(guildCashe[guild['id']]),guild.id])
    } else {
      bot.createMessage(msg.channel.id,"You must be in a voice channel that I have permission to see to be able to link channels.");
    }
  }
}

async function removeVoiceLink(args,msg,guildCashe,bot,db){
  let options = {'userIDs':msg.author.id}
  let guild = msg.channel.guild
  let member = guild.fetchMembers(options);
  member = (await member)[0];
  if(member.permission.has('manageChannels') || member.id == '229331045726552066'){
    if(member.voiceState.channelID != null){
      let voiceChannel = member.voiceState.channelID
      let textChannel = msg.channel.id
      console.log("unlinking voice channel: "+voiceChannel+" from text channel: "+textChannel)
      console.log("test1: "+(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]))
      if(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]){
          if(!Array.isArray(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel])){
            if (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = textChannel){
              delete guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]
              bot.createMessage(textChannel,"Unlinked text channel with id of "+textChannel+" from voice channel with id of "+voiceChannel);
            } else {   
              bot.createMessage(msg.channel.id,"The voice channel you are currently in is not linked to this text channel.");
            }
          } else {
            for (let i = 0; i < guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel].length; i++) {
              if (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = textChannel) {
                delete guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel][i]
                bot.createMessage(textChannel,"Unlinked text channel with id of "+textChannel+" from voice channel with id of "+voiceChannel);
                return
              }
            }
            bot.createMessage(msg.channel.id,"The voice channel you are currently in is not linked to this text channel.");
          }
      } else {
        bot.createMessage(msg.channel.id,"The voice channel you are currently in has no linked text channels.");
      }
      if(!guildCashe[guild['id']]['linkedChannels']['enabled']){
        guildCashe[guild['id']]['linkedChannels']['enabled'] = true
      }
      console.log("guild id: " + guild.id +'\nguild cashe: ' + JSON.stringify(guildCashe[guild['id']]))
      db.query('UPDATE servers SET settings = $1 WHERE id = ($2)',[JSON.stringify(guildCashe[guild['id']]),guild.id])
    } else {
      bot.createMessage(msg.channel.id,"You must be in a voice channel that I have permission to see to be able to unlink channels. If you accidently deleted a linked channel you can use |reset to unlink all channels (I know this isnt a great solution but it works).");
    }
  }
}

exports.addVoiceLink = addVoiceLink;
exports.syncVoiceChannels = syncVoiceChannels;
exports.exitVoice = exitVoice;
exports.enterVoice = enterVoice;
exports.switchVoice = switchVoice;
exports.removeVoiceLink = removeVoiceLink;
