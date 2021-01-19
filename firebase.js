var admin = require("firebase-admin");
const { FIREBASE_ACCOUNT } = require("./util/EvobotUtil");
const songHistoryDb = "song_history";
const songAggregateDb = "song_aggregate";

let db;
if (FIREBASE_ACCOUNT) {
  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_ACCOUNT)
  });
  db = admin.firestore();
} else {
  console.warn("No firebase account specified. Data will not be recorded in the database.")
}

function createSongHistoryDbJson(song) {
  const searchParams = new URLSearchParams(new URL(song.url).search);
  const songId = searchParams.get('v');
  return {
    id: songId,
    duration: song.duration,
    time: Date.now(),
    title: song.title,
    url: song.url,
    user: song.user.id,
  }
}

async function updateSongAggregate(songRef) {
  if (!db) return;

  songDoc = await songRef.get();
  songId = songDoc.data().id;
  songAggregateRef = await db.collection(songAggregateDb).doc(songId).get();
  let s;
  if(songAggregateRef.exists) {
    s = songAggregateRef.data();
    s.play_count++;
    s.last_played = Date.now();
    s.song_history.push(songRef.id);
  } else {
    s = {
      play_count: 1,
      last_played: Date.now(),
      song_history: [songRef.id]
    };
  }

  await db.collection(songAggregateDb).doc(songId).set(s);
}

module.exports = {
  async getAllSongHistory() {
    if (!db) return;
    const docRef = await db.collection(songAggregateDb).get();
    return docRef.docs.map(d => d.data());
  },

  async getMostPlayedSongs(count) {
    if (!db) return;
    songs = await db.collection(songAggregateDb).orderBy('play_count', 'desc').limit(count).get();
    data = songs.docs.map(doc => {
      data = doc.data();
      return {
        id: doc.id,
        play_count: data.play_count
      };
    });
    console.debug(data);
    return data;
  },

  // TODO: make it work async
  async saveSong(song) {
    if (!db) return;
    console.debug(song);

    songHistoryDocRef = await db.collection(songHistoryDb).add(createSongHistoryDbJson(song));
    updateSongAggregate(songHistoryDocRef);
  }
}