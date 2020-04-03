import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { API_KEY, AUTH_DOMAIN, STORAGE_BUCKET, DATABASE_URL } from './secrets'

export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: 'soko-city',
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const Auth = firebase.auth()
export const storage = firebase.storage()
