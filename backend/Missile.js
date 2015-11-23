'use strict';

var Position = require('./Position');

class Missile {
    // have to consider angle towards x-axis
    constructor(position, angle) {
        this.position = position;
        this._angle = angle;
        this._route = this._init_route();
	}

    _init_route() {
        let a = Math.tan(angle);
        let b = this._position.y - (a * this._position.x);
        return (x) => a * x + b;
    }

    destroys(position) {
        if (this._angle >= 0 && this._angle < 90) {
            if (position.x < this.position.x || position.y < this.position.y)
                return false;
        } else if (this._angle >= 90 && this._angle < 180) {
            if (position.x > this.position.x || position.y < this.position.y)
                return false;
        } else if (this._angle >= 180 && this._angle < 270) {
            if (position.x > this.position.x || this.position.y > this.position.y)
                return false;
        } else if (this._angle >= 270) {
            if (position.x < this.position.x || this.position.y > this.position.y)
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
