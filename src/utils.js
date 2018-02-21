/**
 * Gets the number of the blocks which are currently moving
 * @param {Array} board
 */
function getElementsMoving(board) {
    // little magic - look the reduce function in documentation on web :)
    return board.reduce((state, row) => {
        return state + row.reduce((state, block) => {
            return block && block.run === true ? state + 1 : state;
        }, 0);
    }, 0);
}
