import {db} from '../config/firebaseConfig'

export default class UIScene extends Phaser.Scene {

  constructor (){
    super('UIScene');

    this.populateInventoryBar = this.populateInventoryBar.bind(this)

    this.saveData = this.saveData.bind(this)

  }

  preload() {

    this.load.image('graySquare', 'assets/sprites/graySquare.png')
    
  }

  create () {

    const currentGame = this.scene.get('WorldScene')

    this.inventoryBar = this.add.group()

    setTimeout(this.populateInventoryBar(currentGame.inventoryItems.children.entries), 10000)


    currentGame.events.on('itemAdded', function(item){
      this.inventoryBar.children.entries.forEach(el => {
        if (item === el.frame.name) {
          el.clearTint()
          this.saveData({email: 'marie@gmail.com', itemAdded: `${el.frame.name}`, text: `I just picked up item ${el.frame.name} while walking around soko-city woo woo this works`})
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

  saveData(inputObj) {
    db.collection("users").doc(inputObj.email).set({
      itemAdded: inputObj.itemAdded,
      text: inputObj.text
  }, { merge: true })
  .then(function() {
      console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  }

}
