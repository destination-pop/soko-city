import 'phaser';
import phaserConfig from './config/phaserConfig'
import { firebaseConfig } from './config/firebaseConfig'
import MainScene from './scenes/MainScene'
import WorldScene from './scenes/WorldScene'
import UIScene from './scenes/UIScene'

class Game extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig);

    //Add all the scenes
    this.scene.add('WorldScene', WorldScene)
    this.scene.add('MainScene', MainScene)
    this.scene.add('UIScene', UIScene)

    //Start the game with the main scene
    this.scene.start('MainScene')
  }
}

window.onload = function () {
  window.game = new Game();
}
