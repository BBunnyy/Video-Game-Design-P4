//Base object class:
class objectObj {
  xtra() {
    //implement if extra variables are needed
    return 0;
  }

  constructor(x, y, o) {
    this.position = new p5.Vector(x, y);
    this.obj = o;
    this.xtra(); //expandable constructor
    this.wasAbove = true;
  }

  //draw (default is a gray box)
  draw() {
    push();
    stroke(0);
    fill(100, 100, 100);
    translate(this.position.x, this.position.y);
    rect(-10, -10, 20, 20);
    pop();
  }
}

//platform object: a more detailed block
class platformObj extends objectObj {
  draw() {
    push();
    translate(this.position.x, this.position.y);
    stroke(80);
    fill(140, 140, 160);
    rect(-10, -10, 20);

    fill(220, 220, 240);
    triangle(-10, -10, +10, -10, -10, +10);
    line(+10, +10, -10, -10);
    rect(-6, -6, 12);
    pop();
  }
}

//a spinning coin!
class coinObj extends objectObj {
  xtra() {
    this.w = 0;
    this.spinSpeed = 0.05;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    scale(cos(this.w), 1);
    fill(0, 100, 230);
    beginShape();
    vertex(-9, -9);
    vertex(9, -9);
    vertex(9, 6);
    vertex(6, 9);
    vertex(-9, 9);
    vertex(-9, -9);
    endShape();

    fill(200, 200, 230);
    circle(0, 0, 6);
    rect(5, 9, -10, -4);
    fill(0, 100, 230);
    noStroke();
    rect(0, 5, 3, 4);

    this.w += this.spinSpeed;
    pop();
  }
} // coinObj

//enemy object (NPC)
class enemyObj extends objectObj {
  xtra() {
    //construct the states, initialize to wandering
    this.state = 0;
    this.states = [new wanderState(), new chaseState(), new jumpState()];

    //give enemies velocity, acceleration, force, and jumping ability
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.force = new p5.Vector(0, 0);
    this.jump = 1;

    //used to give smooth movements
    this.velocitySmooth = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    //track the last height of the enemy
    this.lastY = this.position.y;

    //markers for platform sensors (wont walk off edges)
    this.blockRight = false;
    this.blockLeft = false;

    //force of an NPC jump
    this.jumpForce = new p5.Vector(0, -4.06);
  }

  //appearance: robot on wheels
  draw() {
    //moving left:
    if (this.velocity.x < 0) {
      push();
      fill(200);
      stroke(0);
      translate(this.position.x, this.position.y);

      // HEAD!
      rect(-4, -2, 8, -8);
      fill(255, 0, 0);
      circle(-2, -6, 4);

      fill(200);
      rect(-6, -2, 12, 6);
      noStroke();
      fill(0);
      rect(-8, 10, 16, -6);
      arc(-8, 7, 6, 6, PI / 2, (3 * PI) / 2);
      arc(8, 7, 6, 6, (3 * PI) / 2, PI / 2);
      fill(200);
      circle(-7, 7, 4);
      circle(-0, 7, 4);
      circle(7, 7, 4);
      pop();
    }
    //moving right
    else if (this.velocity.x > 0) {
      push();
      fill(200);
      stroke(0);
      translate(this.position.x, this.position.y);

      // HEAD!
      rect(-4, -2, 8, -8);
      fill(255, 0, 0);
      circle(2, -6, 4);

      fill(200);
      rect(-6, -2, 12, 6);
      noStroke();
      fill(0);
      rect(-8, 10, 16, -6);
      arc(-8, 7, 6, 6, PI / 2, (3 * PI) / 2);
      arc(8, 7, 6, 6, (3 * PI) / 2, PI / 2);
      fill(200);
      circle(-7, 7, 4);
      circle(-0, 7, 4);
      circle(7, 7, 4);
      pop();
    }
    //Non-jumping, facing middle
    else if (this.velocity.x == 0) {
      push();
      fill(200);
      stroke(0);
      translate(this.position.x, this.position.y);

      // HEAD!
      rect(-4, -2, 8, -8);
      fill(255, 0, 0);
      circle(0, -6, 4);

      fill(200);
      rect(-6, -2, 12, 10);
      //wheels
      noStroke();
      fill(0);
      rect(-10, 10, 4, -6);
      rect(10, 10, -4, -6);
      pop();
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  move() {
    //Control Jumping: (2 = launch, 1 = jumping, 0 = not jumping)
    if (this.jump === 2) {
      this.applyForce(this.jumpForce);
      this.jump = 1;
    }
    if (this.jump > 0) {
      this.applyForce(gravity); //if jumpinng, obey laws of gravity
    }

    //calculate velocity and position
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);

    //if you hit the ceiling, stop NPC
    if (this.position.y < 10) {
      this.position.y = 10;
      this.velocity.y = 0;
    }
    //if you hit the floor, stop NPC
    else if (this.position.y > 390) {
      this.position.y = 390;
      this.jump = 0;
      this.velocity.y = 0;
    }
    //if you hit the wall, stop NPC from moving further
    if (this.position.x < 10) {
      this.position.x = 10;
    }

    //if you hit the ceiling, stop NPC from moving further
    else if (this.position.x > 790) {
      this.position.x = 790;
    }
  }

  //collision checking:
  checkCollision() {
    //reset indicators for platform on left and right
    this.blockRight = false;
    this.blockLeft = false;

    //loop through all game objects
    for (var i = 0; i < game.objects.length; i++) {
      //check for collision:
      if (
        abs(this.position.x - game.objects[i].position.x) < 20 &&
        abs(this.position.y - game.objects[i].position.y) < 20
      ) {
        //if collision is with platform:
        if (game.objects[i].obj == "-") {
          //collision happens while falling, stop the NPC on the platform
          if (
            this.velocity.y > 0 &&
            this.lastY < game.objects[i].position.y - 19
          ) {
            this.position.y = game.objects[i].position.y - 20;
            this.jump = 0;
            this.velocity.y = 0;
          }
        }
      }

      //check if there is a block to stand on ahead
      if (this.velocity.x <= 0) {
        //FOR PRINTING RANGE FOR CHECKING
        // push()
        // noFill()
        // stroke(255,0,0)
        // rect(this.position.x-20, this.position.y + 20 , -20, 0)
        // pop()
        //if their is a platform > 20 and less than or equal to 40 pixels to the left, indicate so!
        if (
          game.objects[i].position.y - this.position.y == 20 &&
          this.position.x - 20 > game.objects[i].position.x &&
          this.position.x - 40 <= game.objects[i].position.x
        ) {
          this.blockLeft = true;
        }
      }
      if (this.velocity.x >= 0) {
        //FOR PRINTING RANGE FOR CHECKING
        // push()
        // noFill()
        // stroke(0,0,255)
        // rect(this.position.x+20, this.position.y + 20 , 20, 1)
        // pop()
        //if their is a platform > 20 and less than or equal to 40 pixels to the right, indicate so!
        if (
          game.objects[i].position.y - this.position.y == 20 &&
          this.position.x + 20 < game.objects[i].position.x &&
          this.position.x + 40 >= game.objects[i].position.x
        ) {
          this.blockRight = true;
        }
      }

      //check if on a block (If not, NPCs are falling)
      if (
        (abs(this.position.x - game.objects[i].position.x) < 20 &&
          game.objects[i].position.y - this.position.y == 20) ||
        this.position.y == 390
      ) {
        this.inAir = false;
      }
    }

    //if you are in the air, fall (jump = 1)
    if (this.inAir == true) {
      this.jump = 1;
    } else {
      this.inAir = true;
    }

    this.lastY = this.position.y;
  }
} // enemyObj
