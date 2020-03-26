import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.scene.launch('QuestScene')
    this.scene.launch('WorldScene')
    this.scene.launch('UIScene')
  }
}
