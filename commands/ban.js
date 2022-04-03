const i18n = require("../util/i18n");

// Ban user by id
module.exports = {
    name: "ban",
    description: i18n.__("ban.description"),
    async execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.reply(i18n.__("ban.noPermission")).catch(console.error);
        }

        if (args.length === 0) {
            return message.reply(i18n.__("ban.errorNoId")).catch(console.error);
        }

        try {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
                member
                    .ban()
                    .then((member) => message.channel.send(i18n.__mf("ban.kickUserMessage" , {user : member})))
                    .catch((error) => message.channel.send(i18n.__("ban.kickUserErrorMessage")));
            
        }
        catch (err) {
            message.reply(i18n.__("ban.notFoundUser")).catch(console.error);
        }
    }
  };