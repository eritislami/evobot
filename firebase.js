var admin = require("firebase-admin");
const { FIREBASE_CONFIG } = require("./util/EvobotUtil");
const songHistoryDb = FIREBASE_CONFIG.song_history_collection;
const songAggregateDb = FIREBASE_CONFIG.song_aggregate_collection;
const fredSessionDb = FIREBASE_CONFIG.fred_session_collection;
let currentSession = null;

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
    title: song.title,
    url: song.url,
    queued_at: Date.now(),
    user: {
      id: song.user.id,
      username: song.user.username,
      displayAvatarURL: song.user.displayAvatarURL(),
    },
    session: currentSession,
    schema_version: FIREBASE_CONFIG.schema_version
  }
}

async function updateSongAggregate(song, songRef) {
  if (!db) return;

  songId = getSongIdFromUrl(song.url);
  songAggregateRef = await db.collection(songAggregateDb).doc(songId).get();
  let s;
  if(songAggregateRef.exists) {
    s = songAggregateRef.data();
    s.play_count++;
    s.last_played = Date.now();
    s.song_history.push(songRef);
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
      song_history: [songRef],
      schema_version: FIREBASE_CONFIG.schema_version
    };
  }

  await db.collection(songAggregateDb).doc(songId).set(s);
}

async function startSession() {
  if (!db) return;
  
  sessionDoc = await db.collection(fredSessionDb).add({
    "start": Date.now(),
    "now_playing": [],
    "history": []
  });
  currentSession = sessionDoc.id;
  console.info(`Starting play session ${currentSession}`);
}

module.exports = {
  async stopSession() {
    if (!db) return;

    if (currentSession !== null) {
      const sessionRef = await db.collection(fredSessionDb).doc(currentSession);
      sessionRef.update({
        "end": Date.now(),
        "now_playing": []
      });
      console.info(`Ended session ${currentSession}`);
      currentSession = null;
    }
  },

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

  async playSong(song) {
    if (!db) return;
    //console.debug(song);

    const songHistoryDocRef = await db.collection(songHistoryDb).doc(song.doc_id);
    songHistoryDocRef.update({
      played_at: Date.now()
    });
    const sessionRef = await db.collection(fredSessionDb).doc(currentSession);
    const sessionData = await sessionRef.get();
    const nowPlaying = sessionData.data().now_playing
    // TODO: Fix this to allow for duplicate songs
    if (nowPlaying[0].doc_id != song.doc_id) {
      nowPlaying.shift();
    }
    sessionRef.update({
      "history": admin.firestore.FieldValue.arrayUnion(songHistoryDocRef),
      "now_playing": nowPlaying
    });
    updateSongAggregate(song, songHistoryDocRef);
    console.info(`Played ${song.title} with document id ${songHistoryDocRef.id}`);
  },

  async queueSong(song) {
    if (!db) return;

    if (currentSession == null) {
      await startSession();
    }

    const songHistoryJson = createSongHistoryDbJson(song);
    const songHistoryDocRef = await db.collection(songHistoryDb).add(songHistoryJson);
    song.doc_id = songHistoryDocRef.id;
    songHistoryJson.doc_id = songHistoryDocRef.id;
    
    const sessionRef = await db.collection(fredSessionDb).doc(currentSession);
    sessionRef.update({
      "now_playing": admin.firestore.FieldValue.arrayUnion(songHistoryJson)
    });
    console.info(`Queued ${song.title} with document id ${songHistoryDocRef.id}`);
  },
}