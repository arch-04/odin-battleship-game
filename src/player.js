import Board from './gameBoard.js';

export default class Player{
    constructor(name){
        this.name = name;
        this.board = new Board(10);
        this.isHuman = true;
    }

    placeShip = (ship, x, y, orientation) => {
        try{
            this.board.placeShip(ship,x, y, orientation);
        }catch(error){
            throw error;
        }
    }

    randomPlaceShip = (ships) => {
        ships.forEach(ship => {
            this.board.randomPlaceShip(ship)        
        });
    }

    attackEnemy = (x, y, enemyBoard) => {
        try{
            return enemyBoard.receiveAttack(x, y)
        }catch(error){
            throw error;
        }
    }

    clearBoard() {
        this.board = new Board(10);
    }

    hasLost = () =>{
        return this.board.isSunk();
    }
}

