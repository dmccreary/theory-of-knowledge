// Cognitive Dissonance Resolution Strategies Flowchart
// CANVAS_HEIGHT: 510
// Interactive flowchart showing how people resolve cognitive dissonance
// through four strategies ranked by epistemic honesty.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = 510;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let scenarioSelect;
let resetButton;

// State
let selectedPath = -1; // -1 = none selected
let hoveredPath = -1;

// Scenario data
let scenarios = [
  {
    label: "Environmental values vs. flying",
    belief: "I care about climate change",
    behavior: "I fly frequently for holidays",
    paths: [
      {
        strategy: "Change Belief",
        action: "\"Climate change isn't really caused by individual actions.\"",
        explanation: "You adjust your belief to remove the conflict. This reduces dissonance but involves denying well-supported evidence. Epistemic cost: you weaken your relationship with truth.",
        quality: 2,
        color: [0, 120, 110]
      },
      {
        strategy: "Change Behavior",
        action: "\"I'll take trains or choose closer holiday destinations.\"",
        explanation: "You align your actions with your values. This is the most epistemically honest path because you preserve a true belief and act consistently. It requires effort but maintains integrity.",
        quality: 4,
        color: [0, 150, 136]
      },
      {
        strategy: "Add Justification",
        action: "\"I offset my flights by donating to tree-planting charities.\"",
        explanation: "You introduce a new belief that bridges the gap. This can be legitimate if the justification is sound, but often serves as a convenient rationalization rather than genuine resolution.",
        quality: 3,
        color: [0, 105, 92]
      },
      {
        strategy: "Minimize Importance",
        action: "\"One person's flights don't really matter in the big picture.\"",
        explanation: "You downplay the significance of the conflict. This is the least honest strategy — it avoids engagement with the problem entirely and can become a habit of intellectual avoidance.",
        quality: 1,
        color: [0, 85, 75]
      }
    ]
  },
  {
    label: "Healthy eating vs. junk food",
    belief: "I value healthy eating",
    behavior: "I eat fast food regularly",
    paths: [
      {
        strategy: "Change Belief",
        action: "\"Fast food isn't really that unhealthy in moderation.\"",
        explanation: "You redefine what 'healthy eating' means to accommodate your behavior. This distorts your original belief and may lead to ignoring nutritional evidence.",
        quality: 2,
        color: [0, 120, 110]
      },
      {
        strategy: "Change Behavior",
        action: "\"I'll meal-prep healthy lunches and reduce fast food to once a month.\"",
        explanation: "You bring your actions into alignment with your values. This preserves the truth of your belief and demonstrates genuine commitment. The hardest path, but the most honest.",
        quality: 4,
        color: [0, 150, 136]
      },
      {
        strategy: "Add Justification",
        action: "\"I'm too busy to cook — fast food saves time for studying.\"",
        explanation: "You add a competing value (time efficiency) to justify the inconsistency. The justification may be partly true, but it avoids addressing the core tension between values and actions.",
        quality: 3,
        color: [0, 105, 92]
      },
      {
        strategy: "Minimize Importance",
        action: "\"Diet doesn't matter that much — genetics determine health anyway.\"",
        explanation: "You reduce the importance of the belief itself. This is epistemically dangerous because it dismisses well-established knowledge to avoid personal discomfort.",
        quality: 1,
        color: [0, 85, 75]
      }
    ]
  },
  {
    label: "Academic honesty vs. copying",
    belief: "I value academic integrity",
    behavior: "I copied a friend's homework",
    paths: [
      {
        strategy: "Change Belief",
        action: "\"Homework is just busywork — copying isn't real cheating.\"",
        explanation: "You redefine cheating to exclude your specific action. This erodes the meaning of academic integrity and makes it easier to cross more serious ethical lines in the future.",
        quality: 2,
        color: [0, 120, 110]
      },
      {
        strategy: "Change Behavior",
        action: "\"I'll redo the work myself and not copy again.\"",
        explanation: "You acknowledge the inconsistency and correct your behavior. This is the most epistemically honest response — it preserves your commitment to integrity and produces genuine learning.",
        quality: 4,
        color: [0, 150, 136]
      },
      {
        strategy: "Add Justification",
        action: "\"I was overwhelmed with other assignments — it was a one-time thing.\"",
        explanation: "You introduce context to make the behavior seem reasonable. While circumstances matter, this risks becoming a pattern of excusing dishonesty whenever it feels convenient.",
        quality: 3,
        color: [0, 105, 92]
      },
      {
        strategy: "Minimize Importance",
        action: "\"Everyone copies sometimes — it's not a big deal.\"",
        explanation: "You normalize the behavior by assuming universality. This is the weakest strategy: it avoids personal responsibility and uses a logical fallacy (appeal to common practice).",
        quality: 1,
        color: [0, 85, 75]
      }
    ]
  }
];

let currentScenario = 0;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Scenario dropdown
  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  for (let i = 0; i < scenarios.length; i++) {
    scenarioSelect.option(scenarios[i].label, i);
  }
  scenarioSelect.changed(() => {
    currentScenario = int(scenarioSelect.value());
    selectedPath = -1;
  });
  scenarioSelect.style('font-size', '14px');
  scenarioSelect.style('padding', '4px 8px');
  scenarioSelect.style('background', 'white');
  scenarioSelect.style('border-radius', '4px');
  scenarioSelect.style('border', '1px solid silver');
  scenarioSelect.position(10, drawHeight + 18);

  // Reset button
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => {
    selectedPath = -1;
  });
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '4px 12px');
  resetButton.style('background', 'white');
  resetButton.style('border-radius', '4px');
  resetButton.style('border', '1px solid silver');
  resetButton.style('cursor', 'pointer');
  resetButton.position(canvasWidth - 70, drawHeight + 18);

  describe('Flowchart showing cognitive dissonance with two conflicting beliefs at top, a discomfort zone in the middle, and four resolution strategy paths below ranked by epistemic honesty.');
}

function draw() {
  let sc = scenarios[currentScenario];

  // Background
  background('aliceblue');

  // Control area
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill('white');
  rect(4, drawHeight + 4, canvasWidth - 8, controlHeight - 8, 6);

  // Layout calculations
  let centerX = canvasWidth / 2;
  let boxW = min(canvasWidth * 0.36, 200);
  let boxH = 52;
  let beliefX = centerX - boxW - 20;
  let behaviorX = centerX + 20;
  let topY = 16;
  let gap = 10;

  // --- Title ---
  noStroke();
  fill(30);
  textSize(min(17, canvasWidth * 0.04));
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Cognitive Dissonance Resolution', centerX, topY);
  textStyle(NORMAL);

  let beliefTopY = topY + 30;

  // --- Belief box ---
  fill(0, 150, 136, 40);
  stroke(0, 150, 136);
  strokeWeight(2);
  rect(beliefX, beliefTopY, boxW, boxH, 8);
  noStroke();
  fill(0, 100, 90);
  textSize(11);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('BELIEF', beliefX + boxW / 2, beliefTopY + 5);
  textStyle(NORMAL);
  textSize(min(12, canvasWidth * 0.03));
  fill(30);
  text(sc.belief, beliefX + boxW / 2, beliefTopY + 20, boxW - 12, boxH - 24);

  // --- Behavior box ---
  fill(200, 80, 60, 40);
  stroke(200, 80, 60);
  strokeWeight(2);
  rect(behaviorX, beliefTopY, boxW, boxH, 8);
  noStroke();
  fill(180, 60, 40);
  textSize(11);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('BEHAVIOR', behaviorX + boxW / 2, beliefTopY + 5);
  textStyle(NORMAL);
  textSize(min(12, canvasWidth * 0.03));
  fill(30);
  text(sc.behavior, behaviorX + boxW / 2, beliefTopY + 20, boxW - 12, boxH - 24);

  // --- Lightning bolt between boxes ---
  let boltX = centerX;
  let boltY = beliefTopY + boxH / 2;
  drawLightningBolt(boltX, boltY - 14, 18);

  // --- Discomfort zone ---
  let discomfortY = beliefTopY + boxH + 14;
  let discomfortH = 36;
  let discomfortW = min(canvasWidth - 40, boxW * 2 + 60);
  let discomfortX = centerX - discomfortW / 2;

  // Amber gradient feel
  noStroke();
  fill(255, 193, 7, 50);
  rect(discomfortX, discomfortY, discomfortW, discomfortH, 8);
  stroke(255, 160, 0);
  strokeWeight(2);
  noFill();
  rect(discomfortX, discomfortY, discomfortW, discomfortH, 8);
  noStroke();
  fill(180, 110, 0);
  textSize(13);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('⚡ COGNITIVE DISSONANCE — Psychological Discomfort ⚡', centerX, discomfortY + discomfortH / 2);
  textStyle(NORMAL);

  // --- Arrow from discomfort to paths ---
  let arrowY = discomfortY + discomfortH + 6;
  stroke(120);
  strokeWeight(2);
  line(centerX, arrowY, centerX, arrowY + 16);
  // arrowhead
  fill(120);
  noStroke();
  triangle(centerX - 5, arrowY + 12, centerX + 5, arrowY + 12, centerX, arrowY + 20);

  // Label
  fill(100);
  textSize(11);
  textAlign(CENTER, TOP);
  text('How do you resolve it?', centerX, arrowY + 22);

  // --- Resolution paths ---
  let pathTopY = arrowY + 40;
  let pathW = min((canvasWidth - margin * 2 - 30) / 4, 140);
  let pathH = 70;
  let totalW = pathW * 4 + 10 * 3;
  let startX = centerX - totalW / 2;

  // Sort display order: Change Behavior, Add Justification, Change Belief, Minimize Importance
  // (most to least honest, left to right)
  let displayOrder = [1, 2, 0, 3]; // indices into paths array

  hoveredPath = -1;

  for (let i = 0; i < 4; i++) {
    let pi = displayOrder[i];
    let p = sc.paths[pi];
    let px = startX + i * (pathW + 10);
    let py = pathTopY;

    // Check hover
    if (mouseX >= px && mouseX <= px + pathW && mouseY >= py && mouseY <= py + pathH) {
      hoveredPath = pi;
    }

    // Draw connecting line from center arrow
    stroke(p.color[0], p.color[1], p.color[2], 120);
    strokeWeight(2);
    let lineTopX = centerX;
    let lineBottomX = px + pathW / 2;
    line(lineTopX, arrowY + 20, lineBottomX, py);

    // Path box
    let isSelected = (selectedPath === pi);
    let isHovered = (hoveredPath === pi);

    if (isSelected) {
      fill(p.color[0], p.color[1], p.color[2], 220);
    } else if (isHovered) {
      fill(p.color[0], p.color[1], p.color[2], 180);
    } else {
      fill(p.color[0], p.color[1], p.color[2], 140);
    }
    stroke(p.color[0], p.color[1], p.color[2]);
    strokeWeight(isSelected ? 3 : 1.5);
    rect(px, py, pathW, pathH, 8);

    // Strategy label
    noStroke();
    fill(255);
    textSize(min(12, pathW * 0.1));
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text(p.strategy, px + pathW / 2, py + 6);
    textStyle(NORMAL);

    // Stars
    let starStr = '';
    for (let s = 0; s < 4; s++) {
      starStr += s < p.quality ? '★' : '☆';
    }
    fill(255, 230, 100);
    textSize(14);
    text(starStr, px + pathW / 2, py + 24);

    // Short action text
    fill(255, 255, 255, 220);
    textSize(min(9, pathW * 0.075));
    text('Click to explore', px + pathW / 2, py + pathH - 16);
  }

  // Cursor style
  if (hoveredPath >= 0) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // --- Explanation panel ---
  if (selectedPath >= 0) {
    let p = sc.paths[selectedPath];
    let panelY = pathTopY + pathH + 14;
    let panelW = min(canvasWidth - margin * 2, 520);
    let panelX = centerX - panelW / 2;
    let panelH = drawHeight - panelY - 8;

    // Panel background
    fill(255, 255, 255, 240);
    stroke(p.color[0], p.color[1], p.color[2]);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 8);

    // Panel title
    noStroke();
    fill(p.color[0], p.color[1], p.color[2]);
    textSize(14);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text(p.strategy, panelX + 12, panelY + 10);

    // Stars
    let starStr = '';
    for (let s = 0; s < 4; s++) {
      starStr += s < p.quality ? '★' : '☆';
    }
    fill(200, 160, 0);
    textSize(14);
    textAlign(RIGHT, TOP);
    text(starStr + ' Epistemic Quality', panelX + panelW - 12, panelY + 10);

    // Action quote
    noStroke();
    fill(80);
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(ITALIC);
    text(p.action, panelX + 12, panelY + 32, panelW - 24, 36);
    textStyle(NORMAL);

    // Explanation
    fill(40);
    textSize(12);
    text(p.explanation, panelX + 12, panelY + 70, panelW - 24, panelH - 80);

    // Quality label
    let qualityLabels = ['', 'Least Honest', 'Somewhat Honest', 'Moderately Honest', 'Most Honest'];
    fill(p.color[0], p.color[1], p.color[2]);
    textSize(11);
    textAlign(RIGHT, BOTTOM);
    textStyle(BOLD);
    text('Epistemic Rating: ' + qualityLabels[p.quality], panelX + panelW - 12, panelY + panelH - 8);
    textStyle(NORMAL);
  } else {
    // Prompt to click
    let promptY = pathTopY + pathH + 30;
    noStroke();
    fill(120);
    textSize(13);
    textAlign(CENTER, CENTER);
    textStyle(ITALIC);
    text('Click a resolution strategy above to see its explanation and epistemic rating.', centerX, promptY, canvasWidth - 60, 40);
    textStyle(NORMAL);
  }
}

function drawLightningBolt(x, y, size) {
  noStroke();
  fill(255, 180, 0);
  beginShape();
  vertex(x - size * 0.15, y - size * 0.5);
  vertex(x + size * 0.25, y - size * 0.5);
  vertex(x + size * 0.05, y - size * 0.05);
  vertex(x + size * 0.3, y - size * 0.05);
  vertex(x - size * 0.15, y + size * 0.55);
  vertex(x + size * 0.05, y + size * 0.1);
  vertex(x - size * 0.2, y + size * 0.1);
  endShape(CLOSE);
}

function mousePressed() {
  let sc = scenarios[currentScenario];
  let centerX = canvasWidth / 2;
  let boxW = min(canvasWidth * 0.36, 200);
  let boxH = 52;
  let topY = 16;
  let beliefTopY = topY + 30;
  let discomfortY = beliefTopY + boxH + 14;
  let discomfortH = 36;
  let arrowY = discomfortY + discomfortH + 6;
  let pathTopY = arrowY + 40;
  let pathW = min((canvasWidth - margin * 2 - 30) / 4, 140);
  let pathH = 70;
  let totalW = pathW * 4 + 10 * 3;
  let startX = centerX - totalW / 2;

  let displayOrder = [1, 2, 0, 3];

  for (let i = 0; i < 4; i++) {
    let pi = displayOrder[i];
    let px = startX + i * (pathW + 10);
    let py = pathTopY;

    if (mouseX >= px && mouseX <= px + pathW && mouseY >= py && mouseY <= py + pathH) {
      selectedPath = (selectedPath === pi) ? -1 : pi;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  scenarioSelect.position(10, drawHeight + 18);
  scenarioSelect.style('max-width', (canvasWidth - 120) + 'px');
  resetButton.position(canvasWidth - 70, drawHeight + 18);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
