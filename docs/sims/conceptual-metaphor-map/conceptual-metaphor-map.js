// Conceptual Metaphor Map MicroSim
// CANVAS_HEIGHT: 510

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

let metaphors = {
  "Argument is Building": {
    source: {name: "Building", elements: ["Foundation", "Walls", "Roof", "Structural integrity"]},
    target: {name: "Argument", elements: ["Premises", "Supporting evidence", "Conclusion", "Logical validity"]},
    hidden: ["Emotional persuasion", "Audience perspective", "Cultural context", "Rhetorical style"],
    examples: ["That argument has a solid foundation", "His theory collapsed", "Let me construct my case", "The framework of her reasoning"]
  },
  "Knowledge is Light": {
    source: {name: "Light", elements: ["Illumination", "Darkness", "Seeing", "Brightness"]},
    target: {name: "Knowledge", elements: ["Understanding", "Ignorance", "Knowing", "Clarity"]},
    hidden: ["Embodied knowledge", "Tacit understanding", "Emotional knowing", "Cultural ways of knowing"],
    examples: ["She shed light on the problem", "I'm in the dark about this", "I see what you mean", "A brilliant idea"]
  },
  "Time is Money": {
    source: {name: "Money", elements: ["Spending", "Saving", "Investing", "Wasting"]},
    target: {name: "Time", elements: ["Using time", "Conserving time", "Planning ahead", "Losing time"]},
    hidden: ["Time as cyclical", "Present-moment experience", "Cultural time concepts", "Qualitative time"],
    examples: ["Don't waste my time", "That saved us hours", "Invest time in learning", "Time well spent"]
  },
  "Ideas are Food": {
    source: {name: "Food", elements: ["Cooking", "Digesting", "Raw ingredients", "Taste"]},
    target: {name: "Ideas", elements: ["Developing", "Processing", "Raw data", "Appeal"]},
    hidden: ["Collaborative thinking", "Emotional resonance", "Power dynamics", "Originality"],
    examples: ["Let me digest that", "Half-baked idea", "Food for thought", "I can't swallow that argument"]
  },
  "Life is Journey": {
    source: {name: "Journey", elements: ["Path", "Destination", "Crossroads", "Progress"]},
    target: {name: "Life", elements: ["Way of living", "Goals", "Decisions", "Development"]},
    hidden: ["Stillness and being", "Cyclical patterns", "Community rootedness", "Random chance"],
    examples: ["She's at a crossroads", "He's on the right path", "We've come a long way", "A dead-end job"]
  }
};

let metaphorKeys = Object.keys(metaphors);
let selectedMetaphor = metaphorKeys[0];

// Controls
let metaphorSelect;
let hiddenCheckbox;

// Interaction state
let hoveredLine = -1;
let clickedLine = -1;
let tooltipText = "";
let tooltipX = 0;
let tooltipY = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  metaphorSelect = createSelect();
  metaphorSelect.parent(mainElement);
  for (let i = 0; i < metaphorKeys.length; i++) {
    metaphorSelect.option(metaphorKeys[i]);
  }
  metaphorSelect.changed(function() {
    selectedMetaphor = metaphorSelect.value();
    clickedLine = -1;
    hoveredLine = -1;
  });

  hiddenCheckbox = createCheckbox("What's Hidden?", false);
  hiddenCheckbox.parent(mainElement);
  hiddenCheckbox.style('color', 'white');
  hiddenCheckbox.style('background-color', 'coral');
  hiddenCheckbox.style('padding', '4px 8px');
  hiddenCheckbox.style('border-radius', '4px');
  hiddenCheckbox.style('font-size', '13px');
  hiddenCheckbox.style('font-family', 'Arial, sans-serif');

  describe('A two-domain conceptual metaphor map showing source and target domains with correspondence lines. Click lines for linguistic examples. Toggle to reveal what the metaphor hides.');
}

function draw() {
  updateCanvasSize();
  let data = metaphors[selectedMetaphor];
  let numElements = data.source.elements.length;

  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Position controls
  let ctrlY = drawHeight + 18;
  metaphorSelect.position(margin, ctrlY);
  metaphorSelect.style('font-size', '13px');
  hiddenCheckbox.position(margin + 220, ctrlY - 2);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Conceptual Metaphor Map', canvasWidth / 2, 10);

  // Subtitle: current metaphor
  textSize(defaultTextSize);
  textStyle(ITALIC);
  fill('darkslategray');
  noStroke();
  text('"' + selectedMetaphor + '"', canvasWidth / 2, 32);

  // Domain circle positions
  let circleR = canvasWidth * 0.22;
  let circleY = 170;
  let srcX = canvasWidth * 0.25;
  let tgtX = canvasWidth * 0.75;

  // Determine hidden box space
  let showHidden = hiddenCheckbox.checked();
  let hiddenBoxTop = 310;
  let hiddenBoxHeight = showHidden ? 120 : 0;

  // Adjust circle Y if hidden box shown to keep things fitting
  if (showHidden) {
    circleY = 155;
    circleR = canvasWidth * 0.20;
  }

  // Draw source domain circle
  fill(255, 191, 0, 50); // amber fill
  stroke('goldenrod');
  strokeWeight(2);
  ellipse(srcX, circleY, circleR * 2, circleR * 2);

  // Draw target domain circle
  fill(0, 128, 128, 50); // teal fill
  stroke('teal');
  strokeWeight(2);
  ellipse(tgtX, circleY, circleR * 2, circleR * 2);

  // Domain labels
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  fill('darkgoldenrod');
  text('Source Domain:', srcX, circleY - circleR + 18);
  textSize(defaultTextSize + 1);
  text(data.source.name, srcX, circleY - circleR + 36);

  fill('darkcyan');
  textSize(defaultTextSize);
  text('Target Domain:', tgtX, circleY - circleR + 18);
  textSize(defaultTextSize + 1);
  text(data.target.name, tgtX, circleY - circleR + 36);

  // Element positions inside circles
  let elemStartY = circleY - circleR + 58;
  let elemSpacing = (circleR * 2 - 80) / (numElements - 1);
  let srcElemX = [];
  let srcElemY = [];
  let tgtElemX = [];
  let tgtElemY = [];

  textSize(defaultTextSize - 2);
  textStyle(NORMAL);

  for (let i = 0; i < numElements; i++) {
    let ey = elemStartY + i * elemSpacing;
    srcElemX.push(srcX);
    srcElemY.push(ey);
    tgtElemX.push(tgtX);
    tgtElemY.push(ey);

    // Source element text
    noStroke();
    fill('saddlebrown');
    textAlign(CENTER, CENTER);
    text(data.source.elements[i], srcX, ey);

    // Target element text
    fill('darkslategray');
    text(data.target.elements[i], tgtX, ey);
  }

  // Draw correspondence lines between elements
  // Calculate line endpoints at circle edges
  hoveredLine = -1;
  for (let i = 0; i < numElements; i++) {
    let sx = srcX + circleR - 5;
    let sy = srcElemY[i];
    let tx = tgtX - circleR + 5;
    let ty = tgtElemY[i];

    // Check hover/click distance
    let lineDist = distToSegment(mouseX, mouseY, sx, sy, tx, ty);
    let isHovered = lineDist < 8;
    let isClicked = (clickedLine === i);

    if (isHovered) {
      hoveredLine = i;
      cursor(HAND);
    }

    // Draw line
    if (isClicked) {
      stroke('coral');
      strokeWeight(3);
    } else if (isHovered) {
      stroke('orangered');
      strokeWeight(2.5);
    } else {
      stroke('slategray');
      strokeWeight(1.5);
    }
    line(sx, sy, tx, ty);

    // Mapping label on line
    let midX = (sx + tx) / 2;
    let midY = (sy + ty) / 2;
    noStroke();
    fill('white');
    rectMode(CENTER);
    let labelText = (i + 1).toString();
    let labelW = 18;
    rect(midX, midY, labelW, labelW, 9);
    fill(isClicked ? 'coral' : 'slategray');
    textAlign(CENTER, CENTER);
    textSize(10);
    textStyle(BOLD);
    text(labelText, midX, midY);
    rectMode(CORNER);
  }

  // Reset cursor if not hovering any line
  if (hoveredLine === -1 && !showHidden) {
    cursor(ARROW);
  }

  // Show clicked line example tooltip
  if (clickedLine >= 0 && clickedLine < numElements) {
    let example = data.examples[clickedLine];
    let sx = srcX + circleR - 5;
    let sy = srcElemY[clickedLine];
    let tx = tgtX - circleR + 5;
    let ty = tgtElemY[clickedLine];
    let tipX = (sx + tx) / 2;
    let tipY = (sy + ty) / 2 - 22;

    noStroke();
    textSize(12);
    textStyle(ITALIC);
    let tw = textWidth(example) + 16;
    let th = 22;
    fill('coral');
    rectMode(CENTER);
    rect(tipX, tipY, tw, th, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    text('"' + example + '"', tipX, tipY);
    rectMode(CORNER);
  }

  // Instruction text
  noStroke();
  fill('gray');
  textSize(11);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  let instrY = circleY + circleR + 12;
  text('Click a numbered line to see a linguistic example', canvasWidth / 2, instrY);

  // Hidden box
  if (showHidden) {
    let boxX = margin;
    let boxY = hiddenBoxTop;
    let boxW = canvasWidth - margin * 2;
    let boxH = hiddenBoxHeight;

    fill('coral');
    noStroke();
    rect(boxX, boxY, boxW, boxH, 8);

    fill('white');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(defaultTextSize - 1);
    textStyle(BOLD);
    text("What the Metaphor Hides", canvasWidth / 2, boxY + 10);

    textStyle(NORMAL);
    textSize(defaultTextSize - 2);
    textAlign(LEFT, TOP);
    for (let i = 0; i < data.hidden.length; i++) {
      let bulletY = boxY + 32 + i * 22;
      noStroke();
      fill('white');
      text("\u2022  " + data.hidden[i], boxX + 16, bulletY);
    }
  }

  // Footer text in draw area
  noStroke();
  fill('dimgray');
  textSize(10);
  textStyle(NORMAL);
  textAlign(CENTER, BOTTOM);
  text('Lakoff & Johnson: Metaphors structure how we understand abstract concepts', canvasWidth / 2, drawHeight - 6);
}

function mousePressed() {
  if (hoveredLine >= 0) {
    if (clickedLine === hoveredLine) {
      clickedLine = -1; // toggle off
    } else {
      clickedLine = hoveredLine;
    }
  } else {
    clickedLine = -1;
  }
}

// Distance from point (px, py) to line segment (x1,y1)-(x2,y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = constrain(t, 0, 1);
  let projX = x1 + t * dx;
  let projY = y1 + t * dy;
  return dist(px, py, projX, projY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.getBoundingClientRect().width;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(360, min(containerWidth, 580));
}
