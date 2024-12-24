function generatePuzzle(state) {
    let locations = generatePossibleLocation(state);
    let tries = 0;

    while (locations.length > 0) {
        if (tries > 150) {
            break;
        }

        const locationIndex = Math.floor(Math.random() * locations.length);
        const [row, col] = locations[locationIndex]; 

        // This should not happen anymore.
        // if (state.getCell(row, col) !== 0) continue;
        
        let numbers = getAvailableNumbers(state, row, col);
        const newState = state.getSlice();

        while (numbers.length > 0) {
            const numberIndex = Math.floor(Math.random() * numbers.length);
            const selectedNumber = numbers[numberIndex];

            newState.setCell(row, col, selectedNumber);

            if (solve(newState)) {
                // This is a valid option.
                state.setCell(row, col, selectedNumber);
                locations.splice(locationIndex, 1);
                console.log(`Solvable! ${locations.length} left.`);
                break;
            } else {
                // This is not a valid option.
                newState.setCell(row, col, 0);
                numbers.splice(numberIndex, 1);
                console.log(`Unsolvable!`);
            }
        }
        
        tries++;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function removeCells(state, n) {
    let cellsToRemove = n;
    let locations = generatePossibleLocation(state);

    locations = shuffle(locations);

    while (cellsToRemove > 0 && locations.length > 0) {
        const [row, col] = locations.pop(); 
        const backupState = state.getSlice();

        backupState.setCell(row, col, 0); 

        if (solve(backupState)) {
            state.setCell(row, col, 0);
            cellsToRemove--;
            console.log(`Removed cell (${row}, ${col}). ${cellsToRemove} left to remove.`);
        } else {
            console.log(`Could not remove cell (${row}, ${col}) as it made the puzzle unsolvable.`);
        }
    }
}

function generatePossibleLocation(state) {
    const locations = [];
    for (let i = 0; i < state.getWidth(); i++) {
        for (let j = 0; j < state.getHeight(); j++) {
            locations.push([i, j]);
        }
    }
    return locations;
}

function getAvailableNumbers(state, row, col) {
    const available = new Set(Array.from({ length: state.getWidth() }, (_, i) => i + 1));

    // Remove numbers already in the row
    for (let i = 0; i < state.getWidth(); i++) {
        available.delete(state.getCell(row, i));
    }

    // Remove numbers already in the column
    for (let i = 0; i < state.getHeight(); i++) {
        available.delete(state.getCell(i, col));
    }

    // Remove numbers already in the 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            available.delete(state.getCell(i, j));
        }
    }

    return Array.from(available);
}

function isValid(state, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (state.getCell(row, i) === num) {
            return false;
        }
    }
    // Check column
    for (let i = 0; i < 9; i++) {
        if (state.getCell(i, col) === num) {
            return false;
        }
    }
    // Check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (state.getCell(i, j) === num) {
                return false;
            }
        }
    }
    return true;
}

function solve(state) {
    for (let i = 0; i < state.getWidth(); i++) {
        for (let j = 0; j < state.getHeight(); j++) {
            if (state.getCell(i, j) == 0) {
                for (let num = 1; num <= state.getWidth(); num++) {
                    if (isValid(state, i, j, num)) {
                        state.setCell(i, j, num);
                        if (solve(state)) {
                            return true;
                        }
                        state.setCell(i, j, 0);
                    }
                }   
                return false;
            }
        }
    }
    return true;
}
