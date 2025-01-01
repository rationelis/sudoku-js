const WIDTH = 9;
const HEIGHT = 9;

const Difficulties = {
    EASY: { text: "Easy", remove: 20 }, 
    MEDIUM: { text: "Medium", remove: 35 },
    HARD: { text: "Hard", remove: 50 },
    EXTREME: { text: "Extreme", remove: 60 },
};

const board = document.getElementById("board");

let state;

let keydownTimeout = null;
let keydownActive = false; 
const timeoutValue = 1000;

function createState(w, h) {
    let state = Array.from({ length: w }, () => Array(h).fill(0));

    function createStateFromSlice(slice) {
        return {
            getCell(x, y) {
                return slice[x][y];
            },
            setCell(x, y, value) {
                slice[x][y] = value;
            },
            getSlice() {
                return createStateFromSlice(slice.map(row => [...row]));
            },
            findCellsWithValue(value) {
                const cells = document.getElementsByClassName("cell"); 
                const array = Array.prototype.slice.call(cells);
                return array.filter(cell => cell.textContent == value);
            },
            isFinished() {
                return state.every(row => row.every(value => value != 0));
            },
        };
    }

    return createStateFromSlice(state);
}

function generateButtons() {
    const buttons = document.getElementById("buttons");
    Object.values(Difficulties).forEach(element => {
        const button = document.createElement("button");
        button.innerText = element.text;
        button.onclick = () => {
            generateGame(element); 
        };
        buttons.append(button);
    });
}

function generateBoard(width, height) {
    const board = document.getElementById("board");
    const table = document.createElement("table");
    table.setAttribute("class", "board");

    for (let i = 0; i < width; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < height; j++) {
            const cell = document.createElement("td");
            cell.setAttribute("class", "cell");
            cell.setAttribute("id", `cell-${i}-${j}`);
            cell.setAttribute("x", i);
            cell.setAttribute("y", j);
            cell.addEventListener("click", 
                (event) => handleCellClick(state, event.target)
            );
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    board.appendChild(table);
}

function renderState(state) {
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = state.getCell(i, j);
            cell.textContent = value == 0 ? " " : value;
        }
    }
}

function handleCellClick(state, cell) {
    clearHighlights();
    renderState(state);

    highlighted.selected = cell;

    applyIntersectHighlights(cell.attributes.x.value, cell.attributes.y.value);

    if (cell.textContent == 0) return; // No highlight on zero.

    const secondaryCells = state.findCellsWithValue(cell.textContent);
    applySecondaryHighlights(cell, secondaryCells);
}

function fillInNumber(state, value) {
    if (!highlighted.selected) return;

    const x = highlighted.selected.attributes.x.value;
    const y = highlighted.selected.attributes.y.value;

    const isValidPlacement = isValid(state, x, y, value);

    state.setCell(x, y, value);
    renderState(state);

    if (!isValidPlacement) {
        highlighted.selected.classList.add(highlightIncorrect);
        state.setCell(x, y, 0);
        return;
    }

    const tempState = state.getSlice();

    const isSolvable = solve(tempState);

    if (!isSolvable) {
        highlighted.selected.classList.add(highlightIncorrect);
        state.setCell(x, y, 0);
        return;
    }

    handleCellClick(state, highlighted.selected);

    if (state.isFinished()) {
        setTimeout(() => {
            alert("You won!");
        }, 1000);
    }
}

document.addEventListener("keydown", (event) => {
    if (keydownActive) return; 

    keydownActive = true;

    const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (validKeys.includes(event.key)) {
        fillInNumber(state, event.key);
    }

    keydownTimeout = setTimeout(() => {
        keydownActive = false;
    }, timeoutValue);
});

generateButtons();
generateBoard(WIDTH, HEIGHT);

function generateGame(difficulty) {
    state = createState(WIDTH, HEIGHT);

    generatePuzzle(state);
    removeCells(state, difficulty.remove);

    renderState(state);
}

generateGame(Difficulties.HARD);

