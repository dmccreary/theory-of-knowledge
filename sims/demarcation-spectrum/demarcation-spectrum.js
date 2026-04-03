// Demarcation Spectrum MicroSim - Drag claims along a science-to-pseudoscience spectrum
// CANVAS_HEIGHT: 560

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let checkButton;
let resetButton;

// State
let cards = [];
let draggingCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let answersRevealed = false;
let selectedCard = null;
let score = null;

// Spectrum geometry
let spectrumLeft, spectrumRight, spectrumY, spectrumH;

// Card geometry
let cardW = 130;
let cardH = 32;
let stackStartX, stackStartY;

// Claims data
let claims = [
  {name: "General Relativity", expert: 5, criteria: {falsifiable:true, peerReview:true, replication:true, selfCorrection:true, consistency:true}},
  {name: "Evolution", expert: 8, criteria: {falsifiable:true, peerReview:true, replication:true, selfCorrection:true, consistency:true}},
  {name: "String Theory", expert: 25, criteria: {falsifiable:false, peerReview:true, replication:false, selfCorrection:true, consistency:true}},
  {name: "Acupuncture", expert: 55, criteria: {falsifiable:true, peerReview:true, replication:false, selfCorrection:false, consistency:false}},
  {name: "Evol. Psychology", expert: 40, criteria: {falsifiable:true, peerReview:true, replication:false, selfCorrection:true, consistency:false}},
  {name: "Climate Science", expert: 10, criteria: {falsifiable:true, peerReview:true, replication:true, selfCorrection:true, consistency:true}},
  {name: "Homeopathy", expert: 85, criteria: {falsifiable:true, peerReview:false, replication:false, selfCorrection:false, consistency:false}},
  {name: "Astrology", expert: 90, criteria: {falsifiable:true, peerReview:false, replication:false, selfCorrection:false, consistency:false}}
];

let criteriaLabels = {
  falsifiable: "Falsifiable",
  peerReview: "Peer Reviewed",
  replication: "Replicable",
  selfCorrection: "Self-Correcting",
  consistency: "Consistent Theory"
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Controls row
  checkButton = createButton('Check Answers');
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkAnswers);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSim);

  initCards();
  describe('A draggable spectrum where students classify claims from well-established science to pseudoscience');
}

function initCards() {
  cards = [];
  answersRevealed = false;
  selectedCard = null;
  score = null;

  // Stack cards below the spectrum in two columns
  stackStartX = margin + 10;
  stackStartY = spectrumY + spectrumH + 70;

  for (let i = 0; i < claims.length; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    cards.push({
      claim: claims[i],
      x: stackStartX + col * (cardW + 16),
      y: stackStartY + row * (cardH + 10),
      placed: false, // whether it's been dragged onto the spectrum
      spectrumPct: null // 0-100 position on spectrum
    });
  }
}

function updateLayout() {
  spectrumLeft = margin + 10;
  spectrumRight = canvasWidth - margin - 10;
  spectrumY = 60;
  spectrumH = 40;
  stackStartX = margin + 10;
  stackStartY = spectrumY + spectrumH + 70;
}

function draw() {
  updateLayout();

  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();

  // Title
  fill(40);
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  noStroke();
  text("Demarcation Spectrum", canvasWidth / 2, 10);
  textSize(12);
  textStyle(NORMAL);
  fill(100);
  text("Drag cards onto the spectrum, then click a card for details", canvasWidth / 2, 32);

  drawSpectrum();
  drawCards();
  drawChecklist();
  drawScoreInControls();

  if (answersRevealed) {
    drawExpertPositions();
  }
}

function drawSpectrum() {
  // Gradient bar: teal -> amber -> coral
  let sw = spectrumRight - spectrumLeft;
  for (let i = 0; i < sw; i++) {
    let t = i / sw;
    let c;
    if (t < 0.5) {
      c = lerpColor(color('teal'), color('goldenrod'), t * 2);
    } else {
      c = lerpColor(color('goldenrod'), color('coral'), (t - 0.5) * 2);
    }
    stroke(c);
    strokeWeight(1);
    line(spectrumLeft + i, spectrumY, spectrumLeft + i, spectrumY + spectrumH);
  }

  // Border
  noFill();
  stroke(120);
  strokeWeight(1);
  rect(spectrumLeft, spectrumY, sw, spectrumH, 4);
  noStroke();

  // Zone labels below spectrum
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  fill('teal');
  noStroke();
  text("Well-established\nScience", spectrumLeft, spectrumY + spectrumH + 4);

  textAlign(CENTER, TOP);
  fill('goldenrod');
  text("Grey Zone", spectrumLeft + sw / 2, spectrumY + spectrumH + 4);

  textAlign(RIGHT, TOP);
  fill('coral');
  text("Pseudoscience", spectrumRight, spectrumY + spectrumH + 4);
  textStyle(NORMAL);

  // Tick marks
  stroke(80);
  strokeWeight(1);
  for (let p = 0; p <= 100; p += 25) {
    let x = map(p, 0, 100, spectrumLeft, spectrumRight);
    line(x, spectrumY + spectrumH, x, spectrumY + spectrumH + 3);
  }
  noStroke();
}

function drawCards() {
  textSize(11);
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let isSelected = (selectedCard === i);
    let isDragging = (draggingCard === i);

    // Card shadow
    noStroke();
    fill(0, 0, 0, 30);
    rect(card.x + 2, card.y + 2, cardW, cardH, 6);

    // Card background
    if (isSelected) {
      fill(220, 235, 255);
      stroke('steelblue');
      strokeWeight(2);
    } else if (isDragging) {
      fill(255, 255, 220);
      stroke('goldenrod');
      strokeWeight(2);
    } else if (card.placed) {
      fill(245, 250, 255);
      stroke(150);
      strokeWeight(1);
    } else {
      fill(255);
      stroke(180);
      strokeWeight(1);
    }
    rect(card.x, card.y, cardW, cardH, 6);
    noStroke();

    // Card text
    fill(40);
    textAlign(CENTER, CENTER);
    noStroke();
    text(card.claim.name, card.x + cardW / 2, card.y + cardH / 2);

    // If answers revealed and card is placed, draw comparison line
    if (answersRevealed && card.placed) {
      let expertX = map(card.claim.expert, 0, 100, spectrumLeft, spectrumRight);
      let studentX = map(card.spectrumPct, 0, 100, spectrumLeft, spectrumRight);
      let diff = abs(card.spectrumPct - card.claim.expert);
      let lineColor;
      if (diff <= 10) lineColor = color('green');
      else if (diff <= 25) lineColor = color('goldenrod');
      else lineColor = color('coral');

      stroke(lineColor);
      strokeWeight(1.5);
      drawingContext.setLineDash([4, 4]);
      line(studentX, spectrumY + spectrumH / 2, expertX, spectrumY + spectrumH / 2);
      drawingContext.setLineDash([]);
      noStroke();
    }
  }
}

function drawExpertPositions() {
  // Draw expert position triangles on the spectrum
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let expertX = map(card.claim.expert, 0, 100, spectrumLeft, spectrumRight);
    let ty = spectrumY - 2;

    // Small downward triangle
    fill(40);
    noStroke();
    triangle(expertX - 5, ty - 10, expertX + 5, ty - 10, expertX, ty);

    // Tiny label
    textSize(8);
    textAlign(CENTER, BOTTOM);
    noStroke();
    fill(40);
    // Alternate label above/below to reduce overlap
    let labelY = ty - 12;
    text(card.claim.name, expertX, labelY);
  }
}

function drawChecklist() {
  if (selectedCard === null) return;

  let card = cards[selectedCard];
  let criteria = card.claim.criteria;

  // Panel position
  let panelW = 180;
  let panelH = 140;
  let panelX = canvasWidth - panelW - margin;
  let panelY = drawHeight - panelH - 20;

  // Panel background
  noStroke();
  fill(0, 0, 0, 25);
  rect(panelX + 3, panelY + 3, panelW, panelH, 8);
  fill(255);
  stroke(150);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);
  noStroke();

  // Title
  fill(40);
  textAlign(CENTER, TOP);
  textSize(12);
  textStyle(BOLD);
  noStroke();
  text(card.claim.name, panelX + panelW / 2, panelY + 8);
  textStyle(NORMAL);

  // Criteria list
  textSize(11);
  textAlign(LEFT, TOP);
  let y = panelY + 30;
  let keys = Object.keys(criteria);
  for (let k of keys) {
    let label = criteriaLabels[k];
    let val = criteria[k];
    let icon = val ? "\u2705" : "\u274C";
    noStroke();
    fill(40);
    text(icon + " " + label, panelX + 12, y);
    y += 20;
  }
}

function drawScoreInControls() {
  // Score display in control area
  textAlign(LEFT, CENTER);
  textSize(13);
  noStroke();
  if (score !== null) {
    fill(40);
    text("Score: " + score + " / 100", margin + 10, drawHeight + controlHeight / 2);
    textSize(10);
    fill(100);
    text("(lower distance = better)", margin + 130, drawHeight + controlHeight / 2);
  } else {
    fill(140);
    text("Place all cards, then check answers", margin + 10, drawHeight + controlHeight / 2);
  }
}

function checkAnswers() {
  // Check if all cards are placed
  let allPlaced = cards.every(c => c.placed);
  if (!allPlaced) {
    // Flash a message - just reveal anyway with partial
  }
  answersRevealed = true;

  // Calculate score: average distance from expert
  let totalDist = 0;
  let count = 0;
  for (let card of cards) {
    if (card.placed) {
      totalDist += abs(card.spectrumPct - card.claim.expert);
      count++;
    }
  }
  if (count > 0) {
    let avgDist = totalDist / count;
    score = round(max(0, 100 - avgDist * 1.5));
  } else {
    score = 0;
  }
}

function resetSim() {
  initCards();
}

function mousePressed() {
  if (mouseY > drawHeight) return; // in control area

  // Check if clicking on a placed card (for checklist)
  for (let i = cards.length - 1; i >= 0; i--) {
    let card = cards[i];
    if (mouseX >= card.x && mouseX <= card.x + cardW &&
        mouseY >= card.y && mouseY <= card.y + cardH) {
      // Start dragging
      draggingCard = i;
      dragOffsetX = mouseX - card.x;
      dragOffsetY = mouseY - card.y;

      // Also select for checklist
      if (selectedCard === i) {
        selectedCard = null;
      } else {
        selectedCard = i;
      }
      return;
    }
  }

  // Clicked empty space - deselect
  selectedCard = null;
}

function mouseDragged() {
  if (draggingCard === null) return;

  let card = cards[draggingCard];
  card.x = mouseX - dragOffsetX;
  card.y = mouseY - dragOffsetY;

  // Constrain to canvas
  card.x = constrain(card.x, 0, canvasWidth - cardW);
  card.y = constrain(card.y, 0, drawHeight - cardH);
}

function mouseReleased() {
  if (draggingCard === null) return;

  let card = cards[draggingCard];

  // Check if card is near spectrum (within snap range)
  let spectrumCenterY = spectrumY + spectrumH / 2;
  let cardCenterY = card.y + cardH / 2;
  let cardCenterX = card.x + cardW / 2;

  if (abs(cardCenterY - spectrumCenterY) < 50 &&
      cardCenterX >= spectrumLeft && cardCenterX <= spectrumRight) {
    // Snap to spectrum
    card.y = spectrumY + spectrumH + 30 - cardH / 2;
    // Clamp x so card stays within spectrum bounds
    card.x = constrain(card.x, spectrumLeft - cardW / 4, spectrumRight - cardW * 3 / 4);
    card.placed = true;
    card.spectrumPct = map(card.x + cardW / 2, spectrumLeft, spectrumRight, 0, 100);
    card.spectrumPct = constrain(card.spectrumPct, 0, 100);
  } else if (cardCenterY > spectrumY + spectrumH + 60) {
    // Dropped back to stack area - unplace
    card.placed = false;
    card.spectrumPct = null;
  }

  draggingCard = null;
}

// Touch support
function touchStarted() {
  if (touches.length > 0) {
    let t = touches[0];
    // Simulate mousePressed
    for (let i = cards.length - 1; i >= 0; i--) {
      let card = cards[i];
      if (t.x >= card.x && t.x <= card.x + cardW &&
          t.y >= card.y && t.y <= card.y + cardH) {
        draggingCard = i;
        dragOffsetX = t.x - card.x;
        dragOffsetY = t.y - card.y;
        if (selectedCard === i) {
          selectedCard = null;
        } else {
          selectedCard = i;
        }
        return false;
      }
    }
    selectedCard = null;
  }
  return false;
}

function touchMoved() {
  if (draggingCard !== null && touches.length > 0) {
    let t = touches[0];
    let card = cards[draggingCard];
    card.x = t.x - dragOffsetX;
    card.y = t.y - dragOffsetY;
    card.x = constrain(card.x, 0, canvasWidth - cardW);
    card.y = constrain(card.y, 0, drawHeight - cardH);
  }
  return false;
}

function touchEnded() {
  if (draggingCard !== null) {
    mouseReleased();
  }
  return false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  // Reinit card positions only for unplaced cards
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].placed) {
      let col = i % 2;
      let row = floor(i / 2);
      cards[i].x = stackStartX + col * (cardW + 16);
      cards[i].y = stackStartY + row * (cardH + 10);
    } else {
      // Recalculate placed card positions based on spectrum percent
      cards[i].x = map(cards[i].spectrumPct, 0, 100, spectrumLeft, spectrumRight) - cardW / 2;
      cards[i].y = spectrumY + spectrumH + 30 - cardH / 2;
    }
  }
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    containerWidth = container.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(360, min(containerWidth, 900));
  updateLayout();
}
