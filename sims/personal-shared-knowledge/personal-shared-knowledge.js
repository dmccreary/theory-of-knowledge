// Personal and Shared Knowledge Interactive Infographic
// Examine the two-directional relationship between personal and shared knowledge
// Bloom Level: Analyze (L4) - Verb: Examine
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Application state
let showLabels = true;
let selectedCard = null;
let userCards = [];
let addInput;
let personalBtn;
let sharedBtn;
let toggleBtn;

// Color scheme from spec
let personalColor, sharedColor, arrowColor, cardHoverColor;

// Knowledge cards data
let personalCards = [
  {
    label: "Your memory of a family story",
    narrative: "A family story begins as personal knowledge — something you experienced or were told. When you share it at a gathering or write it down, it enters shared knowledge as oral history or memoir.",
    x: 0, y: 0, w: 0, h: 0
  },
  {
    label: "Your skill at playing guitar",
    narrative: "Guitar skill is embodied personal knowledge — it lives in your muscle memory. Yet you likely acquired it through shared knowledge: lessons, tabs, videos. If you teach someone, your personal skill flows back into the shared domain.",
    x: 0, y: 0, w: 0, h: 0
  },
  {
    label: "Your intuitive sense of direction",
    narrative: "Your sense of direction is personal, built from lived experience navigating spaces. Cartographers converted similar personal spatial knowledge into shared maps and GPS systems that billions now use.",
    x: 0, y: 0, w: 0, h: 0
  }
];

let sharedCards = [
  {
    label: "The periodic table",
    narrative: "The periodic table is shared scientific knowledge, refined over centuries. Yet each chemist who contributed started with personal observations and hypotheses before publishing findings for the community.",
    x: 0, y: 0, w: 0, h: 0
  },
  {
    label: "Traffic laws",
    narrative: "Traffic laws are institutional shared knowledge. They become personal knowledge when you internalize them through driver education. Your personal experience of near-misses may also influence future legislation.",
    x: 0, y: 0, w: 0, h: 0
  },
  {
    label: "Musical notation systems",
    narrative: "Musical notation is shared cultural knowledge — a system for encoding sound. When you read sheet music, shared knowledge becomes personal as you interpret and perform it with your own expression.",
    x: 0, y: 0, w: 0, h: 0
  }
];

// Arrow mechanism labels
let toSharedLabels = ["Publication", "Teaching", "Cultural transmission"];
let toPersonalLabels = ["Education", "Reading", "Apprenticeship"];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Define colors
  personalColor = color(0, 150, 136, 40);   // warm teal, translucent
  sharedColor = color(255, 220, 150, 40);    // cream/amber, translucent
  arrowColor = color(231, 111, 81);          // coral
  cardHoverColor = color(255, 255, 200);

  // Row 1: text input + two categorization buttons
  addInput = createInput('');
  addInput.attribute('placeholder', 'Type a knowledge example...');
  addInput.size(200);
  addInput.position(10, drawHeight + 8);
  addInput.parent(document.querySelector('main'));

  personalBtn = createButton('+ Personal');
  personalBtn.position(220, drawHeight + 8);
  personalBtn.mousePressed(addPersonalCard);
  personalBtn.parent(document.querySelector('main'));

  sharedBtn = createButton('+ Shared');
  sharedBtn.position(310, drawHeight + 8);
  sharedBtn.mousePressed(addSharedCard);
  sharedBtn.parent(document.querySelector('main'));

  // Row 2: toggle labels button
  toggleBtn = createButton('Hide Arrow Labels');
  toggleBtn.position(10, drawHeight + 43);
  toggleBtn.mousePressed(toggleLabels);
  toggleBtn.parent(document.querySelector('main'));

  describe('Interactive infographic showing the bidirectional flow between personal and shared knowledge with clickable example cards and user input', LABEL);
}

function draw() {
  updateCanvasSize();

  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Personal & Shared Knowledge', canvasWidth / 2, 10);

  textSize(14);
  fill(80);
  text('Click any card to see how knowledge flows between domains', canvasWidth / 2, 38);

  // Calculate zone dimensions
  let zoneTop = 60;
  let zoneBottom = drawHeight - 10;
  let zoneHeight = zoneBottom - zoneTop;
  let halfWidth = canvasWidth / 2;
  let arrowGap = 70; // gap in the middle for arrows
  let leftZoneRight = halfWidth - arrowGap / 2;
  let rightZoneLeft = halfWidth + arrowGap / 2;

  // Draw Personal Knowledge zone (left)
  fill(0, 150, 136, 40);
  noStroke();
  rect(5, zoneTop, leftZoneRight - 5, zoneHeight, 12);

  // Zone label
  fill(0, 120, 110);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Personal Knowledge', (5 + leftZoneRight) / 2, zoneTop + 8);

  // Person silhouette icon (simple)
  let iconX = (5 + leftZoneRight) / 2;
  let iconY = zoneTop + 35;
  fill(0, 120, 110, 80);
  noStroke();
  ellipse(iconX, iconY, 20, 20); // head
  ellipse(iconX, iconY + 20, 30, 24); // body

  // Draw Shared Knowledge zone (right)
  fill(255, 200, 100, 40);
  noStroke();
  rect(rightZoneLeft, zoneTop, canvasWidth - 5 - rightZoneLeft, zoneHeight, 12);

  // Zone label
  fill(180, 120, 0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Shared Knowledge', (rightZoneLeft + canvasWidth - 5) / 2, zoneTop + 8);

  // Community circles icon
  let cIconX = (rightZoneLeft + canvasWidth - 5) / 2;
  let cIconY = zoneTop + 40;
  fill(180, 120, 0, 50);
  noStroke();
  ellipse(cIconX - 12, cIconY, 26, 26);
  ellipse(cIconX + 12, cIconY, 26, 26);
  ellipse(cIconX, cIconY - 10, 26, 26);

  textStyle(NORMAL);

  // Draw cards in personal zone
  let cardStartY = zoneTop + 70;
  let cardPadding = 10;
  let cardW = leftZoneRight - 5 - 2 * cardPadding;
  let cardH = 40;
  let cardSpacing = 8;

  let allPersonal = personalCards.concat(userCards.filter(c => c.zone === 'personal'));
  for (let i = 0; i < allPersonal.length; i++) {
    let cy = cardStartY + i * (cardH + cardSpacing);
    let cx = 5 + cardPadding;
    allPersonal[i].x = cx;
    allPersonal[i].y = cy;
    allPersonal[i].w = cardW;
    allPersonal[i].h = cardH;

    let isHovered = mouseX > cx && mouseX < cx + cardW && mouseY > cy && mouseY < cy + cardH;
    let isSelected = selectedCard === allPersonal[i];

    if (isSelected) {
      fill(200, 255, 220);
      stroke(0, 150, 136);
      strokeWeight(2);
    } else if (isHovered) {
      fill(220, 250, 245);
      stroke(0, 150, 136, 100);
      strokeWeight(1);
      cursor(HAND);
    } else {
      fill(255, 255, 255, 200);
      stroke(0, 150, 136, 60);
      strokeWeight(1);
    }
    rect(cx, cy, cardW, cardH, 6);

    fill(30);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(13);
    text(truncateText(allPersonal[i].label, cardW - 16), cx + 8, cy + cardH / 2);
  }

  // Draw cards in shared zone
  let sharedCardW = canvasWidth - 5 - rightZoneLeft - 2 * cardPadding;
  let allShared = sharedCards.concat(userCards.filter(c => c.zone === 'shared'));
  for (let i = 0; i < allShared.length; i++) {
    let cy = cardStartY + i * (cardH + cardSpacing);
    let cx = rightZoneLeft + cardPadding;
    allShared[i].x = cx;
    allShared[i].y = cy;
    allShared[i].w = sharedCardW;
    allShared[i].h = cardH;

    let isHovered = mouseX > cx && mouseX < cx + sharedCardW && mouseY > cy && mouseY < cy + cardH;
    let isSelected = selectedCard === allShared[i];

    if (isSelected) {
      fill(255, 245, 200);
      stroke(200, 150, 0);
      strokeWeight(2);
    } else if (isHovered) {
      fill(255, 248, 230);
      stroke(200, 150, 0, 100);
      strokeWeight(1);
      cursor(HAND);
    } else {
      fill(255, 255, 255, 200);
      stroke(200, 150, 0, 60);
      strokeWeight(1);
    }
    rect(cx, cy, sharedCardW, cardH, 6);

    fill(30);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(13);
    text(truncateText(allShared[i].label, sharedCardW - 16), cx + 8, cy + cardH / 2);
  }

  // Draw bidirectional arrows in the center gap
  let arrowCenterX = canvasWidth / 2;
  let arrowTopY = zoneTop + 80;
  let arrowBottomY = zoneTop + zoneHeight - 30;
  let arrowMidY = (arrowTopY + arrowBottomY) / 2;

  // Arrow: Personal -> Shared (top half, right-pointing)
  stroke(arrowColor);
  strokeWeight(3);
  let aRightX = arrowCenterX + arrowGap / 2 - 5;
  let aLeftX = arrowCenterX - arrowGap / 2 + 5;

  // Top arrow: Personal -> Shared
  drawArrowLine(aLeftX, arrowTopY + 20, aRightX, arrowTopY + 20);
  drawArrowLine(aLeftX, arrowMidY - 15, aRightX, arrowMidY - 15);

  // Bottom arrows: Shared -> Personal
  drawArrowLine(aRightX, arrowMidY + 15, aLeftX, arrowMidY + 15);
  drawArrowLine(aRightX, arrowBottomY - 20, aLeftX, arrowBottomY - 20);

  // Arrow labels
  if (showLabels) {
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    fill(180, 60, 40);
    // Personal -> Shared labels
    push();
    translate(arrowCenterX, arrowTopY + 10);
    text(toSharedLabels[0], 0, 0);
    pop();
    push();
    translate(arrowCenterX, arrowMidY - 25);
    text(toSharedLabels[1], 0, 0);
    pop();

    fill(40, 100, 160);
    // Shared -> Personal labels
    push();
    translate(arrowCenterX, arrowMidY + 5);
    text(toPersonalLabels[0], 0, 0);
    pop();
    push();
    translate(arrowCenterX, arrowBottomY - 30);
    text(toPersonalLabels[1], 0, 0);
    pop();

    // Direction headers
    textSize(11);
    textStyle(BOLD);
    fill(180, 60, 40);
    text('Personal → Shared', arrowCenterX, arrowTopY - 2);
    fill(40, 100, 160);
    text('Shared → Personal', arrowCenterX, arrowMidY + 30);
    textStyle(NORMAL);
  }

  // Draw narrative panel if a card is selected
  if (selectedCard && selectedCard.narrative) {
    let panelY = drawHeight - 110;
    let panelX = 15;
    let panelW = canvasWidth - 30;
    let panelH = 100;

    fill(255, 255, 255, 240);
    stroke(100);
    strokeWeight(1);
    rect(panelX, panelY, panelW, panelH, 10);

    // Card title
    fill(0, 100, 90);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    textStyle(BOLD);
    text(selectedCard.label, panelX + 12, panelY + 8);
    textStyle(NORMAL);

    // Narrative text with word wrapping
    fill(50);
    textSize(12);
    textAlign(LEFT, TOP);
    drawWrappedText(selectedCard.narrative, panelX + 12, panelY + 28, panelW - 24, 15);

    // Close hint
    fill(150);
    textAlign(RIGHT, TOP);
    textSize(11);
    text('click card again to close', panelX + panelW - 12, panelY + 8);
  }

  // Control area labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // Reset cursor if not hovering on a card
  let onCard = false;
  let allCards = personalCards.concat(sharedCards).concat(userCards);
  for (let c of allCards) {
    if (mouseX > c.x && mouseX < c.x + c.w && mouseY > c.y && mouseY < c.y + c.h) {
      onCard = true;
      break;
    }
  }
  if (!onCard) {
    cursor(ARROW);
  }
}

function mousePressed() {
  let allCards = personalCards.concat(sharedCards).concat(userCards);
  for (let c of allCards) {
    if (mouseX > c.x && mouseX < c.x + c.w && mouseY > c.y && mouseY < c.y + c.h) {
      if (selectedCard === c) {
        selectedCard = null; // toggle off
      } else {
        selectedCard = c;
      }
      return;
    }
  }
  // Click elsewhere closes panel
  selectedCard = null;
}

function addPersonalCard() {
  let val = addInput.value().trim();
  if (val.length > 0) {
    userCards.push({
      label: val,
      narrative: "You categorized \"" + val + "\" as personal knowledge. Consider: how did you acquire this knowledge? Could it become shared knowledge if you published or taught it?",
      zone: 'personal',
      x: 0, y: 0, w: 0, h: 0
    });
    addInput.value('');
  }
}

function addSharedCard() {
  let val = addInput.value().trim();
  if (val.length > 0) {
    userCards.push({
      label: val,
      narrative: "You categorized \"" + val + "\" as shared knowledge. Consider: how does this shared knowledge become personal for each individual who encounters it?",
      zone: 'shared',
      x: 0, y: 0, w: 0, h: 0
    });
    addInput.value('');
  }
}

function toggleLabels() {
  showLabels = !showLabels;
  toggleBtn.html(showLabels ? 'Hide Arrow Labels' : 'Show Arrow Labels');
}

function drawArrowLine(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  // Arrowhead
  let angle = atan2(y2 - y1, x2 - x1);
  let headLen = 8;
  push();
  translate(x2, y2);
  rotate(angle);
  fill(arrowColor);
  noStroke();
  triangle(0, 0, -headLen, -headLen / 2, -headLen, headLen / 2);
  pop();
}

function truncateText(txt, maxWidth) {
  // Simple truncation based on approximate character width
  let approxChars = Math.floor(maxWidth / 7);
  if (txt.length > approxChars) {
    return txt.substring(0, approxChars - 3) + '...';
  }
  return txt;
}

function drawWrappedText(txt, x, y, maxW, lineH) {
  let words = txt.split(' ');
  let currentLine = '';
  let currentY = y;
  for (let w of words) {
    let testLine = currentLine.length === 0 ? w : currentLine + ' ' + w;
    if (textWidth(testLine) > maxW) {
      text(currentLine, x, currentY);
      currentLine = w;
      currentY += lineH;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    text(currentLine, x, currentY);
  }
}

// Responsive design functions
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  // Reposition controls
  addInput.size(min(200, canvasWidth - 220));
  addInput.position(10, drawHeight + 8);
  personalBtn.position(min(220, canvasWidth - 190), drawHeight + 8);
  sharedBtn.position(min(310, canvasWidth - 100), drawHeight + 8);
  toggleBtn.position(10, drawHeight + 43);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
