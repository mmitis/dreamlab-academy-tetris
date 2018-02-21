// basic configurations
const Config = {
    BLOCKSIZE: 20,                  // size of the blocks
    WIDTH: 15,                      // number of the blocks in a row
    HEIGHT: 25,                     // number of the rows
    BLOCKS: 4,                      // size of the single segment
    BLOCKTYPES: ['red', 'blue'],    // types of the blocks
    GAMESPEED: 150                  // speed of the game loop interval
};

// keyCodes of the selected buttons
const Keys = {
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    SPACE: 32
};


/**
 * Setup boards for the game
 * @param {HTMLElement}     boardContainer - handler to dom element with board
 * @param {Number}          sizeX - size of the board X
 * @param {Number}          sizeY - size of the board Y
 * @param {Number}          blockSize - size of the single block size in px
 * @returns {Array}
 */
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
            boardArr[i][j] = null;
        }
    }
    return boardArr;
}

/**
 * Updates the blocks which can fall
 * @param {Array}   boardSetup - array with the block data
 */
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

/**
 * Refresh the board in view
 * @param {HTMLElement} boardContainer - handler to element in DOM
 * @param {Array}       boardSetup - array with the block data
 * @param {Number}      blockSize - size of the single block
 */
function drawBoard(boardContainer, boardSetup, blockSize) {
    boardContainer.innerHTML = '';
    boardSetup.forEach(function (row, columnIndex) {
        row.forEach(function (blocks, rowIndex) {
            if (blocks) {
                let element = document.createElement('div');
                // set absolute position with top/left CSS properties
                element.style.top = `${blockSize * columnIndex}px`;
                element.style.left = `${blockSize * rowIndex}px`;

                // set size
                element.style.width = `${blockSize}px`;
                element.style.height = `${blockSize}px`;

                // add classes
                element.classList.add('block');
                element.classList.add(`block-type-${blocks.type}`);
                boardContainer.appendChild(element);
            }
        })
    })
}

/**
 * Refresh he score
 * @param {HTMLElement} scoreContainer - handler to element in DOM
 * @param {Number}      score - user score
 */
function drawScore(scoreContainer, score = 0) {
    scoreContainer.innerText = `Score : ${score} points`;
}

/**
 * Adds single block to the blocks data
 * @param {Array}       boardSetup - array with the blocks data
 * @param {Number}      posX - position on the board X
 * @param {Number}      posY - position on the board Y
 * @param {Array}       blockTypes - types of the  block to use
 */
function addBlock(boardSetup, posY, posX, blockTypes = Config.BLOCKTYPES) {
    // line above - default value is used. If you don't pass blockTypes to the function
    // execution Config.BLOCKTYPES will be used
    boardSetup[posY][posX] = {
        // rand the block type
        type: blockTypes[Math.floor(Math.random() * blockTypes.length)],
        // set that the block is moving from the start
        run: true
    }
}

/**
 * Adds segment (square of 4 blocks) to the board on the center of the top
 * @param {Array}       boardSetup - array with the blocks data
 */
function addSegment(boardSetup) {
    // calculate the center of the board
    const center = Math.floor((boardSetup[0].length-1) / 2);
    // add 4 blocks
    addBlock(boardSetup, 0, center);
    addBlock(boardSetup, 1, center);
    addBlock(boardSetup, 0, center + 1);
    addBlock(boardSetup, 1, center + 1);
}

function moveLeft(boardSetup) {
    // find top right corner of the segment
    const coords = findCornerElementMoving(boardSetup);
    // check if user can still move (board borders && if there is enough space)
    const canMove = coords.x - 1 >= 0 && boardSetup[coords.y][coords.x - 1] == null &&
        boardSetup[coords.y + 1][coords.x - 1] == null;
    if (canMove) {
        // rewrite blocks in top row
        boardSetup[coords.y][coords.x - 1] = boardSetup[coords.y][coords.x];
        boardSetup[coords.y][coords.x] = boardSetup[coords.y][coords.x + 1];
        boardSetup[coords.y][coords.x + 1] = null;
        // rewrite blocks in second row
        boardSetup[coords.y + 1][coords.x - 1] = boardSetup[coords.y + 1][coords.x];
        boardSetup[coords.y + 1][coords.x] = boardSetup[coords.y + 1][coords.x + 1];
        boardSetup[coords.y + 1][coords.x + 1] = null;
    }
}


function moveRight(boardSetup) {
    // find top right corner of the segment
    const coords = findCornerElementMoving(boardSetup);
    // check if user can still move (board borders && if there is enough space)
    const canMove = coords.x + 2 < boardSetup[coords.y].length && boardSetup[coords.y][coords.x + 2] == null &&
        boardSetup[coords.y + 1][coords.x + 2] == null;
    if (canMove) {
        // rewrite blocks in top row
        boardSetup[coords.y][coords.x + 2] = boardSetup[coords.y][coords.x + 1];
        boardSetup[coords.y][coords.x + 1] = boardSetup[coords.y][coords.x];
        boardSetup[coords.y][coords.x] = null;

        // rewrite blocks in second row
        boardSetup[coords.y + 1][coords.x + 2] = boardSetup[coords.y + 1][coords.x + 1];
        boardSetup[coords.y + 1][coords.x + 1] = boardSetup[coords.y + 1][coords.x];
        boardSetup[coords.y + 1][coords.x] = null;
    }
}

/**
 * Search for the row where all blocks are the same
 * @param {Array}       boardSetup - array with the blocks data
 * @returns {number}    rowsScored - number of the rows cleared
 */
function clearRows(boardSetup) {
    let rowsScored = 0;
    for (let i = 0; i < boardSetup.length; i++) {
        if (boardSetup[i][0]) {
            const pattern = boardSetup[i][0];
            const hasToBeClear = boardSetup[i].every(function (block) {
                return block && !block.run && block.type === pattern.type;
            });

            if (hasToBeClear) {
                // add one point per cleared row
                rowsScored++;
                // remove them if all are the same
                boardSetup[i] = boardSetup[i].map(() => null);
            }
        }
    }
    // return the number of the scored rows
    return rowsScored;
}

/**
 * Rotates the moving segment
 * @param {Array}       boardSetup - array with the blocks data
 */
function rotate(boardSetup) {
    // find top corner of the moving block
    const coords = findCornerElementMoving(boardSetup);
    // save single block as temporary
    const tmp = boardSetup[coords.y][coords.x];
    // rewrite all blocks 'by one' to rotate
    boardSetup[coords.y][coords.x] = boardSetup[coords.y][coords.x + 1];
    boardSetup[coords.y][coords.x + 1] = boardSetup[coords.y + 1][coords.x + 1];
    boardSetup[coords.y + 1][coords.x + 1] = boardSetup[coords.y + 1][coords.x];
    boardSetup[coords.y + 1][coords.x] = tmp;
}

/**
 * Finds the top left corner of the moving segment
 * @param {Array}       boardSetup - array with the blocks data
 * @returns {{ x: Number|null, y: Number|null }}
 */
function findCornerElementMoving(boardSetup) {
    // iterate through whole board to find top corner of the moving segment
    for (let i = 0; i < boardSetup.length; i++) {
        for (let j = 0; j < boardSetup[i].length; j++) {
            // check if element exists and is moving
            if (boardSetup[i][j] && boardSetup[i][j].run) {
                // return values as simple object and break the for-loop
                return {y: i, x: j};
            }
        }
    }
    // if not found - return empty data
    return {y: null, x: null};
}

/**
 * Game initialization
 */
function runTheGame() {
    // pick the handler to the element in the HTML by ID ('#board')
    const boardRef = document.getElementById('game-board');
    const scoreRef = document.getElementById('game-score');
    // create new empty array for the game - with selected configuration (width, height of the board, size of the single block)
    const boardSetup = setupBoard(boardRef, Config.WIDTH, Config.HEIGHT, Config.BLOCKSIZE);

    let score = 0;

    // add event listener which is going to be executed on every key down
    document.addEventListener("keydown", function (event) {
        // move only when segment still can moved / rotated - all blocks are running
        if (getElementsMoving(boardSetup) === Config.BLOCKS) {
            // "event" object contains all data about the executed event. For example, it contains "key" property which
            // holds name of the button clicked, but it's better to check it via keyCode - it returns code of the key
            // (its supported in every browser)
            switch (event.keyCode) {
                case Keys.ARROW_LEFT:
                    return moveLeft(boardSetup);
                case Keys.ARROW_RIGHT:
                    return moveRight(boardSetup);
                case Keys.SPACE:
                    return rotate(boardSetup);
                default:
                    return;
                // do nothing, but should be defined as good practice
            }
        }
    });
    // run game loop. Reference is saved to the variable for the future use.
    const gameLoopInterval = setInterval(function () {
        // draw current state of the board
        drawBoard(boardRef, boardSetup, Config.BLOCKSIZE);
        // make all updates of the blocks
        updateBlocksPositions(boardSetup);
        score += clearRows(boardSetup);
        drawScore(scoreRef, score);
        // if there is no element which is moving - create the new one
        if (getElementsMoving(boardSetup) === 0) {
            // adds segment
            addSegment(boardSetup);
        }
        //function will be executed each (Config.GAMESPEED) milliseconds
    }, Config.GAMESPEED);
}

// run it!
runTheGame();
