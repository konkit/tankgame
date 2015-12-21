'use strict';

var Position = require('./Position');

class Missile {
  // have to consider angle towards x-axis
  constructor(position, angle, velocity, range) {
    this._position = this._initPosition = position;
    this._angle = angle;
    this._velocity = (typeof velocity != 'undefined' && velocity) || 300;
    this._range = (typeof range != 'undefined' && range) || 1000;
    this._route = this._init_route();
  }

  _init_route() {
    let a = Math.tan(this._angle);
    let b = this._position.y - (a * this._position.x);
    return (x) => a * x + b;
  }

  destroys(position) {
    let dx = position.x - this.position.x;
    let dy = position.y - this.position.y;
    let enemyDistance = Math.sqrt(dx*dx + dy*dy);
    return enemyDistance < 35;
  }

  _nextPosition(deltaTime) {
    let newX = this._position.x + this._velocity * Math.cos(this._angle) * deltaTime;
    let newY = this._position.y + this._velocity * Math.sin(this._angle) * deltaTime;
    return new Position(newX, newY);
  }

  updatePosition(deltaTime) {
    this._position = this._nextPosition(deltaTime);

    let xDiff = this._position.x - this._initPosition.x;
    let yDiff = this._position.y - this._initPosition.y;
    let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    return distance <= this._range;
  }

  get position() {
    return this._position;
  }
}

module.exports = Missile;
