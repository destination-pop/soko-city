import 'phaser';
import phaserConfig from './config/phaserConfig'
import { firebaseConfig } from './config/firebaseConfig'
import MainScene from './scenes/MainScene'
import WorldScene from './scenes/WorldScene'
import TitleScene from './scenes/TitleScene'
import TransitionScene from './scenes/TransitionScene'

class Game extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig);

    //Add all the scenes
    this.scene.add('MainScene', MainScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('WorldScene', WorldScene)
    this.scene.add('TransitionScene', TransitionScene)

    //Start the game with the main scene
    this.scene.start('MainScene')
  }
}

window.onload = function () {
  window.game = new Game();
}
