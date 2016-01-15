'use strict';

var MapElement = require('./MapElement');
var WorldMap = require('./WorldMap');

class MapOrganizer {
    constructor(spawnAreaNumber, obstacleNumber, topLeftCornerPosition, mapXSize, mapYSize) {

        this.spawnAreaNumber = spawnAreaNumber;
        this.obstacleNumber = obstacleNumber;
        this.topLeftCornerPosition = topLeftCornerPosition;
        this.mapXSize = mapXSize;
        this.mapYSize = mapYSize;
        this.spawnAreas = [];
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
        let spawnAreaMapElements = []
        let planMapElements = []
        let polygonSide = 100;
        let spawnAreaSide = 200;
        // let spawnArea = this.createPolygon({'x': -200, 'y': -200}, polygonSide)

        let isIntersect = false
        let id = 0;

        for (let i = 0; i < this.obstacleNumber; i++) {
            //TODo Chck collison
            plan.push({
                'points': this.createPolygon({
                    'x': this.getRandomInt(this.topLeftCornerPosition.x, this.mapXSize - polygonSide),
                    'y': this.getRandomInt(this.topLeftCornerPosition.y, this.mapYSize - polygonSide),
                    color: "#fff"
                }, polygonSide)
            })
        }

        spawnAreaMapElements.push({
            'points': this.createPolygon({
                'x': this.getRandomInt(this.topLeftCornerPosition.x, this.mapXSize - polygonSide),
                'y': this.getRandomInt(this.topLeftCornerPosition.y, this.mapYSize - polygonSide),
                color: "#fff"
            }, polygonSide)
        })

        for(let i=0; i<this.spawnAreaNumber - 1;i++){

          let isSpawnPointAdded = false;

          while(!isIntersect && !isSpawnPointAdded) {
              //let allPointsCheck = false;
              let spawnArea = this.createPolygon({
                  'x': this.getRandomInt(this.topLeftCornerPosition.x, this.mapXSize - spawnAreaSide),
                  'y': this.getRandomInt(this.topLeftCornerPosition.y, this.mapYSize - spawnAreaSide)}, spawnAreaSide);

              let spawnAreaMapElement = new MapElement(id, spawnArea, true);
              for(let j = 0; j < spawnAreaMapElements.length; j++) {
                  if(spawnAreaMapElement.intersect(spawnAreaMapElements[j])) {
                      isIntersect = true;
                  }
              }

              for(let j = 0; j < plan.length; j++) {
                  if(spawnAreaMapElement.intersect(plan[j])) {
                      isIntersect = true;
                  }
              }

              if(!isIntersect) {
                  spawnAreaMapElements.push(spawnAreaMapElement);
                  isSpawnPointAdded = true;
              }
          }
      }




        return {'polygons': plan};
    }
}


module.exports = MapOrganizer;
