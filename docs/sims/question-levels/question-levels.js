// Question Levels: First-Order vs Second-Order Knowledge Questions
// CANVAS_HEIGHT: 520

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- Domain data ----
let aoks = {
  "Natural Sciences": {
    firstOrder: [
      "What causes cancer?",
      "How fast does light travel?",
      "What is DNA made of?"
    ],
    secondOrder: [
      "How do we know our scientific methods are reliable?",
      "What counts as evidence in science?",
      "Can science prove anything with certainty?"
    ]
  },
  "History": {
    firstOrder: [
      "What caused World War I?",
      "When did the Roman Empire fall?",
      "Who built the pyramids?"
    ],
    secondOrder: [
      "How reliable are historical sources?",
      "Can we ever know what 'really' happened?",
      "Whose perspective shapes historical narrative?"
    ]
  },
  "Ethics": {
    firstOrder: [
      "Is stealing wrong?",
      "Should we eat meat?",
      "Is capital punishment justified?"
    ],
    secondOrder: [
      "How do we know what is morally right?",
      "Can moral claims be objectively true?",
      "What makes one ethical framework better than another?"
    ]
  },
  "The Arts": {
    firstOrder: [
      "What does this painting mean?",
      "Is this sculpture beautiful?",
      "What genre is this music?"
    ],
    secondOrder: [
      "Can art produce knowledge?",
      "How do we evaluate aesthetic claims?",
      "Is artistic interpretation subjective or can it be justified?"
    ]
  }
};

let aokKeys = Object.keys(aoks);
let currentAOK = aokKeys[0];

// ---- Interaction state ----
let clickedLayer = null; // null, "first", or "second"
let explanationAlpha = 0;

// ---- Explanation texts ----
let explanations = {
  first: "First-order questions are asked WITHIN a discipline. They seek specific answers using the methods of that Area of Knowledge. Scientists do experiments, historians examine sources, ethicists weigh principles.",
  second: "Second-order questions are asked ABOUT a discipline. They examine the nature, methods, and limits of knowledge itself. This is where TOK lives — questioning how we know what we claim to know."
};

// ---- Controls ----
let aokSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  aokSelect = createSelect();
  aokSelect.parent(mainElement);
  for (let i = 0; i < aokKeys.length; i++) {
    aokSelect.option(aokKeys[i]);
  }
  aokSelect.changed(function () {
    currentAOK = aokSelect.value();
    clickedLayer = null;
  });
  aokSelect.style('font-size', '16px');
  aokSelect.style('padding', '4px 8px');
  aokSelect.style('background', 'white');

  describe('A layered diagram showing first-order discipline questions on the bottom and second-order TOK knowledge questions on top, with an arrow connecting the two layers. An AOK dropdown changes the examples shown.');
}

function draw() {
  updateCanvasSize();

  // ---- Draw area background ----
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // ---- Control area background ----
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Layout calculations ----
  let layerWidth = canvasWidth - margin * 2;
  let layerHeight = 140;
  let cardPadding = 8;
  let arrowZoneHeight = 60;

  let firstLayerY = drawHeight - margin - layerHeight;
  let secondLayerY = firstLayerY - arrowZoneHeight - layerHeight;

  let data = aoks[currentAOK];

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text("First-Order vs Second-Order Questions", canvasWidth / 2, margin);

  textSize(14);
  textStyle(NORMAL);
  fill('dimgray');
  text("Area of Knowledge: " + currentAOK, canvasWidth / 2, margin + 24);

  // ---- Draw second-order layer (top, TOK focus) ----
  let isSecondHovered = mouseY >= secondLayerY && mouseY <= secondLayerY + layerHeight && mouseX >= margin && mouseX <= margin + layerWidth;
  drawLayer(margin, secondLayerY, layerWidth, layerHeight, data.secondOrder, "goldenrod", "gold", "Second-Order Questions (TOK)", isSecondHovered, true);

  // ---- Draw arrow between layers ----
  drawArrow(canvasWidth / 2, firstLayerY - 4, canvasWidth / 2, secondLayerY + layerHeight + 4);

  // Arrow label
  noStroke();
  fill('darkslategray');
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(ITALIC);
  let arrowLabelY = firstLayerY - arrowZoneHeight / 2;
  text("TOK asks questions ABOUT these questions", canvasWidth / 2, arrowLabelY);
  textStyle(NORMAL);

  // ---- Draw first-order layer (bottom) ----
  let isFirstHovered = mouseY >= firstLayerY && mouseY <= firstLayerY + layerHeight && mouseX >= margin && mouseX <= margin + layerWidth;
  drawLayer(margin, firstLayerY, layerWidth, layerHeight, data.firstOrder, "teal", "lightcyan", "First-Order Questions (Discipline)", isFirstHovered, false);

  // ---- Layer labels on left side ----
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);

  push();
  fill('teal');
  translate(margin + 10, firstLayerY + layerHeight / 2);
  rotate(-HALF_PI);
  text("WITHIN", 0, 0);
  pop();

  push();
  fill('darkgoldenrod');
  translate(margin + 10, secondLayerY + layerHeight / 2);
  rotate(-HALF_PI);
  text("ABOUT", 0, 0);
  pop();

  // ---- Explanation overlay ----
  if (clickedLayer) {
    explanationAlpha = min(explanationAlpha + 15, 240);
    drawExplanation(clickedLayer, secondLayerY, firstLayerY, layerHeight);
  } else {
    explanationAlpha = max(explanationAlpha - 20, 0);
  }

  // ---- Click hint ----
  if (!clickedLayer) {
    noStroke();
    fill('gray');
    textSize(11);
    textAlign(CENTER, BOTTOM);
    text("Click a layer for explanation  |  Click again to dismiss", canvasWidth / 2, drawHeight - 4);
  }

  // ---- Control label ----
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Area of Knowledge:", margin + 4, drawHeight + controlHeight / 2);
}

function drawLayer(x, y, w, h, questions, borderColor, bgColor, title, isHovered, isTOKFocus) {
  let cardWidth = (w - 60) / 3;
  let cardHeight = h - 40;
  let cardY = y + 32;

  // Layer background
  if (isTOKFocus) {
    stroke('goldenrod');
    strokeWeight(3);
  } else {
    stroke('teal');
    strokeWeight(2);
  }
  if (isHovered) {
    fill(isTOKFocus ? 'lightyellow' : 'mintcream');
  } else {
    fill(bgColor);
  }
  rect(x, y, w, h, 8);

  // TOK focus badge
  if (isTOKFocus) {
    noStroke();
    fill('darkgoldenrod');
    rect(x + w - 90, y + 4, 82, 20, 10);
    fill('white');
    textSize(10);
    textAlign(CENTER, CENTER);
    noStroke();
    text("TOK FOCUS", x + w - 49, y + 14);
  }

  // Layer title
  noStroke();
  fill(isTOKFocus ? 'darkgoldenrod' : 'teal');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(title, x + 24, y + 8);
  textStyle(NORMAL);

  // Question cards
  for (let i = 0; i < 3; i++) {
    let cardX = x + 20 + i * (cardWidth + 10);

    // Card shadow
    noStroke();
    fill(200, 200, 200, 80);
    rect(cardX + 2, cardY + 2, cardWidth, cardHeight, 6);

    // Card
    stroke(isTOKFocus ? 'goldenrod' : 'teal');
    strokeWeight(1);
    fill('white');
    rect(cardX, cardY, cardWidth, cardHeight, 6);

    // Question number
    noStroke();
    fill(isTOKFocus ? 'darkgoldenrod' : 'teal');
    textSize(11);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text("Q" + (i + 1), cardX + cardWidth / 2, cardY + 6);
    textStyle(NORMAL);

    // Question text
    fill('black');
    textSize(12);
    textAlign(CENTER, TOP);
    noStroke();
    drawWrappedText(questions[i], cardX + cardWidth / 2, cardY + 24, cardWidth - 12);
  }

  // Cursor hint
  if (isHovered) {
    cursor(HAND);
  }
}

function drawWrappedText(txt, cx, startY, maxWidth) {
  let words = txt.split(' ');
  let line = '';
  let lineY = startY;
  let lineHeight = 16;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + (line ? ' ' : '') + words[i];
    if (textWidth(testLine) > maxWidth && line) {
      text(line, cx, lineY);
      line = words[i];
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    text(line, cx, lineY);
  }
}

function drawArrow(x1, y1, x2, y2) {
  stroke('darkslategray');
  strokeWeight(3);
  line(x1, y1, x2, y2);

  // Arrowhead pointing up
  let arrowSize = 10;
  noStroke();
  fill('darkslategray');
  triangle(
    x2 - arrowSize, y2 + arrowSize,
    x2 + arrowSize, y2 + arrowSize,
    x2, y2
  );
}

function drawExplanation(layer, secondY, firstY, layerH) {
  let expY = (layer === "second") ? secondY : firstY;
  let expW = canvasWidth - margin * 4;
  let expH = layerH;
  let expX = margin * 2;

  // Semi-transparent overlay
  noStroke();
  fill(0, 0, 0, explanationAlpha * 0.3);
  rect(0, 0, canvasWidth, drawHeight);

  // Explanation box
  stroke(layer === "second" ? 'goldenrod' : 'teal');
  strokeWeight(2);
  fill(255, 255, 255, min(explanationAlpha + 15, 250));
  rect(expX, expY, expW, expH, 10);

  // Explanation text
  noStroke();
  let alphaVal = min(explanationAlpha, 255);
  if (layer === "second") {
    fill(0, 0, 0, alphaVal);
  } else {
    fill(0, 0, 0, alphaVal);
  }
  textSize(14);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  let titleText = (layer === "second") ? "Second-Order (TOK) Questions" : "First-Order (Discipline) Questions";
  text(titleText, expX + expW / 2, expY + 16);
  textStyle(NORMAL);
  textSize(13);
  drawWrappedText(explanations[layer === "second" ? "second" : "first"], expX + expW / 2, expY + 42, expW - 30);

  // Dismiss hint
  fill(150, 150, 150, alphaVal);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text("Click anywhere to dismiss", expX + expW / 2, expY + expH - 8);
}

function mousePressed() {
  if (mouseY > drawHeight) return; // Ignore clicks in control area

  if (clickedLayer) {
    clickedLayer = null;
    explanationAlpha = 0;
    return;
  }

  let layerWidth = canvasWidth - margin * 2;
  let layerHeight = 140;
  let arrowZoneHeight = 60;
  let firstLayerY = drawHeight - margin - layerHeight;
  let secondLayerY = firstLayerY - arrowZoneHeight - layerHeight;

  if (mouseY >= firstLayerY && mouseY <= firstLayerY + layerHeight && mouseX >= margin && mouseX <= margin + layerWidth) {
    clickedLayer = "first";
    explanationAlpha = 0;
  } else if (mouseY >= secondLayerY && mouseY <= secondLayerY + layerHeight && mouseX >= margin && mouseX <= margin + layerWidth) {
    clickedLayer = "second";
    explanationAlpha = 0;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  var mainElement = document.querySelector('main');
  if (mainElement) {
    containerWidth = mainElement.offsetWidth;
    if (containerWidth > 0) {
      canvasWidth = containerWidth;
    }
  }
}
