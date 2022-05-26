//Player object class!
class playerObj {
  constructor(x, y) {
    
    //Physics variables!
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.force = new p5.Vector(0, 0);
    this.currFrame = frameCount;
    this.jump = 1;
    this.jumpForce = new p5.Vector(0,-4.06);
    //direction to move the player
    this.walkLeft = 0;
    this.walkRight = 0;
    
    //is the player in the air?
    this.inAir = false;
    
    this.lastY = this.position.y
    
    this.randImg = 0
    this.Images = [
      loadImage("PlayerImages/Player1.png"),
      loadImage("PlayerImages/Player2.png"),
      loadImage("PlayerImages/Player3.png"),
      loadImage("PlayerImages/Player4.png"),
      loadImage("PlayerImages/Player5.png")
    ]
  }
  
  //adding acceleration with forces
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  //drawing the player:
  draw() {
    push()
    translate(this.position.x,this.position.y)
    noFill()
    strokeWeight(3)
    stroke(200,0,255)
    circle(0,0,20)
    if (frameCount%10 == 0)
      this.randImg = floor(random(0,5))
    image(this.Images[this.randImg], -10, -10, 20, 20);
    
    pop()
  }
  
  //how to move the player:
  move() {
    //reset velocity to stop sliding
    this.velocity.x = 0;
    
    //if "Left arrow" or "A", move left
    if (this.walkLeft === 1) {
      this.velocity.x -= 4; //speed of 4 pixels per frame
    }
    //if "Right arrow" or "D", move Right
    if (this.walkRight === 1) {
      this.velocity.x += 4; //speed of 4 pixels per frame
    }
    
    //if jumping was indicated ("Up arrow")
    if (this.jump === 2) {
        this.applyForce(this.jumpForce); //jump
        this.jump = 1; //set to falling stage of jumping
    }
    if (this.jump > 0) { //if not grounded, apply gravity
        this.applyForce(gravity);
    }
    
    //calculate velocity and position
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
    
    //PREVENT PLAYER FROM GOING OUT OF GAME BOUNDS 400x800 canvas
    if (this.position.y < 10) {
      this.position.y = 10;
      this.velocity.y = 0;
    }
    else if (this.position.y > 390) {
      this.position.y = 390;
      this.jump = 0;
      this.velocity.y = 0;
    }
    if (this.position.x < 10) {
        this.position.x = 10;
    }
    else if (this.position.x > 790) {
        this.position.x = 790;
    }
  }

  //checking for collision:
  checkCollision() {
    //iterate through non NPC elements:
    for (var i=0; i<game.objects.length; i++) {
      //if the object is a platform, and they collide:
      if (game.objects[i].obj == '-' && abs(this.position.x - game.objects[i].position.x) < 20 && abs(this.position.y - game.objects[i].position.y) < 20 ) {
        //if you are falling and were above the platform last frame, land on the platform
              if (this.velocity.y > 0 && this.lastY < game.objects[i].position.y - 19) {
                this.position.y = game.objects[i].position.y-20;
                this.jump = 0
                this.velocity.y = 0
                game.objects[i].wasAbove = false
              }
      
      }
      
      //if the object is a coin and you collide, "Collect" the coin, remove it from the game
      if (game.objects[i].obj == 'c' && abs(this.position.x - game.objects[i].position.x) <= 20 && abs(this.position.y - game.objects[i].position.y) <= 20 ) {
          game.objects.splice(i,1);
          game.score++
          i--
      }
      
      //check if on a block (If not, you are falling)
      if (i >= 0 && (abs(this.position.x - game.objects[i].position.x) < 20 && game.objects[i].position.y - this.position.y == 20) || (this.position.y == 390)) {
        this.inAir = false;
      }
    }
    
    //check collision with enemies
    for (var j=0; j<game.enemy.length; j++) {
      if (abs(this.position.x - game.enemy[j].position.x) < 19 && abs(this.position.y - game.enemy[j].position.y) < 19 ) {
        if (game.enemy[j].obj == 'e') {
          //if you land on the enemy's head, kill it!
          if (this.lastY < game.enemy[j].position.y - 19 && this.jump != 0) {
            game.enemy.splice(j,1);
            j--;
            this.velocity.y = 0;
            this.jump = 2; //jump the player
            this.inAir = false;
          }
          //if you dont land on the enemy's head, you lose!
          else {
            game.gameOver = 1;
          }
        }
      }
      
    }

    //if in the air, make the player fall,
    if (this.inAir == true) {
      this.jump = 1
    }
    else {
      this.inAir = true;
    }
    
    this.lastY = this.position.y
  }
  
}  // playerObj