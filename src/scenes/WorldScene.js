import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import {populateInventoryBar} from '../entity/utilityFunctions'
import {puzzle, puzzleConfig} from '../puzzles/converter'

let groundLayer
let objectLayer
let map

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')
  }

  preload() {

    //preload tilesets for map and puzzle map
    this.load.image('tiles', 'assets/tileSets/overworld.png')
    this.load.image('puzzleTiles', 'assets/tileSets/puzzleTileset.png')

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
    //setting up dynamic map and object layers
    map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 75,
      height: 75
    })

    var tiles = map.addTilesetImage('tiles')

    groundLayer = map.createBlankDynamicLayer('Ground Layer', tiles)
    objectLayer = map.createBlankDynamicLayer('Object Layer', tiles)

    // Walls & corners of the room
    groundLayer.fill(1, 0, 0, map.width, 1)
    groundLayer.fill(43, 0, map.height - 1, map.width, 1)
    groundLayer.fill(21, 0, 0, 1, map.height)
    groundLayer.fill(23, map.width - 1, 0, 1, map.height)
    groundLayer.putTileAt(0, 0, 0)
    groundLayer.putTileAt(2, map.width - 1, 0)
    groundLayer.putTileAt(44, map.width - 1, map.height - 1)
    groundLayer.putTileAt(42, 0, map.height - 1)

    randomizeWorld() // Initial randomization
    // un-comment below to randomize world on-click
    // this.input.on('pointerdown', randomizeWorld)

    //adding player
    this.player = new Player(this, 50, 100, 'player')

    //adding the inventory items (sprinkled throughout the scene)
    //NOTE: There is a bug with collisions & static groups, so we create one by one
    this.inventoryItems = {}
    this.inventoryItems.cookie = new InventoryItem(this, 130, 70, 'cookie')
    this.inventoryItems.avocado = new InventoryItem(this, 50, 260, 'avocado')

    //creating and populating the inventory bar
    populateInventoryBar(this, 'cookie', 'avocado')

    this.inventoryItems.cookie.setScrollFactor(0)
    //setting our world bounds
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    //setting collision rules for player
    this.physics.add.collider(this.player, objectLayer) //blocks off trees
    this.physics.add.collider(this.player, groundLayer) //block off the edges

    this.physics.add.overlap(
      this.player,
      this.inventoryItems.cookie,
      this.pickUpItem,
      null,
      this
    )
    this.physics.add.overlap(
      this.player,
      this.inventoryItems.avocado,
      this.pickUpItem,
      null,
      this
    )

    //blocking off the edges
    this.player.setCollideWorldBounds(true)
    objectLayer.setCollisionByExclusion([-1])
    groundLayer.setCollisionByExclusion([22, 45, 46])

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
    this.inventoryBar.children.entries.forEach(el => {
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
      frameRate: 10
    })
  }

  update(time, delta) {
    this.player.update(this.cursors)
  }
}

function randomizeWorld() {
  // Fill the floor with random ground tiles
  groundLayer.weightedRandomize(1, 1, map.width - 2, map.height - 2, [
    { index: 22, weight: 10 }, // Regular grass
    { index: 45, weight: 1 }, // One leaf
    { index: 46, weight: 1 } // Two leaves
  ])

  // Fill the floor with random, weighted tiles
  objectLayer.weightedRandomize(1, 1, map.width - 2, map.height - 2, [
    { index: -1, weight: 50 }, // Empty tile
    { index: 91, weight: 3 }, // Big Tree
    { index: 112, weight: 2 } // Small Tree
  ])
}
