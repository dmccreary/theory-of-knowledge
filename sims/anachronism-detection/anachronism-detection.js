// Anachronism Detection Quiz
// CANVAS_HEIGHT: 465

let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 45;
let canvasHeight = 465;
let margin = 25;
let defaultTextSize = 16;

let statements = [
  {text: "The ancient Egyptians should have used electricity to build the pyramids more efficiently.", anachronistic: true, explanation: "Electricity wasn't discovered until the 18th century. Judging ancient builders by modern technology is anachronistic."},
  {text: "Medieval scholars made significant advances in optics and astronomy within their available frameworks.", anachronistic: false, explanation: "This evaluates medieval scholars within their historical context, recognizing their genuine contributions."},
  {text: "It was irresponsible of 18th-century doctors not to use antibiotics to treat infections.", anachronistic: true, explanation: "Antibiotics weren't discovered until 1928. Holding past doctors to standards of knowledge they couldn't have had is anachronistic."},
  {text: "The Roman Empire developed sophisticated road networks that facilitated trade and military movement.", anachronistic: false, explanation: "This accurately describes Roman achievements within their historical context."},
  {text: "Galileo was foolish not to simply publish his findings on the internet to bypass Church censorship.", anachronistic: true, explanation: "The internet didn't exist until the late 20th century. This imposes modern solutions on historical problems."},
  {text: "Indigenous Australian communities developed complex fire management practices over thousands of years.", anachronistic: false, explanation: "This respects the historical development of indigenous knowledge systems within their own timeframe."},
  {text: "Ancient Greek philosophers failed because they didn't use the scientific method.", anachronistic: true, explanation: "The formal scientific method developed centuries later. Greek philosophers used reasoning methods appropriate to their era."},
  {text: "Victorian-era factory conditions reflected the economic and social values of industrializing societies.", anachronistic: false, explanation: "This contextualizes Victorian practices within their historical period without imposing modern standards."},
  {text: "Christopher Columbus was wrong not to use GPS navigation on his voyages.", anachronistic: true, explanation: "GPS technology wasn't available until the late 20th century. This is a clear anachronism."},
  {text: "The printing press revolutionized knowledge dissemination in 15th-century Europe.", anachronistic: false, explanation: "This accurately describes a historical development within its proper time period."}
];

let currentIndex = 0;
let score = 0;
let answered = false;
let lastCorrect = false;
let quizComplete = false;
let shuffledStatements = [];

let btnAnachronistic;
let btnSound;
let btnNext;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  shuffledStatements = shuffle([...statements], true);

  btnAnachronistic = createButton('Anachronistic');
  btnAnachronistic.parent(document.querySelector('main'));
  btnAnachronistic.mousePressed(onAnachronistic);
  btnAnachronistic.style('background-color', 'coral');
  btnAnachronistic.style('color', 'white');
  btnAnachronistic.style('border', 'none');
  btnAnachronistic.style('padding', '8px 14px');
  btnAnachronistic.style('border-radius', '6px');
  btnAnachronistic.style('cursor', 'pointer');
  btnAnachronistic.style('font-size', '14px');
  btnAnachronistic.style('font-weight', 'bold');

  btnSound = createButton('Historically Sound');
  btnSound.parent(document.querySelector('main'));
  btnSound.mousePressed(onSound);
  btnSound.style('background-color', 'teal');
  btnSound.style('color', 'white');
  btnSound.style('border', 'none');
  btnSound.style('padding', '8px 14px');
  btnSound.style('border-radius', '6px');
  btnSound.style('cursor', 'pointer');
  btnSound.style('font-size', '14px');
  btnSound.style('font-weight', 'bold');

  btnNext = createButton('Next');
  btnNext.parent(document.querySelector('main'));
  btnNext.mousePressed(onNext);
  btnNext.style('background-color', 'steelblue');
  btnNext.style('color', 'white');
  btnNext.style('border', 'none');
  btnNext.style('padding', '8px 14px');
  btnNext.style('border-radius', '6px');
  btnNext.style('cursor', 'pointer');
  btnNext.style('font-size', '14px');
  btnNext.style('font-weight', 'bold');

  describe('An interactive quiz where students classify historical statements as anachronistic or historically sound.');
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
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();

  if (quizComplete) {
    drawFinalScreen();
  } else {
    drawProgressBar();
    drawScoreDisplay();
    drawCard();
    if (answered) {
      drawFeedback();
    }
  }

  positionButtons();
}

function drawProgressBar() {
  let barX = margin;
  let barY = 15;
  let barW = canvasWidth - margin * 2;
  let barH = 12;

  // Background
  noStroke();
  fill('lightgray');
  rect(barX, barY, barW, barH, 6);

  // Progress fill
  let progress = currentIndex / shuffledStatements.length;
  fill('steelblue');
  rect(barX, barY, barW * progress, barH, 6);

  // Label
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, CENTER);
  text('Question ' + (currentIndex + 1) + ' of ' + shuffledStatements.length, canvasWidth / 2, barY + barH + 12);
}

function drawScoreDisplay() {
  noStroke();
  fill('darkslategray');
  textSize(14);
  textAlign(RIGHT, TOP);
  text(score + ' / ' + currentIndex + ' correct', canvasWidth - margin, 42);
  textAlign(LEFT, TOP);
}

function drawCard() {
  let cardX = margin;
  let cardY = 60;
  let cardW = canvasWidth - margin * 2;
  let cardH = 140;

  // Card shadow
  noStroke();
  fill(200, 200, 200, 80);
  rect(cardX + 3, cardY + 3, cardW, cardH, 10);

  // Card border color depends on answer state
  if (answered) {
    stroke(lastCorrect ? 'green' : 'red');
    strokeWeight(3);
  } else {
    stroke('silver');
    strokeWeight(1);
  }
  fill('white');
  rect(cardX, cardY, cardW, cardH, 10);

  // Statement text
  noStroke();
  fill('darkslategray');
  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  text(shuffledStatements[currentIndex].text, cardX + 15, cardY + 15, cardW - 30, cardH - 30);
}

function drawFeedback() {
  let fbX = margin;
  let fbY = 215;
  let fbW = canvasWidth - margin * 2;
  let fbH = 130;

  noStroke();
  fill(lastCorrect ? 'honeydew' : 'lavenderblush');
  rect(fbX, fbY, fbW, fbH, 8);

  // Result label
  fill(lastCorrect ? 'green' : 'red');
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(lastCorrect ? 'Correct!' : 'Incorrect', canvasWidth / 2, fbY + 10);

  // Explanation
  textStyle(NORMAL);
  fill('darkslategray');
  textSize(13);
  textAlign(CENTER, TOP);
  textWrap(WORD);
  text(shuffledStatements[currentIndex].explanation, fbX + 12, fbY + 34, fbW - 24, fbH - 44);
}

function drawFinalScreen() {
  noStroke();

  // Title
  fill('darkslategray');
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('Quiz Complete!', canvasWidth / 2, 80);

  // Score
  textStyle(NORMAL);
  textSize(20);
  let pct = Math.round((score / shuffledStatements.length) * 100);
  text(score + ' / ' + shuffledStatements.length + '  (' + pct + '%)', canvasWidth / 2, 130);

  // Message
  textSize(16);
  fill('slategray');
  let msg;
  if (pct === 100) {
    msg = 'Perfect! You have a sharp eye for anachronisms.';
  } else if (pct >= 70) {
    msg = 'Well done! You can spot most anachronistic reasoning.';
  } else if (pct >= 50) {
    msg = 'Good effort. Review the explanations and try again!';
  } else {
    msg = 'Keep practicing — detecting anachronisms is a key skill!';
  }
  textWrap(WORD);
  text(msg, margin + 10, 170, canvasWidth - margin * 2 - 20, 80);

  // Progress bar at 100%
  let barX = margin;
  let barY = 280;
  let barW = canvasWidth - margin * 2;
  let barH = 14;
  fill('lightgray');
  rect(barX, barY, barW, barH, 7);
  fill('green');
  rect(barX, barY, barW, barH, 7);
}

function positionButtons() {
  let btnY = drawHeight + 8;
  let spacing = 10;

  if (quizComplete) {
    btnAnachronistic.hide();
    btnSound.hide();
    btnNext.show();
    btnNext.html('Try Again');
    btnNext.position(canvasWidth / 2 - 40, btnY);
    btnNext.style('background-color', 'steelblue');
  } else if (answered) {
    btnAnachronistic.hide();
    btnSound.hide();
    btnNext.show();
    btnNext.html('Next');
    let nextW = 60;
    btnNext.position(canvasWidth / 2 - nextW / 2, btnY);
  } else {
    btnAnachronistic.show();
    btnSound.show();
    btnNext.hide();

    let totalW = 150 + spacing + 170;
    let startX = (canvasWidth - totalW) / 2;
    btnAnachronistic.position(startX, btnY);
    btnSound.position(startX + 150 + spacing, btnY);
  }
}

function onAnachronistic() {
  if (answered || quizComplete) return;
  answered = true;
  lastCorrect = shuffledStatements[currentIndex].anachronistic === true;
  if (lastCorrect) score++;
}

function onSound() {
  if (answered || quizComplete) return;
  answered = true;
  lastCorrect = shuffledStatements[currentIndex].anachronistic === false;
  if (lastCorrect) score++;
}

function onNext() {
  if (quizComplete) {
    // Reset quiz
    currentIndex = 0;
    score = 0;
    answered = false;
    lastCorrect = false;
    quizComplete = false;
    shuffledStatements = shuffle([...statements], true);
    return;
  }

  currentIndex++;
  answered = false;

  if (currentIndex >= shuffledStatements.length) {
    quizComplete = true;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = min(container.offsetWidth, 600);
  } else {
    canvasWidth = min(windowWidth, 600);
  }
}
