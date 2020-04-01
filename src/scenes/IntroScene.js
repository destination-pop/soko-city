import 'phaser'


class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene')
  }

  preload() {
    this.load.image('lola', 'assets/sprites/chicken.png')
    this.load.image('badGuy', 'assets/sprites/BadGuy.png')
    this.load.image('badGuyWithLola', 'assets/sprites/BadGuyWithChicken.png')
    this.load.image('skipButton', 'assets/sprites/skipButton.png')
  }

  create(data) {
    // Fade into the scene
    this.cameras.main.fadeIn(500)

    // Set up Skip Button
    let skipButton = this.add.image(600, 420,'skipButton').setScale(0.25)
    skipButton.setInteractive({ useHandCursor: true })
    skipButton.on('pointerdown', () => this.startLevelOne())

    //Display Initial Images and Text
    this.lola = this.add.sprite(700, 300, 'lola').setScale(.25)
    let text1 = this.add.text(20, 100, 'Your best friend Lola is hanging out...', { fontSize: '20px' })

    // let text2 = '... when a bad guy sneaks in.'
    // let text3 = 'Oh no!'
    // let text4 = "Go find Lola! And grab food along the way in case you need to pay a ransom. See if your neighbors can help you out"

    this.time.addEvent({
      delay: 3500,
      callback: startLevelOne
    })
  }

  update() {
    this.lola.x = -40
  }

  startLevelOne() {
    this.cameras.main.fadeOut(500)
    const startWorldScene = () => {
      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.scene.start('WorldScene', data)
          this.scene.launch('UIScene')
          this.scene.bringToTop('UIScene')

        }
      })
    }
    startWorldScene()
  }

}

export default IntroScene
