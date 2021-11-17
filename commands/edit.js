module.exports = {
  name: "edit",
  description: "Custom",
  execute(message) {
    message.member.fetch().then((member) => {
      if (!member.roles.cache.find((e) => e.name === "Admin")) {
        return;
      }
      const id = message.content.substring(6).split(" ")[0];
      const msg = message.content.substring(6 + id.length + 1);
      return message.channel.messages
        .fetch(id)
        .then((s) => s.edit(message.attachments.first()?.url ?? msg))
        .then(message.delete().catch(console.error))
        .catch(console.error);
    });
  }
};
