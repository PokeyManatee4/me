let balls = [];
let water;

let gravity;
function setup() {
  createCanvas(800, 600);
  water={
    "x":0, 
    "y":0.7*height, 
    "w":width, 
    "h":0.3*height
  };
gravity= createVector(0, 0.2);
}
function draw() {
  background(245);
  fill(0, 0, 255, 150);
  rectMode(CORNER);
  noStroke();
  rect(water.x, water.y, water.w, water.h);
  if (frameCount % 12 == 0) {
    let start = createVector(mouseX, mouseY);
    let vel = createVector(randomGaussian(), -(2+abs(2*randomGaussian())));
    balls.push(new Ball(start, vel));
    if (balls.length>30)balls=balls.slice(1);
  }
  for (var b in balls) {
    balls[b].applyForce(gravity.copy().mult(balls[b].mass));
    if (balls[b].inside(water)) {
      let drag=balls[b].velocity.copy().normalize().rotate(radians(180));
      balls[b].applyForce(drag);
    }
    balls[b].update();
  }
}
class Ball {
  constructor(start, velocity) {
    this.c=color(random(0, 255), random(0, 255), random(0, 255));
    this.location=start.copy();
    this.velocity=velocity.copy();
    this.acceleration=createVector(0, 0);
    this.d=random(5, 15);
    this.mass=this.d/2;
  }
  applyForce(force) {
    this.acceleration.add(force.copy().div(this.mass));
  }
  move() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  display() {
    fill(this.c);
    ellipse(this.location.x, this.location.y, this.d, this.d);
  }
  inside(l) {
    let x = this.location.x;
    let y = this.location.y;
    if (x>l.x && x<l.w+l.w && y>l.y && y<l.y+l.h)return true;
    return false;
  }
  update() {
    this.move();
    this.display();
  }
}
