const Config = {
    FIELDSIZE: 20,
    WIDTH: 15,
    HEIGHT: 25,
    BLOCKS: 4,
    BLOCKTYPES: ['red', 'blue'],
    GAMESPEED: 150
};

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
 * @param {Number}          fieldSize - size of the single field size in px
 * @returns {Array}
 */
function setupBoard(boardContainer, sizeX, sizeY, fieldSize) {
    //setup board
    boardContainer.style.width = `${fieldSize * sizeX}px`;
    boardContainer.style.height = `${fieldSize * sizeY}px`;

    // return empty array of block
    let boardArr = [];
    for (let i = 0; i < sizeX; i++) {
        boardArr[i] = [];
        for (let j = 0; j < sizeY; j++) {
            // fill with the empty value
            boardArr[i][j] = null;
        }
    }
    return boardArr;
}

/**
 * Updates the fields which can fall
 * @param {Array}   boardSetup - array with the field data
 */
function updateFields(boardSetup) {
    for (let i = boardSetup.length - 1; i >= 0; i--) {
        for (let j = boardSetup[i].length - 1; j >= 0; j--) {
            const field = boardSetup[i][j];
            // if field is setup - manipulate it
            if (field) {
                // check if something is below or there is a floor
                const canMove = j + 1 < boardSetup[i].length && boardSetup[i][j + 1] == null;
                if (canMove) {
                    // move to the bottom by one
                    boardSetup[i][j + 1] = field;
                    boardSetup[i][j] = null;
                } else {
                    // if element cannot move, and was controlled by user before - block it!
                    if (field.run) {
                        field.run = false;
                    }
                }
            }
        }
    }
}

/**
 * Gets the number of the blocks which have moving status
 * @param {Array} boardSetup
 */
function getElementsMoving(boardSetup) {
    return boardSetup.reduce((state, row) => {
        return state + row.reduce((state, field) => {
            return field && field.run === true ? state + 1 : state;
        }, 0);
    }, 0);
}

/**
 * Refresh the board in view
 * @param {HTMLElement} boardContainer - handler to element in DOM
 * @param {Array}       boardSetup - array with the field data
 * @param {Number}      fieldSize - size of the single field
 */
function drawBoard(boardContainer, boardSetup, fieldSize) {
    boardContainer.innerHTML = '';
    boardSetup.forEach(function (row, rowIndex) {
        row.forEach(function (field, columnIndex) {
            if (field) {
                let element = document.createElement('div');
                // set absolute position with top/left CSS properties
                element.style.top = `${fieldSize * columnIndex}px`;
                element.style.left = `${fieldSize * rowIndex}px`;

                // set size
                element.style.width = `${fieldSize}px`;
                element.style.height = `${fieldSize}px`;

                // add classes
                element.classList.add('block');
                element.classList.add(`block-type-${field.type}`);
                boardContainer.appendChild(element);
            }
        })
    })
}

/**
 * Adds single block to the field data
 * @param {Array}       boardSetup - array with the field data
 * @param {Number}      posX - position on the board X
 * @param {Number}      posY - position on the board Y
 * @param {Array}       blockTypes - types of the  block to use
 */
function addBlock(boardSetup, posX, posY, blockTypes = Config.BLOCKTYPES) {
    // line above - default value is used. If you don't pass blockTypes to the function
    // execution Config.BLOCKTYPES will be used
    boardSetup[posX][posY] = {
        // rand the block type
        type: blockTypes[Math.floor(Math.random() * blockTypes.length)],
        // set that the block is moving from the start
        run: true
    }
}

/**
 * Adds segment (square of 4 blocks) to the board on the center of the top
 * @param {Array}       boardSetup - array with the field data
 */
function addSegment(boardSetup) {
    // calculate the center of the board
    const center = Math.floor(boardSetup.length / 2);
    // add 4 blocks
    addBlock(boardSetup, center, 0);
    addBlock(boardSetup, center, 1);
    addBlock(boardSetup, center + 1, 0);
    addBlock(boardSetup, center + 1, 1);
}

function moveLeft(boardSetup) {
    for (let i = 0; i <= boardSetup.length - 1; i++) {
        for (let j = boardSetup[i].length - 1; j >= 0; j--) {
            const field = boardSetup[i][j];
            if (field && field.run) {
                const canMove = i - 1 >= 0 && boardSetup[i - 1][j] == null;
                if (canMove) {
                    boardSetup[i - 1][j] = field;
                    boardSetup[i][j] = null;
                }
            }
        }
    }
}

function moveRight(boardSetup) {
    for (let i = boardSetup.length - 1; i >= 0; i--) {
        for (let j = boardSetup[i].length - 1; j >= 0; j--) {
            const field = boardSetup[i][j];
            if (field && field.run) {
                const canMove = i + 1 < boardSetup.length && boardSetup[i + 1][j] == null;
                if (canMove) {
                    boardSetup[i + 1][j] = field;
                    boardSetup[i][j] = null;
                }
            }
        }
    }
}

function findPattern(boardSetup){
    for (let i = 0; i < boardSetup.length; i++) {
        if(boardSetup[j][0]){
            for (let j = 0; j < boardSetup[i].length; j++) {
                // check if element exists and is moving

            }
        }

    }
}

/**
 * Rotates the moving segment
 * @param {Array}       boardSetup - array with the field data
 */
function rotate(boardSetup) {
    // find top corner of the moving block
    const coords = findCornerElementMoving(boardSetup);
    // save single block as temporary
    const tmp = boardSetup[coords.x][coords.y];
    // rewrite all fields 'by one' to rotate
    boardSetup[coords.x][coords.y] = boardSetup[coords.x][coords.y + 1];
    boardSetup[coords.x][coords.y + 1] = boardSetup[coords.x + 1][coords.y + 1];
    boardSetup[coords.x + 1][coords.y + 1] = boardSetup[coords.x + 1][coords.y];
    boardSetup[coords.x + 1][coords.y] = tmp;
}

/**
 * Finds the top left corner of the moving segment
 * @param {Array}       boardSetup - array with the field data
 * @returns {{ x: Number|null, y: Number|null }}
 */
function findCornerElementMoving(boardSetup) {
    // iterate through whole board to find top corner of the moving segment
    for (let i = 0; i < boardSetup.length; i++) {
        for (let j = 0; j < boardSetup[i].length; j++) {
            // check if element exists and is moving
            if (boardSetup[i][j] && boardSetup[i][j].run) {
                // return values as simple object and break the for-loop
                return {x: i, y: j};
            }
        }
    }
    // if not found - return empty data
    return {x: null, y: null};
}


function runTheGame() {
    // pick the handler to the element in the HTML by ID ('#board')
    const boardRef = document.getElementById('game-board');
    const scoreRef = document.getElementById('game-score');
    // create new empty array for the game - with selected configuration (width, height of the board, size of the single block)
    const boardSetup = setupBoard(boardRef, Config.WIDTH, Config.HEIGHT, Config.FIELDSIZE);

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
        drawBoard(boardRef, boardSetup, Config.FIELDSIZE);
        // make all updates of the fields
        updateFields(boardSetup);

        // if there is no element which is moving - create the new one
        if (getElementsMoving(boardSetup) === 0) {
            // adds segment
            addSegment(boardSetup);
        }
        //function will be executed each (Config.GAMESPEED) milliseconds
    }, Config.GAMESPEED);


}

runTheGame();