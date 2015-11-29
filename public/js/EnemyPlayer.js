/**
 * Created by Radek Dyrda on 17.11.2015.
 */
EnemyTank = function (index, name, game, x, y) {

    this.game = game;
    this.name = name;
    this.id = index;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    var style = { font: "30px Arial", fill: "#ffffff" };
    this.label = this.game.add.text(20, 20, name, style);
    this.tank.addChild(this.label);
};

EnemyTank.prototype.update = function(x, y, angle, turret_angle) {

    this.tank.x = x;
    this.tank.y = y;
    this.tank.rotation = angle;

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = turret_angle;

};

EnemyTank.prototype.shoot = function(target) {
    var bullet = enemyBullets.getFirstDead();

    bullet.reset(this.turret.x, this.turret.y);

    if(target) {
        game.physics.arcade.moveToXY(bullet, target.position.x, target.position.y, 300);
    } else {
        var end_x = Math.cos(this.turret.rotation) * 500;
        var end_y = Math.sin(this.turret.rotation) * 500;
        bullet.rotation = game.physics.arcade.moveToXY(bullet, this.turret.x + end_x, this.turret.y + end_y, 300);
    }
};

EnemyTank.prototype.destroy = function() {
    this.tank.destroy();
    this.turret.destroy();
    this.shadow.destroy();
};
