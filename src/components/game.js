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
import EndScene from '../scenes/EndScene'

class phaserGame extends Phaser.Game {
  constructor(react) {
    super(phaserConfig, firebaseConfig)
    this.react = react

    //Add all the scenes
    this.scene.add('MainScene', MainScene)
    this.scene.add('TitleScene', TitleScene)
    this.scene.add('WorldScene', WorldScene)
    this.scene.add('UIScene', UIScene)
    this.scene.add('TransitionScene', TransitionScene)
    this.scene.add('IntroScene', IntroScene)
    this.scene.add('EndScene', EndScene)

    //Start the game with the main scene
    this.scene.start('MainScene')
  }
}

export default class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      restart: false
    }
  }
  componentDidMount() {

  }

  render() {
    this.game = new phaserGame(this)
    console.log(this.state)
    return <div id="phaser-game" />
  }
}
