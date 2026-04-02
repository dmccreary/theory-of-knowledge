// Debunking vs Prebunking Network Simulation - Misinformation spread with interventions
// CANVAS_HEIGHT: 560

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let defaultTextSize = 14;

// Node and edge data
let nodes = [];
let edges = [];
const NUM_NODES = 50;
const TARGET_EDGES = 100;

// State
let spreading = false;
let spreadTimer = 0;
let timelineProgress = 0;
let simulationDone = false;

// Controls
let startButton, debunkButton, prebunkButton, resetButton;
let coverageSlider, speedSlider;
let coverageLabel, speedLabel;

// Colors
const COLOR_ACCURATE = [0, 128, 128];      // teal
const COLOR_MISINFORMED = [255, 127, 80];   // coral
const COLOR_INOCULATED = [218, 165, 32];    // goldenrod/amber
const COLOR_CORRECTED = [70, 130, 180];     // steelblue

// Physics
const REPULSION = 800;
const ATTRACTION = 0.005;
const DAMPING = 0.85;
const IDEAL_EDGE_LEN = 80;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Helvetica');

  initNetwork();
  settlePhysics(200);
  createControls();

  describe('Network simulation showing how misinformation spreads through a social network, comparing debunking and prebunking strategies.');
}

function draw() {
  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Minimal ongoing physics to keep layout stable
  if (spreading) {
    applyPhysics();
  }

  // Spread misinformation
  if (spreading && !simulationDone) {
    spreadTimer++;
    let spd = speedSlider.value();
    if (spreadTimer % max(1, 11 - spd) === 0) {
      spreadMisinformation();
      timelineProgress = min(timelineProgress + 0.5, 100);
    }
    // Check if spread is done (no more can be infected)
    if (!canSpreadMore()) {
      simulationDone = true;
    }
  }

  // Draw edges
  stroke(200);
  strokeWeight(1);
  for (let e of edges) {
    let a = nodes[e.a];
    let b = nodes[e.b];
    // Highlight edges where misinformation traveled
    if ((a.state === 'misinformed' || a.state === 'corrected') &&
        (b.state === 'misinformed' || b.state === 'corrected')) {
      stroke(255, 180, 180);
      strokeWeight(1.5);
    } else {
      stroke(210);
      strokeWeight(0.8);
    }
    line(a.x, a.y, b.x, b.y);
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    let col = getNodeColor(n);

    // Pulse effect for source node
    if (i === 0 && spreading && n.state === 'misinformed') {
      let pulse = sin(frameCount * 0.1) * 3 + 3;
      noStroke();
      fill(col[0], col[1], col[2], 80);
      ellipse(n.x, n.y, 22 + pulse, 22 + pulse);
    }

    noStroke();
    fill(col[0], col[1], col[2]);
    ellipse(n.x, n.y, 14, 14);

    // Outline for inoculated
    if (n.state === 'inoculated') {
      stroke(COLOR_INOCULATED[0], COLOR_INOCULATED[1], COLOR_INOCULATED[2]);
      strokeWeight(2);
      noFill();
      ellipse(n.x, n.y, 18, 18);
    }
  }

  // Draw counters at top
  drawCounters();

  // Draw timeline bar
  drawTimeline();

  // Draw legend
  drawLegend();

  // Update control labels
  coverageLabel.html('Prebunk Coverage: ' + coverageSlider.value() + '%');
  speedLabel.html('Spread Speed: ' + speedSlider.value());
}

function drawCounters() {
  let counts = { accurate: 0, misinformed: 0, inoculated: 0, corrected: 0 };
  for (let n of nodes) counts[n.state]++;

  let pcts = {};
  for (let k in counts) pcts[k] = round(counts[k] / NUM_NODES * 100);

  noStroke();
  fill(0);
  textSize(12);
  textAlign(LEFT, TOP);

  let y = 10;
  let x = 10;
  let spacing = canvasWidth / 4;

  // Accurate
  fill(COLOR_ACCURATE[0], COLOR_ACCURATE[1], COLOR_ACCURATE[2]);
  ellipse(x + 6, y + 8, 10, 10);
  noStroke();
  fill(60);
  textSize(11);
  text('Accurate: ' + pcts.accurate + '%', x + 16, y);

  // Misinformed
  x += spacing;
  fill(COLOR_MISINFORMED[0], COLOR_MISINFORMED[1], COLOR_MISINFORMED[2]);
  noStroke();
  ellipse(x + 6, y + 8, 10, 10);
  fill(60);
  text('Misinfo: ' + pcts.misinformed + '%', x + 16, y);

  // Inoculated
  x += spacing;
  fill(COLOR_INOCULATED[0], COLOR_INOCULATED[1], COLOR_INOCULATED[2]);
  noStroke();
  ellipse(x + 6, y + 8, 10, 10);
  fill(60);
  text('Inoculated: ' + pcts.inoculated + '%', x + 16, y);

  // Corrected
  x += spacing;
  fill(COLOR_CORRECTED[0], COLOR_CORRECTED[1], COLOR_CORRECTED[2]);
  noStroke();
  ellipse(x + 6, y + 8, 10, 10);
  fill(60);
  text('Corrected: ' + pcts.corrected + '%', x + 16, y);
}

function drawTimeline() {
  let barY = drawHeight - 20;
  let barH = 8;
  let barX = 40;
  let barW = canvasWidth - 80;

  noStroke();
  fill(220);
  rect(barX, barY, barW, barH, 4);

  // Misinformed portion
  let counts = { accurate: 0, misinformed: 0, inoculated: 0, corrected: 0 };
  for (let n of nodes) counts[n.state]++;
  let misinfoPct = counts.misinformed / NUM_NODES;
  let correctedPct = counts.corrected / NUM_NODES;
  let inocPct = counts.inoculated / NUM_NODES;

  // Stacked bar
  let cx = barX;
  if (counts.accurate > 0) {
    fill(COLOR_ACCURATE[0], COLOR_ACCURATE[1], COLOR_ACCURATE[2]);
    let w = (counts.accurate / NUM_NODES) * barW;
    rect(cx, barY, w, barH, cx === barX ? 4 : 0, 0, 0, cx === barX ? 4 : 0);
    cx += w;
  }
  if (counts.inoculated > 0) {
    fill(COLOR_INOCULATED[0], COLOR_INOCULATED[1], COLOR_INOCULATED[2]);
    rect(cx, barY, inocPct * barW, barH);
    cx += inocPct * barW;
  }
  if (counts.corrected > 0) {
    fill(COLOR_CORRECTED[0], COLOR_CORRECTED[1], COLOR_CORRECTED[2]);
    rect(cx, barY, correctedPct * barW, barH);
    cx += correctedPct * barW;
  }
  if (counts.misinformed > 0) {
    fill(COLOR_MISINFORMED[0], COLOR_MISINFORMED[1], COLOR_MISINFORMED[2]);
    let w = misinfoPct * barW;
    rect(cx, barY, w, barH, 0, 4, 4, 0);
  }

  noStroke();
  fill(100);
  textSize(10);
  textAlign(CENTER, TOP);
  text('Population Distribution', canvasWidth / 2, barY + 11);
}

function drawLegend() {
  let lx = 10;
  let ly = drawHeight - 48;
  noStroke();
  fill(100);
  textSize(10);
  textAlign(LEFT, CENTER);

  let items = [
    { label: 'Source', col: COLOR_MISINFORMED, pulse: true },
  ];

  if (!spreading && !simulationDone) {
    fill(120);
    textSize(10);
    textAlign(CENTER, CENTER);
    text('Press "Start Spread" to begin the simulation', canvasWidth / 2, ly);
  }
}

function getNodeColor(n) {
  switch (n.state) {
    case 'accurate': return COLOR_ACCURATE;
    case 'misinformed': return COLOR_MISINFORMED;
    case 'inoculated': return COLOR_INOCULATED;
    case 'corrected': return COLOR_CORRECTED;
    default: return COLOR_ACCURATE;
  }
}

function initNetwork() {
  nodes = [];
  edges = [];

  let margin = 40;
  let areaW = canvasWidth - margin * 2;
  let areaH = drawHeight - margin * 2 - 30;

  // Generate nodes in random positions
  for (let i = 0; i < NUM_NODES; i++) {
    nodes.push({
      x: margin + random(areaW),
      y: margin + 30 + random(areaH),
      vx: 0,
      vy: 0,
      state: 'accurate',
      infectedTime: -1
    });
  }

  // Generate edges based on proximity
  let distPairs = [];
  for (let i = 0; i < NUM_NODES; i++) {
    for (let j = i + 1; j < NUM_NODES; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      distPairs.push({ a: i, b: j, d: d });
    }
  }
  distPairs.sort((a, b) => a.d - b.d);

  // Take closest pairs, ensuring min connectivity
  let edgeSet = new Set();
  let degree = new Array(NUM_NODES).fill(0);

  // First ensure every node has at least 1 edge
  for (let i = 0; i < NUM_NODES; i++) {
    if (degree[i] === 0) {
      let bestJ = -1;
      let bestD = Infinity;
      for (let j = 0; j < NUM_NODES; j++) {
        if (i === j) continue;
        let key = min(i, j) + '-' + max(i, j);
        if (edgeSet.has(key)) continue;
        let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < bestD) { bestD = d; bestJ = j; }
      }
      if (bestJ >= 0) {
        let key = min(i, bestJ) + '-' + max(i, bestJ);
        edgeSet.add(key);
        edges.push({ a: min(i, bestJ), b: max(i, bestJ) });
        degree[i]++;
        degree[bestJ]++;
      }
    }
  }

  // Add more edges from sorted proximity list
  for (let pair of distPairs) {
    if (edges.length >= TARGET_EDGES) break;
    let key = pair.a + '-' + pair.b;
    if (edgeSet.has(key)) continue;
    if (degree[pair.a] > 6 || degree[pair.b] > 6) continue;
    edgeSet.add(key);
    edges.push({ a: pair.a, b: pair.b });
    degree[pair.a]++;
    degree[pair.b]++;
  }
}

function settlePhysics(iterations) {
  for (let iter = 0; iter < iterations; iter++) {
    applyPhysics();
  }
  // Zero velocities
  for (let n of nodes) { n.vx = 0; n.vy = 0; }
}

function applyPhysics() {
  let margin = 35;

  // Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[j].x - nodes[i].x;
      let dy = nodes[j].y - nodes[i].y;
      let d = max(1, sqrt(dx * dx + dy * dy));
      let force = REPULSION / (d * d);
      let fx = (dx / d) * force;
      let fy = (dy / d) * force;
      nodes[i].vx -= fx;
      nodes[i].vy -= fy;
      nodes[j].vx += fx;
      nodes[j].vy += fy;
    }
  }

  // Attraction along edges
  for (let e of edges) {
    let a = nodes[e.a];
    let b = nodes[e.b];
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let d = max(1, sqrt(dx * dx + dy * dy));
    let force = (d - IDEAL_EDGE_LEN) * ATTRACTION;
    let fx = (dx / d) * force;
    let fy = (dy / d) * force;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // Update positions
  for (let n of nodes) {
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx;
    n.y += n.vy;
    // Constrain to draw area
    n.x = constrain(n.x, margin, canvasWidth - margin);
    n.y = constrain(n.y, margin + 25, drawHeight - 55);
  }
}

function spreadMisinformation() {
  let newInfections = [];

  for (let e of edges) {
    let a = nodes[e.a];
    let b = nodes[e.b];

    // Spread from misinformed to accurate or inoculated
    if (a.state === 'misinformed' && (b.state === 'accurate' || b.state === 'inoculated')) {
      let chance = 0.08;
      if (b.state === 'inoculated') chance *= 0.1; // 90% resistance
      if (random() < chance) {
        newInfections.push(e.b);
      }
    }
    if (b.state === 'misinformed' && (a.state === 'accurate' || a.state === 'inoculated')) {
      let chance = 0.08;
      if (a.state === 'inoculated') chance *= 0.1;
      if (random() < chance) {
        newInfections.push(e.a);
      }
    }
  }

  for (let idx of newInfections) {
    nodes[idx].state = 'misinformed';
    nodes[idx].infectedTime = frameCount;
  }
}

function canSpreadMore() {
  for (let e of edges) {
    let a = nodes[e.a];
    let b = nodes[e.b];
    if (a.state === 'misinformed' && (b.state === 'accurate' || b.state === 'inoculated')) return true;
    if (b.state === 'misinformed' && (a.state === 'accurate' || a.state === 'inoculated')) return true;
  }
  return false;
}

function getNeighbors(idx) {
  let neighbors = [];
  for (let e of edges) {
    if (e.a === idx) neighbors.push(e.b);
    if (e.b === idx) neighbors.push(e.a);
  }
  return neighbors;
}

function doDebunk() {
  // Find misinformed nodes
  let misinformed = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].state === 'misinformed') misinformed.push(i);
  }
  if (misinformed.length === 0) return;

  // Pick a random misinformed node
  let target = random(misinformed);
  target = floor(target);
  nodes[target].state = 'corrected';

  // 50% chance to correct each neighbor
  let neighbors = getNeighbors(target);
  for (let ni of neighbors) {
    if (nodes[ni].state === 'misinformed' && random() < 0.5) {
      nodes[ni].state = 'corrected';
    }
  }
}

function doPrebunk() {
  if (spreading) return; // Can only prebunk before spread starts
  let coverage = coverageSlider.value() / 100;
  let accurateNodes = [];
  for (let i = 0; i < nodes.length; i++) {
    if (i === 0) continue; // Don't inoculate source
    if (nodes[i].state === 'accurate') accurateNodes.push(i);
  }
  // Inoculate the specified percentage
  let numToInoculate = floor(accurateNodes.length * coverage);
  shuffle(accurateNodes, true);
  for (let i = 0; i < numToInoculate; i++) {
    nodes[accurateNodes[i]].state = 'inoculated';
  }
}

function doStart() {
  if (spreading) return;
  spreading = true;
  simulationDone = false;
  nodes[0].state = 'misinformed';
  nodes[0].infectedTime = frameCount;
  startButton.attribute('disabled', '');
  prebunkButton.attribute('disabled', '');
}

function doReset() {
  spreading = false;
  simulationDone = false;
  spreadTimer = 0;
  timelineProgress = 0;

  initNetwork();
  settlePhysics(200);

  startButton.removeAttribute('disabled');
  prebunkButton.removeAttribute('disabled');
}

function createControls() {
  let yBase = drawHeight + 8;

  // Row 1: Buttons
  startButton = createButton('Start Spread');
  startButton.position(10, yBase);
  startButton.mousePressed(doStart);
  startButton.parent(document.querySelector('main'));

  debunkButton = createButton('Debunk');
  debunkButton.position(110, yBase);
  debunkButton.mousePressed(doDebunk);
  debunkButton.parent(document.querySelector('main'));

  prebunkButton = createButton('Prebunk');
  prebunkButton.position(185, yBase);
  prebunkButton.mousePressed(doPrebunk);
  prebunkButton.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.position(260, yBase);
  resetButton.mousePressed(doReset);
  resetButton.parent(document.querySelector('main'));

  // Row 2: Prebunk coverage slider
  let yRow2 = yBase + 32;
  coverageLabel = createSpan('Prebunk Coverage: 30%');
  coverageLabel.position(10, yRow2);
  coverageLabel.style('font-size', '13px');
  coverageLabel.parent(document.querySelector('main'));

  coverageSlider = createSlider(0, 100, 30, 5);
  coverageSlider.position(175, yRow2);
  coverageSlider.style('width', '150px');
  coverageSlider.parent(document.querySelector('main'));

  // Row 3: Speed slider
  let yRow3 = yRow2 + 32;
  speedLabel = createSpan('Spread Speed: 5');
  speedLabel.position(10, yRow3);
  speedLabel.style('font-size', '13px');
  speedLabel.parent(document.querySelector('main'));

  speedSlider = createSlider(1, 10, 5, 1);
  speedSlider.position(175, yRow3);
  speedSlider.style('width', '150px');
  speedSlider.parent(document.querySelector('main'));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  // Reconstrain nodes
  for (let n of nodes) {
    n.x = constrain(n.x, 35, canvasWidth - 35);
  }
}

function updateCanvasSize() {
  const main = document.querySelector('main');
  if (main) {
    containerWidth = main.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = containerWidth;
}
