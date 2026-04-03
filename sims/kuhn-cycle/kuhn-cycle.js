// Kuhn's Cycle of Scientific Revolutions MicroSim
// Cyclical diagram with 5 stages and animated dot tracing the cycle.
// Step-through with historical examples for different scientific revolutions.
// MicroSim template version 2026.02

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- Cycle data ----
let stages = [
  { name: "Pre-Science", desc: "No dominant paradigm. Competing schools of thought.", color: "lightgray" },
  { name: "Normal\nScience", desc: "Research within an established paradigm. Puzzle-solving.", color: "teal" },
  { name: "Anomalies", desc: "Observations that don't fit the paradigm accumulate.", color: "goldenrod" },
  { name: "Crisis", desc: "Confidence in the paradigm erodes. Alternative theories emerge.", color: "coral" },
  { name: "Revolution", desc: "A new paradigm replaces the old. Gestalt shift in understanding.", color: "mediumpurple" }
];

let revolutions = {
  "Copernican": {
    examples: [
      "Ptolemaic geocentric model",
      "Astronomical observations, calendar predictions",
      "Retrograde motion, precession errors",
      "Competing models (Tycho, Copernicus)",
      "Heliocentric model accepted"
    ]
  },
  "Darwinian": {
    examples: [
      "Special creation / fixity of species",
      "Classification, comparative anatomy",
      "Fossil record gaps, biogeography patterns",
      "Multiple origin theories debated",
      "Natural selection accepted"
    ]
  },
  "Einsteinian": {
    examples: [
      "Newtonian mechanics",
      "Precise measurements, predictions",
      "Mercury's orbit, speed of light constancy",
      "Lorentz, Poincaré alternatives",
      "General relativity accepted"
    ]
  },
  "Plate Tectonics": {
    examples: [
      "Fixed continent model",
      "Geological surveys, fossil mapping",
      "Continental fit, matching fossils across oceans",
      "Wegener's drift theory debated for decades",
      "Seafloor spreading confirmed plate tectonics"
    ]
  }
};

let revolutionKeys = Object.keys(revolutions);
let activeStage = 0;
let selectedRevolution = 0;

// ---- Animated dot ----
let dotProgress = 0; // 0 to 1 within current segment
let dotSegment = 0;  // which segment (0..4)
let dotSpeed = 0.005;
let autoAnimate = true;

// ---- Controls ----
let revSelect;
let prevButton;
let nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Create revolution dropdown
  revSelect = createSelect();
  revSelect.parent(mainElement);
  for (let i = 0; i < revolutionKeys.length; i++) {
    revSelect.option(revolutionKeys[i]);
  }
  revSelect.selected(revolutionKeys[0]);
  revSelect.position(10, drawHeight + 18);
  revSelect.style('font-size', '14px');
  revSelect.style('background-color', 'white');
  revSelect.changed(() => {
    for (let i = 0; i < revolutionKeys.length; i++) {
      if (revolutionKeys[i] === revSelect.value()) {
        selectedRevolution = i;
        break;
      }
    }
  });

  // Previous button
  prevButton = createButton('Previous');
  prevButton.parent(mainElement);
  prevButton.position(canvasWidth - 180, drawHeight + 18);
  prevButton.style('background-color', 'white');
  prevButton.mousePressed(() => {
    activeStage = (activeStage - 1 + stages.length) % stages.length;
    autoAnimate = false;
  });

  // Next button
  nextButton = createButton('Next');
  nextButton.parent(mainElement);
  nextButton.position(canvasWidth - 80, drawHeight + 18);
  nextButton.style('background-color', 'white');
  nextButton.mousePressed(() => {
    activeStage = (activeStage + 1) % stages.length;
    autoAnimate = false;
  });

  textFont('Arial');
  describe('Kuhn Cycle of Scientific Revolutions: interactive cyclical diagram with five stages showing how paradigm shifts occur in science, with historical examples from the Copernican, Darwinian, Einsteinian, and Plate Tectonics revolutions.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text("Kuhn's Cycle of Scientific Revolutions", canvasWidth / 2, 10);

  // ---- Cycle layout ----
  let cycleRadius = Math.min(canvasWidth * 0.2, 120);
  let centerX = canvasWidth * 0.32;
  let centerY = 200;
  let nodeRadius = Math.min(canvasWidth * 0.085, 48);

  if (canvasWidth < 500) {
    centerX = canvasWidth / 2;
    centerY = 190;
    cycleRadius = Math.min(canvasWidth * 0.22, 110);
    nodeRadius = Math.min(canvasWidth * 0.09, 44);
  }

  // Compute node positions (clockwise starting from top)
  let nodeAngles = [];
  for (let i = 0; i < stages.length; i++) {
    // Start at top (-PI/2), go clockwise
    let angle = -PI / 2 + (TWO_PI / stages.length) * i;
    nodeAngles.push(angle);
  }

  // ---- Draw curved arrows between stages ----
  for (let i = 0; i < stages.length; i++) {
    let next = (i + 1) % stages.length;
    let x1 = centerX + cycleRadius * cos(nodeAngles[i]);
    let y1 = centerY + cycleRadius * sin(nodeAngles[i]);
    let x2 = centerX + cycleRadius * cos(nodeAngles[next]);
    let y2 = centerY + cycleRadius * sin(nodeAngles[next]);

    // Compute control point for curve (pull outward from center)
    let midAngle = (nodeAngles[i] + nodeAngles[next]) / 2;
    // Handle wrap-around for last->first
    if (next === 0) {
      midAngle = (nodeAngles[i] + nodeAngles[next] + TWO_PI) / 2;
    }
    let curvePull = cycleRadius * 0.35;
    let cx = centerX + (cycleRadius + curvePull) * cos(midAngle);
    let cy = centerY + (cycleRadius + curvePull) * sin(midAngle);

    // Shorten start and end to not overlap with node circles
    let dx1 = cx - x1, dy1 = cy - y1;
    let d1 = sqrt(dx1 * dx1 + dy1 * dy1);
    let sx = x1 + (dx1 / d1) * (nodeRadius + 2);
    let sy = y1 + (dy1 / d1) * (nodeRadius + 2);

    let dx2 = x2 - cx, dy2 = y2 - cy;
    let d2 = sqrt(dx2 * dx2 + dy2 * dy2);
    let ex = x2 - (dx2 / d2) * (nodeRadius + 8);
    let ey = y2 - (dy2 / d2) * (nodeRadius + 8);

    // Highlight arrow for active stage transition
    let isActiveArrow = (i === activeStage);
    stroke(isActiveArrow ? 'steelblue' : color(150));
    strokeWeight(isActiveArrow ? 3 : 2);
    noFill();
    beginShape();
    vertex(sx, sy);
    quadraticVertex(cx, cy, ex, ey);
    endShape();

    // Arrowhead
    let arrowSize = 9;
    let arrAngle = atan2(ey - cy, ex - cx);
    fill(isActiveArrow ? 'steelblue' : color(150));
    noStroke();
    triangle(
      ex, ey,
      ex - arrowSize * cos(arrAngle - PI / 6), ey - arrowSize * sin(arrAngle - PI / 6),
      ex - arrowSize * cos(arrAngle + PI / 6), ey - arrowSize * sin(arrAngle + PI / 6)
    );
  }

  // ---- Draw stage nodes ----
  for (let i = 0; i < stages.length; i++) {
    let x = centerX + cycleRadius * cos(nodeAngles[i]);
    let y = centerY + cycleRadius * sin(nodeAngles[i]);
    let c = stages[i].color;

    if (i === activeStage) {
      // Glow
      noStroke();
      for (let g = 15; g > 0; g--) {
        fill(red(color(c)), green(color(c)), blue(color(c)), 10);
        ellipse(x, y, nodeRadius * 2 + g * 3, nodeRadius * 2 + g * 3);
      }
      fill(c);
      stroke('white');
      strokeWeight(3);
    } else {
      fill(c);
      stroke(100);
      strokeWeight(1);
    }

    ellipse(x, y, nodeRadius * 2, nodeRadius * 2);

    // Label
    noStroke();
    // Choose text color for readability
    if (c === 'lightgray' || c === 'goldenrod') {
      fill('black');
    } else {
      fill('white');
    }
    textAlign(CENTER, CENTER);
    textSize(Math.min(12, nodeRadius * 0.3));
    text(stages[i].name, x, y);
  }

  // ---- Animated dot ----
  if (autoAnimate) {
    dotProgress += dotSpeed;
    if (dotProgress >= 1) {
      dotProgress = 0;
      dotSegment = (dotSegment + 1) % stages.length;
      activeStage = dotSegment;
    }

    let i = dotSegment;
    let next = (i + 1) % stages.length;
    let x1 = centerX + cycleRadius * cos(nodeAngles[i]);
    let y1 = centerY + cycleRadius * sin(nodeAngles[i]);
    let x2 = centerX + cycleRadius * cos(nodeAngles[next]);
    let y2 = centerY + cycleRadius * sin(nodeAngles[next]);

    let midAngle = (nodeAngles[i] + nodeAngles[next]) / 2;
    if (next === 0) {
      midAngle = (nodeAngles[i] + nodeAngles[next] + TWO_PI) / 2;
    }
    let curvePull = cycleRadius * 0.35;
    let cx = centerX + (cycleRadius + curvePull) * cos(midAngle);
    let cy = centerY + (cycleRadius + curvePull) * sin(midAngle);

    // Quadratic bezier interpolation
    let t = dotProgress;
    let dotX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    let dotY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

    noStroke();
    fill('steelblue');
    ellipse(dotX, dotY, 14, 14);
    fill('white');
    ellipse(dotX, dotY, 6, 6);
  }

  // ---- Info panel ----
  let rev = revolutions[revolutionKeys[selectedRevolution]];
  let panelX, panelY, panelW, panelH;

  if (canvasWidth >= 500) {
    panelX = canvasWidth * 0.58;
    panelY = 50;
    panelW = canvasWidth * 0.38;
    panelH = 280;
  } else {
    panelX = 12;
    panelY = centerY + cycleRadius + nodeRadius + 20;
    panelW = canvasWidth - 24;
    panelH = drawHeight - panelY - 10;
  }

  // Panel background
  fill(255, 255, 255, 235);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Stage name with color
  let stageColor = stages[activeStage].color;
  noStroke();
  fill(stageColor);
  textAlign(LEFT, TOP);
  textSize(16);
  textStyle(BOLD);
  let stageName = stages[activeStage].name.replace('\n', ' ');
  text('Stage ' + (activeStage + 1) + ': ' + stageName, panelX + 12, panelY + 12);
  textStyle(NORMAL);

  // Stage description
  fill(60);
  textSize(13);
  text(stages[activeStage].desc, panelX + 12, panelY + 36, panelW - 24);

  // Divider
  stroke(220);
  strokeWeight(1);
  line(panelX + 12, panelY + 75, panelX + panelW - 12, panelY + 75);

  // Revolution-specific example
  noStroke();
  fill('steelblue');
  textSize(14);
  textStyle(BOLD);
  text(revolutionKeys[selectedRevolution] + ' Revolution', panelX + 12, panelY + 85);
  textStyle(NORMAL);

  fill(40);
  textSize(13);
  let example = rev.examples[activeStage];
  text(example, panelX + 12, panelY + 108, panelW - 24);

  // All stages mini-list
  let listY = panelY + 148;
  textSize(11);
  for (let i = 0; i < stages.length; i++) {
    let sn = stages[i].name.replace('\n', ' ');
    let yy = listY + i * 24;
    if (yy + 20 > panelY + panelH) break;

    if (i === activeStage) {
      fill(stages[i].color);
      noStroke();
      ellipse(panelX + 18, yy + 6, 10, 10);
      fill(30);
      textStyle(BOLD);
    } else {
      fill(180);
      noStroke();
      ellipse(panelX + 18, yy + 6, 8, 8);
      fill(120);
      textStyle(NORMAL);
    }
    textAlign(LEFT, CENTER);
    text(sn + ': ' + rev.examples[i], panelX + 28, yy + 6, panelW - 44);
    textStyle(NORMAL);
  }

  // ---- Step indicator dots ----
  let dotY = drawHeight - 14;
  let dotSpacing = 18;
  let dotsStartX = canvasWidth / 2 - (stages.length - 1) * dotSpacing / 2;
  noStroke();
  for (let i = 0; i < stages.length; i++) {
    let dx = dotsStartX + i * dotSpacing;
    if (i === activeStage) {
      fill(stages[i].color);
      ellipse(dx, dotY, 12, 12);
    } else {
      fill(200);
      ellipse(dx, dotY, 8, 8);
    }
  }

  // Instructions
  noStroke();
  fill(130);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Click a stage or use Previous / Next. Dot animates automatically.', canvasWidth / 2, drawHeight - 1);
}

// Handle mouse clicks on stage nodes
function mousePressed() {
  let cycleRadius = Math.min(canvasWidth * 0.2, 120);
  let centerX = canvasWidth * 0.32;
  let centerY = 200;
  let nodeRadius = Math.min(canvasWidth * 0.085, 48);

  if (canvasWidth < 500) {
    centerX = canvasWidth / 2;
    centerY = 190;
    cycleRadius = Math.min(canvasWidth * 0.22, 110);
    nodeRadius = Math.min(canvasWidth * 0.09, 44);
  }

  for (let i = 0; i < stages.length; i++) {
    let angle = -PI / 2 + (TWO_PI / stages.length) * i;
    let x = centerX + cycleRadius * cos(angle);
    let y = centerY + cycleRadius * sin(angle);
    let d = dist(mouseX, mouseY, x, y);
    if (d < nodeRadius) {
      activeStage = i;
      autoAnimate = false;
      break;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  revSelect.position(10, drawHeight + 18);
  prevButton.position(canvasWidth - 180, drawHeight + 18);
  nextButton.position(canvasWidth - 80, drawHeight + 18);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
