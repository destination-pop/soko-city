import 'phaser'

class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene');
    this.handleClick = this.handleClick.bind(this)
  }

	create() {
    this.add.text(120,100, 'Level Complete', {fontSize: '50px'});

    const text = this.add.text(220,320, 'ready for next level', {fontSize: '30px'});
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => this.handleClick());

	}

  handleClick() {
    this.scene.bringToTop('UIScene')
    this.scene.start('WorldScene');
  }
}

export default TransitionScene

