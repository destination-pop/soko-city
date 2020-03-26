export default class UIScene extends Phaser.Scene {

  constructor (){
    super('UIScene');

    this.populateInventoryBar = this.populateInventoryBar.bind(this)

  }

  preload() {

    this.load.image('graySquare', 'assets/sprites/graySquare.png')
    
  }

  create () {

    const currentGame = this.scene.get('WorldScene')

    this.inventoryBar = this.add.group()

    setTimeout(this.populateInventoryBar(currentGame.inventoryItems.children.entries), 8000)


    currentGame.events.on('itemAdded', function(item){
      this.inventoryBar.children.entries.forEach(el => {
        if (item === el.frame.name) {
          el.clearTint()
        }
      })
    }, this)

  }


  populateInventoryBar(itemArr) {
    let currentX = 48
    itemArr.forEach(item => {
      this.inventoryBar.create(currentX, 450,'graySquare').setScale(3)
      this.inventoryBar.create(currentX, 450, item.texture.key, item.frame.name).setTint(0x696969).setScale(3)
      currentX += 48
    })
  }

}
