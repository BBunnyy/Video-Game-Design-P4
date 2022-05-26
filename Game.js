class gameObj {
  constructor() {
    //Map Layout
    this.tilemap = [
      "c                                      p",
      "          e                         c  -",
      "       --------- e    e ---------  c   ",
      "                                   c    ",
      "      c                            c    ",
      "-------                          -------",
      "                                        ",
      "           c                 c          ",
      "c        ----------------------        c",
      "                   c                    ",
      "e                                      e",
      "-----------                  -----------",
      "                                        ",
      "            c      e         c          ",
      "       --------------------------       ",
      "                                        ",
      "e                   c                  e",
      "-------    c     ------     c    -------",
      "                                        ",
      "c                   c                  c",
    ];

    this.gameOver = -1;
    this.score = 0;
    this.numCoins = 0;
    this.currFrame = 0;
    this.xCor = -400; //offset to draw non player objects
    this.objects = []; //nap objects
    this.enemy = []; //enemy objects
  } // gameObj constructor

  //set the map based upon tile map
  initialize() {
    for (var i = 0; i < this.tilemap.length; i++) {
      for (var j = 0; j < this.tilemap[i].length; j++) {
        switch (this.tilemap[i][j]) {
          //platform discovered: create playform object
          case "-":
            this.objects.push(new platformObj(j * 20 + 10, i * 20 + 10, "-"));
            break;
          //if a coin/prize is found, create a coin/prize object
          case "c":
            this.objects.push(new coinObj(j * 20 + 10, i * 20 + 10, "c"));
            this.numCoins++;
            break;
          //if an enemy is found, create an enemy object
          case "e":
            this.enemy.push(new enemyObj(j * 20 + 10, i * 20 + 10, "e"));
            break;
          //if the player is found, spawn the player
          case "p":
            player = new playerObj(j * 20 + 10, i * 20 + 10);
            break;
        }
      }
    }
  }

  //Drawing the game objects and calculating npc movement:
  drawBackground() {
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].draw(); //draw non NPC elements
    }
    for (var j = 0; j < this.enemy.length; j++) {
      this.enemy[j].draw(); //draw NPC elements
    }

    //execute npc behavior, and check for collision
    for (var k = 0; k < this.enemy.length; k++) {
      //print(k)
      this.enemy[k].states[this.enemy[k].state].execute(k);
      this.enemy[k].checkCollision();
    }

    //if the player moves across the map, follow their movement
    if (player.position.x < 600 && player.position.x > 200) {
      this.xCor = 200 - player.position.x;
    }

    //if the player is on the left side, hold drawing offset
    if (player.position.x <= 200) {
      this.xCor = 0;
    }
    //if the player is on the right side, hold drawing offset
    else if (player.position.x >= 600) {
      this.xCor = -400;
    }
  }
} // gameObj
