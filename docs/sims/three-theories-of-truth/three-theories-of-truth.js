// Three Theories of Truth MicroSim
// CANVAS_HEIGHT: 520
// Three-column comparison of Correspondence, Coherence, and Pragmatic theories
// of truth. Dropdown selects a knowledge claim to see how each theory evaluates it.
// Previous/Next buttons step through theories one at a time.

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;

// ---- Controls ----
let claimSelect;
let prevBtn;
let nextBtn;

// ---- State ----
let currentClaim = "Water boils at 100°C";
let visibleCount = 3; // how many theories visible (1, 2, or 3)
let hoveredColumn = -1;

// ---- Theory data ----
let theoryNames = ["Correspondence", "Coherence", "Pragmatic"];

let theories = {
  "Correspondence": {
    color: "teal",
    rgb: [0, 128, 128],
    question: "Does it match reality?",
    definition: "A claim is true if it corresponds to facts in the world",
    strength: "Intuitive — matches our everyday sense of truth",
    weakness: "How do we access 'reality' independently to compare?",
    philosopher: "Aristotle, Bertrand Russell"
  },
  "Coherence": {
    color: "goldenrod",
    rgb: [218, 165, 32],
    question: "Does it fit with what we already know?",
    definition: "A claim is true if it is consistent with our existing body of beliefs",
    strength: "Works well for abstract domains (math, logic)",
    weakness: "A consistent set of beliefs could all be false",
    philosopher: "Spinoza, Hegel"
  },
  "Pragmatic": {
    color: "coral",
    rgb: [255, 127, 80],
    question: "Does it work in practice?",
    definition: "A claim is true if believing it leads to successful action and useful predictions",
    strength: "Connects truth to real-world consequences",
    weakness: "Useful beliefs aren't always true (placebo effect)",
    philosopher: "William James, John Dewey"
  }
};

let claims = {
  "Water boils at 100°C": {
    correspondence: "True — matches observed physical reality",
    coherence: "True — consistent with thermodynamics",
    pragmatic: "True — useful for cooking and engineering"
  },
  "Stealing is wrong": {
    correspondence: "Unclear — no moral facts to compare against",
    coherence: "True — consistent with most ethical systems",
    pragmatic: "True — societies that prohibit stealing function better"
  },
  "God exists": {
    correspondence: "Cannot be tested against observable reality",
    coherence: "Depends on one's existing belief system",
    pragmatic: "For many, believing produces meaning and community"
  },
  "2 + 2 = 4": {
    correspondence: "True — matches counting physical objects",
    coherence: "True — follows from arithmetic axioms",
    pragmatic: "True — essential for all quantitative reasoning"
  }
};

let claimKeys = ["correspondence", "coherence", "pragmatic"];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Claim dropdown
  claimSelect = createSelect();
  claimSelect.parent(mainElement);
  let claimNames = Object.keys(claims);
  for (let i = 0; i < claimNames.length; i++) {
    claimSelect.option(claimNames[i]);
  }
  claimSelect.selected(currentClaim);
  claimSelect.changed(() => {
    currentClaim = claimSelect.value();
  });

  // Previous button
  prevBtn = createButton('◀ Previous');
  prevBtn.parent(mainElement);
  prevBtn.mousePressed(() => {
    if (visibleCount > 1) visibleCount--;
  });

  // Next button
  nextBtn = createButton('Next ▶');
  nextBtn.parent(mainElement);
  nextBtn.mousePressed(() => {
    if (visibleCount < 3) visibleCount++;
  });

  // Style controls
  let controls = [claimSelect, prevBtn, nextBtn];
  for (let c of controls) {
    c.style('font-size', '14px');
    c.style('padding', '4px 8px');
    c.style('background', 'white');
    c.style('border', '1px solid silver');
    c.style('border-radius', '4px');
  }

  positionControls();
  textFont('Arial');
  describe('Three-column comparison of Correspondence, Coherence, and Pragmatic theories of truth with knowledge claim evaluation and step-through navigation', LABEL);
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
  fill(50);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Three Theories of Truth', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // ---- Claim display ----
  let claimData = claims[currentClaim];
  noStroke();
  fill(80);
  textSize(12);
  textAlign(CENTER, TOP);
  textStyle(ITALIC);
  text('Claim: "' + currentClaim + '"', canvasWidth / 2, 32);
  textStyle(NORMAL);

  // ---- Column layout ----
  let colStartY = 54;
  let colEndY = drawHeight - 6;
  let gap = 8;
  let totalGap = gap * (visibleCount - 1);
  let colWidth = (canvasWidth - margin * 2 - totalGap) / visibleCount;

  // Detect hover
  hoveredColumn = -1;
  if (mouseY > colStartY && mouseY < colEndY && mouseX > margin && mouseX < canvasWidth - margin) {
    for (let i = 0; i < visibleCount; i++) {
      let colX = margin + i * (colWidth + gap);
      if (mouseX >= colX && mouseX <= colX + colWidth) {
        hoveredColumn = i;
      }
    }
  }

  // ---- Draw columns ----
  for (let i = 0; i < visibleCount; i++) {
    let colX = margin + i * (colWidth + gap);
    let tName = theoryNames[i];
    let t = theories[tName];
    let evalText = claimData[claimKeys[i]];
    let isHovered = (hoveredColumn === i);

    drawTheoryColumn(colX, colStartY, colWidth, colEndY - colStartY, t, tName, evalText, isHovered);
  }

  // ---- Step indicator ----
  noStroke();
  fill(100);
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Showing ' + visibleCount + ' of 3 theories', canvasWidth / 2, drawHeight + 48);

  // Update button states visually
  if (visibleCount <= 1) {
    prevBtn.attribute('disabled', '');
  } else {
    prevBtn.removeAttribute('disabled');
  }
  if (visibleCount >= 3) {
    nextBtn.attribute('disabled', '');
  } else {
    nextBtn.removeAttribute('disabled');
  }
}

function drawTheoryColumn(x, y, w, h, theory, name, evalText, isHovered) {
  let r = theory.rgb[0];
  let g = theory.rgb[1];
  let b = theory.rgb[2];
  let headerH = 32;
  let pad = 8;
  let innerW = w - pad * 2;
  let isNarrow = w < 180;
  let labelSize = isNarrow ? 9 : 10;
  let bodySize = isNarrow ? 10 : 11;

  // Column background
  if (isHovered) {
    fill(r, g, b, 25);
  } else {
    fill(255, 255, 255, 200);
  }
  stroke(r, g, b, 100);
  strokeWeight(isHovered ? 2 : 1);
  rect(x, y, w, h, 6);

  // Header bar
  noStroke();
  fill(r, g, b);
  rect(x, y, w, headerH, 6, 6, 0, 0);

  // Theory name
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(isNarrow ? 12 : 14);
  textStyle(BOLD);
  noStroke();
  text(name, x + w / 2, y + headerH / 2);
  textStyle(NORMAL);

  // Key question
  let cy = y + headerH + 8;
  fill(r, g, b);
  textSize(labelSize);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  noStroke();
  text('KEY QUESTION', x + pad, cy);
  textStyle(NORMAL);
  cy += 14;
  fill(r, g, b);
  textSize(bodySize);
  textStyle(ITALIC);
  noStroke();
  text(theory.question, x + pad, cy, innerW, 30);
  textStyle(NORMAL);
  cy += 30;

  // Definition
  fill(80);
  textSize(labelSize);
  textStyle(BOLD);
  noStroke();
  text('DEFINITION', x + pad, cy);
  textStyle(NORMAL);
  cy += 14;
  fill(60);
  textSize(bodySize);
  noStroke();
  text(theory.definition, x + pad, cy, innerW, 44);
  cy += 44;

  // Strength
  fill(46, 139, 87);
  textSize(labelSize);
  textStyle(BOLD);
  noStroke();
  text('STRENGTH', x + pad, cy);
  textStyle(NORMAL);
  cy += 14;
  fill(60);
  textSize(bodySize);
  noStroke();
  text(theory.strength, x + pad, cy, innerW, 36);
  cy += 36;

  // Weakness
  fill(205, 60, 60);
  textSize(labelSize);
  textStyle(BOLD);
  noStroke();
  text('WEAKNESS', x + pad, cy);
  textStyle(NORMAL);
  cy += 14;
  fill(60);
  textSize(bodySize);
  noStroke();
  text(theory.weakness, x + pad, cy, innerW, 36);
  cy += 40;

  // Divider line
  stroke(r, g, b, 60);
  strokeWeight(1);
  line(x + pad, cy, x + w - pad, cy);
  cy += 8;

  // Evaluation of current claim
  noStroke();
  fill(r, g, b);
  textSize(labelSize);
  textStyle(BOLD);
  text('EVALUATION', x + pad, cy);
  textStyle(NORMAL);
  cy += 14;
  fill(40);
  textSize(bodySize);
  noStroke();
  text(evalText, x + pad, cy, innerW, 50);

  // Philosopher info on hover
  if (isHovered) {
    let philY = y + h - 26;
    noStroke();
    fill(r, g, b, 40);
    rect(x, philY, w, 26, 0, 0, 6, 6);
    fill(r, g, b);
    textSize(10);
    textAlign(CENTER, CENTER);
    textStyle(ITALIC);
    noStroke();
    text(theory.philosopher, x + w / 2, philY + 13);
    textStyle(NORMAL);
  }
}

function positionControls() {
  let btnW = 90;
  let selectW = Math.min(canvasWidth - btnW * 2 - 50, 260);
  claimSelect.position(margin, drawHeight + 14);
  claimSelect.style('max-width', selectW + 'px');

  prevBtn.position(canvasWidth - btnW * 2 - 18, drawHeight + 14);
  nextBtn.position(canvasWidth - btnW - 8, drawHeight + 14);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
