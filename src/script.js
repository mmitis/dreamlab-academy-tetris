const Config = {
    FIELDSIZE: 20,
    WIDTH: 15,
    HEIGHT: 25,
    BLOCKS: 4
};

const Keys = {
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
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
            if (field) {
                const canMove = j + 1 < boardSetup[i].length && boardSetup[i][j + 1] == null;
                if (canMove) {
                    boardSetup[i][j + 1] = field;
                    boardSetup[i][j] = null;
                } else {
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
                // set position
                element.style.top = `${fieldSize * columnIndex}px`;
                element.style.left = `${fieldSize * rowIndex}px`;

                // set size
                element.style.width = `${fieldSize}px`;
                element.style.height = `${fieldSize}px`;

                // add classes
                element.classList.add('block');
                element.classList.add(`block-color-${field.color}`);
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
 */
function addBlock(boardSetup, posX, posY) {
    boardSetup[posX][posY] = {
        color: ['red', 'blue'][Math.floor(Math.random() * 2)],
        run: true
    }
}

function addSegment(boardSetup) {
    addBlock(boardSetup, Math.floor(Config.WIDTH / 2), 0);
    addBlock(boardSetup, Math.floor(Config.WIDTH / 2), 1);
    addBlock(boardSetup, Math.ceil(Config.WIDTH / 2), 0);
    addBlock(boardSetup, Math.ceil(Config.WIDTH / 2), 1);
    return Config.BLOCKS;
}

function moveLeft(boardSetup){
    for (let i = 0; i < boardSetup.length -1; i++) {
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

function clear(boardSetup) {
    i
}

function moveRight(boardSetup){
    for (let i =  boardSetup.length -1; i > 0; i--) {
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

function runTheGame() {
    const board = document.getElementById('board');
    const boardSetup = setupBoard(board, Config.WIDTH, Config.HEIGHT, Config.FIELDSIZE);

    document.addEventListener("keydown", (e) => {
        if (getElementsMoving(boardSetup) === Config.BLOCKS) {
            if (Keys.ARROW_LEFT === e.keyCode) {
                moveLeft(boardSetup);
            }
            if (Keys.ARROW_RIGHT === e.keyCode) {
                moveRight(boardSetup);
            }
        }
    });

    const timeInterval = setInterval(function () {
        drawBoard(board, boardSetup, Config.FIELDSIZE);
        updateFields(boardSetup);

        if (getElementsMoving(boardSetup) === 0) {
            addSegment(boardSetup);
        }


    }, 40);


}

runTheGame();