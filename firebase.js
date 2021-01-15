var admin = require("firebase-admin");

var serviceAccount = require("./rythmaddon-firebase-adminsdk-l059e-fd6702435f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  async getAllSongHistory() {
    const docRef = admin.firestore().collection("song_history").doc("o78wkOea9TnK5DSylo29");
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log("Document not found");
    } else {
      const data = doc.data();
      console.log(`Data: ${JSON.stringify(data)}`)
    }

    return doc;
  }
}