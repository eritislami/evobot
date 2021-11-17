module.exports = {
  name: "send",
  description: "Custom",
  execute(message) {
    message.member.fetch().then((member) => {
      if (!member.roles.cache.find((e) => e.name === "Admin")) {
        return;
      }
      return message.channel
        .send(message.attachments.first()?.url ?? message.content.substring(5))
        .then(message.delete().catch(console.error))
        .catch(console.error);
    });
  }
};
