const phaserConfig = {
  type: Phaser.AUTO,
  width: 320 * 2,
  height: 240 * 2,
  parent: 'phaser-game',
  // zoom: 3,
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
