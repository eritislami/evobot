var admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");

const { FIREBASE_ACCOUNT } = require("./util/EvobotUtil");
const songHistoryDb = "song_history";

let db;

if (FIREBASE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_ACCOUNT)
  });
  db = admin.firestore();
} else {
  console.warn("No firebase account specified. Data will not be recorded in the database.")
}

module.exports = {
  async getAllSongHistory() {
    if (!FIREBASE_ACCOUNT) return;
    const docRef = db.collection(songHistoryDb).get();
    docRef.forEach((doc) => {
      console.log(doc.data());
    });

    return docRef;
  },

  // TODO: make it work async
  saveSong(song) {
    if (!FIREBASE_ACCOUNT) return;
    const songJson = JSON.parse(JSON.stringify(song));
    console.info(song);
    const searchParams = new URLSearchParams(new URL(song.url).search);
    const songId = searchParams.get('v');
    console.info(`Video ID: ${songId}`);
    const doc = db.collection(songHistoryDb).doc(songId);
    const timestamp = Date.now();
    
    doc.get().then(docData => {
      if (docData.exists) {
        console.info(`${songId} already exists: ${doc.data()}`);
        songJson = JSON.parse(doc.data);
        songJson.user.append({
          id: song.user.id,
          username: song.user.username,
          time: timestamp
        });
        songJson.totalPlays += 1;
        songJson.lastPlay = timestamp;
        doc.set(songJson);
        }
    });
    if (doc.data) {
      
    } else {
      console.info(`${songId} not found`);
      try {
        songJson.user = [{
          id: song.user.id,
          username: song.user.username,
          time: timestamp
        }];
        songJson.totalPlays =  1;
        songJson.lastPlay = timestamp;
        doc.set(songJson);
      } catch(err) {
        console.error(err);
      }
    }
  }
}