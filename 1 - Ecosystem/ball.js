//  Ball constructor function +++++++++++++++++++++++++++++
function Ball(canvas,rad, clr){
    this.radius = rad;
    this.color = clr;
    this.lifeSpan = 1000;
    this.isDead = false;
    // random location
    let x = (Math.random() * (canvas.width - 2*this.radius)) + this.radius;
    let y = (Math.random() * (canvas.height - 2*this.radius)) + this.radius;
    this.loc = new JSVector(x,y);
    // random velocity
    let dx = (Math.random() * 8) -4;
    let dy = (Math.random() * 8) -4;
    this.vel = new JSVector(dx,dy);
}



  //  placing methods in the prototype (every boid shares functions)

Ball.prototype.run = function(){
    this.update();
    this.checkEdges();
    this.render();
  }




// draw the boid on the canvas
Ball.prototype.render = function(){
    let ctx = game.ctx;
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    // +++++++++++++++++++++++
    // draw as circles
    ctx.arc(this.loc.x,this.loc.y, this.radius, Math.PI*2, 0, false);
    ctx.stroke();
  }



// Add velocity to location
Ball.prototype.update = function(){
  if(!game.gamePaused) {
    let bArea = this.radius*2;
    for(let i = 0; i < game.balls.length; i++){
      if(this.loc.distance(bArea) < 30){
        this.vel.multiply(-1);
      }
    }
      this.loc.add(this.vel);

      this.lifeSpan--;
      if(this.lifeSpan === 0){
        this.isDead = true;
      }
    }
}



// When a boid hits an edge of the canvas, it changes direction.
Ball.prototype.checkEdges = function(){
    let canvas = game.canvas;

    if(this.loc.x - this.radius < 0){
        this.vel.x = -this.vel.x;
    }
    if(this.loc.x + this.radius > canvas.width){
        this.vel.x = -this.vel.x;
    }
    if(this.loc.y - this.radius < 0){
        this.vel.y = -this.vel.y;
    }
    if(this.loc.y + this.radius > canvas.height){
        this.vel.y = -this.vel.y;
    }
}
