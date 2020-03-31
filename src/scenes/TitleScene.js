import 'phaser'

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.handleClick = this.handleClick.bind(this)
  }

  preload() {
    this.load.image('background', 'assets/sprites/titleBg.png');
	}

	create() {
    const titleSceneBackground = this.add.sprite(0,0,'background');
    titleSceneBackground.setOrigin(0,0);
    this.add.text(120,100, 'SOKO-CITY', {fontSize: '70px'});

    const text = this.add.text(220,320, 'start game', {fontSize: '30px'});
    text.setInteractive({ useHandCursor: true });
    text.on('pointerdown', () => this.handleClick());

	}

  handleClick() {
    this.cameras.main.fadeOut(500);

    const startWorldScene = () => {
      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.scene.bringToTop('UIScene')
          this.scene.launch('UIScene');
          this.scene.start('WorldScene');
        }
      })
    }
    startWorldScene()
  }
}

export default TitleScene

