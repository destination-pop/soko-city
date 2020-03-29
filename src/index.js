import 'phaser';
import phaserConfig from './config/phaserConfig'
import { firebaseConfig } from './config/firebaseConfig'
import MainScene from './scenes/MainScene'
import WorldScene from './scenes/WorldScene'
import UIScene from './scenes/UIScene'
import TitleScene from './scenes/TitleScene'

class Game extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig);

    //Add all the scenes
    this.scene.add('MainScene', MainScene)
    this.scene.add('UIScene', UIScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('WorldScene', WorldScene)

    //Start the game with the main scene
    this.scene.start('TitleScene')


  }
}

window.onload = function () {
  window.game = new Game();
}
