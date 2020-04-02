import { createGeneratorConfig, generatePuzzle } from '../puzzles/generator'
import { convertToMapLayers } from '../puzzles/converter'


//Sets levelConfig variables for a scene to load user's current level
function setLevelConfig(level) {

  //Randomize puzzle placement
  let puzzHeight = (level * 2) + 3 //unit: squares
  let mapHeight = (level + 2) * 10 //unit: squares
  let minPuzzPlacement = 2 //Topmost appropriate point for puzzle, in tiles
  let maxPuzzPlacement = mapHeight - puzzHeight - 3 //Ditto for bottom-most
  let xPuzz = 16*(Math.floor(Math.random()*(maxPuzzPlacement - minPuzzPlacement)) + minPuzzPlacement)
  let yPuzz = 16*(Math.floor(Math.random()*(maxPuzzPlacement - minPuzzPlacement)) + minPuzzPlacement)

  //Create puzzle for level
  let options = {
    width: level + 4, //Unit: 16px squares (without perimeter)
    height: level + 4,
    boxes: Math.ceil(level/2) + 2,
    minWalls: level * 4
  }

  //Create map layers for the puzzle sprites
  let rawPuzzle = generatePuzzle(createGeneratorConfig(options))
  let layers = convertToMapLayers(rawPuzzle)

  //Set config for the level and return to WorldScene
  return {
    level: level,
    itemsToAcquire: level + 2,
    itemsAcquired: [],
    NPC: 1, //This is also the number of puzzles
    mapWidth: (level + 2) * 10, //Unit: 16px squares
    mapHeight: (level + 2) * 10,
    puzzleOptions: {
      x: xPuzz, //Unit: Pixels
      y: yPuzz,
      width: level + 6, //Unit: 16px squares (with perimeter)
      height: level + 6,
      boxes: Math.ceil(level/2) + 2,
      minWalls: level * 5
    },
    puzzleLayers: {
      box: layers.boxPuzzleLayer,
      goal: layers.goalPuzzleLayer,
      wall: layers.wallPuzzleLayer
    }
  }
}


export {
  setLevelConfig
}
