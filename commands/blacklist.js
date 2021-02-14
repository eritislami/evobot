const blacklistModel = require('../schemas/blacklist');
const { MessageEmbed } = require('discord.js');
const { LOCALE, MONGODB_URI } = require("../util/EvobotUtil");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
    name: 'blacklist',
    description: i18n.__("blacklist.description"),
    async execute(message, args) {
        if(!MONGODB_URI) return message.channel.send('No MongoDB URI was provided. Blacklist system disabled!')
        
        const type = args[0];
        const member = message.mentions.users.first()
        const users = await blacklistModel.find();

        if (!type) {
            return message.channel.send(i18n.__("blacklist.noType"));
        }

        if (args[0] == 'list') {
            if (users.length == 0) {
                return message.channel.send(i18n.__("blacklist.noBlacklisted"));
            }

            let datas = []
            users.forEach((data, index) => {
                datas.push(`${index++ + 1} | ${data.username} (${data.userId})`)
            })

            const listEmbed = new MessageEmbed()
                .setAuthor(`Blacklist`, message.client.user.displayAvatarURL())
                .setDescription(datas.join('\n '))
                .setColor('#e5ebda')
                .setTimestamp()

            return message.channel.send(listEmbed)


        }

        if (!member) {
            return message.channel.send(i18n.__("blacklist.provideMember"));
        }

        if (member.id === message.client.user.id) {
            return message.channel.send(i18n.__("blacklist.botMember"));
        }


        switch (type) {
            case "add": {
                const existing = users.filter((u) => u.userId === member.id)[0];
                if (existing) {
                    return message.channel.send(i18n.__("blacklist.alreadyBlacklisted"));
                }

                const blUser = new blacklistModel({ userId: member.id, username: member.username });

                await blUser.save();

                return message.channel.send(i18n.__("blacklist.doneBlacklisted"));
                break;
            }
            case "remove": {
                if (users === null) {
                    return message.channel.send(i18n.__("blacklist.notBlacklisted"));
                }
                const exists = users.find((u) => u.userId === member.id);
                if (!exists) {
                    return message.channel.send(i18n.__("blacklist.notBlacklisted"));
                }

                await blacklistModel.findOneAndDelete({ userId: member.id });
                return message.channel.send(i18n.__("blacklist.userWhitelisted"))
                break;
            }
            default: {
                return message.channel.send(i18n.__("blacklist.noType"))
            }
        }
    }
}
