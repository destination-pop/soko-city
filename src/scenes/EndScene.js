import 'phaser'
import firebase from 'firebase'
import { restartGame } from '../server/db'

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene')
    this.handleClick = this.handleClick.bind(this)
  }

  preload() {
    this.load.image('lola', 'assets/sprites/chicken.png')
    this.load.image('heart', 'assets/sprites/heart.png')
    this.load.spritesheet('player', 'assets/sprites/playerSprites.png')
  }

  create() {
    this.scene.bringToTop('EndScene')

    //Display Images
    this.player = this.add.sprite(235, 300, 'player',3).setScale(6)
    this.lola = this.add.sprite(435, 320, 'lola').setScale(.1)
    this.heart = this.add.sprite(335, 260, 'heart').setScale(0.05).setVisible(false)

    //Add Text
    this.add.text(220, 100, 'Success!', { fontSize: '50px' })
    this.add.text(180, 175, 'You rescued Lola!', { fontSize: '30px' })

    //Display Reset Button
    this.time.delayedCall(1500,
      () => {
        this.heart.setVisible(true)
        this.resetButton = this.add.text(240, 370, 'Play again', {
          fontSize: '30px'
        })
        this.resetButton.setInteractive({ useHandCursor: true })
        this.resetButton.on('pointerdown', () => this.handleClick())
      }
    )
  }

  update() {
    this.moveImage(this.lola, -2)
    this.moveImage(this.player, 2)
  }

  moveImage(image, speed) {
    if (image.x < 325 || image.x > 345) {
      image.x += speed
    }
  }

  handleClick() {
    this.cameras.main.fadeOut(500)
    this.time.addEvent({
      delay: 550,
      callback: () => {
        this.sys.game.destroy(true)
        this.game.react.setState(prev => {
          return {
            restart: !prev.restart,
            gameExists: false
          }
        })
        firebase.auth().currentUser.email
          ? restartGame(firebase.auth().currentUser.email)
          : null
      }
    })
  }
}

export default EndScene
