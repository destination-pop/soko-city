import 'phaser';
import config from './config/config'
import MainScene from './scenes/MainScene'
import WorldScene from './scenes/WorldScene'

class Game extends Phaser.Game {
  constructor() {
    super(config);

    //Add all the scenes
    this.scene.add('WorldScene', WorldScene)
    this.scene.add('MainScene', MainScene)

    //Start the game with the main scene
    this.scene.start('MainScene')
  }
}

window.onload = function () {
  window.game = new Game();
}
