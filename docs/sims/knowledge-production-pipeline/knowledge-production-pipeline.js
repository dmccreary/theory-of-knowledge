// Knowledge Production Pipeline MicroSim
// Shows stages of knowledge production with AOK-specific examples
// CANVAS_HEIGHT: 510, drawHeight: 450, controlHeight: 60

let canvasWidth = 400;
const canvasHeight = 510;
const drawHeight = 450;
const controlHeight = 60;

let aokSelect;
let prevButton;
let nextButton;
let currentStep = 0;

const stages = ["Inquiry", "Research", "Analysis", "Validation", "Dissemination"];

const aokExamples = {
  "Natural Sciences": [
    "Form hypothesis",
    "Controlled experiment",
    "Statistical analysis",
    "Peer review & replication",
    "Journal publication"
  ],
  "History": [
    "Formulate question",
    "Archival research",
    "Source analysis & narrative",
    "Peer review & corroboration",
    "Books & lectures"
  ],
  "The Arts": [
    "Creative impulse",
    "Experimentation with form",
    "Reflection & revision",
    "Exhibition/critique",
    "Gallery, performance, publication"
  ],
  "Human Sciences": [
    "Identify social pattern",
    "Surveys & fieldwork",
    "Qualitative/quantitative analysis",
    "Ethics review & replication",
    "Reports & policy papers"
  ]
};

// Teal gradient from light to deep
const stageColors = [
  [180, 230, 230],
  [130, 210, 210],
  [80, 190, 190],
  [40, 165, 165],
  [0, 140, 140]
];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);

  // Controls
  aokSelect = createSelect();
  aokSelect.parent(document.querySelector('main'));
  let aokKeys = Object.keys(aokExamples);
  for (let i = 0; i < aokKeys.length; i++) {
    aokSelect.option(aokKeys[i]);
  }
  aokSelect.style('font-size', '14px');
  aokSelect.style('padding', '4px 8px');
  aokSelect.style('background', 'white');
  aokSelect.style('margin-right', '10px');

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

  describe('A horizontal pipeline diagram showing five stages of knowledge production with AOK-specific examples revealed step by step.');
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let selectedAOK = aokSelect.value();
  let examples = aokExamples[selectedAOK];

  // Title
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  text('Knowledge Production Pipeline', canvasWidth / 2, 30);

  // AOK subtitle
  textSize(14);
  textStyle(ITALIC);
  fill(0, 100, 100);
  text(selectedAOK, canvasWidth / 2, 55);

  // Step indicator
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text('Stage ' + (currentStep + 1) + ' of ' + stages.length, canvasWidth / 2, 75);

  // Pipeline layout
  let margin = 20;
  let usableWidth = canvasWidth - 2 * margin;
  let boxW = usableWidth * 0.16;
  let arrowGap = usableWidth * 0.05;
  let totalPipelineWidth = stages.length * boxW + (stages.length - 1) * arrowGap;
  let startX = (canvasWidth - totalPipelineWidth) / 2;
  let boxY = 130;
  let boxH = 60;

  for (let i = 0; i < stages.length; i++) {
    let x = startX + i * (boxW + arrowGap);
    let revealed = i <= currentStep;

    // Draw arrow before this box (except first)
    if (i > 0) {
      let arrowStartX = x - arrowGap;
      let arrowEndX = x;
      let arrowY = boxY + boxH / 2;

      if (revealed) {
        stroke(0, 140, 140);
        strokeWeight(2);
      } else {
        stroke(200);
        strokeWeight(1);
      }
      line(arrowStartX, arrowY, arrowEndX - 6, arrowY);
      // Arrowhead
      noStroke();
      if (revealed) {
        fill(0, 140, 140);
      } else {
        fill(200);
      }
      triangle(
        arrowEndX, arrowY,
        arrowEndX - 8, arrowY - 5,
        arrowEndX - 8, arrowY + 5
      );
    }

    // Draw box
    noStroke();
    if (revealed) {
      fill(stageColors[i][0], stageColors[i][1], stageColors[i][2]);
    } else {
      fill(220);
    }
    rect(x, boxY, boxW, boxH, 8);

    // Stage number circle
    let circleY = boxY - 15;
    let circleX = x + boxW / 2;
    if (revealed) {
      fill(0, 120, 120);
    } else {
      fill(180);
    }
    ellipse(circleX, circleY, 24, 24);
    noStroke();
    fill('white');
    textSize(12);
    textStyle(BOLD);
    text(i + 1, circleX, circleY);

    // Stage label
    noStroke();
    if (revealed) {
      fill('black');
    } else {
      fill(160);
    }
    textSize(11);
    textStyle(BOLD);
    text(stages[i], x + boxW / 2, boxY + boxH / 2);

    // AOK-specific sub-step below box
    if (revealed && examples) {
      noStroke();
      fill(0, 100, 100);
      textSize(10);
      textStyle(NORMAL);

      // Word wrap the example text
      let exampleText = examples[i];
      let subY = boxY + boxH + 15;
      let maxW = boxW + 10;
      drawWrappedText(exampleText, x + boxW / 2, subY, maxW, 13);
    }
  }

  // Description panel at bottom of draw area
  if (examples) {
    let panelY = 300;
    let panelH = 130;
    let panelMargin = 30;

    noStroke();
    fill(255, 255, 255, 200);
    rect(panelMargin, panelY, canvasWidth - 2 * panelMargin, panelH, 10);

    // Current stage detail
    noStroke();
    fill(0, 120, 120);
    textSize(16);
    textStyle(BOLD);
    text(stages[currentStep], canvasWidth / 2, panelY + 25);

    // Horizontal rule
    stroke(0, 180, 180);
    strokeWeight(1);
    line(panelMargin + 40, panelY + 40, canvasWidth - panelMargin - 40, panelY + 40);

    // AOK method
    noStroke();
    fill(60);
    textSize(13);
    textStyle(ITALIC);
    text('"' + examples[currentStep] + '"', canvasWidth / 2, panelY + 60);

    // Stage description
    textStyle(NORMAL);
    textSize(11);
    fill(80);
    let desc = getStageDescription(currentStep);
    drawWrappedText(desc, canvasWidth / 2, panelY + 85, canvasWidth - 2 * panelMargin - 30, 15);
  }

  // Update button states
  if (prevButton) {
    prevButton.attribute('disabled', currentStep === 0 ? 'true' : null);
    if (currentStep === 0) {
      prevButton.attribute('disabled', '');
    } else {
      prevButton.removeAttribute('disabled');
    }
  }
  if (nextButton) {
    if (currentStep === stages.length - 1) {
      nextButton.attribute('disabled', '');
    } else {
      nextButton.removeAttribute('disabled');
    }
  }
}

function drawWrappedText(txt, cx, startY, maxWidth, lineH) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
    if (textWidth(testLine) > maxWidth) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cx, startY + i * lineH);
  }
}

function getStageDescription(stageIndex) {
  let descriptions = [
    "The pipeline begins with a question or problem. Every area of knowledge starts by identifying what needs to be understood or explored.",
    "Gathering evidence, data, or material relevant to the inquiry. Methods vary widely across disciplines, from lab experiments to archival digs.",
    "Making sense of what was gathered. This stage involves interpretation, pattern recognition, and applying disciplinary frameworks.",
    "Testing whether the knowledge claims hold up. Different AOKs have different standards for what counts as validated knowledge.",
    "Sharing knowledge with the wider community. How knowledge is communicated shapes how it is received and used."
  ];
  return descriptions[stageIndex];
}

function goPrev() {
  if (currentStep > 0) {
    currentStep--;
  }
}

function goNext() {
  if (currentStep < stages.length - 1) {
    currentStep++;
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
