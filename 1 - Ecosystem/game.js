let movers = [];
let snakes = [];
function Game(){
    game = this;
    let numBoids = 100;
    let numBalls = 5;
    let numSnakes = 2;
    let numRotators = 5;

    this.gamePaused = false;    // the game may be paused or not
    this.ga = new GameArea();   // create all the dom elements
    // get the canvas as a property of the game
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
    this.canvas = document.getElementById('canvas');
    // get the context
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    this.ctx = this.canvas.getContext('2d'); // This is the context
    this.createMovers(this.canvas, numRotators);
    loadSnakes(numSnakes);

    //   create the array of boid objects
    this.boids = [];
    this.balls = [];
    for(var i = 0; i < numBalls; i++){
        let rad = 15;
        let clr = "red";
        this.balls.push(new Ball(this.canvas,rad, clr)); // add new boid to array
    }

    for(let i = 0; i < numBoids; i++){
      this.boids.push(new Boid(this.canvas.width/2, this.canvas.height/2));
    }







    //  Add event handlers to all tile objects
    for(let i = 0; i < this.ga.tiles.length; i++){
        this.ga.tiles[i].addEventListener('mouseover', // mouseover is the name of an event
                                        function(){//  JavaScript has anonymous functions
                                          //  'this' is the listener target object: tile
                                          //  'this' does not refer to the game object
                                          this.style.backgroundColor = "#ac8fe3"
                                        },
                                        false);
        this.ga.tiles[i].addEventListener('mouseout', function(){
            this.style.backgroundColor = "#d5dee0"
          },false);
        this.ga.tiles[i].addEventListener('click', function(){
            game.gamePaused = !game.gamePaused;
            console.log("Mouse Clicked");
          },false);
    }
}//++++++++++++++++++++++  end game constructor


// function to run the game each animation cycle
Game.prototype.run = function(){
    for(let i = 0; i < this.boids.length; i++){
      this.boids[i].run();    // run each boid
   }
   for(let i = 0; i < this.balls.length; i++){
     this.balls[i].run();    // run each boid
  }
  for(let i = 0; i < movers.length; i++){
    movers[i].run();    // run each boid
  }
  for(let i = 0; i < snakes.length; i++){
    snakes[i].run();
  }
}


function loadSnakes(num){
  for(var i = 0; i<num; i++){
    snakes[i] = new Snake(Math.random()*canvas.width,Math.random()*canvas.height);
  }
}

Game.prototype.createMovers = function(canvas, numMovers){
  for(let i = 0; i < numMovers; i++){
    var x, y, dx, dy, radius, clr, r, g, b, numOrbs;
    radius = 7;
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    dx = Math.random() * 2 - 1;
    dy = Math.random() * 2 - 1;
    r = Math.random() * 200 + 55;
    g = Math.random() * 155;
    b = Math.random() * 155;
    clr = 'rgba('+r +' ' + g + ' ' + b + ')';
    numOrbs = Math.floor(Math.random() * 5 + 3);

    movers[i] = new Mover(x, y, dx, dy, radius, clr, numOrbs);
  }
}
