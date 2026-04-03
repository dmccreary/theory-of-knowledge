// Empiricism vs Rationalism Classification Exercise
// CANVAS_HEIGHT: 520
// Bloom Level: Evaluate (L5) - Students classify knowledge claims by epistemological source
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// Colors
let tealCol, tealLight, amberCol, amberLight, purpleCol, purpleLight;
let darkText, correctGreen, incorrectRed;

// State
let currentClaimIndex = 0;
let score = 0;
let attempts = 0;
let answered = false;
let selectedAnswer = '';
let hoveredZone = '';
let difficulty = 'all';
let filteredClaims = [];

// Controls
let nextButton, resetButton, difficultySelect;

// Claims data
let claims = [
  {text: "Water boils at 100°C at sea level", answer: "empiricism", explanation: "This is established through observation and measurement — empirical evidence.", difficulty: "easy"},
  {text: "The sum of angles in a triangle is 180°", answer: "rationalism", explanation: "This is proven through deductive reasoning from axioms, not observation.", difficulty: "easy"},
  {text: "Penicillin kills bacteria", answer: "empiricism", explanation: "Discovered through observation by Fleming; confirmed by experiments.", difficulty: "easy"},
  {text: "If A=B and B=C, then A=C", answer: "rationalism", explanation: "A logical truth known through reason alone, independent of experience.", difficulty: "easy"},
  {text: "The universe began with the Big Bang", answer: "both", explanation: "Requires empirical evidence (CMB radiation) and rational theoretical framework.", difficulty: "hard"},
  {text: "Democracy is the most just form of government", answer: "both", explanation: "Involves both empirical observation of governance outcomes and rational moral reasoning.", difficulty: "hard"},
  {text: "Gravity causes objects to fall", answer: "empiricism", explanation: "Known through repeated observation, though Newton and Einstein provided rational frameworks.", difficulty: "easy"},
  {text: "Nothing can be both true and false simultaneously", answer: "rationalism", explanation: "The law of non-contradiction is known through reason, not experience.", difficulty: "medium"},
  {text: "Smoking causes cancer", answer: "empiricism", explanation: "Established through epidemiological studies and controlled experiments.", difficulty: "medium"},
  {text: "Every event has a cause", answer: "both", explanation: "Kant argued this is both a rational principle and confirmed by experience.", difficulty: "hard"},
  {text: "Parallel lines never intersect", answer: "rationalism", explanation: "An axiom of Euclidean geometry, known through definition and deduction.", difficulty: "medium"},
  {text: "Climate change is driven by human activity", answer: "both", explanation: "Requires vast empirical data and rational modeling to establish the causal chain.", difficulty: "medium"}
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Define colors
  tealCol = color(0, 128, 128);
  tealLight = color(200, 235, 235);
  amberCol = color(200, 150, 0);
  amberLight = color(255, 240, 200);
  purpleCol = color(120, 70, 150);
  purpleLight = color(230, 215, 245);
  darkText = color(30, 30, 30);
  correctGreen = color(40, 160, 80);
  incorrectRed = color(200, 60, 60);

  // Next Claim button
  nextButton = createButton('Next Claim');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextClaim);
  styleButton(nextButton, '#008080');
  nextButton.hide();

  // Reset Score button
  resetButton = createButton('Reset Score');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetScore);
  styleButton(resetButton, '#cc4444');

  // Difficulty dropdown
  difficultySelect = createSelect();
  difficultySelect.parent(document.querySelector('main'));
  difficultySelect.option('All Claims', 'all');
  difficultySelect.option('Easy', 'easy');
  difficultySelect.option('Medium', 'medium');
  difficultySelect.option('Hard', 'hard');
  difficultySelect.selected('all');
  difficultySelect.style('font-size', '14px');
  difficultySelect.style('padding', '6px 10px');
  difficultySelect.style('border-radius', '4px');
  difficultySelect.style('border', '1px solid silver');
  difficultySelect.style('background-color', 'white');
  difficultySelect.changed(onDifficultyChange);

  filterClaims();
  describe('Empiricism vs Rationalism classification exercise: classify 12 knowledge claims as empiricism, rationalism, or both', LABEL);
}

function styleButton(btn, bgColor) {
  btn.style('font-size', '14px');
  btn.style('padding', '6px 16px');
  btn.style('background-color', bgColor);
  btn.style('color', 'white');
  btn.style('border', 'none');
  btn.style('border-radius', '4px');
  btn.style('cursor', 'pointer');
}

function filterClaims() {
  difficulty = difficultySelect.value();
  if (difficulty === 'all') {
    filteredClaims = claims.slice();
  } else {
    filteredClaims = claims.filter(c => c.difficulty === difficulty);
  }
  currentClaimIndex = 0;
  answered = false;
  selectedAnswer = '';
  nextButton.hide();
}

function onDifficultyChange() {
  filterClaims();
  score = 0;
  attempts = 0;
}

function resetScore() {
  score = 0;
  attempts = 0;
  currentClaimIndex = 0;
  answered = false;
  selectedAnswer = '';
  nextButton.hide();
  filterClaims();
}

function nextClaim() {
  currentClaimIndex++;
  if (currentClaimIndex >= filteredClaims.length) {
    currentClaimIndex = 0;
  }
  answered = false;
  selectedAnswer = '';
  nextButton.hide();
}

function draw() {
  updateCanvasSize();

  // Draw area background
  background('aliceblue');

  let cw = canvasWidth;
  let colW = (cw - margin * 3) / 2;
  let colTop = 10;
  let colH = 110;

  // --- Column headers ---
  // Empiricism column (left, teal)
  fill(tealLight);
  stroke('silver');
  strokeWeight(1);
  rect(margin, colTop, colW, colH, 8);
  noStroke();
  fill(tealCol);
  textAlign(CENTER, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Empiricism', margin + colW / 2, colTop + 8);
  textStyle(NORMAL);
  fill(darkText);
  textSize(12);
  let empTraits = '• Knowledge from experience\n• Observation & experiment\n• Sensory evidence\n• Locke, Hume, Bacon';
  text(empTraits, margin + colW / 2, colTop + 30, colW - 16);

  // Rationalism column (right, amber)
  let rCol = margin * 2 + colW;
  fill(amberLight);
  stroke('silver');
  strokeWeight(1);
  rect(rCol, colTop, colW, colH, 8);
  noStroke();
  fill(amberCol);
  textAlign(CENTER, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Rationalism', rCol + colW / 2, colTop + 8);
  textStyle(NORMAL);
  fill(darkText);
  textSize(12);
  let ratTraits = '• Knowledge from reason\n• Logic & deduction\n• Innate ideas & axioms\n• Descartes, Leibniz, Spinoza';
  text(ratTraits, rCol + colW / 2, colTop + 30, colW - 16);

  // --- Claim card ---
  let cardTop = colTop + colH + 15;
  let cardH = 70;
  let cardW = cw - margin * 2;
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(margin, cardTop, cardW, cardH, 8);
  noStroke();

  if (filteredClaims.length === 0) {
    fill(darkText);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('No claims for this difficulty level.', cw / 2, cardTop + cardH / 2);
  } else {
    let claim = filteredClaims[currentClaimIndex];
    // Claim number
    fill(150);
    textAlign(CENTER, TOP);
    textSize(11);
    text('Claim ' + (currentClaimIndex + 1) + ' of ' + filteredClaims.length, cw / 2, cardTop + 6);
    // Claim text
    fill(darkText);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(claim.text, cw / 2, cardTop + cardH / 2 + 6, cardW - 20);
    textStyle(NORMAL);
  }

  // --- Three clickable zones ---
  let zoneTop = cardTop + cardH + 12;
  let zoneH = 44;
  let zoneGap = 10;
  let zoneW = (cardW - zoneGap * 2) / 3;
  let zones = [
    {label: 'Empiricism', key: 'empiricism', col: tealCol, lightCol: tealLight, x: margin},
    {label: 'Both', key: 'both', col: purpleCol, lightCol: purpleLight, x: margin + zoneW + zoneGap},
    {label: 'Rationalism', key: 'rationalism', col: amberCol, lightCol: amberLight, x: margin + (zoneW + zoneGap) * 2}
  ];

  hoveredZone = '';
  for (let z of zones) {
    let isHover = !answered && mouseX > z.x && mouseX < z.x + zoneW && mouseY > zoneTop && mouseY < zoneTop + zoneH;
    let isSelected = answered && selectedAnswer === z.key;

    if (isHover) {
      hoveredZone = z.key;
      fill(z.lightCol);
      stroke(z.col);
      strokeWeight(2);
      cursor(HAND);
    } else if (isSelected) {
      fill(z.lightCol);
      stroke(z.col);
      strokeWeight(2);
    } else {
      fill(245);
      stroke('silver');
      strokeWeight(1);
    }
    rect(z.x, zoneTop, zoneW, zoneH, 6);

    noStroke();
    if (isHover || isSelected) {
      fill(z.col);
    } else {
      fill(100);
    }
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(z.label, z.x + zoneW / 2, zoneTop + zoneH / 2);
    textStyle(NORMAL);
  }

  if (!hoveredZone && !answered) {
    cursor(ARROW);
  }

  // --- Feedback panel ---
  let fbTop = zoneTop + zoneH + 12;
  let fbH = 100;
  let fbW = cardW;

  if (answered && filteredClaims.length > 0) {
    let claim = filteredClaims[currentClaimIndex];
    let isCorrect = selectedAnswer === claim.answer;

    if (isCorrect) {
      fill(220, 245, 220);
      stroke(correctGreen);
    } else {
      fill(255, 225, 225);
      stroke(incorrectRed);
    }
    strokeWeight(1);
    rect(margin, fbTop, fbW, fbH, 8);
    noStroke();

    // Result header
    if (isCorrect) {
      fill(correctGreen);
    } else {
      fill(incorrectRed);
    }
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    let resultText = isCorrect ? 'Correct!' : 'Not quite. The answer is: ' + capitalize(claim.answer);
    text(resultText, margin + 10, fbTop + 8);
    textStyle(NORMAL);

    // Explanation
    fill(darkText);
    textSize(12);
    text(claim.explanation, margin + 10, fbTop + 28, fbW - 20);
  } else {
    // Empty feedback area placeholder
    fill(240);
    stroke('silver');
    strokeWeight(1);
    rect(margin, fbTop, fbW, fbH, 8);
    noStroke();
    fill(180);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Click a category above to classify the claim', cw / 2, fbTop + fbH / 2);
  }

  // --- Score display ---
  let scoreTop = fbTop + fbH + 10;
  noStroke();
  fill(darkText);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text('Score: ' + score + ' / ' + attempts, cw / 2, scoreTop);
  textStyle(NORMAL);

  // --- Control area ---
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // Position controls in control area
  let ctrlY = drawHeight + (controlHeight - 30) / 2;
  let ctrlSpacing = 10;

  // Layout: difficulty select, next button, reset button
  let totalCtrlW = 140 + ctrlSpacing + 100 + ctrlSpacing + 100;
  let startX = (cw - totalCtrlW) / 2;

  difficultySelect.position(startX, ctrlY);
  difficultySelect.size(140, 30);

  nextButton.position(startX + 140 + ctrlSpacing, ctrlY);
  if (answered) {
    nextButton.show();
  }

  resetButton.position(startX + 140 + ctrlSpacing + 100 + ctrlSpacing, ctrlY);
}

function mousePressed() {
  if (answered || filteredClaims.length === 0) return;

  let claim = filteredClaims[currentClaimIndex];
  let cardTop = 10 + 110 + 15;
  let cardH = 70;
  let cardW = canvasWidth - margin * 2;
  let zoneTop = cardTop + cardH + 12;
  let zoneH = 44;
  let zoneGap = 10;
  let zoneW = (cardW - zoneGap * 2) / 3;

  let zones = [
    {key: 'empiricism', x: margin},
    {key: 'both', x: margin + zoneW + zoneGap},
    {key: 'rationalism', x: margin + (zoneW + zoneGap) * 2}
  ];

  for (let z of zones) {
    if (mouseX > z.x && mouseX < z.x + zoneW && mouseY > zoneTop && mouseY < zoneTop + zoneH) {
      selectedAnswer = z.key;
      answered = true;
      attempts++;
      if (selectedAnswer === claim.answer) {
        score++;
      }
      break;
    }
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  canvasWidth = min(containerWidth, 500);
  canvasHeight = drawHeight + controlHeight;
}
