const i18n = require("../util/i18n");
const vrchat = require("vrchat");
const { VRCUSERNAME, VRCPWD } = require("../util/Util");

const configuration = new vrchat.Configuration({
  username: VRCUSERNAME,
  password: VRCPWD
});

const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const FriendsApi = new vrchat.FriendsApi(configuration);
const UsersApi = new vrchat.UsersApi(configuration);

module.exports = {
  name: "vrcadd",
  description: i18n.__("vrcadd.description"),
  execute(message, args) {
    if (!args.length || args[0].length === 0) return message.reply(i18n.__mf("vrcadd.usageReply", { prefix: message.client.prefix }));

    AuthenticationApi.getCurrentUser().then(resp => {
        console.log(`VRC Bot: ${resp.data.displayName} Online`);
        console.log(`Accessed from command`);
    });
    
    let response = 'test';

    UsersApi.getUserByName(args[0]).then(user => {
        console.log(user.data.displayName);
        return Promise.all(FriendsApi.friend(user.data.id).then(resp => {
          response = `User found - Sent friend request to ${user.data.displayName}!`;
          console.log(user.data.id);
        }).catch(err =>{
          response = 'Friend request failed to send. Please verify your VRC account name.';
      }));
    }).catch(err =>{
        response = 'Friend request failed to send. Please verify your VRC account name.';
    });

    return message
      .reply(response)
      .catch(console.error);
  }
};