const phaserConfig = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320 * 3,
  height: 240 * 3,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
}

export default phaserConfig