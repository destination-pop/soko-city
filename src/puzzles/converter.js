import 'phaser'
import puzzle from './generator'

let wallIdx = 12
let boxIdx = 28
let goalIdx = 9
let blankIdx = -1
let floorIdx = 13

//Map over 2D puzzle array from generator to associate with correct tiles
function converter(twoDimArray) {
   return twoDimArray.map(row=>row.map(el=>{
      if (el==='#') return wallIdx;
      if (el==='$') return boxIdx;
      if (el==='+' || el==='*' || el==='.') return goalIdx;
      //Note: '+' indicates player on goal square
      //Note: '*' indicates box on goal square,
      //Note: '.' indicates goal square
      else return blankIdx; //will let floor show through
      //Note: Remaining chars are ' ' (floor space) and '@' (player)
   }))
}

//Add wall to the perimeter of the puzzle
function addPerimeter(convertedPuzzle) {
   let newRow = Array(convertedPuzzle.length-2).fill(wallIdx)

   convertedPuzzle.push(newRow)
   convertedPuzzle.unshift(newRow.slice())
   //Leave an opening for the player to enter puzzle
   convertedPuzzle[convertedPuzzle.length-1][convertedPuzzle.length-2] = blankIdx

   convertedPuzzle.forEach(row=>{
      row.push(wallIdx)
      row.unshift(wallIdx)
   })
   return convertedPuzzle
}


//Set config for how Phaser will process map file
let puzzleConfig = {
  data: addPerimeter(converter(puzzle._data._data)),
  tileWidth: 64,
  tileHeight: 64,
  //Note to self: might need to add 2 to height / width to account for walls surrounding puzzle
  width: puzzle._data._width,
  height: puzzle._data._height,
};

function extractLayer(data, value) {
   let layer = [];
   for (let i = 0; i < data.length; i++) {
      let newRow = [];
      for (let j= 0; j < data[i].length; j++) {
         if (data[i][j] === value) {
            newRow.push(value)
         } else {
            newRow.push(-1)
         }
      }
      layer.push(newRow)
   }
   return layer
}

let boxPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: 9, height: 9 };
let wallPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: 9, height: 9 };
let goalPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: 9, height: 9 };


boxPuzzleLayer['data'] = extractLayer(puzzleConfig.data, 28)

wallPuzzleLayer['data'] = extractLayer(puzzleConfig.data, 12)

goalPuzzleLayer['data'] = extractLayer(puzzleConfig.data, 9)

export {puzzleConfig, boxPuzzleLayer, wallPuzzleLayer, goalPuzzleLayer}


