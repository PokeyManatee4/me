let beachballs = [];
let pl, gravity;

function setup() {
  createCanvas(800, 600, WEBGL);
  pl = new ocean(width/2, height/2-100, -100, 500, 200, 500);
  gravity = createVector(0, 0.1, 0);
  noStroke();
}
function draw() {
  background(255);
  camera(100, -400.0+mouseY, 420.0, pl.x, pl.y, pl.z, 0.0, 1.0, 0.0);
  lights();
  fill(0);
  pl.update();
  if (mouseIsPressed&&beachballs.length<15&&frameCount%30==0) {
    beachballs.push(new beachBall(createVector(pl.x+mouseX-250, pl.y-pl.h, pl.z+mouseY-250)));
  }
  if (beachballs[0])console.log(beachballs[0].location);
  for (var b=0; b<beachballs.length; b++) {
    if (beachballs.length>1)beachballs[b].scan();
    if (beachballs[b].watercollision(pl)) {
      beachballs[b].applyForce(beachballs[b].velocity.copy().normalize().rotate(radians(180)));
    } else {
      beachballs[b].applyForce(gravity.copy().mult(beachballs[b].mass/5));
    }
    beachballs[b].update();
  }
}
class beachBall {
  constructor(start) {
    this.cl=color(random(0, 255), random(0, 255), random(0, 255));
    this.location=start.copy();
    this.velocity=createVector(0, 0, 0);
    this.acceleration=createVector(0, 0, 0);
    this.density=random(10, 15);
    this.mass=this.density/2;
    this.radius=20;
  }
  update() {
    push();
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    fill(this.cl);
    translate(this.location);
    sphere(2*this.radius);
    pop();
  }
  watercollision(p) {
    let x = this.location.x;
    let y = this.location.y;
    let z = this.location.z;
    if (x>p.x-(p.l/2)&&x<p.x+(p.l/2)&&y>p.y-(p.w/2)&&y<p.y+(p.w/2)&&z>p.z-(p.h/2)&&z<p.z+(p.h/2))return true;
    return false;
  }
  scan() {
    for (var b in beachballs) {
      let distVect = p5.Vector.sub(beachballs[b].location, this.location);
      if (distVect.mag() < 2*this.radius) {
        let offset = distVect.copy().normalize().mult((2*this.radius-distVect.mag())/2.0);
        beachballs[b].location.add(offset);
        this.location.sub(offset);
        let sinHead = sin(distVect.heading());
        let cosHead = cos(distVect.heading());
        let ov=beachballs[b].velocity;
        let PosTempOther=createVector(cosHead * distVect.x + sinHead * distVect.y, cosHead * distVect.y - sinHead * distVect.x);
        let VelTempThis = createVector(cosHead * this.velocity.x + sinHead * this.velocity.y, cosHead * this.velocity.y - sinHead * this.velocity.x); 
        let VelTempOther = createVector(cosHead * ov.x + sinHead * ov.y, cosHead * ov.y - sinHead * ov.x);
        let VecFinThis = createVector(((this.mass - beachballs[b].mass) * VelTempThis.x + 2 * beachballs[b].mass * VelTempOther.x) / (this.mass + beachballs[b].mass), VelTempThis.y);
        let VecFinOther = createVector(((beachballs[b].mass - this.mass) * VelTempOther.x + 2 * this.mass * VelTempThis.x) / (this.mass + beachballs[b].mass), VelTempOther.y);
        let posFinOther=createVector(cosHead * PosTempOther.x+VecFinOther.x - sinHead * PosTempOther.y, cosHead * PosTempOther.y + sinHead * PosTempOther.x+VecFinOther.x);
        beachballs[b].location.add(posFinOther.x, posFinOther.y);
        this.location.add(cosHead * -1 * sinHead, cosHead * sinHead * VecFinThis.x);
        this.velocity.set(cosHead * VecFinThis.x - sinHead * VecFinThis.y, cosHead * VecFinThis.y + sinHead * VecFinThis.x);
        ov.set(cosHead * VecFinOther.x - sinHead * VecFinOther.y, cosHead * VecFinOther.y + sinHead * VecFinOther.x);
      }
    }
  }
  applyForce(force) {
    this.acceleration.add(force.copy().div(this.mass));
  }
}
class ocean {
  constructor(x, y, z, l, w, h) {
    this.x=x;
    this.y=y;
    this.z=z;
    this.l=l;
    this.w=w;
    this.h=h;
  }
  update() {
    push();
    noFill();
    stroke(0);
    translate(this.x, this.y, this.z);
    box(this.l, this.w, this.h);
    noStroke();
    pop();
    push();
    translate(this.x, this.y);
    stroke(255, 0, 0);
    line(-this.x, 0, this.x, 0);
    stroke(0, 255, 0);
    line(0, this.y, 0, -this.y);
    stroke(0, 0, 255);
    line(0, 0, this.z, 0, 0, -this.z);
    pop();
    push();
    if ((this.x+mouseX)>this.x&&(this.x+mouseX)<this.x+500&&(this.z+mouseY)>this.z&&(this.z+mouseY)<this.z+500)fill(0, 255, 0);
    else fill(255, 0, 0);
    translate(this.x+mouseX-250, this.y-this.h, this.z+mouseY-250);
    box(40);
    noFill();
    stroke(0);
    box(40, this.y, 40);
    pop();
    stroke(0, 0, 255);
    line(this.x+mouseX-250, this.y-this.h, this.z+mouseY-250, this.x, this.y-this.h, this.z);
    stroke(0, 255, 0);
    line(this.x+mouseX-250, this.y-this.h, this.z+mouseY-250, this.x, this.y, this.z);
    noStroke();
  }
}
