import 'phaser'
import puzzle from './generator'

//Map over 2D puzzle array from generator
//Change puzzle chars to correct indeces from the tileset
//Note to self: might need to add surrounding walls
function converter(twoDimArray) {
   return twoDimArray.map(row=>row.map(el=>{
      if (el==='#') return 12; //indicates wall
      if (el==='$') return 28; //indicates box
      if (el==='+' || el==='*' || el==='.') return 9; //indicates goal square
      //Note: '+' indicates player on goal square
      //Note: '*' indicates box on goal square,
      //Note: '.' indicates goal square
      else return 13; //indicates floor
      //Note: Remaining chars are ' ' (floor space) and '@' (player)
   }))
}

//Set config for how Phaser will process map file
let puzzleConfig = {
  data: converter(puzzle._data._data),
  tileWidth: 64,
  tileHeight: 64,
  //Note to self: might need to add 2 to height / width to account for walls surrounding puzzle
  width: puzzle._data._width,
  height: puzzle._data._height,
}


/**
var map = this.make.tilemap(config);
 */

export {
   puzzleConfig
}
