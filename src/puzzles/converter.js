import 'phaser'


function convertToMapLayers(puzzle) {
   //------------------- Set Up Tile Index Associations ---------------------
   let wallIdx = 12
   let boxIdx = 28
   let goalIdx = 9
   let blankIdx = -1 //will let floor show through
   let floorIdx = 13

   //------------------- Set Up Char Set Associations -----------------------
   const wallChars = {
      '#': true    //Note: '#' indicates wall
   }
   const boxChars = {
      '$': true,   //Note: '$' indicates box square
      '*': true    //Note: '*' indicates box on goal square
   }
   const goalChars = {
      '+': true,  //Note: '+' indicates player on goal square
      '*': true,  //Note: '*' indicates box on goal square
      '.': true   //Note: '.' indicates goal square
   }

   //----------------- Set up Map Config Files for Phaser ---------------------
   let width = puzzle._data._width + 2 //+2 accounts for perimeter
   let height = puzzle._data._length + 2

   let boxPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: width, height: height };
   let wallPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: width, height: height };
   let goalPuzzleLayer = {data: [], tileWidth: 64, tileHeight: 64, width: width, height: height };

   //----------------- Populate Config Files with Map Data ---------------------
   boxPuzzleLayer['data'] = convertToSingleMapLayer(puzzle._data._data, boxChars, boxIdx)
   wallPuzzleLayer['data'] = convertToSingleMapLayer(puzzle._data._data, wallChars, wallIdx)
   goalPuzzleLayer['data'] = convertToSingleMapLayer(puzzle._data._data, goalChars, goalIdx)

   return {
      boxPuzzleLayer,
      wallPuzzleLayer,
      goalPuzzleLayer
   }
}


//----------- Convert 2D-Array to Single Layer w Perimeter ---------------
function convertToSingleMapLayer(twoDimArray, charSet, tileIdx) {
   let wallIdx = 12
   let blankIdx = -1 //will let floor show through

   //Map over puzzle to create single layer
   let singleMapLayer = twoDimArray.map(row=>row.map(el=>{
      if (charSet[el]) return tileIdx;
      else return blankIdx;
   }))

   //Set tile index for the perimeter
   let perimeterTileIdx = blankIdx
   tileIdx === wallIdx ? perimeterTileIdx = wallIdx : null

   //Add perimeter to puzzle
   singleMapLayer.push(Array(twoDimArray[0].length).fill(perimeterTileIdx))
   singleMapLayer.unshift(Array(twoDimArray[0].length).fill(perimeterTileIdx))
   singleMapLayer.forEach(row=>{
      row.push(perimeterTileIdx)
      row.unshift(perimeterTileIdx)
   })

   //If current layer is wall layer, add opening for player to enter
   if (tileIdx === wallIdx) {
      singleMapLayer[singleMapLayer.length-1][singleMapLayer[0].length-2] = blankIdx
   }
   return singleMapLayer
}


export {
   convertToMapLayers
}
