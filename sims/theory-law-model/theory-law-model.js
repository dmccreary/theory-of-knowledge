// Theory, Law, and Model Comparison MicroSim
// CANVAS_HEIGHT: 520

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- Domain data ----
let concepts = {
  "Theory": {
    def: "A well-substantiated explanation of natural phenomena, supported by extensive evidence",
    func: "Explains WHY things happen",
    scope: "Broad — covers many observations",
    examples: ["Theory of Evolution", "Theory of Relativity", "Germ Theory of Disease"],
    canChange: true,
    col: "teal"
  },
  "Law": {
    def: "A concise mathematical description of a natural pattern, without explaining why",
    func: "Describes WHAT happens",
    scope: "Specific — describes a pattern",
    examples: ["Newton's Laws of Motion", "Law of Thermodynamics", "Boyle's Law"],
    canChange: false,
    col: "goldenrod"
  },
  "Model": {
    def: "A simplified representation of a complex system used for prediction and understanding",
    func: "Represents HOW a system works",
    scope: "Limited — simplification of reality",
    examples: ["Bohr Model of the Atom", "Climate Models", "DNA Double Helix Model"],
    canChange: true,
    col: "coral"
  }
};

let conceptKeys = Object.keys(concepts);

let myth = "Common myth: 'Theories become laws when proven.'\nReality: Theories and laws serve DIFFERENT functions.\nA theory doesn't 'graduate' to become a law.";

// ---- Quiz data ----
let quizBank = [
  { text: "E = mc²", answer: "Law", explanation: "Describes a mathematical relationship between energy and mass." },
  { text: "Natural selection drives evolution", answer: "Theory", explanation: "Explains the mechanism behind biodiversity." },
  { text: "The solar system is heliocentric", answer: "Model", explanation: "A simplified representation of planetary orbits." },
  { text: "F = ma", answer: "Law", explanation: "Describes the mathematical relationship between force, mass, and acceleration." },
  { text: "Plate tectonics explains earthquakes", answer: "Theory", explanation: "Explains why and how earthquakes occur." },
  { text: "The water cycle diagram", answer: "Model", explanation: "A simplified representation of how water moves through the environment." }
];

// ---- State ----
let stepIndex = 0; // 0=Theory, 1=Law, 2=Model, 3=myth
let totalSteps = 4;
let quizMode = false;
let quizIndex = 0;
let quizAnswer = null; // null, 'correct', 'wrong'
let quizFeedback = "";
let quizScore = 0;
let quizTotal = 0;

// ---- Controls ----
let prevButton, nextButton, quizButton;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  let mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  prevButton = createButton('Previous');
  prevButton.parent(mainElement);
  prevButton.mousePressed(function () {
    if (stepIndex > 0) stepIndex--;
  });

  nextButton = createButton('Next');
  nextButton.parent(mainElement);
  nextButton.mousePressed(function () {
    if (stepIndex < totalSteps - 1) stepIndex++;
  });

  quizButton = createButton('Quiz Mode');
  quizButton.parent(mainElement);
  quizButton.mousePressed(function () {
    if (quizMode) {
      quizMode = false;
      quizAnswer = null;
    } else {
      quizMode = true;
      quizIndex = 0;
      quizAnswer = null;
      quizFeedback = "";
      quizScore = 0;
      quizTotal = 0;
    }
  });

  describe('A three-column comparison of scientific theories, laws, and models with step-through reveal and quiz mode.');
}

function draw() {
  updateCanvasSize();

  // Draw area
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Position controls
  let ctrlY = drawHeight + 18;
  prevButton.position(margin, ctrlY);
  prevButton.style('font-size', '13px');
  prevButton.style('background-color', 'white');

  nextButton.position(margin + 80, ctrlY);
  nextButton.style('font-size', '13px');
  nextButton.style('background-color', 'white');

  quizButton.position(margin + 150, ctrlY);
  quizButton.style('font-size', '13px');
  quizButton.style('background-color', 'white');

  if (quizMode) {
    quizButton.html('Back to Compare');
    prevButton.hide();
    nextButton.hide();
  } else {
    quizButton.html('Quiz Mode');
    prevButton.show();
    nextButton.show();
  }

  if (quizMode) {
    drawQuizMode();
  } else {
    drawCompareMode();
  }
}

function drawCompareMode() {
  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Theory vs Law vs Model', canvasWidth / 2, 8);

  // Step indicator
  textSize(defaultTextSize - 2);
  textStyle(NORMAL);
  fill('dimgray');
  noStroke();
  let stepLabels = ['Theory', 'Law', 'Model', 'Myth Busted'];
  text('Step ' + (stepIndex + 1) + ' of ' + totalSteps + ': ' + stepLabels[stepIndex], canvasWidth / 2, 28);

  let colW = (canvasWidth - margin * 4) / 3;
  let topY = 48;

  // Draw columns for revealed concepts
  for (let i = 0; i < 3; i++) {
    let colX = margin + i * (colW + margin);
    if (i <= stepIndex) {
      drawConceptColumn(colX, topY, colW, conceptKeys[i], concepts[conceptKeys[i]]);
    } else {
      drawHiddenColumn(colX, topY, colW, conceptKeys[i]);
    }
  }

  // Myth callout at step 3
  if (stepIndex >= 3) {
    drawMythBox(topY + 340);
  }
}

function drawConceptColumn(x, y, w, label, data) {
  let pad = 6;
  let innerW = w - pad * 2;
  let colHeight = 330;

  // Column background
  noStroke();
  fill(255, 255, 255, 200);
  rect(x, y, w, colHeight, 8);

  // Header bar
  fill(data.col);
  noStroke();
  rect(x, y, w, 30, 8, 8, 0, 0);

  // Header text
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text(label, x + w / 2, y + 15);

  let cy = y + 38;

  // Definition
  fill('black');
  textAlign(LEFT, TOP);
  textSize(defaultTextSize - 3);
  textStyle(BOLD);
  noStroke();
  text('Definition:', x + pad, cy);
  cy += 14;
  textStyle(NORMAL);
  fill('black');
  noStroke();
  text(data.def, x + pad, cy, innerW, 50);
  cy += 52;

  // Function
  fill(data.col);
  textStyle(BOLD);
  textSize(defaultTextSize - 2);
  noStroke();
  text(data.func, x + pad, cy, innerW, 30);
  cy += 28;

  // Scope
  fill('dimgray');
  textStyle(NORMAL);
  textSize(defaultTextSize - 3);
  noStroke();
  text(data.scope, x + pad, cy, innerW, 30);
  cy += 30;

  // Divider
  stroke(220);
  strokeWeight(1);
  line(x + pad, cy, x + w - pad, cy);
  noStroke();
  cy += 6;

  // Examples header
  fill('black');
  textStyle(BOLD);
  textSize(defaultTextSize - 3);
  noStroke();
  text('Examples:', x + pad, cy);
  cy += 14;

  textStyle(NORMAL);
  fill('black');
  textSize(defaultTextSize - 4);
  for (let i = 0; i < data.examples.length; i++) {
    noStroke();
    text('• ' + data.examples[i], x + pad, cy, innerW, 24);
    cy += 20;
  }

  cy += 4;

  // Can change badge
  let badgeText = data.canChange ? 'Can be revised' : 'Unchanging pattern';
  let badgeCol = data.canChange ? color(60, 160, 60) : color(160, 120, 40);
  fill(badgeCol);
  noStroke();
  rect(x + pad, cy, innerW, 20, 4);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize - 4);
  textStyle(BOLD);
  noStroke();
  text(badgeText, x + pad + innerW / 2, cy + 10);
}

function drawHiddenColumn(x, y, w, label) {
  let colHeight = 330;

  // Dimmed background
  noStroke();
  fill(230);
  rect(x, y, w, colHeight, 8);

  // Header bar dimmed
  fill(180);
  noStroke();
  rect(x, y, w, 30, 8, 8, 0, 0);

  // Header text
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text(label, x + w / 2, y + 15);

  // Question mark
  fill(160);
  textSize(40);
  textAlign(CENTER, CENTER);
  noStroke();
  text('?', x + w / 2, y + colHeight / 2 + 10);

  // Tap next
  fill(160);
  textSize(defaultTextSize - 3);
  textStyle(NORMAL);
  noStroke();
  text('Click Next to reveal', x + w / 2, y + colHeight - 20);
}

function drawMythBox(y) {
  let boxW = canvasWidth - margin * 2;
  let boxH = 70;

  // Red-tinted box
  noStroke();
  fill(255, 240, 240);
  rect(margin, y, boxW, boxH, 8);

  // Red left bar
  fill('crimson');
  noStroke();
  rect(margin, y, 5, boxH, 8, 0, 0, 8);

  // Icon
  fill('crimson');
  textAlign(LEFT, TOP);
  textSize(defaultTextSize + 4);
  textStyle(BOLD);
  noStroke();
  text('⚠', margin + 12, y + 6);

  // Title
  fill('crimson');
  textSize(defaultTextSize - 2);
  textStyle(BOLD);
  noStroke();
  text('Myth Busted!', margin + 32, y + 8);

  // Myth text
  fill('black');
  textSize(defaultTextSize - 3);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  noStroke();
  text(myth, margin + 14, y + 24, boxW - 28, 50);
}

// ---- Quiz Mode ----
function drawQuizMode() {
  if (quizIndex >= quizBank.length) {
    drawQuizComplete();
    return;
  }

  let q = quizBank[quizIndex];
  let pad = 16;
  let contentW = canvasWidth - pad * 2;

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Quiz: Classify the Statement', canvasWidth / 2, 10);

  // Score
  textSize(defaultTextSize - 2);
  textStyle(NORMAL);
  fill('dimgray');
  noStroke();
  text('Question ' + (quizIndex + 1) + ' of ' + quizBank.length + '   |   Score: ' + quizScore + '/' + quizTotal, canvasWidth / 2, 30);

  let cy = 56;

  // Statement card
  noStroke();
  fill(255);
  rect(pad, cy, contentW, 80, 8);
  stroke(200);
  strokeWeight(1);
  noFill();
  rect(pad, cy, contentW, 80, 8);
  noStroke();

  // Statement text
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  noStroke();
  text('"' + q.text + '"', canvasWidth / 2, cy + 40, contentW - 20, 60);

  cy += 100;

  // Instruction
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize - 1);
  textStyle(NORMAL);
  noStroke();
  text('Is this a Theory, a Law, or a Model?', canvasWidth / 2, cy);

  cy += 30;

  // Three buttons
  let btnW = min(130, (canvasWidth - pad * 2 - 20) / 3);
  let btnH = 44;
  let btnGap = 10;
  let totalBtnW = btnW * 3 + btnGap * 2;
  let startX = (canvasWidth - totalBtnW) / 2;

  let btnData = [
    { label: 'Theory', col: 'teal' },
    { label: 'Law', col: 'goldenrod' },
    { label: 'Model', col: 'coral' }
  ];

  for (let i = 0; i < 3; i++) {
    let bx = startX + i * (btnW + btnGap);
    let hover = mouseX > bx && mouseX < bx + btnW && mouseY > cy && mouseY < cy + btnH;

    noStroke();
    if (quizAnswer !== null) {
      if (btnData[i].label === q.answer) {
        fill('green');
      } else if (quizAnswer === 'wrong' && btnData[i].label !== q.answer) {
        fill(180);
      } else {
        fill(btnData[i].col);
      }
    } else {
      if (hover) {
        fill(lerpColor(color(btnData[i].col), color(255), 0.2));
      } else {
        fill(btnData[i].col);
      }
    }
    rect(bx, cy, btnW, btnH, 6);

    fill('white');
    textAlign(CENTER, CENTER);
    textSize(defaultTextSize);
    textStyle(BOLD);
    noStroke();
    text(btnData[i].label, bx + btnW / 2, cy + btnH / 2);
  }

  // Store button info for click detection
  this._quizBtnInfo = { startX: startX, y: cy, w: btnW, h: btnH, gap: btnGap };

  cy += btnH + 24;

  // Feedback
  if (quizAnswer !== null) {
    textAlign(CENTER, TOP);
    noStroke();

    if (quizAnswer === 'correct') {
      fill('green');
      textSize(defaultTextSize + 1);
      textStyle(BOLD);
      text('Correct!', canvasWidth / 2, cy);
    } else {
      fill('crimson');
      textSize(defaultTextSize + 1);
      textStyle(BOLD);
      text('Not quite — it\'s a ' + q.answer + '.', canvasWidth / 2, cy);
    }

    cy += 24;
    fill('black');
    textSize(defaultTextSize - 2);
    textStyle(NORMAL);
    noStroke();
    text(q.explanation, canvasWidth / 2, cy, contentW, 50);

    cy += 54;

    // Next question button
    let nextW = 150;
    let nextX = canvasWidth / 2 - nextW / 2;
    let nextH = 36;
    let nextHover = mouseX > nextX && mouseX < nextX + nextW && mouseY > cy && mouseY < cy + nextH;
    noStroke();
    fill(nextHover ? color(60, 60, 160) : 'steelblue');
    rect(nextX, cy, nextW, nextH, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(defaultTextSize - 1);
    textStyle(BOLD);
    noStroke();
    text(quizIndex < quizBank.length - 1 ? 'Next Question' : 'See Results', nextX + nextW / 2, cy + nextH / 2);
    this._nextBtn = { x: nextX, y: cy, w: nextW, h: nextH };
  } else {
    this._nextBtn = null;
  }
}

function drawQuizComplete() {
  let pad = 16;
  let contentW = canvasWidth - pad * 2;

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 4);
  textStyle(BOLD);
  text('Quiz Complete!', canvasWidth / 2, 40);

  // Score display
  let cy = 90;
  let pct = quizTotal > 0 ? round(quizScore / quizTotal * 100) : 0;

  // Score circle
  let circleR = 60;
  noStroke();
  fill(240);
  ellipse(canvasWidth / 2, cy + circleR, circleR * 2, circleR * 2);

  let scoreCol = pct >= 80 ? 'green' : pct >= 50 ? 'goldenrod' : 'crimson';
  fill(scoreCol);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  noStroke();
  text(quizScore + '/' + quizTotal, canvasWidth / 2, cy + circleR - 6);

  textSize(defaultTextSize - 2);
  fill('dimgray');
  noStroke();
  text(pct + '%', canvasWidth / 2, cy + circleR + 18);

  cy += circleR * 2 + 30;

  // Message
  let msg = pct >= 80 ? 'Excellent! You can distinguish theories, laws, and models.' :
            pct >= 50 ? 'Good effort! Review the key differences and try again.' :
            'Keep studying! Remember: theories explain, laws describe, models represent.';
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize);
  textStyle(NORMAL);
  noStroke();
  text(msg, canvasWidth / 2, cy, contentW, 60);

  cy += 60;

  // Retry button
  let retryW = 140;
  let retryX = canvasWidth / 2 - retryW / 2;
  let retryH = 38;
  let retryHover = mouseX > retryX && mouseX < retryX + retryW && mouseY > cy && mouseY < cy + retryH;
  noStroke();
  fill(retryHover ? color(60, 60, 160) : 'steelblue');
  rect(retryX, cy, retryW, retryH, 6);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text('Try Again', retryX + retryW / 2, cy + retryH / 2);
  this._retryBtn = { x: retryX, y: cy, w: retryW, h: retryH };
}

function mousePressed() {
  if (!quizMode) return;

  // Quiz complete retry button
  if (quizIndex >= quizBank.length) {
    let rb = this._retryBtn;
    if (rb && mouseX > rb.x && mouseX < rb.x + rb.w && mouseY > rb.y && mouseY < rb.y + rb.h) {
      quizIndex = 0;
      quizAnswer = null;
      quizFeedback = "";
      quizScore = 0;
      quizTotal = 0;
    }
    return;
  }

  // Classification buttons
  let bi = this._quizBtnInfo;
  if (bi && quizAnswer === null) {
    let labels = ['Theory', 'Law', 'Model'];
    for (let i = 0; i < 3; i++) {
      let bx = bi.startX + i * (bi.w + bi.gap);
      if (mouseX > bx && mouseX < bx + bi.w && mouseY > bi.y && mouseY < bi.y + bi.h) {
        let q = quizBank[quizIndex];
        quizTotal++;
        if (labels[i] === q.answer) {
          quizAnswer = 'correct';
          quizScore++;
        } else {
          quizAnswer = 'wrong';
        }
      }
    }
  }

  // Next question button
  let nb = this._nextBtn;
  if (nb && quizAnswer !== null) {
    if (mouseX > nb.x && mouseX < nb.x + nb.w && mouseY > nb.y && mouseY < nb.y + nb.h) {
      quizIndex++;
      quizAnswer = null;
      quizFeedback = "";
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  var mainElement = document.querySelector('main');
  if (mainElement) {
    containerWidth = mainElement.offsetWidth;
    if (containerWidth > 0) {
      canvasWidth = containerWidth;
    }
  }
}
