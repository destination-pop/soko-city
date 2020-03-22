import 'phaser';
import phaserConfig from './config/phaserConfig'
import { firebaseConfig } from './config/firebaseConfig'
import MainScene from './scenes/MainScene'
import WorldScene from './scenes/WorldScene'

class Game extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig);

    this.scene.add('WorldScene', WorldScene)
    this.scene.add('MainScene', MainScene)

    this.scene.start('MainScene')
  }
}

window.onload = function () {
  window.game = new Game();
}