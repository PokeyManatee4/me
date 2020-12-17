let darkblue, lightblue, waterlevel, grass, mountains, d;
function setup() {
  createCanvas(800, 600);
  darkblue = color(20, 20, 150);
  lightblue = color(100, 100, 255);
  waterlevel = 120;
  grass = color(20, 200, 20);
  mountains = color(100, 60, 30);
  noiseDetail(8);
  calcMap();
}

function mousePressed() {
  calcMap();
}
function calcMap() {
  noiseSeed(millis());
  loadPixels();
  d = pixelDensity();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let n = map(noise(x/100.0, y/100.0), 0, 1, 0, 255);
      let index=4*(x*d+(y*d)*width*d);
      let c = color(0);

      if (n < waterlevel) {
        let waterfrac = pow(1 - (waterlevel - n) / waterlevel, 7);
        c = lerpColor(darkblue, lightblue, waterfrac);
      }
      if (n >= waterlevel) {
        let landfrac = pow((n - waterlevel) / (255-waterlevel), 0.21);
        c = lerpColor(grass, mountains, landfrac);
      }
      pixels[index] = red(c);
      pixels[index+1] = green(c);
      pixels[index+2] = blue(c);
      pixels[index+3] = alpha(c);
    }
  }
  updatePixels();
}
