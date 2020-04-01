let currentPuzzleConfig = {
  x: 40, //Unit: Pixels
  y: 40,
  width: 5, //Unit: 16px squares. Not including perimeter
  height: 5,
  boxes: 2,
  minWalls: 6
}

//Sets levelConfig variables for a scene to load user's current level
function setLevelConfig(level) {
  //Randomize puzzle placement
  let puzzHeight = level * 2 + 3 //unit: squares
  let mapHeight = (level + 3) * 10 //unit: squares
  let minPuzzPlacement = 2 //Topmost appropriate point for puzzle, in tiles
  let maxPuzzPlacement = mapHeight - puzzHeight - 3 //Ditto for bottom-most
  let xPuzz =
    16 *
    (Math.floor(Math.random()) * maxPuzzPlacement -
      minPuzzPlacement +
      minPuzzPlacement +
      8)
  let yPuzz =
    16 *
    (Math.floor(Math.random()) * maxPuzzPlacement -
      minPuzzPlacement +
      minPuzzPlacement +
      8)

  let config = {
    level: level,
    itemsToAcquire: level + 2,
    itemsAcquired: [],
    NPC: (level % 3) + 1, //This is also the number of puzzles
    mapWidth: (level + 3) * 10, //Unit: 16px squares
    mapHeight: (level + 3) * 10,
    puzzleOptions: {
      x: xPuzz, //Unit: Pixels
      y: yPuzz,
      width: level * 2 + 3, //Unit: 16px squares (without perimeter)
      height: level * 2 + 3,
      boxes: (level % 2) + 1,
      minWalls: level + 5
    }
  }

  let defaultConfig = {
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

  currentPuzzleConfig = config //Set puzzle config for generator
  config.puzzleOptions.width += 2 //account for the perimeter
  config.puzzleOptions.height += 2

  return level === 1 ? defaultConfig : config
  // return config //Send back to WorldScene
}

export { setLevelConfig }
