import 'phaser';

export default class InventoryItem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.physics.world.enable(this) //enabling physics
    this.scene.add.existing(this);
  }

  //----------------THE SECTION BELOW WILL BE UPDATED---------------------
  //-----------WHEN WE WRITE CODE FOR DROPPING INVENTORY OFF AGAIN---Jas--

  // update() {
    // << INSERT CODE HERE >>
  // }
}
