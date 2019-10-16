module.exports = {
  name: "help",
  description: "Display the list of commands",
  async execute(message) {
    var help_embed = new Discord.RichEmbed()
      .setColor('#FFFFFF')
			.addField(':question: | Commands', Display the list of commands.`)
			help_embed.addField('`pause`','Pause the currently playing music')
			.addField('`play`','Plays audio from YouTube')
			.addField('`playlist`','Play a playlist from youtube')
			.addField('`queue`','Show the music queue and now playing')
			.addField('`remove`','Remove song from the queue')
			.addField('`resume`','Resume currently playing music')
			.addField('`skip`','Skip the currently playing song')
			.addField('`stop`','Stops the music')
			.addField('`volume`','Change volume of currentply playing voiceConnection')
			.setFooter(`${message.author.tag}`,`${message.author.displayAvatarURL}`)
			.setTimestamp()
			message.channel.send(help_embed) 
  }
}
