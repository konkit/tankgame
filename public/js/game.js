/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
		ctx,			// Canvas rendering context
		keys,			// Keyboard input
		localPlayer,	// Local player
		remotePlayers,	// Remote players
		socket;			// Socket connection


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {

	// Initialise socket connection
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	socket.on("existing players", onExistingPlayers);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

	//Enemy shoot message received
	socket.on("missile fired", onEnemyShot);

	socket.on("scores update", onScoresUpdate);
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// global tank variable here ? WTF ?
	var name = prompt("Enter player name");

	// Send local player data to the game server
	socket.emit("new player", {x: tank.x, y: tank.y, name: name});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: " + data.id);

	// Initialise the new player
	var enemy = new EnemyTank(data._id, data._name || "no name", game, data._position.x, data._position.y);

	// Add new player to the remote players array
	remotePlayers.push(enemy);
};

// Existing players
function onExistingPlayers(data) {

	data.forEach(function(player){
		var enemy = new EnemyTank(player._id, player._name || "no name", game, player._position.x, player._position.y);
		remotePlayers.push(enemy);
	});

	// Add new player to the remote players array
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data._id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data._id);
		return;
	};

	// Update player position
	movePlayer.update(data._position.x, data._position.y, data.angle, data.turret_angle);
};

function onEnemyShot(data) {
	var bullet = enemyBullets.getFirstDead();
	bullet.reset(data._position.x, data._position.y);

	var end_x = Math.cos(data._angle) * data._range;
	var end_y = Math.sin(data._angle) * data._range;

	bullet.rotation = game.physics.arcade.moveToXY(bullet, data._position.x + end_x, data._position.y + end_y, data._velocity);
}

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	removePlayer.destroy();
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onScoresUpdate(data) {
    var scoreTable = '<table>';
    data.forEach(function (user) {
        scoreTable += '<tr><td>' + user.name + '</td><td>' + user.score + '</td></tr>'
    });
    scoreTable += '</table>';
    $('#highscores').html(scoreTable);
}

/**************************************************
** GAME EVENT TRIGGERS
**************************************************/
function updateTankPosition() {
	// Send local player data to the game server
	socket.emit("move player", {x: tank.x, y: tank.y, angle: tank.rotation, turret_angle: turret.rotation});
};

function performShooting() {
	socket.emit("shoot", {position: {x: tank.x, y: tank.y}, angle: turret.rotation});
};
/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};

	return false;
};
