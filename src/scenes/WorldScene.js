import 'phaser'
import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import { setLevelConfig } from '../entity/utilityFunctions'
import NPC from '../entity/NPC'
import SokoBox from '../entity/SokoBox'
import SokoGoal from '../entity/SokoGoal'
import SokoWall from '../entity/SokoWall'

import firebase from 'firebase'
import { saveLevelProgression, endGame } from '../server/db'

let groundLayer
let objectLayer
let map

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')

    this.createSokoBoxSprite = this.createSokoBoxSprite.bind(this)
    this.createSokoGoalSprite = this.createSokoGoalSprite.bind(this)
    this.createSokoWallSprite = this.createSokoWallSprite.bind(this)
    this.randomizeWorld = this.randomizeWorld.bind(this)
  }

  preload() {
    //preload tilesets for map and puzzle map
    this.load.image('tiles', 'assets/tileSets/overworld.png')
    this.load.image('puzzleTiles', 'assets/tileSets/puzzleTileset.png')

    //Preload sokoBox sprite
    this.load.spritesheet('sokoboxes', 'assets/sprites/puzzleCrate.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    //Preload sokoGoal sprite
    this.load.spritesheet('sokogoals', 'assets/sprites/puzzleEndpoint.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    //Preload sokoWall sprite
    this.load.spritesheet('sokowalls', 'assets/sprites/puzzleWall.png', {
      frameWidth: 64,
      frameHeight: 64
    })

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
  }

  create(data) {
    this.levelConfig = data

    //fade into the scene
    this.cameras.main.fadeIn(500)

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

    this.randomizeWorld() // Initial map randomization

    // If 3x3 area around (4, 3) is empty, we'll spawn our player here
    // Otherwise, it will keep searching for a good spot
    this.randomizePlayerSpawn(1, 1)

    this.inventoryItems = this.physics.add.group({
      classType: InventoryItem
    })

    this.randomizeItems(this.inventoryItems, this.levelConfig.itemsToAcquire)

    //creating random villagers
    this.villagers = this.physics.add.group({
      classType: NPC,
      immovable: true
    })
    this.villagers.enableBody = true

    //randomize NPC
    this.randomizeNPCs(this.villagers, this.levelConfig)

    //creating random items for scene and updating UI with items in scene
    this.inventoryItems = this.physics.add.group({
      classType: InventoryItem
    })

    this.randomizeItems(this.inventoryItems, this.levelConfig)

    //hiding NPC item
    this.hideNPCitem(this.inventoryItems, this.levelConfig)

    //Making Puzzle Sprites:
    //Creating sokoban puzzle sprites' physics group:
    this.sokoBoxes = this.physics.add.group({
      classType: SokoBox
    })

    this.sokoGoals = this.physics.add.group({
      classType: SokoGoal
    })

    this.sokoWalls = this.physics.add.group({
      classType: SokoWall,
      immovable: true
    })

    //Creating sokoBoxes, sokoGoals, and sokoWalls for puzzle
    this.createSokoBoxSprite(this.sokoBoxes)
    this.createSokoGoalSprite(this.sokoGoals)
    this.createSokoWallSprite(this.sokoWalls)

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
      this
    )

      //setting all puzzle collisions
    this.physics.add.collider(this.player, this.sokoBoxes, this.updateBoxMovement) //Player can push the puzzle boxes

    //setting all puzzle collisions
    this.physics.add.collider(
      this.player,
      this.sokoBoxes,
      this.updateBoxMovement
    ) //Player can push the puzzle boxes
    this.physics.add.collider(this.player, this.sokoWalls) //Player can't move through puzzle walls
    this.physics.add.collider(this.sokoBoxes, [this.sokoWalls, this.sokoBoxes])
    this.physics.add.collider(this.sokoBoxes, this.sokoBoxes)

    //adding overlap for picking up items
    this.physics.add.overlap(
      this.player,
      this.inventoryItems,
      this.pickUpItem,
      null,
      this
    )

    // adding overlap for puzzle boxes on goals
    this.physics.add.overlap(
      this.sokoBoxes,
      this.sokoGoals,
      this.puzzleSolve,
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

    this.events.on('puzzleSolved', function(inventoryItems) {
      inventoryItems.getChildren()[0].setVisible(true)
      inventoryItems.getChildren()[0].enableBody()
    })

    // this.sokoGoals.getChildren().forEach(goal => goal.setTint(0xFF00FF))

    const uiScene = this.scene.get('UIScene')

    uiScene.events.once(
      'startTransition',
      function() {
        this.transitionToNextLevel(this.levelConfig.level)

        if (this.levelConfig.level === 5) {
          firebase.auth().currentUser.email
            ? endGame(firebase.auth().currentUser.email)
            : null
        } else {
          firebase.auth().currentUser.email
            ? saveLevelProgression(
                firebase.auth().currentUser.email,
                this.levelConfig.level
              )
            : null
        }
      },
      this
    )

    uiScene.events.once(
      'resetLevel', function (level) {
        level.events.off('update')
        level.levelConfig.itemsAcquired = []
        level.scene.restart()
      }
    )
  }
  //end of create method

  //loads the transition scene leading to the next level scene
  transitionToNextLevel() {
    this.cameras.main.fadeOut(500)
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.levelConfig.level === 5) {
          this.events.off('update')
          this.scene.start('EndScene')
        } else {
          this.levelConfig = setLevelConfig(this.levelConfig.level + 1)
          this.events.off('update')
          this.scene.start('TransitionScene', this.levelConfig)
        }
      }
    })
  }

  randomizeItems(group, levelConfig, foodNames) {
    let unique = []

    while (unique.length < levelConfig.itemsToAcquire) {
      let x = Phaser.Math.RND.between(200, 300)
      let y = Phaser.Math.RND.between(200, 300)
      let frame = Phaser.Math.RND.between(0, 63)

      if (unique.indexOf(frame) === -1) {
        unique.push(frame)
        let item = new InventoryItem(this, x, y, 'food', frame)
        group.add(item)
      }
    }
    this.events.emit('newLevel')
  }

  randomizeNPCs(group, levelConfig) {
    let unique = []
    while (unique.length < levelConfig.NPC) {
      let x = ((levelConfig.puzzleOptions.width - 4) * 16) +  levelConfig.puzzleOptions.x
      let y = ((levelConfig.puzzleOptions.height + 0.5) * 16)
      + levelConfig.puzzleOptions.y
      let frame = Phaser.Math.RND.between(0, 8)

      if (unique.indexOf(frame) === -1) {
        unique.push(frame)
        let villager = new NPC(this, x, y, 'villagers', frame)

        group.add(villager)
      }
    }
  }

  hideNPCitem(group, levelConfig) {
    let npcItem = group.getChildren()[0]
    npcItem.setX(((levelConfig.puzzleOptions.width - 3) * 16) + levelConfig.puzzleOptions.x)
    npcItem.setY(((levelConfig.puzzleOptions.height + 0.5) * 16) + levelConfig.puzzleOptions.y)
    npcItem.disableBody(true, true)
  }

  //Utility fxns for creating puzzle sprites
  createSokoBoxSprite(group) {
    for (let i = 0; i < this.levelConfig.puzzleOptions.height; i++) {
      for (let j = 0; j < this.levelConfig.puzzleOptions.width; j++) {
        if (this.levelConfig.puzzleLayers.box.data[i][j] === 28) {
          let x = j * 16 + this.levelConfig.puzzleOptions.x //16 = tile size
          let y = i * 16 + this.levelConfig.puzzleOptions.y //16 = tile size
          let sokoBoxSprite = new SokoBox(this, x, y, 'sokoboxes')
          sokoBoxSprite.setSize(50, 50)
          sokoBoxSprite.setScale(0.25)
          group.add(sokoBoxSprite)
        }
      }
    }
  }

  createSokoGoalSprite(group) {
    for (let i = 0; i < this.levelConfig.puzzleOptions.height; i++) {
      for (let j = 0; j < this.levelConfig.puzzleOptions.width; j++) {
        if (this.levelConfig.puzzleLayers.goal.data[i][j] === 9) {
          let x = j * 16 + this.levelConfig.puzzleOptions.x
          let y = i * 16 + this.levelConfig.puzzleOptions.y
          let sokoGoalSprite = new SokoGoal(this, x, y, 'sokogoals')
          sokoGoalSprite.setScale(0.25)
          group.add(sokoGoalSprite)
        }
      }
    }
  }

  createSokoWallSprite(group) {
    for (let i = 0; i < this.levelConfig.puzzleOptions.height; i++) {
      for (let j = 0; j < this.levelConfig.puzzleOptions.width; j++) {
        if (this.levelConfig.puzzleLayers.wall.data[i][j] === 12) {
          let x = j * 16 + this.levelConfig.puzzleOptions.x
          let y = i * 16 + this.levelConfig.puzzleOptions.y
          let sokoWallSprite = new SokoWall(this, x, y, 'sokowalls')
          sokoWallSprite.setSize(50, 50)
          sokoWallSprite.setScale(0.25)
          group.add(sokoWallSprite)
        }
      }
    }
  }

  // Callback for player/inventory item overlap
  pickUpItem(player, item) {
    item.disableBody(true, true)
    item.setVisible(false)

    this.levelConfig.itemsAcquired.push(item)

    if (
      this.levelConfig.itemsAcquired.length === this.levelConfig.itemsToAcquire
    ) {
      this.events.emit('levelComplete', this.levelConfig.level, item.frame.name)
    } else {
      this.events.emit('itemFound', item.frame.name)
    }
  } 

  updateBoxMovement(player, box) {
    box.update()
  }


  puzzleSolve (box, goal) {
    goal.setTint(0xFF00FF)
    goal.disableBody(true, false)

    let allGoals = this.sokoGoals.getChildren()
    if (allGoals.every(function (goal) {
      return goal.isTinted
    })) {
      this.events.emit('puzzleSolved', this.inventoryItems)
      this.events.off('villagerEncounter')
    }
  }

  //callback for player/NPC overlap
  startDialogue(player, villager) {
    this.events.emit('villagerEncounter', villager)
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
      this.player.body.width = 11
      this.player.body.height = 11
      this.player.body.setOffset(2.5, 1)
    } else {
      this.randomizePlayerSpawn(x + 1, y + 1)
    }
  }

  update(time, delta) {
    this.player.update(this.cursors)
  }

  randomizeWorld() {
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

    const x = this.levelConfig.puzzleOptions.x / 16 - 1 //Unit: tiles
    const y = this.levelConfig.puzzleOptions.y / 16 - 1
    const width = this.levelConfig.puzzleOptions.width + 2 //Unit: Tiles
    const height = this.levelConfig.puzzleOptions.height + 2

    // Clear out a rectangle of empty space for sokoban puzzle (top left)
    objectLayer.fill(-1, x, y, width, height) //clear out any objects for collisions
    groundLayer.fill(22, x, y, width, height) //yellow tile for puzzlefor plain green: use 22 instead of 85
  }
}
