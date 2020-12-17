let bullets=[], enemies=[], starcrawl=[], bl=250, psecond, sh=0, wallshade=0, start=true, gameplay=false, dead=false, band;
function setup() {
  createCanvas(800, 600);
  for (let i = 0; i<150; i++)starcrawl.push(new Star());
  noStroke();
}
function draw() {
  collisionHandler();
  guiHandler();
}
function guiHandler() {
  if (start) {
    background(0);
    fill(0, 255, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("LINE DEFENDER", width/2, height/10);
    textSize(15);
    text("Use the mouse to control your spaceship and click to fire, you can only fire behind the line. \n Your weapon will help in fending off the invaders \n click to continue", width/2, height/2);
    if (mouseIsPressed) {
      gameplay=true;
      start=false;
    }
  }

  if (gameplay) {
    propHandler();
    if (wallshade>=255) {
      dead=true;
      gameplay=false;
      bl=250;
      wallshade=0;
    }
  }
  if (dead) {
    bullets=[];
    enemies=[];
    background(0);
    fill(0, 255, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", width/2, height/10);
    textSize(15);
    text("Click to try again.", width/2, height/2);
    if (mouseIsPressed) {
      gameplay=true;
      dead=false;
    }
  }
}
function propHandler() {
  background(0);
  if (mouseIsPressed && mouseX<width/8&&bl>0) {
    bullets.push(new bullet(mouseX, mouseY));
    bl--;
  }
  //display scrolling starfield
  for (let s in starcrawl)starcrawl[s].displayCrawl();
  fill(124, 200, 112);
  text("bullets left: "+bl+"\nline health: "+(255-wallshade), width-width/10, height/25);
  //draw borderline, change color with var
  fill(wallshade, 255-wallshade, 0);
  rect(width/8, 0, width/36, height);

  //draw cursor
  triangle(mouseX+25, mouseY, mouseX-5, mouseY-15, mouseX, mouseY);
  triangle(mouseX+25, mouseY, mouseX-5, mouseY+15, mouseX, mouseY);
  //draw/perform functions of enemies
  for (let b in enemies)enemies[b].render();
  //draw/perform functions of bullets
  for (let i in bullets)bullets[i].render();
  //add a few new enemies every few seconds
  if (second()!=psecond)sh=0;
  if (sh<5 && second()%2==0) {
    if (sh==0)psecond=second();
    sh++;
    bl++;
    enemies.push(new enemy(width-(width/50), int(map(randomGaussian(), -6, 6, 0, height))));
  }
}
function collisionHandler() {
  for (let y=enemies.length-1; y>=0; y--) {
    let e = enemies[y];
    if (e.loc.x<width/7.5) {
      enemies.splice(y,1);
      wallshade+=e.health;
    }
    for (let i=bullets.length-1; i>=0; i--) {
      let b = bullets[i];
      if (b.location.x>width||b.location.y>height)bullets.splice(i,1);
      if (b.location.x>e.loc.x-(25+e.health*5)&&b.location.x<e.loc.x&&b.location.y<e.loc.y+(15+e.health*5)&&b.location.y>e.loc.y-(15+e.health*5)) {
        bullets.splice(i,1);
        e.health--;
        if (e.health<=1) { 
          enemies.splice(y,1);
          bl+=e.health;
        }
      }
    }
  }
}
class enemy {
  constructor(_x, _y) {
    this.loc= createVector(_x, _y);
    this.vel=createVector(0, 0);
    this.health=int(random(1, 5));
    this.c=color(map(randomGaussian(), -6, 6, 0, 255), map(randomGaussian(), -6, 6, 0, 255), map(randomGaussian(), -6, 6, 0, 255));
    this.accl = createVector(-0.03, 0.0);
  }
  render() {
    this.vel.set(p5.Vector.add(this.vel,this.accl));
    this.vel.limit(2);
    this.loc.set(p5.Vector.add(this.loc,this.vel));
    fill(this.c);
    triangle(this.loc.x-(25+this.health*5), this.loc.y, this.loc.x+(5+this.health*5), this.loc.y-(15+this.health*5), this.loc.x, this.loc.y);
    triangle(this.loc.x-(25+this.health*5), this.loc.y, this.loc.x+(5+this.health*5), this.loc.y+(15+this.health*5), this.loc.x, this.loc.y);
    let exhaust = this.accl.copy().normalize().rotate(radians(180));
    for (let i = 0; i < 5; i++) {
      let a = exhaust.copy();
      a.setMag(30*abs(randomGaussian()));
      let shift = 5*randomGaussian();
      a.rotate(radians(shift));
      stroke(this.c);
      strokeWeight(4);
      point(this.loc.x+a.x, this.loc.y+a.y);
      noStroke();
    }
    this.loc.y+=randomGaussian();
    if (this.loc.y < 0) this.loc.y = height/randomGaussian();
    if (this.loc.y > height) this.loc.y = height/randomGaussian();
  }
}

class bullet {
  constructor(_x, _y) {
    this.location = createVector(_x, _y);
    this.velocity = createVector(50, 0);
    this.acceleration = createVector(0.01, 0);
  }

  render() {
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(10);
    fill(255, 0, 0);
    ellipse(this.location.x, this.location.y, 10, 10);
  }
}
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed=random(0, 10);
  }
  displayCrawl() {
    fill(255);
    this.x-=this.speed;
    if (this.x<0)this.x=width;
    ellipse(this.x, this.y, 5, 5);
  }
}
