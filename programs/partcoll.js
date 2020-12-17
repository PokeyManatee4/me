let drops = [];
let setPiece, mouse;
function setup() {
  mouse=createVector(0, 0);
  setPiece = new crater();
  createCanvas(800, 600);
}


function draw() {
  background(245);
  fill(0);
  text("This is a simulation meant to copy the properties of fluids in the real world.\n Oil, having high viscosity won't stick around too long, slipping over the edge.\n Sludge, however is too slow, and will more often than not seep into the earth below.\n Water is the middleground between the two fluids.\n If any of the three fluids is left to stagnate, it will seep into the earth and rejoin the aquifer below.\n Feel free to grab any of the handles on the mountain and watch as the particles react to the changes", width/20, height/20);
  mouse.set(mouseX, mouseY);
  setPiece.update();
  if (!setPiece.colliding(mouse.x, mouse.y)&&mouse.x>0&&mouse.y>0&&mouse.x<width&&mouse.y<height) {
    if (drops.length>50)drops=drops.slice(1);
    if (frameCount % 6 == 0) drops.push(new Water(mouse));
    if (frameCount % 6 == 1) drops.push(new Sludge(mouse));
    if (frameCount % 6 == 2) drops.push(new Oil(mouse));
  }
  for (var p in drops) {
    let gravAcc = createVector(0, 0.2);
    let gravity = gravAcc.copy().mult(drops[p].mass);
    drops[p].applyForce(gravity);
    if (setPiece.colliding(drops[p].location.x, drops[p].location.y)) drops[p].velocity.mult(-.7);
    if (setPiece.colliding(drops[p].location.x-drops[p].diameter/2, drops[p].location.y))drops[p].velocity.add(drops[p].vis, 0);//l/r coll
    if (setPiece.colliding(drops[p].location.x+drops[p].diameter/2, drops[p].location.y))drops[p].velocity.add(-drops[p].vis, 0);

    if (setPiece.colliding(drops[p].location.x, drops[p].location.y-drops[p].diameter/2))drops[p].velocity.add(drops[p].vis, 0);//u/d coll
    if (setPiece.colliding(drops[p].location.x, drops[p].location.y+drops[p].diameter/2))drops[p].velocity.add(-drops[p].vis, 0);
    drops[p].update();
  }
}


class crater {
  constructor(v) {
    this.d=20.0;
    this.verts=[createVector(400, 275), 
      createVector(300, 358), 
      createVector(200, 275), 
      createVector(150, 450), 
      createVector(450, 450)];
  }
  update() {
    for (let i=0; i<this.verts.length; i++) {
      if ((mouse.copy().sub(this.verts[i])).mag()<this.d&&mouseIsPressed) {
        fill(255, 0, 0);
        ellipse(this.verts[i].x, this.verts[i].y, this.d, this.d);
        this.verts[i].add(mouse.copy().sub(this.verts[i]));
      } else {
        fill(0, 0, 255);
        ellipse(this.verts[i].x, this.verts[i].y, this.d, this.d);
      }
      if (i==0)line(this.verts[i].x, this.verts[i].y, this.verts[this.verts.length-1].x, this.verts[this.verts.length-1].y);
      else line(this.verts[i].x, this.verts[i].y, this.verts[i-1].x, this.verts[i-1].y);
    }
    beginShape();
    vertex(this.verts[0].array());
    vertex(this.verts[1].array());
    vertex(this.verts[2].array());
    vertex(this.verts[3].array());
    vertex(this.verts[4].array());
    endShape(CLOSE);
  }
  colliding(x, y) {
    let prev=this.verts.length-1;
    let returns=false;
    for (let i = 0; i < this.verts.length; i++) {
      if ((((this.verts[i].y <= y) && (y < this.verts[prev].y)) ||((this.verts[prev].y <= y) && (y < this.verts[i].y))) &&(x < (this.verts[prev].x - this.verts[i].x) * (y - this.verts[i].y) / (this.verts[prev].y - this.verts[i].y) + this.verts[i].x)) {
        returns=!returns;
      }
      prev=i;
    }
    return returns;
  }
}

class drop {
  constructor(l) {
    this.location = l.copy();
    this.velocity = createVector(random(-2, 2), random(-5, 0));
    this.acceleration = createVector(0, 0);
    this.diameter = random(5, 15);
    this.mass = this.diameter / 5.0;
    this.age = 0;
    this.lifespan = 60;
  }

  display() {
    stroke(0);
    fill(this.c, this.lifespan);
    ellipseMode(CENTER);
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    ellipse(0, 0, this.diameter, this.diameter);
    pop();
  }

  update() {
    this.move();
    this.display();
    this.age++;
  }

  move() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(f) {
    this.acceleration.add(f.copy().div(this.mass));
  }
}

class Water extends drop {
  //median viscosity
  constructor(l) {
    super(l);
    this.c = color(0, 0, 255);
    this.vis=.5;
  }
}
class Sludge extends drop {
  //Low viscosity
  constructor(l) {
    super(l);
    this.c = color(108, 98, 20);
    this.vis=.001;
  }
}
class Oil extends drop {
  //High Viscosity
  constructor(l) {
    super(l);
    this.c = color(223, 223, 64);
    this.vis=1;
  }
}
