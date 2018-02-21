/**
 * Step 2
 *
 * - Added loop and run game function
 * - Added updating of the block position
 */


// basic configurations
const Config = {
    BLOCKSIZE: 20,                  // size of the blocks
    WIDTH: 15,                      // number of the blocks in a row
    HEIGHT: 25,                     // number of the rows
    BLOCKTYPES: ['red', 'blue'],    // types of the blocks,
    GAMESPEED: 400
};

function drawBoard(boardContainer, boardSetup, blockSize) {
    boardContainer.innerHTML = '';
    boardSetup.forEach(function (row, columnIndex) {
        row.forEach(function (block, rowIndex) {
            if(block) {
                let element = document.createElement('div');
                // set absolute position with top/left CSS properties
                element.style.top = `${blockSize * columnIndex}px`;
                element.style.left = `${blockSize * rowIndex}px`;

                // set size
                element.style.width = `${blockSize}px`;
                element.style.height = `${blockSize}px`;

                // add classes
                element.classList.add('block');
                element.classList.add(`block-type-${block.type}`);
                boardContainer.appendChild(element);
            }
        })
    })
}

function setupBoard(boardContainer, sizeX, sizeY, blockSize) {
    //setup board
    boardContainer.style.width = `${blockSize * sizeX}px`;
    boardContainer.style.height = `${blockSize * sizeY}px`;

    // return empty array of block
    let boardArr = [];
    for (let i = 0; i < sizeY; i++) {
        boardArr[i] = [];
        for (let j = 0; j < sizeX; j++) {
            // fill with the empty value
            boardArr[i][j] = null
        }
    }

    return boardArr;
}

function updateBlocksPositions(boardSetup) {
    for (let i = boardSetup.length - 1; i >= 0; i--) {
        for (let j = boardSetup[i].length - 1; j >= 0; j--) {
            const block = boardSetup[i][j];
            // if blocks is setup - manipulate it
            if (block) {
                // check if something is below or there is a floor
                const canMove = i + 1 < boardSetup.length && boardSetup[i + 1][j] == null;
                if (canMove) {
                    // move to the bottom by one
                    boardSetup[i + 1][j] = block;
                    boardSetup[i][j] = null;
                } else {
                    // if element cannot move, and was controlled by user before - block it!
                    if (block.run) {
                        block.run = false;
                    }
                }
            }
        }
    }
}

function addBlock(boardSetup, posY, posX, blockTypes = Config.BLOCKTYPES) {
    boardSetup[posY][posX] = {
        type: blockTypes[Math.floor(Math.random() * blockTypes.length)],
        run: true
    }
}

function addSegment(boardSetup) {
    const center = Math.floor((boardSetup[0].length-1) / 2);
    addBlock(boardSetup, 0, center);
    addBlock(boardSetup, 1, center);
    addBlock(boardSetup, 0, center + 1);
    addBlock(boardSetup, 1, center + 1);
}

function runTheGame() {
    const boardRef = document.getElementById('game-board');
    const boardSetup = setupBoard(boardRef, Config.WIDTH, Config.HEIGHT, Config.BLOCKSIZE);
    addSegment(boardSetup);

    setInterval(function () {
        drawBoard(boardRef, boardSetup, Config.BLOCKSIZE);
        updateBlocksPositions(boardSetup);
    }, Config.GAMESPEED);
}


runTheGame();
