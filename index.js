import { Client, Collection, Intents } from "discord.js";
import { config } from "./utils/config.js";
import { importCommands } from "./utils/importCommands.js";
import { messageCreate } from "./utils/messageCreate.js";

const { TOKEN, PREFIX } = config;
//const vrchat = require("vrchat");
/**
 * Module Imports
 */

const client = new Client({
  restTimeOffset: 0,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();

/**
 * Client events
 */
 client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import commands
 */
importCommands(client);

/**
 * Message event
 */
messageCreate(client);


/**
 * VRC Client
 * 
*/
// const configuration = new vrchat.Configuration({
//     username: VRCUSERNAME,
//     password: VRCPWD
// });

// const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
// const UsersApi = new vrchat.UsersApi(configuration);
// const SystemApi = new vrchat.SystemApi(configuration);

// SystemApi.getCurrentOnlineUsers().then(resp => {
//     // Calling getCurrentUser on Authentication API logs you in if the user isn't already logged in.
//     let totalUsers = resp.data;
//     AuthenticationApi.getCurrentUser().then(resp => {
//         console.log(`VRC Bot: ${resp.data.displayName} Online`)
//         console.log(`${totalUsers} Users Online VRC`)
//     });
// });

// module.exports.AuthenticationApi = AuthenticationApi;
// module.exports.UsersApi = UsersApi;
// module.exports.SystemApi = SystemApi;
