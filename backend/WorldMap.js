'use strict';

var UPDATE_INTERVAL = 100;   // miliseconds

var Player = require('./Player');
var Position = require('./Position');
var Missile = require('./Missile');
var ScoreManager = require('./ScoreManager')
var MapOrganizer = require('./MapOrganizer');

class WorldMap {
	constructor(topLeftCornerPosition, width, height, wsServer) {
		this._players = [];
		this.topLeftCornerPosition = topLeftCornerPosition;
		this.width = width;
		this.height = height;
		this.obstacles = new MapOrganizer(1, 10, width - topLeftCornerPosition.x, height - topLeftCornerPosition.y).createMap();
		this.scoreManager = new ScoreManager(wsServer);
	}

  runGame(hitCallback, missileLostCallback) {
    setInterval(() => {
      let deltaTime = UPDATE_INTERVAL / 1000;   // Fixed value for now, ideally should be measured since the last iteration

      for (let player of this._players) {
        for (let missile of player.missiles) {
          // have to sort other players from closest to farest from missile
          let enemies = this._players
            .filter((enemy) => player.id !== enemy.id)
            .map((enemy) => {
              let xDiff = missile.position.x - enemy.position.x;
              let yDiff = missile.position.y - enemy.position.y;
              let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
              return [enemy, distance];
            })
            .sort((a, b) => a[1] - b[1])
            .map((tuple) => tuple[0]);

          for (let enemy of enemies) {
            if (missile.destroys(enemy.position)) {
              console.log(`Player ${enemy.id} hit by ${player.id}`);
              player.shotSucceeded(missile);
              this.hitPlayer(enemy.id);
              this.scoreManager.updateScores(this._players)

              hitCallback(enemy, missile);
              break;
            }
          }
        }
        player.updateMissilesPos(missileLostCallback, deltaTime);
      }
    }, UPDATE_INTERVAL);
  }

  addPlayer(id, name, x, y) {
    // Create a new player
    let player = this._playerById(id);
    if (player) return;

    player = new Player(id, name, new Position(x, y));
    this._players.push(player);
    return player;
  }

  hitPlayer(id) {
    let player = this._playerById(id);
    if (!player) return;

    player.hits += 1;
    if (player.hits === 5) {
      this._players.splice(this._players.indexOf(player), 1);
    }

    return player;
  }

  movePlayer(id, x, y) {
    // Find player in array
    let player = this._playerById(id);
    if (!player) return;

    // Update player position
    player.position = new Position(x, y);
    return player;
  }

  shoot(id, missile) {
    let player = this._playerById(id);
    if (!player) return;

    player.missiles.push(missile);
    return player;
  }

  _playerById(id) {
    for (let player of this._players) {
      if (player.id === id)
        return player;
    }
  }

  get players() {
    return this._players;
  }
}

module.exports = WorldMap;
