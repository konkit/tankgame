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
        // let spawnArea = this.createPolygon({'x': -200, 'y': -200}, polygonSide)

        for (let i = 0; i < this.obstacleNumber + this.spawnAreaNumber; i++) {

            let isColision = true
            while (isColision) {
              let polygon = this.createPolygon({
                  'x': this.getRandomInt(0, this.mapXSize - polygonSide),
                  'y': this.getRandomInt(0, this.mapYSize - polygonSide),
                  color: "#fff"
              }, polygonSide)

              for(let j = 0; j < plan.length; j++) {
                  if(polygon.x > plan[j].x && polygon.x < plan[x] + polygonSide
                    && polygon.y > plan[j].y && polygon.y < plan[j].y + polygonSide) {
                      isColision = true
                  }
                  else if(polygon.x > plan[j].x && polygon.x < plan[x] + polygonSide
                    && polygon.y + polygonSide > plan[j].y && polygon.y < plan[j].y) {
                      isColision = true
                  }
                  else if(polygon.x + polygonSide > plan[j].x && polygon.x < plan[j].x
                    && polygon.y > plan[j].y && polygon.y < plan[j].y + polygonSide) {
                      isColision = true
                  }
                  else if(polygon.x + polygonSide > plan[j].x && polygon.x < plan[j].x
                    && polygon.y + polygonSide > plan[j].y && polygon.y < plan[j].y) {
                      isColision = true
                  }
                  else {
                    isColision = false
                    plan.push({
                      'points': this.createPolygon({
                          'x': polygon.x,
                          'y': polygon.y,
                          color: "#fff"
                      }, polygonSide)
                    })
                  }
              }
          }
        }

        return {'polygons': plan};
    }


}


module.exports = MapOrganizer;
