const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const {NASA_API_KEY} = require("../config.json");

module.exports = {
  name: "earth",
  description: "Gets earth image from NASA server",
  execute(message) {
        var waitEmbed = new MessageEmbed()
            .setTitle("Please wait...")
            .setDescription("Connecting to NASA server")
            .setColor("#101010")
        message.channel.send(waitEmbed).then(msg => {
            var earth_link = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`

            fetch(earth_link)
            .then(res => res.json())
            .then((out) => {
                var earth_output = out;

                var randomNumber = getRandomNumber(0, earth_output.length - 1)
                var image_name = earth_output[randomNumber].image

                var date = earth_output[randomNumber].date;
                var date_split = date.split("-")

                var year = date_split[0];

                var month = date_split[1];

                var day_and_time = date_split[2];
                var sliced_date = day_and_time.slice(0, 2);

                var image_link = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${sliced_date}/png/` + image_name + ".png";

                var a = new MessageEmbed()
                .setTitle("Earth image")
                .setImage(image_link)
                .setFooter(`${earth_output[randomNumber].caption} on ${date}`);
                msg.edit(a);
            });
        });

        
        function getRandomNumber(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
  }
}