import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { API_KEY, AUTH_DOMAIN } from './secrets'

export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: 'soko-city',
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const Auth = firebase.auth()
