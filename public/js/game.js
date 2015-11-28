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

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: tank.x, y: tank.y});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var enemy = new EnemyTank(data.id, data.id, game, data.x, data.y);

	// Add new player to the remote players array
	remotePlayers.push(enemy);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.update(data.x, data.y, data.angle, data.turret_angle);
};

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


/**************************************************
** UPDATE TANK POS
**************************************************/
function updateTankPosition(tank) {
	// Send local player data to the game server
	socket.emit("move player", {x: tank.x, y: tank.y, angle: tank.rotation, turret_angle: turret.rotation});
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
