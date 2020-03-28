import 'phaser'

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.handleClick = this.handleClick.bind(this)
  }

  preload() {
    // this.load.image('background', 'images/background.jpg');
    console.log('preloading the titlescene')
	}

	create() {
  //   const bg = this.add.sprite(0,0,'background');
  //   bg.setOrigin(0,0);
    this.add.text(320,100, 'SOKO-CITY');

    const text = this.add.text(320,200, 'Start!');
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => this.handleClick());

	}

  handleClick() {
    console.log("in the handle click function")
    this.scene.start('WorldScene');
  }
}

export default TitleScene

