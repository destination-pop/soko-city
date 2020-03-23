import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import {populateInventoryBar, pickUpItem} from '../entity/utilityFunctions'

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

    //preload inventory item sprites
    this.load.spritesheet('cookie', 'assets/sprites/foodSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet('avocado', 'assets/sprites/foodSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    //preload backgound color for the inventory bar
    this.load.image('graySquare', 'assets/sprites/graySquare.png')

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

    //adding the inventory items (sprinkled throughout the scene)
    //NOTE: There is a bug with collisions & static groups, so we create one by one
    this.inventoryItems = {}
    this.inventoryItems.cookie = new InventoryItem(this, 130, 70, 'cookie')
    this.inventoryItems.avocado = new InventoryItem(this, 50, 260, 'avocado')

    //creating and populating the inventory bar
    populateInventoryBar(this, 'cookie','avocado')

    //setting our world bounds
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    //setting collision rules for player
    this.physics.add.collider(this.player, obstacles)
    this.physics.add.overlap(this.player, this.inventoryItems.cookie, this.pickUpItem, null, this)
    this.physics.add.overlap(this.player, this.inventoryItems.avocado, this.pickUpItem, null, this)
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

  //callback for player/inventory item overlap
  pickUpItem(player, item) {
    item.disableBody(true, true)
    item.setVisible(false)
    this.inventoryBar.children.entries.forEach(el=>{
      if (item.texture.key === el.texture.key) {
        el.clearTint()
      }
    })
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
