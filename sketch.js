let equation = [1];
// 5x^2 + 2x^1 + 3x^0

const f = (x) => {
  let output = 0;
  // 2-1-0   0-1-2
  for (let i = equation.length - 1; i >= 0; i--) {
    output += equation[Math.abs(i - equation.length + 1)] * x ** i;
  }
  return output;
};

function setup() {
  createCanvas(800, 800).parent(select("#canvas"));
}

function draw() {
  background(0);
  stroke(255);
  for (let x = -width / 2; x < width / 2; x++) {
    let output = f(x);
    output = map(output, f(-width / 2), f(width / 2), height, 0);
    point(x, output);
  }
}
