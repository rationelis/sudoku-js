const WIDTH = 9;
const HEIGHT = 9;

function createState(w, h) {
    const state = Array.from({ length: w }, () => Array(h).fill(0));
    const width = w;
    const height = h;

    function createStateFromSlice(slice) {
        return {
            getWidth() {
                return width;
            },
            getHeight() {
                return height;
            },
            getCell(x, y) {
                return slice[x][y];
            },
            setCell(x, y, value) {
                slice[x][y] = value;
            },
            getSlice() {
                return createStateFromSlice(slice.map(row => [...row])); // Deep copy of the slice
            },
        };
    }

    return createStateFromSlice(state);
}

generateBoard(WIDTH, HEIGHT);

const state = createState(WIDTH, HEIGHT);

generatePuzzle(state);
removeCells(state, 40);

renderState(state);

