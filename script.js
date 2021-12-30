var origBoard;
const huPlayer = 'O'
const aiPlayer = 'X'

const winCombos = [
    // Horizontals
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertivals
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');

function startGame() {
    showDialog(false)
    origBoard = Array.from(Array(9).keys())
    cells.forEach(element => {
        element.innerText = ''
        element.style.removeProperty('background-color')
        element.addEventListener('click', turnClick, false)
    });
}

startGame()

function turnClick(event) {
    if (typeof origBoard[event.target.id] === 'number') {
        let isGameOver = turn(event.target.id, huPlayer)
        if (!isGameOver && !checkTie())
            turn(bestSpot(), aiPlayer)
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWon(origBoard, player)
    if (gameWon) {
        gameOver(gameWon)
    }
    return gameWon;
}

function showDialog(visiblity, text) {
    const dialog = document.querySelector('.endgame')
    if (visiblity) {
        dialog.show();
        dialog.style.display = 'flex'
        document.querySelector('.endgame .text').innerText = text;
    } else {
        dialog.close();
        dialog.style.display = 'none'
    }
}

function checkWon(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { "index": index, player }
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.background = gameWon.player == huPlayer ? 'blue' : 'red';
    }

    cells.forEach(element => {
        element.removeEventListener('click', turnClick, false)
    });

    declareWinner(gameWon.player == huPlayer ? "You Won!!!" : "You lost.")

}

function declareWinner(who) {
    showDialog(true, who)
}

function getEmptySquares(newBoard) {
    if (newBoard)
        return newBoard.filter(s => (typeof s == 'number'));
    return origBoard.filter(s => (typeof s == 'number'));
}

function bestSpot() {
    return minmax(origBoard, aiPlayer).index;
    // return getEmptySquares()[0]
}

function checkTie() {
    if (getEmptySquares().length == 0) {
        cells.forEach(elem => {
            elem.style.backgroundColor = "green";
            elem.removeEventListener('click', turnClick, false)
        });
        declareWinner("Tie Game.")
        return true;
    }
    return false;
}

function minmax(newBoard, player) {
    var availableSpots = getEmptySquares(newBoard);
    if (checkWon(newBoard, player)) {
        return { score: -10 }
    } else if (checkWon(newBoard, aiPlayer)) {
        return { score: 10 }
    } else if (availableSpots.length === 0) {
        return { score: 0 }
    }
    var moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if (player == aiPlayer) {
            let result = minmax(newBoard, huPlayer)
            move.score = result.score;
        } else {
            let result = minmax(newBoard, aiPlayer)
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;
        moves.push(move)
    }

    var bestMove;
    for (let i = 0; i < moves.length; i++) {
        if (player == aiPlayer) {
            let bestScore = -10000
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }

        } else {
            let bestScore = 10000
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }

        }
    }
    return moves[bestMove];
}
