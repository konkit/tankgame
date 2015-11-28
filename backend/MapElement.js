'use strict';

class MapElement {
    constructor(id, topLeftCornerPosition, size, isSpawnPoint) {
        this.id = id;
        this.size = size;
        this.topLeftCornerPosition = topLeftCornerPosition;
        this.isSpawnPoint = isSpawnPoint;
    }
}

module.exports = MapElement;
