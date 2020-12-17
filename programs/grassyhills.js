let r, d;
let white, clrBlue, orange, brown, black;
function setup() {
  r = random(0, 1000);
  createCanvas(800, 600);
  white = color('white'); 
  clrBlue = color('blue');
  orange = color('orange'); 
  brown = color('brown'); 
  black = color('black');
  d = pixelDensity();
}

function draw() {
  drawSky();
  drawClouds();
  drawMountain(100, 200, 0);
  drawMountain(150, 150, 1);
  drawMountain(200, 100, 2);
  drawMountain(255, 50, 3);
  fill(255);
  stroke(black);
  strokeWeight(.5);
  rect(0, 0, 200, 50);
  fill(0);
  text("click to regenerate.", 20, 20);
}
function drawClouds() {
  loadPixels();
  for (let x = 0; x<width; x++) {
    for (let y = 0; y<height/4; y++) {
      let index=4*(x*d+(y*d)*width*d);
      let b = lerpColor(clrBlue, orange, map(y, 0, height, 0, 1));
      let c = lerpColor(lerpColor(white, b, map(y, 0, height/4, 0, 1)), b, noise((frameCount/10)+x/100.0, y/100.0));      
      pixels[index] = red(c);
      pixels[index+1] = green(c);
      pixels[index+2] = blue(c);
      pixels[index+3] = alpha(c);
    }
  }
  updatePixels();
}
function drawSky() {
  for (let y = 0; y<=height; y++) {
    stroke(lerpColor(clrBlue, orange, map(y, 0, height, 0, 1)));
    line(0, y, width, y);
  }
}
function mousePressed() {
  r = random(0, 1000);
}
function drawMountain(shade, disp, seq) {
  for (let x = 0; x<=width; x++) {
    let n = noise((r+(x+width*seq)/500.0));
    let ystart = map(n, 0, 1, 0, height);
    stroke(brown);
    strokeWeight(shade/75);
    if (ystart>=(height/2))drawGrass(int(x), int((ystart+disp)), brown, shade);//so that grass grows only where rain would collect
    line(x, ystart+disp, x, height);
  }
}
function drawGrass(x, y, br, shade) {
  stroke(10, 245, 10, shade);
  for (let i=0; i<int(random(0, 30)); i++) {
    line((x-abs(randomGaussian()*2)), (y-abs(randomGaussian()*2)), (x+abs(randomGaussian()*2)), (y+abs(randomGaussian()*2)));
  }
  stroke(br, shade);
}
