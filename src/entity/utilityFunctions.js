
//Creates inventory bar in the window
function populateInventoryBar(scene, ...items) {
  scene.inventoryBar = scene.physics.add.staticGroup()
  let currentX = 16
  items.forEach(item=>{
    scene.inventoryBar.create(currentX,224,'graySquare').setScale(0.5)
    scene.inventoryBar.create(currentX,224,item).setScale(0.8).setTint(0x696969)
    currentX += 16
  })
}


export {
  populateInventoryBar
}
