'use strict';

var MapElement = require('./MapElement');
var WorldMap = require('./WorldMap');

class MapOrganizer {
    constructor(spawnAreaNumber, obstacleNumber, mapXSize, mapYSize) {

        this.spawnAreaNumber = spawnAreaNumber;
        this.obstacleNumber = obstacleNumber;
        this.mapXSize = mapXSize;
        this.mapYSize = mapYSize;
        console.log(this.mapXSize);
    }

    createPolygon(p, dx) {
        let poly = [];
        poly.push({'x': p.x, 'y': p.y});
        poly.push({'x': p.x + dx, 'y': p.y});
        poly.push({'x': p.x + dx, 'y': p.y + dx});
        poly.push({'x': p.x, 'y': p.y + dx});
        return poly;

    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createMap() {
        let plan = [];
        let polygonSide = 400;
        let spawnArea = this.createPolygon({'x': -200, 'y': -200}, polygonSide)

        for (let i = 0; i < this.obstacleNumber; i++) {
            //TODo Chck collison
            plan.push({
                'points': this.createPolygon({
                    'x': this.getRandomInt(0, this.mapXSize - polygonSide),
                    'y': this.getRandomInt(0, this.mapYSize - polygonSide),
                    color: "#fff"
                }, polygonSide)
            })
        }


        return {'polygons': plan};
    }
}


module.exports = MapOrganizer;