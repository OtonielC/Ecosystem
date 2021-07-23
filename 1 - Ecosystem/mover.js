function Mover(x, y, dx, dy, r, c, n){
  this.loc = new JSVector(x,y);
  this.vel = new JSVector(dx,dy);
  this.acc = new JSVector(0,0);
  this.rad = r;
  this.orbitAngle = Math.random() * Math.PI;
  this.clr = c;
  this.orbiters = [];

  for(let i = 0; i < n; i++){
    let a = i * (Math.PI*2) * n + this.orbitAngle;
    let angleVel = n * 0.01;
    this.orbiters.push(new Orbiter(this, 4, 25, a, angleVel, this.clr));
  }
}
 //placing methods in the prototype
Mover.prototype.run = function(){
  this.update();
  this.checkEdges();
  this.render();

  for(let i = 0; i < this.orbiters.length; i++){
    let orb = this.orbiters[i];
    orb.update();
    orb.render();
  }
}

//draw the mover on the canvas
Mover.prototype.render = function(){
      let ctx = game.ctx;

  ctx.strokeStyle = 'rgba(255,255,255,255)';
  ctx.fillStyle = this.clr;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(this.loc.x, this.loc.y, this.rad, Math.PI * 2, 0, false);
  ctx.stroke();
  ctx.fill();
}

//move the mover
Mover.prototype.update = function(){
  if(!game.gamePaused){
  this.vel.add(this.acc);
  this.loc.add(this.vel);
}
}
Mover.prototype.checkEdges = function(){
    if(this.loc.x > canvas.width || this.loc.x < 0){
        this.vel.x = -this.vel.x;
    }
    if(this.loc.y > canvas.height || this.loc.y < 0){
        this.vel.y = -this.vel.y;
    }
}

function Orbiter(mover, orbiterRad, orbitRad, angle, angleVel, clr){
  this.mover = mover;
  this.radius = orbiterRad;
  this.rotator = new JSVector();
  this.rotator.setMagnitude(orbitRad);
  this.rotator.setDirection(angle);

  this.loc = JSVector.addGetNew(this.mover.loc, this.rotator);
  this.angleVel = angleVel;
  this.clr = clr;
}

Orbiter.prototype.update = function(){
  this.rotator.rotate(this.angleVel);
  this.loc = JSVector.addGetNew(this.mover.loc, this.rotator);
}

Orbiter.prototype.render = function(){
  let ctx = game.ctx;

  ctx.strokeStyle = 'rgba(255,255,255,255)';
  ctx.fillStyle = this.clr;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(this.loc.x, this.loc.y, this.rad, Math.PI * 2, 0, false);
  ctx.stroke();
  ctx.fill();

  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(this.mover.loc.x, this.mover.loc.y);
  ctx.lineTo(this.loc.x, this.loc.y);
  ctx.stroke();
}
