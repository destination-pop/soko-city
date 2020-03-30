
// function loadNextLevel(scene) {
//   //Add any end-of-scene graphics HERE

//   scene.time.addEvent({
//     delay: 5000,
//     callback: () => {
//       scene.levelConfig = setLevelConfig(scene.levelConfig.level+1)
//       scene.scene.restart()
//     }
//   })
// }


//Sets levelConfig variables for a scene to load user's current level
function setLevelConfig(level) {
  switch(level) {
    case 1:
      return {
        level: 1,
        itemsToAcquire: 3,
        itemsAcquired: [],
        NPC: 1,
        mapWidth: 40,
        mapHeight: 40,
        puzzleOptions: {
          width: 5,
          height: 5,
          boxes: 1,
          minWalls: 3
        }
      }
    case 2:
      return {
        level: 2,
        itemsToAcquire: 4,
        itemsAcquired: [],
        NPC: 2,
        mapWidth: 50,
        mapHeight: 50,
        puzzleOptions: { //Update these puzzle settings
          width: 7,
          height: 7,
          boxes: 3,
          minWalls: 9
        }
      }
    case 3:
      return {
        level: 3,
        itemsToAcquire: 5,
        itemsAcquired: [],
        NPC: 3,
        mapWidth: 75,
        mapHeight: 75,
        puzzleOptions: { //Update these puzzle settings
          width: 9,
          height: 9,
          boxes: 1,
          minWalls: 3
        }
      }
    case 4:
      return {
        level: 4,
        itemsToAcquire: 6,
        itemsAcquired: [],
        NPC: 4,
        mapWidth: 100,
        mapHeight: 100,
        puzzleOptions: { //Update these puzzle settings
          width: 5,
          height: 5,
          boxes: 1,
          minWalls: 3
        }
      }
    case 5:
      return {
        level: 5,
        itemsToAcquire: 7,
        itemsAcquired: [],
        NPC: 5,
        mapWidth: 120,
        mapHeight: 120,
        puzzleOptions: { //Update these puzzle settings
          width: 5,
          height: 5,
          boxes: 1,
          minWalls: 3
        }
      }
    }
}


export {
  // populateInventoryBar,
  setLevelConfig
}
