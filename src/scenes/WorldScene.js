import 'phaser'
import Player from '../entity/Player'
import InventoryItem from '../entity/InventoryItem'
import { populateInventoryBar, setLevelConfig } from '../entity/utilityFunctions'
import NPC from '../entity/NPC'
// import { loadNextLevel } from '../entity/utilityFunctions'
import {puzzleConfig, boxPuzzleLayer, wallPuzzleLayer, goalPuzzleLayer} from '../puzzles/converter'
import SokoBox from '../entity/SokoBox'
import SokoGoal from '../entity/SokoGoal'
import SokoWall from '../entity/SokoWall'

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
      mapHeight: 40,
      mapWidth: 40,
      puzzleOptions: {
        width: 5,
        height: 5,
        boxes: 1,
        minWalls: 3
      }
    }
    this.transitionToNextLevel = this.transitionToNextLevel.bind(this)
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

    //Load player level
    //NOTE: this will not be static eventually
    //this.levelConfig = setLevelConfig(2)
  }

  create() {
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
    // this.hideNPCItems(this.inventoryItems, this.villagers)

    // If 3x3 area around (4, 3) is empty, we'll spawn our player here
    // Otherwise, it will keep searching for a good spot
    this.randomizePlayerSpawn(15, 15)

    // Setting keyboard input for movement
    this.cursors = this.input.keyboard.createCursorKeys()

  
    //Making Puzzle Sprites:
    //Creating sokoban puzzle sprites' physics group:
    this.sokoBoxes = this.physics.add.group({
      classType: SokoBox
    })

    this.sokoGoals = this.physics.add.group()

    this.sokoWalls = this.physics.add.group({
      classType: SokoWall,
      immovable: true
    })

    //Creating sokoBoxes, sokoGoals, and sokoWalls for puzzle
    this.createSokoBoxSprite(this.sokoBoxes)
    this.createSokoGoalSprite(this.sokoGoals)
    this.createSokoWallSprite(this.sokoWalls)


    // Setting collision rules for player
    this.physics.add.collider(this.player, objectLayer) //Blocks off trees
    this.physics.add.collider(this.player, groundLayer) //Blocks off the edges
    this.physics.add.collider(
      this.player,
      this.villagers,
      this.startDialogue,
      null,
      this)


      //setting all puzzle collisions
    this.physics.add.collider(this.player, this.sokoBoxes, this.updateBoxMovement) //Player can push the puzzle boxes

    this.physics.add.collider(this.player, this.sokoWalls) //Player can't move through puzzle walls

    this.physics.add.collider(this.sokoBoxes, this.sokoWalls)
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

    // Animating sprite motion
    this.createAnimations()


    const uiScene = this.scene.get('UIScene')

    uiScene.events.once('startTransition', function () {
      uiScene.inventoryBar.setVisible(false)
      this.transitionToNextLevel(this.levelConfig.level)
    }, this)


  }
  //end of create method



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


//Utility fxns for creating puzzle sprites
  createSokoBoxSprite(group) {
    for (let i=0; i < 11; i++) {
      for (let j=0; j < 11; j++) {
        if (boxPuzzleLayer['data'][i][j] === 28) {
          let x = j * 16 + 8; //16 = tile size and 8 = offset
          let y = i * 16 + 8; //16 = tile size and 8 = offset
          let sokoBoxSprite = new SokoBox(this, x, y, 'sokoboxes');
          sokoBoxSprite.setSize(50, 50)
          sokoBoxSprite.setScale(0.25);
          group.add(sokoBoxSprite);
        }
      }
    }
  }

  createSokoGoalSprite(group) {
    for (let i=0; i < 11; i++) {
      for (let j=0; j < 11; j++) {
        if (goalPuzzleLayer['data'][i][j] === 9) {
          let x = j * 16 + 8;
          let y = i * 16 + 8;
          let sokoGoalSprite = new SokoGoal(this, x, y, 'sokogoals')
          sokoGoalSprite.setScale(0.25);
          group.add(sokoGoalSprite);
        }
      }
    }
  }

  createSokoWallSprite(group) {
    for (let i=0; i < 11; i++) {
      for (let j=0; j < 11; j++) {
        if (wallPuzzleLayer['data'][i][j] === 12) {
          let x = j * 16 + 8;
          let y = i * 16 + 8;
          let sokoWallSprite = new SokoWall(this, x, y, 'sokowalls');
          sokoWallSprite.setSize(50, 50)
          sokoWallSprite.setScale(0.25)
          group.add(sokoWallSprite);
        }
      }
    }
  }

  //loads the transition scene leading to the next level scene
  transitionToNextLevel(level) {
    console.log(`Level ${level} Complete `)
    this.cameras.main.fadeOut(500)
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.levelConfig = setLevelConfig(this.levelConfig.level+1)
        this.scene.start('TransitionScene');
        // In progress, we can add other level-up activities here
      }
    })
  }

  // Callback for player/inventory item overlap
  pickUpItem(player, item) {
    item.disableBody(true, true)
    item.setVisible(false)

    this.levelConfig.itemsAcquired.push(item)

    if (this.levelConfig.itemsAcquired.length === this.levelConfig.itemsToAcquire) {
      this.events.emit('levelComplete', this.levelConfig.level, item.frame.name)
      console.log('Level Completed: ', this.levelConfig.level)
    } else {
      this.events.emit('itemFound', item.frame.name)
    }
  }

  updateBoxMovement (player, box) {
    box.update()
  }

  puzzleSolve (box, goal) {
    goal.setTint(0xFF00FF)
    goal.disableBody(true, false)

    let allGoals = this.sokoGoals.getChildren()
    if (allGoals.every(function (goal) {
      return goal.isTinted
    })) {
      console.log('YOU SOLVED IT')
      this.events.emit('puzzleSolved')
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
      this.player.setSize(11, 11)
    } else {
      this.randomizePlayerSpawn(x + 1, y + 1)
    }
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

  // // Clear out a rectangle of empty space for sokoban puzzle (top left)
  objectLayer.fill(-1, 0, 0, 12, 12); //clear out any objects for collisions
  groundLayer.fill(22, 0, 0, 11, 11); //yellow tile for puzzlefor plain green: use 22 instead of 85

}

