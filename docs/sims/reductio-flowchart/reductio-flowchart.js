// Reductio ad Absurdum Step-by-Step Flowchart MicroSim
// CANVAS_HEIGHT: 510, drawHeight: 450, controlHeight: 60

let canvasWidth = 400;
const canvasHeight = 510;
const drawHeight = 450;
const controlHeight = 60;

let exampleSelect;
let prevBtn;
let nextBtn;
let currentStep = 0;

const examples = {
  "√2 is irrational": {
    steps: [
      {type:"start", text:"Claim: √2 is irrational"},
      {type:"assume", text:"Assume: √2 IS rational (√2 = a/b in lowest terms)"},
      {type:"derive", text:"Then: 2 = a²/b², so a² = 2b²"},
      {type:"derive", text:"Therefore: a² is even, so a must be even (a = 2k)"},
      {type:"derive", text:"Substituting: (2k)² = 2b², so 4k² = 2b², so b² = 2k²"},
      {type:"contradiction", text:"Contradiction: b is also even, but a/b was in lowest terms!"},
      {type:"conclude", text:"Therefore: √2 must be irrational ∎"}
    ]
  },
  "Infinite primes": {
    steps: [
      {type:"start", text:"Claim: There are infinitely many primes"},
      {type:"assume", text:"Assume: There are finitely many primes (p₁, p₂, ..., pₙ)"},
      {type:"derive", text:"Construct: N = (p₁ × p₂ × ... × pₙ) + 1"},
      {type:"derive", text:"N is not divisible by any prime in our list (remainder 1)"},
      {type:"contradiction", text:"Contradiction: N must have a prime factor not in our 'complete' list!"},
      {type:"conclude", text:"Therefore: There are infinitely many primes ∎"}
    ]
  },
  "No smallest positive rational": {
    steps: [
      {type:"start", text:"Claim: There is no smallest positive rational number"},
      {type:"assume", text:"Assume: r is the smallest positive rational"},
      {type:"derive", text:"Consider: r/2 (half of r)"},
      {type:"derive", text:"r/2 is positive and rational (rationals closed under division)"},
      {type:"contradiction", text:"Contradiction: r/2 < r, but r was supposed to be smallest!"},
      {type:"conclude", text:"Therefore: No smallest positive rational exists ∎"}
    ]
  }
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Controls row
  exampleSelect = createSelect();
  exampleSelect.parent(document.querySelector('main'));
  exampleSelect.style('background-color', 'white');
  exampleSelect.style('font-size', '14px');
  exampleSelect.style('padding', '4px 8px');
  for (let key of Object.keys(examples)) {
    exampleSelect.option(key);
  }
  exampleSelect.changed(onExampleChange);

  prevBtn = createButton('◀ Previous');
  prevBtn.parent(document.querySelector('main'));
  prevBtn.style('background-color', 'white');
  prevBtn.style('font-size', '14px');
  prevBtn.style('padding', '4px 12px');
  prevBtn.style('margin-left', '10px');
  prevBtn.mousePressed(onPrev);

  nextBtn = createButton('Next ▶');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.style('background-color', 'white');
  nextBtn.style('font-size', '14px');
  nextBtn.style('padding', '4px 12px');
  nextBtn.style('margin-left', '6px');
  nextBtn.mousePressed(onNext);

  describe('A step-by-step flowchart showing reductio ad absurdum reasoning with three example arguments.');
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  let exName = exampleSelect.value();
  let steps = examples[exName].steps;
  let totalSteps = steps.length;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text('Reductio ad Absurdum', canvasWidth / 2, 22);
  textStyle(NORMAL);

  // Step counter
  textSize(12);
  fill('dimgray');
  noStroke();
  text('Step ' + (currentStep + 1) + ' of ' + totalSteps, canvasWidth / 2, 42);

  // Layout parameters
  let boxW = canvasWidth * 0.82;
  let boxH = 46;
  let startY = 60;
  let spacing = 8;
  let arrowLen = spacing;
  let centerX = canvasWidth / 2;

  // Calculate total height needed and scale if necessary
  let totalNeeded = totalSteps * boxH + (totalSteps - 1) * spacing;
  let availableH = drawHeight - startY - 16;
  let scaleFactor = 1;
  if (totalNeeded > availableH) {
    scaleFactor = availableH / totalNeeded;
    boxH = boxH * scaleFactor;
    spacing = spacing * scaleFactor;
    arrowLen = spacing;
  }

  for (let i = 0; i < totalSteps; i++) {
    let revealed = i <= currentStep;
    let isCurrent = i === currentStep;
    let y = startY + i * (boxH + spacing);

    // Draw arrow from previous step
    if (i > 0 && revealed) {
      let arrowTopY = y - spacing;
      let arrowBotY = y;
      stroke('gray');
      strokeWeight(2);
      line(centerX, arrowTopY, centerX, arrowBotY);
      // Arrowhead
      fill('gray');
      noStroke();
      triangle(centerX - 5, arrowBotY - 6, centerX + 5, arrowBotY - 6, centerX, arrowBotY);
    }

    if (!revealed) {
      // Draw placeholder
      fill(230);
      noStroke();
      rect(centerX - boxW / 2, y, boxW, boxH, 8);
      fill(180);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(13 * scaleFactor + 3);
      text('?', centerX, y + boxH / 2);
      continue;
    }

    let step = steps[i];
    let alpha = isCurrent ? 255 : 180;
    let boxX = centerX - boxW / 2;

    // Draw box based on type
    if (step.type === 'start') {
      // Green oval
      let c = color('mediumseagreen');
      c.setAlpha(alpha);
      fill(c);
      noStroke();
      rect(boxX, y, boxW, boxH, boxH / 2);
      if (isCurrent) {
        stroke('seagreen');
        strokeWeight(3);
        noFill();
        rect(boxX, y, boxW, boxH, boxH / 2);
      }
    } else if (step.type === 'assume') {
      // Coral rect with label
      let c = color('coral');
      c.setAlpha(alpha);
      fill(c);
      noStroke();
      rect(boxX, y, boxW, boxH, 8);
      if (isCurrent) {
        stroke('orangered');
        strokeWeight(3);
        noFill();
        rect(boxX, y, boxW, boxH, 8);
      }
      // ASSUME label
      fill('white');
      noStroke();
      textAlign(LEFT, TOP);
      textSize(9);
      textStyle(BOLD);
      text('ASSUME', boxX + 8, y + 3);
      textStyle(NORMAL);
    } else if (step.type === 'derive') {
      // Teal rect
      let c = color('teal');
      c.setAlpha(alpha);
      fill(c);
      noStroke();
      rect(boxX, y, boxW, boxH, 8);
      if (isCurrent) {
        stroke('darkcyan');
        strokeWeight(3);
        noFill();
        rect(boxX, y, boxW, boxH, 8);
      }
    } else if (step.type === 'contradiction') {
      // Coral rect with lightning bolt
      let c = color('coral');
      c.setAlpha(alpha);
      fill(c);
      noStroke();
      rect(boxX, y, boxW, boxH, 8);
      if (isCurrent) {
        stroke('orangered');
        strokeWeight(3);
        noFill();
        rect(boxX, y, boxW, boxH, 8);
      }
      // Lightning bolt label
      fill('white');
      noStroke();
      textAlign(LEFT, TOP);
      textSize(10);
      textStyle(BOLD);
      text('⚡', boxX + 6, y + 2);
      textStyle(NORMAL);
    } else if (step.type === 'conclude') {
      // Gold rect
      let c = color('gold');
      c.setAlpha(alpha);
      fill(c);
      noStroke();
      rect(boxX, y, boxW, boxH, 8);
      if (isCurrent) {
        stroke('goldenrod');
        strokeWeight(3);
        noFill();
        rect(boxX, y, boxW, boxH, 8);
      }
    }

    // Draw text
    let textC;
    if (step.type === 'conclude') {
      textC = color('black');
    } else {
      textC = color('white');
    }
    textC.setAlpha(alpha);
    fill(textC);
    noStroke();
    textAlign(CENTER, CENTER);
    let fs = constrain(13 * scaleFactor + 1, 10, 14);
    textSize(fs);

    // Word-wrap the text inside the box
    let padding = 14;
    let maxTextW = boxW - padding * 2;
    let wrappedLines = wrapText(step.text, maxTextW, fs);
    let lineH = fs + 2;
    let textTopY = y + (boxH - wrappedLines.length * lineH) / 2 + lineH / 2;
    for (let li = 0; li < wrappedLines.length; li++) {
      text(wrappedLines[li], centerX, textTopY + li * lineH);
    }
  }

  // Update button states
  prevBtn.attribute('disabled', currentStep <= 0 ? true : false);
  if (currentStep <= 0) {
    prevBtn.attribute('disabled', '');
  } else {
    prevBtn.removeAttribute('disabled');
  }
  if (currentStep >= totalSteps - 1) {
    nextBtn.attribute('disabled', '');
  } else {
    nextBtn.removeAttribute('disabled');
  }
}

function wrapText(txt, maxW, fontSize) {
  textSize(fontSize);
  let words = txt.split(' ');
  let lines = [];
  let current = '';
  for (let w of words) {
    let test = current.length === 0 ? w : current + ' ' + w;
    if (textWidth(test) > maxW && current.length > 0) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function onExampleChange() {
  currentStep = 0;
}

function onPrev() {
  if (currentStep > 0) currentStep--;
}

function onNext() {
  let exName = exampleSelect.value();
  let total = examples[exName].steps.length;
  if (currentStep < total - 1) currentStep++;
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  canvasWidth = max(canvasWidth, 300);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
