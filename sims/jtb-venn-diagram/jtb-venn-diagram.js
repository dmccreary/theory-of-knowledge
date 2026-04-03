// JTB Venn Diagram - Justified True Belief Interactive MicroSim
// Three overlapping circles: Belief, Truth, Justification
// Click regions to see examples. Quiz mode: drag cards into correct region.
// CANVAS_HEIGHT: 520

let containerWidth;
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Circle layout
let circleRadius;
let cx, cy;
let beliefCenter, truthCenter, justCenter;
let circleSpread;

// Colors (named)
const beliefColor = [0, 150, 136, 60];     // teal
const truthColor = [255, 179, 0, 60];      // amber
const justColor = [255, 99, 71, 60];       // coral
const beliefColorSolid = [0, 150, 136];
const truthColorSolid = [255, 179, 0];
const justColorSolid = [255, 99, 71];

// Region data
const regions = {
  "Belief only": {
    desc: "Believed but neither true nor justified",
    examples: [
      "Believing in unicorns based on a dream",
      "Thinking your lucky socks help you pass exams"
    ]
  },
  "Truth only": {
    desc: "True but neither believed nor justified by you",
    examples: [
      "A fact in a book you've never read",
      "The exact number of grains of sand on a beach"
    ]
  },
  "Justification only": {
    desc: "Well-justified but neither believed nor true",
    examples: [
      "A carefully constructed but wrong scientific theory",
      "A logically valid argument with false premises"
    ]
  },
  "Belief + Truth": {
    desc: "True belief without justification",
    examples: [
      "Correctly guessing the answer on a test",
      "Believing the right thing for the wrong reason"
    ]
  },
  "Belief + Justification": {
    desc: "Justified belief that happens to be false",
    examples: [
      "Trusting a clock that stopped (Gettier-style)",
      "Believing a well-sourced but retracted study"
    ]
  },
  "Truth + Justification": {
    desc: "True and justified but not believed",
    examples: [
      "Evidence you refuse to accept due to bias",
      "Scientific consensus you personally reject"
    ]
  },
  "Knowledge (JTB)": {
    desc: "Justified True Belief — the traditional definition of knowledge",
    examples: [
      "Knowing 2+2=4 through mathematical proof",
      "Knowing it's raining because you can see and feel it"
    ]
  }
};

// State
let hoveredRegion = null;
let selectedRegion = null;
let quizMode = false;
let quizButton;
let resetButton;
let score = 0;
let totalAttempts = 0;

// Quiz cards
let cards = [];
let draggedCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let feedbackMessage = '';
let feedbackTimer = 0;
let feedbackCorrect = false;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  quizButton = createButton('Quiz Mode: OFF');
  quizButton.parent(document.querySelector('main'));
  quizButton.mousePressed(toggleQuizMode);
  quizButton.style('font-size', '14px');
  quizButton.style('padding', '6px 14px');
  quizButton.style('background', 'white');
  quizButton.style('cursor', 'pointer');
  quizButton.style('border-radius', '4px');
  quizButton.style('border', '1px solid gray');
  quizButton.style('margin-right', '10px');

  resetButton = createButton('Reset Score');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetScore);
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '6px 14px');
  resetButton.style('background', 'white');
  resetButton.style('cursor', 'pointer');
  resetButton.style('border-radius', '4px');
  resetButton.style('border', '1px solid gray');

  recalcLayout();
  describe('Interactive Venn diagram showing how Justified True Belief forms knowledge. Three overlapping circles for Belief, Truth, and Justification. Click regions to learn about each, or use quiz mode to test your understanding.');
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  recalcLayout();
  drawCircles();
  drawLabels();
  detectHover();

  if (quizMode) {
    drawCards();
    drawFeedback();
  }

  drawInfoPanel();
  drawScoreBar();
}

function recalcLayout() {
  circleRadius = min(canvasWidth, drawHeight) * 0.26;
  cx = canvasWidth / 2;
  cy = drawHeight / 2 - 20;
  circleSpread = circleRadius * 0.58;

  // Belief top-left, Truth top-right, Justification bottom-center
  beliefCenter = { x: cx - circleSpread, y: cy - circleSpread * 0.5 };
  truthCenter = { x: cx + circleSpread, y: cy - circleSpread * 0.5 };
  justCenter = { x: cx, y: cy + circleSpread * 0.7 };
}

function drawCircles() {
  // Draw with transparency
  noStroke();

  // Belief circle - teal
  fill(beliefColor[0], beliefColor[1], beliefColor[2], beliefColor[3]);
  ellipse(beliefCenter.x, beliefCenter.y, circleRadius * 2);

  // Truth circle - amber
  fill(truthColor[0], truthColor[1], truthColor[2], truthColor[3]);
  ellipse(truthCenter.x, truthCenter.y, circleRadius * 2);

  // Justification circle - coral
  fill(justColor[0], justColor[1], justColor[2], justColor[3]);
  ellipse(justCenter.x, justCenter.y, circleRadius * 2);

  // Highlight hovered/selected region
  let activeRegion = selectedRegion || hoveredRegion;
  if (activeRegion) {
    drawRegionHighlight(activeRegion);
  }

  // Draw circle outlines
  noFill();
  strokeWeight(2.5);
  stroke(beliefColorSolid[0], beliefColorSolid[1], beliefColorSolid[2]);
  ellipse(beliefCenter.x, beliefCenter.y, circleRadius * 2);
  stroke(truthColorSolid[0], truthColorSolid[1], truthColorSolid[2]);
  ellipse(truthCenter.x, truthCenter.y, circleRadius * 2);
  stroke(justColorSolid[0], justColorSolid[1], justColorSolid[2]);
  ellipse(justCenter.x, justCenter.y, circleRadius * 2);
  noStroke();
}

function drawRegionHighlight(regionName) {
  push();
  noStroke();
  let alpha = 40;
  switch (regionName) {
    case "Belief only":
      fill(0, 150, 136, alpha);
      ellipse(beliefCenter.x, beliefCenter.y, circleRadius * 2);
      break;
    case "Truth only":
      fill(255, 179, 0, alpha);
      ellipse(truthCenter.x, truthCenter.y, circleRadius * 2);
      break;
    case "Justification only":
      fill(255, 99, 71, alpha);
      ellipse(justCenter.x, justCenter.y, circleRadius * 2);
      break;
    case "Knowledge (JTB)":
      fill(255, 215, 0, 80);
      // Approximate center overlap
      ellipse(cx, cy + circleSpread * 0.07, circleRadius * 0.7);
      break;
    case "Belief + Truth":
      fill(100, 170, 80, 50);
      let btMid = { x: (beliefCenter.x + truthCenter.x) / 2, y: (beliefCenter.y + truthCenter.y) / 2 };
      ellipse(btMid.x, btMid.y - 8, circleRadius * 0.8);
      break;
    case "Belief + Justification":
      fill(128, 100, 100, 50);
      let bjMid = { x: (beliefCenter.x + justCenter.x) / 2, y: (beliefCenter.y + justCenter.y) / 2 };
      ellipse(bjMid.x, bjMid.y, circleRadius * 0.8);
      break;
    case "Truth + Justification":
      fill(200, 140, 40, 50);
      let tjMid = { x: (truthCenter.x + justCenter.x) / 2, y: (truthCenter.y + justCenter.y) / 2 };
      ellipse(tjMid.x, tjMid.y, circleRadius * 0.8);
      break;
  }
  pop();
}

function drawLabels() {
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(max(14, canvasWidth * 0.024));
  textStyle(BOLD);

  // Circle labels outside
  fill(0, 120, 108);
  text("Belief", beliefCenter.x - circleRadius * 0.65, beliefCenter.y - circleRadius * 0.75);
  fill(200, 140, 0);
  text("Truth", truthCenter.x + circleRadius * 0.65, truthCenter.y - circleRadius * 0.75);
  fill(220, 70, 50);
  text("Justification", justCenter.x, justCenter.y + circleRadius * 0.95);

  // Region labels inside
  textStyle(NORMAL);
  textSize(max(11, canvasWidth * 0.018));

  // Single-circle labels
  fill(0, 100, 90);
  text("B only", beliefCenter.x - circleRadius * 0.4, beliefCenter.y);
  fill(170, 120, 0);
  text("T only", truthCenter.x + circleRadius * 0.4, truthCenter.y);
  fill(190, 60, 40);
  text("J only", justCenter.x, justCenter.y + circleRadius * 0.4);

  // Two-circle overlap labels
  let labelSize = max(10, canvasWidth * 0.016);
  textSize(labelSize);
  fill(60, 100, 60);
  let btMid = { x: (beliefCenter.x + truthCenter.x) / 2, y: (beliefCenter.y + truthCenter.y) / 2 };
  text("B+T", btMid.x, btMid.y - circleRadius * 0.3);
  fill(100, 60, 70);
  let bjMid = { x: (beliefCenter.x + justCenter.x) / 2, y: (beliefCenter.y + justCenter.y) / 2 };
  text("B+J", bjMid.x - circleRadius * 0.2, bjMid.y);
  fill(160, 100, 20);
  let tjMid = { x: (truthCenter.x + justCenter.x) / 2, y: (truthCenter.y + justCenter.y) / 2 };
  text("T+J", tjMid.x + circleRadius * 0.2, tjMid.y);

  // Knowledge center label
  textSize(max(13, canvasWidth * 0.022));
  textStyle(BOLD);
  fill(140, 100, 0);
  let kcY = cy + circleSpread * 0.07;
  text("Knowledge", cx, kcY - 6);
  textSize(max(10, canvasWidth * 0.015));
  textStyle(NORMAL);
  text("(JTB)", cx, kcY + 10);
}

function getRegionAtPoint(px, py) {
  let dB = dist(px, py, beliefCenter.x, beliefCenter.y);
  let dT = dist(px, py, truthCenter.x, truthCenter.y);
  let dJ = dist(px, py, justCenter.x, justCenter.y);

  let inB = dB < circleRadius;
  let inT = dT < circleRadius;
  let inJ = dJ < circleRadius;

  if (inB && inT && inJ) return "Knowledge (JTB)";
  if (inB && inT) return "Belief + Truth";
  if (inB && inJ) return "Belief + Justification";
  if (inT && inJ) return "Truth + Justification";
  if (inB) return "Belief only";
  if (inT) return "Truth only";
  if (inJ) return "Justification only";
  return null;
}

function detectHover() {
  if (mouseY < drawHeight && mouseX > 0 && mouseX < canvasWidth) {
    hoveredRegion = getRegionAtPoint(mouseX, mouseY);
    if (hoveredRegion) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }
  } else {
    hoveredRegion = null;
  }
}

function drawInfoPanel() {
  let activeRegion = selectedRegion || hoveredRegion;
  if (!activeRegion || quizMode) return;

  let info = regions[activeRegion];
  if (!info) return;

  // Draw info panel at bottom of draw area
  let panelY = drawHeight - 85;
  let panelH = 80;
  let panelX = 10;
  let panelW = canvasWidth - 20;

  noStroke();
  fill(255, 255, 255, 230);
  rect(panelX, panelY, panelW, panelH, 8);

  stroke(180);
  strokeWeight(1);
  noFill();
  rect(panelX, panelY, panelW, panelH, 8);
  noStroke();

  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(max(12, canvasWidth * 0.02));
  fill(40);
  text(activeRegion, panelX + 10, panelY + 8);

  textStyle(NORMAL);
  textSize(max(11, canvasWidth * 0.017));
  fill(80);
  text(info.desc, panelX + 10, panelY + 26);

  textStyle(ITALIC);
  textSize(max(10, canvasWidth * 0.015));
  fill(100);
  // Show first example that fits
  let exText = "e.g. " + info.examples[0];
  text(exText, panelX + 10, panelY + 44, panelW - 20, 30);
}

function drawScoreBar() {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  fill(40);
  let scoreY = drawHeight + controlHeight / 2;
  let scoreText = 'Score: ' + score + ' / ' + totalAttempts;
  if (quizMode) {
    text(scoreText, canvasWidth - textWidth(scoreText) - 15, scoreY);
  }

  // Mode indicator
  textStyle(NORMAL);
  textSize(13);
  fill(80);
  if (!quizMode) {
    textAlign(CENTER, CENTER);
    text('Click a region to explore  |  Toggle Quiz Mode to test yourself', canvasWidth / 2, scoreY);
  } else {
    text('Drag cards to the correct region', 15, scoreY);
  }
}

// Quiz mode cards
function buildQuizCards() {
  cards = [];
  let allExamples = [];
  let regionKeys = Object.keys(regions);

  // Gather all examples with their region
  for (let key of regionKeys) {
    for (let ex of regions[key].examples) {
      allExamples.push({ text: ex, region: key });
    }
  }

  // Shuffle
  for (let i = allExamples.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [allExamples[i], allExamples[j]] = [allExamples[j], allExamples[i]];
  }

  // Take first 5 cards
  let subset = allExamples.slice(0, 5);
  let cardW = min(200, canvasWidth * 0.3);
  let cardH = 55;
  let startY = 15;

  for (let i = 0; i < subset.length; i++) {
    let cardX = canvasWidth - cardW - 10;
    let cardY = startY + i * (cardH + 8);
    cards.push({
      text: subset[i].text,
      region: subset[i].region,
      x: cardX,
      y: cardY,
      homeX: cardX,
      homeY: cardY,
      w: cardW,
      h: cardH,
      placed: false,
      correct: null
    });
  }
}

function drawCards() {
  for (let card of cards) {
    if (card.placed && card.correct !== null) continue; // hide correctly placed

    push();
    noStroke();
    if (card.correct === true) {
      fill(200, 255, 200);
    } else if (card.correct === false) {
      fill(255, 200, 200);
    } else if (card === draggedCard) {
      fill(240, 240, 255);
    } else {
      fill(255);
    }
    rect(card.x, card.y, card.w, card.h, 6);
    stroke(150);
    strokeWeight(1);
    noFill();
    rect(card.x, card.y, card.w, card.h, 6);

    noStroke();
    fill(40);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(max(9, canvasWidth * 0.014));
    text(card.text, card.x + 6, card.y + 6, card.w - 12, card.h - 12);
    pop();
  }

  // Draw feedback message
  drawFeedback();
}

function drawFeedback() {
  if (feedbackTimer > 0) {
    feedbackTimer--;
    push();
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    if (feedbackCorrect) {
      fill(0, 150, 0);
    } else {
      fill(200, 0, 0);
    }
    text(feedbackMessage, canvasWidth / 2, drawHeight - 15);
    pop();
  }
}

function toggleQuizMode() {
  quizMode = !quizMode;
  if (quizMode) {
    quizButton.html('Quiz Mode: ON');
    quizButton.style('background', 'lightyellow');
    selectedRegion = null;
    buildQuizCards();
  } else {
    quizButton.html('Quiz Mode: OFF');
    quizButton.style('background', 'white');
    cards = [];
    draggedCard = null;
  }
}

function resetScore() {
  score = 0;
  totalAttempts = 0;
  if (quizMode) {
    buildQuizCards();
  }
  feedbackMessage = '';
  feedbackTimer = 0;
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  if (quizMode) {
    // Check if clicking a card
    for (let i = cards.length - 1; i >= 0; i--) {
      let card = cards[i];
      if (card.placed && card.correct === true) continue;
      if (mouseX > card.x && mouseX < card.x + card.w &&
          mouseY > card.y && mouseY < card.y + card.h) {
        draggedCard = card;
        dragOffsetX = mouseX - card.x;
        dragOffsetY = mouseY - card.y;
        return;
      }
    }
  } else {
    // Explore mode - click to select region
    let region = getRegionAtPoint(mouseX, mouseY);
    if (region) {
      selectedRegion = (selectedRegion === region) ? null : region;
    } else {
      selectedRegion = null;
    }
  }
}

function mouseDragged() {
  if (draggedCard) {
    draggedCard.x = mouseX - dragOffsetX;
    draggedCard.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (draggedCard) {
    let dropRegion = getRegionAtPoint(draggedCard.x + draggedCard.w / 2, draggedCard.y + draggedCard.h / 2);
    if (dropRegion) {
      totalAttempts++;
      if (dropRegion === draggedCard.region) {
        score++;
        draggedCard.correct = true;
        draggedCard.placed = true;
        feedbackMessage = 'Correct! That belongs in ' + dropRegion;
        feedbackCorrect = true;
      } else {
        draggedCard.correct = false;
        feedbackMessage = 'Not quite — that belongs in ' + draggedCard.region;
        feedbackCorrect = false;
        // Return card to home position
        draggedCard.x = draggedCard.homeX;
        draggedCard.y = draggedCard.homeY;
        // Reset incorrect state after a moment
        let card = draggedCard;
        setTimeout(() => { card.correct = null; }, 1200);
      }
      feedbackTimer = 120;

      // Check if all cards are placed
      let allPlaced = cards.every(c => c.placed && c.correct === true);
      if (allPlaced) {
        setTimeout(() => {
          feedbackMessage = 'All correct! Generating new cards...';
          feedbackCorrect = true;
          feedbackTimer = 90;
          buildQuizCards();
        }, 1500);
      }
    } else {
      // Snap back if not dropped on a region
      draggedCard.x = draggedCard.homeX;
      draggedCard.y = draggedCard.homeY;
    }
    draggedCard = null;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  recalcLayout();
  // Rebuild card positions if in quiz mode
  if (quizMode) {
    let cardW = min(200, canvasWidth * 0.3);
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].placed) {
        cards[i].homeX = canvasWidth - cardW - 10;
        cards[i].x = cards[i].homeX;
        cards[i].w = cardW;
      }
    }
  }
}

function updateCanvasSize() {
  const main = document.querySelector('main');
  if (main) {
    containerWidth = main.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = containerWidth;
}
