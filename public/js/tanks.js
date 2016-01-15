var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-window', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('tank', '/public/images/game/tanks.png', '/public/images/game/tanks.json');
    game.load.atlas('enemy', '/public/images/game/enemy-tanks.png', '/public/images/game/tanks.json');
    game.load.image('logo', '/public/images/game/logo.png');
    game.load.image('bullet', '/public/images/game/bullet.png');
    game.load.image('earth', '/public/images/game/scorched_earth.png');
    game.load.spritesheet('kaboom', '/public/images/game/explosion.png', 64, 64, 23);

}

var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;
var isShootAvail = true;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create () {

    //  Resize our game world to be a 2000 x 2000 square

    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    tank = game.add.sprite(getRandomInt(-1000, 2000), getRandomInt(-1000, 2000), 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(100, 100);
    tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);
    game.stage.disableVisibilityChange = true;

    cursors = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };


    init();
}


function update () {

    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

    for (var i = 0; i < remotePlayers.length; i++)
    {
        if (remotePlayers[i].alive)
        {
            game.physics.arcade.overlap(tank, remotePlayers[i].tank, tankToTankCollision);
            game.physics.arcade.overlap(bullets, remotePlayers[i].tank, bulletHitEnemy, null, this);
        }
    }

    if(obstacles) {
      for(var i = 0; i < obstacles.length; i++) {
        game.physics.arcade.overlap(tank, obstacles[i], playerHitObstacle);
      }
    }

    if (cursors.left.isDown)
    {
        tank.angle -= 2;
    }
    else if (cursors.right.isDown)
    {
        tank.angle += 2;
    }

    if (cursors.up.isDown) {
        if (currentSpeed <= 25) {
            currentSpeed += 4;
        } else if (currentSpeed < 100) {
            currentSpeed += 1/currentSpeed * 100;
        } else {
            currentSpeed = 100;
        }
    }
    else
    {
        if (currentSpeed > 0)
        {
            if( currentSpeed < 4){
                currentSpeed = 0;
            } else {
                currentSpeed -= 4;
            }
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    } else {
        tank.body.velocity.x = 0;
        tank.body.velocity.y = 0;
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown && isShootAvail)
    {
        //  Boom!
        fire();
        isShootAvail = false;
        setTimeout(function(){isShootAvail=true}, 500);
    }

    updateTankPosition(tank);
}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

function playerHitObstacle() {
  tank.x = turret.x;
  tank.y = turret.y;
}

function bulletHitEnemy (tank, bullet) {

    bullet.kill();

}

function fire () {

    performShooting();

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 300, game.input.activePointer);
    }

}

function tankToTankCollision() {
    tank.x = turret.x;
    tank.y = turret.y;
    game.physics.arcade.velocityFromRotation(tank.rotation, 0, tank.body.velocity);
}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('speed: ' + currentSpeed.toFixed(3) + ' act: ' + tank.body.velocity, 32, 32);
    game.debug.text('shootAvail: ' + isShootAvail, 32, 48);
    game.debug.text('coord x:' + tank.x.toFixed(3) + ' y:' + tank.y.toFixed(3) + ' angle:' + tank.angle.toFixed(3), 32, 64);
    game.debug.text('turret angle:' + turret.angle.toFixed(3), 32, 80);
}
