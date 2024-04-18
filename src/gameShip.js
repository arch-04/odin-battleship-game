export default class Ship {
    constructor(length) {
        this.shipSize = length;
        this.shipBeenHit = 0;
        this.shipSunk = false;
    }

    hit = () => {
        this.shipBeenHit++;
        if (this.shipBeenHit === this.shipSize) {
            this.shipSunk = true;
        }

        return { shipBeenHit: this.shipBeenHit, shipSunk: this.shipSunk }
    }

    isSunk = () => {
        return this.shipSunk;
    }
}

