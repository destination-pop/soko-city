const sokobanGenerator = require("sokoban-generator");
// from: https://github.com/AnoXDD/sokoban-generator-javascript


//NOTE about options:
//The time to generate a level increases greatly
//when the number of walls or size are increased.

const options = {
  // the width of the sokoban grid
  width: 9,
  // the height of the sokoban grid
  height: 9,
  // the boxes on the grid
  boxes: 3,
  // the minimum number of walls on the grid
  minWalls: 13,
  // when generating the map, the maximum attempts
  attempts: 5000,
  // map seed. See note below
  seed: Date.now(),
  // The initial position of player
  initialPosition: {
    x: 0,
    y: 0
  },
  // the return type, either "string" or "class"
  type: "class"
};

let puzzle = sokobanGenerator.generateSokobanLevel(options);

export default puzzle
