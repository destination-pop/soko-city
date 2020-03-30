import 'phaser';

export default class SokoBox extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, frame) {
    super(scene, x, y, spriteKey, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.scene.events.on('update', this.update, this)
  } 

  update(cursors) {
    this.updateMovement(cursors)
  }

  updateMovement() {
    if (this.body.touching.right) {
      this.body.setVelocityX(-80)
      this.body.setVelocityY(0)
      this.body.setBounce(0, 0)
    } else if (this.body.touching.left) {
      this.body.setVelocityX(80)
      this.body.setVelocityY(0)
      this.body.setBounce(0, 0)
    } else if (this.body.touching.down) {
      this.body.setVelocityY(-80)
      this.body.setVelocityX(0)
      this.body.setBounce(0, 0)
    } else if (this.body.touching.up) {
      this.body.setVelocityY(80)
      this.body.setVelocityX(0)
      this.body.setBounce(0, 0)
    } else if (this.body.touching.up && this.body.touching.down) {
      this.body.setVelocity(0, 0)
      this.body.setBounce(0, 0)
    } else if (this.body.touching.left && this.body.touching.right) {
      this.body.setVelocity(0, 0)
      this.body.setBounce(0, 0)
    } else {
      this.body.setVelocity(0)
      this.body.setBounce(0, 0)
    }
  }

}