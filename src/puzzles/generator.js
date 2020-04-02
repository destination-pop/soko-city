const sokobanGenerator = require("sokoban-generator");
// from: https://github.com/AnoXDD/sokoban-generator-javascript
import {currentPuzzleConfig} from '../entity/utilityFunctions'

function createGeneratorConfig(options) {
  return {
    // the width of the sokoban grid
    width: options.width,
    // the height of the sokoban grid
    height: options.height,
    // the boxes on the grid
    boxes: options.boxes,
    // the minimum number of walls on the grid
    minWalls: options.minWalls,
    // when generating the map, the maximum attempts
    attempts: 5000,
    // map seed. See note below
    seed: Date.now(),
    // The initial position of player, bottom right corner
    initialPosition: {
      x: options.width-1,
      y: options.height-1
    },
    // the return type, either "string" or "class"
    type: "class"
  }
}

//Create function to check if puzzle is already partially solved
let puzzleContainsSolvedTiles = puzzleData => {
  return puzzleData.reduce((acc, el) => {
    return acc || el.includes('*')
  }, false)
}

// Generate a puzzle that is not null and has no solved tiles
function generatePuzzle(config) {
  let puzzle = sokobanGenerator.generateSokobanLevel(createGeneratorConfig(config))


  while (puzzle === null) {
    //if puzzle times out, regenerate
    puzzle = sokobanGenerator.generateSokobanLevel(createGeneratorConfig(config))
  }

  while(puzzleContainsSolvedTiles(puzzle._data._data)) {
    //if puzzle contains solved tiles, regenerate
    puzzle = sokobanGenerator.generateSokobanLevel(createGeneratorConfig(config))
  }

  return puzzle
}

export {
  generatePuzzle
}
