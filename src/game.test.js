const Ship = require('./gameShip');
const Board = require('./gameBoard');
const Player = require('./player');

describe('ship functionality', () => {
    const ship = new Ship(3);

    test('hit method increments hits', () => {
        expect(ship.hit()).toMatchObject({ "shipBeenHit": 1 })
    })

    test('ship is not sunk after one hit', () => {
        expect(ship.isSunk()).toBe(false)
    });

    test('add 2 hit', () => {
        ship.hit();
        ship.hit();
    });

    test('ship is sunk after three hits', () => expect(ship.isSunk()).toBe(true));

});


describe('Board functionality', () => {
    const board1 = new Board(10);
    const ship1  = new Ship(3);

    test('board is 10x10', () => {
        expect(board1.board).toHaveLength(10);
        
        board1.board.forEach(row => {
            expect(row).toHaveLength(10);
        });
    })

    test('starting position goes out of bounds', () => {

        expect(() => {
            board1.placeShip(ship1, 12, 1,'vertical')
        }).toThrow('Starting position is out of bounds')

    })

    test('ship goes out of bounds', () => {
        const board1 = new Board()
        const ship2 = new Ship(11);

        expect(() => {
            board1.placeShip(ship2, 2, 1)
        }).toThrow('Ship goes out of bounds')
    })

    test('place ship verticaly', () =>{
        const board1 = new Board();
        const ship1 = new Ship(3);

        board1.placeShip(ship1, 4, 2, 'vertical')

        expect(board1.board[4][2]).toMatchObject({shipSize: 3});
        expect(board1.board[5][2]).toMatchObject({shipSize: 3});
        expect(board1.board[6][2]).toMatchObject({shipSize: 3});
    })

    test('place ship horizontaly', () => {
        const board1 = new Board();
        const ship1 = new Ship(3);

        board1.placeShip(ship1, 4, 2, 'horizontal')
        
        expect(board1.board[4][2]).toMatchObject({shipSize: 3});
        expect(board1.board[4][3]).toMatchObject({shipSize: 3});
        expect(board1.board[4][4]).toMatchObject({shipSize: 3});
    })

    test('ship overlap',() => {
        const ship1 = new Ship(3);
        const board1 = new Board(10);
        board1.placeShip(ship1, 4, 2); 
        
        expect(() => {
            board1.placeShip(ship1, 4, 2); 
        }).toThrow("Ship overlap");
    })


    test('ship been hit', () => {
        const ship1 = new Ship(3);
        const board1 = new Board(10);
        board1.placeShip(ship1, 4, 2);

        expect(board1.receiveAttack(4, 2)).toBe(true);
        expect(ship1.shipBeenHit).toBe(1);
        expect(ship1.isSunk()).toBe(false);
    });

    test('already attacked place', () => {
        const ship1 = new Ship(3);
        const board1 = new Board(10);
    
        board1.placeShip(ship1, 4, 2); 
        board1.receiveAttack(4, 2);

        expect(()=>{
            board1.receiveAttack(4,2)
        }).toThrow('Already used attack')
        
        expect(ship1.shipBeenHit).toBe(1);
        expect(ship1.isSunk()).toBe(false);
    });

    test('wrong bounds for reciveAttack', () => {
        const ship1 = new Ship(3);
        const board1 = new Board(10);

        expect(() =>{
            board1.receiveAttack(12, 12412)
        }).toThrow('Attack goes out of bounds')
    });

    test('ship been sunk', () => {
        const ship1 = new Ship(3);
        const board1 = new Board(10);
    
        board1.placeShip(ship1, 4, 2);
        
        board1.receiveAttack(4, 2)
        board1.receiveAttack(5, 2)
        board1.receiveAttack(6, 2)

        expect(ship1.isSunk()).toBe(true); 
    })

    test('helper function canPlaceShip works', () => {
        const board = new Board(10);
        const ship = new Ship(3);
        
        expect(board.canPlaceShip(ship, 1, 1, 'vertical')).toBe(true)
    })

    test('place ship randomly', () => {
        const board = new Board(10);
        const ship = new Ship(3);
        
        expect(board.randomPlaceShip(ship)).toBe(true)
    })

});

describe('Player ship placement', () => {
    
    test('place a ship at valid location', () => {
        const player = new Player("testPlayer");
        const ship = new Ship(3);
        expect(() => player.placeShip(ship, 0, 0, 'horizontal')).not.toThrow();
    })

    test('randomly place ship at valid location', () => {
        const player = new Player("testPlayer");
        const ships = [
            new Ship(2),
            new Ship(3)
        ]

        player.randomPlaceShip(ships);

        let placedSuccessfully = ships.every(ship => {
            return player.board.placedShips.includes(ship);
        });

        expect(placedSuccessfully).toBe(true);
    })
});

describe('Player Attacks', () => {
    let player1, player2, ship;
  
    beforeEach(() => {
      player1 = new Player("Alice");
      player2 = new Player("Bob");
      ship = new Ship(3);
      player2.placeShip(ship, 5, 5, 'vertical');
    });
  
    test('record a hit when attacking a ship', () => {
      expect(player1.attackEnemy(5, 5, player2.board)).toBe(true);
    });
  
    test('record a miss when attacking empty water', () => {
      expect(player1.attackEnemy(0, 0, player2.board)).toBe(false);
    });
  
    test('throw an error for attacking out of bounds', () => {
      expect(() => player1.attackEnemy(11, 11, player2.board)).toThrow('Attack goes out of bounds');
    });
});

describe('Game Status', () => {
    test('determine that the player has lost when all ships are sunk', () => {
      const player = new Player("TestPlayer");
      const ship = new Ship(1); 
      player.placeShip(ship, 0, 0, 'horizontal');
      player.board.receiveAttack(0, 0); 
      expect(player.hasLost()).toBe(true);
    });

    test('determine that the player has not lost if there are ships afloat', () => {
        const player = new Player("TestPlayer");
        const ship = new Ship(2);
        player.placeShip(ship, 0, 0, 'horizontal');
        player.board.receiveAttack(0, 0); 
        expect(player.hasLost()).toBe(false);
    });
    
});  
 

  