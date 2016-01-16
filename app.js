#!/usr/bin/env node

'use strict';

var util = require('util');
var express = require('express');
var session = require('express-session');
var path = require('path');
var http = require('http');
var socket = require('socket.io');
var passport = require('passport');
var flash    = require('connect-flash');
var EventsHandler = require('./backend/EventsHandler');

class Application {
  static run() {
    let app = Application._initExpress();
    let wwwServer = http.Server(app);
    let wsServer = socket(wwwServer);
    new EventsHandler(wsServer);

    // Start Express.js server
    wwwServer.listen(process.env.PORT || 3000, () => util.log('listening on *:3000'));
  }

  static _initExpress() {
    let app = express();
    // Views engine config
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    // Serving static files
    app.use('/public', express.static('public'));
    // Serving index.html as default
    app.get('/', (req, res) => res.render('index'));

    app.use(session({ secret: 'ilovetankgame' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    return app;
  }
}

if (require.main === module)
  Application.run();
