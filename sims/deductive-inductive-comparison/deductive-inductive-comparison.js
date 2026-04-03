// Deductive vs Inductive Reasoning Comparison MicroSim
// CANVAS_HEIGHT: 520

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- Domain data ----
let domains = {
  "Mathematics": {
    deductive: {
      premises: ["All squares have 4 equal sides.", "Shape ABCD is a square."],
      conclusion: "Therefore, ABCD has 4 equal sides.",
      certainty: 100
    },
    inductive: {
      premises: ["The first 100 primes > 2 are odd.", "The first 1000 primes > 2 are odd."],
      conclusion: "All primes greater than 2 are odd.",
      certainty: 95
    }
  },
  "Natural Sciences": {
    deductive: {
      premises: ["All metals expand when heated.", "Iron is a metal."],
      conclusion: "Therefore, iron expands when heated.",
      certainty: 100
    },
    inductive: {
      premises: ["Every observed swan in Europe was white.", "Thousands of swans were observed."],
      conclusion: "All swans are white.",
      certainty: 60
    }
  },
  "History": {
    deductive: {
      premises: ["Empires that overextend militarily decline.", "The Roman Empire overextended militarily."],
      conclusion: "Therefore, the Roman Empire declined.",
      certainty: 85
    },
    inductive: {
      premises: ["Revolution followed economic crisis in France (1789).", "Revolution followed economic crisis in Russia (1917)."],
      conclusion: "Economic crises often lead to revolution.",
      certainty: 55
    }
  },
  "Ethics": {
    deductive: {
      premises: ["It is wrong to cause unnecessary suffering.", "Factory farming causes unnecessary suffering."],
      conclusion: "Therefore, factory farming is wrong.",
      certainty: 90
    },
    inductive: {
      premises: ["Most people believe stealing is wrong.", "Most cultures prohibit stealing."],
      conclusion: "Stealing is universally wrong.",
      certainty: 50
    }
  }
};

let domainKeys = Object.keys(domains);
let currentDomain = domainKeys[0];

// ---- Quiz state ----
let quizMode = false;
let quizArgument = null;
let quizAnswer = null; // null = unanswered, "correct", "wrong"
let quizCorrectType = "";
let quizFeedback = "";

// ---- Quiz bank ----
let quizBank = [
  { premises: ["All birds have feathers.", "A robin is a bird."], conclusion: "Therefore, a robin has feathers.", type: "Deductive" },
  { premises: ["Every cat I have met purrs.", "I have met 50 cats."], conclusion: "All cats purr.", type: "Inductive" },
  { premises: ["No reptiles are mammals.", "A lizard is a reptile."], conclusion: "Therefore, a lizard is not a mammal.", type: "Deductive" },
  { premises: ["The sun has risen every day in recorded history."], conclusion: "The sun will rise tomorrow.", type: "Inductive" },
  { premises: ["All humans are mortal.", "Socrates is a human."], conclusion: "Therefore, Socrates is mortal.", type: "Deductive" },
  { premises: ["9 out of 10 doctors surveyed recommend X.", "The survey was nationwide."], conclusion: "Most doctors recommend X.", type: "Inductive" },
  { premises: ["If it rains, the ground gets wet.", "It is raining."], conclusion: "Therefore, the ground is wet.", type: "Deductive" },
  { premises: ["Every emerald observed so far has been green."], conclusion: "All emeralds are green.", type: "Inductive" }
];

// ---- Controls ----
let domainSelect;
let quizButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  domainSelect = createSelect();
  domainSelect.parent(mainElement);
  for (let i = 0; i < domainKeys.length; i++) {
    domainSelect.option(domainKeys[i]);
  }
  domainSelect.changed(function () {
    currentDomain = domainSelect.value();
    quizMode = false;
    quizAnswer = null;
  });

  quizButton = createButton('Test Yourself');
  quizButton.parent(mainElement);
  quizButton.mousePressed(function () {
    if (quizMode) {
      quizMode = false;
      quizAnswer = null;
    } else {
      startQuiz();
    }
  });

  describe('A side-by-side comparison of deductive and inductive reasoning with example arguments, certainty meters, and a quiz mode.');
}

function startQuiz() {
  quizMode = true;
  quizAnswer = null;
  quizFeedback = "";
  let idx = floor(random(quizBank.length));
  quizArgument = quizBank[idx];
  quizCorrectType = quizArgument.type;
}

function draw() {
  updateCanvasSize();

  // ---- Draw area background ----
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // ---- Control area background ----
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Position controls ----
  let ctrlY = drawHeight + 18;
  domainSelect.position(margin, ctrlY);
  domainSelect.style('font-size', '13px');
  quizButton.position(margin + 170, ctrlY);
  quizButton.style('font-size', '13px');
  if (quizMode) {
    quizButton.html('Back to Compare');
  } else {
    quizButton.html('Test Yourself');
  }

  if (quizMode) {
    drawQuizMode();
  } else {
    drawCompareMode();
  }
}

function drawCompareMode() {
  let data = domains[currentDomain];
  let colW = (canvasWidth - margin * 3) / 2;
  let leftX = margin;
  let rightX = margin * 2 + colW;

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Deductive vs Inductive Reasoning', canvasWidth / 2, 6);

  // ---- Domain subtitle ----
  textSize(defaultTextSize - 1);
  textStyle(ITALIC);
  fill('dimgray');
  text('Domain: ' + currentDomain, canvasWidth / 2, 26);

  let topY = 44;

  // ---- Left column: Deductive ----
  drawColumn(leftX, topY, colW, 'Deductive', 'teal', data.deductive, 'General → Specific');

  // ---- Right column: Inductive ----
  drawColumn(rightX, topY, colW, 'Inductive', 'goldenrod', data.inductive, 'Specific → General');

  // ---- Central comparison panel ----
  drawCenterPanel(topY + 300);
}

function drawColumn(x, y, w, label, col, data, direction) {
  let pad = 8;
  let innerW = w - pad * 2;

  // Column header background
  noStroke();
  fill(col);
  rect(x, y, w, 28, 6, 6, 0, 0);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text(label, x + w / 2, y + 14);

  // Column body background
  fill(255, 255, 255, 200);
  noStroke();
  rect(x, y + 28, w, 268, 0, 0, 6, 6);

  let cy = y + 38;

  // Direction arrow
  noStroke();
  fill(col);
  textAlign(CENTER, TOP);
  textSize(defaultTextSize - 2);
  textStyle(BOLD);
  text(direction, x + w / 2, cy);
  cy += 18;

  // Draw direction arrow
  drawArrow(x + w / 2, cy, col, label === 'Deductive');
  cy += 24;

  // Premises label
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(defaultTextSize - 2);
  textStyle(BOLD);
  text('Premises:', x + pad, cy);
  cy += 16;

  // Premise boxes
  textStyle(NORMAL);
  fill('black');
  textSize(defaultTextSize - 3);
  for (let i = 0; i < data.premises.length; i++) {
    // Premise background
    noStroke();
    fill(240);
    rect(x + pad, cy, innerW, 36, 4);
    fill('black');
    noStroke();
    textAlign(LEFT, TOP);
    text(data.premises[i], x + pad + 4, cy + 4, innerW - 8, 32);
    cy += 40;
  }

  cy += 4;

  // Down arrow to conclusion
  stroke(col);
  strokeWeight(2);
  let arrowX = x + w / 2;
  line(arrowX, cy, arrowX, cy + 16);
  line(arrowX, cy + 16, arrowX - 5, cy + 11);
  line(arrowX, cy + 16, arrowX + 5, cy + 11);
  noStroke();
  cy += 22;

  // Conclusion label
  fill(col);
  textAlign(LEFT, TOP);
  textSize(defaultTextSize - 2);
  textStyle(BOLD);
  noStroke();
  text('Conclusion:', x + pad, cy);
  cy += 16;

  // Conclusion box
  let cBg = col === 'teal' ? color(0, 128, 128, 30) : color(218, 165, 32, 30);
  fill(cBg);
  noStroke();
  rect(x + pad, cy, innerW, 36, 4);
  fill('black');
  textStyle(NORMAL);
  textSize(defaultTextSize - 3);
  textAlign(LEFT, TOP);
  noStroke();
  text(data.conclusion, x + pad + 4, cy + 4, innerW - 8, 32);
  cy += 42;

  // Certainty meter
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(defaultTextSize - 2);
  textStyle(BOLD);
  text('Certainty: ' + data.certainty + '%', x + pad, cy);
  cy += 16;

  // Meter background
  fill(220);
  noStroke();
  rect(x + pad, cy, innerW, 12, 3);

  // Meter fill
  let meterCol = col === 'teal' ? color(0, 128, 128) : color(218, 165, 32);
  fill(meterCol);
  noStroke();
  let fillW = map(data.certainty, 0, 100, 0, innerW);
  rect(x + pad, cy, fillW, 12, 3);
}

function drawArrow(x, y, col, isDown) {
  // Draw a thick directional arrow
  stroke(col);
  strokeWeight(2);
  if (isDown) {
    // Down arrow: general to specific
    line(x, y, x, y + 14);
    line(x, y + 14, x - 6, y + 8);
    line(x, y + 14, x + 6, y + 8);
  } else {
    // Up arrow: specific to general
    line(x, y + 14, x, y);
    line(x, y, x - 6, y + 6);
    line(x, y, x + 6, y + 6);
  }
  noStroke();
}

function drawCenterPanel(y) {
  let panelW = canvasWidth - margin * 2;
  let panelX = margin;
  let panelH = 112;

  // Panel background
  noStroke();
  fill(245, 245, 250);
  rect(panelX, y, panelW, panelH, 6);

  // Panel title
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize - 1);
  textStyle(BOLD);
  noStroke();
  text('Key Differences', panelX + panelW / 2, y + 6);

  let tableY = y + 24;
  let col1X = panelX + 8;
  let col2X = panelX + panelW * 0.33;
  let col3X = panelX + panelW * 0.66;
  let rowH = 18;

  // Header row
  textSize(defaultTextSize - 3);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  noStroke();
  fill('dimgray');
  text('Feature', col1X, tableY);
  fill('teal');
  text('Deductive', col2X, tableY);
  fill('goldenrod');
  text('Inductive', col3X, tableY);

  tableY += rowH;

  // Data rows
  textStyle(NORMAL);
  fill('black');
  let rows = [
    ['Direction', 'General → Specific', 'Specific → General'],
    ['Conclusion', 'Certain (if valid)', 'Probable'],
    ['New info?', 'No new knowledge', 'Extends knowledge'],
    ['Risk', 'Unsound premises', 'Hasty generalization']
  ];

  for (let i = 0; i < rows.length; i++) {
    noStroke();
    if (i % 2 === 0) {
      fill(235, 240, 248);
      rect(panelX + 4, tableY - 2, panelW - 8, rowH, 2);
    }
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(defaultTextSize - 3);
    noStroke();
    text(rows[i][0], col1X, tableY);
    fill('black');
    text(rows[i][1], col2X, tableY);
    text(rows[i][2], col3X, tableY);
    tableY += rowH;
  }
}

function drawQuizMode() {
  if (!quizArgument) return;

  let pad = 16;
  let contentW = canvasWidth - pad * 2;

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Test Yourself: Classify This Argument', canvasWidth / 2, 10);

  let cy = 44;

  // Argument card
  noStroke();
  fill(255);
  rect(pad, cy, contentW, 180, 8);
  stroke(180);
  strokeWeight(1);
  noFill();
  rect(pad, cy, contentW, 180, 8);
  noStroke();

  let innerPad = 12;
  cy += innerPad;

  // Premises
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(defaultTextSize - 1);
  textStyle(BOLD);
  noStroke();
  text('Premises:', pad + innerPad, cy);
  cy += 20;

  textStyle(NORMAL);
  fill('black');
  textSize(defaultTextSize - 2);
  for (let i = 0; i < quizArgument.premises.length; i++) {
    noStroke();
    text((i + 1) + '. ' + quizArgument.premises[i], pad + innerPad, cy, contentW - innerPad * 2, 40);
    cy += 34;
  }

  cy += 6;

  // Conclusion
  fill('dimgray');
  textSize(defaultTextSize - 1);
  textStyle(BOLD);
  noStroke();
  text('Conclusion:', pad + innerPad, cy);
  cy += 20;

  textStyle(NORMAL);
  fill('black');
  textSize(defaultTextSize - 2);
  noStroke();
  text(quizArgument.conclusion, pad + innerPad, cy, contentW - innerPad * 2, 40);

  cy = 240;

  // Question
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text('Is this argument deductive or inductive?', canvasWidth / 2, cy);

  cy += 30;

  // Answer buttons (drawn as clickable rectangles)
  let btnW = 140;
  let btnH = 40;
  let btnGap = 20;
  let btnLeftX = canvasWidth / 2 - btnW - btnGap / 2;
  let btnRightX = canvasWidth / 2 + btnGap / 2;

  // Deductive button
  let dedHover = mouseX > btnLeftX && mouseX < btnLeftX + btnW && mouseY > cy && mouseY < cy + btnH;
  noStroke();
  if (quizAnswer !== null && quizCorrectType === 'Deductive') {
    fill('teal');
  } else if (quizAnswer === 'wrong' && quizCorrectType !== 'Deductive') {
    fill(200, 80, 80);
  } else {
    fill(dedHover ? color(0, 148, 148) : 'teal');
  }
  rect(btnLeftX, cy, btnW, btnH, 6);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text('Deductive', btnLeftX + btnW / 2, cy + btnH / 2);

  // Inductive button
  let indHover = mouseX > btnRightX && mouseX < btnRightX + btnW && mouseY > cy && mouseY < cy + btnH;
  noStroke();
  if (quizAnswer !== null && quizCorrectType === 'Inductive') {
    fill('goldenrod');
  } else if (quizAnswer === 'wrong' && quizCorrectType !== 'Inductive') {
    fill(200, 80, 80);
  } else {
    fill(indHover ? color(238, 185, 52) : 'goldenrod');
  }
  rect(btnRightX, cy, btnW, btnH, 6);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  noStroke();
  text('Inductive', btnRightX + btnW / 2, cy + btnH / 2);

  // Store button positions for click detection
  this._quizBtns = { leftX: btnLeftX, rightX: btnRightX, y: cy, w: btnW, h: btnH };

  cy += btnH + 20;

  // Feedback
  if (quizAnswer !== null) {
    textAlign(CENTER, TOP);
    textSize(defaultTextSize);
    noStroke();
    if (quizAnswer === 'correct') {
      fill('green');
      textStyle(BOLD);
      text('Correct!', canvasWidth / 2, cy);
      cy += 22;
      fill('black');
      textStyle(NORMAL);
      textSize(defaultTextSize - 2);
      text(quizFeedback, canvasWidth / 2, cy, contentW, 60);
    } else {
      fill('red');
      textStyle(BOLD);
      text('Not quite. Try again!', canvasWidth / 2, cy);
      cy += 22;
      fill('black');
      textStyle(NORMAL);
      textSize(defaultTextSize - 2);
      text(quizFeedback, canvasWidth / 2, cy, contentW, 60);
    }

    // Next question button
    cy += 50;
    let nextW = 140;
    let nextX = canvasWidth / 2 - nextW / 2;
    let nextHover = mouseX > nextX && mouseX < nextX + nextW && mouseY > cy && mouseY < cy + 36;
    noStroke();
    fill(nextHover ? color(80, 80, 180) : 'steelblue');
    rect(nextX, cy, nextW, 36, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(defaultTextSize - 1);
    textStyle(BOLD);
    noStroke();
    text('Next Question', nextX + nextW / 2, cy + 18);
    this._nextBtn = { x: nextX, y: cy, w: nextW, h: 36 };
  } else {
    this._nextBtn = null;
  }
}

function mousePressed() {
  if (!quizMode || !quizArgument) return;

  let btns = this._quizBtns;
  if (btns && quizAnswer === null) {
    // Check deductive button
    if (mouseX > btns.leftX && mouseX < btns.leftX + btns.w && mouseY > btns.y && mouseY < btns.y + btns.h) {
      checkQuizAnswer('Deductive');
    }
    // Check inductive button
    if (mouseX > btns.rightX && mouseX < btns.rightX + btns.w && mouseY > btns.y && mouseY < btns.y + btns.h) {
      checkQuizAnswer('Inductive');
    }
  }

  // Check next question button
  let nb = this._nextBtn;
  if (nb && quizAnswer !== null) {
    if (mouseX > nb.x && mouseX < nb.x + nb.w && mouseY > nb.y && mouseY < nb.y + nb.h) {
      startQuiz();
    }
  }
}

function checkQuizAnswer(chosen) {
  if (chosen === quizCorrectType) {
    quizAnswer = 'correct';
    if (quizCorrectType === 'Deductive') {
      quizFeedback = 'This argument moves from general premises to a specific conclusion. If the premises are true, the conclusion must follow.';
    } else {
      quizFeedback = 'This argument generalizes from specific observations. The conclusion is probable but not guaranteed.';
    }
  } else {
    quizAnswer = 'wrong';
    if (quizCorrectType === 'Deductive') {
      quizFeedback = 'Hint: Look at the direction. Does it move from general rules to a specific case?';
    } else {
      quizFeedback = 'Hint: Look at the direction. Does it generalize from specific observations?';
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
