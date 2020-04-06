import React from 'react'

const gameInstructions = () => {
  return (
    <div id="directions">
      <h4>How To Play</h4>
      <ul>
        <li>Move the player using your arrow keys</li>
        <br />
        <li>
          Follow along in the text box: Press enter to continue through the text
          box and exit the text box
        </li>
        <br />
        <li>
        The player moves the boxes in the sokoban puzzle, you control the player's movements with the arrow keys
        </li>
        <br />
        <li>
          To complete the puzzle, move all the boxes in the puzzle to their goal
          points
        </li>
        <br />
        <li>
        If needed, you can use your mouse to click the reset button to start the level over again
        </li>
      </ul>
    </div>
  )
}

export default gameInstructions
