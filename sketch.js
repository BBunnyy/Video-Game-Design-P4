var game;
var player;
var coin;
var enemy;

//On key presses, decide action:
function keyPressed() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.walkRight = 1;
  }
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.walkLeft = 1;
  }
  if ((keyCode === UP_ARROW || keyCode === 87) && player.jump === 0) {
    player.jump = 2;
  }
}

//on key release, end actions
function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.walkRight = 0;
  } else if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.walkLeft = 0;
  }
}

function setup() {
  createCanvas(400, 400);
  game = new gameObj(); //declare game environment object
  game.initialize(); //initialize game environment
  game.gameOver = 0; //set game to be not over!

  gravity = new p5.Vector(0, 0.1); //declare global gravity
}

//drawing the game!
function draw() {
  //if the game has not begun, create the game!
  if (game.gameOver === -1) {
    game.initialize();
    game.gameOver = 0; //go to game state
  }
  //if the game has begun, draw the game elements!
  else if (game.gameOver === 0) {
    background(255);

    //check if player won!
    if (game.score == game.numCoins) {
      game.gameOver = 2;
    }

    //offset the game environment based on player movement
    push();
    translate(game.xCor, 0);

    //handle player and environment
    player.draw();
    player.move();
    game.drawBackground();

    //check player collision
    player.checkCollision();
    pop();

    //draw game score in top right
    fill(255, 0, 0);
    textStyle(BOLD);
    text(game.score, 350, 10);
  }
  //if the game is over, write the game is over!
  else if (game.gameOver == 1) {
    fill(255, 0, 0);
    textSize(40);
    text("Game Over!", 100, 215);
  }
  //if the game is won, write the game is won!
  else if (game.gameOver == 2) {
    fill(255, 0, 0);
    textSize(40);
    text("Game Won!", 100, 215);
  }
}
