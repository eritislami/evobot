const fs = require('fs')
const defaultServerConfig = '{"prefix":"|","linkedChannels":{"enabled":true,"channels":{}},"customChannels":{"enabled":false,"catagorys":{},"channels":{}}}'

async function newGuild(guild,db,guildCashe,prefix){
  console.log('joined new guild: ' + guild['name'])
  db.query('INSERT INTO servers (id,settings) VALUES ($1,$2)',[guild['id'],JSON.parse(defaultServerConfig)])
  guildCashe[guild['id']] = JSON.parse(defaultServerConfig)
}

exports.newGuild = newGuild;
exports.defaultServerConfig = defaultServerConfig;
