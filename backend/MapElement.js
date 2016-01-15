'use strict';

class MapElement {
	constructor(id, polygon, isSpawnPoint) {
		//assumption polygon represents convex set
		this.id = id;
		//this.size = size;
		this.polygon = polygon.sort(function (e1, e2) {
			return Math.atan2(e1.y, e1.x) - Math.atan2(e2.y, e2.x)
		});
		this.isSpawnPoint = isSpawnPoint;
	}

	inside(p) {
		return  this.polygon[0].x < p.x && this.polygon[0].y < p.y &&
						this.polygon[1].x > p.x && this.polygon[1].y < p.y &&
						this.polygon[2].x > p.x && this.polygon[2].y > p.y &&
						this.polygon[3].x < p.x && this.polygon[3].y > p.y;
	}

	intersect(mapElement) {
		for (let i in mapElement.polygon){
			if (this.inside(i)) {
				return true;
			}
		}
		return false;
	}
}

module.exports = MapElement;
