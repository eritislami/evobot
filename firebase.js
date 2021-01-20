var admin = require("firebase-admin");
const { FIREBASE_CONFIG } = require("./util/EvobotUtil");
const songHistoryDb = FIREBASE_CONFIG.song_history_collection;
const songAggregateDb = FIREBASE_CONFIG.song_aggregate_collection;

let db;
if (FIREBASE_CONFIG) {
  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_CONFIG)
  });
  db = admin.firestore();
} else {
  console.warn("No firebase account specified. Data will not be recorded in the database.")
}

function getSongIdFromUrl(url) {
  const searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get('v');
}

function createSongHistoryDbJson(song) {
  const songId = getSongIdFromUrl(song.url);
  return {
    id: songId,
    played_at: Date.now(),
    user: {
      id: song.user.id,
      username: song.user.username
    },
    schema_version: FIREBASE_CONFIG.schema_version
  }
}

async function updateSongAggregate(song, songRefId) {
  if (!db) return;

  songId = getSongIdFromUrl(song.url);
  songAggregateRef = await db.collection(songAggregateDb).doc(songId).get();
  let s;
  if(songAggregateRef.exists) {
    s = songAggregateRef.data();
    s.play_count++;
    s.last_played = Date.now();
    s.song_history.push(songRefId);
  } else {
    s = {
      title: song.title,
      duration: song.duration,
      url: song.url,
      play_count: 1,
      last_played: Date.now(),
      last_played_by: {
        id: song.user.id,
        username: song.user.username,
      },
      song_history: [songRefId],
      schema_version: FIREBASE_CONFIG.schema_version
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
      return doc.data();
    });
    //console.debug(data);
    return data;
  },

  async saveSong(song) {
    if (!db) return;
    //console.debug(song);

    songHistoryDocRef = await db.collection(songHistoryDb).add(createSongHistoryDbJson(song));
    updateSongAggregate(song, songHistoryDocRef.id);
  }
}