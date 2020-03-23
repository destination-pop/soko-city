const phaserConfig = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320 * 2,
  height: 240 * 2,
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
