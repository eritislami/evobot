const {MessageEmbed} = require('discord.js')
module.exports={
    name: 'apakah',
    description: 'gabut buat klean',
    category: 'fun',
    usage: "<question>",
    run: async(bot,message,args) => {
        let question = message.content.split(bot.prefix.length+6)
        if(!question){
            return message.replay("tidak ada pertanyaan")
        } else {
            let response = [
                "ya",
                "tidak",
                "bisa jadi",
                "iya kah?",
                "ngak mungkin",
            ]
            let response = responses[Math.floor(math.random() * (responses.length)-1)]
            

        }
        }
    }
