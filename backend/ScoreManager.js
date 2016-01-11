'use strict';

class ScoreManager {
    constructor(wsServer) {
        this.wsServer = wsServer;
    }

    updateScores(players) {
        let scores = players.map((player => { return {name: player.name, score: player.score} }));
        this.wsServer.sockets.emit('scores update', scores);
    }
}

module.exports = ScoreManager;
