import React from 'react'

const gameInstructions = () => {
    const instructionsStyle = {
        position: "absolute",
        top: "24px",
        left: "675px"
    }
    return (
        <div style={instructionsStyle}>
            <h3>Game Play:</h3>
            <ul>
                <li>Move the player using your arrow keys</li>
                <br/>
                <li>Follow along in the text box: Press enter to continue through the text box and exit the text box</li>
                <br/>
                <li>Use the player's motions to move the boxes in the sokoban puzzle</li>
                <br/>
                <li>To complete the puzzle, move all the boxes in the puzzle to their goal points</li>
            </ul>
        </div>
    )

}

export default gameInstructions