// The game board [row][col]
let board = [];

let score = 0;

// Background, foreground
let textColor = "#E5E1D3";
let colors = {
    2: "#CAD2C5",
    4: "#84A98C",
    8: "#52796F",
    16: "#354F52",
    32: "#2F3E46",
    64: "#5171A5",
    128:"#36558F",
    256: "#4C2C69",
    512: "#42253B",
    1024: "#832232",
    2048: "#963D5A",
    4096: "#C16E70",
    8192: "#9E5E31",
    16384: "#FF6F59",
};

$().ready(function () {
    // Initialize the board to empty.
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 0; i < 4; i++) {
            row.push(0);
        }
        board.push(row);
    }

    // Add a tile where clicked, or else double the value of the clicked tile.
    $("#game_board").on('mousedown', 'div.tile', function () {
        if($(this).hasClass("active")) {
            let [row, col] = getPosition($(this));
            board[row][col] *= 2;
            updateTile($(this));

        } else {
            let [row, col] = getPosition($(this));
            addTile(row, col);
        }
        return false;
    });

    // Handle arrow keys
    $(document).keydown(function(event) {
        let keyCode = event.which;
        switch (keyCode) {
            case 37: {
                if (slideTiles("left")) {
                    addRandomTiles();
                }
                event.preventDefault();
                break;
            }
            case 38: {
                if (slideTiles("up")) {
                    addRandomTiles();
                }
                event.preventDefault();
                break;
            }
            case 39: {
                if (slideTiles("right")) {
                    addRandomTiles();
                }
                event.preventDefault();
                break;
            }
            case 40: {
                if (slideTiles("down")) {
                    addRandomTiles();
                    alert("Moved DOWN");
                }
                event.preventDefault();
                break;
            }
            default:
                return;
        }
        return false;
    });

    return false;
});

function updateTile($tile) {
    let [row, col] = getPosition($tile);
    let value = board[row][col];
    if (value < 16385) {
        $tile.text(value);
        $tile.css("background-color", colors[value]);
        if (value !== 2) $tile.css("color", textColor);
    }
    return false;
}

function addTile(row, col) {
    let $newTile = $('<div class="tile"></div>');
    $newTile.addClass("row" + row + " col" + col);
    $newTile.toggleClass("active holder");
    let value = 2;
    board[row][col] = value;
    $newTile.text(board[row][col]);
    $newTile.css("background-color", colors[value]);
    $newTile.css("color", "#3D3C38");
    $("#game_board").append($newTile);
    return false;
}

function slideTiles(direction) {
    let movedTiles = false;
    switch (direction) {
        case "down": {
            for (let row = 1; row >= 0; row++) {
                for (let col = 0; col < 4; col++) {
                    if (board[row][col] > 0) {
                        let $tile = getTileAtPosition(row, col);
                        movedTiles = (slideTile($tile, direction) || movedTiles);
                    }
                }
            }
        } break;
        case "up": {
            for (let row = 2; row >= 0; row--) {
                for (let col = 0; col < 4; col++) {
                    if (board[row][col] > 0) {
                        let $tile = getTileAtPosition(row, col);
                        movedTiles = (slideTile($tile, direction) || movedTiles);
                    }
                }
            }
        } break;
        case "left": {
            for (let col = 1; col < 4; col++) {
                for (let row = 0; row < 4; row++) {
                    if (board[row][col] > 0) {
                        let $tile = getTileAtPosition(row, col);
                        movedTiles = (slideTile($tile, direction) || movedTiles);
                    }
                }
            }
        } break;
        case "right": {
            for (let col = 2; col >= 0; col--) {
                for (let row = 0; row < 4; row++) {
                    if (board[row][col] > 0) {
                        let $tile = getTileAtPosition(row, col);
                        movedTiles = (slideTile($tile, direction) || movedTiles);
                    }
                }
            }
        }
    }
    return movedTiles;
}

function getPosition($tile) {
    let thisTileClasses = $tile.attr("class");
    let row = (thisTileClasses.match(/row(\d)/))[1];
    let col = (thisTileClasses.match(/col(\d)/))[1];
    return [parseInt(row), parseInt(col)];
}

function getTileAtPosition(row, col) {
    let selector = "div.active.row" + row + ".col" + col;
    return $($(selector)[0]);
}

function removeTileAtPosition(row, col) {
    let $tile = getTileAtPosition(row, col);
    $tile.remove();
}

function updateScoreDisplay() {
    let scoreDiv = $("#score")[0];
    scoreDiv.innerHTML = "Score: " + score;
}

function slideTile($tile, direction) {
    let movedTile = false;
    let [row, col] = getPosition($tile);
    let thisTileValue = board[row][col];
    switch (direction) {
        case "right": {
            let distanceToEdge = 3 - col;
            if (distanceToEdge > 0) {
                let shift;
                let distanceToMove = 0;
                for (shift = 1; shift <= distanceToEdge; shift++) {
                    let foundTileValue = board[row][col + shift];
                    if (foundTileValue === 0) {
                        distanceToMove = shift;
                    } else if (foundTileValue === thisTileValue) {
                        distanceToMove = shift;
                        break;
                    } else break;
                }
                if (distanceToMove > 0) {
                    moveTileToPosition($tile, row, col, row, col + distanceToMove);
                    movedTile = true;
                }
            }
            return movedTile;
        }
        case "left": {
            let distanceToEdge = col;
            if (distanceToEdge > 0) {
                let shift;
                let distanceToMove = 0;
                for (shift = 1; shift <= distanceToEdge; shift++) {
                    let foundTileValue = board[row][col - shift];
                    if (foundTileValue === 0) {
                        distanceToMove = shift;
                    } else if (foundTileValue === thisTileValue) {
                        distanceToMove = shift;
                        break;
                    } else break;
                }
                if (distanceToMove > 0) {
                    moveTileToPosition($tile, row, col, row, col - distanceToMove);
                    movedTile = true;
                }
            }
            return movedTile;
        }
        case "up": {
            let distanceToTop = 3 - row;
            if (distanceToTop > 0) {
                let shift;
                let distanceToMove = 0;
                for (shift = 1; shift <= distanceToTop; shift++) {
                    let foundTileValue = board[row + shift][col];
                    if (foundTileValue === 0) {
                        distanceToMove = shift;
                    } else if (foundTileValue === thisTileValue) {
                        distanceToMove = shift;
                        break;
                    } else break;
                }
                if (distanceToMove > 0) {
                    moveTileToPosition($tile, row, col, row + distanceToMove, col);
                    movedTile = true;
                }
            }
            return movedTile;
        }
        case "down": {
            let distanceToBottom = row;
            if (distanceToBottom > 0) {
                let shift;
                let distanceToMove = 0;
                for (shift = 1; shift <= distanceToBottom; shift++) {
                    let foundTileValue = board[row - shift][col];
                    if (foundTileValue === 0) {
                        distanceToMove = shift;
                    } else if (foundTileValue === thisTileValue) {
                        distanceToMove = shift;
                        break;
                    } else break;
                }
                if (distanceToMove > 0) {
                    moveTileToPosition($tile, row, col, row - distanceToMove, col);
                    movedTile = true;
                }
            }
            return movedTile;
        }
    }
}

function moveTileToPosition($tile, currentRow, currentCol, newRow, newCol) {
    if (currentCol !== newCol || currentRow !== newRow) {
        let currentVal = board[currentRow][currentCol];
        let newVal = board[newRow][newCol];
        if (currentVal === newVal) {
            let doubleVal = currentVal * 2;
            board[newRow][newCol] = doubleVal;
            score += doubleVal;
            removeTileAtPosition(newRow, newCol);
            updateScoreDisplay();
            updateTile($tile);
        } else board[newRow][newCol] = currentVal;
        board[currentRow][currentCol] = 0;
        $tile.removeClass("row" + currentRow + " col" + currentCol);
        $tile.addClass("row" + newRow + " col" + newCol);
        updateTile($tile);
    }
}

function addRandomTiles() {
    let numTilesToAdd = getRandomInt(1,3);
    alert(numTilesToAdd);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}