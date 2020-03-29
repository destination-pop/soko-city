
function loadNextLevel(scene) {
  //Add any end-of-scene graphics HERE

  scene.time.addEvent({
    delay: 5000,
    callback: () => {
      scene.levelConfig = setLevelConfig(scene.levelConfig.level+1)
      scene.scene.restart()
    }
  })
}


//Sets levelConfig variables for a scene to load user's current level
function setLevelConfig(level) {
  switch(level) {
    case 1:
      return {
        level: 1,
        itemsToAcquire: 3,
        itemsAcquired: 0,
        NPC: 1,
        mapWidth: 40,
        mapHeight: 40
      }
    case 2:
      return {
        level: 2,
        itemsToAcquire: 4,
        itemsAcquired: 0,
        NPC: 2,
        mapWidth: 50,
        mapHeight: 50
      }
    case 3:
      return {
        level: 3,
        itemsToAcquire: 5,
        itemsAcquired: 0,
        NPC: 3,
        mapWidth: 75,
        mapHeight: 75
      }
    case 4:
      return {
        level: 4,
        itemsToAcquire: 6,
        itemsAcquired: 0,
        NPC: 4,
        mapWidth: 100,
        mapHeight: 100
      }
    case 5:
      return {
        level: 5,
        itemsToAcquire: 7,
        itemsAcquired: 0,
        NPC: 5,
        mapWidth: 120,
        mapHeight: 120
      }
    }
}


export {
  loadNextLevel
}
