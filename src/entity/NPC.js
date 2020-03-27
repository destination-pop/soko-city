import 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, frame) {
    super(scene, x, y, spriteKey, frame);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this)
    this.body.setVelocityX(0)
    this.body.setVelocityY(0)
  }

}
