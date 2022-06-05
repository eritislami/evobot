const i18n = require("../util/i18n");
const vrchat = require("vrchat");
const { VRCUSERNAME, VRCPWD } = require("../util/Util");
const { NotificationType } = require("vrchat");

const configuration = new vrchat.Configuration({
  username: VRCUSERNAME,
  password: VRCPWD
});

const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const FriendsApi = new vrchat.FriendsApi(configuration);
const UsersApi = new vrchat.UsersApi(configuration);
const NotificationApi = new vrchat.NotificationsApi(configuration);

module.exports = {
  name: "vrcaccept",
  //description: i18n.__("vrcadd.description"),
  execute(message) {
    let friends = [];

    NotificationApi.getNotifications(NotificationType.FriendRequest).then(resp => {
      console.log(resp.data);
      return Promise.all(resp.data.map((notif) => {
        NotificationApi.acceptFriendRequest(notif.id).then(resp => {
          friends.push(notif.senderUserName);
        })
      }));
    });

    // if (friends.length > 0) {
    //   NotificationApi.clearNotifications().then(() => {});
    // }

    return message
      .reply(friends.length > 0 ? `Accepted friend requests from ${friends.length > 1 ? friends.join(", ") : friends[0]}` : 'No friend requests to accept.')
      .catch(console.error);
  }
};