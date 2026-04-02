// Intellectual Virtues Wheel MicroSim
// Radial wheel diagram of intellectual virtues
// Click segment for description, hover for tooltip, step-through reveals one at a time

let canvasWidth = 400;
const drawHeight = 450;
const controlHeight = 60;
const CANVAS_HEIGHT = 510;

let virtues = [
  {name:"Intellectual\nCourage", color:"teal", desc:"Willingness to challenge popular beliefs and defend unpopular positions when evidence supports them.", example:"Galileo defending heliocentrism despite Church opposition."},
  {name:"Open-\nMindedness", color:"steelblue", desc:"Willingness to consider new ideas and perspectives, even those that challenge your existing beliefs.", example:"A scientist seriously considering a rival theory that contradicts their own research."},
  {name:"Intellectual\nHonesty", color:"mediumseagreen", desc:"Commitment to truth over ego — acknowledging mistakes, giving credit, and representing evidence fairly.", example:"A researcher publishing negative results that disprove their hypothesis."},
  {name:"Epistemic\nResponsibility", color:"goldenrod", desc:"Duty to form beliefs carefully, seek evidence, and consider consequences of spreading unverified claims.", example:"Checking sources before sharing news on social media."}
];

let centerVirtue = {name:"Epistemic\nHumility", color:"coral", desc:"Recognizing the limits of your own knowledge and being open to being wrong.", example:"Saying 'I don't know' when you genuinely don't."};

let selectedIndex = -1; // -1 = none, 0-3 = segment, 4 = center
let hoveredIndex = -1;
let revealedCount = 0; // 0 = only center, 1-4 = segments revealed
let prevBtn, nextBtn, resetBtn;

function updateCanvasSize() {
  canvasWidth = max(350, min(600, windowWidth - 40));
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);

  // Controls
  prevBtn = createButton('Previous');
  prevBtn.mousePressed(goPrev);
  prevBtn.parent(document.querySelector('main'));
  prevBtn.style('background-color', 'white');
  prevBtn.style('margin', '4px');
  prevBtn.style('padding', '6px 14px');
  prevBtn.style('cursor', 'pointer');
  prevBtn.style('font-size', '14px');

  nextBtn = createButton('Next');
  nextBtn.mousePressed(goNext);
  nextBtn.parent(document.querySelector('main'));
  nextBtn.style('background-color', 'white');
  nextBtn.style('margin', '4px');
  nextBtn.style('padding', '6px 14px');
  nextBtn.style('cursor', 'pointer');
  nextBtn.style('font-size', '14px');

  resetBtn = createButton('Reset');
  resetBtn.mousePressed(doReset);
  resetBtn.parent(document.querySelector('main'));
  resetBtn.style('background-color', 'white');
  resetBtn.style('margin', '4px');
  resetBtn.style('padding', '6px 14px');
  resetBtn.style('cursor', 'pointer');
  resetBtn.style('font-size', '14px');

  describe('Radial wheel diagram showing five intellectual virtues: Intellectual Courage, Open-Mindedness, Intellectual Honesty, Epistemic Responsibility, and Epistemic Humility in the center. Click segments for details.');
}

function goPrev() {
  if (revealedCount > 0) {
    revealedCount--;
    selectedIndex = revealedCount > 0 ? revealedCount - 1 : 4;
  }
}

function goNext() {
  if (revealedCount < virtues.length) {
    revealedCount++;
    selectedIndex = revealedCount - 1;
  }
}

function doReset() {
  revealedCount = 0;
  selectedIndex = -1;
  hoveredIndex = -1;
}

function draw() {
  background('aliceblue');

  let cx = canvasWidth / 2;
  let cy = 180;
  let outerR = min(canvasWidth, drawHeight) * 0.34;
  let innerR = outerR * 0.38;
  let segAngle = TWO_PI / virtues.length;
  let startOffset = -HALF_PI - segAngle / 2;

  // Draw segments
  for (let i = 0; i < virtues.length; i++) {
    let a1 = startOffset + i * segAngle;
    let a2 = a1 + segAngle;
    let isRevealed = i < revealedCount;
    let isSelected = selectedIndex === i;
    let isHovered = hoveredIndex === i;

    // Segment fill
    if (isRevealed) {
      if (isSelected) {
        fill(virtues[i].color);
      } else if (isHovered) {
        let c = color(virtues[i].color);
        c.setAlpha(200);
        fill(c);
      } else {
        let c = color(virtues[i].color);
        c.setAlpha(150);
        fill(c);
      }
    } else {
      fill('silver');
    }

    stroke(255);
    strokeWeight(2);
    arc(cx, cy, outerR * 2, outerR * 2, a1, a2, PIE);

    // Segment label
    let labelR = (outerR + innerR) / 2;
    let midAngle = (a1 + a2) / 2;
    let lx = cx + labelR * cos(midAngle);
    let ly = cy + labelR * sin(midAngle);

    noStroke();
    fill('white');
    textSize(11);
    textStyle(BOLD);
    text(isRevealed ? virtues[i].name : '?', lx, ly);
  }

  // Draw center circle
  stroke(255);
  strokeWeight(2);
  fill(centerVirtue.color);
  ellipse(cx, cy, innerR * 2, innerR * 2);

  noStroke();
  fill('white');
  textSize(11);
  textStyle(BOLD);
  text(centerVirtue.name, cx, cy);

  // Highlight ring on selected center
  if (selectedIndex === 4) {
    noFill();
    stroke('white');
    strokeWeight(4);
    ellipse(cx, cy, innerR * 2 + 8, innerR * 2 + 8);
  }

  // Description panel
  textStyle(NORMAL);
  noStroke();
  let panelY = cy + outerR + 20;
  let panelW = canvasWidth - 40;
  let panelX = 20;

  if (selectedIndex >= 0 && selectedIndex <= 4) {
    let v = selectedIndex === 4 ? centerVirtue : virtues[selectedIndex];
    let nameClean = v.name.replace('\n', ' ');

    // Panel background
    fill(255, 255, 255, 230);
    stroke('silver');
    strokeWeight(1);
    rect(panelX, panelY, panelW, 160, 8);

    noStroke();
    textAlign(LEFT, TOP);

    // Virtue name
    fill(v.color);
    textSize(15);
    textStyle(BOLD);
    text(nameClean, panelX + 12, panelY + 10);

    // Description
    fill(60);
    textSize(12);
    textStyle(NORMAL);
    text(v.desc, panelX + 12, panelY + 34, panelW - 24, 60);

    // Example
    fill(100);
    textSize(11);
    textStyle(ITALIC);
    text('Example: ' + v.example, panelX + 12, panelY + 100, panelW - 24, 50);

    textAlign(CENTER, CENTER);
  } else {
    // Instruction text
    fill(120);
    textSize(13);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);
    text('Use Next to reveal virtues, then click a segment for details.', panelX, panelY + 30, panelW, 40);
  }

  // Tooltip on hover
  if (hoveredIndex >= 0 && hoveredIndex !== selectedIndex) {
    let v;
    let tipText;
    if (hoveredIndex === 4) {
      v = centerVirtue;
    } else if (hoveredIndex < revealedCount) {
      v = virtues[hoveredIndex];
    } else {
      v = null;
    }
    if (v) {
      tipText = v.name.replace('\n', ' ');
      noStroke();
      fill(50, 50, 50, 220);
      textSize(12);
      textStyle(NORMAL);
      textAlign(CENTER, CENTER);
      let tw = textWidth(tipText) + 16;
      let tx = constrain(mouseX, tw / 2 + 5, canvasWidth - tw / 2 - 5);
      let ty = mouseY - 25;
      rect(tx - tw / 2, ty - 12, tw, 24, 4);
      fill('white');
      text(tipText, tx, ty);
    }
  }

  // Title
  textAlign(CENTER, CENTER);
  noStroke();
  fill(40);
  textSize(17);
  textStyle(BOLD);
  text('Intellectual Virtues Wheel', canvasWidth / 2, 22);

  // Step indicator
  fill(100);
  textSize(12);
  textStyle(NORMAL);
  text('Revealed: ' + revealedCount + ' / ' + virtues.length, canvasWidth / 2, 44);

  // Update hover
  updateHover(cx, cy, outerR, innerR, segAngle, startOffset);
}

function updateHover(cx, cy, outerR, innerR, segAngle, startOffset) {
  let dx = mouseX - cx;
  let dy = mouseY - cy;
  let d = sqrt(dx * dx + dy * dy);
  hoveredIndex = -1;

  if (d < innerR) {
    hoveredIndex = 4;
  } else if (d < outerR) {
    let angle = atan2(dy, dx);
    // Normalize angle relative to startOffset
    let relAngle = angle - startOffset;
    while (relAngle < 0) relAngle += TWO_PI;
    while (relAngle >= TWO_PI) relAngle -= TWO_PI;
    let idx = floor(relAngle / segAngle);
    if (idx >= 0 && idx < virtues.length) {
      hoveredIndex = idx;
    }
  }
}

function mousePressed() {
  let cx = canvasWidth / 2;
  let cy = 180;
  let outerR = min(canvasWidth, drawHeight) * 0.34;
  let innerR = outerR * 0.38;
  let segAngle = TWO_PI / virtues.length;
  let startOffset = -HALF_PI - segAngle / 2;

  let dx = mouseX - cx;
  let dy = mouseY - cy;
  let d = sqrt(dx * dx + dy * dy);

  if (d < innerR) {
    selectedIndex = selectedIndex === 4 ? -1 : 4;
    return;
  }

  if (d < outerR) {
    let angle = atan2(dy, dx);
    let relAngle = angle - startOffset;
    while (relAngle < 0) relAngle += TWO_PI;
    while (relAngle >= TWO_PI) relAngle -= TWO_PI;
    let idx = floor(relAngle / segAngle);
    if (idx >= 0 && idx < virtues.length && idx < revealedCount) {
      selectedIndex = selectedIndex === idx ? -1 : idx;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}
