export default class UIScene extends Phaser.Scene {

  constructor (){
    super('UIScene');
  }

  preload() {
    //load background image for inventory bar
    this.load.image('graySquare', 'assets/sprites/graySquare.png')

    //load plugin and images for text box
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

    this.load.image('nextPage', 'assets/UI/arrow-down-left.png');
    this.load.image('close', 'assets/UI/x.png')
    this.load.image('textBox', 'assets/UI/textbox.png')
    
  }

  create () {

    //pulling information from World Scene
    const currentGame = this.scene.get('WorldScene')

    // initializing text box for quests
    const textBox = this.rexUI.add.textBox({
      x: 100,
      y: 350,
  
      background: this.add.image(100, 350, 'textBox'),
  
      text: getBBcodeText(this, 400, 400, 65).setTint(0x260e04),
  
      action: this.add.image(0, 0, 'nextPage').setTint(0x7b5e57).setVisible(false).setScale(0.5),
  
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        icon: 2,
        text: 10,
      }
    })

    textBox.setDepth(1)
    textBox.setVisible(false)
    textBox.setOrigin(0)
    textBox.layout();
    textBox.setInteractive()
    
    this.input.keyboard.on('keydown-' + 'ENTER', function () {
        const icon = textBox.getElement('action').setVisible(false);
        textBox.resetChildVisibleState(icon);
        if (this.isTyping) {
            this.stop(true);
        } else if (this.isLastPage) {
          textBox.setVisible(false)
        } else {
          this.typeNextPage();
        }
      }, textBox)

    textBox
    .on('pageend', function () {

      const icon = textBox.getElement('action').setVisible(true);
      textBox.resetChildVisibleState(icon);
    }, textBox)

    //initializing inventory bar
    this.inventoryBar = this.add.group()
    
    setTimeout(populateInventoryBar(this, currentGame.inventoryItems.children.entries, foodNames), 10000)


    //launching text box on villager encounter
    currentGame.events.on('villagerEncounter', function(villager) {
      textBox.setVisible(true).start(initialVillagerDialog(currentGame, villager, foodNames), 50)
    }, this)


    //updating inventory bar on item added, launching itemAddedDialog
    currentGame.events.on('itemAdded', function(item){
      this.inventoryBar.children.entries.forEach(el => {
        if (item === el.frame.name) {
          el.clearTint()
          textBox.setVisible(true).start(itemAddedDialog(currentGame, el.frame.name,foodNames))
        }
      })
    }, this)
  }
  
}


//to populate inventory bar from world scene info
const populateInventoryBar = (scene, itemArr) => {
  let currentX = 48
  itemArr.forEach(item => {
    scene.inventoryBar.create(currentX, 450,'graySquare').setScale(3)
    scene.inventoryBar.create(currentX, 450, item.texture.key, item.frame.name).setTint(0x696969).setScale(3)
    currentX += 48
  })
}

//to create text for text box
const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
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
  3: 'moonshine',
  4: 'fancy spirit',
  5: 'egg tart',
  6: 'sushi roll',
  7: 'california roll',
  8: 'sake',
  9: 'roasted pig',
  10: 'jar of pickled apricots',
  11: 'jar of jelly',
  12: 'apple',
  13: 'fresh apple',
  14: 'turnip',
  15: 'potato',
  16: 'eggy breakfast',
  17: 'honeycomb',
  18: 'pineapple',
  19: 'bacon',
  20: 'draft of beer',
  21: 'steak',
  22: 'bottle of wine',
  23: 'fish',
  24: 'cheese',
  25: 'turkey',
  26: 'baguette',
  27: 'eggplant',
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
  38: 'apple pie',
  39: 'pickle',
  40: 'pretzel',
  41: 'salami',
  42: 'salmon',
  43: 'jar of honey',
  44: 'beef jerky',
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
  56: 'avocado',
  57: 'tuna steak',
  58: 'prawn',
  59: 'giant olive',
  60: 'jar of pickled eggs',
  61: 'mystery meat',
  62: 'onion',
  63: 'shrimp'
}

const initialVillagerDialog = (scene, villager, foodNames) => {
  let villagerNum = scene.villagers.children.entries.indexOf(villager)
  let inventoryNum = scene.inventoryItems.children.entries[villagerNum].frame.name

  return `Ah, you're the stranger looking for their pet chicken?  I'm afraid I can't do anything until I solve this mysterious puzzle in my yard!  Could you help me solve it??  I would gladly repay you with this ${foodNames[inventoryNum]}!`
}

const itemAddedDialog = (scene, foodItem, foodNames) => {
  return `Thank you so much for solving this puzzle, you are brilliant!  Here is the ${foodNames[foodItem]} I promised you!`
}
