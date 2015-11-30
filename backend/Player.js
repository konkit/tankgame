'use strict';

class Player {
  constructor(id, position) {
    this._id = id;
    this._position = position;
    this._missiles = [];
  }

  shotSucceeded(missile) {
    let idx = this._missiles.indexOf(missile);
    this._missiles.splice(index, 1);
    // some points or sth may be admitted here
  }

  updateMissilesPos(missileLostCallback) {
    for (let missile of this._missiles) {
      let missileAvailable = missile.updatePosition();
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
}

module.exports = Player;
