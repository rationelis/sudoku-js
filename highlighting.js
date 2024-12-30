const highlightSelected = "highlight";
const highlightSecondary = "highlight-secondary";
const highlightIntersect = "highlight-intersect";
const highlightIncorrect = "highlight-incorrect";

let highlighted = {
    selected: null,
    secondary: [],
    intersect: [], 
};

function clearHighlights() {
    if (!highlighted.selected) return;
    highlighted.selected.classList.remove(highlightSelected);
    highlighted.selected.classList.remove(highlightIncorrect);

    highlighted.secondary.forEach(cell => cell.classList.remove(highlightSecondary));
    highlighted.secondary = [];
    highlighted.intersect.forEach(cell => cell.classList.remove(highlightIntersect));
    highlighted.intersect = [];
}

function applySecondaryHighlights(selectedCell, secondaryCells) {
    secondaryCells.forEach(cell => {
        cell.classList.add(highlightSecondary);
        highlighted.secondary.push(cell);
    });

    selectedCell.classList.remove(highlightIntersect)
    selectedCell.classList.remove(highlightSecondary);
    selectedCell.classList.add(highlightSelected);
    highlighted.selected = selectedCell;
}

function applyIntersectHighlights(x, y) {
    for (let i = 0; i < 9; i++) {
        const row = document.getElementById(`cell-${x}-${i}`);
        const col = document.getElementById(`cell-${i}-${y}`);
        
        addToIntersect(row);
        addToIntersect(col);

        function addToIntersect(cell) {
            cell.classList.add(highlightIntersect); 
            highlighted.intersect.push(cell);
        }
    }
}

document.addEventListener("click", function (event) {
    if (!board.contains(event.target)) {
        clearHighlights();
    }
});

