let cell, tick = 0, rate=20000;
function setup() {
  cell = new CA();
  createCanvas(800, 600);
  background(245);
  frameRate(rate);
}
function draw() {
  if (cell.generation==height||mouseIsPressed) {
    background(245);
    tick++;
    cell.ruleset = [Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1))];
    cell.generation=0;
  }
  cell.display();
  cell.nextGeneration();
  fill(255);
  rect(0, 0, width/6, width/6);
  fill(255, 0, 0);
  text(tick, width/12-width/24, width/12);
  text(""+cell.ruleset[0]+cell.ruleset[1]+cell.ruleset[2]+cell.ruleset[3]+cell.ruleset[4]+cell.ruleset[5]+cell.ruleset[6]+cell.ruleset[7], (width)/12, width/12);
}
class CA {
  constructor() {
    this.ruleset = [Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1)), Math.round(random(0, 1))];
    this.cells = [width];
    this.cells.map(v=>0);
    this.cells[width/2]=1;
    this.generation=0;
  }
  nextGeneration() {
    this.generation++;
    for (let i = 1; i<width-1; i++) {
      this.cells[i] = this.rules(this.cells[i-1], this.cells[i], this.cells[i+1]);
    }
  }
  display() {
    for (let i=0; i<width; i++) {
      if (this.cells[i]==1)stroke(0);
      else stroke(255);
      point(i, this.generation);
    }
  }
  rules(l, m, r) {
    let binaryNum = ""+l+m+r;
    let index = int(binaryNum, 2);
    return this.ruleset[index];
  }
}
