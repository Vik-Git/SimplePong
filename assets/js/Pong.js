/**
 * Created by Vik on 13/09/2017.
 */
var game = new Phaser.Game(1300, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var ball;
var playerPaddle;
var speed = 8;
var AIspeed = 7.5;
var velocity = 750;
var paddleGroup;
var AIPaddle;
var ballRandomStartingAngleLeft = [-120, 120];
var ballRandomStartingAngleRight= [-60, 60];
var paddleSegmentsMax= 4;
var paddleSegmentHeight= 4;
var paddleSegmentAngle= 15;

function preload() {

game.load.image("ball","assets/img/logo.png");
game.load.image("paddle","assets/img/paddle.png");
game.stage.backgroundColor = "#FFFFFF";

}

function create() {
    playerPaddle = game.add.sprite(28, 0, 'paddle');
    AIPaddle = game.add.sprite(game.width-playerPaddle.width, 350, 'paddle');
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.scale.setTo(0.3,0.3);
    playerPaddle.scale.set(0.5,0.5);
    AIPaddle.scale.set(0.5,0.5);
    AIPaddle.anchor.setTo(0.5,0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(ball);

    ball.checkWorldBounds = true;
    ball.body.collideWorldBounds = true;
    ball.body.immovable = true;
    ball.body.bounce.set(1);
    var randomAngle = game.rnd.pick(ballRandomStartingAngleRight.concat(ballRandomStartingAngleLeft));

    paddleGroup = game.add.group();
    paddleGroup.enableBody = true;
    paddleGroup.physicsBodyType = Phaser.Physics.ARCADE;

    paddleGroup.add(playerPaddle);
    paddleGroup.add(AIPaddle);

    paddleGroup.setAll('checkWorldBounds', true);
    paddleGroup.setAll('body.collideWorldBounds', true);
    paddleGroup.setAll('body.immovable', true);

    game.physics.arcade.velocityFromAngle(randomAngle, velocity, ball.body.velocity);
}

function collideWithPaddle (ball, paddle) {
    var returnAngle;
    var segmentHit = Math.floor((ball.y - paddle.y)/paddleSegmentHeight);

    if (segmentHit >= paddleSegmentsMax) {
        segmentHit = paddleSegmentsMax - 1;
    } else if (segmentHit <= -paddleSegmentsMax) {
        segmentHit = -(paddleSegmentsMax - 1);
    }

    if (paddle.x < 1300 * 0.5) {
        returnAngle = segmentHit * paddleSegmentAngle;
        game.physics.arcade.velocityFromAngle(returnAngle, velocity, ball.body.velocity);
        velocity +=50;
    } else {
        returnAngle = 180 - (segmentHit * paddleSegmentAngle);
        if (returnAngle > 180) {
            returnAngle -= 360;
        }

        game.physics.arcade.velocityFromAngle(returnAngle, velocity, ball.body.velocity);
    }
}

function update() {
    game.physics.arcade.overlap(ball, paddleGroup, collideWithPaddle, null, this);
    if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        playerPaddle.y +=speed;
    }
    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        playerPaddle.y -=speed;
    }

    if(ball.y < AIPaddle.y){
        AIPaddle.y -=AIspeed;
    }else{
        AIPaddle.y +=AIspeed;
    }
    if (ball.x < playerPaddle.x-15) {
        velocity = 750;
       ball.x = game.world.centerX;

    } else if (ball.x > AIPaddle.x-35) {
        velocity = 750;
        ball.x = game.world.centerX;

    }

}