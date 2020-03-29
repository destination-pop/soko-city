/*
import 'phaser'
import phaserConfig from '../config/phaserConfig'
import { firebaseConfig } from '../config/firebaseConfig'
import MainScene from '../scenes/MainScene'
import WorldScene from '../scenes/WorldScene'
import UIScene from '../scenes/UIScene'
import TitleScene from '../scenes/TitleScene'
import React from 'react'

class phaserGame extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig)

    //Add all the scenes
    this.scene.add('MainScene', MainScene)
    this.scene.add('UIScene', UIScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('WorldScene', WorldScene)

    //Start the game with the main scene
    this.scene.start('TitleScene')
  }
}

export default class Game extends React.Component {
  componentDidMount() {
    new phaserGame
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div id="phaser-game" />
  }
}
*/
/*
//OLD
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
*/

import 'phaser'
import phaserConfig from '../config/phaserConfig'
import { firebaseConfig } from '../config/firebaseConfig'
import MainScene from '../scenes/MainScene'
import WorldScene from '../scenes/WorldScene'
import TitleScene from '../scenes/TitleScene'
import TransitionScene from '../scenes/TransitionScene'
import React from 'react'

class phaserGame extends Phaser.Game {
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

export default class Game extends React.Component {
  componentDidMount() {
    new phaserGame
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div id="phaser-game" />
  }
}
