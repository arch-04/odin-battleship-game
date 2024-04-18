
export default class Board {
    constructor(size = 10) {
        this.boardSize = size;
        this.board = this.initBoard(this.boardSize);
        this.placedShips = [];
        this.missedHits = [];
    }

    initBoard = (size) => {
        const board = new Array(size);
        for (let i = 0; i < size; i++) {
            board[i] = new Array(size).fill(null);
        }
        return board;
    }

    placeShip = (ship, x, y, orientation = 'vertical') => {
        this.canPlaceShip(ship, x, y, orientation);

        for (let i = 0; i < ship.shipSize; i++) {
            let currentX = x + (orientation === 'vertical' ? i : 0);
            let currentY = y + (orientation === 'horizontal' ? i : 0);

            this.board[currentX][currentY] = ship;
        }
        this.placedShips.push(ship);
        return true;
    }

    randomPlaceShip = (ship) => {
        let maxAttempts = 100;

        for(let attempt = 0; attempt < maxAttempts; attempt++){
            let orientation = Math.random() > 0.5 ? 'horizontal': 'vertical';
            let x, y;

            if (orientation === 'vertical') {
                x = Math.floor(Math.random() * (this.boardSize - ship.shipSize + 1))
                y = Math.floor(Math.random() * this.boardSize);
            }else {
                x = Math.floor(Math.random() * this.boardSize);
                y = Math.floor(Math.random() * (this.boardSize - ship.shipSize + 1));
            }

            if (this.canPlaceShip(ship, x, y, orientation)) {
                this.placeShip(ship, x, y, orientation);
                return true; 
            }
        }
        return false;
    }

    canPlaceShip = (ship, x, y, orientation) => {
        if (x >= this.boardSize || y >= this.boardSize) {
            // throw new Error("Starting position is out of bounds");
            return false;
        }   

        if ((orientation === 'vertical' && x + ship.shipSize > this.boardSize) ||
            (orientation === 'horizontal' && y + ship.shipSize > this.boardSize)) {
            // throw new Error("Ship goes out of bounds");
            return false;
        }

        for (let i = 0; i < ship.shipSize; i++) {
            let currentX = x + (orientation === 'vertical' ? i : 0);
            let currentY = y + (orientation === 'horizontal' ? i : 0);

            if (this.board[currentX][currentY] !== null) {
                // throw Error('Ship overlap');
                return false;
            }
        }
        return true;
    }

    receiveAttack = (x, y) => {

        if (x > this.boardSize && y > this.boardSize) {
            //throw new Error('Attack goes out of bounds');
            return false;
        }

        if (this.board[x][y] === 1) {
            //throw new Error('Already used attack')
            return false;
        }

        if (this.board[x][y] !== null) {
            this.board[x][y].hit();
            this.board[x][y] = 1;
            return true; // hit
        } else {
            this.board[x][y] = 1;
            return false;
        }
    }

    isSunk = () => {
        let result = true;
        this.placedShips.forEach((ship) => {
            if (ship.isSunk() === false) {
                result = false;
            }
        });
        return result;
    }
}

