module.exports = {
  name: "invite",
  description: "Send bot invite link",
  execute(client, message) {
    return message.member
      .send(
        `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=70282305&scope=bot
    `
      )
      .catch(console.error);
  }
};
