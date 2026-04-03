// Art as Knowledge Concept Map
// CANVAS_HEIGHT: 465

// Global variables
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 45;
let canvasHeight = 465;
let margin = 25;
let defaultTextSize = 16;

// Branch data
let branches = [
  {name: "Experiential\nKnowledge", explanation: "Art provides vicarious experiences, allowing us to understand perspectives and situations we haven't lived through personally.",
   examples: {
     "Visual Arts": ["War photography", "Documentary film"],
     "Literature": ["Novels about refugees", "Historical fiction"],
     "Music": ["Protest songs", "National anthems"],
     "Performing Arts": ["Immersive theatre", "Dance depicting grief"]
   }},
  {name: "Perceptual\nKnowledge", explanation: "Art trains our senses to notice details, patterns, and beauty that we might otherwise overlook in everyday life.",
   examples: {
     "Visual Arts": ["Impressionist light studies", "Abstract color theory"],
     "Literature": ["Haiku nature poetry", "Sensory-rich prose"],
     "Music": ["Tonal color in orchestration", "Rhythm and silence"],
     "Performing Arts": ["Physical awareness in dance", "Vocal modulation"]
   }},
  {name: "Moral\nKnowledge", explanation: "Art confronts us with ethical dilemmas and human suffering, developing empathy and moral imagination beyond abstract principles.",
   examples: {
     "Visual Arts": ["Guernica (Picasso)", "Protest murals"],
     "Literature": ["To Kill a Mockingbird", "Dystopian fiction"],
     "Music": ["Spirituals and freedom songs", "Anti-war anthems"],
     "Performing Arts": ["Forum theatre", "Verbatim theatre"]
   }},
  {name: "Self-\nKnowledge", explanation: "Art serves as a mirror for self-reflection, helping us understand our own emotions, values, and identity through creative expression.",
   examples: {
     "Visual Arts": ["Self-portraits", "Art therapy"],
     "Literature": ["Memoir and autobiography", "Journaling"],
     "Music": ["Songwriting as expression", "Personal playlists"],
     "Performing Arts": ["Method acting", "Dance improvisation"]
   }}
];

// State
let selectedBranch = -1;
let hoveredNode = null; // {type: 'center'|'branch'|'leaf', index, leafIndex}
let artFormSelect;

// Node positions (computed in draw)
let centerX, centerY, centerR;
let branchPositions = [];
let leafPositions = [];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  artFormSelect = createSelect();
  artFormSelect.parent(document.querySelector('main'));
  artFormSelect.option('Visual Arts');
  artFormSelect.option('Literature');
  artFormSelect.option('Music');
  artFormSelect.option('Performing Arts');
  artFormSelect.selected('Visual Arts');
  artFormSelect.style('font-size', '14px');

  describe('Interactive concept map showing four types of knowledge that art produces: experiential, perceptual, moral, and self-knowledge, with example leaf nodes that change based on selected art form.');
}

function draw() {
  updateCanvasSize();

  // Draw area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textSize(18);
  textAlign(CENTER, TOP);
  text('Art as a Source of Knowledge', canvasWidth / 2, 8);

  // Compute layout
  computeLayout();

  // Detect hover
  detectHover();

  // Draw connections first (behind nodes)
  drawConnections();

  // Draw leaf nodes
  drawLeafNodes();

  // Draw branch nodes
  drawBranchNodes();

  // Draw central node
  drawCenterNode();

  // Draw tooltip
  drawTooltip();

  // Control label and positioning
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Art Form:', margin, drawHeight + controlHeight / 2);

  artFormSelect.position(canvasPositionX() + margin + 70, canvasPositionY() + drawHeight + 10);
}

function computeLayout() {
  centerX = canvasWidth / 2;
  centerY = drawHeight / 2 + 10;
  centerR = 42;

  let branchR = min(canvasWidth, drawHeight) * 0.27;
  let leafR = min(canvasWidth, drawHeight) * 0.44;
  let artForm = artFormSelect.value();

  // Angles: top, right, bottom, left
  let angles = [-HALF_PI, 0, HALF_PI, PI];

  branchPositions = [];
  leafPositions = [];

  for (let i = 0; i < 4; i++) {
    let angle = angles[i];
    let bx = centerX + cos(angle) * branchR;
    let by = centerY + sin(angle) * branchR;
    branchPositions.push({x: bx, y: by, r: 34});

    let exs = branches[i].examples[artForm];
    let numLeaves = exs.length;
    let leafGroup = [];
    let spreadAngle = PI / 5;

    for (let j = 0; j < numLeaves; j++) {
      let leafAngle = angle - spreadAngle / 2 + (spreadAngle / (numLeaves - 1 || 1)) * j;
      if (numLeaves === 1) leafAngle = angle;
      let lx = centerX + cos(leafAngle) * leafR;
      let ly = centerY + sin(leafAngle) * leafR;
      leafGroup.push({x: lx, y: ly, r: 26, name: exs[j]});
    }
    leafPositions.push(leafGroup);
  }
}

function drawConnections() {
  for (let i = 0; i < 4; i++) {
    let bp = branchPositions[i];
    let isHighlighted = (selectedBranch === i);

    // Center to branch
    if (isHighlighted) {
      stroke('goldenrod');
      strokeWeight(3);
    } else {
      stroke(180);
      strokeWeight(2);
    }
    line(centerX, centerY, bp.x, bp.y);

    // Branch to leaves
    for (let j = 0; j < leafPositions[i].length; j++) {
      let lp = leafPositions[i][j];
      if (isHighlighted) {
        stroke('teal');
        strokeWeight(2.5);
      } else {
        stroke(200);
        strokeWeight(1.5);
      }
      line(bp.x, bp.y, lp.x, lp.y);
    }
  }
}

function drawCenterNode() {
  let isHovered = hoveredNode && hoveredNode.type === 'center';

  // Glow if hovered
  if (isHovered) {
    noStroke();
    fill(255, 215, 0, 60);
    ellipse(centerX, centerY, centerR * 2 + 12, centerR * 2 + 12);
  }

  // Gold circle
  fill('gold');
  stroke('goldenrod');
  strokeWeight(2);
  ellipse(centerX, centerY, centerR * 2, centerR * 2);

  // Text
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, CENTER);
  text('Art as\nKnowledge', centerX, centerY);
}

function drawBranchNodes() {
  for (let i = 0; i < 4; i++) {
    let bp = branchPositions[i];
    let isHovered = hoveredNode && hoveredNode.type === 'branch' && hoveredNode.index === i;
    let isSelected = (selectedBranch === i);

    // Glow if hovered
    if (isHovered) {
      noStroke();
      fill(0, 128, 128, 50);
      ellipse(bp.x, bp.y, bp.r * 2 + 10, bp.r * 2 + 10);
    }

    // Teal circle
    fill('teal');
    if (isSelected) {
      stroke('darkslategray');
      strokeWeight(3);
    } else {
      stroke('darkslategray');
      strokeWeight(1.5);
    }
    ellipse(bp.x, bp.y, bp.r * 2, bp.r * 2);

    // Text
    noStroke();
    fill('white');
    textSize(10);
    textAlign(CENTER, CENTER);
    text(branches[i].name, bp.x, bp.y);
  }
}

function drawLeafNodes() {
  for (let i = 0; i < 4; i++) {
    let isHighlighted = (selectedBranch === i);
    for (let j = 0; j < leafPositions[i].length; j++) {
      let lp = leafPositions[i][j];
      let isHovered = hoveredNode && hoveredNode.type === 'leaf' && hoveredNode.index === i && hoveredNode.leafIndex === j;

      // Glow if hovered
      if (isHovered) {
        noStroke();
        fill(255, 253, 208, 120);
        ellipse(lp.x, lp.y, lp.r * 2 + 8, lp.r * 2 + 8);
      }

      // Cream circle
      if (isHighlighted) {
        fill('cornsilk');
        stroke('goldenrod');
        strokeWeight(2);
      } else {
        fill('cornsilk');
        stroke('tan');
        strokeWeight(1);
      }
      ellipse(lp.x, lp.y, lp.r * 2, lp.r * 2);

      // Text
      noStroke();
      fill('black');
      textSize(8);
      textAlign(CENTER, CENTER);
      // Wrap long names
      let name = lp.name;
      if (name.length > 14) {
        let mid = name.lastIndexOf(' ', 14);
        if (mid === -1) mid = 14;
        name = name.substring(0, mid) + '\n' + name.substring(mid + 1);
      }
      text(name, lp.x, lp.y);
    }
  }
}

function detectHover() {
  hoveredNode = null;

  // Check center
  if (dist(mouseX, mouseY, centerX, centerY) < centerR) {
    hoveredNode = {type: 'center'};
    return;
  }

  // Check branches
  for (let i = 0; i < 4; i++) {
    let bp = branchPositions[i];
    if (dist(mouseX, mouseY, bp.x, bp.y) < bp.r) {
      hoveredNode = {type: 'branch', index: i};
      return;
    }
  }

  // Check leaves
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < leafPositions[i].length; j++) {
      let lp = leafPositions[i][j];
      if (dist(mouseX, mouseY, lp.x, lp.y) < lp.r) {
        hoveredNode = {type: 'leaf', index: i, leafIndex: j};
        return;
      }
    }
  }
}

function drawTooltip() {
  if (!hoveredNode) return;

  let tipText = '';
  if (hoveredNode.type === 'center') {
    tipText = 'Art produces multiple forms of knowledge beyond factual information. It engages emotion, perception, and imagination as ways of knowing.';
  } else if (hoveredNode.type === 'branch') {
    tipText = branches[hoveredNode.index].explanation;
  } else if (hoveredNode.type === 'leaf') {
    let artForm = artFormSelect.value();
    let branchName = branches[hoveredNode.index].name.replace('\n', ' ');
    let leafName = leafPositions[hoveredNode.index][hoveredNode.leafIndex].name;
    tipText = '"' + leafName + '" is an example of ' + branchName.toLowerCase() + ' gained through ' + artForm.toLowerCase() + '.';
  }

  if (tipText === '') return;

  // Tooltip dimensions
  textSize(11);
  let tipW = min(canvasWidth - 20, 260);
  let lines = wrapText(tipText, tipW - 16);
  let tipH = lines.length * 15 + 14;

  // Position tooltip near mouse but keep on canvas
  let tx = mouseX + 12;
  let ty = mouseY - tipH - 8;
  if (tx + tipW > canvasWidth - 5) tx = mouseX - tipW - 12;
  if (ty < 5) ty = mouseY + 18;
  if (tx < 5) tx = 5;

  // Draw tooltip background
  fill(255, 255, 255, 240);
  stroke(100);
  strokeWeight(1);
  rect(tx, ty, tipW, tipH, 6);

  // Draw text
  noStroke();
  fill('black');
  textSize(11);
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx + 8, ty + 7 + i * 15);
  }
}

function wrapText(txt, maxW) {
  let words = txt.split(' ');
  let lines = [];
  let currentLine = '';

  for (let w of words) {
    let testLine = currentLine === '' ? w : currentLine + ' ' + w;
    if (textWidth(testLine) > maxW && currentLine !== '') {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine !== '') lines.push(currentLine);
  return lines;
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  // Check branches for click to highlight path
  for (let i = 0; i < 4; i++) {
    let bp = branchPositions[i];
    if (dist(mouseX, mouseY, bp.x, bp.y) < bp.r) {
      selectedBranch = (selectedBranch === i) ? -1 : i;
      return;
    }
  }

  // Check leaves - select parent branch
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < leafPositions[i].length; j++) {
      let lp = leafPositions[i][j];
      if (dist(mouseX, mouseY, lp.x, lp.y) < lp.r) {
        selectedBranch = (selectedBranch === i) ? -1 : i;
        return;
      }
    }
  }

  // Check center node
  if (dist(mouseX, mouseY, centerX, centerY) < centerR) {
    selectedBranch = -1;
    return;
  }

  // Click on empty space deselects
  selectedBranch = -1;
}

function canvasPositionX() {
  let c = document.querySelector('main canvas');
  if (c) return c.getBoundingClientRect().left + window.scrollX;
  return 0;
}

function canvasPositionY() {
  let c = document.querySelector('main canvas');
  if (c) return c.getBoundingClientRect().top + window.scrollY;
  return 0;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = mainEl.getBoundingClientRect().width;
  }
  if (canvasWidth < 350) canvasWidth = 350;
  canvasHeight = drawHeight + controlHeight;
}
