const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { KSOFT_API_KEY } = require("../config.json");

module.exports = {
    name: "lyrics",
    description: "Displays lyrics of given song name",
    async execute(message, args) {

        if (!KSOFT_API_KEY)
            return message.reply("Missing Ksoft api key in config").catch(console.error);

        if (!args.length)
            return message.reply(`Usage: ${message.client.prefix}lyrics <Song Name>`).catch(console.error);

        const search = args.join(" ");
        let response = await fetch('https://api.ksoft.si/lyrics/search?q=' + search, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KSOFT_API_KEY}`
            }
        }).then((res) => {
            status = res.status;
            return res.json()
        });

        if (status == 200) {
            const title = response.data[0].name;
            const artist = response.data[0].artist;
            const thumbnail = response.data[0].album_art;
            const lyrics = response.data[0].lyrics;
            const album_year = response.data[0].album_year;

            let lyricsembed = new MessageEmbed();
            let lyricsembedsecond = new MessageEmbed();

            if (String(lyrics).length >= 2048) {
                const first = String(lyrics).slice(0, 2047);
                const second = String(lyrics).slice(2047, String(lyrics).length);
                lyricsembed.setTitle(title + ' by ' + artist);
                lyricsembed.setThumbnail(thumbnail);
                lyricsembed.setColor('#F8AA2A');
                lyricsembed.setDescription(first + '...');
                message.channel.send(lyricsembed);
                lyricsembedsecond.setColor('#F8AA2A');
                lyricsembedsecond.setDescription('...' + second);
                lyricsembedsecond.setFooter('Published in the year ' + album_year);
                message.channel.send(lyricsembedsecond);
            } else {
                lyricsembed.setTitle(title + ' by ' + artist);
                lyricsembed.setThumbnail(thumbnail);
                lyricsembed.setColor('#F8AA2A');
                lyricsembed.setDescription(String(lyrics));
                lyricsembed.setFooter('Published in the year ' + album_year);
                message.channel.send(lyricsembed);
            }
        } else {
            message.channel.send('Unexpected Api error occured while grabbing song lyrics');
        }
    }
};