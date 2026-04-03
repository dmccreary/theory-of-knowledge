// Cartesian Doubt Layers - Concentric rings showing Descartes's layers of doubt
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = 510;
let margin = 25;
let defaultTextSize = 16;

let layers = [
  {name: "Sensory Beliefs", argument: "The Senses Deceive", desc: "Our senses sometimes fool us (optical illusions, mirages). If they can deceive once, perhaps they always deceive.", color: "powderblue", alpha: 255, doubted: false},
  {name: "Physical World", argument: "The Dream Argument", desc: "We cannot distinguish dreaming from waking with certainty. Perhaps everything we perceive is a dream.", color: "paleturquoise", alpha: 255, doubted: false},
  {name: "Mathematical Beliefs", argument: "The Evil Demon", desc: "An all-powerful deceiver could make us believe 2+2=5. Even logical truths could be illusions.", color: "mediumaquamarine", alpha: 255, doubted: false},
  {name: "Cogito ergo sum", argument: "The Cogito", desc: "Even if deceived about everything else, the very act of doubting proves I exist as a thinking thing.", color: "gold", alpha: 255, doubted: false}
];

let resetButton;
let currentStage = 0;
let explanationText = "Click the outermost ring to begin doubting.";
let hoveringCenter = false;

// Ring radii (outer to inner)
let ringRadii;
let centerX, centerY;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  recalculate();
}

function recalculate() {
  centerX = canvasWidth / 2;
  centerY = drawHeight / 2 - 10;
  let maxRadius = min(canvasWidth / 2 - margin, drawHeight / 2 - margin - 20);
  ringRadii = [
    maxRadius,
    maxRadius * 0.72,
    maxRadius * 0.48,
    maxRadius * 0.28
  ];
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();

  // Check hover on center
  let d = dist(mouseX, mouseY, centerX, centerY);
  hoveringCenter = (d < ringRadii[3] && !layers[3].doubted);

  // Draw rings from outermost to innermost
  for (let i = 0; i < 4; i++) {
    let layer = layers[i];
    let c = color(layer.color);
    c.setAlpha(layer.alpha);
    fill(c);
    noStroke();
    ellipse(centerX, centerY, ringRadii[i] * 2, ringRadii[i] * 2);
  }

  // Draw ring labels
  for (let i = 0; i < 4; i++) {
    let layer = layers[i];
    if (layer.alpha > 30) {
      let labelAlpha = layer.alpha;
      noStroke();
      fill(0, 0, 0, labelAlpha);
      textAlign(CENTER, CENTER);

      if (i < 3) {
        // Label placed between this ring and the next inner ring
        let midR = (ringRadii[i] + ringRadii[i + 1]) / 2;
        textSize(13);
        text(layer.name, centerX, centerY - midR);
      } else {
        // Center label
        textSize(12);
        text(layer.name, centerX, centerY - 8);
        textSize(10);
        text("(I think, therefore I am)", centerX, centerY + 8);
      }
    }
  }

  // Fade doubted layers
  for (let i = 0; i < 4; i++) {
    if (layers[i].doubted && layers[i].alpha > 0) {
      layers[i].alpha = max(0, layers[i].alpha - 5);
    }
  }

  // Hover tooltip for center
  if (hoveringCenter && currentStage < 4) {
    noStroke();
    fill(255, 255, 240, 230);
    let tw = 260;
    let th = 60;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - th - 10, 0, drawHeight - th);
    rect(tx, ty, tw, th, 6);
    fill('black');
    textSize(11);
    textAlign(LEFT, TOP);
    text("Descartes argued this is the one\nundoubtable truth: the act of thinking\nproves the thinker exists.", tx + 8, ty + 8);
  }

  // Explanation panel
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  let explanationY = drawHeight - 80;
  let explanationW = canvasWidth - margin * 2;

  // Semi-transparent background for explanation
  fill(255, 255, 255, 180);
  noStroke();
  rect(margin - 5, explanationY - 5, explanationW + 10, 70, 6);

  fill('black');
  noStroke();
  textSize(13);
  text(explanationText, margin, explanationY, explanationW, 65);

  // Controls area text
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);
  let stageLabel = currentStage === 0 ? "Click outermost ring to begin" : "Stage " + currentStage + " of 4";
  text(stageLabel, canvasWidth / 2 + 30, drawHeight + controlHeight / 2);

  // Position reset button
  resetButton.position(canvasWidth / 2 - 100, drawHeight + controlHeight / 2 - 12 + select('canvas').elt.offsetTop);
  resetButton.style('font-size', '14px');
  resetButton.style('padding', '4px 16px');

  describe('Concentric rings representing Descartes layers of doubt from sensory beliefs on the outside to cogito ergo sum at the center. Click rings to doubt them away.');
}

function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;

  let d = dist(mouseX, mouseY, centerX, centerY);

  // Determine which ring was clicked (outermost first)
  let clickedRing = -1;
  for (let i = 0; i < 4; i++) {
    if (d < ringRadii[i]) {
      clickedRing = i;
    }
  }

  if (clickedRing === -1) return;

  // Find the actual ring (the outermost undoubted visible ring that contains the click)
  // We need to find which visible ring the click is in
  // clickedRing is the innermost ring that contains the point
  // The actual visual ring is the outermost undoubted ring that contains the click

  // Find outermost undoubted ring
  let targetRing = -1;
  for (let i = 0; i < 4; i++) {
    if (!layers[i].doubted && d < ringRadii[i]) {
      targetRing = i;
      break;
    }
  }

  if (targetRing === -1) return;

  // Must doubt from outermost inward
  // Check if this is the next ring to doubt
  if (targetRing !== currentStage) {
    if (targetRing > currentStage) {
      explanationText = "You must doubt the outer layer first! Click the " + layers[currentStage].name + " ring.";
    }
    return;
  }

  // Doubt this layer
  layers[targetRing].doubted = true;
  currentStage++;

  let layer = layers[targetRing];
  explanationText = layer.argument + ": " + layer.desc;

  if (currentStage === 4) {
    explanationText = layer.argument + ": " + layer.desc;
  }
}

function resetAll() {
  for (let i = 0; i < 4; i++) {
    layers[i].alpha = 255;
    layers[i].doubted = false;
  }
  currentStage = 0;
  explanationText = "Click the outermost ring to begin doubting.";
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  recalculate();
}

function updateCanvasSize() {
  let parent = document.querySelector('main');
  if (parent) {
    canvasWidth = min(400, parent.offsetWidth - 20);
  }
}
