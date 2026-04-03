// Bias Self-Diagnostic: Scenario-based quiz with radar chart results
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = 510;
let margin = 25;
let defaultTextSize = 16;

let scenarios = [
  {text: "You see a headline that confirms your political views. Do you:",
   options: [
     {text: "Share it immediately — it's clearly true", bias: "confirmation"},
     {text: "Check the source before sharing", bias: "none"},
     {text: "Dismiss alternative viewpoints as biased", bias: "confirmation"},
     {text: "Read it skeptically and look for counter-evidence", bias: "none"}
   ]},
  {text: "A store marks an item 'Was $200, Now $80!' Do you:",
   options: [
     {text: "Think it's a great deal based on the original price", bias: "anchoring"},
     {text: "Research the item's typical market price", bias: "none"},
     {text: "Buy it because the discount seems huge", bias: "anchoring"},
     {text: "Ignore the original price and evaluate the item on its merits", bias: "none"}
   ]},
  {text: "After seeing news about a plane crash, you need to book a flight. Do you:",
   options: [
     {text: "Feel flying is very dangerous right now", bias: "availability"},
     {text: "Check actual flight safety statistics", bias: "none"},
     {text: "Drive instead, feeling it's safer", bias: "availability"},
     {text: "Recognize the news made this risk feel larger than it is", bias: "none"}
   ]},
  {text: "Your study group all agree on an answer you think is wrong. Do you:",
   options: [
     {text: "Go along with the group to avoid conflict", bias: "groupthink"},
     {text: "Voice your disagreement with your reasoning", bias: "none"},
     {text: "Assume the group must be right", bias: "groupthink"},
     {text: "Ask the group to explain their reasoning", bias: "none"}
   ]},
  {text: "You just read one article about quantum physics. How confident do you feel explaining it?",
   options: [
     {text: "Very confident — I basically understand it now", bias: "dunning-kruger"},
     {text: "I know the basics but have much more to learn", bias: "none"},
     {text: "Confident enough to correct others", bias: "dunning-kruger"},
     {text: "Curious but aware of how much I don't know", bias: "none"}
   ]},
  {text: "You chose a university course that turned out to be disappointing. Do you:",
   options: [
     {text: "Insist it was a good choice and focus on the positives", bias: "dissonance"},
     {text: "Acknowledge it wasn't the best fit and learn from it", bias: "none"},
     {text: "Convince yourself the difficulty is actually beneficial", bias: "dissonance"},
     {text: "Drop or change the course if possible", bias: "none"}
   ]},
  {text: "A famous athlete recommends a health supplement. Do you:",
   options: [
     {text: "Try it — they must know about health", bias: "authority"},
     {text: "Look for peer-reviewed research on the supplement", bias: "none"},
     {text: "Trust their endorsement over a doctor's opinion", bias: "authority"},
     {text: "Recognize celebrities aren't health experts", bias: "none"}
   ]},
  {text: "Looking back at a historical event with a known outcome, do you:",
   options: [
     {text: "Think 'It was obvious that would happen'", bias: "hindsight"},
     {text: "Consider what information was available at the time", bias: "none"},
     {text: "Judge past decision-makers for not seeing it coming", bias: "hindsight"},
     {text: "Recognize that outcomes seem predictable only in retrospect", bias: "none"}
   ]}
];

let biasCategories = [
  "confirmation", "anchoring", "availability", "groupthink",
  "dunning-kruger", "dissonance", "authority", "hindsight"
];

let biasLabels = [
  "Confirmation", "Anchoring", "Availability", "Groupthink",
  "Dunning-Kruger", "Dissonance", "Authority", "Hindsight"
];

let biasColors = {
  confirmation: "crimson",
  anchoring: "darkorange",
  availability: "goldenrod",
  groupthink: "mediumseagreen",
  "dunning-kruger": "dodgerblue",
  dissonance: "mediumpurple",
  authority: "hotpink",
  hindsight: "teal"
};

let currentScenario = 0;
let selectedOption = -1;
let answered = false;
let showResults = false;
let biasScores = {};
let answers = [];
let nextBtn, tryAgainBtn;
let optionButtons = [];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textWrap(WORD);

  resetQuiz();

  nextBtn = createButton('Next');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.mousePressed(advanceScenario);
  nextBtn.style('font-size', '14px');
  nextBtn.style('padding', '6px 20px');
  nextBtn.style('background', 'white');
  nextBtn.style('cursor', 'pointer');
  nextBtn.hide();

  tryAgainBtn = createButton('Try Again');
  tryAgainBtn.parent(document.querySelector('main'));
  tryAgainBtn.mousePressed(resetQuiz);
  tryAgainBtn.style('font-size', '14px');
  tryAgainBtn.style('padding', '6px 20px');
  tryAgainBtn.style('background', 'white');
  tryAgainBtn.style('cursor', 'pointer');
  tryAgainBtn.hide();

  describe('A scenario-based bias self-diagnostic quiz that shows a radar chart of cognitive bias profile after answering 8 questions.');
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (showResults) {
    drawResults();
    positionTryAgainBtn();
    nextBtn.hide();
  } else {
    drawProgressBar();
    drawScenario();
    positionNextBtn();
    tryAgainBtn.hide();
  }
}

function drawProgressBar() {
  let barX = margin;
  let barY = 12;
  let barW = canvasWidth - margin * 2;
  let barH = 10;

  // Background
  noStroke();
  fill(210);
  rect(barX, barY, barW, barH, 5);

  // Progress fill
  let progress = currentScenario / scenarios.length;
  if (answered) progress = (currentScenario + 1) / scenarios.length;
  fill('steelblue');
  rect(barX, barY, barW * progress, barH, 5);

  // Label
  noStroke();
  fill(80);
  textSize(11);
  textAlign(RIGHT, TOP);
  text((answered ? currentScenario + 1 : currentScenario) + ' / ' + scenarios.length, barX + barW, barY + 14);
}

function drawScenario() {
  let scenario = scenarios[currentScenario];
  let yPos = 40;

  // Scenario card background
  noStroke();
  fill(255);
  rect(margin - 5, yPos - 5, canvasWidth - margin * 2 + 10, 90, 8);

  // Scenario text
  noStroke();
  fill(30);
  textSize(14);
  textAlign(LEFT, TOP);
  text('Q' + (currentScenario + 1) + ': ' + scenario.text, margin, yPos, canvasWidth - margin * 2);

  // Options
  let optY = 140;
  let optW = canvasWidth - margin * 2;
  let optH = 52;
  let optGap = 6;

  for (let i = 0; i < scenario.options.length; i++) {
    let y = optY + i * (optH + optGap);
    let isSelected = (selectedOption === i);
    let isHovered = (!answered &&
      mouseX > margin && mouseX < margin + optW &&
      mouseY > y && mouseY < y + optH);

    // Option background
    noStroke();
    if (answered && isSelected) {
      if (scenario.options[i].bias === "none") {
        fill(200, 240, 200); // green for good
      } else {
        fill(255, 215, 210); // red for biased
      }
    } else if (isHovered) {
      fill(230, 240, 250);
    } else {
      fill(245, 247, 250);
    }
    rect(margin, y, optW, optH, 6);

    // Option text
    noStroke();
    fill(40);
    textSize(13);
    textAlign(LEFT, TOP);
    let label = String.fromCharCode(65 + i) + ') ';
    text(label + scenario.options[i].text, margin + 10, y + 6, optW - 20);
  }

  // Feedback after answering
  if (answered) {
    let feedbackY = optY + 4 * (optH + optGap) + 4;
    let chosen = scenario.options[selectedOption];
    noStroke();
    textSize(13);
    textAlign(LEFT, TOP);
    if (chosen.bias === "none") {
      fill('darkgreen');
      text("Good critical thinking! You avoided the bias trap.", margin, feedbackY, canvasWidth - margin * 2);
    } else {
      let biasName = biasLabels[biasCategories.indexOf(chosen.bias)];
      fill('darkred');
      text("This reflects " + biasName + " Bias — a common thinking pattern to watch for.", margin, feedbackY, canvasWidth - margin * 2);
    }
  }
}

function drawResults() {
  // Title
  noStroke();
  fill(30);
  textSize(18);
  textAlign(CENTER, TOP);
  text('Your Bias Profile', canvasWidth / 2, 15);

  // Count biased answers
  let totalBiased = 0;
  for (let cat of biasCategories) {
    totalBiased += biasScores[cat];
  }

  // Radar chart
  let cx = canvasWidth / 2;
  let cy = 220;
  let maxR = 120;
  let numAxes = biasCategories.length;
  let angleStep = TWO_PI / numAxes;

  // Draw grid circles
  stroke(210);
  strokeWeight(0.5);
  noFill();
  for (let r = 1; r <= 2; r++) {
    let radius = (r / 2) * maxR;
    beginShape();
    for (let i = 0; i < numAxes; i++) {
      let angle = -HALF_PI + i * angleStep;
      vertex(cx + cos(angle) * radius, cy + sin(angle) * radius);
    }
    endShape(CLOSE);
  }

  // Draw axes and labels
  for (let i = 0; i < numAxes; i++) {
    let angle = -HALF_PI + i * angleStep;
    let ex = cx + cos(angle) * maxR;
    let ey = cy + sin(angle) * maxR;

    stroke(190);
    strokeWeight(0.5);
    line(cx, cy, ex, ey);

    // Labels
    let labelR = maxR + 22;
    let lx = cx + cos(angle) * labelR;
    let ly = cy + sin(angle) * labelR;
    noStroke();
    fill(biasColors[biasCategories[i]]);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(biasLabels[i], lx, ly);
  }

  // Draw data polygon
  fill(70, 130, 200, 60);
  stroke('steelblue');
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < numAxes; i++) {
    let angle = -HALF_PI + i * angleStep;
    let val = biasScores[biasCategories[i]];
    let r = (val / 2) * maxR;
    vertex(cx + cos(angle) * r, cy + sin(angle) * r);
  }
  endShape(CLOSE);

  // Draw data points
  for (let i = 0; i < numAxes; i++) {
    let angle = -HALF_PI + i * angleStep;
    let val = biasScores[biasCategories[i]];
    let r = (val / 2) * maxR;
    let px = cx + cos(angle) * r;
    let py = cy + sin(angle) * r;
    noStroke();
    fill(biasColors[biasCategories[i]]);
    circle(px, py, 8);
  }

  // Summary text
  noStroke();
  textSize(13);
  textAlign(CENTER, TOP);
  let summaryY = 365;
  if (totalBiased === 0) {
    fill('darkgreen');
    text("Excellent! You showed strong critical\nthinking across all scenarios.", cx, summaryY);
  } else if (totalBiased <= 3) {
    fill('darkorange');
    text("Good awareness! You spotted most bias\ntraps but fell for " + totalBiased + ".", cx, summaryY);
  } else {
    fill('crimson');
    text("You triggered " + totalBiased + " bias indicators.\nDon't worry — awareness is the first step!", cx, summaryY);
  }

  // List triggered biases
  let listY = summaryY + 42;
  textSize(11);
  textAlign(CENTER, TOP);
  fill(80);
  let triggered = [];
  for (let i = 0; i < biasCategories.length; i++) {
    if (biasScores[biasCategories[i]] > 0) {
      triggered.push(biasLabels[i] + ' (' + biasScores[biasCategories[i]] + ')');
    }
  }
  if (triggered.length > 0) {
    text("Biases detected: " + triggered.join(', '), margin, listY, canvasWidth - margin * 2);
  }
}

function positionNextBtn() {
  if (answered && !showResults) {
    nextBtn.show();
    let btnX = canvasWidth / 2 - 40;
    let btnY = drawHeight + 15;
    nextBtn.position(btnX, btnY);

    let cnv = document.querySelector('main canvas');
    if (cnv) {
      let rect = cnv.getBoundingClientRect();
      nextBtn.position(rect.left + btnX, rect.top + btnY);
    }
  } else {
    nextBtn.hide();
  }
}

function positionTryAgainBtn() {
  tryAgainBtn.show();
  let btnX = canvasWidth / 2 - 45;
  let btnY = drawHeight + 15;

  let cnv = document.querySelector('main canvas');
  if (cnv) {
    let rect = cnv.getBoundingClientRect();
    tryAgainBtn.position(rect.left + btnX, rect.top + btnY);
  }
}

function mousePressed() {
  if (answered || showResults) return;

  let scenario = scenarios[currentScenario];
  let optY = 140;
  let optW = canvasWidth - margin * 2;
  let optH = 52;
  let optGap = 6;

  for (let i = 0; i < scenario.options.length; i++) {
    let y = optY + i * (optH + optGap);
    if (mouseX > margin && mouseX < margin + optW &&
        mouseY > y && mouseY < y + optH) {
      selectedOption = i;
      answered = true;
      let chosen = scenario.options[i];
      answers.push(chosen.bias);
      if (chosen.bias !== "none") {
        biasScores[chosen.bias]++;
      }
      break;
    }
  }
}

function advanceScenario() {
  if (currentScenario < scenarios.length - 1) {
    currentScenario++;
    selectedOption = -1;
    answered = false;
  } else {
    showResults = true;
  }
}

function resetQuiz() {
  currentScenario = 0;
  selectedOption = -1;
  answered = false;
  showResults = false;
  answers = [];
  biasScores = {};
  for (let cat of biasCategories) {
    biasScores[cat] = 0;
  }
  if (nextBtn) nextBtn.hide();
  if (tryAgainBtn) tryAgainBtn.hide();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = min(container.offsetWidth - 10, 400);
  }
}
