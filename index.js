/**
 * Module Imports
 */
const discord = require("discord.js")
const client = new discord.Client({ disableEveryone: true, disabledEvents: ['TYPING_START'] })
const { readdirSync } = require("fs")
const { join } = require("path")
const { TOKEN, PREFIX } = require("./config.json")

client.login(TOKEN)
client.commands = new discord.Collection()
client.queue = new Map()

/**
 * Client Events
 */
client.on("ready", () => console.log("Ready"))
client.on("warn", info => console.log(info))
client.on("error", console.error)

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"))
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command)
}

client.on("message", async message => {
  if (message.author.bot) return
  if (!message.guild) return

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    if (!client.commands.has(command)) return

    try {
      client.commands.get(command).execute(message, args)
    } catch (error) {
      console.error(error)
      message.reply("There was an error executing that command.").catch(console.error)
    }
  }
})
