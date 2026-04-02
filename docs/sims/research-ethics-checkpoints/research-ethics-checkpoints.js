// Research Ethics Checkpoints MicroSim
// Linear process diagram of ethical checkpoints in research
// CANVAS_HEIGHT: 510, drawHeight: 450, controlHeight: 60

let canvasWidth = 400;
const canvasHeight = 510;
const drawHeight = 450;
const controlHeight = 60;

let prevButton;
let nextButton;
let currentStep = 0;
let selectedStage = -1; // which stage's ethics panel is showing

const stages = [
  {name:"Question\nFormulation", ethics:["Whose interests does this research serve?","Are there power imbalances in the research question?","Does the question risk stigmatizing a group?"]},
  {name:"Design &\nPlanning", ethics:["Is informed consent properly designed?","Are vulnerable populations protected?","Has an ethics board reviewed the protocol?"]},
  {name:"Data\nCollection", ethics:["Is participant privacy maintained?","Are participants free to withdraw?","Is data collected without deception?"]},
  {name:"Analysis", ethics:["Are results reported honestly, including negative findings?","Is cherry-picking of data avoided?","Are statistical methods appropriate and transparent?"]},
  {name:"Interpretation", ethics:["Are conclusions supported by the evidence?","Are limitations honestly acknowledged?","Are alternative interpretations considered?"]},
  {name:"Publication", ethics:["Is authorship fairly attributed?","Are conflicts of interest disclosed?","Is the research accessible to affected communities?"]}
];

// Teal palette from light to deep
const stageColors = [
  [160, 220, 220],
  [130, 210, 210],
  [100, 195, 195],
  [70, 180, 180],
  [40, 165, 165],
  [10, 145, 145]
];

// Layout cache
let boxPositions = [];
let useDoubleRow = false;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(handleCanvasClick);
  textAlign(CENTER, CENTER);

  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.mousePressed(goPrev);
  prevButton.style('font-size', '14px');
  prevButton.style('padding', '4px 12px');
  prevButton.style('background', 'white');
  prevButton.style('margin-right', '6px');

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(goNext);
  nextButton.style('font-size', '14px');
  nextButton.style('padding', '4px 12px');
  nextButton.style('background', 'white');

  selectedStage = currentStep;

  describe('A horizontal pipeline diagram showing six research stages with ethical checkpoints revealed by clicking each stage or stepping through with Previous and Next buttons.');
}

function draw() {
  background('aliceblue');

  // Control area
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textSize(17);
  textStyle(BOLD);
  text('Research Ethics Checkpoints', canvasWidth / 2, 25);

  // Step indicator
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Stage ' + (currentStep + 1) + ' of ' + stages.length, canvasWidth / 2, 47);

  // Compute layout
  computeLayout();

  // Draw arrows between stages
  drawArrows();

  // Draw stage boxes
  for (let i = 0; i < stages.length; i++) {
    drawStageBox(i);
  }

  // Draw ethics panel for selected stage
  drawEthicsPanel();

  // Update button states
  if (currentStep === 0) {
    prevButton.attribute('disabled', '');
  } else {
    prevButton.removeAttribute('disabled');
  }
  if (currentStep === stages.length - 1) {
    nextButton.attribute('disabled', '');
  } else {
    nextButton.removeAttribute('disabled');
  }
}

function computeLayout() {
  boxPositions = [];
  let margin = 15;
  let usableWidth = canvasWidth - 2 * margin;

  // Decide single row or double row
  useDoubleRow = canvasWidth < 550;

  if (useDoubleRow) {
    // 2 rows of 3
    let cols = 3;
    let arrowGap = 28;
    let boxW = (usableWidth - (cols - 1) * arrowGap) / cols;
    if (boxW > 140) boxW = 140;
    let boxH = 52;
    let totalRowW = cols * boxW + (cols - 1) * arrowGap;
    let startX = (canvasWidth - totalRowW) / 2;
    let rowYs = [70, 145];

    for (let i = 0; i < stages.length; i++) {
      let row = floor(i / cols);
      let col = i % cols;
      let x = startX + col * (boxW + arrowGap);
      let y = rowYs[row];
      boxPositions.push({x: x, y: y, w: boxW, h: boxH});
    }
  } else {
    // Single row of 6
    let arrowGap = 22;
    let boxW = (usableWidth - 5 * arrowGap) / 6;
    if (boxW > 130) boxW = 130;
    let boxH = 52;
    let totalW = 6 * boxW + 5 * arrowGap;
    let startX = (canvasWidth - totalW) / 2;
    let boxY = 80;

    for (let i = 0; i < stages.length; i++) {
      let x = startX + i * (boxW + arrowGap);
      boxPositions.push({x: x, y: boxY, w: boxW, h: boxH});
    }
  }
}

function drawArrows() {
  for (let i = 1; i < stages.length; i++) {
    let prev = boxPositions[i - 1];
    let curr = boxPositions[i];

    // Check if same row
    let sameRow = (abs(prev.y - curr.y) < 5);

    let revealed = i <= currentStep;

    if (sameRow) {
      // Horizontal arrow
      let arrowStartX = prev.x + prev.w;
      let arrowEndX = curr.x;
      let arrowY = prev.y + prev.h / 2;

      if (revealed) {
        stroke('teal');
        strokeWeight(2);
      } else {
        stroke(200);
        strokeWeight(1);
      }
      line(arrowStartX + 3, arrowY, arrowEndX - 8, arrowY);

      // Arrowhead
      noStroke();
      fill(revealed ? 'teal' : color(200));
      triangle(
        arrowEndX - 2, arrowY,
        arrowEndX - 10, arrowY - 5,
        arrowEndX - 10, arrowY + 5
      );
    } else {
      // Row transition: draw a down-and-left arrow from end of row 1 to start of row 2
      let fromX = prev.x + prev.w / 2;
      let fromY = prev.y + prev.h;
      let toX = curr.x + curr.w / 2;
      let toY = curr.y;

      let midY = (fromY + toY) / 2;

      if (revealed) {
        stroke('teal');
        strokeWeight(2);
      } else {
        stroke(200);
        strokeWeight(1);
      }
      // Down from previous box
      line(fromX, fromY + 3, fromX, midY);
      // Horizontal to next column
      line(fromX, midY, toX, midY);
      // Down to next box
      line(toX, midY, toX, toY - 8);

      // Arrowhead pointing down
      noStroke();
      fill(revealed ? 'teal' : color(200));
      triangle(
        toX, toY - 2,
        toX - 5, toY - 10,
        toX + 5, toY - 10
      );
    }
  }
}

function drawStageBox(i) {
  let bp = boxPositions[i];
  let revealed = i <= currentStep;
  let isSelected = i === selectedStage;

  // Box shadow/highlight for selected
  if (isSelected && revealed) {
    noStroke();
    fill(255, 200, 50, 80);
    rect(bp.x - 3, bp.y - 3, bp.w + 6, bp.h + 6, 10);
  }

  // Box
  noStroke();
  if (revealed) {
    fill(stageColors[i][0], stageColors[i][1], stageColors[i][2]);
  } else {
    fill(220);
  }
  rect(bp.x, bp.y, bp.w, bp.h, 8);

  // Selected border
  if (isSelected && revealed) {
    stroke('goldenrod');
    strokeWeight(2.5);
    noFill();
    rect(bp.x, bp.y, bp.w, bp.h, 8);
  }

  // Stage number badge
  let badgeX = bp.x + bp.w - 12;
  let badgeY = bp.y + 10;
  noStroke();
  if (revealed) {
    fill(0, 120, 120);
  } else {
    fill(180);
  }
  ellipse(badgeX, badgeY, 20, 20);
  fill('white');
  textSize(10);
  textStyle(BOLD);
  noStroke();
  text(i + 1, badgeX, badgeY);

  // Golden checkpoint icon for revealed stages
  if (revealed) {
    let iconX = bp.x + 14;
    let iconY = bp.y + 10;
    noStroke();
    fill('goldenrod');
    // Small shield/checkmark icon
    ellipse(iconX, iconY, 16, 16);
    fill('white');
    textSize(10);
    textStyle(BOLD);
    text('\u2713', iconX, iconY);
  }

  // Stage label
  noStroke();
  if (revealed) {
    fill(0, 60, 60);
  } else {
    fill(160);
  }
  textSize(10);
  textStyle(BOLD);
  text(stages[i].name, bp.x + bp.w / 2, bp.y + bp.h / 2 + 4);
}

function drawEthicsPanel() {
  if (selectedStage < 0 || selectedStage > currentStep) return;

  let panelMargin = 20;
  let panelY = useDoubleRow ? 215 : 155;
  let panelH = drawHeight - panelY - 10;
  let panelW = canvasWidth - 2 * panelMargin;

  // Panel background
  noStroke();
  fill(255, 255, 255, 230);
  rect(panelMargin, panelY, panelW, panelH, 10);

  // Panel border
  stroke('teal');
  strokeWeight(1.5);
  noFill();
  rect(panelMargin, panelY, panelW, panelH, 10);

  // Panel title
  noStroke();
  fill(0, 120, 120);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  let titleText = stages[selectedStage].name.replace('\n', ' ');
  text('Ethical Checkpoints: ' + titleText, canvasWidth / 2, panelY + 22);

  // Divider line
  stroke(0, 180, 180);
  strokeWeight(1);
  line(panelMargin + 20, panelY + 38, panelMargin + panelW - 20, panelY + 38);

  // Checkpoints as checklist
  let ethics = stages[selectedStage].ethics;
  let startY = panelY + 58;
  let lineSpacing = 18;
  let leftX = panelMargin + 35;
  let maxTextW = panelW - 60;

  textAlign(LEFT, TOP);

  for (let i = 0; i < ethics.length; i++) {
    let itemY = startY;

    // Wrap text and get lines
    textSize(13);
    textStyle(NORMAL);
    let lines = wrapText(ethics[i], maxTextW);

    // Checkbox icon
    noStroke();
    fill('goldenrod');
    let checkSize = 16;
    let checkX = panelMargin + 18;
    let checkY = itemY + 1;
    rect(checkX - checkSize / 2, checkY - checkSize / 2 + 2, checkSize, checkSize, 3);
    fill('white');
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('\u2713', checkX, checkY + 2);

    // Checkpoint text
    textAlign(LEFT, TOP);
    noStroke();
    fill(40);
    textSize(13);
    textStyle(NORMAL);
    for (let j = 0; j < lines.length; j++) {
      text(lines[j], leftX, itemY + j * lineSpacing);
    }

    startY += lines.length * lineSpacing + 12;
  }

  // Restore text alignment
  textAlign(CENTER, CENTER);
}

function wrapText(txt, maxWidth) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

function handleCanvasClick() {
  // Check if a stage box was clicked
  for (let i = 0; i < boxPositions.length; i++) {
    let bp = boxPositions[i];
    if (mouseX >= bp.x && mouseX <= bp.x + bp.w &&
        mouseY >= bp.y && mouseY <= bp.y + bp.h) {
      if (i <= currentStep) {
        selectedStage = i;
      }
      return;
    }
  }
}

function goPrev() {
  if (currentStep > 0) {
    currentStep--;
    selectedStage = currentStep;
  }
}

function goNext() {
  if (currentStep < stages.length - 1) {
    currentStep++;
    selectedStage = currentStep;
  }
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.offsetWidth;
  }
  if (canvasWidth < 300) canvasWidth = 300;
  if (canvasWidth > 1200) canvasWidth = 1200;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
