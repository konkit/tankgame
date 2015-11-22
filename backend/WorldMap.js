'use strict';

var Player = require('./Player');
var Position = require('./Position');
var Missile = require('./Missile');

class WorldMap {
    constructor() {
        this._players = [];
    }

    get players() {
        return this._players;
    }

    addPlayer(id, x, y) {
        // Create a new player
        let player = this._playerById(id);
        if (player) return;

        player = new Player(id, new Position(x, y));
        this._players.push(player);
        return player;
    }

    removePlayer(id) {
        let player = this._playerById(id);
        if (!player) return;

        // Remove player from players array
        this._players.splice(this._players.indexOf(player), 1);
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

    shoot(id, x, y, angle) {
        let player = this._playerById(id);
        if(!player) return;

        let missile = new Missile(id, new Position(x, y), angle);
        // have to sort other players from closest to farest from shooter
        let enemies = this._players
            .filter((enemy) => player.id !== enemy.id)
            .map((enemy) => {
                let xDiff = player.position.x - enemy.position.x;
                let yDiff = player.position.y - enemy.position.y;
                let distance = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
                return [enemy, distance];
            })
            .sort((a, b) => a[1] - b[1])
            .map((tuple) => tuple[0]);

        for(let enemy of enemies) {
            if (missile.destroys(enemy.position)) {
                missile.target = enemy;
                break;
            }
        }
        return missile;
    }

    _playerById(id) {
        for (let player of this._players) {
            if (player.id === id)
                return player;
        }
    }
}

module.exports = WorldMap;
