import 'phaser'
import firebase from 'firebase'
import { restartGame } from '../server/db'

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
    this.handleClick = this.handleClick.bind(this)
  }

  create() {
    this.add.text(110, 100, 'Success!', { fontSize: '50px' })
    this.add.text(110, 175, 'You rescued Lola!', { fontSize: '20px' })

    const reset = this.add.text(110, 300, 'Play again', {
      fontSize: '30px'
    })
    reset.setInteractive({ useHandCursor: true })
    reset.on('pointerdown', () => this.handleClick())
  }

  handleClick() {
    this.cameras.main.fadeOut(500)
    this.time.addEvent({
      delay: 550,
      callback: () => {
        this.game.react.setState(prev => {
          return {
            restart: !prev.restart
          }
        })
        this.sys.game.destroy(true)
        firebase.auth().currentUser.email
          ? restartGame(firebase.auth().currentUser.email)
          : null
      }
    })
  }
}

export default EndScene
