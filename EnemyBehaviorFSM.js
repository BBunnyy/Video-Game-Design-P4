//FILE THAT CONTAINS THE STATE CLASSES FOR THE ENEMY (NPC) BEHAVIOR!!!

//Wandering Behavior: NPCs will wander around left and right, without wandering off ledges
class wanderState {
  constructor() {
    this.lastFrame = frameCount; //used to determine duration of wandering
    this.direction = 0; // -1, 0, 1 (Left, Center, Right)
    this.duration = 0; //Length of a wander action before changing direction
  }
  
  execute(i) {
    //print(i)
    //If the duration of the action has passed, calculate a new direction and duration
    if (this.lastFrame < frameCount - this.duration) {
      this.direction = floor(random(0,3))-1
      this.duration = random(1,3)*60 // Random duration from 1-3 seconds
      this.lastFrame = frameCount
    }  
    
    //Move the enemy with the last determined velocity
    game.enemy[i].move();
    
    //reset the enemy's x velocity
    game.enemy[i].velocity.x = 0
    
    //If direction is left
    if (this.direction == -1) {
      //Determine how to move based off of Platform Detection
      if (game.enemy[i].blockLeft == false) { //No edge detected
        game.enemy[i].velocitySmooth.push(0); //Slow the NPC
      }
      else {
        game.enemy[i].velocitySmooth.push(-1); //accelerate to the left
      }
      
    }
    //If direction is middle
    else if (this.direction == 0) {
      game.enemy[i].velocitySmooth.push(0); //slow the NPC
    }
    //If direction is right
    else if (this.direction == 1) {
      //Determine how to move based off of Platform Detection
      if (game.enemy[i].blockRight == false) { //No edge detected
        game.enemy[i].velocitySmooth.push(0); //Slow the NPC
      }
      else {
        game.enemy[i].velocitySmooth.push(1); //accelerate to the right
      }
    }
    
    //remove the first element from the velocity smoother, to keep length consistent
    game.enemy[i].velocitySmooth.splice(0,1)
    
    //Calculate the smoothed velocity (average of velocity smoother array)
    for (var k = 0; k < game.enemy[i].velocitySmooth.length; k++) {
      game.enemy[i].velocity.x += game.enemy[i].velocitySmooth[k]
    }
    game.enemy[i].velocity.x /= game.enemy[i].velocitySmooth.length
    
    //If the player is 120 pixels away, move to chase state
    if (dist(player.position.x, player.position.y, game.enemy[i].position.x, game.enemy[i].position.y) < 120) {
      game.enemy[i].state = 1
    }
    
  }
}


//Chasing Behavior: The NPC will chase the player if they are at the same level or above!
class chaseState {
  execute(i) {
    
    //Move the enemy!
    game.enemy[i].move()
    
    //Reset the velocity!
    game.enemy[i].velocity.x = 0

    //Check if the player is to the left or the right
    if(player.position.x < game.enemy[i].position.x) { //Player is left
      game.enemy[i].velocitySmooth.push(-2); //Accelerate the player to the left
    }
    else if(player.position.x > game.enemy[i].position.x) { //Player is right
      game.enemy[i].velocitySmooth.push(2); //Accelerate the player to the right
    }
    
    //remove first element to keep length consistent
    game.enemy[i].velocitySmooth.splice(0,1) 
    
    //Calculate the smoothed velocity (average of velocity smoother array)
    for (var k = 0; k < game.enemy[i].velocitySmooth.length; k++) {
      game.enemy[i].velocity.x += game.enemy[i].velocitySmooth[k]
    }
    game.enemy[i].velocity.x /= game.enemy[i].velocitySmooth.length
    
    //if the player is farther than 120 pixels, wander again
    if (dist(player.position.x, player.position.y, game.enemy[i].position.x, game.enemy[i].position.y) > 120) {
      game.enemy[i].state = 0
    }    
    
    //if the player is not jumping (on a platform), is above the enemy (-5 pixels, to prevent jumping from same level after jump), and the NPC isnt already jumping, jump up!
    if (player.position.y < game.enemy[i].position.y-5 && player.jump == 0 && game.enemy[i].jump == 0) {
      game.enemy[i].state = 2
    }
  }
}


//Jumping Behavior: jump!
class jumpState {
  execute(i) {
    
    //if not already jumping, jump
    if (game.enemy[i].jump == 0)
      game.enemy[i].jump = 2
    
    game.enemy[i].move()
    
    //If the player moves more than 120 pixels, wander
    if (dist(player.position.x, player.position.y, game.enemy[i].position.x, game.enemy[i].position.y) > 120) {
      game.enemy[i].state = 0
    }    
    //continue to chase after the jump
    else {
      game.enemy[i].state = 1
    }
  }
}