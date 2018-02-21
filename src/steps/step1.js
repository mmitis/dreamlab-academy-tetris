/**
 * Step 1
 *
 * Fill the board with the values
 * Create array of the elements and styling them
 */


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
        })
    })
}

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
            boardArr[i][j] = {
                type: 'red'
            };
        }
    }
    return boardArr;
}


const boardRef = document.getElementById('game-board');
const boardSetup = setupBoard(boardRef, 10, 20, 20);
drawBoard(boardRef, boardSetup, 20);
