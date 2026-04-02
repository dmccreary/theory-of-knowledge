// Language as Tool vs Constraint — Dual-Perspective MicroSim
// CANVAS_HEIGHT: 520

let containerWidth;
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 14;

// ---- Domain data ----
let features = {
  "Categories & Labels": {
    tool: {
      desc: "Categories help us organize knowledge efficiently",
      examples: [
        "Scientific taxonomy enables classification",
        "Medical diagnoses guide treatment"
      ]
    },
    constraint: {
      desc: "Categories force complex realities into rigid boxes",
      examples: [
        "Gender binary excludes non-binary identities",
        "'Developing nations' masks enormous diversity"
      ]
    }
  },
  "Metaphor": {
    tool: {
      desc: "Metaphors help us understand abstract concepts through concrete imagery",
      examples: [
        "'The mind is a computer' enables cognitive science",
        "'Knowledge is light' motivates inquiry"
      ]
    },
    constraint: {
      desc: "Metaphors highlight some aspects while hiding others",
      examples: [
        "'Time is money' hides contemplative value",
        "'Argument is war' obscures collaborative inquiry"
      ]
    }
  },
  "Precision": {
    tool: {
      desc: "Precise language enables exact communication in science and law",
      examples: [
        "Mathematical notation eliminates ambiguity",
        "Legal definitions protect rights"
      ]
    },
    constraint: {
      desc: "Demanding precision can exclude valid but imprecise knowledge",
      examples: [
        "Poetry's truth resists precise paraphrase",
        "Indigenous knowledge uses narrative, not propositions"
      ]
    }
  },
  "Translation": {
    tool: {
      desc: "Translation enables cross-cultural knowledge sharing",
      examples: [
        "Scientific papers accessible worldwide",
        "Ancient texts preserved for modern readers"
      ]
    },
    constraint: {
      desc: "Translation inevitably loses meaning",
      examples: [
        "'Saudade' has no English equivalent",
        "Japanese 'wa' (harmony) loses cultural depth"
      ]
    }
  }
};

let featureKeys = Object.keys(features);
let currentFeature = featureKeys[0];
let currentView = "Both"; // "Tool", "Constraint", or "Both"

// Expanded example state
let expandedSide = null;  // "tool" or "constraint"
let expandedIndex = -1;

// Animation
let toolAlpha = 255;
let constraintAlpha = 255;
let balanceAngle = 0;
let targetBalanceAngle = 0;

// ---- Controls ----
let featureSelect;
let viewSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  featureSelect = createSelect();
  featureSelect.parent(mainElement);
  for (let i = 0; i < featureKeys.length; i++) {
    featureSelect.option(featureKeys[i]);
  }
  featureSelect.changed(function () {
    currentFeature = featureSelect.value();
    expandedSide = null;
    expandedIndex = -1;
  });

  viewSelect = createSelect();
  viewSelect.parent(mainElement);
  viewSelect.option("Both");
  viewSelect.option("Tool");
  viewSelect.option("Constraint");
  viewSelect.changed(function () {
    currentView = viewSelect.value();
    expandedSide = null;
    expandedIndex = -1;
  });

  describe('A dual-perspective comparison showing language as both a tool that enables knowledge and a constraint that limits it, with selectable linguistic features and toggle views.');
}

function draw() {
  updateCanvasSize();

  // Update animation targets
  if (currentView === "Tool") {
    targetBalanceAngle = -PI / 12;
  } else if (currentView === "Constraint") {
    targetBalanceAngle = PI / 12;
  } else {
    targetBalanceAngle = 0;
  }
  balanceAngle = lerp(balanceAngle, targetBalanceAngle, 0.08);

  let toolTarget = (currentView === "Constraint") ? 100 : 255;
  let constraintTarget = (currentView === "Tool") ? 100 : 255;
  toolAlpha = lerp(toolAlpha, toolTarget, 0.08);
  constraintAlpha = lerp(constraintAlpha, constraintTarget, 0.08);

  // ---- Draw area background ----
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // ---- Control area background ----
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Position controls ----
  let ctrlY = drawHeight + 18;
  featureSelect.position(margin, ctrlY);
  featureSelect.style('font-size', '13px');
  featureSelect.style('background-color', 'white');
  viewSelect.position(margin + 190, ctrlY);
  viewSelect.style('font-size', '13px');
  viewSelect.style('background-color', 'white');

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(defaultTextSize + 2);
  textStyle(BOLD);
  text('Language: Tool vs Constraint', canvasWidth / 2, 8);

  // ---- Feature subtitle ----
  textSize(defaultTextSize);
  textStyle(ITALIC);
  fill('dimgray');
  text(currentFeature, canvasWidth / 2, 30);

  // ---- Draw balance visual ----
  drawBalance(canvasWidth / 2, 72);

  // ---- Draw panels ----
  let data = features[currentFeature];
  let panelTop = 115;
  let panelHeight = drawHeight - panelTop - 10;
  let colW = (canvasWidth - margin * 3) / 2;
  let leftX = margin;
  let rightX = margin * 2 + colW;

  drawPanel(leftX, panelTop, colW, panelHeight, data.tool, "tool", 'teal', toolAlpha);
  drawPanel(rightX, panelTop, colW, panelHeight, data.constraint, "constraint", 'coral', constraintAlpha);
}

function drawBalance(cx, cy) {
  push();
  translate(cx, cy);

  // Fulcrum triangle
  noStroke();
  fill('dimgray');
  triangle(-10, 18, 10, 18, 0, 4);

  // Beam
  push();
  rotate(balanceAngle);
  stroke('dimgray');
  strokeWeight(3);
  line(-60, 0, 60, 0);

  // Tool pan (left)
  noStroke();
  fill(0, 128, 128, toolAlpha);
  ellipse(-60, 0, 16, 16);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(9);
  textStyle(BOLD);
  text('T', -60, -1);

  // Constraint pan (right)
  noStroke();
  fill(255, 127, 80, constraintAlpha);
  ellipse(60, 0, 16, 16);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(9);
  textStyle(BOLD);
  text('C', 60, -1);
  pop();

  // Labels below
  noStroke();
  textSize(10);
  textStyle(NORMAL);
  fill(0, 128, 128);
  textAlign(CENTER, TOP);
  text('Enables', -55, 22);
  fill(255, 127, 80);
  text('Limits', 55, 22);

  pop();
}

function drawPanel(x, y, w, h, data, side, col, alphaVal) {
  let isHighlighted = (currentView === "Both") ||
    (currentView === "Tool" && side === "tool") ||
    (currentView === "Constraint" && side === "constraint");

  // Panel background
  noStroke();
  if (col === 'teal') {
    fill(0, 128, 128, map(alphaVal, 100, 255, 20, 40));
  } else {
    fill(255, 127, 80, map(alphaVal, 100, 255, 20, 40));
  }
  rect(x, y, w, h, 8);

  // Panel border
  if (isHighlighted) {
    if (col === 'teal') {
      stroke(0, 128, 128, alphaVal);
    } else {
      stroke(255, 127, 80, alphaVal);
    }
    strokeWeight(2);
    noFill();
    rect(x, y, w, h, 8);
  }

  // Header
  noStroke();
  if (col === 'teal') {
    fill(0, 128, 128, alphaVal);
  } else {
    fill(255, 127, 80, alphaVal);
  }
  rect(x, y, w, 30, 8, 8, 0, 0);

  fill(255, 255, 255, alphaVal);
  textAlign(CENTER, CENTER);
  textSize(defaultTextSize);
  textStyle(BOLD);
  let label = (side === "tool") ? "TOOL" : "CONSTRAINT";
  let icon = (side === "tool") ? "+" : "~";
  text(icon + ' ' + label + ' ' + icon, x + w / 2, y + 15);

  // Subtitle
  noStroke();
  if (col === 'teal') {
    fill(0, 100, 100, alphaVal);
  } else {
    fill(180, 80, 50, alphaVal);
  }
  textSize(11);
  textStyle(ITALIC);
  let subtitle = (side === "tool") ? "Enables Knowledge" : "Limits Knowledge";
  text(subtitle, x + w / 2, y + 42);

  // Description
  noStroke();
  fill(40, 40, 40, alphaVal);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(NORMAL);
  let descY = y + 56;
  text(data.desc, x + 8, descY, w - 16, 60);

  // Examples header
  let exY = descY + 64;
  noStroke();
  if (col === 'teal') {
    fill(0, 128, 128, alphaVal);
  } else {
    fill(255, 127, 80, alphaVal);
  }
  textSize(12);
  textStyle(BOLD);
  text('Examples:', x + 8, exY);
  exY += 18;

  // Examples
  for (let i = 0; i < data.examples.length; i++) {
    let isExpanded = (expandedSide === side && expandedIndex === i);
    let exBoxY = exY;
    let exBoxH = isExpanded ? 56 : 36;

    // Example box background
    noStroke();
    fill(255, 255, 255, map(alphaVal, 100, 255, 80, 200));
    rect(x + 6, exBoxY, w - 12, exBoxH, 4);

    // Hover highlight
    if (mouseX > x + 6 && mouseX < x + w - 6 &&
        mouseY > exBoxY && mouseY < exBoxY + exBoxH) {
      noStroke();
      if (col === 'teal') {
        fill(0, 128, 128, 20);
      } else {
        fill(255, 127, 80, 20);
      }
      rect(x + 6, exBoxY, w - 12, exBoxH, 4);
      cursor(HAND);
    }

    // Bullet and text
    noStroke();
    if (col === 'teal') {
      fill(0, 128, 128, alphaVal);
    } else {
      fill(255, 127, 80, alphaVal);
    }
    textSize(10);
    textStyle(BOLD);
    text('\u25CF', x + 12, exBoxY + 6);

    fill(30, 30, 30, alphaVal);
    textSize(11);
    textStyle(NORMAL);
    text(data.examples[i], x + 24, exBoxY + 4, w - 34, exBoxH - 6);

    // Click to expand indicator
    if (!isExpanded) {
      fill(150, 150, 150, alphaVal);
      textSize(9);
      textAlign(RIGHT, TOP);
      text('click \u25BC', x + w - 12, exBoxY + exBoxH - 14);
      textAlign(LEFT, TOP);
    }

    // Expanded content
    if (isExpanded) {
      noStroke();
      if (col === 'teal') {
        fill(0, 100, 100, alphaVal);
      } else {
        fill(180, 80, 50, alphaVal);
      }
      textSize(10);
      textStyle(ITALIC);
      let analysis = getAnalysis(currentFeature, side, i);
      text(analysis, x + 24, exBoxY + 30, w - 34, 24);
    }

    exY += exBoxH + 6;
  }

  // TOK connection at bottom
  let tokY = y + h - 55;
  noStroke();
  fill(255, 255, 255, map(alphaVal, 100, 255, 60, 150));
  rect(x + 6, tokY, w - 12, 48, 4);

  noStroke();
  if (col === 'teal') {
    fill(0, 100, 100, alphaVal);
  } else {
    fill(180, 80, 50, alphaVal);
  }
  textSize(10);
  textStyle(BOLD);
  text('TOK Connection:', x + 10, tokY + 4);
  textStyle(NORMAL);
  fill(50, 50, 50, alphaVal);
  let tokText = getTokConnection(currentFeature, side);
  text(tokText, x + 10, tokY + 17, w - 20, 30);
}

function getAnalysis(feature, side, idx) {
  let analyses = {
    "Categories & Labels": {
      tool: [
        "Linnaeus' system organizes millions of species",
        "DSM-5 categories enable consistent diagnosis"
      ],
      constraint: [
        "Many cultures recognize fluid gender spectrums",
        "India, Brazil, Nigeria differ vastly yet share one label"
      ]
    },
    "Metaphor": {
      tool: [
        "Computational models of mind drive AI research",
        "Enlightenment imagery shaped scientific revolution"
      ],
      constraint: [
        "We forget rest, reflection, and play have value",
        "Dialogue becomes about winning, not understanding"
      ]
    },
    "Precision": {
      tool: [
        "E = mc\u00B2 communicates across all languages",
        "Habeas corpus has protected liberty for centuries"
      ],
      constraint: [
        "Rumi's poetry conveys truth no equation can",
        "Oral traditions carry ecological knowledge precisely"
      ]
    },
    "Translation": {
      tool: [
        "Peer review works across linguistic boundaries",
        "Rosetta Stone unlocked Egyptian civilization"
      ],
      constraint: [
        "Portuguese longing blends nostalgia and hope uniquely",
        "Social harmony as concept requires cultural immersion"
      ]
    }
  };
  return analyses[feature][side][idx] || "";
}

function getTokConnection(feature, side) {
  let connections = {
    "Categories & Labels": {
      tool: "Language shapes our knowledge framework, enabling shared understanding.",
      constraint: "The Sapir-Whorf hypothesis suggests language limits what we can know."
    },
    "Metaphor": {
      tool: "Metaphors are cognitive tools that extend our conceptual reach.",
      constraint: "Lakoff: metaphors structure thought unconsciously, constraining reasoning."
    },
    "Precision": {
      tool: "Formal languages achieve certainty impossible in natural language.",
      constraint: "Wittgenstein: meaning arises from use, not just precise definition."
    },
    "Translation": {
      tool: "Shared scientific vocabulary bridges cultural knowledge systems.",
      constraint: "Quine's indeterminacy: perfect translation may be impossible."
    }
  };
  return connections[feature][side] || "";
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  let colW = (canvasWidth - margin * 3) / 2;
  let leftX = margin;
  let rightX = margin * 2 + colW;
  let panelTop = 115;

  // Check tool panel examples
  checkExampleClick(leftX, panelTop, colW, "tool");
  // Check constraint panel examples
  checkExampleClick(rightX, panelTop, colW, "constraint");
}

function checkExampleClick(px, panelTop, pw, side) {
  let data = features[currentFeature][side];
  let exY = panelTop + 56 + 64 + 18;

  for (let i = 0; i < data.examples.length; i++) {
    let isExpanded = (expandedSide === side && expandedIndex === i);
    let exBoxH = isExpanded ? 56 : 36;

    if (mouseX > px + 6 && mouseX < px + pw - 6 &&
        mouseY > exY && mouseY < exY + exBoxH) {
      if (isExpanded) {
        expandedSide = null;
        expandedIndex = -1;
      } else {
        expandedSide = side;
        expandedIndex = i;
      }
      return;
    }
    exY += exBoxH + 6;
  }
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(380, min(containerWidth - 20, 750));
  if (width !== canvasWidth) {
    resizeCanvas(canvasWidth, canvasHeight);
  }
}

function windowResized() {
  updateCanvasSize();
}
