// Epistemological Frameworks 2x2 Grid Comparison MicroSim
// CANVAS_HEIGHT: 560
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = 560;
let canvasWidth;

let claimSelect;
let debateCheckbox;
let hoveredPanel = -1;

let claims = [
  "Water boils at 100°C at sea level",
  "Stealing is morally wrong",
  "Triangle angles sum to 180°",
  "Traditional medicine can treat ailments",
  "AI systems can produce knowledge"
];

let frameworkNames = ["Empiricism", "Rationalism", "Pragmatism", "Social Constructionism"];
let frameworkColors = ["steelblue", "mediumpurple", "darkorange", "seagreen"];

let frameworks = {
  "Empiricism": {
    principle: "Knowledge comes from sensory experience",
    evidence: "Observation and experiment",
    philosopher: "John Locke, David Hume",
    evaluations: {
      0: "Verified through repeated measurement — strong empirical support",
      1: "Cannot be empirically verified — this is a value judgment, not observable fact",
      2: "Can be measured but the proof is logical, not empirical",
      3: "Testable through clinical trials — mixed empirical results",
      4: "AI outputs are observable, but the 'knowing' behind them is debatable"
    }
  },
  "Rationalism": {
    principle: "Knowledge comes from reason and logic",
    evidence: "Deductive proof and logical analysis",
    philosopher: "René Descartes, Immanuel Kant",
    evaluations: {
      0: "Contingent truth — could be otherwise under different conditions",
      1: "Can be argued from first principles via ethical reasoning",
      2: "Necessarily true — provable through pure deduction from axioms",
      3: "Lacks rigorous theoretical framework — anecdotal reasoning",
      4: "AI follows logical rules but lacks understanding — not genuine knowledge"
    }
  },
  "Pragmatism": {
    principle: "Knowledge is what works in practice",
    evidence: "Practical consequences and usefulness",
    philosopher: "William James, John Dewey",
    evaluations: {
      0: "Useful knowledge — helps us cook, engineer, and survive",
      1: "Treating stealing as wrong produces a functioning society",
      2: "Useful for engineering and design — practically validated",
      3: "If it heals, it works — practical results matter more than mechanism",
      4: "If AI outputs are useful and reliable, that's pragmatically knowledge"
    }
  },
  "Social Constructionism": {
    principle: "Knowledge is shaped by social context",
    evidence: "Cultural analysis and discourse",
    philosopher: "Peter Berger, Thomas Luckmann",
    evaluations: {
      0: "The Celsius scale is a social convention — other scales exist",
      1: "Morality varies across cultures — this is socially constructed",
      2: "Mathematical systems are human constructions — other geometries exist",
      3: "What counts as 'medicine' is culturally defined",
      4: "Knowledge is a social category — whether AI 'knows' depends on our definitions"
    }
  }
};

// Debate mode data: for each claim, which pairs agree and which have tension
// Pairs: [0,1]=Emp-Rat, [0,2]=Emp-Prag, [0,3]=Emp-Soc, [1,2]=Rat-Prag, [1,3]=Rat-Soc, [2,3]=Prag-Soc
// 'agree' = green lines, 'tension' = coral lines
let debateRelations = {
  0: { agree: [[0,2]], tension: [[0,1],[1,3]] },       // Water boils
  1: { agree: [[1,2]], tension: [[0,1],[0,3],[1,3]] },  // Stealing
  2: { agree: [[0,2],[1,2]], tension: [[1,3]] },         // Triangle
  3: { agree: [[2,3]], tension: [[0,1],[1,3]] },         // Traditional medicine
  4: { agree: [[0,2]], tension: [[0,1],[1,2],[1,3]] }    // AI knowledge
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Controls row
  let controlY = drawHeight + 10;

  // Claim dropdown
  claimSelect = createSelect();
  claimSelect.parent(document.querySelector('main'));
  for (let i = 0; i < claims.length; i++) {
    claimSelect.option(claims[i], i);
  }
  claimSelect.position(10, controlY);
  claimSelect.style('font-size', '14px');
  claimSelect.style('padding', '4px 8px');
  claimSelect.style('background-color', 'white');
  claimSelect.style('max-width', (canvasWidth * 0.65) + 'px');

  // Debate Mode checkbox
  debateCheckbox = createCheckbox('Debate Mode', false);
  debateCheckbox.parent(document.querySelector('main'));
  debateCheckbox.position(canvasWidth - 140, controlY);
  debateCheckbox.style('font-size', '14px');
  debateCheckbox.style('background-color', 'white');
  debateCheckbox.style('padding', '4px 8px');
  debateCheckbox.style('border-radius', '4px');

  describe('A 2x2 grid comparing four epistemological frameworks evaluating the same knowledge claim.');
}

function draw() {
  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let claimIndex = int(claimSelect.value());
  let debateMode = debateCheckbox.checked();
  let margin = 10;
  let gap = 8;
  let titleBarHeight = 36;

  // Title
  noStroke();
  fill(30);
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Epistemological Frameworks Comparison', canvasWidth / 2, margin);

  // Claim display
  textSize(13);
  textStyle(ITALIC);
  fill(60);
  text('Claim: "' + claims[claimIndex] + '"', canvasWidth / 2, margin + 22);

  let gridTop = margin + 46;
  let gridWidth = canvasWidth - margin * 2;
  let gridHeight = drawHeight - gridTop - margin;
  let panelW = (gridWidth - gap) / 2;
  let panelH = (gridHeight - gap) / 2;

  // Determine hovered panel
  hoveredPanel = -1;
  let positions = [];
  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let px = margin + col * (panelW + gap);
    let py = gridTop + row * (panelH + gap);
    positions.push({ x: px, y: py, w: panelW, h: panelH });
    if (mouseX >= px && mouseX <= px + panelW && mouseY >= py && mouseY <= py + panelH) {
      hoveredPanel = i;
    }
  }

  // Draw panels
  for (let i = 0; i < 4; i++) {
    let p = positions[i];
    let fname = frameworkNames[i];
    let fc = frameworkColors[i];
    let fw = frameworks[fname];
    let isHovered = (hoveredPanel === i);

    // Panel background
    noStroke();
    if (isHovered) {
      fill(255, 255, 240);
    } else {
      fill(255);
    }
    rect(p.x, p.y, p.w, p.h, 8);

    // Panel border
    stroke(fc);
    strokeWeight(isHovered ? 3 : 2);
    noFill();
    rect(p.x, p.y, p.w, p.h, 8);

    // Title bar
    noStroke();
    let c = color(fc);
    c.setAlpha(isHovered ? 240 : 200);
    fill(c);
    rect(p.x, p.y, p.w, titleBarHeight, 8, 8, 0, 0);

    // Framework name
    noStroke();
    fill(255);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(fname, p.x + p.w / 2, p.y + titleBarHeight / 2);

    // Content area
    let contentX = p.x + 8;
    let contentY = p.y + titleBarHeight + 6;
    let contentW = p.w - 16;
    textAlign(LEFT, TOP);
    textStyle(NORMAL);

    if (isHovered) {
      // Expanded view with more detail
      noStroke();
      fill(80);
      textSize(11);
      textStyle(BOLD);
      text('Principle:', contentX, contentY);
      textStyle(NORMAL);
      fill(50);
      text(fw.principle, contentX + 60, contentY, contentW - 60, 30);

      contentY += 28;
      fill(80);
      textStyle(BOLD);
      text('Evidence:', contentX, contentY);
      textStyle(NORMAL);
      fill(50);
      text(fw.evidence, contentX + 60, contentY, contentW - 60, 30);

      contentY += 28;
      fill(80);
      textStyle(BOLD);
      text('Thinkers:', contentX, contentY);
      textStyle(NORMAL);
      fill(50);
      text(fw.philosopher, contentX + 60, contentY, contentW - 60, 30);

      contentY += 30;
      // Divider
      stroke(fc);
      strokeWeight(1);
      line(contentX, contentY, contentX + contentW, contentY);
      contentY += 6;

      // Evaluation
      noStroke();
      fill(fc);
      textSize(11);
      textStyle(BOLD);
      text('Evaluation:', contentX, contentY);
      contentY += 16;
      textStyle(NORMAL);
      fill(40);
      textSize(11);
      text(fw.evaluations[claimIndex], contentX, contentY, contentW, panelH - (contentY - p.y) - 8);
    } else {
      // Compact view
      noStroke();
      fill(90);
      textSize(10);
      textStyle(ITALIC);
      text(fw.principle, contentX, contentY, contentW, 28);
      contentY += 26;

      fill(110);
      textSize(9);
      textStyle(NORMAL);
      text('Evidence: ' + fw.evidence, contentX, contentY, contentW, 24);
      contentY += 20;

      fill(110);
      text('Philosophers: ' + fw.philosopher, contentX, contentY, contentW, 24);
      contentY += 24;

      // Divider
      stroke(200);
      strokeWeight(0.5);
      line(contentX, contentY, contentX + contentW, contentY);
      contentY += 6;

      // Evaluation
      noStroke();
      fill(fc);
      textSize(10);
      textStyle(BOLD);
      text('Evaluation:', contentX, contentY);
      contentY += 14;
      textStyle(NORMAL);
      fill(50);
      textSize(10);
      text(fw.evaluations[claimIndex], contentX, contentY, contentW, panelH - (contentY - p.y) - 8);
    }
  }

  // Debate mode: draw lines between panels
  if (debateMode) {
    let relations = debateRelations[claimIndex];
    if (relations) {
      // Draw agreement lines (green)
      for (let pair of relations.agree) {
        drawDebateLine(positions, pair[0], pair[1], color(60, 180, 80, 180), 'agree');
      }
      // Draw tension lines (coral)
      for (let pair of relations.tension) {
        drawDebateLine(positions, pair[0], pair[1], color(240, 100, 80, 180), 'tension');
      }

      // Legend
      noStroke();
      fill(255, 255, 255, 220);
      rect(canvasWidth - 170, drawHeight - 40, 160, 34, 6);
      stroke(60, 180, 80);
      strokeWeight(3);
      line(canvasWidth - 160, drawHeight - 28, canvasWidth - 135, drawHeight - 28);
      noStroke();
      fill(60);
      textSize(10);
      textAlign(LEFT, CENTER);
      textStyle(NORMAL);
      text('Agreement', canvasWidth - 130, drawHeight - 28);

      stroke(240, 100, 80);
      strokeWeight(3);
      let dashX = canvasWidth - 160;
      let dashY = drawHeight - 14;
      for (let d = 0; d < 25; d += 8) {
        line(dashX + d, dashY, dashX + d + 5, dashY);
      }
      noStroke();
      fill(60);
      text('Tension', canvasWidth - 130, dashY);
    }
  }

  // Hover hint
  if (hoveredPanel === -1) {
    noStroke();
    fill(150);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    textStyle(ITALIC);
    text('Hover over a panel for expanded details', canvasWidth / 2, drawHeight - 4);
  }
}

function drawDebateLine(positions, i, j, c, type) {
  let pi = positions[i];
  let pj = positions[j];
  let cx1 = pi.x + pi.w / 2;
  let cy1 = pi.y + pi.h / 2;
  let cx2 = pj.x + pj.w / 2;
  let cy2 = pj.y + pj.h / 2;

  // Adjust endpoints to panel edges
  let pts = clipLineToRects(cx1, cy1, cx2, cy2, pi, pj);

  stroke(c);
  strokeWeight(3);
  if (type === 'tension') {
    // Dashed line for tension
    drawDashedLine(pts.x1, pts.y1, pts.x2, pts.y2, 8);
  } else {
    line(pts.x1, pts.y1, pts.x2, pts.y2);
  }

  // Small circle at midpoint
  let mx = (pts.x1 + pts.x2) / 2;
  let my = (pts.y1 + pts.y2) / 2;
  noStroke();
  fill(c);
  ellipse(mx, my, 8, 8);
}

function clipLineToRects(x1, y1, x2, y2, r1, r2) {
  // Clip line from center of r1 to center of r2 at rectangle edges
  let p1 = clipToRect(x1, y1, x2, y2, r1);
  let p2 = clipToRect(x2, y2, x1, y1, r2);
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

function clipToRect(fromX, fromY, toX, toY, r) {
  let dx = toX - fromX;
  let dy = toY - fromY;
  let tMin = 1;

  // Check all four edges
  if (dx !== 0) {
    let tLeft = (r.x - fromX) / dx;
    let tRight = (r.x + r.w - fromX) / dx;
    if (tLeft > 0 && tLeft < tMin) {
      let yy = fromY + tLeft * dy;
      if (yy >= r.y && yy <= r.y + r.h) tMin = tLeft;
    }
    if (tRight > 0 && tRight < tMin) {
      let yy = fromY + tRight * dy;
      if (yy >= r.y && yy <= r.y + r.h) tMin = tRight;
    }
  }
  if (dy !== 0) {
    let tTop = (r.y - fromY) / dy;
    let tBottom = (r.y + r.h - fromY) / dy;
    if (tTop > 0 && tTop < tMin) {
      let xx = fromX + tTop * dx;
      if (xx >= r.x && xx <= r.x + r.w) tMin = tTop;
    }
    if (tBottom > 0 && tBottom < tMin) {
      let xx = fromX + tBottom * dx;
      if (xx >= r.x && xx <= r.x + r.w) tMin = tBottom;
    }
  }
  return { x: fromX + tMin * dx, y: fromY + tMin * dy };
}

function drawDashedLine(x1, y1, x2, y2, dashLen) {
  let d = dist(x1, y1, x2, y2);
  let steps = floor(d / dashLen);
  for (let i = 0; i < steps; i += 2) {
    let t1 = i / steps;
    let t2 = min((i + 1) / steps, 1);
    line(
      lerp(x1, x2, t1), lerp(y1, y2, t1),
      lerp(x1, x2, t2), lerp(y1, y2, t2)
    );
  }
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  canvasWidth = mainEl ? mainEl.offsetWidth : 800;
  if (canvasWidth < 400) canvasWidth = 400;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition controls
  claimSelect.position(10, drawHeight + 10);
  claimSelect.style('max-width', (canvasWidth * 0.65) + 'px');
  debateCheckbox.position(canvasWidth - 140, drawHeight + 10);
}
