'use strict';

var Position = require('./Position');

class Missile {
    // have to consider angle towards x-axis
    constructor(position, angle, velocity) {
        this.position = position;
        this._angle = angle;
		this._velocity = velocity;
        this._route = this._init_route();
	}

    _init_route() {
        let a = Math.tan(angle);
        let b = this._position.y - (a * this._position.x);
        return (x) => a * x + b;
    }

    getNextPosition() {
        let newX = this.position.x + _velocity*Math.sin(Math.PI * 2 * angle);
        let newY = this.position.y + _velocity*Math.cos(Math.PI * 2 * angle);
        return new Position(newX, newY);
    }

    destroys(position) {
        let newPosition = getNextPosition();
        if (this._angle >= 0 && this._angle < 90) {
            if (position.x < newPosition.x || position.y < newPosition.y)
                return false;
        } else if (this._angle >= 90 && this._angle < 180) {
            if (position.x > newPosition.x || position.y < newPosition.y)
                return false;
        } else if (this._angle >= 180 && this._angle < 270) {
            if (position.x > newPosition.x || this.position.y > newPosition.y)
                return false;
        } else if (this._angle >= 270) {
            if (position.x < newPosition.x || this.position.y > newPosition.y)
                return false;
        }

        return this._route(position.x) === position.y;
    }

    forEmit() {
        return {
            ownerId: this.ownerId,
            initialPosition: this.initialPosition,
            targetPosition: this.targetPosition
        };
    }
}

module.exports = Missile;
