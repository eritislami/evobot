const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN } = require("./util/EvobotUtil");
const { initI18n } = require("./locale");
const fetch = require('node-fetch');
var _ = require('lodash');

var applicationId = process.argv[2];
if (_.isEmpty(applicationId)) {
    const message = `
Create/Update Global Application Command
Docs: https://discord.com/developers/docs/interactions/slash-commands#registering-a-command

This script will refresh command list of evobot to discord command section(https://discord.com/assets/a660b11b63a95e932719346ff67ea60f.png).

Usage: node refresh-commands {applicationId}
'applicationId' can be found on discord developer portal (https://discord.com/developers/applications)

ex) If application id is 123456789123456789, it will be 'node refresh-commands 123456789123456789'
    `
    console.log(message)
    throw 'application id is missing'
}

initI18n()

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
const commandList = []
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  commandList.push({
      "name": command.name,
      "description": command.description,
      "options": command.slashargs || []
  })
}

const requestUrl = `https://discord.com/api/v8/applications/${applicationId}/commands`
const requestHeader = { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' }

commandList.forEach(element => {
    const requestBody = JSON.stringify(element)
    fetch(requestUrl, { method: "post", body: requestBody, headers: requestHeader })
      .then(res => res.json())
      .then(json => console.log(json))
})