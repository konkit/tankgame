'use strict';

var util = require('util');
var Player = require('./Player');

class EventsHandler {
    constructor(wsServer) {
        this._players = [];
        wsServer.on('connection', this._onSocketConnection());
    }

    // New socket connection
    _onSocketConnection() {
        return (client) => {
            util.log('New player has connected: ' + client.id);

            // Listen for client disconnected

            console.log(this._onClientDisconnect);

            client.on('disconnect', this._onClientDisconnect(client));

            // Listen for new player message
            client.on('new player', this._onNewPlayer(client));

            // Listen for move player message
            client.on('move player', this._onMovePlayer(client));
        }
    };

    // Socket client has disconnected
    _onClientDisconnect(client) {
        return () => {
            util.log('Player has disconnected: ' + client.id);

            let removedPlayer = this._playerById(client.id);

            // Player not found
            if (!removedPlayer) {
                util.log('Player not found: ' + client.id);
                return;
            }

            // Remove player from players array
            this._players.splice(this._players.indexOf(removedPlayer), 1);

            // Broadcast removed player to connected socket clients
            client.broadcast.emit('removing player', { id: client.id });
        };
    };

    // New player has joined
    _onNewPlayer(client) {
        return (data) => {
            // Create a new player
            let newPlayer = new Player(client.id, data.x, data.y);

            // Broadcast new player to connected socket clients
            client.broadcast.emit('new player', newPlayer);

            // Send existing players to the new player
            for (let existingPlayer of this._players) {
                client.emit('new player', existingPlayer);
            }

            // Add new player to the players array
            this._players.push(newPlayer);
        };
    };

    // Player has moved
    _onMovePlayer(client) {
        return (data) => {
            // Find player in array
            let movePlayer = this._playerById(client.id);

            // Player not found
            if (!movePlayer) {
                util.log('Player not found: ' + client.id);
                return;
            }

            // Update player position
            movePlayer.x = data.x;
            movePlayer.y = data.y;
            data.id = client.id;

            // Broadcast updated position to connected socket clients
            client.broadcast.emit('move player', data);
        };
    };

    _playerById(id) {
        for (let player of this._players) {
            if (player.id === id)
                return player;
        }
    }
}

module.exports = EventsHandler;
