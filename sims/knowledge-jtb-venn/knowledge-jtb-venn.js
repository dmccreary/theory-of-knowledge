// JTB Venn Diagram - Justified True Belief
// Shows how knowledge emerges from the intersection of belief, truth, and justification
// MicroSim template version 2026.02

// Global variables for responsive layout
let containerWidth;
let canvasWidth = 600;
let drawHeight = 520;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Circle parameters (recalculated on resize)
let circleRadius;
let cx, cy; // center of the three-circle arrangement
let beliefCenter, truthCenter, justCenter;

// Colors
const beliefColor = [0, 150, 136];    // teal
const truthColor = [255, 179, 0];     // amber
const justColor = [255, 99, 71];      // coral
const knowledgeColor = [255, 215, 0]; // gold

// UI elements
let exampleSelect;
let quizButton;
let quizMode = false;
let quizRegion = -1;
let quizFeedback = '';
let quizFeedbackTimer = 0;

// Hover state
let hoveredRegion = -1;

// Example sets
const exampleSets = {
  "Everyday Examples": {
    beliefOnly: "Superstition — you believe walking under a ladder is bad luck, but it is neither true nor justified.",
    truthOnly: "Unknown fact — it is true that a specific atom exists on Mars, but nobody believes or has evidence for it.",
    justOnly: "Unused evidence — scientific data supports a claim, but nobody has examined it or formed a belief.",
    beliefTruth: "Lucky guess — you believe your friend is at the cafe and they happen to be there, but you had no reason to think so.",
    beliefJust: "Reasonable but wrong — you have strong evidence your flight is on time, but it was secretly delayed.",
    truthJust: "Unrecognized truth — the evidence clearly shows exercise is healthy, but someone refuses to believe it.",
    knowledge: "You believe the Earth orbits the Sun, it is true, and you can justify it with scientific evidence.",
    none: "False unjustified disbelief — a random false claim nobody believes or has evidence for."
  },
  "Science Examples": {
    beliefOnly: "A scientist believes in cold fusion based on a hunch, with no evidence and no confirmed results.",
    truthOnly: "An undiscovered species exists in the deep ocean — true, but no one knows or has evidence yet.",
    justOnly: "Data from a telescope supports a new planet, but no astronomer has seen or believed the data yet.",
    beliefTruth: "A student guesses the correct molecular formula on a test without understanding chemistry.",
    beliefJust: "Phlogiston theory — well-justified by 18th century evidence, believed by chemists, but ultimately false.",
    truthJust: "Semmelweis showed handwashing prevented infection, but doctors of his era refused to believe him.",
    knowledge: "DNA carries genetic information — believed by biologists, true, and justified by decades of research.",
    none: "The claim that the sun is cold — false, unjustified, and not believed by anyone."
  },
  "History Examples": {
    beliefOnly: "Medieval Europeans believed the Earth was flat — a common myth that was not true and lacked justification.",
    truthOnly: "The existence of Troy was true for millennia before Schliemann found evidence or anyone believed it remained.",
    justOnly: "Archives contain evidence of lost civilizations that no historian has yet examined or believed.",
    beliefTruth: "A student guesses the correct date of a battle without studying — true belief without justification.",
    beliefJust: "Historians long believed the Donation of Constantine was genuine, with textual evidence, but it was a forgery.",
    truthJust: "Continental drift was supported by evidence for decades before most geologists accepted it.",
    knowledge: "The fall of Rome in 476 CE — believed by historians, true, and justified by extensive documentary evidence.",
    none: "The claim that Napoleon conquered Australia — false, unjustified, and believed by no one."
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Create dropdown for example sets
  exampleSelect = createSelect();
  exampleSelect.option("Everyday Examples");
  exampleSelect.option("Science Examples");
  exampleSelect.option("History Examples");
  exampleSelect.position(10, drawHeight + 12);
  exampleSelect.style('font-size', '14px');
  exampleSelect.style('padding', '2px 6px');
  exampleSelect.parent(mainElement);

  // Create quiz mode button
  quizButton = createButton('Quiz Mode');
  quizButton.position(210, drawHeight + 12);
  quizButton.style('font-size', '14px');
  quizButton.style('padding', '4px 12px');
  quizButton.mousePressed(toggleQuizMode);
  quizButton.parent(mainElement);

  describe('Interactive Venn diagram showing Justified True Belief with three overlapping circles for Belief, Truth, and Justification. The triple overlap represents Knowledge.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Calculate circle geometry based on current canvas size
  calculateCirclePositions();

  // Draw the Venn diagram
  drawVennDiagram();

  // Draw title
  fill(50);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(Math.max(20, canvasWidth * 0.04));
  textStyle(BOLD);
  text('Justified True Belief (JTB)', canvasWidth / 2, 12);
  textStyle(NORMAL);

  // Detect which region the mouse is in
  hoveredRegion = getRegion(mouseX, mouseY);

  // Draw hover tooltip
  if (!quizMode && hoveredRegion >= 0) {
    drawTooltip(hoveredRegion);
  }

  // Draw quiz mode elements
  if (quizMode) {
    drawQuizMode();
  }

  // Draw control labels
  fill(80);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  // Quiz mode indicator
  if (quizMode) {
    fill(0, 120, 0);
    textAlign(RIGHT, CENTER);
    text('Quiz Mode: ON — click a highlighted region', canvasWidth - 10, drawHeight + 25);
  }

  // Decrement feedback timer
  if (quizFeedbackTimer > 0) quizFeedbackTimer--;
}

function calculateCirclePositions() {
  // Center of the arrangement
  cx = canvasWidth / 2;
  cy = drawHeight / 2 + 20;

  // Radius scales with canvas size
  circleRadius = Math.min(canvasWidth, drawHeight) * 0.26;

  // Separation between circle centers
  let sep = circleRadius * 0.72;

  // Position circles in a triangle arrangement
  // Belief = top-left, Truth = top-right, Justification = bottom-center
  beliefCenter = { x: cx - sep, y: cy - sep * 0.5 };
  truthCenter = { x: cx + sep, y: cy - sep * 0.5 };
  justCenter = { x: cx, y: cy + sep * 0.7 };
}

function drawVennDiagram() {
  // Use pixel-based approach for coloring regions
  // Draw circles with transparency
  let alpha = 80;

  // Draw each circle
  noStroke();

  // Belief circle
  fill(beliefColor[0], beliefColor[1], beliefColor[2], alpha);
  ellipse(beliefCenter.x, beliefCenter.y, circleRadius * 2);

  // Truth circle
  fill(truthColor[0], truthColor[1], truthColor[2], alpha);
  ellipse(truthCenter.x, truthCenter.y, circleRadius * 2);

  // Justification circle
  fill(justColor[0], justColor[1], justColor[2], alpha);
  ellipse(justCenter.x, justCenter.y, circleRadius * 2);

  // Highlight the knowledge region (triple overlap) with gold
  drawKnowledgeRegion();

  // Draw circle outlines
  noFill();
  strokeWeight(2.5);

  stroke(beliefColor[0], beliefColor[1], beliefColor[2]);
  ellipse(beliefCenter.x, beliefCenter.y, circleRadius * 2);

  stroke(truthColor[0], truthColor[1], truthColor[2]);
  ellipse(truthCenter.x, truthCenter.y, circleRadius * 2);

  stroke(justColor[0], justColor[1], justColor[2]);
  ellipse(justCenter.x, justCenter.y, circleRadius * 2);

  // Draw labels
  noStroke();
  textAlign(CENTER, CENTER);
  let labelSize = Math.max(15, canvasWidth * 0.026);
  textSize(labelSize);
  textStyle(BOLD);

  // Belief label - shifted toward center
  fill(0, 120, 108);
  let beliefLabelX = beliefCenter.x - circleRadius * 0.65;
  let beliefLabelY = beliefCenter.y - circleRadius * 0.8;
  text('Belief', beliefLabelX + (cx - beliefLabelX) * 0.3, beliefLabelY + (cy - beliefLabelY) * 0.3);

  // Truth label - shifted toward center
  fill(200, 140, 0);
  let truthLabelX = truthCenter.x + circleRadius * 0.65;
  let truthLabelY = truthCenter.y - circleRadius * 0.8;
  text('Truth', truthLabelX + (cx - truthLabelX) * 0.3, truthLabelY + (cy - truthLabelY) * 0.3);

  // Justification label - shifted toward center
  fill(200, 60, 40);
  let justLabelX = justCenter.x;
  let justLabelY = justCenter.y + circleRadius * 0.95;
  text('Justification', justLabelX + (cx - justLabelX) * 0.3, justLabelY + (cy - justLabelY) * 0.3);

  // Knowledge label in the center
  textSize(labelSize * 0.9);
  fill(160, 120, 0);
  let kx = cx;
  let ky = cy;
  text('Knowledge', kx, ky - labelSize * 0.6);
  textSize(labelSize * 0.55);
  textStyle(ITALIC);
  fill(120, 90, 0);
  text('(JTB)', kx, ky + labelSize * 0.4);
  textStyle(NORMAL);

  // Pairwise overlap labels (smaller text)
  let smallSize = Math.max(11, canvasWidth * 0.017);
  textSize(smallSize);
  fill(80);

  // Belief ∩ Truth (top, between the two)
  let btx = (beliefCenter.x + truthCenter.x) / 2;
  let bty = (beliefCenter.y + truthCenter.y) / 2 - circleRadius * 0.45;
  text('Lucky', btx, bty - smallSize * 0.6);
  text('guess', btx, bty + smallSize * 0.6);

  // Belief ∩ Justification (lower-left)
  let bjx = (beliefCenter.x + justCenter.x) / 2 - circleRadius * 0.35;
  let bjy = (beliefCenter.y + justCenter.y) / 2 + circleRadius * 0.15;
  text('Reasonable', bjx, bjy - smallSize * 0.6);
  text('but wrong', bjx, bjy + smallSize * 0.6);

  // Truth ∩ Justification (lower-right)
  let tjx = (truthCenter.x + justCenter.x) / 2 + circleRadius * 0.35;
  let tjy = (truthCenter.y + justCenter.y) / 2 + circleRadius * 0.15;
  text('Unrecognized', tjx, tjy - smallSize * 0.6);
  text('truth', tjx, tjy + smallSize * 0.6);
}

function drawKnowledgeRegion() {
  // Draw the triple-overlap region with a gold highlight
  // We approximate by drawing a filled shape at the intersection
  push();
  // Use clipping to find triple overlap
  // p5.js approach: draw gold dots only where all three circles overlap
  loadPixels();

  let goldR = 255, goldG = 215, goldB = 0, goldA = 140;

  // Only check the bounding box of the overlapping area for performance
  let minX = Math.max(0, Math.floor(cx - circleRadius));
  let maxX = Math.min(canvasWidth, Math.ceil(cx + circleRadius));
  let minY = Math.max(0, Math.floor(cy - circleRadius));
  let maxY = Math.min(drawHeight, Math.ceil(cy + circleRadius));

  for (let py = minY; py < maxY; py++) {
    for (let px = minX; px < maxX; px++) {
      if (inCircle(px, py, beliefCenter) && inCircle(px, py, truthCenter) && inCircle(px, py, justCenter)) {
        let idx = 4 * (py * width + px);
        // Blend gold color
        let srcA = goldA / 255;
        pixels[idx] = Math.min(255, pixels[idx] * (1 - srcA) + goldR * srcA);
        pixels[idx + 1] = Math.min(255, pixels[idx + 1] * (1 - srcA) + goldG * srcA);
        pixels[idx + 2] = Math.min(255, pixels[idx + 2] * (1 - srcA) + goldB * srcA);
      }
    }
  }
  updatePixels();
  pop();
}

function inCircle(px, py, center) {
  let dx = px - center.x;
  let dy = py - center.y;
  return (dx * dx + dy * dy) <= (circleRadius * circleRadius);
}

// Region identification:
// 0 = belief only, 1 = truth only, 2 = justification only
// 3 = belief ∩ truth (not just), 4 = belief ∩ just (not truth), 5 = truth ∩ just (not belief)
// 6 = knowledge (all three), 7 = outside all
function getRegion(mx, my) {
  let inB = inCircle(mx, my, beliefCenter);
  let inT = inCircle(mx, my, truthCenter);
  let inJ = inCircle(mx, my, justCenter);

  if (inB && inT && inJ) return 6; // Knowledge
  if (inB && inT) return 3;        // Belief ∩ Truth
  if (inB && inJ) return 4;        // Belief ∩ Justification
  if (inT && inJ) return 5;        // Truth ∩ Justification
  if (inB) return 0;               // Belief only
  if (inT) return 1;               // Truth only
  if (inJ) return 2;               // Justification only
  return 7;                         // Outside
}

function getRegionName(region) {
  switch (region) {
    case 0: return "Belief Only";
    case 1: return "Truth Only";
    case 2: return "Justification Only";
    case 3: return "Belief ∩ Truth";
    case 4: return "Belief ∩ Justification";
    case 5: return "Truth ∩ Justification";
    case 6: return "Knowledge (Justified True Belief)";
    case 7: return "Outside All Three";
    default: return "";
  }
}

function getRegionExample(region) {
  let set = exampleSets[exampleSelect.value()];
  switch (region) {
    case 0: return set.beliefOnly;
    case 1: return set.truthOnly;
    case 2: return set.justOnly;
    case 3: return set.beliefTruth;
    case 4: return set.beliefJust;
    case 5: return set.truthJust;
    case 6: return set.knowledge;
    case 7: return set.none;
    default: return "";
  }
}

function getConditionsMet(region) {
  switch (region) {
    case 0: return "✓ Belief  ✗ Truth  ✗ Justification";
    case 1: return "✗ Belief  ✓ Truth  ✗ Justification";
    case 2: return "✗ Belief  ✗ Truth  ✓ Justification";
    case 3: return "✓ Belief  ✓ Truth  ✗ Justification";
    case 4: return "✓ Belief  ✗ Truth  ✓ Justification";
    case 5: return "✗ Belief  ✓ Truth  ✓ Justification";
    case 6: return "✓ Belief  ✓ Truth  ✓ Justification";
    case 7: return "✗ Belief  ✗ Truth  ✗ Justification";
    default: return "";
  }
}

function drawTooltip(region) {
  if (region < 0) return;

  let name = getRegionName(region);
  let example = getRegionExample(region);
  let conditions = getConditionsMet(region);

  // Tooltip dimensions
  let tooltipW = Math.min(340, canvasWidth * 0.55);
  let padding = 10;
  let lineHeight = 16;

  // Wrap example text
  textSize(13);
  let wrappedLines = wrapText(example, tooltipW - padding * 2);
  let tooltipH = padding * 2 + lineHeight * 1.4 + lineHeight * 1.2 + wrappedLines.length * lineHeight + lineHeight * 1.2;

  // Position tooltip near mouse but keep on screen
  let tx = mouseX + 15;
  let ty = mouseY - tooltipH - 10;
  if (tx + tooltipW > canvasWidth - 5) tx = mouseX - tooltipW - 15;
  if (ty < 5) ty = mouseY + 20;
  if (ty + tooltipH > drawHeight - 5) ty = drawHeight - tooltipH - 5;

  // Draw tooltip background
  fill(255, 255, 255, 240);
  stroke(100);
  strokeWeight(1);
  rect(tx, ty, tooltipW, tooltipH, 6);

  noStroke();
  // Region name
  fill(40);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(name, tx + padding, ty + padding);

  // Conditions
  textStyle(NORMAL);
  textSize(12);
  fill(80);
  text(conditions, tx + padding, ty + padding + lineHeight * 1.4);

  // Example
  textSize(13);
  fill(60);
  let ey = ty + padding + lineHeight * 1.4 + lineHeight * 1.4;
  for (let i = 0; i < wrappedLines.length; i++) {
    text(wrappedLines[i], tx + padding, ey + i * lineHeight);
  }
}

function wrapText(txt, maxWidth) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
    if (textWidth(testLine) > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Quiz mode
let quizOptions = [];
let quizCorrectAnswer = -1;
let quizAnswered = false;

function toggleQuizMode() {
  quizMode = !quizMode;
  quizButton.html(quizMode ? 'Exit Quiz' : 'Quiz Mode');
  if (quizMode) {
    generateQuizQuestion();
  } else {
    quizRegion = -1;
    quizFeedback = '';
    quizAnswered = false;
  }
}

function generateQuizQuestion() {
  // Pick a random region (0-7)
  quizRegion = Math.floor(random(0, 8));
  quizAnswered = false;
  quizFeedback = '';
  quizFeedbackTimer = 0;
}

function drawQuizMode() {
  if (quizRegion < 0) return;

  // Draw the question banner at top below the title
  let bannerY = 48;
  fill(255, 255, 240, 230);
  stroke(200, 180, 0);
  strokeWeight(1.5);
  rect(margin, bannerY, canvasWidth - margin * 2, 70, 8);

  noStroke();
  fill(40);
  textAlign(CENTER, TOP);
  textSize(Math.max(14, canvasWidth * 0.022));
  textStyle(BOLD);
  text('Quiz: Which conditions are met?', canvasWidth / 2, bannerY + 8);
  textStyle(NORMAL);

  // Show example as the clue
  let set = exampleSets[exampleSelect.value()];
  let example = getRegionExample(quizRegion);
  textSize(Math.max(12, canvasWidth * 0.018));
  fill(80);

  // Truncate if too long
  let displayExample = example.length > 100 ? example.substring(0, 97) + '...' : example;
  text('"' + displayExample + '"', canvasWidth / 2, bannerY + 32);

  // Instruction
  textSize(12);
  fill(120);
  text('Click the correct region on the diagram', canvasWidth / 2, bannerY + 52);

  // Highlight the correct region with a pulsing border if answered correctly
  if (quizAnswered && quizFeedbackTimer > 0) {
    drawFeedback();
  }
}

function drawFeedback() {
  if (!quizFeedback) return;

  let feedbackY = drawHeight - 50;
  let bgColor, textColor;

  if (quizFeedback === 'correct') {
    bgColor = [220, 255, 220, 230];
    textColor = [0, 120, 0];
  } else {
    bgColor = [255, 220, 220, 230];
    textColor = [180, 0, 0];
  }

  fill(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
  stroke(textColor[0], textColor[1], textColor[2]);
  strokeWeight(1);
  rect(margin, feedbackY, canvasWidth - margin * 2, 40, 6);

  noStroke();
  fill(textColor[0], textColor[1], textColor[2]);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);

  if (quizFeedback === 'correct') {
    text('Correct! ' + getConditionsMet(quizRegion), canvasWidth / 2, feedbackY + 20);
  } else {
    text('Not quite. The answer was: ' + getRegionName(quizRegion), canvasWidth / 2, feedbackY + 20);
  }
  textStyle(NORMAL);
}

function mousePressed() {
  if (!quizMode || quizRegion < 0) return;

  // Only respond to clicks in the drawing region
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;

  let clickedRegion = getRegion(mouseX, mouseY);

  if (clickedRegion === quizRegion) {
    quizFeedback = 'correct';
  } else {
    quizFeedback = 'incorrect';
  }

  quizAnswered = true;
  quizFeedbackTimer = 180; // ~3 seconds at 60fps

  // Generate next question after delay
  setTimeout(() => {
    if (quizMode) {
      generateQuizQuestion();
    }
  }, 3000);
}

// Responsive resize functions
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
