function Boid(x, y){
  this.loc = new JSVector(
        Math.random()*game.canvas.width - game.canvas.width/2,
        Math.random()*game.canvas.height - game.canvas.height/2);
  let dx = Math.random() * 4 - 2;
  let dy = Math.random() * 4 - 2;
  this.vel = new JSVector(dx, dy);
  this.acc = new JSVector(0,0);
  this.maxSpeed = 3;
  this.maxForce = .035;
  this.radius = 10;
  this.isDead = false;
  this.scl = 5;
  this.clr = "rgba(0,255,0)";
  this.vel.setMagnitude(this.maxSpeed);
}


Boid.prototype.run = function(){
  this.render();
  this.update();
  this.checkEdges();
}

Boid.prototype.update = function(){
  if(!game.gamePaused){
  this.flock();
  this.acc.limit(this.maxForce);
  this.vel.add(this.acc);
  this.acc.multiply(0);
  this.vel.limit(this.maxSpeed);
  this.loc.add(this.vel);
  for(let i = 0; i < game.boids.length; i++){
    let b = game.boids[i];
    if(b.isDead === true){
      game.boids.splice(i, 1);
    }
  }
}
}

Boid.prototype.render = function(){
  let ctx = game.ctx;
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(this.loc.x, this.loc.y);
  ctx.rotate(this.vel.getDirection() + Math.PI / 2); //offset 90 degrees
  ctx.beginPath();
  ctx.strokeStyle = this.clr;
  ctx.fillStyle = this.clr;
  ctx.moveTo(0, -this.scl);
  ctx.lineTo(-this.scl, this.scl);
  ctx.lineTo(0, 0);
  ctx.lineTo(this.scl, this.scl);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

Boid.prototype.checkEdges = function(){
  if(this.loc.x > game.canvas.width){
    this.loc.x = 0;
  }
  if(this.loc.x < 0){
    this.loc.x = game.canvas.width;
  }
  if(this.loc.y > game.canvas.height){
    this.loc.y = 0;
  }
  if(this.loc.y < 0){
    this.loc.y = game.canvas.height;
  }
}

Boid.prototype.flock = function(){
  let sep = this.separate();
  let ali = this.align();
  let coh = this.cohesion();

  sep.multiply(2.0);
  ali.multiply(1.0);
  coh.multiply(1.0);

  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

//----------------------------ALIGNMENT---------------------------------

Boid.prototype.align = function(){
  let neighborDist = 100;
  var sum = new JSVector(0,0);
  let count = 0;
  for(let i = 0; i < game.boids.length; i++){
    let distance = this.loc.distance(game.boids[i].loc)
    if(distance < neighborDist){
      sum.add(game.boids[i].vel);
      count++;
    }
  }

  if(count > 1){
    sum.divide(count);
    sum.setMagnitude(this.maxSpeed);
    let aliSteer = sum.sub(this.vel);
    return this.seek(aliSteer);
  }
    return (new JSVector(0,0));
}

//----------------------------COHESION---------------------------------

Boid.prototype.cohesion = function(){
  let nextdist = 100;
  let coh = new JSVector(0,0);
  let count = 0;
  for(let i = 0; i < game.boids.length; i++){
      let d = this.loc.distance(game.boids[i].loc);
      if(d < nextdist){
        coh.add(game.boids[i].loc);
        count++;
    }
  }
  if(count > 1){
    coh.divide(count);
    return this.seek(coh);
  }
  return (new JSVector(0,0));
}

//----------------------------SEEK---------------------------------
Boid.prototype.seek = function(target){
  let desired = JSVector.subGetNew(target, this.loc);
  desired.normalize();
  desired.multiply(this.maxSpeed);
  let steer = desired.sub(this.vel);
  return steer;
}

//----------------------------SEPARATION---------------------------------

Boid.prototype.separate = function(){
  let sep = new JSVector(0,0);
  for(var i = 0; i < game.boids.length; i++){
    if(game.boids[i]!=this){
      var distance = this.loc.distance(game.boids[i].loc);
      if(distance > 0 && distance<40){
        var sepForce = JSVector.subGetNew(this.loc, game.boids[i].loc);
        sepForce.divide(distance);
        sep.add(sepForce);
      }
    }
  }
  if(sep.x != 0 && sep.y != 0){
      sep.setMagnitude(this.maxSpeed);  // desired
      sep.sub(this.vel);    // steering
  }
  return(sep);
}

//----------------------------APPLY FORCE---------------------------------
Boid.prototype.applyForce = function(vector){
  this.acc.add(vector);
}

//----------------------------IS DEAD---------------------------------

Boid.prototype.isDead = function(){
  for(i=0;i<game.boids.length;i++){
  if(game.boids[i].loc.distance(snakes[i].loc) < 20){
    game.boids[i].isDead = true;
  }
  game.boids[i].isDead = false;
}
}
