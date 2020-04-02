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
            restart: !prev.restartGame
          }
        })
        this.sys.game.destroy(true)
        restartGame(firebase.auth().currentUser.email)
      }
    })
  }
  // }, this);

  // const goBackToTitle = () => {
  //   this.time.addEvent({
  //     delay: 500,
  //     callback: () => {
  //       restartGame(firebase.auth().currentUser.email)
  //       console.log('hello, callback')
  //       this.scene.start('TitleScene')
  //     }
  //   })
}
//esther: nothing is set up for the handle click routing call because I wanted to let you set it up properly
// }
// }

export default EndScene
