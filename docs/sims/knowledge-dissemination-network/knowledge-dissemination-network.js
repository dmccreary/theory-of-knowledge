// Knowledge Dissemination Network MicroSim
// Shows how reliability changes along academic, media, and informal pathways

let canvasWidth = 400;
const CANVAS_HEIGHT = 510;
const drawHeight = 450;
const controlHeight = 60;

let pathways = {
  "Academic": {
    color: "teal",
    nodes: ["Research Lab", "Peer Review", "Journal", "University", "Textbook"],
    reliability: [90, 95, 92, 88, 85],
    desc: "Slow but high reliability — multiple verification stages"
  },
  "Media": {
    color: "goldenrod",
    nodes: ["Discovery", "Press Release", "News Article", "Social Media", "Public"],
    reliability: [90, 75, 60, 40, 30],
    desc: "Fast but decreasing reliability — each stage may distort"
  },
  "Informal": {
    color: "coral",
    nodes: ["Personal Experience", "Conversation", "Social Post", "Viral Share", "Urban Legend"],
    reliability: [70, 50, 30, 15, 5],
    desc: "Very fast but low reliability — no verification stages"
  }
};

let pathwayNames = ["All", "Academic", "Media", "Informal"];
let pathwaySelector;
let animateBtn;
let animating = false;
let animDot = 0; // 0 to 1 progress along pathway
let hoveredNode = null; // {pathway, index}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Controls row
  let controlY = drawHeight + 10;

  // Pathway selector
  pathwaySelector = createSelect();
  pathwaySelector.parent(document.querySelector('main'));
  for (let name of pathwayNames) {
    pathwaySelector.option(name);
  }
  pathwaySelector.selected("All");
  pathwaySelector.style('font-size', '14px');
  pathwaySelector.style('padding', '4px 8px');
  pathwaySelector.style('background', 'white');

  // Animate button
  animateBtn = createButton('Animate Flow');
  animateBtn.parent(document.querySelector('main'));
  animateBtn.style('font-size', '14px');
  animateBtn.style('padding', '4px 12px');
  animateBtn.style('background', 'white');
  animateBtn.style('cursor', 'pointer');
  animateBtn.mousePressed(toggleAnimate);

  describe('Network diagram showing knowledge dissemination pathways with reliability scores along academic, media, and informal channels.');
}

function toggleAnimate() {
  animating = !animating;
  if (animating) {
    animDot = 0;
    animateBtn.html('Stop');
  } else {
    animateBtn.html('Animate Flow');
  }
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  let selected = pathwaySelector.value();

  // Title
  fill('black');
  noStroke();
  textSize(16);
  textAlign(CENTER, TOP);
  text("Knowledge Dissemination Pathways", canvasWidth / 2, 10);

  // Layout parameters
  let marginLeft = 80;
  let marginRight = 40;
  let pathwayStartY = 60;
  let pathwaySpacing = 130;
  let pathwayKeys = ["Academic", "Media", "Informal"];

  hoveredNode = null;

  for (let p = 0; p < pathwayKeys.length; p++) {
    let key = pathwayKeys[p];
    let pw = pathways[key];
    let baseY = pathwayStartY + p * pathwaySpacing;
    let dimmed = (selected !== "All" && selected !== key);
    let alphaVal = dimmed ? 60 : 255;

    // Pathway label
    noStroke();
    fill(dimmed ? color(150) : color(pw.color));
    textSize(13);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(key, 6, baseY + 10);
    textStyle(NORMAL);

    // Node positions
    let nodeCount = pw.nodes.length;
    let usableWidth = canvasWidth - marginLeft - marginRight;
    let nodePositions = [];

    for (let i = 0; i < nodeCount; i++) {
      let x = marginLeft + (i / (nodeCount - 1)) * usableWidth;
      let y = baseY + 10;
      nodePositions.push({ x: x, y: y });
    }

    // Draw connecting lines with arrows
    for (let i = 0; i < nodeCount - 1; i++) {
      let x1 = nodePositions[i].x;
      let y1 = nodePositions[i].y;
      let x2 = nodePositions[i + 1].x;
      let y2 = nodePositions[i + 1].y;

      let r1 = map(pw.reliability[i], 0, 100, 10, 28);
      let r2 = map(pw.reliability[i + 1], 0, 100, 10, 28);

      // Line from edge of node1 to edge of node2
      let lineStartX = x1 + r1;
      let lineEndX = x2 - r2;

      let lineColor = dimmed ? color(200) : color(pw.color);
      stroke(lineColor);
      strokeWeight(2);
      line(lineStartX, y1, lineEndX, y2);

      // Arrowhead
      let arrowSize = 8;
      let angle = atan2(y2 - y1, lineEndX - lineStartX);
      noStroke();
      fill(lineColor);
      push();
      translate(lineEndX, y2);
      rotate(angle);
      triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
      pop();
    }

    // Draw nodes
    for (let i = 0; i < nodeCount; i++) {
      let x = nodePositions[i].x;
      let y = nodePositions[i].y;
      let rel = pw.reliability[i];
      let r = map(rel, 0, 100, 10, 28);

      // Check hover
      let d = dist(mouseX, mouseY, x, y);
      let isHovered = (d < r + 4);
      if (isHovered && !dimmed) {
        hoveredNode = { pathway: key, index: i };
      }

      // Node circle
      let nodeColor = dimmed ? color(200) : color(pw.color);
      if (isHovered && !dimmed) {
        fill(255);
        stroke(nodeColor);
        strokeWeight(3);
      } else {
        noStroke();
        fill(nodeColor);
      }
      ellipse(x, y, r * 2, r * 2);

      // Reliability number inside node
      noStroke();
      fill(isHovered && !dimmed ? color(pw.color) : color('white'));
      textSize(10);
      textAlign(CENTER, CENTER);
      text(rel + "%", x, y);

      // Node label below
      noStroke();
      fill(dimmed ? color(180) : color(40));
      textSize(9);
      textAlign(CENTER, TOP);
      let label = pw.nodes[i];
      // Word wrap for long labels
      let words = label.split(' ');
      if (words.length > 1) {
        text(words[0], x, y + r + 4);
        text(words.slice(1).join(' '), x, y + r + 15);
      } else {
        text(label, x, y + r + 4);
      }
    }

    // Animated dot along pathway
    if (animating && (selected === "All" || selected === key)) {
      let totalSegments = nodeCount - 1;
      let segFloat = animDot * totalSegments;
      let segIndex = floor(segFloat);
      if (segIndex >= totalSegments) segIndex = totalSegments - 1;
      let segT = segFloat - segIndex;

      let x1 = nodePositions[segIndex].x;
      let y1 = nodePositions[segIndex].y;
      let x2 = nodePositions[min(segIndex + 1, nodeCount - 1)].x;
      let y2 = nodePositions[min(segIndex + 1, nodeCount - 1)].y;

      let dotX = lerp(x1, y1 === y2 ? x2 : x2, segT);
      let dotY = lerp(y1, y2, segT);

      // Glowing dot
      noStroke();
      let dotColor = color(pw.color);
      fill(red(dotColor), green(dotColor), blue(dotColor), 100);
      ellipse(dotX, dotY, 24, 24);
      fill(dotColor);
      ellipse(dotX, dotY, 12, 12);
      fill(255);
      ellipse(dotX, dotY, 5, 5);
    }

    // Pathway description text
    noStroke();
    fill(dimmed ? color(180) : color(80));
    textSize(9);
    textAlign(LEFT, TOP);
    text(pw.desc, marginLeft, baseY + 55);
  }

  // Advance animation
  if (animating) {
    animDot += 0.005;
    if (animDot > 1) animDot = 0;
  }

  // Reliability legend
  let legendX = canvasWidth - 135;
  let legendY = drawHeight - 38;
  noStroke();
  fill(240, 240, 240, 220);
  rect(legendX - 8, legendY - 14, 140, 34, 6);
  fill(80);
  textSize(9);
  textAlign(LEFT, CENTER);
  text("Node size = reliability %", legendX, legendY);
  // Small and large example
  fill('gray');
  ellipse(legendX + 8, legendY + 14, 10, 10);
  fill(80);
  textSize(8);
  textAlign(LEFT, CENTER);
  text("Low", legendX + 18, legendY + 14);
  fill('gray');
  ellipse(legendX + 60, legendY + 14, 22, 22);
  fill(80);
  text("High", legendX + 76, legendY + 14);

  // Hover tooltip
  if (hoveredNode) {
    let pw = pathways[hoveredNode.pathway];
    let idx = hoveredNode.index;
    let tooltipText = pw.nodes[idx] + " — Reliability: " + pw.reliability[idx] + "%";

    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    let tw = textWidth(tooltipText) + 16;
    let tx = mouseX + 12;
    let ty = mouseY - 30;
    if (tx + tw > canvasWidth) tx = mouseX - tw - 4;
    if (ty < 0) ty = mouseY + 16;

    fill(0, 0, 0, 200);
    rect(tx, ty, tw, 24, 4);
    fill(255);
    text(tooltipText, tx + 8, ty + 5);
  }

  // Control labels
  noStroke();
  fill(40);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Pathway:", 10, drawHeight + 30);

  // Position controls
  pathwaySelector.position(
    pathwaySelector.parent().offsetLeft + 76,
    pathwaySelector.parent().offsetTop + drawHeight + 16
  );
  animateBtn.position(
    pathwaySelector.x + pathwaySelector.width + 14,
    pathwaySelector.parent().offsetTop + drawHeight + 16
  );
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = max(500, mainEl.offsetWidth);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}
