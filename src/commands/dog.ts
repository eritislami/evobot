const axios = require('axios');
const command: Command = {
    name: 'dog',
    description: 'Sends a random dog picture',
    aliases: ['doggo'],
    execute: async (message, args) => {
      axios.get("https://dog.ceo/api/breeds/image/random")
        .then(response => {
          message.channel.send(response.data.message);
        });
    }
}
module.exports = command;
