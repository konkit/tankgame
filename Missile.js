Position = require("./Position").Position;

//directionAngle should be between 0 and 360 where, 0 means north, 90 east, 180 south, 270 west

class Missile {
	constructor(initialPosition, velocity, maxRange, directionAngle, ownerId) {
		this.position = initialPosition;
		this.velocity = velocity;
		this.maxRange = maxRange;
		this.directionAngle = directionAngle;
		this.ownerId = ownerId;
	}

	updatePosition() {
		var newX = this.position.x + this.velocity*Math.sin(directionAngle * Math.PI / 180);
		var newY = this.position.y + this.velocity*Math.cos(directionAngle * Math.PI / 180);
		this.position = new Position(newX, newY);
		return this.position;
	}
	
	get position() {
		return this.position;
	}

	get directionAngle() {
		return this.directionAngle;
	}

	get velocity() {
		 return this.velocity;
	}

	get maxRange() {
		return this.maxRange;
	}

	get ownerId() {
		return this.ownerId;
	}
}