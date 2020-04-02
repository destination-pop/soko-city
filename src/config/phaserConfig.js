const phaserConfig = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320 * 2,
  height: 240 * 2,
  // zoom: 3,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  parent: 'phaser-game'
}

export default phaserConfig
