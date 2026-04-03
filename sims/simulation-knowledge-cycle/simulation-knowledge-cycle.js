// Simulation Knowledge Cycle MicroSim
// Cyclical diagram of simulation-based knowledge production
// Cycle: Assumptions → Model Building → Running Simulation → Outputs → Validation → Refinement → (back)

let canvasWidth = 400;
const CANVAS_HEIGHT = 520;
const drawHeight = 460;
const controlHeight = 60;

let stages = [
  {name:"Assumptions", desc:"Identify simplifying assumptions about the real system", color:"coral", example:"Climate model assumes certain CO₂ feedback loops"},
  {name:"Model\nBuilding", desc:"Translate assumptions into mathematical/computational rules", color:"goldenrod", example:"Code equations for atmospheric physics and ocean circulation"},
  {name:"Running\nSimulation", desc:"Execute the model with input parameters", color:"teal", example:"Run model for 100 years of projected emissions"},
  {name:"Outputs", desc:"Generate predictions, patterns, or data", color:"steelblue", example:"Temperature projections, sea level rise estimates"},
  {name:"Validation", desc:"Compare outputs against real-world observations", color:"mediumpurple", example:"Check against historical temperature records"},
  {name:"Refinement", desc:"Adjust assumptions and model based on validation results", color:"mediumseagreen", example:"Improve cloud formation algorithms based on satellite data"}
];

let strengths = [
  "Can study systems too complex, dangerous, or expensive to experiment on directly",
  "Allows exploration of 'what if' scenarios",
  "Can reveal unexpected emergent behavior"
];
let limitations = [
  "Only as good as the assumptions built in",
  "Can create false confidence through precision",
  "Validation against past doesn't guarantee future accuracy"
];

let currentStep = -1; // -1 means no stage revealed yet
let showEval = false;
let animDotAngle = 0;
let animDotSpeed = 0.01;
let cycleComplete = false;

let prevBtn, nextBtn, evalBtn;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);

  // Controls
  prevBtn = createButton('Previous');
  prevBtn.parent(document.querySelector('main'));
  prevBtn.mousePressed(goPrev);
  prevBtn.style('background-color', 'white');
  prevBtn.style('margin', '4px');

  nextBtn = createButton('Next');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.mousePressed(goNext);
  nextBtn.style('background-color', 'white');
  nextBtn.style('margin', '4px');

  evalBtn = createButton('Show Evaluation');
  evalBtn.parent(document.querySelector('main'));
  evalBtn.mousePressed(toggleEval);
  evalBtn.style('background-color', 'white');
  evalBtn.style('margin', '4px');

  describe('A cyclical diagram showing six stages of simulation-based knowledge production with step-through animation and strengths/limitations panel.');
}

function draw() {
  background('aliceblue');

  let cx = canvasWidth / 2;
  let cy = 175;
  let radius = min(canvasWidth * 0.3, 130);
  let nodeRadius = min(canvasWidth * 0.1, 38);

  // Title
  noStroke();
  fill('black');
  textSize(16);
  textStyle(BOLD);
  text('Simulation Knowledge Cycle', cx, 22);
  textStyle(NORMAL);

  // Draw arrows between nodes (curved clockwise)
  for (let i = 0; i < stages.length; i++) {
    let nextI = (i + 1) % stages.length;
    let a1 = -PI / 2 + (TWO_PI / stages.length) * i;
    let a2 = -PI / 2 + (TWO_PI / stages.length) * nextI;

    let x1 = cx + cos(a1) * radius;
    let y1 = cy + sin(a1) * radius;
    let x2 = cx + cos(a2) * radius;
    let y2 = cy + sin(a2) * radius;

    let revealed = (currentStep >= i && currentStep >= nextI) || (i === stages.length - 1 && cycleComplete);
    let arrowAlpha = revealed ? 200 : 60;

    // Curved arrow via midpoint pushed outward
    let midAngle = (a1 + a2) / 2;
    if (a2 < a1) midAngle += PI;
    let bulge = radius * 0.2;
    let mx = cx + cos(midAngle) * (radius + bulge);
    let my = cy + sin(midAngle) * (radius + bulge);

    // Offset start and end to node edges
    let startAngle = atan2(my - y1, mx - x1);
    let sx = x1 + cos(startAngle) * nodeRadius;
    let sy = y1 + sin(startAngle) * nodeRadius;

    let endAngle = atan2(my - y2, mx - x2);
    let ex = x2 + cos(endAngle) * nodeRadius;
    let ey = y2 + sin(endAngle) * nodeRadius;

    stroke(120, arrowAlpha);
    strokeWeight(2);
    noFill();
    beginShape();
    vertex(sx, sy);
    quadraticVertex(mx, my, ex, ey);
    endShape();

    // Arrowhead
    let tipAngle = atan2(ey - my, ex - mx);
    fill(120, arrowAlpha);
    noStroke();
    push();
    translate(ex, ey);
    rotate(tipAngle);
    triangle(0, 0, -10, -5, -10, 5);
    pop();
  }

  // Draw nodes
  for (let i = 0; i < stages.length; i++) {
    let angle = -PI / 2 + (TWO_PI / stages.length) * i;
    let x = cx + cos(angle) * radius;
    let y = cy + sin(angle) * radius;

    let revealed = currentStep >= i;
    let isCurrent = currentStep === i;

    // Node circle
    noStroke();
    if (revealed) {
      fill(stages[i].color);
    } else {
      fill(210);
    }
    if (isCurrent) {
      stroke(30);
      strokeWeight(3);
    }
    ellipse(x, y, nodeRadius * 2, nodeRadius * 2);

    // Node label
    noStroke();
    fill('white');
    textSize(10);
    textStyle(BOLD);
    text(stages[i].name, x, y);
    textStyle(NORMAL);
  }

  // Animated dot tracing the cycle
  if (currentStep >= 0 && !showEval) {
    animDotAngle += animDotSpeed;
    if (animDotAngle > TWO_PI) animDotAngle -= TWO_PI;
    let dotA = -PI / 2 + animDotAngle;
    let dx = cx + cos(dotA) * radius;
    let dy = cy + sin(dotA) * radius;
    noStroke();
    fill('orangered');
    ellipse(dx, dy, 10, 10);
  }

  // Central info panel
  let panelY = cy + radius + 50;
  let panelW = canvasWidth - 40;
  let panelH = 140;

  if (showEval) {
    // Strengths and Limitations panel
    noStroke();
    fill(255, 255, 255, 230);
    rect(20, panelY - 10, panelW, panelH + 30, 8);

    fill('black');
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Strengths', 32, panelY);
    textStyle(NORMAL);
    textSize(11);
    fill('darkgreen');
    for (let i = 0; i < strengths.length; i++) {
      text('+ ' + strengths[i], 32, panelY + 18 + i * 18, panelW - 24);
    }

    fill('black');
    textSize(13);
    textStyle(BOLD);
    text('Limitations', 32, panelY + 78);
    textStyle(NORMAL);
    textSize(11);
    fill('darkred');
    for (let i = 0; i < limitations.length; i++) {
      text('− ' + limitations[i], 32, panelY + 96 + i * 18, panelW - 24);
    }
    textAlign(CENTER, CENTER);

  } else if (currentStep >= 0 && currentStep < stages.length) {
    // Current stage info
    let s = stages[currentStep];
    noStroke();
    fill(255, 255, 255, 230);
    rect(20, panelY - 10, panelW, panelH, 8);

    fill(s.color);
    textSize(14);
    textStyle(BOLD);
    noStroke();
    textAlign(CENTER, TOP);
    let cleanName = s.name.replace('\n', ' ');
    text('Stage ' + (currentStep + 1) + ': ' + cleanName, cx, panelY);
    textStyle(NORMAL);

    fill('black');
    textSize(12);
    text(s.desc, cx, panelY + 24, panelW - 30);

    fill('gray');
    textSize(11);
    textStyle(ITALIC);
    text('Example: ' + s.example, cx, panelY + 64, panelW - 30);
    textStyle(NORMAL);

    // Step indicator
    fill(150);
    textSize(10);
    text('Step ' + (currentStep + 1) + ' of ' + stages.length, cx, panelY + panelH - 16);

    textAlign(CENTER, CENTER);
  } else if (currentStep === -1) {
    // Initial prompt
    noStroke();
    fill(255, 255, 255, 200);
    rect(20, panelY - 10, panelW, 60, 8);
    fill('gray');
    textSize(13);
    text('Press Next to step through the cycle', cx, panelY + 20);
  }

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);
}

function goPrev() {
  showEval = false;
  if (currentStep > 0) {
    currentStep--;
  } else if (currentStep <= 0) {
    currentStep = -1;
  }
  cycleComplete = (currentStep >= stages.length - 1);
  evalBtn.html('Show Evaluation');
}

function goNext() {
  showEval = false;
  if (currentStep < stages.length - 1) {
    currentStep++;
  }
  cycleComplete = (currentStep >= stages.length - 1);
  evalBtn.html('Show Evaluation');
}

function toggleEval() {
  showEval = !showEval;
  evalBtn.html(showEval ? 'Hide Evaluation' : 'Show Evaluation');
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.getBoundingClientRect().width;
  }
  canvasWidth = max(canvasWidth, 300);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}
