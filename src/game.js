import ship from './gameShip.js';
import player from './player.js';
import './game.css';



const player1 = new player('player');
const player2 = new player('computer');

let gameStarted = false;
let gameOver = false;

const gameText = document.getElementById('text')


let ships = [
    new ship(5),
    new ship(4),
    new ship(3),
    new ship(3),
    new ship(2),
]

function createCell(row, column, boardData, isPlayer) {
    const cell = document.createElement('div');
    cell.classList.add('cell')
    cell.dataset.row = row;
    cell.dataset.column = column;

    if (isPlayer) {
        if (boardData.board[row][column] !== null) {
            cell.classList.add('ship')
        }
    } else {

        cell.addEventListener('click', (event) => attack(event, row, column, boardData));
    }

    return cell;
}

function createBoard(boardElement, boardData, isPlayer) {
    boardElement.innerHTML = '';
    for (let i = 0; i < boardData.boardSize; i++) {
        for (let j = 0; j < boardData.boardSize; j++) {
            boardElement.appendChild(createCell(i, j, boardData, isPlayer))
        }
    }
}

function attack(event, row, column, boardData) {
    if (!gameStarted) {
        gameText.textContent = 'Game has not started !';
        return; 
    }

    if(gameOver){
        gameText.textContent = 'Game is over';
        return;
    }

    console.log(`Attack at ${row},${column}`);
    if (event.target.classList.contains('hit') || event.target.classList.contains('miss')) {
        gameText.textContent = 'Already attacked here!';
        return
    }
    
    if (boardData.board[row][column] !== null) {
        gameText.textContent = 'Computer hited!';
        boardData.board[row][column] = 'hit';
        event.target.classList.add('hit');
    } else {
        gameText.textContent = 'Computer missed!';
        boardData.board[row][column] = 'miss';
        event.target.classList.add('miss');
    }

    updateGameStatus();
}

let isPlayerTurn = true;

function computerMove() {
    let attacked = false;
    while (!attacked) {
        const row = Math.floor(Math.random() * player1.board.boardSize);
        const column = Math.floor(Math.random() * player1.board.boardSize);
        let cell = player1.board.board[row][column];
        
        if (cell !== 'hit' && cell !== 'miss') {
            const index = row * player1.board.boardSize + column;

            const boardElement = document.getElementById('player-board').children[index];
            attack({ target: boardElement }, row, column, player1.board, false)
            attacked = true;
        }
    }
}

function updateGameStatus() {
    if (isPlayerTurn) {
        if (checkForWin(player2.board.board)) {
            gameText.textContent = 'player win!';
            gameOver = true;
        } else {
            isPlayerTurn = false;
            computerMove();
        }
    } else {
        if (checkForWin(player1.board.board)) {
            gameText.textContent = 'computer wins!';
            gameOver = true;
        } else {
            isPlayerTurn = true
        }
    }
}

function checkForWin(board) {
    let allSunk = true; 

    board.forEach(row => {
        row.forEach(cell => {
            if (cell !== null && cell !== 'hit' && cell !== 'miss') {
                allSunk = false; 
            }
        });
    });

    return allSunk;
}

document.addEventListener('DOMContentLoaded', () => {
    player1.randomPlaceShip(ships);
    player2.randomPlaceShip(ships);

    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');


    createBoard(playerBoard, player1.board, true);
    createBoard(computerBoard, player2.board, false);


    document.getElementById('random-btn').addEventListener('click', () => {
        if (!gameStarted) {
            player1.clearBoard();
            player2.clearBoard();
            
            player1.randomPlaceShip(ships);
            player2.randomPlaceShip(ships);
    
            createBoard(playerBoard, player1.board, true);
            createBoard(computerBoard, player2.board, false);
        }
    });


    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', () => {
        gameStarted = true;
        if (isPlayerTurn) {
            gameText.textContent = "It's your turn!";
        } else {
            computerMove();
        }
    });
});





