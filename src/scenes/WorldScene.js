import Player from '../entity/Player'

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  preload() {
    //preload tileset
    this.load.image('tiles', 'assets/tileSets/tileset.png')

    //preload map
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json')

    //preload player sprite
    this.load.spritesheet('player', 'assets/sprites/playerSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  create() {

    //creating static map and obstacle layers
    const map = this.make.tilemap({ key: 'map' })
    const tiles = map.addTilesetImage('spritesheet', 'tiles')
    const grass = map.createStaticLayer('Grass', tiles, 0, 0)
    const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0)

    //establishing collision rules for obstacle layer
    obstacles.setCollisionByExclusion([-1])

    //adding player 
    this.player = new Player(this, 50, 100, 'player')

    //setting our world bounds
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    //setting collision rules for player
    this.physics.add.collider(this.player, obstacles)
    this.player.setCollideWorldBounds(true)

    //setting camera 
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(3)

    //setting keyboard input for movement
    this.cursors = this.input.keyboard.createCursorKeys()

    //animating sprite motion
    this.createAnimations()
  }

  //creating animation sequence for player movement
  createAnimations() {
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

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 3 }],
      frameRate: 10,
    })
  }

  update(time, delta) {
    this.player.update(this.cursors)
  }
}