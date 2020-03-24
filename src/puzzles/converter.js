import 'phaser'
import puzzle from './generator'

//Set config for how Phaser will process map file
let puzzleConfig = {
  data: puzzle._data._data, //2D puzzle array from generator
  tileWidth: 30,
  tileHeight: 30,
  //Note to self: might need to add 2 to height / width to account for walls surrounding puzzle
  width: puzzle._data._width,
  height: puzzle._data._height,
}

//Map puzzle characters to the correct index from the tile file
//Note to self: might need to add surroundign walls
puzzle = puzzle.forEach(row=>row.map(el=>{
   if (el==='#') return 14; //indicates wall
   if (el==='$') return 33; //indicates box
   if (el==='+' || el==='*' || el==='.') return 36; //indicates goal square
   //Note: '+' indicates player on goal square
   //Note: '*' indicates box on goal square,
   //Note: '.' indicates goal square
   else return 15; //indicates floor
   //Note: The remaining chars are ' ' (floor space) and '@' (player)
}))

/**
var map = this.make.tilemap(config);
 */

export {
   puzzle,
   puzzleConfig
}
