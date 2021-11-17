let configs;

try {
  configs = require("./autoRoleConfig.json");
} catch (error) {
  configs = null;
}

if (!configs) configs = JSON.parse(process.env.autoRoleConfig);

/**
 * 'ready' event handler for discord.js client
 * find the first message in the specified channel and save it for later
 */
async function onReady(client) {
  for (const config of configs) {
    const channel = await client.channels.fetch(config.channelId);
    if (!channel || channel.type === "DM") {
      continue;
    }
    try {
      const message = await channel.messages.fetch(config.messageId);
      for (const [key, value] of Object.entries(config.roles)) {
        await message.react(key);
      }
      // Object.keys(config.emojiRoleMap).forEach(
      //   async (emoji) => await message.react(emoji)
      // );
      console.log(`Watching message '${config.messageId}' for reactions...`);
    } catch (err) {
      console.error("Error fetching channel messages", err);
      return;
    }
  }
}

/**
 * add a role to a user when they add reactions to the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function addRole({ message, _emoji }, user) {
  const config = configs.find((c) => c.messageId === message.id);
  if (user.bot || !config /*|| message.id !== config.messageId*/) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error("Error fetching message", err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.id === config.roles[_emoji]);

  if (!role) {
    console.error(`Role not found for '${_emoji}'`);
    return;
  }

  try {
    member.roles.add(role.id);
  } catch (err) {
    console.error("Error adding role", err);
    return;
  }
}

/**
 * remove a role from a user when they remove reactions from the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function removeRole({ message, _emoji }, user) {
  const config = configs.find((c) => c.messageId === message.id);
  if (user.bot || !config /*|| message.id !== config.messageId*/) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error("Error fetching message", err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.id === config.roles[_emoji]);

  if (!role) {
    console.error(`Role not found for '${_emoji}'`);
    return;
  }

  try {
    member.roles.remove(role.id);
  } catch (err) {
    console.error("Error removing role", err);
    return;
  }
}

exports.onReady = onReady;
exports.addRole = addRole;
exports.removeRole = removeRole;
