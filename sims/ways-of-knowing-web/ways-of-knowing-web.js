// Ways of Knowing Interactive Web Diagram
// Analyze (L4): 5 WoK nodes connected in a web
// Click node for description, hover connection for interaction, dropdown for scenarios

let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let CANVAS_HEIGHT = 510;
let margin = 40;

let woks = [
  {name:"Sense\nPerception", color:"teal", desc:"Knowledge through the five senses — sight, hearing, touch, taste, smell. The most direct way we interact with the world."},
  {name:"Emotion", color:"coral", desc:"Knowledge through feelings — fear, joy, empathy, disgust. Emotions can reveal truths that reason misses."},
  {name:"Intuition", color:"goldenrod", desc:"Knowledge through immediate insight without conscious reasoning. The 'gut feeling' that experts develop."},
  {name:"Memory", color:"steelblue", desc:"Knowledge stored from past experience. Memory is reconstructive, not a perfect recording."},
  {name:"Imagination", color:"mediumpurple", desc:"Knowledge through creative mental construction. Enables thought experiments and empathy."}
];

let connections = [
  {from:0, to:1, label:"What we perceive triggers emotions"},
  {from:0, to:3, label:"Perception creates memories"},
  {from:0, to:4, label:"Perception feeds imagination"},
  {from:1, to:2, label:"Emotions inform intuitive judgments"},
  {from:1, to:3, label:"Emotional events create stronger memories"},
  {from:1, to:4, label:"Emotions fuel creative imagination"},
  {from:2, to:3, label:"Intuition draws on accumulated memories"},
  {from:2, to:4, label:"Imagination enables intuitive leaps"},
  {from:3, to:4, label:"Memory provides raw material for imagination"},
  {from:0, to:2, label:"Perceptual patterns build intuition"}
];

let scenarios = {
  "None": null,
  "Smelling freshly baked bread": {
    "Sense\nPerception":"Smell triggers recognition",
    "Emotion":"Comfort, nostalgia, warmth",
    "Intuition":"Instant sense of 'home'",
    "Memory":"Recalls childhood kitchen",
    "Imagination":"Imagines grandmother baking"
  },
  "Hearing a fire alarm": {
    "Sense\nPerception":"Loud sound detected",
    "Emotion":"Fear, urgency, anxiety",
    "Intuition":"Immediate sense of danger",
    "Memory":"Recalls fire safety training",
    "Imagination":"Imagines possible escape routes"
  },
  "Reading a poem": {
    "Sense\nPerception":"Visual processing of words",
    "Emotion":"Emotional response to imagery",
    "Intuition":"Sense of meaning beyond literal words",
    "Memory":"Connections to personal experiences",
    "Imagination":"Visualizing the scenes described"
  }
};

let nodePositions = [];
let nodeRadius = 42;
let selectedNode = -1;
let hoveredConnection = -1;
let scenarioSelect;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));

  textAlign(CENTER, CENTER);
  textFont('Arial');

  // Control area
  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  scenarioSelect.style('font-size', '14px');
  scenarioSelect.style('padding', '4px 8px');
  scenarioSelect.style('background', 'white');
  scenarioSelect.style('margin-top', '4px');
  for (let key of Object.keys(scenarios)) {
    scenarioSelect.option(key);
  }
  scenarioSelect.selected("None");

  calculateNodePositions();

  describe('Interactive web diagram showing five Ways of Knowing connected in a pentagon. Click nodes for descriptions and select scenarios from a dropdown to see how multiple Ways of Knowing interact.');
}

function calculateNodePositions() {
  nodePositions = [];
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2 - 10;
  let rx = min(canvasWidth, drawHeight) * 0.32;
  let ry = rx * 0.85;
  for (let i = 0; i < woks.length; i++) {
    let angle = -PI / 2 + (TWO_PI * i) / woks.length;
    nodePositions.push({
      x: cx + rx * cos(angle),
      y: cy + ry * sin(angle) + 10
    });
  }
}

function draw() {
  // Draw area background
  background('aliceblue');

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control label
  fill(30);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Scenario:", 10, drawHeight + 30);

  // Draw connections
  drawConnections();

  // Draw nodes
  drawNodes();

  // Draw info panel
  drawInfoPanel();
}

function drawConnections() {
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let p1 = nodePositions[c.from];
    let p2 = nodePositions[c.to];

    let isHovered = (i === hoveredConnection);
    let isActive = (selectedNode === c.from || selectedNode === c.to);

    if (isHovered) {
      stroke(50);
      strokeWeight(3.5);
    } else if (isActive) {
      stroke(80);
      strokeWeight(2.5);
    } else {
      stroke(180);
      strokeWeight(1.5);
    }
    line(p1.x, p1.y, p2.x, p2.y);

    // Show label on hover
    if (isHovered) {
      let mx = (p1.x + p2.x) / 2;
      let my = (p1.y + p2.y) / 2;
      noStroke();
      fill(255, 255, 255, 230);
      rectMode(CENTER);
      textSize(11);
      let tw = textWidth(c.label) + 14;
      rect(mx, my - 1, tw, 22, 6);
      fill(30);
      textAlign(CENTER, CENTER);
      text(c.label, mx, my);
      rectMode(CORNER);
    }
  }
}

function drawNodes() {
  let currentScenario = scenarioSelect.value();
  let scenarioData = scenarios[currentScenario];

  for (let i = 0; i < woks.length; i++) {
    let pos = nodePositions[i];
    let wok = woks[i];
    let isSelected = (i === selectedNode);

    // Glow for selected
    if (isSelected) {
      noStroke();
      fill(255, 255, 255, 100);
      ellipse(pos.x, pos.y, nodeRadius * 2.8);
    }

    // Node circle
    stroke(50);
    strokeWeight(isSelected ? 3 : 1.5);
    fill(wok.color);
    ellipse(pos.x, pos.y, nodeRadius * 2);

    // Node label
    noStroke();
    fill(255);
    textSize(11);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(wok.name, pos.x, pos.y);
    textStyle(NORMAL);

    // Show scenario role badge
    if (scenarioData && scenarioData[wok.name]) {
      noStroke();
      fill(255, 255, 255, 210);
      let role = scenarioData[wok.name];
      textSize(9);
      let bw = textWidth(role) + 10;
      let bx = pos.x;
      let by = pos.y + nodeRadius + 14;
      // Clamp horizontally
      bx = constrain(bx, bw / 2 + 4, canvasWidth - bw / 2 - 4);
      rectMode(CENTER);
      rect(bx, by, bw, 16, 4);
      fill(50);
      textAlign(CENTER, CENTER);
      text(role, bx, by);
      rectMode(CORNER);
    }
  }
}

function drawInfoPanel() {
  let currentScenario = scenarioSelect.value();
  let scenarioData = scenarios[currentScenario];

  if (selectedNode >= 0) {
    let wok = woks[selectedNode];
    let panelX = 10;
    let panelY = drawHeight - 90;
    let panelW = canvasWidth - 20;
    let panelH = 82;

    noStroke();
    fill(255, 255, 255, 230);
    rect(panelX, panelY, panelW, panelH, 8);

    fill(wok.color);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    noStroke();
    let displayName = wok.name.replace('\n', ' ');
    text(displayName, panelX + 10, panelY + 8);
    textStyle(NORMAL);

    fill(40);
    textSize(11);
    textAlign(LEFT, TOP);
    noStroke();
    textWrap(WORD);
    text(wok.desc, panelX + 10, panelY + 28, panelW - 20);

    // Scenario role
    if (scenarioData && scenarioData[wok.name]) {
      fill(wok.color);
      textSize(11);
      textStyle(ITALIC);
      noStroke();
      textAlign(LEFT, TOP);
      text("In this scenario: " + scenarioData[wok.name], panelX + 10, panelY + 62, panelW - 20);
      textStyle(NORMAL);
    }
  } else if (currentScenario !== "None") {
    // Show scenario overview
    let panelX = 10;
    let panelY = drawHeight - 60;
    let panelW = canvasWidth - 20;
    let panelH = 52;

    noStroke();
    fill(255, 255, 255, 220);
    rect(panelX, panelY, panelW, panelH, 8);

    fill(50);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    noStroke();
    text("Scenario: " + currentScenario, panelX + 10, panelY + 8);
    textStyle(NORMAL);

    fill(80);
    textSize(11);
    noStroke();
    text("Click a node to see its role in this scenario.", panelX + 10, panelY + 28);
  } else {
    // Default hint
    noStroke();
    fill(120);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Click a node to explore. Hover a connection for details.", canvasWidth / 2, drawHeight - 30);
  }
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  // Check node clicks
  let clicked = -1;
  for (let i = 0; i < nodePositions.length; i++) {
    let d = dist(mouseX, mouseY, nodePositions[i].x, nodePositions[i].y);
    if (d < nodeRadius) {
      clicked = i;
      break;
    }
  }

  if (clicked >= 0) {
    selectedNode = (selectedNode === clicked) ? -1 : clicked;
  } else {
    selectedNode = -1;
  }
}

function mouseMoved() {
  if (mouseY > drawHeight) {
    hoveredConnection = -1;
    return;
  }

  hoveredConnection = -1;
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let p1 = nodePositions[c.from];
    let p2 = nodePositions[c.to];
    let d = distToSegment(mouseX, mouseY, p1.x, p1.y, p2.x, p2.y);
    if (d < 8) {
      hoveredConnection = i;
      break;
    }
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);
  let t = constrain(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
  let projX = x1 + t * dx;
  let projY = y1 + t * dy;
  return dist(px, py, projX, projY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
  calculateNodePositions();
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : 400;
  if (canvasWidth < 300) canvasWidth = 300;
  if (canvasWidth > 900) canvasWidth = 900;
}
