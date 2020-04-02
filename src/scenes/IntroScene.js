import 'phaser'


class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene')
    this.startLevelOne = this.startLevelOne.bind(this)
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

    //Set up ability to trigger events on boundary collision
    this.physics.world.setBoundsCollision(true, true, false, false);

    this.time.delayedCall()

    // Set up Skip Button
    this.skipButton = this.add.sprite(580, 440,'skipButton').setScale(0.25)
    this.skipButton.setInteractive({ useHandCursor: true })
    this.skipButton.on('pointerdown', () => this.startLevelOne(data))

    //Display Images
    this.lola = this.add.sprite(450, 300, 'lola').setScale(.2)
    this.badGuy = this.add.sprite(2000, 300, 'badGuy').setScale(4)
    this.badGuyWithLola = this.add.sprite(-2460, 300, 'badGuyWithLola').setScale(4)

    //Display Text
    this.text1 = this.add.text(15, 100, 'Your best friend Lola the Chicken is hanging out...', { fontSize: '20px' })

    this.time.delayedCall(4500,
      () => {
        this.text1.setVisible(false)
        this.text2 = this.add.text(150, 180, '...when a bad guy sneaks in.', { fontSize: '20px' })
      }
    )

    this.time.delayedCall(9500,
      () => {
        this.text2.setVisible(false)
        this.text3 = this.add.text(230, 180, 'OH NO', { fontSize: '60px' })
      }
    )

    this.time.delayedCall(14000,
      () => {
        this.text3.setVisible(false)
        this.add.text(190, 180, 'Go save Lola!', { fontSize: '40px' })
        this.add.text(130, 250, 'Find food items to pay her ransom.', { fontSize: '20px' })
      }
    )

    // Proceed to next level at the end of the scene
    this.time.delayedCall(16500, () => this.startLevelOne(data))

  }

  update() {
    this.moveImage(this.lola, -2)
    this.moveImage(this.badGuy, -4)
    this.moveImage(this.badGuyWithLola, 4)
  }

  moveImage(image, speed) {
    image.x += speed
  }

  startLevelOne(data) {
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
