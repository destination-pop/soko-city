import { generatePuzzle } from '../puzzles/generator'
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
  let rawPuzzle = generatePuzzle(options)
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


export {
  setLevelConfig, 
  foodNames
}
