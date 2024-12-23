generateBoard(9, 9);

const SEQ = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const state = createState(9, 9);
populateGrid(state);
generatePuzzle(state);

state.renderState();

function isValidSudoku(state) {
    for (let i = 0; i < 9; i++) {
        if (!isValidRow(state, i)) {
            return false;
        }

        if (!isValidColumn(state, i)) {
            return false;
        }
    }

    return true;
}

// function isValidBlock(state) {}

function isValidRow(state, row) {
    const values = [];
    for (let i = 0; i < 9; i++) {
        values.push(state.getCell(row, i));
    }
    return values.sort() == SEQ;

}

function isValidColumn(state, column) {
    const values = [];
    for (let i = 0; i < 9; i++) {
        values.push(state.getCell(i, column));
    }
    return values.sort() == SEQ;
}

function generatePuzzle(state) {
    let tries = 0;
    while (!isValidSudoku(state)) {
        if (tries > 100000) {
            console.log("We tried so hard, and got so far, but in the end, it didn't even matter :(");
            break;
        }
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                shuffleBlock(state, i, j);
            }
        }
        tries++;
    }

}

function shuffleBlock(state, rowStart, colStart) {
    let block = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            block.push(state.getCell(rowStart + i, colStart + j));
        }
    }

    block = block.sort(() => Math.random() - 0.5);

    let idx = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            state.setCell(rowStart + i, colStart + j, block[idx++]);
        }
    }
}

function populateGrid(state) {
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            let block = SEQ.sort(() => Math.random() - 0.5);
            let idx = 0;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    state.setCell(i + row, j + col, block[idx++]);
                }
            }
        }
    }
}

