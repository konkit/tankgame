'use strict';

var Position = require('./Position');

class Missile {
  // have to consider angle towards x-axis
  constructor(position, angle, velocity, range) {
    this._position = this._initPosition = position;
    this._angle = angle;
    this._velocity = velocity;
    this._range = range;
    this._route = this._init_route();
  }

  _init_route() {
    let a = Math.tan(this._angle);
    let b = this._position.y - (a * this._position.x);
    return (x) => a * x + b;
  }

  destroys(position) {
    let newPosition = this._nextPosition();

    if (this._angle >= 0 && this._angle < 90) {
      if (this._position.x < newPosition.x || this._position.y < newPosition.y)
        return false;
    } else if (this._angle >= 90 && this._angle < 180) {
      if (this._position.x > newPosition.x || this._position.y < newPosition.y)
        return false;
    } else if (this._angle >= 180 && this._angle < 270) {
      if (this._position.x > newPosition.x || this._position.y > newPosition.y)
        return false;
    } else if (this._angle >= 270) {
      if (this._position.x < newPosition.x || this._position.y > newPosition.y)
        return false;
    }

    return this._route(position.x) === position.y;
  }

  _nextPosition() {
    let newX = this._position.x + this._velocity * Math.sin(this._angle * Math.PI / 180);
    let newY = this._position.y + this._velocity * Math.cos(this._angle * Math.PI / 180);
    return new Position(newX, newY);
  }

  updatePosition() {
    this._position = this._nextPosition();

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
