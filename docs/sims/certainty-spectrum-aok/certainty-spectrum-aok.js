// Certainty Spectrum AOK MicroSim
// CANVAS_HEIGHT: 550
// Draggable spectrum where students position Areas of Knowledge by certainty level.
// Bloom's Level 5: Evaluate. Show Expert View and Compare modes.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 480;
let controlHeight = 70;
let canvasHeight = 550;
let margin = 25;
let defaultTextSize = 16;

// Controls
let expertBtn, compareBtn, resetBtn;

// State
let showExpert = false;
let showCompare = false;
let selectedCard = -1;
let draggingCard = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Spectrum geometry
let spectrumX, spectrumY, spectrumW, spectrumH;
let cardStartY;
let cardW = 80;
let cardH = 32;

// AOK data
let aoks = [
  {name: "Mathematics", expert: 95, justification: "Deductive proofs from axioms provide the highest certainty in formal systems, though Gödel showed limits."},
  {name: "Natural Sciences", expert: 75, justification: "Strong empirical support but always provisional — theories can be falsified by new evidence."},
  {name: "Human Sciences", expert: 50, justification: "Cultural variables, observer effects, and ethical constraints limit certainty."},
  {name: "History", expert: 45, justification: "Dependent on surviving sources, interpretation, and perspective. No direct observation possible."},
  {name: "The Arts", expert: 25, justification: "Aesthetic judgments are deeply subjective and culturally situated."},
  {name: "Ethics", expert: 30, justification: "Moral claims lack empirical verification. Competing frameworks yield different conclusions."},
  {name: "Indigenous Knowledge", expert: 40, justification: "Rich empirical basis validated over generations, but criteria of certainty differ from Western frameworks."},
  {name: "Religious Knowledge", expert: 20, justification: "Based on faith and revelation, which resist empirical testing."}
];

// Card state: each card has x, y, placed (boolean), studentPercent
let cards = [];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Spectrum bar dimensions
  spectrumX = margin;
  spectrumY = 50;
  spectrumW = canvasWidth - 2 * margin;
  spectrumH = 36;

  // Initialize card positions in two rows below spectrum
  cardStartY = spectrumY + spectrumH + 70;
  initCards();

  // Controls
  let yRow1 = drawHeight + 8;
  let yRow2 = drawHeight + 38;

  expertBtn = createButton('Show Expert View');
  expertBtn.parent(document.querySelector('main'));
  expertBtn.mousePressed(toggleExpert);
  expertBtn.position(10, yRow1);
  expertBtn.style('font-size', '12px');

  compareBtn = createButton('Compare');
  compareBtn.parent(document.querySelector('main'));
  compareBtn.mousePressed(toggleCompare);
  compareBtn.position(140, yRow1);
  compareBtn.style('font-size', '12px');

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetAll);
  resetBtn.position(10, yRow2);
  resetBtn.style('font-size', '12px');

  describe('A draggable spectrum where students position Areas of Knowledge by certainty level from least certain to most certain.');
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  drawTitle();
  drawSpectrum();
  drawGuideMarkers();
  drawCards();

  if (showExpert || showCompare) {
    drawExpertMarkers();
  }
  if (showCompare) {
    drawCompareLines();
  }

  drawInfoPanel();
  positionControls();
}

function drawTitle() {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  text('Certainty Spectrum Across Areas of Knowledge', canvasWidth / 2, 10);
  textSize(11);
  fill('gray');
  text('Drag cards onto the spectrum to rank by certainty', canvasWidth / 2, 30);
}

function drawSpectrum() {
  // Draw gradient bar: coral → cream → teal
  noStroke();
  for (let i = 0; i < spectrumW; i++) {
    let t = i / spectrumW;
    let r, g, b;
    if (t < 0.5) {
      // coral (255,127,80) to cream (255,253,208)
      let lt = t * 2;
      r = lerp(255, 255, lt);
      g = lerp(127, 253, lt);
      b = lerp(80, 208, lt);
    } else {
      // cream (255,253,208) to teal (0,128,128)
      let lt = (t - 0.5) * 2;
      r = lerp(255, 0, lt);
      g = lerp(253, 128, lt);
      b = lerp(208, 128, lt);
    }
    fill(r, g, b);
    rect(spectrumX + i, spectrumY, 1, spectrumH);
  }

  // Border
  noFill();
  stroke('gray');
  strokeWeight(1);
  rect(spectrumX, spectrumY, spectrumW, spectrumH, 4);

  // End labels
  noStroke();
  fill('coral');
  textSize(11);
  textAlign(LEFT, TOP);
  text('Least Certain', spectrumX, spectrumY + spectrumH + 4);

  fill('teal');
  textAlign(RIGHT, TOP);
  text('Most Certain', spectrumX + spectrumW, spectrumY + spectrumH + 4);
}

function drawGuideMarkers() {
  // Draw percentage markers at 0, 25, 50, 75, 100
  noStroke();
  fill(120);
  textSize(9);
  textAlign(CENTER, TOP);
  let markers = [0, 25, 50, 75, 100];
  for (let m of markers) {
    let x = spectrumX + (m / 100) * spectrumW;
    stroke(180);
    strokeWeight(1);
    line(x, spectrumY + spectrumH - 4, x, spectrumY + spectrumH);
    noStroke();
    text(m + '%', x, spectrumY + spectrumH + 16);
  }
}

function drawCards() {
  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    let isSelected = (i === selectedCard);
    let isDragging = (i === draggingCard);

    // Card shadow
    noStroke();
    fill(0, 0, 0, 30);
    rect(c.x + 2, c.y + 2, cardW, cardH, 6);

    // Card fill
    if (isDragging) {
      fill(255, 255, 200);
    } else if (isSelected) {
      fill(200, 230, 255);
    } else if (c.placed) {
      fill(230, 245, 230);
    } else {
      fill(255);
    }
    stroke(isSelected ? 'steelblue' : 'gray');
    strokeWeight(isSelected ? 2 : 1);
    rect(c.x, c.y, cardW, cardH, 6);

    // Card label
    noStroke();
    fill('black');
    textSize(9);
    textAlign(CENTER, CENTER);
    let displayName = aoks[i].name;
    // Abbreviate long names to fit card
    if (displayName === 'Indigenous Knowledge') displayName = 'Indigenous\nKnowledge';
    if (displayName === 'Religious Knowledge') displayName = 'Religious\nKnowledge';
    if (displayName === 'Natural Sciences') displayName = 'Natural\nSciences';
    if (displayName === 'Human Sciences') displayName = 'Human\nSciences';
    text(displayName, c.x + cardW / 2, c.y + cardH / 2);
  }
}

function drawExpertMarkers() {
  // Draw expert position triangles on the spectrum
  for (let i = 0; i < aoks.length; i++) {
    let ex = spectrumX + (aoks[i].expert / 100) * spectrumW;
    let ey = spectrumY - 2;

    // Triangle pointing down
    fill('darkslateblue');
    noStroke();
    triangle(ex - 5, ey - 10, ex + 5, ey - 10, ex, ey);

    // Tiny label
    textSize(7);
    textAlign(CENTER, BOTTOM);
    fill('darkslateblue');
    let shortName = aoks[i].name.split(' ')[0];
    if (aoks[i].name === 'The Arts') shortName = 'Arts';
    text(shortName, ex, ey - 11);
  }
}

function drawCompareLines() {
  // Draw lines between student placement and expert position for placed cards
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].placed) {
      let studentX = cards[i].x + cardW / 2;
      let studentY = cards[i].y;
      let expertX = spectrumX + (aoks[i].expert / 100) * spectrumW;
      let expertY = spectrumY - 2;

      // Dashed-style line
      stroke('darkslateblue');
      strokeWeight(1);
      drawingContext.setLineDash([3, 3]);
      line(studentX, studentY, expertX, expertY);
      drawingContext.setLineDash([]);

      // Distance indicator
      let studentPercent = ((cards[i].x + cardW / 2 - spectrumX) / spectrumW) * 100;
      let diff = Math.abs(studentPercent - aoks[i].expert);
      noStroke();
      fill('darkslateblue');
      textSize(8);
      textAlign(CENTER, CENTER);
      let midX = (studentX + expertX) / 2;
      let midY = (studentY + expertY) / 2;
      text('±' + Math.round(diff), midX + 10, midY);
    }
  }
}

function drawInfoPanel() {
  // Info panel at bottom of draw area
  let panelY = drawHeight - 90;
  let panelH = 80;

  fill(245, 245, 255);
  noStroke();
  rect(margin, panelY, canvasWidth - 2 * margin, panelH, 6);
  stroke(200);
  strokeWeight(1);
  rect(margin, panelY, canvasWidth - 2 * margin, panelH, 6);

  noStroke();
  if (selectedCard >= 0 && selectedCard < aoks.length) {
    let a = aoks[selectedCard];
    fill('steelblue');
    textSize(12);
    textAlign(LEFT, TOP);
    text(a.name, margin + 8, panelY + 6);

    fill('black');
    textSize(10);
    textAlign(LEFT, TOP);
    let justText = a.justification;
    text(justText, margin + 8, panelY + 22, canvasWidth - 2 * margin - 16, panelH - 28);

    if (cards[selectedCard].placed) {
      let studentPct = Math.round(((cards[selectedCard].x + cardW / 2 - spectrumX) / spectrumW) * 100);
      fill('gray');
      textSize(9);
      textAlign(RIGHT, TOP);
      text('Your: ' + studentPct + '% | Expert: ' + a.expert + '%', canvasWidth - margin - 8, panelY + 6);
    }
  } else {
    fill('gray');
    textSize(11);
    textAlign(CENTER, CENTER);
    text('Click a placed card to see its justification', canvasWidth / 2, panelY + panelH / 2);
  }
}

function positionControls() {
  let yRow1 = canvasHeight - controlHeight + 8;
  let yRow2 = canvasHeight - controlHeight + 38;

  // Get canvas position in page
  let cnv = document.querySelector('main canvas');
  if (cnv) {
    let rect = cnv.getBoundingClientRect();
    expertBtn.position(rect.left + 10, rect.top + yRow1);
    compareBtn.position(rect.left + 140, rect.top + yRow1);
    resetBtn.position(rect.left + 10, rect.top + yRow2);
  }
}

function initCards() {
  cards = [];
  let cols = 4;
  let gap = 6;
  let totalRowW = cols * cardW + (cols - 1) * gap;
  let startX = (canvasWidth - totalRowW) / 2;

  for (let i = 0; i < aoks.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    cards.push({
      x: startX + col * (cardW + gap),
      y: cardStartY + row * (cardH + gap + 4),
      placed: false,
      homeX: startX + col * (cardW + gap),
      homeY: cardStartY + row * (cardH + gap + 4)
    });
  }
}

function toggleExpert() {
  showExpert = !showExpert;
  if (!showExpert) showCompare = false;
  expertBtn.html(showExpert ? 'Hide Expert View' : 'Show Expert View');
  if (!showCompare) compareBtn.html('Compare');
}

function toggleCompare() {
  if (!showExpert) {
    showExpert = true;
    expertBtn.html('Hide Expert View');
  }
  showCompare = !showCompare;
  compareBtn.html(showCompare ? 'Hide Compare' : 'Compare');
}

function resetAll() {
  initCards();
  showExpert = false;
  showCompare = false;
  selectedCard = -1;
  draggingCard = -1;
  expertBtn.html('Show Expert View');
  compareBtn.html('Compare');
}

function mousePressed() {
  // Check if clicking on a card
  for (let i = cards.length - 1; i >= 0; i--) {
    let c = cards[i];
    if (mouseX >= c.x && mouseX <= c.x + cardW &&
        mouseY >= c.y && mouseY <= c.y + cardH) {
      draggingCard = i;
      dragOffsetX = mouseX - c.x;
      dragOffsetY = mouseY - c.y;

      // If card is placed, select it to show justification
      if (c.placed) {
        selectedCard = i;
      }
      return;
    }
  }
  // Clicked on empty space — deselect
  selectedCard = -1;
}

function mouseDragged() {
  if (draggingCard >= 0) {
    let c = cards[draggingCard];
    c.x = constrain(mouseX - dragOffsetX, spectrumX, spectrumX + spectrumW - cardW);
    c.y = mouseY - dragOffsetY;
    return false; // prevent scrolling on mobile
  }
}

function mouseReleased() {
  if (draggingCard >= 0) {
    let c = cards[draggingCard];

    // Check if card is near spectrum bar (snap zone)
    let snapZoneTop = spectrumY - 10;
    let snapZoneBottom = spectrumY + spectrumH + 50;

    if (c.y + cardH / 2 >= snapZoneTop && c.y + cardH / 2 <= snapZoneBottom) {
      // Snap to just below spectrum
      c.y = spectrumY + spectrumH + 30;
      c.x = constrain(c.x, spectrumX, spectrumX + spectrumW - cardW);
      c.placed = true;
      selectedCard = draggingCard;
    } else if (c.y > cardStartY - 20) {
      // Return to home position
      c.x = c.homeX;
      c.y = c.homeY;
      c.placed = false;
      if (selectedCard === draggingCard) selectedCard = -1;
    } else {
      // Snap to spectrum if dragged above it too
      c.y = spectrumY + spectrumH + 30;
      c.x = constrain(c.x, spectrumX, spectrumX + spectrumW - cardW);
      c.placed = true;
      selectedCard = draggingCard;
    }

    draggingCard = -1;
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  spectrumW = canvasWidth - 2 * margin;
  cardW = min(80, (spectrumW - 3 * 6) / 4);
  initCards();
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = min(containerWidth, 500);
  canvasHeight = drawHeight + controlHeight;
}
