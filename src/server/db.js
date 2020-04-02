import { db } from '../config/firebaseConfig'

const games = db.collection('games')

export function saveLevelProgression(signedInUser, currentLevel) {
  games
    .doc(signedInUser)
    .set({
      level: currentLevel,
      completed: false
    })
    .then(console.log('Your progress has been saved.'))
    .catch(function(error) {
      console.error('Your progress could not be saved.')
    })
}

export function endGame(signedInUser) {
  games
    .doc(signedInUser)
    .set({
      level: 5,
      completed: true
    })
    .then(console.log('Congratulations on completing our game!'))
    .catch(function(error) {
      console.error('Uh oh, something broke.')
    })
}

export function restartGame(signedInUser) {
  games
    .doc(signedInUser)
    .set({ level: 1, completed: false })
    .then(console.log('Game has been reset. Good luck.'))
    .catch(function(error) {
      console.log('Uh oh, something broke.')
    })
}
