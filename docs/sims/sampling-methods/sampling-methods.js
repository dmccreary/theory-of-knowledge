// Sampling Methods Visual Comparison MicroSim
// CANVAS_HEIGHT: 520, drawHeight: 440, controlHeight: 80

let canvasWidth = 400;
const CANVAS_HEIGHT = 520;
const DRAW_HEIGHT = 440;
const CONTROL_HEIGHT = 80;

let methodSelect;
let sampleBtn;
let resetBtn;

let dots = [];         // array of {x, y, group, selected}
let sampled = false;

const groupColors = ['teal', 'coral', 'orange', 'mediumpurple'];
const groupNames = ['Teal', 'Coral', 'Amber', 'Purple'];

const methods = {
  "Random Sampling": {
    desc: "Every member has equal probability of selection",
    strength: "Minimizes selection bias",
    weakness: "May miss subgroups by chance"
  },
  "Stratified Sampling": {
    desc: "Population divided into subgroups, sample from each",
    strength: "Ensures representation of all groups",
    weakness: "Requires knowing population structure"
  },
  "Convenience Sampling": {
    desc: "Selecting whoever is easily available",
    strength: "Fast and cheap",
    weakness: "High bias — not representative"
  },
  "Systematic Sampling": {
    desc: "Select every nth member from a list",
    strength: "Simple to implement, good spread",
    weakness: "Can miss patterns if list has periodicity"
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Build population: 10x10 grid, 25 of each color group
  buildPopulation();

  // Row 1 controls
  methodSelect = createSelect();
  methodSelect.parent(document.querySelector('main'));
  for (let key of Object.keys(methods)) {
    methodSelect.option(key);
  }
  methodSelect.style('font-size', '14px');
  methodSelect.style('padding', '4px');
  methodSelect.style('background', 'white');

  sampleBtn = createButton('Sample');
  sampleBtn.parent(document.querySelector('main'));
  sampleBtn.mousePressed(doSample);
  sampleBtn.style('font-size', '14px');
  sampleBtn.style('padding', '4px 12px');
  sampleBtn.style('margin-left', '8px');
  sampleBtn.style('background', 'white');

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(doReset);
  resetBtn.style('font-size', '14px');
  resetBtn.style('padding', '4px 12px');
  resetBtn.style('margin-left', '8px');
  resetBtn.style('background', 'white');

  describe('Visual comparison of four sampling methods on a population of 100 colored dots.');
}

function buildPopulation() {
  dots = [];
  // Assign groups: first 25 = group 0, next 25 = group 1, etc.
  // Then shuffle so colors are mixed in the grid
  let groups = [];
  for (let g = 0; g < 4; g++) {
    for (let i = 0; i < 25; i++) {
      groups.push(g);
    }
  }
  // Fisher-Yates shuffle
  for (let i = groups.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  for (let i = 0; i < 100; i++) {
    dots.push({
      row: Math.floor(i / 10),
      col: i % 10,
      group: groups[i],
      selected: false
    });
  }
}

function doSample() {
  // Clear previous selection
  for (let d of dots) d.selected = false;

  let method = methodSelect.value();
  let indices = [];

  if (method === "Random Sampling") {
    // Pick 20 random unique indices
    let pool = [...Array(100).keys()];
    for (let i = pool.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    indices = pool.slice(0, 20);

  } else if (method === "Stratified Sampling") {
    // 5 from each color group
    for (let g = 0; g < 4; g++) {
      let groupIndices = [];
      for (let i = 0; i < 100; i++) {
        if (dots[i].group === g) groupIndices.push(i);
      }
      // Shuffle group
      for (let i = groupIndices.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [groupIndices[i], groupIndices[j]] = [groupIndices[j], groupIndices[i]];
      }
      indices = indices.concat(groupIndices.slice(0, 5));
    }

  } else if (method === "Convenience Sampling") {
    // Top-left corner: first 20 in grid order (rows 0-1 all, or top-left block)
    // Take first 2 rows = 20 dots
    for (let i = 0; i < 20; i++) {
      indices.push(i);
    }

  } else if (method === "Systematic Sampling") {
    // Every 5th dot starting from index 0
    for (let i = 0; i < 100; i += 5) {
      indices.push(i);
    }
  }

  for (let idx of indices) {
    dots[idx].selected = true;
  }
  sampled = true;
}

function doReset() {
  for (let d of dots) d.selected = false;
  sampled = false;
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, DRAW_HEIGHT);

  // Control area background
  fill('silver');
  rect(0, DRAW_HEIGHT, canvasWidth, CONTROL_HEIGHT);

  // Title
  fill('black');
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text('Sampling Methods Comparison', canvasWidth / 2, 8);

  // Layout: population grid on left, bar chart on right
  let gridLeft = 20;
  let gridTop = 35;
  let gridSize = min(canvasWidth * 0.45, 220);
  let dotSpacing = gridSize / 10;
  let dotRadius = dotSpacing * 0.35;

  // Draw population grid
  noStroke();
  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill('black');
  text('Population (n=100)', gridLeft + gridSize / 2, gridTop - 2);

  for (let d of dots) {
    let cx = gridLeft + d.col * dotSpacing + dotSpacing / 2;
    let cy = gridTop + d.row * dotSpacing + dotSpacing / 2;

    if (d.selected) {
      // Draw highlight ring
      fill('black');
      noStroke();
      ellipse(cx, cy, dotRadius * 2 + 6, dotRadius * 2 + 6);
    }

    fill(groupColors[d.group]);
    noStroke();
    ellipse(cx, cy, dotRadius * 2, dotRadius * 2);

    if (!d.selected && sampled) {
      // Dim unselected dots
      fill(240, 240, 245, 160);
      noStroke();
      ellipse(cx, cy, dotRadius * 2, dotRadius * 2);
    }
  }

  // Draw convenience sampling region hint
  if (methodSelect.value() === "Convenience Sampling" && sampled) {
    noFill();
    stroke('red');
    strokeWeight(2);
    rect(gridLeft - 2, gridTop - 2, dotSpacing * 10 + 4, dotSpacing * 2 + 4, 4);
    noStroke();
  }

  // Draw systematic sampling indicator
  if (methodSelect.value() === "Systematic Sampling" && sampled) {
    noFill();
    stroke('red');
    strokeWeight(1);
    for (let d of dots) {
      if (d.selected) {
        let cx = gridLeft + d.col * dotSpacing + dotSpacing / 2;
        let cy = gridTop + d.row * dotSpacing + dotSpacing / 2;
        noFill();
        ellipse(cx, cy, dotRadius * 2 + 8, dotRadius * 2 + 8);
      }
    }
    noStroke();
  }

  // Bar chart on the right
  let chartLeft = gridLeft + gridSize + 40;
  let chartTop = gridTop + 10;
  let chartWidth = canvasWidth - chartLeft - 20;
  let chartHeight = gridSize - 20;
  let barMaxHeight = chartHeight - 30;

  noStroke();
  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill('black');
  text('Sample Composition', chartLeft + chartWidth / 2, chartTop - 2);

  // Count selected per group
  let counts = [0, 0, 0, 0];
  let totalSelected = 0;
  for (let d of dots) {
    if (d.selected) {
      counts[d.group]++;
      totalSelected++;
    }
  }

  let maxCount = max(max(counts), 1);
  // Scale bars so max reaches barMaxHeight, but cap at reasonable value
  let barScale = barMaxHeight / max(maxCount, 8);
  let barWidth = (chartWidth - 20) / 4;
  let barGap = 4;

  // Draw y-axis baseline
  stroke(180);
  strokeWeight(1);
  line(chartLeft, chartTop + barMaxHeight, chartLeft + chartWidth, chartTop + barMaxHeight);
  noStroke();

  // Draw ideal line for stratified (5 each)
  if (sampled) {
    stroke(100);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    let idealY = chartTop + barMaxHeight - 5 * barScale;
    line(chartLeft, idealY, chartLeft + chartWidth, idealY);
    drawingContext.setLineDash([]);
    noStroke();
    fill(100);
    textSize(9);
    textAlign(LEFT, CENTER);
    text('ideal=5', chartLeft + chartWidth - 30, idealY - 7);
  }

  for (let g = 0; g < 4; g++) {
    let bx = chartLeft + 10 + g * barWidth;
    let bh = counts[g] * barScale;
    let by = chartTop + barMaxHeight - bh;

    fill(groupColors[g]);
    noStroke();
    rect(bx + barGap / 2, by, barWidth - barGap, bh, 3, 3, 0, 0);

    // Count label
    if (sampled) {
      fill('black');
      textSize(11);
      textAlign(CENTER, BOTTOM);
      text(counts[g], bx + barWidth / 2, by - 2);
    }

    // Color label
    fill(100);
    textSize(9);
    textAlign(CENTER, TOP);
    text(groupNames[g], bx + barWidth / 2, chartTop + barMaxHeight + 4);
  }

  // Total selected label
  if (sampled) {
    fill('black');
    noStroke();
    textSize(11);
    textAlign(CENTER, TOP);
    text('Total selected: ' + totalSelected + ' / 100', chartLeft + chartWidth / 2, chartTop + barMaxHeight + 22);
  }

  // Description panel in bottom draw area
  let descY = gridTop + gridSize + 18;
  let method = methodSelect.value();
  let info = methods[method];

  fill('white');
  noStroke();
  rect(12, descY, canvasWidth - 24, DRAW_HEIGHT - descY - 8, 6);

  fill('black');
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(method, 20, descY + 8);

  textStyle(NORMAL);
  textSize(11);
  fill(60);
  let lineY = descY + 26;
  text(info.desc, 20, lineY, canvasWidth - 44);
  lineY += 32;

  fill('green');
  textStyle(BOLD);
  text('Strength: ', 20, lineY);
  fill(60);
  textStyle(NORMAL);
  text(info.strength, 88, lineY, canvasWidth - 100);
  lineY += 20;

  fill('red');
  textStyle(BOLD);
  text('Weakness: ', 20, lineY);
  fill(60);
  textStyle(NORMAL);
  text(info.weakness, 92, lineY, canvasWidth - 104);

  // Legend at bottom of draw area
  let legY = DRAW_HEIGHT - 22;
  textSize(10);
  textAlign(LEFT, CENTER);
  let legX = 20;
  for (let g = 0; g < 4; g++) {
    fill(groupColors[g]);
    noStroke();
    ellipse(legX + 5, legY, 10, 10);
    fill(80);
    text('Group ' + (g + 1), legX + 14, legY);
    legX += 75;
  }
}

function updateCanvasSize() {
  const main = document.querySelector('main');
  if (main) {
    canvasWidth = max(main.offsetWidth, 380);
  } else {
    canvasWidth = max(windowWidth, 380);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}
