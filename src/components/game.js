import 'phaser'
import phaserConfig from '../config/phaserConfig'
import { firebaseConfig } from '../config/firebaseConfig'
import MainScene from '../scenes/MainScene'
import WorldScene from '../scenes/WorldScene'
import UIScene from '../scenes/UIScene'
import TitleScene from '../scenes/TitleScene'
import TransitionScene from '../scenes/TransitionScene'
import IntroScene from '../scenes/IntroScene'
import React from 'react'

class phaserGame extends Phaser.Game {
  constructor() {
    super(phaserConfig, firebaseConfig);

    //Add all the scenes
    this.scene.add('MainScene', MainScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('WorldScene', WorldScene)
    this.scene.add('UIScene', UIScene)
    this.scene.add('TransitionScene', TransitionScene)
    this.scene.add('IntroScene', IntroScene)

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
