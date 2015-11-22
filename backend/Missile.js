'use strict';

var Position = require('./Position');

class Missile {
    // have to consider angle towards x-axis
    constructor(ownerId, initialPosition, angle) {
		this.ownerId = ownerId;
        this.initialPosition = initialPosition;
        this.target = undefined;

        this._route = (x) => {
            let a = Math.tan(angle);
            let b = this.initialPosition.y - (a * this.initialPosition.x);
            return a * x + b;
        }
	}

    destroys(position) {
        return this._route(position.x) === position.y;
    }

    forEmit() {
        return {
            ownerId: this.ownerId,
            initialPosition: this.initialPosition,
            target: this.target
        };
    }
}

module.exports = Missile;
