import 'phaser'

class TransitionScene extends Phaser.Scene {
  constructor() {
    super('TransitionScene');
  }

	create() {
    this.add.text(110,100, 'Level Complete', {fontSize: '50px'});

    this.add.text(100,240, 'You solved the challenge.', {fontSize: '30px'})
    this.add.text(145,280, 'But where is Lola?', {fontSize: '30px'})
    this.add.text(110,320, 'Better keep searching...', {fontSize: '30px'})

    this.time.addEvent({
      delay: 3500,
      callback: () => {
        this.scene.start('WorldScene');
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene')      }
    })
	}

}

export default TransitionScene

