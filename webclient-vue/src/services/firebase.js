import firebase from 'firebase/app'
import 'firebase/firestore'

export const db = firebase.initializeApp({projectId: 'rythmaddon'}).firestore()

console.log("firebase initialized")