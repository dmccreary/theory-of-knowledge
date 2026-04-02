// Evidence Evaluation Workflow - Vertical flowchart with branching paths and scenario highlighting
// CANVAS_HEIGHT: 560
let drawHeight = 500;
let controlHeight = 60;
let canvasHeight = 560;
let canvasWidth = 400;

let scenarioSelect;
let hoveredStep = -1;

let steps = [
  {id:0, type:"start",    label:"Evidence\nEncountered",   col:0, row:0},
  {id:1, type:"process",  label:"Identify\nEvidence Type", col:0, row:1},
  {id:2, type:"process",  label:"Check Source\nProvenance", col:0, row:2},
  {id:3, type:"decision", label:"Source\nCredible?",       col:0, row:3},
  {id:4, type:"process",  label:"Assess\nMethodology",     col:0, row:4},
  {id:5, type:"process",  label:"Seek\nCorroboration",     col:1, row:4},
  {id:6, type:"decision", label:"Meets\nStandards?",       col:0, row:5},
  {id:7, type:"end-accept",   label:"Accept\n(Provisionally)", col:0, row:6},
  {id:8, type:"end-withhold", label:"Withhold\nJudgment",      col:1, row:6}
];

let edges = [
  {from:0, to:1, label:""},
  {from:1, to:2, label:""},
  {from:2, to:3, label:""},
  {from:3, to:4, label:"Yes"},
  {from:3, to:5, label:"No"},
  {from:4, to:6, label:""},
  {from:5, to:6, label:""},
  {from:6, to:7, label:"Yes"},
  {from:6, to:8, label:"No"}
];

let scenarios = {
  "-- Select a scenario --": {path:[], highlights:{}},
  "Peer-reviewed vaccine study": {
    path:[0,1,2,3,4,6,7],
    highlights:{
      0:"A new vaccine study appears in your research",
      1:"Empirical evidence — based on experimental data",
      2:"Published in The Lancet, authors affiliated with WHO",
      3:"Yes — prestigious journal, expert authors",
      4:"Randomized controlled trial, large sample size",
      6:"Yes — meets scientific standards",
      7:"Strong empirical support for vaccine effectiveness"
    }
  },
  "Viral social media health post": {
    path:[0,1,2,3,5,6,8],
    highlights:{
      0:"A health claim appears in your social media feed",
      1:"Anecdotal/testimonial evidence",
      2:"Unknown author, shared on Facebook",
      3:"No — no expertise, no accountability",
      5:"No independent confirmation found",
      6:"No — fails basic credibility checks",
      8:"Insufficient evidence — withhold judgment"
    }
  },
  "Government economic report": {
    path:[0,1,2,3,4,6,7],
    highlights:{
      0:"A government agency releases economic data",
      1:"Statistical evidence from official records",
      2:"Bureau of Labor Statistics",
      3:"Yes — government agency with methodology standards",
      4:"Standard statistical methods, large datasets",
      6:"Yes — meets standards with caveat about political framing",
      7:"Accept with awareness of potential framing bias"
    }
  },
  "Friend's account of event": {
    path:[0,1,2,3,5,6,8],
    highlights:{
      0:"A friend tells you about something they witnessed",
      1:"Testimonial evidence — single eyewitness",
      2:"Personal acquaintance, eyewitness",
      3:"Partially — known to you but single perspective",
      5:"Seek other witnesses or documentation",
      6:"Insufficient alone for strong claim",
      8:"Interesting but insufficient as sole evidence"
    }
  },
  "Wikipedia article on history": {
    path:[0,1,2,3,4,6,7],
    highlights:{
      0:"You find a Wikipedia article while researching",
      1:"Secondary source compilation",
      2:"Wikipedia — crowd-sourced, cited sources listed",
      3:"Partially — check cited sources directly",
      4:"Verify key claims against cited primary sources",
      6:"Useful starting point if citations check out",
      7:"Provisionally accept while verifying key claims"
    }
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textAlign(CENTER, CENTER);
  textSize(12);

  // Controls row
  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  scenarioSelect.style('font-size', '14px');
  scenarioSelect.style('padding', '4px 8px');
  scenarioSelect.style('margin-top', '6px');
  scenarioSelect.style('background', 'white');

  let keys = Object.keys(scenarios);
  for (let i = 0; i < keys.length; i++) {
    scenarioSelect.option(keys[i]);
  }

  describe('Evidence evaluation flowchart with 9 steps, branching at decision points, and scenario-based path highlighting.');
}

function draw() {
  // Draw area
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Control area
  fill('silver');
  rect(0, drawHeight, width, controlHeight);

  // Layout parameters
  let mainX = width * 0.38;
  let branchX = width * 0.72;
  let startY = 30;
  let rowSpacing = 66;
  let boxW = 120;
  let boxH = 42;
  let diamondSize = 50;

  // Compute positions for each step
  let positions = [];
  for (let i = 0; i < steps.length; i++) {
    let s = steps[i];
    let px = s.col === 0 ? mainX : branchX;
    let py = startY + s.row * rowSpacing;
    positions.push({x: px, y: py});
  }

  // Get current scenario
  let scenarioName = scenarioSelect.value();
  let scenario = scenarios[scenarioName];
  let activePath = scenario ? scenario.path : [];
  let activeHighlights = scenario ? scenario.highlights : {};

  // Check hover
  hoveredStep = -1;
  for (let i = 0; i < steps.length; i++) {
    let p = positions[i];
    let s = steps[i];
    if (s.type === "decision") {
      // Diamond hit test
      let dx = abs(mouseX - p.x);
      let dy = abs(mouseY - p.y);
      if (dx / diamondSize + dy / diamondSize < 1) {
        hoveredStep = i;
      }
    } else {
      if (mouseX > p.x - boxW/2 && mouseX < p.x + boxW/2 &&
          mouseY > p.y - boxH/2 && mouseY < p.y + boxH/2) {
        hoveredStep = i;
      }
    }
  }

  // Draw edges
  for (let i = 0; i < edges.length; i++) {
    let e = edges[i];
    let fromPos = positions[e.from];
    let toPos = positions[e.to];

    // Check if this edge is on the active path
    let edgeActive = false;
    if (activePath.length > 0) {
      for (let j = 0; j < activePath.length - 1; j++) {
        if (activePath[j] === e.from && activePath[j+1] === e.to) {
          edgeActive = true;
          break;
        }
      }
    }

    let edgeColor;
    if (activePath.length > 0 && !edgeActive) {
      edgeColor = color(200);
      stroke(edgeColor);
      strokeWeight(1);
    } else if (edgeActive) {
      edgeColor = color('dodgerblue');
      stroke(edgeColor);
      strokeWeight(3);
    } else {
      edgeColor = color(80);
      stroke(edgeColor);
      strokeWeight(1.5);
    }

    let fromS = steps[e.from];
    let toS = steps[e.to];

    // Adjust start/end points based on shape
    if (fromS.type === "decision") {
      // From diamond: go from bottom or side
      if (toPos.x !== fromPos.x) {
        // Branch right from decision
        let fx = fromPos.x + diamondSize * 0.7;
        let fy = fromPos.y;
        let tx = toPos.x - boxW/2;
        let ty = toPos.y;
        line(fx, fy, tx, ty);
        drawArrowhead(tx, ty, atan2(ty - fy, tx - fx), edgeColor);
      } else {
        let fy = fromPos.y + diamondSize * 0.7;
        let ty = toPos.y - boxH/2;
        if (toS.type === "decision") ty = toPos.y - diamondSize * 0.7;
        line(fromPos.x, fy, toPos.x, ty);
        drawArrowhead(toPos.x, ty, HALF_PI, edgeColor);
      }
    } else {
      // From box: bottom center
      let fy = fromPos.y + boxH/2;
      let ty = toPos.y - boxH/2;
      if (toS.type === "decision") ty = toPos.y - diamondSize * 0.7;
      if (toPos.x !== fromPos.x) {
        // Horizontal branch
        line(fromPos.x, fy, fromPos.x, (fy + ty)/2);
        line(fromPos.x, (fy + ty)/2, toPos.x, (fy + ty)/2);
        line(toPos.x, (fy + ty)/2, toPos.x, ty);
        drawArrowhead(toPos.x, ty, HALF_PI, edgeColor);
      } else {
        line(fromPos.x, fy, toPos.x, ty);
        drawArrowhead(toPos.x, ty, HALF_PI, edgeColor);
      }
    }

    // Edge labels
    if (e.label !== "") {
      noStroke();
      let lx, ly;
      if (toPos.x !== fromPos.x) {
        lx = (fromPos.x + toPos.x) / 2;
        ly = fromPos.y - 10;
      } else {
        lx = fromPos.x + 16;
        ly = fromPos.y + (fromS.type === "decision" ? diamondSize * 0.7 : boxH/2) + 10;
      }
      fill(80);
      textSize(10);
      textStyle(BOLD);
      noStroke();
      text(e.label, lx, ly);
      textStyle(NORMAL);
      textSize(12);
    }
  }

  // Draw steps
  for (let i = 0; i < steps.length; i++) {
    let s = steps[i];
    let p = positions[i];
    let onPath = activePath.indexOf(s.id) !== -1;
    let dimmed = activePath.length > 0 && !onPath;

    drawStep(s, p.x, p.y, boxW, boxH, diamondSize, onPath, dimmed, i === hoveredStep);
  }

  // Draw hover tooltip
  if (hoveredStep >= 0) {
    let stepId = steps[hoveredStep].id;
    let tooltipText = "";

    if (activeHighlights[stepId] !== undefined) {
      tooltipText = activeHighlights[stepId];
    } else {
      // Default descriptions
      let defaults = [
        "You encounter a piece of evidence or knowledge claim",
        "What type of evidence is this? Empirical, testimonial, statistical?",
        "Where did this evidence come from? Who produced it?",
        "Is the source reliable, expert, and accountable?",
        "Are the methods used to produce this evidence sound?",
        "Can this evidence be independently confirmed?",
        "Does this evidence meet the standards for its type?",
        "Evidence is strong enough to accept provisionally",
        "Evidence is insufficient — suspend judgment"
      ];
      tooltipText = defaults[stepId];
    }

    drawTooltip(tooltipText, mouseX, mouseY);
  }

  // Control area label
  noStroke();
  fill(40);
  textSize(13);
  textAlign(LEFT, CENTER);
  noStroke();
  text("Scenario:", 10, drawHeight + controlHeight / 2);
  textAlign(CENTER, CENTER);
}

function drawStep(s, x, y, bw, bh, ds, onPath, dimmed, hovered) {
  let alpha = dimmed ? 80 : 255;

  push();
  if (s.type === "start") {
    // Skyblue oval
    let c = color(135, 206, 235, alpha);
    fill(c);
    stroke(dimmed ? color(180) : (hovered ? color(30) : color(70, 130, 180)));
    strokeWeight(hovered ? 2.5 : 1.5);
    if (onPath) { stroke('dodgerblue'); strokeWeight(3); }
    ellipse(x, y, bw, bh);
  } else if (s.type === "process") {
    // Teal rounded rect
    let c = color(0, 128, 128, alpha);
    fill(c);
    stroke(dimmed ? color(180) : (hovered ? color(30) : color(0, 100, 100)));
    strokeWeight(hovered ? 2.5 : 1.5);
    if (onPath) { stroke('dodgerblue'); strokeWeight(3); }
    rectMode(CENTER);
    rect(x, y, bw, bh, 10);
    rectMode(CORNER);
  } else if (s.type === "decision") {
    // Amber diamond
    let c = color(255, 191, 0, alpha);
    fill(c);
    stroke(dimmed ? color(180) : (hovered ? color(30) : color(200, 150, 0)));
    strokeWeight(hovered ? 2.5 : 1.5);
    if (onPath) { stroke('dodgerblue'); strokeWeight(3); }
    push();
    translate(x, y);
    beginShape();
    vertex(0, -ds);
    vertex(ds, 0);
    vertex(0, ds);
    vertex(-ds, 0);
    endShape(CLOSE);
    pop();
  } else if (s.type === "end-accept") {
    // Green oval
    let c = color(76, 175, 80, alpha);
    fill(c);
    stroke(dimmed ? color(180) : (hovered ? color(30) : color(56, 142, 60)));
    strokeWeight(hovered ? 2.5 : 1.5);
    if (onPath) { stroke('dodgerblue'); strokeWeight(3); }
    ellipse(x, y, bw, bh);
  } else if (s.type === "end-withhold") {
    // Orange oval
    let c = color(255, 152, 0, alpha);
    fill(c);
    stroke(dimmed ? color(180) : (hovered ? color(30) : color(230, 126, 0)));
    strokeWeight(hovered ? 2.5 : 1.5);
    if (onPath) { stroke('dodgerblue'); strokeWeight(3); }
    ellipse(x, y, bw, bh);
  }
  pop();

  // Label text
  noStroke();
  let textC = dimmed ? color(160) : color(255);
  if (s.type === "decision") {
    textC = dimmed ? color(160) : color(40);
  }
  fill(textC);
  textSize(11);
  noStroke();
  text(s.label, x, y);
}

function drawArrowhead(x, y, angle, c) {
  push();
  translate(x, y);
  rotate(angle - HALF_PI);
  let sz = 7;
  noStroke();
  fill(c);
  beginShape();
  vertex(0, 0);
  vertex(-sz/2, -sz);
  vertex(sz/2, -sz);
  endShape(CLOSE);
  pop();
}

function drawTooltip(txt, mx, my) {
  textSize(12);
  textAlign(LEFT, TOP);

  // Word wrap
  let maxW = 200;
  let words = txt.split(' ');
  let lines = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    let testLine = currentLine + ' ' + words[i];
    if (textWidth(testLine) > maxW) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  let lineH = 16;
  let padX = 8;
  let padY = 6;
  let tipW = maxW + padX * 2;
  let tipH = lines.length * lineH + padY * 2;

  // Position tooltip so it stays on screen
  let tx = mx + 12;
  let ty = my - tipH - 5;
  if (tx + tipW > width - 5) tx = mx - tipW - 12;
  if (ty < 5) ty = my + 20;
  if (tx < 5) tx = 5;

  // Background
  noStroke();
  fill(255, 255, 240, 245);
  stroke(100);
  strokeWeight(1);
  rect(tx, ty, tipW, tipH, 5);

  // Text
  noStroke();
  fill(40);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx + padX, ty + padY + i * lineH);
  }

  // Reset
  textAlign(CENTER, CENTER);
  textSize(12);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = max(380, container.offsetWidth);
  }
  if (typeof resizeCanvas === 'function' && width > 0) {
    resizeCanvas(canvasWidth, canvasHeight);
  }
}

function windowResized() {
  updateCanvasSize();
}
