// TOK Exhibition Analysis: Connect real-world objects to TOK concepts, AOKs, and knowledge questions
// CANVAS_HEIGHT: 520
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = 520;
let margin = 20;
let defaultTextSize = 16;

let objects = {
  "A COVID Vaccine Vial": {
    concepts: ["Evidence", "Scientific Consensus", "Trust in Institutions", "Ethical Implications"],
    aoks: ["Natural Sciences", "Ethics", "Human Sciences"],
    questions: [
      "How do we decide when evidence is 'enough'?",
      "What role does trust play in accepting scientific knowledge?"
    ]
  },
  "A History Textbook": {
    concepts: ["Historical Narrative", "Perspective", "Bias", "Representation"],
    aoks: ["History", "Human Sciences", "Ethics"],
    questions: [
      "Whose perspective does this textbook represent?",
      "Can historical knowledge ever be objective?"
    ]
  },
  "A Social Media Feed": {
    concepts: ["Algorithmic Bias", "Filter Bubbles", "Information Literacy", "Digital Knowledge Systems"],
    aoks: ["Human Sciences", "Ethics", "The Arts"],
    questions: [
      "How do algorithms shape what we think we know?",
      "Is curated information still knowledge?"
    ]
  }
};

let conceptExplanations = {
  "Evidence": "Facts or information indicating whether a belief or proposition is true or valid.",
  "Scientific Consensus": "The collective judgment of the scientific community based on the weight of available evidence.",
  "Trust in Institutions": "The degree to which knowers rely on established organizations to produce reliable knowledge.",
  "Ethical Implications": "The moral consequences that arise from how knowledge is produced, shared, or applied.",
  "Historical Narrative": "The constructed story that historians tell about past events, shaped by available sources and interpretation.",
  "Perspective": "The particular viewpoint from which a knower understands and interprets the world.",
  "Bias": "A systematic tendency to favour certain outcomes or viewpoints over others, often unconsciously.",
  "Representation": "How individuals, groups, or events are portrayed in knowledge systems and media.",
  "Algorithmic Bias": "Systematic errors in computer systems that create unfair outcomes, reflecting the biases of their creators.",
  "Filter Bubbles": "Intellectual isolation that occurs when algorithms selectively present information based on past behavior.",
  "Information Literacy": "The ability to identify, locate, evaluate, and effectively use information.",
  "Digital Knowledge Systems": "Technological platforms and tools that mediate how knowledge is created, stored, and shared."
};

let aokExplanations = {
  "Natural Sciences": "Knowledge produced through empirical observation, experimentation, and falsifiable hypotheses.",
  "Ethics": "The study of moral principles that govern right and wrong conduct and value judgments.",
  "Human Sciences": "Disciplines that study human behavior and social phenomena using systematic methods.",
  "History": "The study of past events, relying on evidence, interpretation, and narrative construction.",
  "The Arts": "Creative expressions that communicate knowledge through aesthetic experience and emotional engagement."
};

let objectKeys = Object.keys(objects);
let currentObjectKey = objectKeys[0];
let currentStep = 0; // 0=object only, 1=concepts, 2=aoks, 3=questions
let maxStep = 3;

let objectSelect;
let prevBtn, nextBtn;
let tooltip = null; // {text, x, y, timer}
let tooltipDuration = 180; // frames
let tagBounds = []; // [{label, x, y, w, h, type}] rebuilt each frame

let stepPrompts = [
  "Select an object to begin your exhibition analysis.",
  "Step 1: What TOK concepts does this object connect to?",
  "Step 2: Which Areas of Knowledge are relevant?",
  "Step 3: What knowledge questions does this object raise?"
];

let sectionColors = {
  concepts: { bg: "teal", text: "white" },
  aoks: { bg: "goldenrod", text: "white" },
  questions: { bg: "coral", text: "white" }
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textWrap(WORD);

  objectSelect = createSelect();
  objectSelect.parent(document.querySelector('main'));
  for (let key of objectKeys) {
    objectSelect.option(key);
  }
  objectSelect.selected(currentObjectKey);
  objectSelect.changed(() => {
    currentObjectKey = objectSelect.value();
    currentStep = 0;
    tooltip = null;
  });
  objectSelect.style('font-size', '14px');
  objectSelect.style('padding', '4px 8px');
  objectSelect.style('background', 'white');

  prevBtn = createButton('Previous');
  prevBtn.parent(document.querySelector('main'));
  prevBtn.mousePressed(() => {
    if (currentStep > 0) {
      currentStep--;
      tooltip = null;
    }
  });
  prevBtn.style('font-size', '14px');
  prevBtn.style('padding', '4px 16px');
  prevBtn.style('background', 'white');
  prevBtn.style('cursor', 'pointer');

  nextBtn = createButton('Next');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.mousePressed(() => {
    if (currentStep < maxStep) {
      currentStep++;
      tooltip = null;
    }
  });
  nextBtn.style('font-size', '14px');
  nextBtn.style('padding', '4px 16px');
  nextBtn.style('background', 'white');
  nextBtn.style('cursor', 'pointer');

  describe('TOK Exhibition analysis tool connecting real-world objects to TOK concepts, Areas of Knowledge, and knowledge questions through a guided step-through interface.');
}

function draw() {
  background('aliceblue');

  // Control area
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  tagBounds = [];
  drawPrompt();
  drawObjectCard();

  if (currentStep >= 1) drawConceptTags();
  if (currentStep >= 2) drawAokTags();
  if (currentStep >= 3) drawQuestionCards();

  drawConnectionLines();
  drawTooltip();
  positionControls();

  // Step indicator
  noStroke();
  fill(100);
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  text('Step ' + currentStep + ' of ' + maxStep, canvasWidth - margin, drawHeight - 4);
}

function drawPrompt() {
  noStroke();
  fill(60);
  textSize(12);
  textAlign(CENTER, TOP);
  text(stepPrompts[currentStep], canvasWidth / 2, 8, canvasWidth - margin * 2);
}

function drawObjectCard() {
  let cardX = margin;
  let cardY = 32;
  let cardW = canvasWidth - margin * 2;
  let cardH = 50;

  // Card shadow
  noStroke();
  fill(180, 180, 200, 80);
  rect(cardX + 2, cardY + 2, cardW, cardH, 8);

  // Card
  fill('steelblue');
  rect(cardX, cardY, cardW, cardH, 8);

  // Object name
  noStroke();
  fill('white');
  textSize(16);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(currentObjectKey, cardX + cardW / 2, cardY + cardH / 2);
  textStyle(NORMAL);
}

function drawConceptTags() {
  let obj = objects[currentObjectKey];
  let concepts = obj.concepts;
  let sectionY = 105;

  // Section label
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('TOK CONCEPTS', margin, sectionY - 14);
  textStyle(NORMAL);

  let tagX = margin;
  let tagY = sectionY;
  let tagH = 26;
  let tagPadding = 10;
  let tagGap = 6;

  textSize(12);
  for (let i = 0; i < concepts.length; i++) {
    let tw = textWidth(concepts[i]) + tagPadding * 2;

    // Wrap to next row if needed
    if (tagX + tw > canvasWidth - margin) {
      tagX = margin;
      tagY += tagH + tagGap;
    }

    // Tag background
    noStroke();
    fill('teal');
    rect(tagX, tagY, tw, tagH, 13);

    // Tag text
    noStroke();
    fill('white');
    textAlign(LEFT, CENTER);
    text(concepts[i], tagX + tagPadding, tagY + tagH / 2);

    // Store tag bounds for click detection
    tagBounds.push({ label: concepts[i], x: tagX, y: tagY, w: tw, h: tagH, type: 'concept' });

    tagX += tw + tagGap;
  }
}

function drawAokTags() {
  let obj = objects[currentObjectKey];
  let aoks = obj.aoks;
  let sectionY = 185;

  // Section label
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('AREAS OF KNOWLEDGE', margin, sectionY - 14);
  textStyle(NORMAL);

  let tagX = margin;
  let tagY = sectionY;
  let tagH = 26;
  let tagPadding = 10;
  let tagGap = 6;

  textSize(12);
  for (let i = 0; i < aoks.length; i++) {
    let tw = textWidth(aoks[i]) + tagPadding * 2;

    if (tagX + tw > canvasWidth - margin) {
      tagX = margin;
      tagY += tagH + tagGap;
    }

    noStroke();
    fill('goldenrod');
    rect(tagX, tagY, tw, tagH, 13);

    noStroke();
    fill('white');
    textAlign(LEFT, CENTER);
    text(aoks[i], tagX + tagPadding, tagY + tagH / 2);

    tagBounds.push({ label: aoks[i], x: tagX, y: tagY, w: tw, h: tagH, type: 'aok' });

    tagX += tw + tagGap;
  }
}

function drawQuestionCards() {
  let obj = objects[currentObjectKey];
  let questions = obj.questions;
  let sectionY = 265;

  // Section label
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('KNOWLEDGE QUESTIONS', margin, sectionY - 14);
  textStyle(NORMAL);

  let cardX = margin;
  let cardW = canvasWidth - margin * 2;
  let cardH = 55;
  let cardGap = 8;

  for (let i = 0; i < questions.length; i++) {
    let cardY = sectionY + i * (cardH + cardGap);

    // Card shadow
    noStroke();
    fill(200, 180, 170, 80);
    rect(cardX + 2, cardY + 2, cardW, cardH, 6);

    // Card background
    fill('coral');
    rect(cardX, cardY, cardW, cardH, 6);

    // Question mark icon
    fill(255, 255, 255, 100);
    textSize(28);
    textAlign(LEFT, CENTER);
    text('?', cardX + 8, cardY + cardH / 2);

    // Question text
    noStroke();
    fill('white');
    textSize(12);
    textAlign(LEFT, TOP);
    text(questions[i], cardX + 32, cardY + 10, cardW - 42);
  }
}

function drawConnectionLines() {
  if (currentStep < 1) return;

  let objCardBottom = 82;
  let objCardCenterX = canvasWidth / 2;

  // Draw lines from object card to concept section
  if (currentStep >= 1) {
    stroke('teal');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    line(objCardCenterX, objCardBottom, objCardCenterX, 91);
    drawingContext.setLineDash([]);
  }

  // Draw line from concepts to AOKs
  if (currentStep >= 2) {
    stroke('goldenrod');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    let conceptsBottom = 137;
    line(objCardCenterX, conceptsBottom, objCardCenterX, 171);
    drawingContext.setLineDash([]);
  }

  // Draw line from AOKs to questions
  if (currentStep >= 3) {
    stroke('coral');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    let aoksBottom = 217;
    line(objCardCenterX, aoksBottom, objCardCenterX, 251);
    drawingContext.setLineDash([]);
  }

  noStroke();
}

function drawTooltip() {
  if (!tooltip) return;

  tooltip.timer--;
  if (tooltip.timer <= 0) {
    tooltip = null;
    return;
  }

  let tooltipW = min(canvasWidth - margin * 2, 260);
  textSize(11);
  let lines = ceil(textWidth(tooltip.text) / (tooltipW - 16));
  let tooltipH = max(36, lines * 14 + 16);

  let tx = constrain(tooltip.x - tooltipW / 2, margin, canvasWidth - margin - tooltipW);
  let ty = tooltip.y + 20;
  if (ty + tooltipH > drawHeight) {
    ty = tooltip.y - tooltipH - 8;
  }

  // Fade effect
  let alpha = tooltip.timer < 30 ? map(tooltip.timer, 0, 30, 0, 240) : 240;

  noStroke();
  fill(40, 40, 50, alpha);
  rect(tx, ty, tooltipW, tooltipH, 6);

  fill(255, 255, 255, alpha);
  textSize(11);
  textAlign(LEFT, TOP);
  text(tooltip.text, tx + 8, ty + 8, tooltipW - 16);
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  // Check all tag bounds for click
  for (let b of tagBounds) {
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      let explanation;
      if (b.type === 'concept') {
        explanation = conceptExplanations[b.label] || "A key TOK concept related to this object.";
      } else {
        explanation = aokExplanations[b.label] || "An Area of Knowledge in the TOK framework.";
      }
      tooltip = { text: b.label + ": " + explanation, x: mouseX, y: b.y, timer: tooltipDuration };
      return;
    }
  }

  // Clicking elsewhere dismisses tooltip
  tooltip = null;
}

function positionControls() {
  let controlY = drawHeight + 15;
  let selectW = 180;
  let btnW = 70;
  let gap = 8;
  let totalW = selectW + gap + btnW + gap + btnW;
  let startX = (canvasWidth - totalW) / 2;

  // Get canvas position
  let cnv = document.querySelector('main canvas');
  if (!cnv) return;
  let rect = cnv.getBoundingClientRect();

  objectSelect.position(rect.left + startX, rect.top + controlY);
  objectSelect.style('width', selectW + 'px');

  prevBtn.position(rect.left + startX + selectW + gap, rect.top + controlY);
  nextBtn.position(rect.left + startX + selectW + gap + btnW + gap, rect.top + controlY);

  // Enable/disable buttons based on step
  if (currentStep <= 0) {
    prevBtn.attribute('disabled', '');
    prevBtn.style('opacity', '0.4');
    prevBtn.style('cursor', 'default');
  } else {
    prevBtn.removeAttribute('disabled');
    prevBtn.style('opacity', '1');
    prevBtn.style('cursor', 'pointer');
  }

  if (currentStep >= maxStep) {
    nextBtn.attribute('disabled', '');
    nextBtn.style('opacity', '0.4');
    nextBtn.style('cursor', 'default');
  } else {
    nextBtn.removeAttribute('disabled');
    nextBtn.style('opacity', '1');
    nextBtn.style('cursor', 'pointer');
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = min(container.offsetWidth, 600);
  } else {
    canvasWidth = 400;
  }
}
