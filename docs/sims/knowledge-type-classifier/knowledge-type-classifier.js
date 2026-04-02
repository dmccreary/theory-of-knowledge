// Knowledge Type Classifier Quiz
// Classify examples by type (Propositional/Procedural/Acquaintance)
// and source (A priori / A posteriori)

let examples = [
  {text:"Knowing that Paris is the capital of France", type:"Propositional", source:"A posteriori", explanation:"A fact (knowing-that) learned through experience or testimony."},
  {text:"Knowing how to ride a bicycle", type:"Procedural", source:"A posteriori", explanation:"A skill (knowing-how) acquired through physical practice."},
  {text:"Knowing what chocolate tastes like", type:"Acquaintance", source:"A posteriori", explanation:"Direct experiential knowledge that can't be fully communicated in words."},
  {text:"Knowing that 7+5=12", type:"Propositional", source:"A priori", explanation:"A mathematical truth known through reason alone."},
  {text:"Knowing how to solve a quadratic equation", type:"Procedural", source:"A priori", explanation:"A procedure based on mathematical reasoning."},
  {text:"Knowing the feeling of weightlessness", type:"Acquaintance", source:"A posteriori", explanation:"Requires direct experience — cannot be known through description alone."},
  {text:"Knowing that all bachelors are unmarried", type:"Propositional", source:"A priori", explanation:"True by definition — no experience needed."},
  {text:"Knowing how to speak Japanese", type:"Procedural", source:"A posteriori", explanation:"A skill acquired through study and practice."},
  {text:"Knowing what it's like to see the color red", type:"Acquaintance", source:"A posteriori", explanation:"Subjective experience (qualia) that requires direct perception."},
  {text:"Knowing that nothing can be both true and false", type:"Propositional", source:"A priori", explanation:"A logical principle known through reason."},
  {text:"Knowing how to play chess", type:"Procedural", source:"A posteriori", explanation:"Combines learned rules with practiced strategy."},
  {text:"Knowing a close friend's personality", type:"Acquaintance", source:"A posteriori", explanation:"Built through sustained personal interaction."}
];

// CANVAS_HEIGHT: 520
let drawHeight = 450;
let controlHeight = 70;
let canvasWidth = 400;

// State
let currentIndex = 0;
let phase = 1; // 1 = type selection, 2 = source selection, 3 = feedback
let typeCorrect = false;
let sourceCorrect = false;
let score = 0;
let totalPossible = 0;
let selectedType = "";
let selectedSource = "";
let showingFeedback = false;
let feedbackMessage = "";
let feedbackColor = "green";
let quizComplete = false;
let shuffledExamples = [];

// Buttons
let btnPropositional, btnProcedural, btnAcquaintance;
let btnApriori, btnAposteriori;
let btnNext;
let scoreLabel;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, 520);
  canvas.parent(document.querySelector('main'));
  textWrap(WORD);

  // Shuffle examples
  shuffledExamples = shuffle([...examples]);

  // Type buttons
  btnPropositional = createButton('Propositional');
  btnPropositional.mousePressed(() => checkType('Propositional'));
  styleButton(btnPropositional, 'teal');

  btnProcedural = createButton('Procedural');
  btnProcedural.mousePressed(() => checkType('Procedural'));
  styleButton(btnProcedural, 'goldenrod');

  btnAcquaintance = createButton('Acquaintance');
  btnAcquaintance.mousePressed(() => checkType('Acquaintance'));
  styleButton(btnAcquaintance, 'coral');

  // Source buttons
  btnApriori = createButton('A priori');
  btnApriori.mousePressed(() => checkSource('A priori'));
  styleButton(btnApriori, 'mediumpurple');

  btnAposteriori = createButton('A posteriori');
  btnAposteriori.mousePressed(() => checkSource('A posteriori'));
  styleButton(btnAposteriori, 'steelblue');

  // Next button
  btnNext = createButton('Next →');
  btnNext.mousePressed(nextQuestion);
  styleButton(btnNext, 'gray');

  // Score label
  scoreLabel = createDiv('Score: 0 / 0');
  scoreLabel.style('font-size', '16px');
  scoreLabel.style('font-weight', 'bold');
  scoreLabel.style('color', '#333');
  scoreLabel.parent(document.querySelector('main'));

  updateButtonVisibility();
  describe('A classification quiz where students identify knowledge types and sources for 12 examples.');
}

function draw() {
  // Draw area
  noStroke();
  fill('aliceblue');
  rect(0, 0, width, drawHeight);

  // Control area
  fill('silver');
  rect(0, drawHeight, width, controlHeight);

  if (quizComplete) {
    drawFinalScreen();
  } else {
    drawProgressBar();
    drawExampleCard();
    drawPhaseLabel();
    drawFeedback();
  }

  positionButtons();
}

function drawProgressBar() {
  let barX = 20;
  let barY = 15;
  let barW = width - 40;
  let barH = 12;
  let progress = currentIndex / shuffledExamples.length;

  // Background
  noStroke();
  fill(220);
  rect(barX, barY, barW, barH, 6);

  // Fill
  fill('teal');
  rect(barX, barY, barW * progress, barH, 6);

  // Label
  fill(100);
  textSize(11);
  textAlign(RIGHT, CENTER);
  text((currentIndex) + ' / ' + shuffledExamples.length, barX + barW, barY + barH + 12);
}

function drawExampleCard() {
  let cardX = 20;
  let cardY = 50;
  let cardW = width - 40;
  let cardH = 100;

  // Card shadow
  fill(200);
  rect(cardX + 3, cardY + 3, cardW, cardH, 10);

  // Card
  fill('white');
  rect(cardX, cardY, cardW, cardH, 10);

  // Example text
  fill(40);
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  text('"' + shuffledExamples[currentIndex].text + '"', cardX + 15, cardY + 10, cardW - 30, cardH - 20);
  textStyle(NORMAL);
}

function drawPhaseLabel() {
  let labelY = 165;

  textAlign(CENTER, TOP);
  textSize(14);
  fill(80);

  if (phase === 1) {
    text('Step 1: What type of knowledge is this?', width / 2, labelY);
  } else if (phase === 2) {
    // Show the correct type result
    fill('teal');
    textSize(13);
    text('✓ Type: ' + shuffledExamples[currentIndex].type, width / 2, labelY);
    fill(80);
    textSize(14);
    text('Step 2: Is this knowledge a priori or a posteriori?', width / 2, labelY + 22);
  } else if (phase === 3) {
    // Show both results
    let ex = shuffledExamples[currentIndex];
    fill('teal');
    textSize(13);
    text('✓ Type: ' + ex.type, width / 2, labelY);
    fill('steelblue');
    text('✓ Source: ' + ex.source, width / 2, labelY + 20);
  }
}

function drawFeedback() {
  if (!showingFeedback) return;

  let fbY = 270;
  let fbW = width - 40;
  let fbX = 20;
  let fbH = 140;

  // Feedback box
  if (feedbackColor === 'green') {
    fill(230, 250, 230);
  } else if (feedbackColor === 'red') {
    fill(255, 235, 235);
  } else {
    fill(240, 240, 255);
  }
  rect(fbX, fbY, fbW, fbH, 8);

  // Feedback header
  textAlign(CENTER, TOP);
  if (feedbackColor === 'green') {
    fill('green');
  } else {
    fill('firebrick');
  }
  textSize(15);
  textStyle(BOLD);
  text(feedbackMessage, fbX + 10, fbY + 10, fbW - 20);
  textStyle(NORMAL);

  // Explanation (in phase 3)
  if (phase === 3) {
    fill(60);
    textSize(13);
    text(shuffledExamples[currentIndex].explanation, fbX + 10, fbY + 50, fbW - 20);
  }
}

function drawFinalScreen() {
  let pct = totalPossible > 0 ? round((score / totalPossible) * 100) : 0;

  textAlign(CENTER, CENTER);

  // Title
  fill(40);
  textSize(24);
  textStyle(BOLD);
  text('Quiz Complete!', width / 2, 80);
  textStyle(NORMAL);

  // Score circle
  let cx = width / 2;
  let cy = 190;
  let radius = 70;

  if (pct >= 80) {
    fill(200, 240, 200);
  } else if (pct >= 50) {
    fill(255, 245, 200);
  } else {
    fill(255, 220, 220);
  }
  ellipse(cx, cy, radius * 2, radius * 2);

  fill(40);
  textSize(36);
  textStyle(BOLD);
  text(pct + '%', cx, cy - 8);
  textStyle(NORMAL);
  textSize(14);
  text(score + ' / ' + totalPossible, cx, cy + 22);

  // Message
  textSize(16);
  fill(60);
  let msg = '';
  if (pct >= 90) {
    msg = 'Outstanding! You really understand knowledge types.';
  } else if (pct >= 70) {
    msg = 'Great work! A solid understanding of knowledge classification.';
  } else if (pct >= 50) {
    msg = 'Good effort! Review the types and sources for stronger results.';
  } else {
    msg = 'Keep exploring! Revisit propositional, procedural, and acquaintance knowledge.';
  }
  text(msg, 30, 290, width - 60);

  // Breakdown
  textSize(13);
  fill(100);
  textAlign(CENTER, TOP);
  text('Propositional = knowing-that (facts & claims)\nProcedural = knowing-how (skills & methods)\nAcquaintance = knowing by experience (direct familiarity)', 30, 340, width - 60);

  text('A priori = known through reason alone\nA posteriori = known through experience', 30, 400, width - 60);
}

function checkType(chosen) {
  if (phase !== 1) return;
  let correct = shuffledExamples[currentIndex].type;
  if (chosen === correct) {
    typeCorrect = true;
    score++;
    totalPossible++;
    feedbackMessage = '✓ Correct! This is ' + correct + ' knowledge.';
    feedbackColor = 'green';
    phase = 2;
  } else {
    typeCorrect = false;
    totalPossible++;
    feedbackMessage = '✗ Not quite. This is ' + correct + ' knowledge, not ' + chosen + '.';
    feedbackColor = 'red';
    phase = 2;
  }
  selectedType = chosen;
  showingFeedback = true;
  updateButtonVisibility();
}

function checkSource(chosen) {
  if (phase !== 2) return;
  let correct = shuffledExamples[currentIndex].source;
  if (chosen === correct) {
    sourceCorrect = true;
    score++;
    totalPossible++;
    feedbackMessage = '✓ Correct! This is ' + correct + ' knowledge.';
    feedbackColor = 'green';
  } else {
    sourceCorrect = false;
    totalPossible++;
    feedbackMessage = '✗ Not quite. This is ' + correct + ', not ' + chosen + '.';
    feedbackColor = 'red';
  }
  selectedSource = chosen;
  phase = 3;
  showingFeedback = true;
  updateButtonVisibility();
}

function nextQuestion() {
  if (quizComplete) {
    // Restart
    currentIndex = 0;
    score = 0;
    totalPossible = 0;
    quizComplete = false;
    shuffledExamples = shuffle([...examples]);
  } else {
    currentIndex++;
    if (currentIndex >= shuffledExamples.length) {
      quizComplete = true;
      updateButtonVisibility();
      updateScoreLabel();
      return;
    }
  }
  phase = 1;
  showingFeedback = false;
  typeCorrect = false;
  sourceCorrect = false;
  selectedType = "";
  selectedSource = "";
  feedbackMessage = "";
  updateButtonVisibility();
  updateScoreLabel();
}

function updateButtonVisibility() {
  if (quizComplete) {
    btnPropositional.hide();
    btnProcedural.hide();
    btnAcquaintance.hide();
    btnApriori.hide();
    btnAposteriori.hide();
    btnNext.show();
    btnNext.html('Restart Quiz');
    return;
  }

  if (phase === 1) {
    btnPropositional.show();
    btnProcedural.show();
    btnAcquaintance.show();
    btnApriori.hide();
    btnAposteriori.hide();
    btnNext.hide();
  } else if (phase === 2) {
    btnPropositional.hide();
    btnProcedural.hide();
    btnAcquaintance.hide();
    btnApriori.show();
    btnAposteriori.show();
    btnNext.hide();
  } else if (phase === 3) {
    btnPropositional.hide();
    btnProcedural.hide();
    btnAcquaintance.hide();
    btnApriori.hide();
    btnAposteriori.hide();
    btnNext.show();
    btnNext.html('Next →');
  }
}

function updateScoreLabel() {
  scoreLabel.html('Score: ' + score + ' / ' + totalPossible);
}

function styleButton(btn, bgColor) {
  btn.style('background-color', bgColor);
  btn.style('color', 'white');
  btn.style('border', 'none');
  btn.style('padding', '10px 16px');
  btn.style('border-radius', '6px');
  btn.style('font-size', '14px');
  btn.style('font-weight', 'bold');
  btn.style('cursor', 'pointer');
  btn.parent(document.querySelector('main'));
}

function positionButtons() {
  let mainEl = document.querySelector('main');
  let canvasEl = mainEl.querySelector('canvas');
  if (!canvasEl) return;

  let canvasRect = canvasEl.getBoundingClientRect();
  let mainRect = mainEl.getBoundingClientRect();
  let offsetX = canvasRect.left - mainRect.left;
  let offsetY = canvasRect.top - mainRect.top;

  // Type buttons row — centered in draw area below phase label
  let typeBtnY = offsetY + 195;
  let typeButtons = [btnPropositional, btnProcedural, btnAcquaintance];
  let typeWidths = typeButtons.map(b => b.elt.offsetWidth);
  let typeGap = 8;
  let typeTotalW = typeWidths.reduce((a, b) => a + b, 0) + typeGap * (typeButtons.length - 1);
  let typeStartX = offsetX + (width - typeTotalW) / 2;
  for (let i = 0; i < typeButtons.length; i++) {
    typeButtons[i].position(typeStartX, typeBtnY);
    typeStartX += typeWidths[i] + typeGap;
  }

  // Source buttons row — similar position
  let srcBtnY = offsetY + 215;
  let srcButtons = [btnApriori, btnAposteriori];
  let srcWidths = srcButtons.map(b => b.elt.offsetWidth);
  let srcGap = 12;
  let srcTotalW = srcWidths.reduce((a, b) => a + b, 0) + srcGap;
  let srcStartX = offsetX + (width - srcTotalW) / 2;
  for (let i = 0; i < srcButtons.length; i++) {
    srcButtons[i].position(srcStartX, srcBtnY);
    srcStartX += srcWidths[i] + srcGap;
  }

  // Control area: Next button and score
  let ctrlY = offsetY + drawHeight + 15;
  btnNext.position(offsetX + 20, ctrlY);
  scoreLabel.position(offsetX + width - 140, ctrlY + 2);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, 520);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = min(mainEl.offsetWidth, 600);
  } else {
    canvasWidth = 400;
  }
}
