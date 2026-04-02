// Evidence Strength Hierarchy - Interactive pyramid showing how contextual factors reorder evidence types
// CANVAS_HEIGHT: 560

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let sampleSizeSlider, replicationSlider, expertiseSlider;
let resetButton;

// State
let selectedTier = -1;
let hoveredTier = -1;
let tooltipX = 0;
let tooltipY = 0;

// Tier data
let tiers = [
  {
    name: "Anecdotal",
    baseScore: 20,
    color: "lightcoral",
    desc: "Personal stories and individual experiences. Vivid but unreliable for generalizing.",
    example: "\"My grandmother smoked and lived to 95.\"",
    factors: { sampleSize: 0.5, replications: 0, expertise: 0.2 }
  },
  {
    name: "Testimonial",
    baseScore: 40,
    color: "sandybrown",
    desc: "Reports from witnesses or authorities. Depends heavily on the source's expertise and independence.",
    example: "\"A Nobel laureate says dark matter exists.\"",
    factors: { sampleSize: 0.2, replications: 0.1, expertise: 2.0 }
  },
  {
    name: "Statistical",
    baseScore: 60,
    color: "steelblue",
    desc: "Data from surveys, studies, or measurements. Strength depends on sample size and methodology.",
    example: "\"A study of 10,000 patients found the drug effective.\"",
    factors: { sampleSize: 2.0, replications: 0.5, expertise: 0.3 }
  },
  {
    name: "Empirical (Replicated)",
    baseScore: 80,
    color: "seagreen",
    desc: "Experimental evidence independently reproduced. The gold standard of scientific evidence.",
    example: "\"The Higgs boson was confirmed by two independent experiments at CERN.\"",
    factors: { sampleSize: 0.5, replications: 2.0, expertise: 0.5 }
  }
];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Row 1: Sample Size slider
  let sliderX = 160;
  sampleSizeSlider = createSlider(1, 100, 1, 1);
  sampleSizeSlider.parent(document.querySelector('main'));
  sampleSizeSlider.style('width', '200px');

  // Row 2: Replications slider
  replicationSlider = createSlider(0, 10, 0, 1);
  replicationSlider.parent(document.querySelector('main'));
  replicationSlider.style('width', '200px');

  // Row 3: Source Expertise slider
  expertiseSlider = createSlider(1, 10, 1, 1);
  expertiseSlider.parent(document.querySelector('main'));
  expertiseSlider.style('width', '200px');

  // Row 4: Reset button
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSliders);

  describe('Interactive evidence strength pyramid with four tiers that reorder based on contextual factor sliders.');
}

function resetSliders() {
  sampleSizeSlider.value(1);
  replicationSlider.value(0);
  expertiseSlider.value(1);
  selectedTier = -1;
}

function computeScores() {
  let sampleVal = map(sampleSizeSlider.value(), 1, 100, 0, 10);
  let repVal = replicationSlider.value();
  let expVal = expertiseSlider.value();

  let scored = [];
  for (let i = 0; i < tiers.length; i++) {
    let t = tiers[i];
    let score = t.baseScore +
      sampleVal * t.factors.sampleSize +
      repVal * t.factors.replications +
      expVal * t.factors.expertise;
    scored.push({ index: i, score: score });
  }
  // Sort ascending so lowest score is at bottom of pyramid
  scored.sort((a, b) => a.score - b.score);
  return scored;
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, width, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, width, drawHeight);
  noStroke();

  // Title
  fill('black');
  textSize(18);
  textAlign(CENTER, TOP);
  noStroke();
  text('Evidence Strength Hierarchy', width / 2, 8);

  // Compute sorted tiers
  let scored = computeScores();

  // Pyramid dimensions
  let pyrTop = 42;
  let pyrBottom = drawHeight - 20;
  let pyrHeight = pyrBottom - pyrTop;
  let tierH = pyrHeight / 4;
  let pyrCenterX = selectedTier >= 0 ? width * 0.35 : width / 2;
  let maxHalfWidth = min(width * 0.3, 200);
  let minHalfWidth = 40;

  hoveredTier = -1;

  // Draw tiers from bottom (index 0 = weakest) to top (index 3 = strongest)
  for (let rank = 0; rank < 4; rank++) {
    let tierIdx = scored[rank].index;
    let tierScore = scored[rank].score;
    let t = tiers[tierIdx];

    // Bottom tier is rank 0 (widest), top tier is rank 3 (narrowest)
    let yTop = pyrBottom - (rank + 1) * tierH;
    let yBot = pyrBottom - rank * tierH;

    // Trapezoid widths: bottom of this tier and top of this tier
    let botFrac = 1 - rank / 4;
    let topFrac = 1 - (rank + 1) / 4;
    let botHalf = lerp(minHalfWidth, maxHalfWidth, botFrac);
    let topHalf = lerp(minHalfWidth, maxHalfWidth, topFrac);

    // Check hover
    let isHovered = false;
    if (mouseY >= yTop && mouseY <= yBot && mouseX > 0 && mouseX < width) {
      let frac = (mouseY - yTop) / (yBot - yTop);
      let halfAtMouse = lerp(topHalf, botHalf, frac);
      if (abs(mouseX - pyrCenterX) <= halfAtMouse) {
        isHovered = true;
        hoveredTier = tierIdx;
        tooltipX = mouseX;
        tooltipY = mouseY;
      }
    }

    // Draw trapezoid
    fill(t.color);
    if (selectedTier === tierIdx) {
      stroke('gold');
      strokeWeight(3);
    } else if (isHovered) {
      stroke(80);
      strokeWeight(2);
    } else {
      noStroke();
    }

    beginShape();
    vertex(pyrCenterX - botHalf, yBot);
    vertex(pyrCenterX + botHalf, yBot);
    vertex(pyrCenterX + topHalf, yTop);
    vertex(pyrCenterX - topHalf, yTop);
    endShape(CLOSE);
    noStroke();

    // Tier label and score
    let midY = (yTop + yBot) / 2;
    fill('white');
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    text(t.name, pyrCenterX, midY - 9);
    textSize(11);
    text('Score: ' + nf(tierScore, 0, 1), pyrCenterX, midY + 10);
  }

  // Rank labels on left
  fill(100);
  textSize(10);
  textAlign(RIGHT, CENTER);
  noStroke();
  for (let rank = 0; rank < 4; rank++) {
    let yMid = pyrBottom - rank * tierH - tierH / 2;
    let label = rank === 3 ? 'Strongest' : rank === 0 ? 'Weakest' : '#' + (rank + 1);
    text(label, pyrCenterX - maxHalfWidth - 8, yMid);
  }

  // Description panel for selected tier
  if (selectedTier >= 0) {
    let t = tiers[selectedTier];
    let panelX = width * 0.62;
    let panelY = pyrTop + 10;
    let panelW = width * 0.34;
    let panelH = pyrHeight - 30;

    fill(255, 255, 255, 230);
    stroke(200);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 8);
    noStroke();

    // Title
    fill(t.color);
    textSize(15);
    textAlign(LEFT, TOP);
    noStroke();
    text(t.name, panelX + 10, panelY + 10);

    // Score
    let tierScore = 0;
    let scored2 = computeScores();
    for (let s of scored2) {
      if (s.index === selectedTier) tierScore = s.score;
    }
    fill(80);
    textSize(12);
    text('Score: ' + nf(tierScore, 0, 1), panelX + 10, panelY + 32);

    // Description - word wrap
    fill(50);
    textSize(12);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(t.desc, panelX + 10, panelY + 52, panelW - 20);

    // Example
    fill(100);
    textSize(11);
    textStyle(ITALIC);
    text(t.example, panelX + 10, panelY + 120, panelW - 20);
    textStyle(NORMAL);

    // Factor sensitivities
    fill(80);
    textSize(11);
    textStyle(BOLD);
    text('Factor Sensitivity:', panelX + 10, panelY + 175);
    textStyle(NORMAL);
    textSize(10);
    text('Sample Size: ' + t.factors.sampleSize + 'x', panelX + 10, panelY + 195);
    text('Replications: ' + t.factors.replications + 'x', panelX + 10, panelY + 212);
    text('Expertise: ' + t.factors.expertise + 'x', panelX + 10, panelY + 229);
  }

  // Hover tooltip with example
  if (hoveredTier >= 0 && hoveredTier !== selectedTier) {
    let t = tiers[hoveredTier];
    let tw = textWidth(t.example) + 20;
    tw = min(tw, 280);
    let th = 50;
    let tx = tooltipX + 15;
    let ty = tooltipY - 30;

    // Keep tooltip on screen
    if (tx + tw > width) tx = tooltipX - tw - 10;
    if (ty < 0) ty = tooltipY + 15;

    fill(50, 50, 50, 220);
    noStroke();
    rect(tx, ty, tw, th, 5);

    fill('white');
    textSize(10);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    noStroke();
    text(t.example, tx + 8, ty + 6, tw - 16);
  }

  // Control area labels and slider positioning
  let controlY = drawHeight + 12;
  let rowH = 32;
  let labelX = 12;
  let sliderVisualX = 160;

  fill(50);
  textSize(13);
  textAlign(LEFT, CENTER);
  noStroke();

  // Row 1: Sample Size
  text('Sample Size: ' + sampleSizeSlider.value(), labelX, controlY + rowH * 0 + 10);
  sampleSizeSlider.position(
    sampleSizeSlider.parent().getBoundingClientRect ? sliderVisualX : sliderVisualX,
    controlY + rowH * 0
  );
  positionSlider(sampleSizeSlider, sliderVisualX, controlY + rowH * 0);

  // Row 2: Replications
  text('Replications: ' + replicationSlider.value(), labelX, controlY + rowH * 1 + 10);
  positionSlider(replicationSlider, sliderVisualX, controlY + rowH * 1);

  // Row 3: Source Expertise
  text('Source Expertise: ' + expertiseSlider.value(), labelX, controlY + rowH * 2 + 10);
  positionSlider(expertiseSlider, sliderVisualX, controlY + rowH * 2);

  // Row 4: Reset button
  positionControl(resetButton, labelX, controlY + rowH * 3 + 2);

  // Instruction text
  fill(140);
  textSize(10);
  textAlign(RIGHT, CENTER);
  noStroke();
  text('Click a tier to see details', width - 10, controlY + rowH * 3 + 12);
}

function positionSlider(slider, x, y) {
  let mainEl = document.querySelector('main');
  let canvasEl = mainEl.querySelector('canvas');
  if (canvasEl) {
    let rect = canvasEl.getBoundingClientRect();
    let scaleX = rect.width / width;
    slider.position(rect.left + x * scaleX, rect.top + y * scaleX);
    let sliderW = min(200, (width - x - 20) * scaleX);
    slider.style('width', sliderW + 'px');
  }
}

function positionControl(ctrl, x, y) {
  let mainEl = document.querySelector('main');
  let canvasEl = mainEl.querySelector('canvas');
  if (canvasEl) {
    let rect = canvasEl.getBoundingClientRect();
    let scaleX = rect.width / width;
    ctrl.position(rect.left + x * scaleX, rect.top + y * scaleX);
  }
}

function mousePressed() {
  if (mouseY < drawHeight && hoveredTier >= 0) {
    if (selectedTier === hoveredTier) {
      selectedTier = -1; // Deselect
    } else {
      selectedTier = hoveredTier;
    }
  }
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.getBoundingClientRect().width;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(360, min(containerWidth - 20, 700));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
