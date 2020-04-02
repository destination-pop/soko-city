import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    // console.log(this.game.react.state)
    //Start the scene with the title scene
    this.scene.start('TitleScene')
  }
}
