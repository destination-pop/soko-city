import 'phaser'

class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene')
    this.handleClick = this.handleClick.bind(this)
  }

  create(data) {
    this.add.text(120, 100, 'Level Complete', { fontSize: '50px' })

    const text = this.add.text(220, 320, 'ready for next level', {
      fontSize: '30px'
    })
    text.setInteractive({ useHandCursor: true })
    text.on('pointerdown', () => this.handleClick())
    this.levelConfig = data
  }

  handleClick() {
    this.scene.start('WorldScene', this.levelConfig)
    // this.scene.launch('UIScene')
    this.scene.bringToTop('UIScene')
  }
}

export default TransitionScene
