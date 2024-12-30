function generatePuzzle(state) {
    const locations = generatePossibleLocations(state);

    while (locations.length > 0) {
        const locationIndex = Math.floor(Math.random() * locations.length);
        const [row, col] = locations[locationIndex];

        let candidates = getAvailableNumbers(state, row, col);
        const tempState = state.getSlice();

        while (candidates.length > 0) {
            const candidateIndex = Math.floor(Math.random() * candidates.length);
            const selectedNumber = candidates[candidateIndex];

            tempState.setCell(row, col, selectedNumber);

            if (solve(tempState)) {
                // Valid placement, update state and proceed
                state.setCell(row, col, selectedNumber);
                locations.splice(locationIndex, 1);
                break;
            } else {
                // Invalid placement, backtrack
                tempState.setCell(row, col, 0);
                candidates.splice(candidateIndex, 1);
            }
        }
    }
}

function generatePossibleLocations(state) {
    const locations = [];
    for (let row = 0; row < WIDTH; row++) {
        for (let col = 0; col < HEIGHT; col++) {
            locations.push([row, col]);
        }
    }
    return locations;
}

function removeCells(state, n) {
    let cellsToRemove = n;
    let locations = shuffle(generatePossibleLocations(state));

    while (cellsToRemove > 0 && locations.length > 0) {
        const [row, col] = locations.pop();
        const backupState = state.getSlice();

        backupState.setCell(row, col, 0);

        if (solve(backupState)) {
            state.setCell(row, col, 0);
            cellsToRemove--;
        }
    }
}

function getAvailableNumbers(state, row, col) {
    const possibleNumbers = new Set(
        Array.from({ length: WIDTH }, (_, i) => i + 1)
    );

    for (let i = 0; i < WIDTH; i++) {
        possibleNumbers.delete(state.getCell(row, i)); // Row
        possibleNumbers.delete(state.getCell(i, col)); // Column
    }

    const blockRowStart = Math.floor(row / 3) * 3;
    const blockColStart = Math.floor(col / 3) * 3;
    for (let i = blockRowStart; i < blockRowStart + 3; i++) {
        for (let j = blockColStart; j < blockColStart + 3; j++) {
            possibleNumbers.delete(state.getCell(i, j));
        }
    }

    return Array.from(possibleNumbers);
}

function solve(state) {
    const candidates = computeInitialCandidates(state);

    function backtrack() {
        if (candidates.size === 0) return true; // Solved!

        // Find the cell with the fewest candidates
        const [cell, options] = [...candidates.entries()].reduce((a, b) =>
            a[1].length < b[1].length ? a : b
        );
        const [row, col] = cell.split(",").map(Number);

        for (const num of options) {
            state.setCell(row, col, num);
            const affectedCells = updateCandidates(candidates, row, col, num);

            if (backtrack()) return true;

            // Undo changes if not successful
            state.setCell(row, col, 0);
            restoreCandidates(candidates, affectedCells);
        }

        return false;
    }

    return backtrack();
}

function computeInitialCandidates(state) {
    const candidates = new Map();

    for (let row = 0; row < WIDTH; row++) {
        for (let col = 0; col < HEIGHT; col++) {
            if (state.getCell(row, col) === 0) {
                candidates.set(
                    `${row},${col}`,
                    getAvailableNumbers(state, row, col)
                );
            }
        }
    }

    return candidates;
}

function updateCandidates(candidates, row, col, num) {
    const affectedCells = [];

    for (const [key, options] of candidates) {
        const [r, c] = key.split(",").map(Number);
        if (
            r === row ||
            c === col ||
            (Math.floor(r / 3) === Math.floor(row / 3) &&
                Math.floor(c / 3) === Math.floor(col / 3))
        ) {
            if (options.includes(num)) {
                options.splice(options.indexOf(num), 1);
                affectedCells.push([key, num]);
            }
        }
    }

    candidates.delete(`${row},${col}`);
    return affectedCells;
}

function restoreCandidates(candidates, affectedCells) {
    for (const [key, num] of affectedCells) {
        if (!candidates.has(key)) candidates.set(key, []);
        candidates.get(key).push(num);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
}

function isValid(state, row, col, num) {
    // Check row
    for (let i = 0; i < WIDTH; i++) {
        if (state.getCell(row, i) == num) {
            return false;
        }
    }

    // Check column
    for (let i = 0; i < HEIGHT; i++) {
        if (state.getCell(i, col) == num) {
            return false;
        }
    }

    // Check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (state.getCell(i, j) == num) {
                return false;
            }
        }
    }

    return true;
}

