import 'phaser'
import firebase from 'firebase'
import { restartGame } from '../server/db'

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
    this.handleClick = this.handleClick.bind(this)
  }

  create(data) {
    this.add.text(110, 100, 'Success! You rescued Lola!', { fontSize: '50px' })

    const reset = this.add.text(100, 240, 'Wanna play again?', {
      fontSize: '30px'
    })
    reset.setInteractive({ useHandCursor: true })
    reset.on('pointerdown', () => this.handleClick())
  }

  handleClick() {
    this.cameras.main.fadeOut(500)
    const goBackToTitle = () => {
      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.scene.start('TitleScene')
          restartGame(firebase.auth().currentUser.email)
        }
      })
    }
    //esther: nothing is set up for the handle click routing call because I wanted to let you set it up properly
  }
}

export default EndScene
