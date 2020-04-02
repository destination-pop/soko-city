export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  preload() {
    //load background image for inventory bar
    this.load.image('graySquare', 'assets/sprites/graySquare.png')

    //load plugin and images for text box
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url:
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    })

    this.load.image('nextPage', 'assets/UI/arrow-down-left.png')
    this.load.image('close', 'assets/UI/x.png')
    this.load.image('textBox', 'assets/UI/textbox.png')
    this.load.audio('mainSong', 'assets/sound/windlessSlopes.mp3')
    this.load.audio('puzzleSong', 'assets/sound/redCarpetWoodenFloor.mp3')
  }

  create() {
    //pulling information from World Scene
    const currentGame = this.scene.get('WorldScene')

    const mainGameSong = this.sound.play('mainSong')

    // initializing text box for quests
    const textBox = this.rexUI.add.textBox({
      x: 100,
      y: 350,

      background: this.add.image(100, 350, 'textBox'),

      text: getBBcodeText(this, 400, 400, 65).setTint(0x260e04),

      action: this.add
        .image(0, 0, 'nextPage')
        .setTint(0x7b5e57)
        .setVisible(false)
        .setScale(0.5),

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        icon: 2,
        text: 10
      }
    })

    textBox.setDepth(1)
    textBox.setVisible(false)
    textBox.setOrigin(0)
    textBox.layout()
    textBox.setInteractive()

    this.input.keyboard.on(
      'keydown-' + 'ENTER',
      function() {
        const icon = textBox.getElement('action').setVisible(false)
        textBox.resetChildVisibleState(icon)
        if (this.isTyping) {
          this.stop(true)
        } else if (
          currentGame.levelConfig.itemsAcquired.length ===
            currentGame.levelConfig.itemsToAcquire &&
          this.isLastPage
        ) {
          textBox.setVisible(false)
          this.scene.events.emit('startTransition')
        } else if (this.isLastPage) {
          textBox.setVisible(false)
        } else {
          this.typeNextPage()
        }
      },
      textBox
    )

    textBox.on(
      'pageend',
      function() {
        const icon = textBox.getElement('action').setVisible(true)
        textBox.resetChildVisibleState(icon)
      },
      textBox
    )

    //initializing inventory bar
    this.inventoryBar = this.add.group()

    setTimeout(
      populateInventoryBar(
        this,
        currentGame.inventoryItems.children.entries,
        foodNames
      ),
      10000
    )

    //launching text box for initial quest and populating inventory bar
    currentGame.events.on(
      'newLevel',
      function() {
        this.inventoryBar.setVisible(true)
        populateInventoryBar(
          this,
          currentGame.inventoryItems.children.entries,
          foodNames
        )
        textBox.setVisible(true).start(levelIntro(), 50)
      },
      this
    )

    //launching text box on villager encounter
    currentGame.events.once('villagerEncounter', function(villager) {
      textBox.setVisible(true).start(initialVillagerDialog(currentGame, villager, foodNames), 50)
    }, this)

    currentGame.events.once('villagerReward', function(villager) {
      textBox.setVisible(true).start(itemFromVillagerDialog(currentGame, villager, foodNames), 50)
    }, this)



    //launching itemFoundDialog
    currentGame.events.on(
      'itemFound',
      function(item) {
        this.inventoryBar.children.entries.forEach(el => {
          if (item === el.frame.name) {
            el.clearTint()
            textBox
              .setVisible(true)
              .start(itemFoundDialog(currentGame, el.frame.name, foodNames), 50)
          }
        })
      },
      this
    )

    currentGame.events.on('puzzleSolved', function() {
      textBox.setVisible(true).start(puzzleSolvedDialog, 50)
    })

    //launching text box on level complete
    currentGame.events.on(
      'levelComplete',
      function(level, item) {
        this.inventoryBar.children.entries.forEach(el => {
          if (item === el.frame.name) {
            el.clearTint()
            textBox
              .setVisible(true)
              .start(
                levelCompleteDialog(
                  currentGame,
                  item,
                  level,
                  foodNames,
                  levelNums
                ),
                50
              )
          }
        })
      },
      this
    )
  }
}

//to populate inventory bar from world scene info
const populateInventoryBar = (scene, itemArr) => {
  let currentX = 35
  itemArr.forEach(item => {
    scene.inventoryBar.create(currentX, 445, 'graySquare').setScale(3)
    scene.inventoryBar
      .create(currentX, 445, item.texture.key, item.frame.name)
      .setTint(0x696969)
      .setScale(2)
    currentX += 48
  })
}

//to create text for text box
const getBBcodeText = function(scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.rexUI.add.BBCodeText(0, 0, '', {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: '20px',
    wrap: {
      mode: 'word',
      width: wrapWidth
    },
    maxLines: 3
  })
}

const foodNames = {
  0: 'cookie',
  1: 'chocolate bar',
  2: 'stein of beer',
  3: 'jug of moonshine',
  4: 'fancy spirit',
  5: 'pineapple tart',
  6: 'sushi roll',
  7: 'california roll',
  8: 'bottle of sake',
  9: 'roasted pig',
  10: 'jar of pickled apricots',
  11: 'jar of jelly',
  12: 'delicious apple',
  13: 'fresh apple',
  14: 'turnip',
  15: 'potato',
  16: 'sunny breakfast',
  17: 'honeycomb',
  18: 'pineapple',
  19: 'piece of bacon',
  20: 'draft of beer',
  21: 'steak',
  22: 'bottle of wine',
  23: 'fish',
  24: 'wedge of cheese',
  25: 'turkey',
  26: 'baguette',
  27: 'purple eggplant',
  28: 'red chili pepper',
  29: 'green chili pepper',
  30: 'macaroni',
  31: 'big noodle',
  32: 'tomato',
  33: 'strawberry',
  34: 'peach',
  35: 'kiwi',
  36: 'pumpkin pie',
  37: 'lemon meringue pie',
  38: 'hot apple pie',
  39: 'pickle',
  40: 'pretzel',
  41: 'salami',
  42: 'salmon steak',
  43: 'jar of honey',
  44: 'beef jerky slab',
  45: 'red potato',
  46: 'honeydew',
  47: 'cantaloupe',
  48: 'watermelon',
  49: 'stack of pancakes',
  50: 'turkey leg',
  51: 'cherry',
  52: 'rack of ribs',
  53: 'can of sardines',
  54: 'dragonfruit',
  55: 'sausage',
  56: 'millenial avocado',
  57: 'tuna steak',
  58: 'prawn',
  59: 'giant olive',
  60: 'jar of pickled eggs',
  61: 'hunk of mystery meat',
  62: 'sweet onion',
  63: 'shrimp'
}

const levelNums = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'last'
}

const levelIntro = () => {
  return `The village comptroller here has demanded a number of items!`
}

const initialVillagerDialog = (scene, villager, foodNames) => {
  let villagerNum = scene.villagers.children.entries.indexOf(villager)
  let inventoryNum =
    scene.inventoryItems.children.entries[villagerNum].frame.name

  return `Ah, you're the stranger looking for their pet chicken?  I'm afraid I can't do anything until I solve this mysterious puzzle in my yard!  Could you help me solve it??  I would gladly repay you with a ${foodNames[inventoryNum]}!`
}

const itemFromVillagerDialog = (scene, foodItem, foodNames) => {
  return `Thank you so much for your help, you are brilliant!  Here is the ${foodNames[foodItem]} I promised you!`
}

const puzzleSolvedDialog = `You've solved it!  Go to the villager to collect your reward.`

const itemFoundDialog = (scene, foodItem, foodNames) => {
  return `You found a ${foodNames[foodItem]}!`
}

const levelCompleteDialog = (scene, foodItem, level, foodNames, levelNums) => {
  const nextLevel = levelNums[level + 1]
  return `A ${foodNames[foodItem]}! You've collected all the items needed!  Time to continue your journey to the ${nextLevel} village!!!`
}
