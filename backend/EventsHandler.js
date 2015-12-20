'use strict';

var util = require('util');
var WorldMap = require('./WorldMap');
var Missile = require('./Missile');
var Position = require('./Position');

class EventsHandler {
  constructor(wsServer) {
    wsServer.on('connection', this._onSocketConnection());
    this.worldMap = new WorldMap(new Position(-1000, -1000), 2000, 2000, wsServer);
    this.worldMap.runGame(this._onDestroy(wsServer), this._onMissileLost(wsServer));
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
      client.broadcast.emit('removing player', {
        id: removedPlayer.id
      });
    };
  }

  // New player has joined
  _onNewPlayer(client) {
    return (data) => {
      // Add new player to the players array
      let newPlayer = this.worldMap.addPlayer(client.id, data.name, data.x, data.y);

      if (!newPlayer) {
        util.log(`Player with id ${client.id} already exists!`);
        return;
      }

      util.log(`New player has joined the game: ${newPlayer.id}`);
      // Send existing players to the new player
      client.emit('existing players', this.worldMap.players
        .filter((player) => player.id !== newPlayer.id)
      );

      // emit obstacles
      util.log("Sending obstacles");
      client.emit('obstacles', this.worldMap.obstacles);



      // Broadcast new player to connected socket clients
      client.broadcast.emit('new player', newPlayer);
    };
  }

  // Player has moved
  _onMovePlayer(client) {
    return (data) => {
      let movedPlayer = this.worldMap.movePlayer(client.id, data.x, data.y);

      if (!movedPlayer) {
        util.log(`Player not found: ${client.id}`);
        return;
      }
      movedPlayer.angle = data.angle;
      movedPlayer.turret_angle = data.turret_angle;
      // Broadcast updated position to connected socket clients
      client.broadcast.emit('move player', movedPlayer);
    };
  }

  // Shoot performed
  _onShoot(client) {
    return (data) => {
      let missile = new Missile(data.position, data.angle, data.velocity, data.range);
      let player = this.worldMap.shoot(client.id, missile);

      if (!player) {
        util.log(`Shooting not available for player: ${client.id}`);
        return;
      }

      util.log(`Missile from ${player.id} successfully fired!`);

      missile.ownerId = player.id;
      client.broadcast.emit('missile fired', missile);
    };
  }

  _onDestroy(wsServer) {
    return (player, missile) => {
      util.log(`Player ${player.id} destroyed!`);
      wsServer.sockets.emit('player destroyed', {player: player, missile: missile});
    }
  }

  _onMissileLost(wsServer) {
    return (missile) =>
      wsServer.sockets.emit('missile lost', missile);
  }
}

module.exports = EventsHandler;
