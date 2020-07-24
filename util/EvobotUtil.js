module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("Você precisa entrar em um canal de voz primeiro!").catch(console.error);
      return false;
    }

    return true;
  }
};
