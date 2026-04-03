// Sense Perception Pipeline MicroSim
// Shows how sensory data is filtered and interpreted
// CANVAS_HEIGHT: 520, drawHeight: 460, controlHeight: 60

let canvasWidth, drawHeight = 460, controlHeight = 60, canvasHeight = 520;
let exampleSelect, filterCheckbox;
let hoveredStage = -1;
let hoveredFilter = -1;

const examples = {
  "Optical Illusion": {
    stages: [
      "Light waves",
      "Eyes (retina)",
      "Optic nerve signals",
      "Visual cortex processing",
      "You 'see' lines as different lengths"
    ],
    filters: {
      expectations: "You expect parallel lines to be equal",
      context: "Surrounding arrows create depth cues",
      experience: "Past experience with perspective tricks your brain"
    },
    withFilters: "Müller-Lyer illusion: lines appear different lengths",
    withoutFilters: "Lines are actually identical in length"
  },
  "Selective Attention": {
    stages: [
      "Sound waves",
      "Ears (cochlea)",
      "Auditory nerve",
      "Auditory cortex",
      "You 'hear' your name in a crowd"
    ],
    filters: {
      expectations: "You expect to hear important information",
      context: "Noisy party environment",
      experience: "Your name is deeply familiar"
    },
    withFilters: "Cocktail party effect: you notice your name across the room",
    withoutFilters: "All sounds have roughly equal physical intensity"
  },
  "Taste Perception": {
    stages: [
      "Chemical molecules",
      "Tongue (taste buds)",
      "Gustatory nerve",
      "Gustatory cortex",
      "You 'taste' fine wine as complex"
    ],
    filters: {
      expectations: "Expensive wine label raises expectations",
      context: "Formal dinner setting enhances perception",
      experience: "Wine vocabulary shapes what flavors you detect"
    },
    withFilters: "Labeled as $90: tasters describe complex flavors",
    withoutFilters: "Identical wine labeled $10: tasters describe it as simple"
  }
};

const stageLabels = [
  "Stimulus",
  "Sensory Organ",
  "Neural Signal",
  "Brain Processing",
  "Conscious Perception"
];

const filterLabels = ["Expectations", "Context", "Prior Experience"];
const filterKeys = ["expectations", "context", "experience"];

const stageColors = ["coral", "gold", "skyblue", "mediumpurple", "mediumseagreen"];
const filterColors = ["lightsalmon", "khaki", "lightpink"];

function updateCanvasSize() {
  canvasWidth = min(windowWidth - 20, select('main').elt.getBoundingClientRect().width);
  if (canvasWidth < 400) canvasWidth = 400;
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);

  // Controls row
  exampleSelect = createSelect();
  exampleSelect.parent(document.querySelector('main'));
  exampleSelect.option("Optical Illusion");
  exampleSelect.option("Selective Attention");
  exampleSelect.option("Taste Perception");
  exampleSelect.style('font-size', '14px');
  exampleSelect.style('padding', '4px 8px');
  exampleSelect.style('background-color', 'white');
  exampleSelect.style('margin-right', '16px');

  filterCheckbox = createCheckbox(' Show Filters', true);
  filterCheckbox.parent(document.querySelector('main'));
  filterCheckbox.style('font-size', '14px');
  filterCheckbox.style('background-color', 'white');
  filterCheckbox.style('padding', '4px 8px');
  filterCheckbox.style('display', 'inline-block');

  describe('Pipeline diagram showing how sensory data flows from stimulus through sensory organs and neural signals to brain processing and conscious perception, with optional cognitive filter branches.');
}

function draw() {
  background('aliceblue');

  let data = examples[exampleSelect.value()];
  let showFilters = filterCheckbox.checked();

  let margin = 30;
  let usableWidth = canvasWidth - margin * 2;
  let boxW = usableWidth / 5 - 16;
  let boxH = 60;
  let pipelineY = 80;
  let spacing = usableWidth / 5;

  // Title
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  text("Sense Perception Pipeline", canvasWidth / 2, 28);
  textStyle(NORMAL);

  // Subtitle with current example
  textSize(13);
  fill('dimgray');
  text("Example: " + exampleSelect.value(), canvasWidth / 2, 50);

  // Reset hover
  hoveredStage = -1;
  hoveredFilter = -1;

  // Draw pipeline stages
  let stageBoxes = [];
  for (let i = 0; i < 5; i++) {
    let x = margin + i * spacing + spacing / 2;
    let bx = x - boxW / 2;
    let by = pipelineY;
    stageBoxes.push({ x: x, y: by + boxH / 2, bx: bx, by: by, w: boxW, h: boxH });

    // Check hover
    if (mouseX >= bx && mouseX <= bx + boxW && mouseY >= by && mouseY <= by + boxH) {
      hoveredStage = i;
    }

    // Box
    fill(stageColors[i]);
    stroke('gray');
    strokeWeight(1.5);
    rect(bx, by, boxW, boxH, 10);

    // Label
    noStroke();
    fill('black');
    textSize(11);
    textStyle(BOLD);
    text(stageLabels[i], x, by + 20);
    textStyle(NORMAL);
    textSize(9);
    fill('gray');

    // Wrap stage detail text
    let detail = data.stages[i];
    text(detail, x, by + 42, boxW - 8, 30);
  }

  // Draw arrows between stages
  stroke('gray');
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    let x1 = stageBoxes[i].bx + boxW;
    let x2 = stageBoxes[i + 1].bx;
    let ay = pipelineY + boxH / 2;
    line(x1, ay, x2 - 6, ay);
    // Arrowhead
    fill('gray');
    noStroke();
    triangle(x2 - 2, ay, x2 - 10, ay - 5, x2 - 10, ay + 5);
    stroke('gray');
    strokeWeight(2);
  }

  // Filter section
  let filterY = pipelineY + boxH + 60;
  let brainX = stageBoxes[3].x;
  let filterBoxW = min(140, usableWidth / 4.5);
  let filterBoxH = 50;
  let filterSpacing = filterBoxW + 20;
  let filtersStartX = brainX - filterSpacing;

  if (showFilters) {
    // Draw vertical line from Brain Processing down
    stroke('mediumpurple');
    strokeWeight(2);
    let branchTopY = pipelineY + boxH;
    let branchMidY = branchTopY + 25;
    line(brainX, branchTopY, brainX, branchMidY);

    // Horizontal line spanning all filters
    let leftFilterX = filtersStartX;
    let rightFilterX = filtersStartX + 2 * filterSpacing;
    line(leftFilterX, branchMidY, rightFilterX, branchMidY);

    // Draw filter boxes
    for (let i = 0; i < 3; i++) {
      let fx = filtersStartX + i * filterSpacing;
      let fbx = fx - filterBoxW / 2;
      let fby = filterY;

      // Vertical line down to filter box
      stroke('mediumpurple');
      strokeWeight(2);
      line(fx, branchMidY, fx, fby);

      // Check hover
      if (mouseX >= fbx && mouseX <= fbx + filterBoxW && mouseY >= fby && mouseY <= fby + filterBoxH) {
        hoveredFilter = i;
      }

      // Filter box
      fill(filterColors[i]);
      stroke('gray');
      strokeWeight(1.5);
      rect(fbx, fby, filterBoxW, filterBoxH, 8);

      // Label
      noStroke();
      fill('black');
      textSize(11);
      textStyle(BOLD);
      text(filterLabels[i], fx, fby + 16);
      textStyle(NORMAL);
      textSize(8);
      fill('dimgray');
      text(data.filters[filterKeys[i]], fx, fby + 35, filterBoxW - 8, 28);
    }

    // "Filters Active" label
    noStroke();
    fill('mediumpurple');
    textSize(11);
    textStyle(BOLD);
    text("Cognitive Filters", brainX, pipelineY + boxH + 14);
    textStyle(NORMAL);
  }

  // Outcome box
  let outcomeY = showFilters ? filterY + filterBoxH + 45 : pipelineY + boxH + 60;
  let outcomeW = min(canvasWidth - 80, 500);
  let outcomeX = canvasWidth / 2;
  let outcomeH = 50;
  let outcomeText = showFilters ? data.withFilters : data.withoutFilters;
  let outcomeColor = showFilters ? 'mediumpurple' : 'steelblue';
  let outcomeLabel = showFilters ? "Perceived Reality (with filters):" : "Physical Reality (without filters):";

  fill('white');
  stroke(outcomeColor);
  strokeWeight(2);
  rect(outcomeX - outcomeW / 2, outcomeY, outcomeW, outcomeH, 10);

  noStroke();
  fill(outcomeColor);
  textSize(11);
  textStyle(BOLD);
  text(outcomeLabel, outcomeX, outcomeY + 14);
  textStyle(NORMAL);
  fill('black');
  textSize(12);
  text(outcomeText, outcomeX, outcomeY + 35);

  // Hover tooltip for stages
  if (hoveredStage >= 0) {
    drawTooltip(mouseX, mouseY, stageLabels[hoveredStage] + ": " + data.stages[hoveredStage]);
  }

  // Hover tooltip for filters
  if (hoveredFilter >= 0) {
    drawTooltip(mouseX, mouseY, filterLabels[hoveredFilter] + ": " + data.filters[filterKeys[hoveredFilter]]);
  }

  // Control area background
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  fill('black');
  textSize(12);
  text("Controls: Use the dropdown to select an example and the checkbox to toggle cognitive filters.", canvasWidth / 2, drawHeight + 30);
}

function drawTooltip(tx, ty, msg) {
  let tw = textWidth(msg) + 20;
  let th = 28;
  // Keep tooltip on canvas
  let ttx = constrain(tx + 10, 5, canvasWidth - tw - 5);
  let tty = constrain(ty - 35, 5, drawHeight - th - 5);

  fill(255, 255, 240);
  stroke('gray');
  strokeWeight(1);
  rect(ttx, tty, tw, th, 5);
  noStroke();
  fill('black');
  textSize(11);
  textAlign(CENTER, CENTER);
  text(msg, ttx + tw / 2, tty + th / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
