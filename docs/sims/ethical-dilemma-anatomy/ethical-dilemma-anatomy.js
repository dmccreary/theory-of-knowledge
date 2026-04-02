// Ethical Dilemma Anatomy - Branching Dilemma Visualizer
// CANVAS_HEIGHT: 560
let canvasWidth = 800;
let drawHeight = 500;
let controlHeight = 60;
let canvasHeight = 560;

let dilemmaSelect;
let frameworkCheckbox;
let selectedStakeholder = null;
let tooltipTimer = 0;
let choiceMade = null;
let choiceFlash = 0;

let dilemmas = {
  "The Journalist's Secret": {
    scenario: "A journalist discovers a government program that saves lives but violates civil liberties. Publishing could end the program but also endanger operatives.",
    pathA: {
      value: "Transparency",
      stakeholders: ["Public (right to know)", "Operatives (safety at risk)"],
      consequence: "Program ends, some operatives endangered, democratic accountability restored"
    },
    pathB: {
      value: "Safety",
      stakeholders: ["Operatives (protected)", "Public (kept uninformed)"],
      consequence: "Lives saved, but government operates without oversight"
    },
    frameworks: {
      deontological: "Duty to truth vs. duty to protect — Kant would examine the universalizability of each choice",
      consequentialist: "Which outcome produces the most well-being? Weigh lives saved against democratic costs",
      virtue: "What would a courageous, wise person do? Courage suggests publishing; prudence suggests caution"
    }
  },
  "The Doctor's Choice": {
    scenario: "A patient refuses a life-saving blood transfusion on religious grounds. The doctor believes the patient will die without it.",
    pathA: {
      value: "Patient Autonomy",
      stakeholders: ["Patient (wishes respected)", "Family (may lose loved one)"],
      consequence: "Patient's rights upheld, potential death, religious beliefs honored"
    },
    pathB: {
      value: "Duty of Care",
      stakeholders: ["Patient (life saved)", "Doctor (violates consent)"],
      consequence: "Life saved but trust in medical consent undermined"
    },
    frameworks: {
      deontological: "Respect for autonomy is a categorical duty — overriding consent treats the patient as a means",
      consequentialist: "Saving a life produces better outcomes, but undermining consent has long-term costs",
      virtue: "Compassion and respect both matter — a virtuous doctor would persuade, not coerce"
    }
  },
  "The AI Decision": {
    scenario: "A company's hiring AI is more efficient but systematically disadvantages candidates from certain backgrounds due to training data bias.",
    pathA: {
      value: "Efficiency",
      stakeholders: ["Company (faster hiring)", "Disadvantaged candidates (excluded)"],
      consequence: "Faster, cheaper hiring but perpetuates existing inequality"
    },
    pathB: {
      value: "Fairness",
      stakeholders: ["Disadvantaged candidates (equal chance)", "Company (slower process)"],
      consequence: "More equitable outcomes but higher costs and slower hiring"
    },
    frameworks: {
      deontological: "Using biased AI treats some applicants as less worthy — violates dignity",
      consequentialist: "Efficiency benefits many, but systematic exclusion harms vulnerable groups disproportionately",
      virtue: "Justice requires actively counteracting bias, not passively benefiting from it"
    }
  }
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Controls
  dilemmaSelect = createSelect();
  dilemmaSelect.parent(document.querySelector('main'));
  for (let key of Object.keys(dilemmas)) {
    dilemmaSelect.option(key);
  }
  dilemmaSelect.changed(() => {
    choiceMade = null;
    selectedStakeholder = null;
  });

  frameworkCheckbox = createCheckbox('Framework Lens', false);
  frameworkCheckbox.parent(document.querySelector('main'));
  frameworkCheckbox.style('margin-left', '16px');
  frameworkCheckbox.style('font-family', 'Arial, sans-serif');
  frameworkCheckbox.style('font-size', '14px');
  frameworkCheckbox.style('color', 'black');
  frameworkCheckbox.style('background', 'white');
  frameworkCheckbox.style('padding', '4px 8px');
  frameworkCheckbox.style('border-radius', '4px');

  describe('Ethical dilemma visualizer showing branching paths with competing moral principles, stakeholder perspectives, and ethical framework analysis.');
}

function draw() {
  // Background
  background('aliceblue');
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let d = dilemmas[dilemmaSelect.value()];
  let midX = canvasWidth / 2;
  let showFrameworks = frameworkCheckbox.checked();

  // Title
  fill('steelblue');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Anatomy of an Ethical Dilemma', midX, 10);

  // Scenario panel
  let scenarioY = 34;
  let scenarioW = canvasWidth - 40;
  fill('white');
  stroke('steelblue');
  strokeWeight(1.5);
  rect(20, scenarioY, scenarioW, 56, 8);
  noStroke();
  fill('darkslategray');
  textSize(12);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  text(d.scenario, 30, scenarioY + 4, scenarioW - 20, 48);

  // Branching paths
  let branchStartY = 100;
  let pathAx = midX - canvasWidth * 0.22;
  let pathBx = midX + canvasWidth * 0.22;

  // Draw branch lines from center
  stroke('teal');
  strokeWeight(3);
  line(midX, branchStartY - 6, pathAx, branchStartY + 24);
  stroke('coral');
  line(midX, branchStartY - 6, pathBx, branchStartY + 24);

  // Central diamond
  noStroke();
  fill('steelblue');
  push();
  translate(midX, branchStartY - 6);
  rotate(PI / 4);
  rect(-10, -10, 20, 20, 3);
  pop();
  fill('white');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);
  textStyle(BOLD);
  text('?', midX, branchStartY - 6);

  // Draw Path A (teal)
  drawPath(d.pathA, pathAx, branchStartY + 24, 'teal', 'A', showFrameworks ? null : d);

  // Draw Path B (coral)
  drawPath(d.pathB, pathBx, branchStartY + 24, 'coral', 'B', showFrameworks ? null : d);

  // Vertical lines down paths
  stroke('teal');
  strokeWeight(2);
  let pathW = canvasWidth * 0.38;
  line(pathAx, branchStartY + 64, pathAx, branchStartY + 80);
  line(pathAx, branchStartY + 140, pathAx, branchStartY + 156);
  stroke('coral');
  line(pathBx, branchStartY + 64, pathBx, branchStartY + 80);
  line(pathBx, branchStartY + 140, pathBx, branchStartY + 156);

  // Draw stakeholders for path A
  drawStakeholders(d.pathA.stakeholders, pathAx, branchStartY + 80, pathW, 'teal');

  // Draw stakeholders for path B
  drawStakeholders(d.pathB.stakeholders, pathBx, branchStartY + 80, pathW, 'coral');

  // Consequence boxes
  let consY = branchStartY + 156;
  drawConsequenceBox(d.pathA.consequence, pathAx, consY, pathW - 20, 'teal');
  drawConsequenceBox(d.pathB.consequence, pathBx, consY, pathW - 20, 'coral');

  // Make Your Choice buttons
  let btnY = consY + 80;
  drawChoiceButton(pathAx, btnY, d.pathA.value, 'teal', 'A');
  drawChoiceButton(pathBx, btnY, d.pathB.value, 'coral', 'B');

  // Choice feedback
  if (choiceMade !== null) {
    choiceFlash = min(choiceFlash + 0.03, 1);
    let feedX = choiceMade === 'A' ? pathAx : pathBx;
    let feedColor = choiceMade === 'A' ? color(0, 128, 128, choiceFlash * 200) : color(255, 127, 80, choiceFlash * 200);
    fill(feedColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text('You chose: ' + (choiceMade === 'A' ? d.pathA.value : d.pathB.value), feedX, btnY + 30);
    textStyle(NORMAL);
    textSize(11);
    fill('darkslategray');
    text('Now consider — what would the other path\'s stakeholders say?', midX, btnY + 48);
  }

  // Framework lens panel
  if (showFrameworks) {
    drawFrameworkPanel(d.frameworks, midX, btnY + 62);
  }

  // Stakeholder tooltip
  if (selectedStakeholder !== null) {
    drawTooltip(selectedStakeholder.label, selectedStakeholder.x, selectedStakeholder.y);
  }

  // Control area label
  noStroke();
  fill('darkslategray');
  textAlign(LEFT, CENTER);
  textSize(12);
  textStyle(BOLD);
  text('Select Dilemma:', 12, drawHeight + controlHeight / 2);

  // Fade tooltip
  if (selectedStakeholder !== null) {
    tooltipTimer--;
    if (tooltipTimer <= 0) {
      selectedStakeholder = null;
    }
  }
}

function drawPath(pathData, cx, y, pathColor, label, d) {
  let pathW = canvasWidth * 0.38;
  // Value box
  noStroke();
  fill(pathColor);
  rect(cx - pathW / 2, y, pathW, 40, 8);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  noStroke();
  text('Path ' + label + ': ' + pathData.value, cx, y + 20);
}

function drawStakeholders(stakeholders, cx, y, pathW, pathColor) {
  let spacing = pathW / (stakeholders.length + 1);
  let startX = cx - pathW / 2;
  for (let i = 0; i < stakeholders.length; i++) {
    let sx = startX + spacing * (i + 1);
    let sy = y + 30;

    // Stakeholder circle
    noStroke();
    fill('goldenrod');
    ellipse(sx, sy, 36, 36);

    // Person icon
    fill('white');
    noStroke();
    ellipse(sx, sy - 6, 12, 12);
    arc(sx, sy + 8, 20, 16, PI, 0, CHORD);

    // Label below
    fill('darkslategray');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(10);
    textStyle(NORMAL);
    let shortLabel = stakeholders[i].split('(')[0].trim();
    text(shortLabel, sx, sy + 22);

    // Store for click detection
    stakeholders[i]._x = sx;
    stakeholders[i]._y = sy;
  }
}

function drawConsequenceBox(consequence, cx, y, w, pathColor) {
  stroke(pathColor);
  strokeWeight(1.5);
  fill('floralwhite');
  rect(cx - w / 2, y, w, 70, 6);
  noStroke();
  fill('darkslategray');
  textAlign(CENTER, TOP);
  textSize(11);
  textStyle(NORMAL);
  textWrap(WORD);
  text(consequence, cx - w / 2 + 8, y + 6, w - 16, 58);

  // Label
  fill(pathColor);
  textSize(9);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('CONSEQUENCE', cx, y - 12);
}

function drawChoiceButton(cx, y, label, btnColor, side) {
  let bw = 140;
  let bh = 28;
  let hovering = mouseX > cx - bw / 2 && mouseX < cx + bw / 2 &&
                 mouseY > y && mouseY < y + bh;

  noStroke();
  if (hovering) {
    fill(btnColor);
  } else {
    // Lighter version
    if (btnColor === 'teal') {
      fill(0, 128, 128, 180);
    } else {
      fill(255, 127, 80, 180);
    }
  }
  rect(cx - bw / 2, y, bw, bh, 14);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  noStroke();
  text('Choose: ' + label, cx, y + bh / 2);
}

function drawFrameworkPanel(frameworks, cx, y) {
  let panelW = canvasWidth - 60;
  let panelH = 120;

  // Cream background
  stroke('burlywood');
  strokeWeight(1);
  fill('cornsilk');
  rect(cx - panelW / 2, y, panelW, panelH, 8);

  noStroke();
  fill('saddlebrown');
  textAlign(CENTER, TOP);
  textSize(13);
  textStyle(BOLD);
  text('Ethical Framework Lenses', cx, y + 6);

  let colW = (panelW - 30) / 3;
  let labels = ['Deontological', 'Consequentialist', 'Virtue Ethics'];
  let keys = ['deontological', 'consequentialist', 'virtue'];
  let colors = ['darkslateblue', 'darkgreen', 'darkred'];

  for (let i = 0; i < 3; i++) {
    let colX = cx - panelW / 2 + 15 + i * (colW + 5);
    let colY = y + 26;

    fill(colors[i]);
    textAlign(CENTER, TOP);
    textSize(11);
    textStyle(BOLD);
    noStroke();
    text(labels[i], colX + colW / 2, colY);

    fill('darkslategray');
    textSize(10);
    textStyle(NORMAL);
    textWrap(WORD);
    textAlign(LEFT, TOP);
    text(frameworks[keys[i]], colX, colY + 16, colW, 70);
  }
}

function drawTooltip(label, tx, ty) {
  let tw = textWidth(label) + 20;
  tw = max(tw, 160);
  let th = 32;
  let ttx = constrain(tx - tw / 2, 5, canvasWidth - tw - 5);
  let tty = ty - 50;

  fill(0, 0, 0, 200);
  noStroke();
  rect(ttx, tty, tw, th, 6);

  // Arrow
  triangle(tx - 6, tty + th, tx + 6, tty + th, tx, tty + th + 8);

  fill('white');
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(NORMAL);
  noStroke();
  text(label, ttx + tw / 2, tty + th / 2);
}

function mousePressed() {
  let d = dilemmas[dilemmaSelect.value()];
  let midX = canvasWidth / 2;
  let pathAx = midX - canvasWidth * 0.22;
  let pathBx = midX + canvasWidth * 0.22;
  let branchStartY = 100;
  let pathW = canvasWidth * 0.38;

  // Check stakeholder clicks
  let allStakeholders = [
    { list: d.pathA.stakeholders, cx: pathAx, color: 'teal' },
    { list: d.pathB.stakeholders, cx: pathBx, color: 'coral' }
  ];

  for (let group of allStakeholders) {
    let spacing = pathW / (group.list.length + 1);
    let startX = group.cx - pathW / 2;
    for (let i = 0; i < group.list.length; i++) {
      let sx = startX + spacing * (i + 1);
      let sy = branchStartY + 80 + 30;
      if (dist(mouseX, mouseY, sx, sy) < 20) {
        selectedStakeholder = { label: group.list[i], x: sx, y: sy };
        tooltipTimer = 180;
        return;
      }
    }
  }

  // Check choice buttons
  let btnY = branchStartY + 156 + 80;
  let bw = 140;
  let bh = 28;

  if (mouseX > pathAx - bw / 2 && mouseX < pathAx + bw / 2 &&
      mouseY > btnY && mouseY < btnY + bh) {
    choiceMade = 'A';
    choiceFlash = 0;
  }
  if (mouseX > pathBx - bw / 2 && mouseX < pathBx + bw / 2 &&
      mouseY > btnY && mouseY < btnY + bh) {
    choiceMade = 'B';
    choiceFlash = 0;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = max(500, container.offsetWidth);
  } else {
    canvasWidth = max(500, windowWidth);
  }
  canvasHeight = drawHeight + controlHeight;
}
