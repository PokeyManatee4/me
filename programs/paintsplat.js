let splats = [];
function setup() {
  createCanvas(800, 600);
  background(245);
  fill(0);
  text("click to make a paintsplat!", 50, 50);
}
function draw() {
  if (mouseIsPressed) splats.push(new splat(mouseX, mouseY));
  for (var i in splats)if(millis()-splats[i].st<=5000)splats[i].render();
}
class splat {
  constructor(_x, _y) {
    this.dribbles=[];
    this.dots=[];
    this.rays=[];
    this.x=_x;
    this.y=_y;
    this.st=millis();
    this.populate();
  }
  populate() {
    let r=int(random(0, 255)), g=int(random(0, 255)), b=int(random(0, 255));
    for (let i=0; i<int(random(90, 150)); i++) {
      this.rays.push(new ray(mouseX, mouseY, mouseX+this.numseg(randomGaussian(), 10000), mouseY+this.numseg(randomGaussian(), 10000), r, g, b, int(random(0, 10))));
      for (let v =0; v<5; v++)this.dots.push(new dot(mouseX, mouseY, r, g, b, int(random(0, 10))));//produce more dots than any other type
      this.dribbles.push(new dribble(mouseX+this.numseg(randomGaussian(), 10000), mouseY+this.numseg(randomGaussian(), 10000), r, g, b, int(random(0, 10))));
    }
  }
  render() {
    for (let i in this.rays)this.rays[i].render();
    for (let i in this.dots)this.dots[i].render();
    for (let i=0;i<this.dribbles.length;i++){
        if(this.dribbles[i].y>height)this.dribbles.slice(i);
        else this.dribbles[i].render();
    }
  }
  numseg(n, f) {
    return int((n*1000000)/f);//make it large and truncate for more randomness
  }
}
class ray {//so rays render above dribbles
  constructor(_x1, _y1, _x2, _y2, _r, _g, _b, _w) {
    this.x1=_x1;
    this.y1=_y1;
    this.x2=_x2;
    this.y2=_y2;
    this.r=_r;
    this.g=_g;
    this.b=_b;
    this.w=_w;
  }
  render() {
    strokeWeight(this.w);
    stroke(this.r, this.g, this.b);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}
class dot {
  constructor(_x, _y, _r, _g, _b, _w) {
    this.x=_x;
    this.y=_y;
    this.s=int(abs(randomGaussian()));
    this.r=_r-50;
    this.g=_g-50;
    this.b=_b-50;
    this.w=_w;
    this.a=random(0, 360);
    this.rad=60*randomGaussian();
  }
  render() {
    strokeWeight(this.w);
    stroke(this.r, this.g, this.b, 100*abs(int(this.x+this.y)));
    fill(this.r, this.g, this.b);//preserve color
    ellipse(this.x+ this.rad*cos(radians(this.a)), this.y+ this.rad*sin(radians(this.a)), this.s, this.s);//just like a dribble, but stationary, and tighter in scope
  }
}
class dribble {
  constructor(_x, _y, _r, _g, _b, _w) {
    this.x=_x;
    this.y=_y;
    this.s=int(abs(randomGaussian()));
    this.r=_r;
    this.g=_g;
    this.b=_b;
    this.w=_w;
  }
  render() {
    strokeWeight(this.w);
    fill(this.r, this.g, this.b, 100*abs(int(this.x+this.y)));//preserve color
    ellipse(this.x, this.y, this.s, this.s);
    this.y++;
    if (this.s<=0)this.s=0;
    else this.s=this.s-.01;
    this.x=this.x+(randomGaussian()/2);//add wobbling of droplet, like in real life
  }
}
