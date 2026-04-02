// Claim to Knowledge Workflow - Vertical Flowchart
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 50;
let canvasHeight = 510;
let margin = 25;
let defaultTextSize = 16;

let claimSelector;
let hoveredStep = -1;

let steps = [
  {type: "start", label: "Knowledge Claim Made"},
  {type: "process", label: "Identify Claim Type"},
  {type: "process", label: "Gather Evidence"},
  {type: "decision", label: "Apply Theories\nof Truth"},
  {type: "process", label: "Check JTB Conditions"},
  {type: "decision", label: "Gettier Check"},
  {type: "process", label: "Apply Fallibilism"},
  {type: "end", label: "Provisional Knowledge"}
];

let claims = {
  "Vaccines are safe": {
    1: "Someone asserts 'Vaccines are safe and effective'",
    2: "Empirical claim — can be tested with evidence",
    3: "Clinical trials, epidemiological data, WHO reports",
    4: "Correspondence: matches observed health outcomes. Coherence: fits medical knowledge. Pragmatic: produces beneficial results",
    5: "Belief: Yes. True: Supported by evidence. Justified: Strong scientific consensus",
    6: "Justification connects reliably to truth via scientific method",
    7: "Remain open to new evidence about specific vaccines or populations",
    8: "Held as provisional knowledge with strong empirical support"
  },
  "Democracy is best": {
    1: "'Democracy is the best political system'",
    2: "Normative claim — involves value judgment",
    3: "Historical comparisons, political philosophy, citizen satisfaction data",
    4: "Correspondence: complex. Coherence: depends on values framework. Pragmatic: generally positive outcomes",
    5: "Belief: varies. True: debatable. Justified: depends on criteria",
    6: "Connection between justification and truth is indirect for normative claims",
    7: "High revisability — political philosophy evolves",
    8: "Held as reasoned opinion rather than firm knowledge"
  },
  "Big Bang occurred": {
    1: "'The universe began with the Big Bang'",
    2: "Empirical/theoretical claim",
    3: "Cosmic microwave background, redshift, abundance of light elements",
    4: "Correspondence: matches multiple observations. Coherence: fits physics. Pragmatic: enables predictions",
    5: "Belief: scientific consensus. True: strongly supported. Justified: multiple independent lines",
    6: "Strong reliable connection via scientific methodology",
    7: "Open to refinement as new data emerges",
    8: "Robust provisional knowledge with very strong support"
  },
  "Stealing is wrong": {
    1: "'Stealing is morally wrong'",
    2: "Normative/ethical claim",
    3: "Ethical frameworks, cultural norms, legal systems, consequences",
    4: "Correspondence: no moral facts to check. Coherence: fits most ethical systems. Pragmatic: social order",
    5: "Belief: widespread. True: framework-dependent. Justified: multiple ethical arguments",
    6: "Justification varies by ethical framework used",
    7: "Edge cases challenge absolute claims (stealing bread to survive)",
    8: "Widely shared moral conviction; knowledge status debated"
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textFont('Arial');

  // Controls row at bottom
  claimSelector = createSelect();
  claimSelector.parent(document.querySelector('main'));
  claimSelector.option("Vaccines are safe");
  claimSelector.option("Democracy is best");
  claimSelector.option("Big Bang occurred");
  claimSelector.option("Stealing is wrong");
  claimSelector.position(margin, drawHeight + 15, 'static');
  claimSelector.style('font-size', '14px');
  claimSelector.style('padding', '4px 8px');
  claimSelector.style('background-color', 'white');

  describe('Vertical flowchart showing an 8-step claim to knowledge evaluation process with hover explanations and claim selector dropdown.');
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control label
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Claim:", margin, drawHeight + 25);
  claimSelector.position(margin + 50, drawHeight + 12, 'static');

  // Flowchart layout
  let numSteps = steps.length;
  let topMargin = 20;
  let bottomMargin = 15;
  let availableHeight = drawHeight - topMargin - bottomMargin;
  let stepSpacing = availableHeight / numSteps;
  let shapeW = canvasWidth - margin * 2 - 40;
  let shapeH = stepSpacing * 0.55;
  let centerX = canvasWidth / 2;

  hoveredStep = -1;

  for (let i = 0; i < numSteps; i++) {
    let cy = topMargin + stepSpacing * i + stepSpacing / 2;
    let s = steps[i];

    // Hit detection
    if (isHovering(s.type, centerX, cy, shapeW, shapeH)) {
      hoveredStep = i;
    }

    // Draw arrow to next step
    if (i < numSteps - 1) {
      let nextCy = topMargin + stepSpacing * (i + 1) + stepSpacing / 2;
      let arrowStartY = cy + shapeH / 2;
      let arrowEndY = nextCy - shapeH / 2;
      if (s.type === "decision") {
        arrowStartY = cy + shapeH * 0.7;
      }
      if (steps[i + 1].type === "decision") {
        arrowEndY = nextCy - shapeH * 0.7;
      }
      stroke(100);
      strokeWeight(2);
      line(centerX, arrowStartY, centerX, arrowEndY);
      // Arrowhead
      fill(100);
      noStroke();
      triangle(centerX - 5, arrowEndY - 8, centerX + 5, arrowEndY - 8, centerX, arrowEndY);
    }

    // Draw shape
    let isHovered = (hoveredStep === i);
    drawShape(s.type, centerX, cy, shapeW, shapeH, s.label, isHovered);
  }

  // Draw hover panel if a step is hovered
  if (hoveredStep >= 0) {
    drawHoverPanel(hoveredStep);
  }

  // Title
  noStroke();
  fill(0);
  textSize(defaultTextSize);
  textAlign(CENTER, TOP);
  text("Claim to Knowledge Workflow", centerX, 3);
}

function drawShape(type, cx, cy, w, h, label, isHovered) {
  let strokeCol = isHovered ? color(0) : color(80);
  let sw = isHovered ? 3 : 1.5;

  push();
  stroke(strokeCol);
  strokeWeight(sw);

  if (type === "start" || type === "end") {
    fill('mediumaquamarine');
    ellipse(cx, cy, w * 0.7, h);
  } else if (type === "process") {
    fill('teal');
    rectMode(CENTER);
    rect(cx, cy, w, h, 10);
  } else if (type === "decision") {
    fill('goldenrod');
    beginShape();
    vertex(cx, cy - h * 0.7);
    vertex(cx + w / 2, cy);
    vertex(cx, cy + h * 0.7);
    vertex(cx - w / 2, cy);
    endShape(CLOSE);
  }

  // Label text
  noStroke();
  if (type === "process") {
    fill(255);
  } else {
    fill(0);
  }
  textAlign(CENTER, CENTER);
  textSize(12);
  text(label, cx, cy);

  pop();
}

function isHovering(type, cx, cy, w, h) {
  let mx = mouseX;
  let my = mouseY;

  if (type === "start" || type === "end") {
    let rx = w * 0.35;
    let ry = h / 2;
    let dx = (mx - cx) / rx;
    let dy = (my - cy) / ry;
    return (dx * dx + dy * dy) <= 1;
  } else if (type === "process") {
    return mx >= cx - w / 2 && mx <= cx + w / 2 && my >= cy - h / 2 && my <= cy + h / 2;
  } else if (type === "decision") {
    // Diamond hit test using Manhattan distance
    let dx = abs(mx - cx) / (w / 2);
    let dy = abs(my - cy) / (h * 0.7);
    return (dx + dy) <= 1;
  }
  return false;
}

function drawHoverPanel(stepIndex) {
  let selectedClaim = claimSelector.value();
  let claimData = claims[selectedClaim];
  let explanation = claimData[stepIndex + 1];
  let stepLabel = steps[stepIndex].label.replace('\n', ' ');

  // Panel dimensions
  let panelW = canvasWidth - 20;
  let panelX = 10;
  let panelY = drawHeight - 120;
  let panelH = 110;

  // Semi-transparent background
  push();
  fill(255, 255, 255, 235);
  stroke(50);
  strokeWeight(2);
  rectMode(CORNER);
  rect(panelX, panelY, panelW, panelH, 8);

  // Step title
  noStroke();
  fill('teal');
  textSize(13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text("Step " + (stepIndex + 1) + ": " + stepLabel, panelX + 10, panelY + 8);

  // Claim label
  fill(120);
  textStyle(ITALIC);
  textSize(11);
  text("Claim: " + selectedClaim, panelX + 10, panelY + 26);

  // Explanation text
  fill(30);
  textStyle(NORMAL);
  textSize(12);
  text(explanation, panelX + 10, panelY + 42, panelW - 20, panelH - 50);

  pop();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    let containerWidth = mainEl.getBoundingClientRect().width;
    if (containerWidth > 0) {
      canvasWidth = min(containerWidth, 400);
    }
  }
}
