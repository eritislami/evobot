module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("You need to join the voice channel first!").catch(console.error);
      return false;
    }

    return true;
  }
};
