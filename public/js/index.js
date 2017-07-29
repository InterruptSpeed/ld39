WarpGroup = function (game) {
    Phaser.Group.call(this, game, null);

    this.threads = [];
    for(var i= 0; i<9; i++){
                this.threads[i] = this.create(i*30, 0, 'thread');
    }
};

WarpGroup.prototype = Object.create(Phaser.Group.prototype);

WarpGroup.prototype.constructor = WarpGroup;

// Extension Method to Phaser.Group which tints all the items it contains
Phaser.Group.prototype.tint = function(colour){
    this.forEach(function(item) {
        item.tint = colour;
    }, this);
}

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('ground', '/assets/ground.png');
    this.game.load.image('player', '/assets/nes.png');
        this.game.load.image('canoe', '/assets/boulder.png');
    this.game.load.image('person1', '/assets/depth.png');
    this.game.load.image('person2', '/assets/depth.png');
    this.game.load.image('boulder', '/assets/boulder.png');
    this.game.load.image('depth', '/assets/depth.png');
};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background to something sky colored
    this.game.stage.backgroundColor = 0x4488cc;

    // Define movement constants
    this.MAX_SPEED = 500; // pixels/second

    // Create a player sprite
    this.player = this.game.add.sprite(this.game.width/2, this.game.height - 64, 'player');

    // Enable physics on the player
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    // Make player collide with world boundaries so he doesn't leave the stage
    this.player.body.collideWorldBounds = true;
this.player.body.gravity.y = 100 + Math.random() * 100;
    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }

    
    //this.boulder = this.game.add.sprite(this.game.width/2, this.game.height - 64, 'boulder');
    //this.depth =  this.game.add.sprite(0, 0, 'depth'); 
    //this.depth.anchor.setTo(0.5, 0.5);
    //this.boulder.addChild(this.depth);
    //this.game.physics.enable(this.boulder, Phaser.Physics.ARCADE);
    //this.boulder.anchor.setTo(0.5, 0.5);
    //this.boulder.scale.setTo(2, 2);
    //this.boulder.body.allowGravity = false;
    //this.boulder.body.collideWorldBounds=true;
    //this.boulder.body.gravity.y = 100 + Math.random() * 100;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.ball = this.game.add.group();
    this.ball.enableBody = true;

    this.boulder = this.ball.create(this.game.width/2, this.game.height - 64, 'boulder');
    this.depth = this.ball.create(this.game.width/2, this.game.height - 64, 'depth');

    this.boulder.anchor.setTo(0.5, 0.5);
    this.boulder.scale.setTo(2, 2);
    this.depth.anchor.setTo(0.5, 0.5);
    this.depth.scale.setTo(2, 2);

    

    this.game.input.onDown.add(this.changeTint, this);
};

GameState.prototype.changeTint = function() {
    this.ball.tint( Math.random() * 0xffffff);

    this.ground.tint( Math.random() * 0xffffff);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.ground);

    if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.velocity.x = -this.MAX_SPEED;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.velocity.x = this.MAX_SPEED;
    } else {
        // Stop the player from moving horizontally
        this.player.body.velocity.x = 0;
    }


    //game.physics.arcade.collide(this.player, this.ball);
/*
    if (!Phaser.Point.equals(this.boulder.body.velocity,new Phaser.Point(0,0) ) ){
        this.boulder.angle += 1;
        this.depth = 0;
    }
*/

if (this.game.input.mousePointer.isDown)
    {
        //  First is the callback
        //  Second is the context in which the callback runs, in this case game.physics.arcade
        //  Third is the parameter the callback expects - it is always sent the Group child as the first parameter
        this.ball.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 400);
    }
    else
    {
        this.ball.setAll('body.velocity.x', 0);
        this.ball.setAll('body.velocity.y', 0);
    }

    if (this.boulder.body.velocity.x > 0) {
        this.boulder.angle += 10;
    } else if (this.boulder.body.velocity.x < 0) {
this.boulder.angle -= 10;
    }

    game.physics.arcade.collide(this.ball, this.ground);
};

GameState.prototype.render = function() {
    //game.debug.body(this.boulder);
    //game.debug.body(this.depth);
    //game.debug.body(this.ball);
    game.debug.spriteInfo(this.boulder, 32, 32);
    game.debug.text('velocity: ' + this.boulder.body.velocity, 32, 200);
    game.debug.text('angularVelocity: ' + this.boulder.body.angularVelocity, 32, 232);
    game.debug.text('angularAcceleration: ' + this.boulder.body.angularAcceleration, 32, 264);
     game.debug.text('angularDrag: ' + this.boulder.body.angularDrag, 32, 296);
     game.debug.text('deltaZ: ' + this.boulder.body.deltaZ(), 32, 328);
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);

    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);