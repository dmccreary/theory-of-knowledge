// TOK Themes Interaction - Interactive Concept Map
// CANVAS_HEIGHT: 510

let containerWidth;
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let defaultTextSize = 14;

// Controls
let exampleSelect;

// State
let selectedNode = -1;
let hoveredConnection = -1;
let showExample = false;

// Data
let themes = [
  {name:"Knowledge &\nthe Knower", color:"teal", desc:"How identity, culture, emotion, and experience shape what we know"},
  {name:"Knowledge &\nLanguage", color:"goldenrod", desc:"How language enables and constrains knowledge through meaning, translation, and rhetoric"},
  {name:"Knowledge &\nTechnology", color:"steelblue", desc:"How tools, algorithms, and AI shape knowledge production and access"},
  {name:"Knowledge &\nPolitics", color:"coral", desc:"How power, authority, and institutions determine whose knowledge counts"}
];

let connections = [
  {from:0, to:1, label:"Language shapes the knower's worldview"},
  {from:0, to:2, label:"Technology mediates how the knower accesses information"},
  {from:0, to:3, label:"Power structures influence whose knowledge is valued"},
  {from:1, to:2, label:"Technology transforms how language spreads"},
  {from:1, to:3, label:"Political rhetoric uses language to control narratives"},
  {from:2, to:3, label:"Technology concentrates or distributes power over knowledge"}
];

let examples = {
  "Select an example...": null,
  "COVID-19 Pandemic": {
    knower:"Personal experience of illness shaped belief in the virus",
    language:"Scientific terminology vs everyday understanding created confusion",
    technology:"Social media amplified both accurate info and misinformation",
    politics:"Government trust influenced vaccine acceptance"
  },
  "Climate Change": {
    knower:"Geographic location shapes personal experience of climate effects",
    language:"Framing as 'global warming' vs 'climate crisis' shifts urgency",
    technology:"Climate models enable prediction but also create false precision",
    politics:"Fossil fuel industry funds doubt-producing research"
  },
  "AI in Education": {
    knower:"Students' digital fluency shapes how they learn",
    language:"AI-generated text blurs authorship and originality",
    technology:"ChatGPT transforms knowledge production and assessment",
    politics:"Access to AI tools creates new inequalities"
  }
};

// Node positions (computed in updateNodePositions)
let nodeX = [];
let nodeY = [];
let nodeRadius = 50;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  exampleSelect = createSelect();
  exampleSelect.parent(document.querySelector('main'));
  for (let name of Object.keys(examples)) {
    exampleSelect.option(name);
  }
  exampleSelect.style('font-size', '14px');
  exampleSelect.style('padding', '4px 8px');
  exampleSelect.style('background', 'white');
  exampleSelect.changed(onExampleChanged);

  updateNodePositions();
  describe('Interactive concept map showing 4 TOK themes arranged in a diamond with connection lines between all pairs. Click a theme node to see its description. Select an example from the dropdown to see how all 4 themes apply.');
}

function updateNodePositions() {
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2 - 10;
  let rx = min(canvasWidth * 0.32, 160);
  let ry = min(drawHeight * 0.30, 140);
  // Diamond: top, right, bottom, left
  nodeX = [cx, cx + rx, cx, cx - rx];
  nodeY = [cy - ry, cy, cy + ry, cy];
}

function onExampleChanged() {
  let val = exampleSelect.value();
  showExample = (val !== "Select an example...");
  selectedNode = -1;
}

function draw() {
  background('aliceblue');

  // Draw area
  push();

  // Title
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text("TOK Themes Interaction Map", canvasWidth / 2, 10);
  textStyle(NORMAL);

  // Draw connections
  drawConnections();

  // Draw nodes
  drawNodes();

  // Draw info panel
  drawInfoPanel();

  pop();

  // Control area background
  fill('silver');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control label
  fill(30);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Example:", 10, drawHeight + controlHeight / 2);
}

function drawConnections() {
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let x1 = nodeX[c.from];
    let y1 = nodeY[c.from];
    let x2 = nodeX[c.to];
    let y2 = nodeY[c.to];

    let isHovered = (i === hoveredConnection);
    let isRelatedToSelected = (selectedNode >= 0 && (c.from === selectedNode || c.to === selectedNode));

    // Draw line
    if (isHovered || isRelatedToSelected) {
      stroke(60);
      strokeWeight(3);
    } else {
      stroke(160);
      strokeWeight(1.5);
    }
    line(x1, y1, x2, y2);

    // Draw connection label on hover
    if (isHovered) {
      let mx = (x1 + x2) / 2;
      let my = (y1 + y2) / 2;
      noStroke();
      fill(255, 255, 255, 220);
      rectMode(CENTER);
      let tw = textWidth(c.label) + 16;
      textSize(12);
      tw = textWidth(c.label) + 16;
      rect(mx, my - 12, tw, 24, 6);
      fill(40);
      textAlign(CENTER, CENTER);
      text(c.label, mx, my - 12);
      rectMode(CORNER);
    }
  }
}

function drawNodes() {
  for (let i = 0; i < themes.length; i++) {
    let t = themes[i];
    let x = nodeX[i];
    let y = nodeY[i];
    let isSelected = (i === selectedNode);
    let isHovered = distToNode(mouseX, mouseY, i) < nodeRadius;

    // Shadow
    noStroke();
    fill(0, 0, 0, 30);
    ellipse(x + 3, y + 3, nodeRadius * 2);

    // Node circle
    if (isSelected) {
      stroke(40);
      strokeWeight(3);
    } else if (isHovered) {
      stroke(80);
      strokeWeight(2);
    } else {
      stroke(255, 255, 255, 180);
      strokeWeight(2);
    }
    fill(t.color);
    ellipse(x, y, nodeRadius * 2);

    // Node label
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(t.name, x, y);
    textStyle(NORMAL);
  }
}

function drawInfoPanel() {
  let panelY = 36;
  let panelX = canvasWidth / 2;

  if (showExample) {
    drawExamplePanel();
    return;
  }

  if (selectedNode >= 0) {
    let t = themes[selectedNode];
    // Description panel at top center
    noStroke();
    fill(255, 255, 255, 230);
    rectMode(CENTER);
    let pw = min(canvasWidth - 40, 300);
    rect(panelX, panelY + 20, pw, 42, 8);
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(12);
    let descText = t.desc;
    text(descText, panelX - pw/2 + 10, panelY + 6, pw - 20, 30);
    rectMode(CORNER);
  } else if (hoveredConnection < 0) {
    // Instruction text
    noStroke();
    fill(120);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("Click a theme node for its description.\nHover a connection line for interaction details.", canvasWidth / 2, drawHeight - 20);
  }
}

function drawExamplePanel() {
  let val = exampleSelect.value();
  let ex = examples[val];
  if (!ex) return;

  // Draw a semi-transparent overlay panel
  noStroke();
  fill(255, 255, 255, 235);
  rectMode(CENTER);
  let pw = min(canvasWidth - 30, 340);
  let ph = 160;
  let px = canvasWidth / 2;
  let py = drawHeight / 2;
  rect(px, py, pw, ph, 10);

  // Title
  fill(40);
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  text(val, px, py - ph/2 + 8);
  textStyle(NORMAL);

  // Four theme entries
  let entries = [
    {icon: "Knower", color: "teal", txt: ex.knower},
    {icon: "Language", color: "goldenrod", txt: ex.language},
    {icon: "Technology", color: "steelblue", txt: ex.technology},
    {icon: "Politics", color: "coral", txt: ex.politics}
  ];

  let startY = py - ph/2 + 30;
  let lineH = 30;
  textAlign(LEFT, TOP);
  textSize(11);

  for (let j = 0; j < entries.length; j++) {
    let e = entries[j];
    let ey = startY + j * lineH;

    // Color dot
    fill(e.color);
    noStroke();
    ellipse(px - pw/2 + 14, ey + 8, 10);

    // Label
    fill(40);
    textStyle(BOLD);
    noStroke();
    text(e.icon + ":", px - pw/2 + 24, ey);
    textStyle(NORMAL);

    let labelW = textWidth(e.icon + ": ");
    fill(60);
    noStroke();
    text(e.txt, px - pw/2 + 24 + labelW, ey, pw - 44 - labelW, lineH);
  }

  rectMode(CORNER);
}

function mousePressed() {
  // Check if clicking on a node
  for (let i = 0; i < themes.length; i++) {
    if (distToNode(mouseX, mouseY, i) < nodeRadius) {
      selectedNode = (selectedNode === i) ? -1 : i;
      showExample = false;
      exampleSelect.value("Select an example...");
      return;
    }
  }
  // Click on empty space deselects
  if (mouseY < drawHeight) {
    selectedNode = -1;
  }
}

function mouseMoved() {
  hoveredConnection = -1;
  if (mouseY > drawHeight) return;

  // Check if hovering near a connection line
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let d = distToLine(mouseX, mouseY, nodeX[c.from], nodeY[c.from], nodeX[c.to], nodeY[c.to]);
    if (d < 8) {
      // Make sure we're not hovering over a node
      let overNode = false;
      for (let j = 0; j < themes.length; j++) {
        if (distToNode(mouseX, mouseY, j) < nodeRadius) {
          overNode = true;
          break;
        }
      }
      if (!overNode) {
        hoveredConnection = i;
        break;
      }
    }
  }
}

function distToNode(mx, my, idx) {
  return dist(mx, my, nodeX[idx], nodeY[idx]);
}

function distToLine(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = constrain(t, 0, 1);
  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;
  return dist(px, py, closestX, closestY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  updateNodePositions();
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = mainEl ? mainEl.offsetWidth : windowWidth;
  canvasWidth = containerWidth;
}
