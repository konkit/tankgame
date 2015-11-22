'use strict';

var Position = require("./Position");

class Missile {
    //directionAngle should be between 0 and 360 where, 0 means north, 90 east, 180 south, 270 west
    constructor(initialPosition, velocity, maxRange, directionAngle, ownerId) {
        this.position = initialPosition;
        this.velocity = velocity;
        this.maxRange = maxRange;
        this.directionAngle = directionAngle;
        this.ownerId = ownerId;
	}

	updatePosition() {
		let newX = this.position.x + this.velocity*Math.sin(this.directionAngle * Math.PI / 180);
		let newY = this.position.y + this.velocity*Math.cos(this.directionAngle * Math.PI / 180);
		this.position = new Position(newX, newY);
		return this.position;
	}
}

module.exports = Missile;
