const i18n = require("../util/i18n");

// Kick user by id
module.exports = {
    name: "kick",
    description: i18n.__("kick.description"),
    async execute(message, args) {
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.reply(i18n.__("kick.noPermission")).catch(console.error);
        }

        if (args.length === 0) {
            return message.reply(i18n.__("kick.errorNoId")).catch(console.error);
        }

        try {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
                member
                    .kick()
                    .then((member) => message.channel.send(i18n.__mf("kick.kickUserMessage" , {user : member})))
                    .catch((error) => message.channel.send(i18n.__("kick.kickUserErrorMessage")));
            
        }
        catch (err) {
            message.reply(i18n.__("kick.notFoundUser")).catch(console.error);
        }
    }
  };