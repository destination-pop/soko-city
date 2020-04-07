import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    //Start the scene with the title scene
    this.scene.start('TitleScene')
  }
}
