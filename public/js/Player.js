/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, angle, turret_angle) {
	var x = startX,
		y = startY,
		id,
		moveAmount = 2;

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	// Define which variables and methods can be accessed
	return {
		x: this.x,
		y: this.y,
		update: update,
		draw: draw
	}
};