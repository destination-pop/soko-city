import 'phaser';

export default class SokoBox extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.scene.events.on('update', this.update, this)
  } 

  update() {
    this.updateMovement()
  }

  updateMovement() {
    if (this.body.touching.right) {
      this.body.setImmovable(false)
      this.body.setVelocityX(-80)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    } else if (this.body.touching.left) {
      this.body.setImmovable(false)
      this.body.setVelocityX(80)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    } else if (this.body.touching.down) {
      this.body.setImmovable(false)
      this.body.setVelocityY(-80)
      this.body.setVelocityX(0)
      this.body.setBounce(0)
    } else if (this.body.touching.up) {
      this.body.setImmovable(false)
      this.body.setVelocityY(80)
      this.body.setVelocityX(0)
      this.body.setBounce(0)
    } else if (this.body.touching.up && this.body.touching.down) {
      this.body.setImmovable(true)
      this.body.setVelocityX(0)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    } else if (this.body.touching.left && this.body.touching.right) {
      this.body.setImmovable(true)
      this.body.setVelocityX(0)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    } else if (this.body.touching.left && this.body.touching.right && this.body.touching.up && this.body.touching.down) {
      this.body.setImmovable(true)
      this.body.setVelocityX(0)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    } else {
      this.body.setImmovable(true)
      this.body.setVelocityX(0)
      this.body.setVelocityY(0)
      this.body.setBounce(0)
    }
  }

}

