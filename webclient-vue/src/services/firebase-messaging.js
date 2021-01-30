console.log("loaded firebase-messaging");
import firebase from "firebase/app";
import 'firebase/messaging';
firebase.initializeApp({
    apiKey: "AIzaSyAY8gkLsWN_eXa8n5tQuW_gDTbQb_B8TXA",
    authDomain: "rythmaddon.firebaseapp.com",
    projectId: "rythmaddon",
    storageBucket: "rythmaddon.appspot.com",
    messagingSenderId: "228144690061",
    appId: "1:228144690061:web:73c9367b5252910a7c43c4",
    measurementId: "G-5K0WNXJG2C"
});

console.log('setting up firebase messaging');

const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log('Message received: ', payload);
});