// Hermeneutic Circle MicroSim - Animated circular diagram of interpretation
// CANVAS_HEIGHT: 510

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let contextSelect;
let stepButton;
let resetButton;

// State
let currentStep = -1; // -1 means not started
let animating = false;
let dotAngle = -HALF_PI; // start at top
let targetAngle = -HALF_PI;
let animSpeed = 0.03;

// Circle geometry
let cx, cy, cr;

// Context data with 4 iterations each
let contexts = {
  "Reading a Novel": [
    { part: "You read Chapter 1", whole: "Form initial understanding of the story", direction: "part-to-whole",
      detail: "You read Chapter 1 (part) → form initial understanding of the story (whole)" },
    { part: "Reinterpret Chapter 1's foreshadowing", whole: "Your sense of the whole story guides you", direction: "whole-to-part",
      detail: "Your sense of the whole story → changes how you interpret Chapter 1's foreshadowing (part)" },
    { part: "You read Chapter 5", whole: "Revise your understanding of the entire plot", direction: "part-to-whole",
      detail: "You read Chapter 5 (part) → revise your understanding of the entire plot (whole)" },
    { part: "Hidden meaning in earlier dialogue revealed", whole: "Your revised whole understanding", direction: "whole-to-part",
      detail: "Your revised whole → reveals hidden meaning in earlier dialogue (parts)" }
  ],
  "Understanding a Culture": [
    { part: "You observe a greeting ritual", whole: "Form a first impression of the culture's values", direction: "part-to-whole",
      detail: "You observe a greeting ritual (part) → form a first impression of the culture's values (whole)" },
    { part: "Reinterpret the ritual as showing hierarchy", whole: "Your impression of cultural values", direction: "whole-to-part",
      detail: "Your impression of cultural values → reinterpret the ritual as showing hierarchy (part)" },
    { part: "You learn about their education system", whole: "Deepen understanding of how the culture transmits values", direction: "part-to-whole",
      detail: "You learn about their education system (part) → deepen understanding of how the culture transmits values (whole)" },
    { part: "See the greeting ritual as teaching respect to children", whole: "Your fuller cultural understanding", direction: "whole-to-part",
      detail: "Your fuller cultural understanding → see the greeting ritual as teaching respect to children (part)" }
  ],
  "Interpreting a Law": [
    { part: "You read a specific statute", whole: "Form an understanding of the law's purpose", direction: "part-to-whole",
      detail: "You read a specific statute (part) → form an understanding of the law's purpose (whole)" },
    { part: "Reinterpret ambiguous wording in the statute", whole: "The law's overall purpose guides you", direction: "whole-to-part",
      detail: "The law's overall purpose → reinterpret ambiguous wording in the statute (part)" },
    { part: "You examine case law and precedents", whole: "Revise understanding of legislative intent", direction: "part-to-whole",
      detail: "You examine case law and precedents (part) → revise understanding of legislative intent (whole)" },
    { part: "See new implications in the original statute", whole: "Your revised understanding of intent", direction: "whole-to-part",
      detail: "Your revised understanding of intent → see new implications in the original statute (part)" }
  ],
  "Analyzing a Painting": [
    { part: "You notice the use of dark colors", whole: "Form a first sense of the painting's mood", direction: "part-to-whole",
      detail: "You notice the use of dark colors (part) → form a first sense of the painting's mood (whole)" },
    { part: "Reinterpret a figure's expression as sorrowful", whole: "The somber mood guides you", direction: "whole-to-part",
      detail: "The somber mood → reinterpret a figure's expression as sorrowful (part)" },
    { part: "You learn the historical context of the work", whole: "Revise understanding as a commentary on war", direction: "part-to-whole",
      detail: "You learn the historical context (part) → revise understanding as a commentary on war (whole)" },
    { part: "See the dark colors as representing moral darkness", whole: "Your war commentary reading", direction: "whole-to-part",
      detail: "Your war commentary reading → see the dark colors as representing moral darkness (part)" }
  ]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Controls
  contextSelect = createSelect();
  contextSelect.parent(document.querySelector('main'));
  Object.keys(contexts).forEach(k => contextSelect.option(k));
  contextSelect.style('font-size', '14px');
  contextSelect.style('padding', '4px 8px');
  contextSelect.style('background', 'white');
  contextSelect.changed(resetSim);

  stepButton = createButton('Step');
  stepButton.parent(document.querySelector('main'));
  stepButton.style('font-size', '14px');
  stepButton.style('padding', '4px 12px');
  stepButton.style('margin-left', '8px');
  stepButton.style('background', 'white');
  stepButton.mousePressed(nextStep);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '4px 12px');
  resetButton.style('margin-left', '8px');
  resetButton.style('background', 'white');
  resetButton.mousePressed(resetSim);

  describe('Animated hermeneutic circle diagram showing iteration between understanding parts and understanding the whole, with step-through examples for different contexts.');
}

function draw() {
  // Drawing area
  background('aliceblue');
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Circle geometry
  cx = canvasWidth / 2;
  cy = drawHeight / 2 + 10;
  cr = min(canvasWidth, drawHeight) * 0.28;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('The Hermeneutic Circle', canvasWidth / 2, 10);

  // Draw the main circle path
  noFill();
  stroke('steelblue');
  strokeWeight(3);
  ellipse(cx, cy, cr * 2, cr * 2);

  // Draw arrow arcs (clockwise)
  drawArrowArc(cx, cy, cr, -HALF_PI + 0.3, HALF_PI - 0.3, 'teal');    // right side: whole → parts
  drawArrowArc(cx, cy, cr, HALF_PI + 0.3, TWO_PI - HALF_PI - 0.3, 'goldenrod'); // left side: parts → whole

  // Label boxes
  drawLabelBox(cx, cy - cr - 35, 'Understanding the WHOLE', 'teal', 'white');
  drawLabelBox(cx, cy + cr + 35, 'Understanding the PARTS', 'goldenrod', 'white');

  // Arrow labels along the sides
  drawSideLabel(cx + cr + 15, cy, 'The whole shapes\nhow we understand\nthe parts', 'right');
  drawSideLabel(cx - cr - 15, cy, 'Parts inform our\nunderstanding of\nthe whole', 'left');

  // Iteration indicator
  let ctx = contextSelect.value();
  let steps = contexts[ctx];

  // Draw iteration dots around bottom
  let dotSpacing = 18;
  let dotsStartX = cx - ((steps.length - 1) * dotSpacing) / 2;
  for (let i = 0; i < steps.length; i++) {
    noStroke();
    if (i <= currentStep) {
      fill('teal');
    } else {
      fill(200);
    }
    ellipse(dotsStartX + i * dotSpacing, drawHeight - 15, 10, 10);
  }
  noStroke();
  fill('black');
  textSize(11);
  textAlign(CENTER, TOP);
  text('Iterations', cx, drawHeight - 30);

  // Center text: current interpretation
  if (currentStep >= 0 && currentStep < steps.length) {
    let step = steps[currentStep];
    noStroke();
    fill(255, 255, 255, 220);
    rectMode(CENTER);
    let boxW = cr * 1.5;
    let boxH = 60;
    rect(cx, cy, boxW, boxH, 8);
    rectMode(CORNER);

    fill('black');
    textSize(12);
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    let label = 'Iteration ' + (currentStep + 1);
    if (step.direction === 'part-to-whole') {
      label += ': Parts → Whole';
    } else {
      label += ': Whole → Parts';
    }
    text(label, cx, cy);
  } else {
    // Not started
    noStroke();
    fill(100);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Click "Step" to begin', cx, cy);
  }

  // Detail text at bottom of draw area
  if (currentStep >= 0 && currentStep < steps.length) {
    let step = steps[currentStep];
    noStroke();
    fill(50);
    textSize(12);
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    text(step.detail, cx, drawHeight - 55, canvasWidth - 40);
  }

  // Animate the dot
  if (animating) {
    let angleDiff = targetAngle - dotAngle;
    // Ensure we go clockwise (positive direction)
    if (angleDiff < 0) angleDiff += TWO_PI;
    if (angleDiff > 0.05) {
      dotAngle += animSpeed;
      if (dotAngle > TWO_PI) dotAngle -= TWO_PI;
    } else {
      dotAngle = targetAngle;
      animating = false;
    }
  }

  // Draw the traveling dot
  if (currentStep >= 0) {
    let dx = cx + cr * cos(dotAngle);
    let dy = cy + cr * sin(dotAngle);
    noStroke();
    fill('crimson');
    ellipse(dx, dy, 16, 16);
    // Glow effect
    fill(220, 20, 60, 60);
    ellipse(dx, dy, 28, 28);
  }

  // Control area label
  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Context:', 8, drawHeight + controlHeight / 2);
}

function drawArrowArc(x, y, r, startA, endA, col) {
  stroke(col);
  strokeWeight(4);
  noFill();
  arc(x, y, r * 2, r * 2, startA, endA);

  // Arrowhead at end
  let ax = x + r * cos(endA);
  let ay = y + r * sin(endA);
  let tangentAngle = endA + HALF_PI; // perpendicular to radius = tangent direction clockwise
  fill(col);
  noStroke();
  push();
  translate(ax, ay);
  rotate(tangentAngle);
  triangle(0, -7, 0, 7, 14, 0);
  pop();
}

function drawLabelBox(x, y, label, bgColor, textColor) {
  noStroke();
  textSize(14);
  let tw = textWidth(label) + 24;
  let th = 30;
  fill(bgColor);
  rectMode(CENTER);
  rect(x, y, tw, th, 6);
  fill(textColor);
  textAlign(CENTER, CENTER);
  text(label, x, y);
  rectMode(CORNER);
}

function drawSideLabel(x, y, label, side) {
  noStroke();
  fill(80);
  textSize(11);
  if (side === 'right') {
    textAlign(LEFT, CENTER);
  } else {
    textAlign(RIGHT, CENTER);
  }
  text(label, x, y);
}

function nextStep() {
  let ctx = contextSelect.value();
  let steps = contexts[ctx];
  if (currentStep < steps.length - 1) {
    currentStep++;
    // Animate dot: half circle per step
    let step = steps[currentStep];
    if (step.direction === 'part-to-whole') {
      // Bottom to top (parts → whole): go from PI/2 to -PI/2 (left side, counterclockwise visually but we go clockwise in angle)
      targetAngle = dotAngle + PI;
    } else {
      // Top to bottom (whole → parts): go from -PI/2 to PI/2 (right side)
      targetAngle = dotAngle + PI;
    }
    animating = true;
  }
}

function resetSim() {
  currentStep = -1;
  animating = false;
  dotAngle = -HALF_PI;
  targetAngle = -HALF_PI;
}

function updateCanvasSize() {
  const main = document.querySelector('main');
  if (main) {
    containerWidth = main.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(containerWidth, 300);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
