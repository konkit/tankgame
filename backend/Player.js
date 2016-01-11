'use strict';

class Player {
  constructor(id, name, position) {
    this._id = id;
    this._name = name;
    this._position = position;
    this._missiles = [];
    this._score = 0;
    this._hits = 0;
  }

  shotSucceeded(missile) {
    let index = this._missiles.indexOf(missile);
    this._missiles.splice(index, 1);
    this._score++;
  }

  updateMissilesPos(missileLostCallback, deltaTime) {
    for (let missile of this._missiles) {
      let missileAvailable = missile.updatePosition(deltaTime);
      if (!missileAvailable) {
        let idx = this._missiles.indexOf(missile);
        this._missiles.splice(idx, 1);
        missileLostCallback(missile);
      }
    }
  }

  get id() {
    return this._id;
  }

  get position() {
    return this._position;
  }

  set position(newPos) {
    this._position = newPos;
  }

  get missiles() {
    return this._missiles;
  }

  get score() {
    return this._score;
  }

  get name() {
    return this._name;
  }

  get hits() {
    return this._hits;
  }
}

module.exports = Player;
