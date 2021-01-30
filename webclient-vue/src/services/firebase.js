import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyAY8gkLsWN_eXa8n5tQuW_gDTbQb_B8TXA",
    authDomain: "rythmaddon.firebaseapp.com",
    projectId: "rythmaddon",
    storageBucket: "rythmaddon.appspot.com",
    messagingSenderId: "228144690061",
    appId: "1:228144690061:web:73c9367b5252910a7c43c4",
    measurementId: "G-5K0WNXJG2C"
});

const db = firebase.firestore()
const auth = firebase.auth()

const songAggregateCollection = db.collection('song_aggregate_test')
const songHistoryCollection = db.collection('song_history_test')

export {
    db,
    auth,
    songAggregateCollection,
    songHistoryCollection
}