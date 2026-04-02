// Argument Anatomy Dissector MicroSim
// CANVAS_HEIGHT: 465

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- Argument data ----
let arguments_data = [
  {
    name: "Dolphins Argument",
    full: "All mammals breathe air. Dolphins are mammals. Therefore, dolphins breathe air.",
    premises: ["All mammals breathe air.", "Dolphins are mammals."],
    conclusion: "Therefore, dolphins breathe air.",
    type: "Deductive (valid & sound)",
    indicators: ["All", "Therefore"]
  },
  {
    name: "Swan Argument",
    full: "Every swan I have seen is white. Therefore, all swans are white.",
    premises: ["Every swan I have seen is white."],
    conclusion: "Therefore, all swans are white.",
    type: "Inductive (weak)",
    indicators: ["Every", "Therefore"]
  },
  {
    name: "Climate Argument",
    full: "Rising CO\u2082 levels correlate with rising temperatures. Human activity increases CO\u2082. Therefore, human activity contributes to climate change.",
    premises: ["Rising CO\u2082 levels correlate with rising temperatures.", "Human activity increases CO\u2082."],
    conclusion: "Therefore, human activity contributes to climate change.",
    type: "Inductive (strong)",
    indicators: ["Therefore"]
  },
  {
    name: "Democracy Argument",
    full: "Governments derive legitimacy from consent of the governed. Citizens who cannot vote have not given consent. Therefore, disenfranchisement undermines governmental legitimacy.",
    premises: ["Governments derive legitimacy from consent of the governed.", "Citizens who cannot vote have not given consent."],
    conclusion: "Therefore, disenfranchisement undermines governmental legitimacy.",
    type: "Deductive (valid)",
    indicators: ["Therefore"]
  },
  {
    name: "Knowledge Argument",
    full: "Justified true belief has traditionally defined knowledge. The Gettier cases show justified true belief can be false. Therefore, knowledge requires more than justified true belief.",
    premises: ["Justified true belief has traditionally defined knowledge.", "The Gettier cases show justified true belief can be false."],
    conclusion: "Therefore, knowledge requires more than justified true belief.",
    type: "Deductive (valid & sound)",
    indicators: ["Therefore"]
  }
];

let selectedArg = 0;
let revealStep = 0; // 0 = show nothing, 1..n = premises, n+1 = conclusion

// ---- Controls ----
let argSelect;
let prevButton;
let nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Create controls
  argSelect = createSelect();
  argSelect.parent(mainElement);
  for (let i = 0; i < arguments_data.length; i++) {
    argSelect.option(arguments_data[i].name);
  }
  argSelect.changed(function () {
    for (let i = 0; i < arguments_data.length; i++) {
      if (arguments_data[i].name === argSelect.value()) {
        selectedArg = i;
        revealStep = 0;
        break;
      }
    }
  });

  prevButton = createButton('Previous');
  prevButton.parent(mainElement);
  prevButton.mousePressed(function () {
    if (revealStep > 0) revealStep--;
  });

  nextButton = createButton('Next');
  nextButton.parent(mainElement);
  nextButton.mousePressed(function () {
    let maxSteps = arguments_data[selectedArg].premises.length + 1;
    if (revealStep < maxSteps) revealStep++;
  });

  describe('An argument dissector showing premises, conclusions, and logical connections for five sample arguments.');
}

function draw() {
  updateCanvasSize();

  let arg = arguments_data[selectedArg];
  let numPremises = arg.premises.length;
  let maxSteps = numPremises + 1;

  // ---- Draw area background ----
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // ---- Control area background ----
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Position controls ----
  prevButton.position(margin, drawHeight + 12);
  nextButton.position(margin + 75, drawHeight + 12);
  argSelect.position(margin + 150, drawHeight + 12);
  argSelect.style('max-width', (canvasWidth - margin - 160) + 'px');

  // ---- Title ----
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(defaultTextSize);
  textStyle(BOLD);
  text('Argument Dissector', canvasWidth / 2, 8);

  // ---- Full argument card ----
  let cardX = margin;
  let cardY = 30;
  let cardW = canvasWidth - 2 * margin;

  // Measure text height for card
  textSize(13);
  textStyle(NORMAL);
  textWrap(WORD);
  let fullTextW = cardW - 16;

  // Calculate needed height by counting wrapped lines
  let fullText = arg.full;
  let textH = getWrappedTextHeight(fullText, fullTextW, 13);
  let cardH = textH + 20;

  // Cream card background
  fill(255, 253, 240);
  stroke(200, 190, 160);
  strokeWeight(1);
  rect(cardX, cardY, cardW, cardH, 6);

  // Full argument text
  fill(60);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(NORMAL);
  text(fullText, cardX + 8, cardY + 10, fullTextW);

  // ---- Step indicator ----
  let stepY = cardY + cardH + 8;
  fill(100);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(11);
  textStyle(ITALIC);
  let stepLabel = revealStep === 0 ? 'Press Next to begin' : 'Step ' + revealStep + ' of ' + maxSteps;
  text(stepLabel, canvasWidth / 2, stepY);

  // ---- Structured breakdown area ----
  let breakdownY = stepY + 18;
  let boxW = cardW - 20;
  let boxX = cardX + 10;
  let boxPadding = 8;
  let boxTextW = boxW - 2 * boxPadding;
  let currentY = breakdownY;

  // Draw revealed premises
  for (let i = 0; i < numPremises; i++) {
    if (revealStep > i) {
      let premText = 'P' + (i + 1) + ': ' + arg.premises[i];
      textSize(12);
      let bh = getWrappedTextHeight(premText, boxTextW, 12) + 2 * boxPadding;

      // Teal premise box
      fill(0, 150, 136, 40);
      stroke(0, 150, 136);
      strokeWeight(1.5);
      rect(boxX, currentY, boxW, bh, 5);

      // Premise label
      fill(0, 100, 90);
      noStroke();
      textAlign(LEFT, TOP);
      textSize(12);
      textStyle(BOLD);
      text('P' + (i + 1) + ': ', boxX + boxPadding, currentY + boxPadding);

      // Premise text
      textStyle(NORMAL);
      fill(20, 70, 60);
      text(premText, boxX + boxPadding, currentY + boxPadding, boxTextW);

      currentY += bh + 6;

      // Draw arrow between premise boxes or before conclusion
      if (revealStep > i + 1 || (i === numPremises - 1 && revealStep > numPremises)) {
        // Down arrow
        let arrowX = canvasWidth / 2;
        let arrowTop = currentY;
        let arrowLen = 20;

        stroke(120);
        strokeWeight(1.5);
        line(arrowX, arrowTop, arrowX, arrowTop + arrowLen);
        // Arrowhead
        fill(120);
        noStroke();
        triangle(
          arrowX - 5, arrowTop + arrowLen - 5,
          arrowX + 5, arrowTop + arrowLen - 5,
          arrowX, arrowTop + arrowLen + 2
        );

        // "therefore" label
        fill(120);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        textStyle(ITALIC);
        text('therefore', arrowX + 30, arrowTop + arrowLen / 2);

        currentY += arrowLen + 8;
      }
    } else {
      // Placeholder for unrevealed premise
      let bh = 30;
      fill(230);
      stroke(200);
      strokeWeight(1);
      rect(boxX, currentY, boxW, bh, 5);
      fill(180);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(11);
      textStyle(ITALIC);
      text('Premise ' + (i + 1) + ' (press Next)', boxX + boxW / 2, currentY + bh / 2);
      currentY += bh + 6;

      // Placeholder arrow
      let arrowX = canvasWidth / 2;
      stroke(210);
      strokeWeight(1);
      line(arrowX, currentY, arrowX, currentY + 12);
      currentY += 18;
    }
  }

  // Draw conclusion
  if (revealStep > numPremises) {
    let concText = arg.conclusion;
    textSize(12);
    let bh = getWrappedTextHeight(concText, boxTextW, 12) + 2 * boxPadding;

    // Amber conclusion box
    fill(255, 193, 7, 50);
    stroke(200, 150, 0);
    strokeWeight(1.5);
    rect(boxX, currentY, boxW, bh, 5);

    // Conclusion label
    fill(150, 100, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('C: ', boxX + boxPadding, currentY + boxPadding);

    // Conclusion text
    textStyle(NORMAL);
    fill(100, 70, 0);
    text(concText, boxX + boxPadding, currentY + boxPadding, boxTextW);

    currentY += bh + 8;

    // Argument type label
    fill(80);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(11);
    textStyle(BOLD);
    text('Type: ' + arg.type, canvasWidth / 2, currentY);
  } else {
    // Placeholder for conclusion
    let bh = 30;
    fill(240, 235, 220);
    stroke(210, 200, 180);
    strokeWeight(1);
    rect(boxX, currentY, boxW, bh, 5);
    fill(180);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(ITALIC);
    text('Conclusion (press Next)', boxX + boxW / 2, currentY + bh / 2);
  }
}

// ---- Helper: estimate wrapped text height ----
function getWrappedTextHeight(txt, maxWidth, fontSize) {
  textSize(fontSize);
  let words = txt.split(' ');
  let lineCount = 1;
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      lineCount++;
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  return lineCount * (fontSize + 4);
}

// ---- Responsive sizing ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = min(containerWidth - 10, 400);
  canvasHeight = drawHeight + controlHeight;
}
