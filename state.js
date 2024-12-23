function createState(width, height) {
    const state = Array.from({ length: width }, () => Array(height).fill(0));

    return {
        getCell(x, y) {
            return state[x][y];
        },
        setCell(x, y, value) {
            state[x][y] = value;
        },
        printState() {
            console.log(state.map(row => row.join(' ')).join('\n'));
        },
        renderState() {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const cell = document.getElementById(`cell-${i}-${j}`);
                    cell.textContent = state[i][j];
                }
            }
        },
    }
}
