let equation = [1, 0, -9.86960440109];
let iteration = 0;
let point_of_tangent = 10;
let TOLERANCE = 0.000001;
let SF = 5;
let reset_btn;
let stop = false;
let equation_input;
// 5x^2 + 2x^1 - 3x^0
// x^2 - 3

let old_value;

let xRange;
let yRange;

let xSlider;
let ySlider;
let sf_slider;

const f = (x, equation) => {
  let output = 0;
  // 2-1-0   0-1-2

  for (let i = equation.length - 1; i >= 0; i--) {
    output += equation[Math.abs(i - equation.length + 1)] * x ** i;
  }
  return output;
};

const getNextValue = (x, equation) => {
  // newton rhapson !!
  return x - f(x, equation) / derivative(x, equation);
};

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

const derivative = (x, equation) => {
  let increasing = [];
  let decreasing = [];
  for (let i = equation.length - 1; i >= 0; i--) {
    decreasing.push(i);
    increasing.push(Math.abs(i - equation.length + 1));
  }

  //equation = [5x^2 + 3x^1 - 2x^0]
  //[5,3,-2]
  //increasing = [0,1,2]
  //decreasing = [2,1,0]

  let newEquation = new Array(equation.length - 2);
  for (let i = 0; i < equation.length - 1; i++) {
    newEquation[i] = equation[i] * decreasing[i];
  }

  return f(x, newEquation);
};

const equationOfTangent = (x, equation) => {
  // returns an equation in the form of [mx, c], representing y = mx + c
  let m = derivative(x, equation);
  return [m, -m * x + f(x, equation)];
};

function setup() {
  createCanvas(Math.min(800, window.innerWidth * 0.9), 800).parent(
    select("#canvas")
  );
  xSlider = createSlider(1, 100, 10);
  ySlider = createSlider(1, 100, 50);
  sf_slider = createSlider(1, 10, 5);
  reset_btn = createButton("Reset");
  equation_input = createInput();
  equation_input.elt.placeholder = "1,0,-2";

  xSlider.parent(select("#x-range"));
  ySlider.parent(select("#y-range"));
  sf_slider.parent(select("#SF-control"));
  reset_btn.parent(select("#reset-btn"));
  equation_input.parent(select("#equation-control"));

  reset_btn.elt.onclick = reset;
  select("#equation-btn").elt.onclick = changeEquation;

  frameRate(60);
}

const changeEquation = () => {
  let new_equation = equation_input.value().split(",");
  for (let elt of new_equation) {
    if (isNaN(elt)) {
      console.log("invalid");
      return;
    }
  }
  equation = new_equation.map((elt) => parseFloat(elt));
  reset();
};

const reset = () => {
  stop = false;
  point_of_tangent = 10;
  iteration = 0;
};

const convertToReadable = (equation) => {
  let res = "";
  for (let i = equation.length - 1; i >= 0; i--) {
    let j = Math.abs(i - equation.length + 1);
    //j is increasing, i is decreasing
    // if (i != 1 || i != 0) {
    let prefix = equation[j];
    if (prefix == 1 && j != 0) {
      prefix = "+";
    } else if (prefix == -1) {
      prefix = "-";
    } else if (prefix == 0) continue;
    else if (prefix == 1 && j == 0) prefix = "";
    // let plus_flag = prefix > 0 && j !== 0 ? "+" : "";
    if (prefix > 0 && j != 0) {
      plus_flag = "+";
    } else plus_flag = "";
    if (i == 1) {
      res += plus_flag + prefix + "x" + " ";
    } else if (i == 0) {
      res += plus_flag + prefix + " ";
    } else {
      res += plus_flag + prefix + "x" + `<sup>${i}</sup>` + " ";
    }
  }
  return res;
};

function draw() {
  select("#equation").html(convertToReadable(equation));
  SF = sf_slider.value();
  select("#iteration").html(iteration);
  xRange = xSlider.value();
  yRange = ySlider.value();

  background(0);
  stroke(100);
  strokeWeight(2);
  // draw axis
  line(-width, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  // graph
  push();
  stroke(255);
  translate(width / 2, height / 2);
  // draw label
  textSize(20);
  textAlign(CENTER);
  fill(255);
  // x label
  text(-xRange, -width / 2 + 20, -5);
  text(xRange, width / 2 - 20, -5);
  // y label
  text(-yRange, 20, height / 2 - 10);
  text(yRange, 20, -height / 2 + 20);

  noFill();
  beginShape();
  for (let x = -width / 2; x <= width / 2; x += 0.1) {
    let y = f(x, equation);
    let output = -1 * (y / yRange) * (height / 2);
    vertex(map(x, -xRange, xRange, -width / 2, width / 2), output);
  }
  endShape();
  let x1 = -xRange;
  let x2 = xRange;

  let equation_of_tangent = equationOfTangent(point_of_tangent, equation);

  let y1 = f(x1, equation_of_tangent);
  let y2 = f(x2, equation_of_tangent);
  x1 = map(x1, -xRange, xRange, -width / 2, width / 2);
  x2 = map(x2, -xRange, xRange, -width / 2, width / 2);

  y1 = (-1 * (y1 / yRange) * height) / 2;
  y2 = (-1 * (y2 / yRange) * height) / 2;

  stroke(255, 0, 0);
  line(x1, y1, x2, y2);
  pop();
  if (frameCount % 60 != 0) return;

  old_value = point_of_tangent;
  point_of_tangent = getNextValue(point_of_tangent, equation);
  if (Math.abs(old_value - point_of_tangent) < TOLERANCE) stop = true;
  push();

  translate(width / 2, height / 2);
  stroke(0, 255, 0);
  noFill();
  setLineDash([5, 5]);

  let y = f(point_of_tangent, equation);
  y = (-1 * ((y / yRange) * height)) / 2;

  line(
    map(point_of_tangent, -xRange, xRange, -width / 2, width / 2),
    0,
    map(point_of_tangent, -xRange, xRange, -width / 2, width / 2),
    y
  );
  pop();
  translate(width / 2, height / 2);
  textAlign(CENTER);
  // text(
  //   point_of_tangent.toFixed(SF).toString(),
  //   map(point_of_tangent, -xRange, xRange, -width / 2, width / 2),
  //   20
  // );
  select("#value").html(point_of_tangent.toFixed(SF));
  if (!stop) iteration++;
  select("#SF").html(SF);

  // console.log(f(0, equationOfTangent(1, equation)));
  // console.log(f(1, equationOfTangent(1, equation)));
}
