import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: "soko-city",
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

firebase.initializeApp(firebaseConfig);

// const db = firebase.firestore();
const Auth = firebase.auth();
const db = firebase.database();
const gamesRef = dbRef.ref('games')
const usersRef = dbRef.ref('users')
const auth = null;

export {
  Auth,
  db,
  gamesRef,
  usersRef,
  auth
}
