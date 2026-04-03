// Ethical Frameworks Comparison MicroSim
// CANVAS_HEIGHT: 520
// Three-column comparison of Deontological, Consequentialist, and Virtue Ethics
// frameworks applied to classic moral dilemmas. Students hover columns for details
// and click verdict badges to register their own verdict.

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- Controls ----
let scenarioSelect;

// ---- State ----
let currentScenario = "The Trolley Problem";
let hoveredColumn = -1; // 0, 1, 2 or -1
let userVerdicts = {}; // scenarioName -> frameworkIndex
let flashAlpha = 0;
let flashColumn = -1;

// ---- Scenario data ----
let scenarios = {
  "The Trolley Problem": {
    text: "A runaway trolley will kill 5 people. You can divert it to a track where it will kill 1 person instead.",
    deontological: {question: "Is it ever right to use a person as a means?", evaluation: "Diverting the trolley uses the one person as a means to save five. Kant's categorical imperative says no.", verdict: "wrong", color: "red"},
    consequentialist: {question: "Which action produces the best outcomes?", evaluation: "Saving 5 lives at the cost of 1 produces greater overall utility. The math is clear.", verdict: "right", color: "green"},
    virtue: {question: "What would a virtuous person do?", evaluation: "A compassionate person would minimize harm, but a just person wouldn't treat any life as expendable.", verdict: "depends", color: "amber"}
  },
  "The White Lie": {
    text: "Your friend asks if their presentation was good. It wasn't, but they're already anxious about their grade.",
    deontological: {question: "Is lying ever permissible?", evaluation: "Kant argued lying is always wrong — the duty to truth is unconditional.", verdict: "wrong", color: "red"},
    consequentialist: {question: "Which produces better outcomes?", evaluation: "A kind lie reduces suffering now, but may lead to repeated poor performance.", verdict: "depends", color: "amber"},
    virtue: {question: "What would a virtuous person do?", evaluation: "Honesty is a virtue, but so is kindness. A virtuous person would be truthful but gentle.", verdict: "depends", color: "amber"}
  },
  "The Whistleblower": {
    text: "You discover your company is illegally dumping waste. Reporting it will cost you your job and possibly your career.",
    deontological: {question: "Do I have a duty to report wrongdoing?", evaluation: "There is a moral duty to prevent harm and uphold the law, regardless of personal cost.", verdict: "right", color: "green"},
    consequentialist: {question: "Do the benefits of reporting outweigh the costs?", evaluation: "Environmental protection benefits many; personal cost is significant but smaller.", verdict: "right", color: "green"},
    virtue: {question: "What would a courageous person do?", evaluation: "Courage and justice demand action. A virtuous person would report despite personal risk.", verdict: "right", color: "green"}
  },
  "The Stolen Medicine": {
    text: "Your child is dying and the only medicine costs far more than you can afford. You could steal it from the pharmacy.",
    deontological: {question: "Is stealing ever justified?", evaluation: "Theft violates the moral law, even with good intentions. But some argue a duty to preserve life takes priority.", verdict: "depends", color: "amber"},
    consequentialist: {question: "Does saving a life outweigh the theft?", evaluation: "The benefit (saving a life) vastly outweighs the cost (property loss). Stealing is justified.", verdict: "right", color: "green"},
    virtue: {question: "What would a loving parent do?", evaluation: "Love and care for family are virtues. A virtuous person would exhaust alternatives first, but might steal as a last resort.", verdict: "depends", color: "amber"}
  }
};

// ---- Framework metadata ----
let frameworks = [
  {name: "Deontological", key: "deontological", headerColor: [0, 128, 128], centralQ: "What is my duty?"},
  {name: "Consequentialist", key: "consequentialist", headerColor: [200, 150, 0], centralQ: "What produces the best outcome?"},
  {name: "Virtue Ethics", key: "virtue", headerColor: [205, 92, 92], centralQ: "What would a virtuous person do?"}
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Scenario dropdown
  scenarioSelect = createSelect();
  scenarioSelect.parent(mainElement);
  let scenarioNames = Object.keys(scenarios);
  for (let i = 0; i < scenarioNames.length; i++) {
    scenarioSelect.option(scenarioNames[i]);
  }
  scenarioSelect.selected(currentScenario);
  scenarioSelect.position(10, drawHeight + 18);
  scenarioSelect.style('font-size', '14px');
  scenarioSelect.style('padding', '4px 8px');
  scenarioSelect.changed(() => {
    currentScenario = scenarioSelect.value();
  });

  textFont('Arial');
  describe('Three-column ethical frameworks comparison for moral dilemmas with Deontological, Consequentialist, and Virtue Ethics analysis', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let sc = scenarios[currentScenario];

  // ---- Title ----
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Ethical Frameworks Comparison', canvasWidth / 2, 8);

  // ---- Scenario text ----
  textStyle(NORMAL);
  textSize(13);
  fill(60);
  textAlign(CENTER, TOP);
  let scenarioY = 32;
  text(sc.text, margin + 10, scenarioY, canvasWidth - margin * 2 - 20, 50);

  // ---- Determine hover ----
  let colStartY = 80;
  let colEndY = drawHeight - 10;
  let colWidth = (canvasWidth - margin * 2 - 16) / 3;
  hoveredColumn = -1;
  if (mouseY > colStartY && mouseY < colEndY && mouseX > margin && mouseX < canvasWidth - margin) {
    let relX = mouseX - margin;
    let colIndex = Math.floor(relX / (colWidth + 8));
    if (colIndex >= 0 && colIndex < 3) {
      hoveredColumn = colIndex;
    }
  }

  // ---- Draw three columns ----
  let frameworkKeys = ["deontological", "consequentialist", "virtue"];
  for (let i = 0; i < 3; i++) {
    let colX = margin + i * (colWidth + 8);
    let fw = frameworks[i];
    let data = sc[fw.key];
    let isHovered = (hoveredColumn === i);
    let isChosen = (userVerdicts[currentScenario] === i);

    drawColumn(colX, colStartY, colWidth, colEndY - colStartY, fw, data, isHovered, isChosen, i);
  }

  // ---- Flash feedback ----
  if (flashAlpha > 0) {
    let flashX = margin + flashColumn * (colWidth + 8);
    noStroke();
    fill(255, 255, 255, flashAlpha);
    rect(flashX, colStartY, colWidth, colEndY - colStartY, 6);
    flashAlpha -= 8;
  }

  // ---- Your verdict label ----
  noStroke();
  fill(100);
  textSize(11);
  textAlign(RIGHT, CENTER);
  textStyle(ITALIC);
  text('Click a verdict badge to cast your vote', canvasWidth - margin, drawHeight + 30);
  textStyle(NORMAL);

  // ---- Vote tally ----
  let totalVotes = Object.keys(userVerdicts).length;
  let totalScenarios = Object.keys(scenarios).length;
  fill(80);
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('Scenarios voted: ' + totalVotes + ' / ' + totalScenarios, canvasWidth - margin, drawHeight + 48);
}

function drawColumn(x, y, w, h, framework, data, isHovered, isChosen, colIndex) {
  let headerH = 36;
  let r = framework.headerColor[0];
  let g = framework.headerColor[1];
  let b = framework.headerColor[2];

  // Column background
  if (isHovered) {
    fill(r, g, b, 20);
  } else {
    fill(255, 255, 255, 180);
  }
  stroke(r, g, b, 80);
  strokeWeight(isHovered ? 2 : 1);
  rect(x, y, w, h, 6);

  // Header bar
  noStroke();
  fill(r, g, b);
  rect(x, y, w, headerH, 6, 6, 0, 0);

  // Framework name
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  noStroke();
  text(framework.name, x + w / 2, y + headerH / 2);
  textStyle(NORMAL);

  // Central question (italicized)
  let contentY = y + headerH + 10;
  fill(r, g, b);
  textSize(11);
  textAlign(CENTER, TOP);
  textStyle(ITALIC);
  noStroke();
  text(data.question, x + 8, contentY, w - 16, 40);
  textStyle(NORMAL);

  // Evaluation text
  let evalY = contentY + 44;
  fill(60);
  textSize(isHovered ? 12 : 11);
  textAlign(LEFT, TOP);
  noStroke();
  let evalH = isHovered ? h - headerH - 120 : h - headerH - 110;
  text(data.evaluation, x + 10, evalY, w - 20, evalH);

  // ---- Verdict badge ----
  let badgeY = y + h - 50;
  let badgeX = x + w / 2;
  let badgeR = 16;

  // Verdict color
  let verdictR, verdictG, verdictB;
  if (data.color === "green") {
    verdictR = 46; verdictG = 139; verdictB = 87;
  } else if (data.color === "red") {
    verdictR = 205; verdictG = 60; verdictB = 60;
  } else {
    verdictR = 210; verdictG = 170; verdictB = 40;
  }

  // Badge circle
  noStroke();
  fill(verdictR, verdictG, verdictB);
  ellipse(badgeX, badgeY, badgeR * 2, badgeR * 2);

  // Verdict label
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  textStyle(BOLD);
  noStroke();
  let verdictLabel = data.verdict === "right" ? "RIGHT" : data.verdict === "wrong" ? "WRONG" : "DEPENDS";
  text(verdictLabel, badgeX, badgeY);
  textStyle(NORMAL);

  // "Your Verdict" indicator
  if (isChosen) {
    stroke(r, g, b);
    strokeWeight(3);
    noFill();
    ellipse(badgeX, badgeY, badgeR * 2 + 10, badgeR * 2 + 10);
    noStroke();
    fill(r, g, b);
    textSize(9);
    textAlign(CENTER, TOP);
    text('YOUR VOTE', badgeX, badgeY + badgeR + 6);
  }

  // Hover hint
  if (isHovered && !isChosen) {
    fill(100);
    textSize(9);
    textAlign(CENTER, TOP);
    noStroke();
    text('Click to vote', badgeX, badgeY + badgeR + 6);
  }
}

function mousePressed() {
  // Check if clicking on a verdict badge
  let colStartY = 80;
  let colEndY = drawHeight - 10;
  let colWidth = (canvasWidth - margin * 2 - 16) / 3;
  let colH = colEndY - colStartY;

  for (let i = 0; i < 3; i++) {
    let colX = margin + i * (colWidth + 8);
    let badgeX = colX + colWidth / 2;
    let badgeY = colStartY + colH - 50;
    let d = dist(mouseX, mouseY, badgeX, badgeY);
    if (d < 20) {
      userVerdicts[currentScenario] = i;
      flashColumn = i;
      flashAlpha = 150;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  let colWidth = (canvasWidth - margin * 2 - 16) / 3;
  scenarioSelect.style('max-width', (canvasWidth - 40) + 'px');
  scenarioSelect.position(10, drawHeight + 18);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
