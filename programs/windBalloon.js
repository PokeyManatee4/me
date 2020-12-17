let balloons=[];
let gravity, lift, wind;  
function setup() {
  createCanvas(800, 600);
  gravity = createVector(0, 0.2);
  lift = createVector(0, -0.21);
  for (let i=0; i<100; i++)balloons.push(new balloon(createVector(random(0, width), random(0, height))));
}
function draw() {
  wind=createVector(0, -1).rotate(map(noise(second()/4), 0, 1, 0, 4*PI));
  background(245);
  for (var b in balloons) {
    balloons[b].applyForce(gravity);
    balloons[b].applyForce(lift);
    balloons[b].applyForce(wind);
    balloons[b].update();
  }
}
class balloon {
  constructor(start) {
    this.diameter=random(20, 30);
    this.mass=this.diameter/10;
    this.location=start.copy();
    this.velocity=createVector(0, 0);
    this.acceleration=createVector(0, 0);
  }
  applyForce(f) {
    this.acceleration.add(f.copy().div(this.mass));
  }
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(3);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    fill(255, 0, 0);
    noStroke();
    ellipse(this.location.x, this.location.y, this.diameter, this.diameter);
    triangle(this.location.x, this.location.y, this.location.x+5, this.location.y+5+(this.diameter/2), this.location.x-5, this.location.y+5+(this.diameter/2));
    stroke(0);
    line(this.location.x, this.location.y+2+(this.diameter/2), this.location.x+wind.x*10, this.location.y+this.diameter*2);
    if (this.location.x<0)this.location.x=width;
    if (this.location.x>width)this.location.x=0;
    if (this.location.y<=0) {
      this.velocity.x = 0.1*this.velocity.x;
      this.velocity.y = -0.5*this.velocity.y;
    }
    if (this.location.y > height) {
      this.location.y=height;
      this.velocity.y=-0.5*this.velocity.y;
    }
  }
}
