// AI Ethics Dimensions Radar Chart
// CANVAS_HEIGHT: 550

let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 200;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Radar chart dimensions
let dimensions = ["Transparency", "Fairness", "Accountability", "Privacy", "Autonomy"];

// Scenario data: [Transparency, Fairness, Accountability, Privacy, Autonomy]
let scenarios = {
  "Social Media Algorithm": [8, 3, 2, 2, 7],
  "Medical Diagnosis AI": [6, 7, 8, 4, 3],
  "Criminal Sentencing AI": [3, 4, 7, 5, 2],
  "Autonomous Vehicles": [5, 6, 6, 7, 8],
  "Content Moderation AI": [4, 5, 5, 6, 4]
};

let scenarioNames = Object.keys(scenarios);

// Controls
let scenarioSelect;
let dimSliders = [];
let compareButton;
let compareSelect;
let comparing = false;

// Colors for polygons
let primaryColor;
let compareColor;

// Trade-off explanations
let tradeoffTexts = {
  "Social Media Algorithm": "High autonomy but low fairness and privacy — optimizes engagement over user wellbeing.",
  "Medical Diagnosis AI": "Strong accountability and fairness but limited autonomy — human oversight is essential.",
  "Criminal Sentencing AI": "High accountability demanded but low transparency — 'black box' concerns persist.",
  "Autonomous Vehicles": "Balanced profile with high autonomy and privacy but moderate transparency.",
  "Content Moderation AI": "Moderate across all axes — balances free expression with safety."
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  primaryColor = color("steelblue");
  compareColor = color("tomato");

  // Row 1: Scenario dropdown
  let row1Y = drawHeight + 12;
  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  for (let name of scenarioNames) {
    scenarioSelect.option(name);
  }
  scenarioSelect.changed(onScenarioChanged);

  // Row 2: 5 sliders for dimensions
  for (let i = 0; i < 5; i++) {
    let sl = createSlider(0, 10, scenarios[scenarioNames[0]][i], 1);
    sl.parent(document.querySelector('main'));
    dimSliders.push(sl);
  }

  // Row 3: Compare button + second scenario select
  compareButton = createButton("Compare");
  compareButton.parent(document.querySelector('main'));
  compareButton.mousePressed(toggleCompare);

  compareSelect = createSelect();
  compareSelect.parent(document.querySelector('main'));
  for (let name of scenarioNames) {
    compareSelect.option(name);
  }
  compareSelect.selected(scenarioNames[1]);

  positionControls();
  onScenarioChanged();

  describe('Radar chart showing ethical dimensions of AI systems with 5 axes: Transparency, Fairness, Accountability, Privacy, and Autonomy. Users can select scenarios and compare them.');
}

function positionControls() {
  let sliderWidth = canvasWidth - sliderLeftMargin - margin;

  // Row 1: Scenario dropdown
  let row1Y = drawHeight + 10;
  scenarioSelect.position(margin, row1Y);
  scenarioSelect.size(canvasWidth - 2 * margin);

  // Row 2: 5 sliders stacked compactly
  let sliderStartY = row1Y + 30;
  let sliderSpacing = 24;
  for (let i = 0; i < 5; i++) {
    dimSliders[i].position(sliderLeftMargin, sliderStartY + i * sliderSpacing);
    dimSliders[i].size(sliderWidth);
  }

  // Row 3: Compare button + second selector
  let row3Y = sliderStartY + 5 * sliderSpacing + 8;
  compareButton.position(margin, row3Y);
  compareButton.size(80, 24);
  compareSelect.position(margin + 90, row3Y);
  compareSelect.size(canvasWidth - margin - 90 - margin);
}

function onScenarioChanged() {
  let name = scenarioSelect.value();
  let vals = scenarios[name];
  for (let i = 0; i < 5; i++) {
    dimSliders[i].value(vals[i]);
  }
}

function toggleCompare() {
  comparing = !comparing;
  if (comparing) {
    compareButton.html("Hide");
  } else {
    compareButton.html("Compare");
  }
}

function draw() {
  updateCanvasSize();

  // Draw area background
  stroke("silver");
  strokeWeight(1);
  fill("aliceblue");
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill("white");
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill("black");
  textAlign(CENTER, TOP);
  textSize(18);
  text("AI Ethics Dimensions", canvasWidth / 2, 8);

  // Radar chart parameters
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2 + 10;
  let maxRadius = min(canvasWidth, drawHeight) / 2 - 50;
  let angleStep = TWO_PI / 5;
  let startAngle = -HALF_PI; // top

  // Draw concentric pentagons for scale
  stroke("lightgray");
  strokeWeight(0.5);
  noFill();
  for (let level = 2; level <= 10; level += 2) {
    let r = map(level, 0, 10, 0, maxRadius);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = startAngle + i * angleStep;
      vertex(cx + r * cos(angle), cy + r * sin(angle));
    }
    endShape(CLOSE);
  }

  // Draw axes
  stroke("gray");
  strokeWeight(0.8);
  for (let i = 0; i < 5; i++) {
    let angle = startAngle + i * angleStep;
    line(cx, cy, cx + maxRadius * cos(angle), cy + maxRadius * sin(angle));
  }

  // Axis labels
  noStroke();
  fill("black");
  textSize(12);
  let labelOffset = 16;
  for (let i = 0; i < 5; i++) {
    let angle = startAngle + i * angleStep;
    let lx = cx + (maxRadius + labelOffset) * cos(angle);
    let ly = cy + (maxRadius + labelOffset) * sin(angle);

    // Adjust alignment based on position
    if (i === 0) {
      textAlign(CENTER, BOTTOM);
    } else if (i === 1 || i === 2) {
      textAlign(LEFT, CENTER);
    } else {
      textAlign(RIGHT, CENTER);
    }
    text(dimensions[i], lx, ly);
  }

  // Scale numbers along first axis (Transparency - top)
  textAlign(RIGHT, CENTER);
  textSize(9);
  fill("gray");
  noStroke();
  for (let level = 2; level <= 10; level += 2) {
    let r = map(level, 0, 10, 0, maxRadius);
    let angle = startAngle;
    text(level, cx + r * cos(angle) - 5, cy + r * sin(angle));
  }

  // Get current slider values
  let currentValues = [];
  for (let i = 0; i < 5; i++) {
    currentValues.push(dimSliders[i].value());
  }

  // Draw primary polygon
  drawRadarPolygon(cx, cy, maxRadius, startAngle, angleStep, currentValues, primaryColor);

  // Draw comparison polygon if comparing
  if (comparing) {
    let compName = compareSelect.value();
    let compValues = scenarios[compName];
    drawRadarPolygon(cx, cy, maxRadius, startAngle, angleStep, compValues, compareColor);

    // Legend
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    fill(primaryColor);
    rect(margin, drawHeight - 40, 12, 12);
    noStroke();
    fill("black");
    text(scenarioSelect.value(), margin + 16, drawHeight - 34);

    fill(compareColor);
    rect(margin, drawHeight - 24, 12, 12);
    noStroke();
    fill("black");
    text(compName, margin + 16, drawHeight - 18);
  }

  // Slider labels in control area
  noStroke();
  fill("black");
  textAlign(LEFT, CENTER);
  textSize(11);
  let sliderStartY = drawHeight + 10 + 30;
  let sliderSpacing = 24;
  for (let i = 0; i < 5; i++) {
    let y = sliderStartY + i * sliderSpacing + 4;
    text(dimensions[i] + ": " + dimSliders[i].value(), margin, y);
  }

  // Trade-off text at very bottom of control area
  let tradeoffY = sliderStartY + 5 * sliderSpacing + 38;
  noStroke();
  fill("dimgray");
  textSize(10);
  textAlign(LEFT, TOP);
  let scenarioName = scenarioSelect.value();
  let tradeoffMsg = tradeoffTexts[scenarioName] || "";
  text(tradeoffMsg, margin, tradeoffY, canvasWidth - 2 * margin, 40);
}

function drawRadarPolygon(cx, cy, maxRadius, startAngle, angleStep, values, col) {
  // Filled polygon
  let fillCol = color(red(col), green(col), blue(col), 60);
  fill(fillCol);
  stroke(col);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = startAngle + i * angleStep;
    let r = map(values[i], 0, 10, 0, maxRadius);
    vertex(cx + r * cos(angle), cy + r * sin(angle));
  }
  endShape(CLOSE);

  // Dots at vertices
  noStroke();
  fill(col);
  for (let i = 0; i < 5; i++) {
    let angle = startAngle + i * angleStep;
    let r = map(values[i], 0, 10, 0, maxRadius);
    ellipse(cx + r * cos(angle), cy + r * sin(angle), 8, 8);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    let containerWidth = mainEl.getBoundingClientRect().width;
    if (containerWidth > 0) {
      canvasWidth = containerWidth;
    }
  }
  canvasHeight = drawHeight + controlHeight;
}
