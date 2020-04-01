import { db } from '../config/firebaseConfig'

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
