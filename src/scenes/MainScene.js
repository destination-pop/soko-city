import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // this.scene.launch('WorldScene')

    //Start the scene with the title scene
    this.scene.start('TitleScene')
  }
}
