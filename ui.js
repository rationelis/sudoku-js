const board = document.getElementById("board");
let highlightedCell = null;

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
            cell.addEventListener("click", (event) => handleCellClick(event));
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    board.appendChild(table);
}

function handleCellClick(event) {
    if (highlightedCell) {
        highlightedCell.classList.remove("highlight");
    }

    const clickedCell = event.target;
    clickedCell.classList.add("highlight");

    highlightedCell = clickedCell;
}
