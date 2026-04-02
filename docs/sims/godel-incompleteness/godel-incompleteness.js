// Gödel's Incompleteness Theorem — Nested Sets Diagram
// CANVAS_HEIGHT: 510
// Step-through visualization showing relationship between
// true statements and provable statements in a formal system.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = 510;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let prevButton;
let nextButton;

// State
let currentStep = 0;
let totalSteps = 5;

// Animation
let animProgress = 0;
let animTarget = 1;

// Step data
let steps = [
  {
    title: "Step 1: A Formal System",
    explanation: "A formal system starts with axioms (basic assumptions) and rules of inference. " +
      "From these, we can prove certain statements. The green circle represents all statements " +
      "that can be proved within the system."
  },
  {
    title: "Step 2: True Statements Exist",
    explanation: "Beyond what we can prove, there are statements that are actually true about " +
      "mathematics. The yellow circle represents all true statements. We might hope these two " +
      "sets are the same..."
  },
  {
    title: "Step 3: The Hopeful View",
    explanation: "Ideally, every true statement would be provable, and every provable statement " +
      "would be true. The sets would overlap completely. This was the dream of mathematicians " +
      "like David Hilbert in the early 1900s."
  },
  {
    title: "Step 4: Gödel's Discovery (1931)",
    explanation: "Kurt Gödel proved that in any consistent formal system powerful enough to " +
      "describe basic arithmetic, there must be true statements that cannot be proved within " +
      "the system. The coral crescent shows this gap — true but unprovable statements."
  },
  {
    title: "Step 5: The Gödel Sentence",
    explanation: "Gödel constructed a specific sentence that essentially says: \"This statement " +
      "is not provable in this system.\" If the system is consistent, this sentence must be " +
      "true — but it cannot be proved! The star marks this self-referential sentence."
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Controls
  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.mousePressed(goPrev);
  prevButton.style('font-size', '16px');
  prevButton.style('padding', '6px 16px');
  prevButton.style('cursor', 'pointer');

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(goNext);
  nextButton.style('font-size', '16px');
  nextButton.style('padding', '6px 16px');
  nextButton.style('cursor', 'pointer');

  textFont('Arial');
}

function draw() {
  // Drawing area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Animate progress
  animProgress = lerp(animProgress, animTarget, 0.08);

  // Center of diagram area
  let cx = canvasWidth / 2;
  let cy = 180;
  let maxRadius = min(canvasWidth * 0.35, 150);

  // Draw based on current step
  drawDiagram(cx, cy, maxRadius);

  // Draw step title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text(steps[currentStep].title, cx, 15);

  // Draw explanation text
  textStyle(NORMAL);
  textSize(13);
  fill('gray');
  textAlign(CENTER, TOP);
  let explanationY = 320;
  let textW = canvasWidth - 50;
  text(steps[currentStep].explanation, cx, explanationY, textW);

  // Draw step counter in control area
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(NORMAL);
  text("Step " + (currentStep + 1) + " of " + totalSteps, cx, drawHeight + controlHeight / 2);

  // Update button states
  prevButton.attribute('disabled', currentStep === 0 ? '' : null);
  if (currentStep === 0) {
    prevButton.attribute('disabled', '');
  } else {
    prevButton.removeAttribute('disabled');
  }
  if (currentStep === totalSteps - 1) {
    nextButton.attribute('disabled', '');
  } else {
    nextButton.removeAttribute('disabled');
  }

  describe('Nested sets diagram illustrating Gödel Incompleteness Theorem, step ' + (currentStep + 1) + ' of ' + totalSteps);
}

function drawDiagram(cx, cy, maxR) {
  let trueR = maxR;
  let provR = maxR * 0.65;

  if (currentStep === 0) {
    // Step 1: Only the provable set
    drawOutsideArea(cx, cy, maxR);
    drawProvableCircle(cx, cy, provR, animProgress);
    drawProvableLabel(cx, cy, provR);
    drawExampleLabel(cx, cy, "2 + 2 = 4", 0, 0);
  } else if (currentStep === 1) {
    // Step 2: Truth set appears around the provable set
    drawOutsideArea(cx, cy, maxR);
    drawTrueCircle(cx, cy, trueR, animProgress);
    drawProvableCircle(cx, cy, provR, 1);
    drawTrueLabel(cx, cy, trueR);
    drawProvableLabel(cx, cy, provR);
    drawExampleLabel(cx, cy, "2 + 2 = 4", 0, 0);
  } else if (currentStep === 2) {
    // Step 3: Sets shown overlapping completely (hopeful view)
    drawOutsideArea(cx, cy, maxR);
    // Provable expands to match true — both same size
    let mergedR = lerp(provR, trueR, animProgress);
    drawTrueCircle(cx, cy, trueR, 1);
    drawProvableCircle(cx, cy, mergedR, 1);
    drawMergedLabel(cx, cy, trueR);
    drawExampleLabel(cx, cy, "2 + 2 = 4", 0, 0);
  } else if (currentStep === 3) {
    // Step 4: Provable shrinks back, crescent revealed
    drawOutsideArea(cx, cy, maxR);
    let shrinkR = lerp(trueR, provR, animProgress);
    // Draw true circle
    drawTrueCircle(cx, cy, trueR, 1);
    // Draw crescent highlight
    drawCrescentHighlight(cx, cy, trueR, shrinkR, animProgress);
    // Draw provable circle
    drawProvableCircle(cx, cy, shrinkR, 1);
    // Labels
    drawTrueLabel(cx, cy, trueR);
    drawProvableLabel(cx, cy, shrinkR);
    drawCrescentLabel(cx, cy, trueR, shrinkR, animProgress);
    // Examples
    drawExampleLabel(cx, cy, "2 + 2 = 4", 0, 0);
    if (animProgress > 0.5) {
      let a = map(animProgress, 0.5, 1, 0, 255);
      drawCrescentExample(cx, cy, trueR, provR, a);
    }
    drawFalseExample(cx, cy, trueR, animProgress);
  } else if (currentStep === 4) {
    // Step 5: Gödel sentence highlighted with star
    drawOutsideArea(cx, cy, maxR);
    drawTrueCircle(cx, cy, trueR, 1);
    drawCrescentHighlight(cx, cy, trueR, provR, 1);
    drawProvableCircle(cx, cy, provR, 1);
    drawTrueLabel(cx, cy, trueR);
    drawProvableLabel(cx, cy, provR);
    drawCrescentLabel(cx, cy, trueR, provR, 1);
    drawExampleLabel(cx, cy, "2 + 2 = 4", 0, 0);
    drawCrescentExample(cx, cy, trueR, provR, 255);
    drawFalseExample(cx, cy, trueR, 1);
    drawGodelSentence(cx, cy, trueR, provR, animProgress);
  }
}

function drawOutsideArea(cx, cy, r) {
  // Background area representing false statements
  noStroke();
  fill(220);
  let boxX = cx - r - 50;
  let boxY = cy - r - 40;
  let boxW = (r + 50) * 2;
  let boxH = (r + 40) * 2;
  rect(boxX, boxY, boxW, boxH, 10);

  // Label for outside area
  fill(120);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  textStyle(ITALIC);
  text("False Statements", boxX + 8, boxY + 6);
  textStyle(NORMAL);
}

function drawTrueCircle(cx, cy, r, progress) {
  let drawR = r * progress;
  stroke(180, 180, 0);
  strokeWeight(2);
  fill(255, 255, 224, 180); // lightyellow with transparency
  ellipse(cx, cy, drawR * 2, drawR * 2);
}

function drawProvableCircle(cx, cy, r, progress) {
  let drawR = r * progress;
  stroke(0, 128, 0);
  strokeWeight(2);
  fill(144, 238, 144, 180); // lightgreen with transparency
  ellipse(cx, cy, drawR * 2, drawR * 2);
}

function drawCrescentHighlight(cx, cy, outerR, innerR, progress) {
  // Draw the crescent area in coral
  // Use a clipping approach: draw outer circle, then cover with inner
  // We'll approximate by drawing arcs
  let alpha = 160 * progress;

  // Draw outer circle in coral
  noStroke();
  fill(240, 128, 128, alpha); // lightcoral
  ellipse(cx, cy, outerR * 2, outerR * 2);

  // Cut out inner circle by drawing over it — we use the provable circle to cover
  // This is handled by drawing provable on top
}

function drawTrueLabel(cx, cy, r) {
  noStroke();
  fill(120, 120, 0);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("All True\nStatements", cx, cy - r + 22);
  textStyle(NORMAL);
}

function drawProvableLabel(cx, cy, r) {
  noStroke();
  fill(0, 100, 0);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Provable\nStatements", cx, cy - r + 18);
  textStyle(NORMAL);
}

function drawMergedLabel(cx, cy, r) {
  noStroke();
  fill(0, 100, 0);
  textSize(13);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("All True = All Provable?\n(Hilbert's Dream)", cx, cy - r + 25);
  textStyle(NORMAL);
}

function drawCrescentLabel(cx, cy, outerR, innerR, progress) {
  let alpha = 255 * progress;
  noStroke();
  fill(180, 60, 60, alpha);
  textSize(11);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  // Position label in the right crescent area
  let labelX = cx + (outerR + innerR) / 2;
  let labelY = cy;
  text("True but\nUnprovable", labelX, labelY);
  textStyle(NORMAL);
}

function drawExampleLabel(cx, cy, label, offsetX, offsetY) {
  noStroke();
  fill(0, 80, 0);
  textSize(11);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  text('"' + label + '"', cx + offsetX, cy + offsetY + 15);
  textStyle(NORMAL);
}

function drawCrescentExample(cx, cy, outerR, innerR, alpha) {
  let exX = cx + (outerR + innerR) / 2;
  let exY = cy + 30;
  noStroke();
  fill(160, 40, 40, alpha);
  textSize(9);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  text('"This statement\ncannot be proved\nwithin this system"', exX, exY);
  textStyle(NORMAL);
}

function drawFalseExample(cx, cy, r, progress) {
  let alpha = 255 * progress;
  noStroke();
  fill(100, 100, 100, alpha);
  textSize(11);
  textAlign(LEFT, CENTER);
  textStyle(ITALIC);
  let exX = cx - r - 42;
  let exY = cy + r + 15;
  text('"2 + 2 = 5"', exX, exY);
  textStyle(NORMAL);
}

function drawGodelSentence(cx, cy, outerR, innerR, progress) {
  // Draw a pulsing star in the crescent region
  let starX = cx + (outerR + innerR) / 2;
  let starY = cy - 25;
  let pulse = sin(frameCount * 0.05) * 3 + 12;
  let starSize = pulse * progress;

  // Glow
  noStroke();
  fill(255, 80, 80, 80 * progress);
  ellipse(starX, starY, starSize * 2.5, starSize * 2.5);

  // Star shape
  fill(220, 50, 50);
  stroke(160, 0, 0);
  strokeWeight(1);
  drawStar(starX, starY, starSize * 0.4, starSize, 5);

  // Label with arrow
  noStroke();
  fill(180, 0, 0, 255 * progress);
  textSize(10);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Gödel\nSentence", starX, starY - starSize - 14);
  textStyle(NORMAL);
}

function drawStar(x, y, innerR, outerR, points) {
  let angle = TWO_PI / points;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    let sx = x + cos(a) * outerR;
    let sy = y + sin(a) * outerR;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * innerR;
    sy = y + sin(a + halfAngle) * innerR;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function goNext() {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    animProgress = 0;
    animTarget = 1;
  }
}

function goPrev() {
  if (currentStep > 0) {
    currentStep--;
    animProgress = 0;
    animTarget = 1;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const main = document.querySelector('main');
  if (main) {
    containerWidth = main.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(containerWidth, 300);
}
