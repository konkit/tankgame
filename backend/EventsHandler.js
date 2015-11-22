'use strict';

var util = require('util');
var WorldMap = require('./WorldMap');

class EventsHandler {
    constructor(wsServer) {
        this.worldMap = new WorldMap();
        wsServer.on('connection', this._onSocketConnection());
    }

    // New socket connection
    _onSocketConnection() {
        return (client) => {
            util.log('New player has connected: ' + client.id);

            // Listen for client disconnected
            client.on('disconnect', this._onClientDisconnect(client));

            // Listen for new player message
            client.on('new player', this._onNewPlayer(client));

            // Listen for move player message
            client.on('move player', this._onMovePlayer(client));

            // Listen for shoots
            client.on('shoot', this._onShoot(client));
        };
    }

    // Socket client has disconnected
    _onClientDisconnect(client) {
        return () => {
            let removedPlayer = this.worldMap.removePlayer(client.id);

            if (!removedPlayer) {
                util.log(`Player not found: ${client.id}`);
                return;
            }

            util.log(`Player has disconnected: ${removedPlayer.id}`);
            // Broadcast removed player to connected socket clients
            client.broadcast.emit('removing player', { id: removedPlayer.id });
        };
    }

    // New player has joined
    _onNewPlayer(client) {
        return (data) => {
            // Add new player to the players array
            let newPlayer = this.worldMap.addPlayer(client.id, data.x, data.y);

            if (!newPlayer) {
                util.log(`Player with id ${client.id} already exists!`);
                return;
            }

            util.log(`New player has joined the game: ${newPlayer.id}`);
            // Broadcast new player to connected socket clients
            client.broadcast.emit('new player', newPlayer);
            // Send existing players to the new player
            for (let existingPlayer of this.worldMap.players) {
                if(existingPlayer !== newPlayer)
                    client.emit('new player', existingPlayer);
            }
        };
    }

    // Player has moved
    _onMovePlayer(client) {
        return (data) => {
            let movedPlayer = this.worldMap.movePlayer(client.id, data.x, data.y);

            if (!movedPlayer) {
                util.log(`Player not found: ${id}`);
                return;
            }

            // Broadcast updated position to connected socket clients
            data.id = movedPlayer.id;
            client.broadcast.emit('move player', data);
        };
    }

    // Shoot performed
    _onShoot(client) {
        return (data) => {
            let missile = this.worldMap.shoot(client.id, data.x, data.y, data.angle);

            if (!missile) {
                util.log(`Shooting not available for player: ${client.id}`);
                return;
            }

            util.log(
                `Missile from ${missile.ownerId} targeted to ${missile.target ? missile.target.id : 'nobody'}`
            );
            client.broadcast.emit('missile shot', missile.forEmit());
        };
    }
}

module.exports = EventsHandler;
