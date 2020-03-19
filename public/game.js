const BootScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function BootScene() {
    Phaser.Scene.call(this, { key: 'BootScene' })
  },

  preload: function() {
    this.load.image('tiles', 'assets/spritesheet.png')

    this.load.tilemapTiledJSON('map', 'assets/map.json')

    this.load.spritesheet('player', 'assets/RPG_assets.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  },

  create: function() {
    this.scene.start('WorldScene')
  }
})

const WorldScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function WorldScene() {
    Phaser.Scene.call(this, { key: 'WorldScene' })
  },

  preload: function() {},

  create: function() {
    const map = this.make.tilemap({ key: 'map' })
    const tiles = map.addTilesetImage('spritesheet', 'tiles')
    const grass = map.createStaticLayer('Grass', tiles, 0, 0)
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0)

    obstacles.setCollisionByExclusion([-1])

    this.player = this.physics.add.sprite(50, 100, 'player', 9)

    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels
    this.player.setCollideWorldBounds(true)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(4)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [4, 10, 4, 16]
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [4, 10, 4, 16]
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [5, 11, 5, 17]
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [3, 9, 3, 15]
      }),
      frameRate: 10,
      repeat: -1
    })

    this.physics.add.collider(this.player, obstacles)

    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone })
    for (let i = 0; i < 30; i++) {
      let x = Phaser.Math.RND.between(0, this.physics.world.bounds.width)
      let y = Phaser.Math.RND.between(0, this.physics.world.bounds.height)
      this.spawns.create(x, y, 20, 20)
    }
    this.physics.add.overlap(
      this.player,
      this.spawns,
      this.onMeetEnemy,
      false,
      this
    )
  },

  update: function(time, delta) {
    this.player.body.setVelocity(0)

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80)
      this.player.anims.play('left', true)
      this.player.flipX = true
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80)
      this.player.anims.play('right', true)
      this.player.flipX = false
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80)
      this.player.anims.play('up', true)
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80)
      this.player.anims.play('down', true)
    } else {
      this.player.anims.stop()
    }
  },

  onMeetEnemy: function(player, zone) {
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width)
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height)

    this.cameras.main.shake(300)
  }
})

const config = {
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
  },
  scene: [BootScene, WorldScene]
}

let game = new Phaser.Game(config)
