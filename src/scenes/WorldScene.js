import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import NPC from '../entity/NPC'
import { loadNextLevel } from '../entity/utilityFunctions'
import {puzzleConfig, boxPuzzleLayer, wallPuzzleLayer, goalPuzzleLayer} from '../puzzles/converter'

// import {createUser, levelUp, retrieveUserLevel} from '../server/routes'

let groundLayer
let objectLayer
let map

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')
    this.levelConfig = {
      level: 1,
      itemsToAcquire: 3,
      itemsAcquired: [],
      NPC: 1,
      mapHeight: 150,
      mapWidth: 150,
    }
  }

  preload() {
    //preload tilesets for map and puzzle map
    this.load.image('tiles', 'assets/tileSets/overworld.png')
    this.load.image('puzzleTiles', 'assets/tileSets/puzzleTileset.png')

    // Preload player sprite
    this.load.spritesheet('player', 'assets/sprites/playerSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    // Preload inventory item sprites
    this.load.spritesheet('food', 'assets/sprites/foodSprites.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    this.load.spritesheet('villagers', '/assets/sprites/NPCvillagers.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    //Load player level
    //NOTE: this will not be static eventually
    //this.levelConfig = setLevelConfig(2)
  }

  create() {
    // Setting up dynamic map and object layers
    map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.levelConfig.mapWidth,
      height: this.levelConfig.mapHeight
    })

    const tiles = map.addTilesetImage('tiles')

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
    
    //creating random items for scene and updating UI with items in scene

    this.inventoryItems = this.physics.add.group({
      classType: InventoryItem
    })

    this.randomizeItems(this.inventoryItems, this.levelConfig.itemsToAcquire)

    //creating random villagers
    this.villagers = this.physics.add.group({
      classType: NPC,
      immovable: true
    })
    this.villagers.enableBody = true;


    this.randomizeNPCs(this.villagers, this.levelConfig.NPC)

    // If 3x3 area around (4, 3) is empty, we'll spawn our player here
    // Otherwise, it will keep searching for a good spot
    this.randomizePlayerSpawn(4, 3)


    //COMMENCING MAKING THE PUZZLE LAYERS:::
    //naming puzzleTiles for referencing in creating the puzzle layers!
    let puzzleTiles;

    //Creating the puzzle layer for the boxes to move
    const boxes = this.make.tilemap(boxPuzzleLayer)
    puzzleTiles = boxes.addTilesetImage('puzzleTiles')
    const boxesForPuzzle = boxes.createDynamicLayer(0,puzzleTiles,0,0)
    boxesForPuzzle.setScale(0.25)

    //Creating the puzzle layer for goal for the boxes to move to
    const walls = this.make.tilemap(wallPuzzleLayer)
    puzzleTiles = walls.addTilesetImage('puzzleTiles')
    const wallsForPuzzle = walls.createDynamicLayer(0,puzzleTiles,0,0)
    wallsForPuzzle.setScale(0.25)

    //Creating the puzzle layer for the walls of the puzzle
    const goals = this.make.tilemap(goalPuzzleLayer)
    puzzleTiles = goals.addTilesetImage('puzzleTiles')
    const goalsForPuzzle = goals.createDynamicLayer(0,puzzleTiles,0,0)
    goalsForPuzzle.setScale(0.25)

    // Setting our world bounds
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels

    // Setting collision rules for player
    this.physics.add.collider(this.player, objectLayer) //Blocks off trees
    this.physics.add.collider(this.player, groundLayer) //Blocks off the edges
    this.physics.add.collider(
      this.player, 
      this.villagers, 
      this.startDialogue, 
      null, 
      this)
    // this.physics.add.collider(this.player, wallsForPuzzle)

    this.physics.add.overlap(
      this.player,
      this.inventoryItems,
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
    this.cameras.main.setZoom(2)

    // Setting keyboard input for movement
    this.cursors = this.input.keyboard.createCursorKeys()

    // Animating sprite motion
    this.createAnimations()

    
  }

  randomizeItems(group, quantity) {  
    let unique = []
    while (unique.length < quantity) {
      let x = Phaser.Math.RND.between(200, 300);
      let y = Phaser.Math.RND.between(200, 300);
      let frame = Phaser.Math.RND.between(0, 63);

      if (unique.indexOf(frame) === -1) {
        unique.push(frame)
        let item = new InventoryItem(this, x, y, 'food', frame)
        group.add(item)
      }
    }
    this.events.emit('newLevel')
  }
  

  randomizeNPCs(group, quantity) {
    let unique = [];
    while (unique.length < quantity) {
      let x = Phaser.Math.RND.between(200, 300);
      let y = Phaser.Math.RND.between(200, 300);
      let frame = Phaser.Math.RND.between(0, 8);

      if (unique.indexOf(frame) === -1) {
        unique.push(frame)
        let villager = new NPC(this, x, y, 'villagers', frame)
        group.add(villager)
      }
    }
  }

  // callback for player/inventory item collision
  pickUpItem(player, item) {
    item.disableBody(true, true)
    item.setVisible(false)
    this.levelConfig.itemsAcquired.push(item)

    if (this.levelConfig.itemsAcquired.length === this.levelConfig.itemsToAcquire) {
      this.events.emit('levelComplete', this.levelConfig.level, item.frame.name)
      console.log('Level Completed: ', this.currentLevel)
      loadNextLevel(this)
    } else {
      this.events.emit('itemFound', item.frame.name)
    }

    //launch itemAcquiredDialog on puzzle solve
    // else {
    //   this.events.emit('itemFromVillager', item.frame.name)
    // }
  }

  //callback for player/NPC overlap
  startDialogue(player, villager) {
    this.events.emit('villagerEncounter', villager)


    //The code below restarts the scene at the next level-------------
    // console.log('Level Completed: ', this.currentLevel)
    // loadNextLevel(this)
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

  // // Clear out a rectangle of empty space for sokoban puzzle (top left)
  objectLayer.fill(-1, 0, 0, 12, 12); //clear out any objects for collisions
  groundLayer.fill(85, 0, 0, 11, 11); //yellow tile for puzzlefor plain green: use 22 instead of 85


}
