import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import { populateInventoryBar } from '../entity/utilityFunctions'

let groundLayer
let objectLayer
let map

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')
  }

  preload() {
    // Preload tileset
    this.load.image('tiles', 'assets/tileSets/overworld.png')

    // Preload player sprite
    this.load.spritesheet('player', 'assets/sprites/playerSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    // Preload inventory item sprites
    this.load.spritesheet('cookie', 'assets/sprites/foodSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet('avocado', 'assets/sprites/foodSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    // Preload backgound color for the inventory bar
    this.load.image('graySquare', 'assets/sprites/graySquare.png')
  }

  create() {
    // Setting up dynamic map and object layers
    map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 75,
      height: 75
    })

    var tiles = map.addTilesetImage('tiles')

    groundLayer = map.createBlankDynamicLayer('Ground Layer', tiles)
    objectLayer = map.createBlankDynamicLayer('Object Layer', tiles)

    // Edges of the map
    groundLayer.fill(1, 0, 0, map.width, 1)
    groundLayer.fill(43, 0, map.height - 1, map.width, 1)
    groundLayer.fill(21, 0, 0, 1, map.height)
    groundLayer.fill(23, map.width - 1, 0, 1, map.height)
    groundLayer.putTileAt(0, 0, 0)
    groundLayer.putTileAt(2, map.width - 1, 0)
    groundLayer.putTileAt(44, map.width - 1, map.height - 1)
    groundLayer.putTileAt(42, 0, map.height - 1)

    randomizeWorld() // Initial map randomization

    // If 3x3 area around (4, 3) is empty, we'll spawn our player here
    // Otherwise, it will keep searching for a good spot
    this.randomizePlayerSpawn(4, 3)

    // Adding the inventory items (sprinkled throughout the scene)
    // NOTE: There is a bug with collisions & static groups, so we create one by one
    this.inventoryItems = {}
    this.inventoryItems.cookie = new InventoryItem(this, 130, 70, 'cookie')
    this.inventoryItems.avocado = new InventoryItem(this, 50, 260, 'avocado')

    // Creating and populating the inventory bar
    populateInventoryBar(this, 'cookie', 'avocado')

    this.inventoryItems.cookie.setScrollFactor(0)
    // Setting our world bounds
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    // Setting collision rules for player
    this.physics.add.collider(this.player, objectLayer) //Blocks off trees
    this.physics.add.collider(this.player, groundLayer) //Blocks off the edges

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

    // Blocking off the edges
    this.player.setCollideWorldBounds(true)
    objectLayer.setCollisionByExclusion([-1])
    groundLayer.setCollisionByExclusion([22, 45, 46])

    // Setting camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)

    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(3)

    // Setting keyboard input for movement
    this.cursors = this.input.keyboard.createCursorKeys()

    // Animating sprite motion
    this.createAnimations()
  }

  // Callback for player/inventory item overlap
  pickUpItem(player, item) {
    item.disableBody(true, true)
    item.setVisible(false)
    this.inventoryBar.children.entries.forEach(el => {
      if (item.texture.key === el.texture.key) {
        el.clearTint()
      }
    })
  }

  //Creating animation sequence for player movement
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
  randomizePlayerSpawn(x, y) {
    // Checks the 9 square area if it's clear to spawn in.
    let collisionCheck = [
      map.getTileAt(x - 1, y - 1, true, 'Object Layer').index,
      map.getTileAt(x, y - 1, true, 'Object Layer').index,
      map.getTileAt(x + 1, y - 1, true, 'Object Layer').index,
      map.getTileAt(x - 1, y, true, 'Object Layer').index,
      map.getTileAt(x, y, true, 'Object Layer').index,
      map.getTileAt(x + 1, y, true, 'Object Layer').index,
      map.getTileAt(x - 1, y + 1, true, 'Object Layer').index,
      map.getTileAt(x, y + 1, true, 'Object Layer').index,
      map.getTileAt(x + 1, y + 1, true, 'Object Layer').index
    ]

    if (collisionCheck.every(e => e === -1)) {
      this.player = new Player(this, x * 16, y * 16, 'player')
    } else {
      this.randomizePlayerSpawn(x + 1, y + 1)
    }
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

  // TODO: Clear out a rectangle of empty space
}
