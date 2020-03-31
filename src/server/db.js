import { db, Auth } from '../config/firebaseConfig'
import firebase from 'firebase'

const games = db.collection('games')
import 'babel-polyfill'

export function saveLevelProgression(signedInUser, currentLevel) {
  games
    .doc(signedInUser)
    .set({
      level: currentLevel
    })
    .then(console.log('Your progress has been saved.'))
    .catch(function(error) {
      console.error('Your progress could not be saved.')
    })
}

export function getSavedData(signedInUser) {
  games
    .doc(signedInUser)
    .get()
    .then(doc => {
      doc.data()
    })
    .catch(function(error) {
      console.error('Your save data could not be loaded')
    })
}

// async function getSaveData(signedInUser) {
//   try {
//     let saveData = games.doc(signedInUser).get()
//     return saveData.doc()
//   } catch (error) {
//     console.error('Could not retrieve data.')
//   }
// }

// export default getSaveData
