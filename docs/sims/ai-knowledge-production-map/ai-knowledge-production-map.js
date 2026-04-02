// AI Knowledge Production Map
// CANVAS_HEIGHT: 480

// Global variables
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = 480;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Pipeline data
let stages = [
  {name: "Data Collection", apps: [
    {name: "Web Scraping", oversight: "minimal", aok: "Human Sciences"},
    {name: "Satellite Imaging", oversight: "moderate", aok: "Natural Sciences"},
    {name: "Sensor Networks", oversight: "high", aok: "Natural Sciences"}
  ]},
  {name: "Data Processing", apps: [
    {name: "NLP Parsing", oversight: "minimal", aok: "Human Sciences"},
    {name: "Image Recognition", oversight: "moderate", aok: "Arts"},
    {name: "Data Cleaning", oversight: "moderate", aok: "Natural Sciences"}
  ]},
  {name: "Analysis", apps: [
    {name: "Pattern Detection", oversight: "minimal", aok: "Natural Sciences"},
    {name: "Statistical Modeling", oversight: "moderate", aok: "Human Sciences"},
    {name: "Sentiment Analysis", oversight: "minimal", aok: "Human Sciences"}
  ]},
  {name: "Interpretation", apps: [
    {name: "Recommendation Systems", oversight: "minimal", aok: "Human Sciences"},
    {name: "Diagnostic AI", oversight: "high", aok: "Natural Sciences"},
    {name: "Creative AI", oversight: "moderate", aok: "Arts"}
  ]},
  {name: "Dissemination", apps: [
    {name: "Content Curation", oversight: "minimal", aok: "Human Sciences"},
    {name: "Translation AI", oversight: "moderate", aok: "Human Sciences"},
    {name: "Search Ranking", oversight: "minimal", aok: "Human Sciences"}
  ]}
];

// Oversight color mapping
let oversightColors = {
  high: "teal",
  moderate: "orange",
  minimal: "coral"
};

let oversightValues = {
  high: 3,
  moderate: 2,
  minimal: 1
};

// State
let currentStage = -1; // -1 means show all
let selectedNode = null;
let selectedNodeInfo = null;

// Controls
let prevButton, nextButton, aokSelect, oversightSlider;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Row 1 controls
  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.mousePressed(goPrevious);
  prevButton.style('font-size', '14px');
  prevButton.style('margin-right', '6px');

  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(goNext);
  nextButton.style('font-size', '14px');
  nextButton.style('margin-right', '10px');

  aokSelect = createSelect();
  aokSelect.parent(document.querySelector('main'));
  aokSelect.option('All AOKs');
  aokSelect.option('Human Sciences');
  aokSelect.option('Natural Sciences');
  aokSelect.option('Arts');
  aokSelect.selected('All AOKs');
  aokSelect.style('font-size', '14px');

  // Row 2 - slider
  oversightSlider = createSlider(0, 3, 0, 1);
  oversightSlider.parent(document.querySelector('main'));
  oversightSlider.style('width', '150px');

  describe('Interactive concept map showing AI involvement across five stages of knowledge production, color-coded by human oversight level.');
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
  text('AI in Knowledge Production', canvasWidth / 2, 8);

  // Get filter values
  let aokFilter = aokSelect.value();
  let oversightThreshold = oversightSlider.value();

  // Draw pipeline
  drawPipeline(aokFilter, oversightThreshold);

  // Draw info panel if node selected
  if (selectedNodeInfo) {
    drawInfoPanel();
  }

  // Draw legend
  drawLegend();

  // Draw control labels
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Oversight: ' + getThresholdLabel(oversightThreshold), margin, drawHeight + 52);

  // Position controls
  let row1Y = drawHeight + 10;
  prevButton.position(canvasPositionX() + margin, canvasPositionY() + row1Y);
  nextButton.position(canvasPositionX() + margin + 78, canvasPositionY() + row1Y);
  aokSelect.position(canvasPositionX() + margin + 145, canvasPositionY() + row1Y);

  let row2Y = drawHeight + 44;
  oversightSlider.position(canvasPositionX() + sliderLeftMargin, canvasPositionY() + row2Y);
}

function getThresholdLabel(val) {
  if (val === 0) return 'All';
  if (val === 1) return 'Minimal+';
  if (val === 2) return 'Moderate+';
  return 'High only';
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

function drawPipeline(aokFilter, oversightThreshold) {
  let numStages = stages.length;
  let stageW = (canvasWidth - margin * 2) / numStages;
  let stageBoxW = stageW * 0.85;
  let stageY = 55;
  let stageH = 40;

  for (let i = 0; i < numStages; i++) {
    let stage = stages[i];
    let cx = margin + stageW * i + stageW / 2;
    let isActive = (currentStage === -1 || currentStage === i);
    let stageAlpha = isActive ? 255 : 60;

    // Draw arrow to next stage
    if (i < numStages - 1) {
      let nextCx = margin + stageW * (i + 1) + stageW / 2;
      stroke(180);
      strokeWeight(2);
      let arrowStartX = cx + stageBoxW / 2 + 2;
      let arrowEndX = nextCx - stageBoxW / 2 - 2;
      line(arrowStartX, stageY + stageH / 2, arrowEndX, stageY + stageH / 2);
      // Arrowhead
      let ax = arrowEndX;
      let ay = stageY + stageH / 2;
      fill(180);
      noStroke();
      triangle(ax, ay, ax - 6, ay - 4, ax - 6, ay + 4);
    }

    // Stage box
    if (isActive) {
      fill(70, 130, 180);
    } else {
      fill(70, 130, 180, stageAlpha);
    }
    stroke(50, 100, 150);
    strokeWeight(1);
    rectMode(CENTER);
    rect(cx, stageY + stageH / 2, stageBoxW, stageH, 8);
    rectMode(CORNER);

    // Stage label
    noStroke();
    if (isActive) {
      fill('white');
    } else {
      fill(255, 255, 255, stageAlpha);
    }
    textSize(11);
    textAlign(CENTER, CENTER);
    text(stage.name, cx, stageY + stageH / 2);

    // Draw app nodes below
    let nodeStartY = stageY + stageH + 25;
    let nodeSpacing = 65;

    for (let j = 0; j < stage.apps.length; j++) {
      let app = stage.apps[j];
      let nodeY = nodeStartY + j * nodeSpacing;
      let nodeW = stageBoxW * 0.95;
      let nodeH = 45;

      // Check filters
      let aokMatch = (aokFilter === 'All AOKs' || app.aok === aokFilter);
      let oversightMatch = oversightValues[app.oversight] >= oversightThreshold;
      let visible = aokMatch && oversightMatch && isActive;

      // Draw connecting line from stage to node
      if (visible) {
        stroke(200);
        strokeWeight(1);
        line(cx, stageY + stageH, cx, nodeY - nodeH / 2);
      }

      if (visible) {
        // Node background color by oversight
        let c = oversightColors[app.oversight];
        if (c === 'teal') fill(0, 128, 128);
        else if (c === 'orange') fill(218, 165, 32);
        else fill(255, 127, 80);

        stroke(100);
        strokeWeight(1);
        rectMode(CENTER);

        // Highlight selected node
        if (selectedNode && selectedNode.stage === i && selectedNode.app === j) {
          strokeWeight(3);
          stroke(0);
        }

        rect(cx, nodeY, nodeW, nodeH, 6);
        rectMode(CORNER);

        // Node text
        noStroke();
        fill('white');
        textSize(10);
        textAlign(CENTER, CENTER);
        text(app.name, cx, nodeY - 7);
        textSize(8);
        fill(255, 255, 255, 200);
        text(app.aok, cx, nodeY + 7);
        textSize(7);
        text('Oversight: ' + app.oversight, cx, nodeY + 17);
      } else {
        // Draw dimmed placeholder
        fill(220, 220, 220, 80);
        noStroke();
        rectMode(CENTER);
        rect(cx, nodeY, nodeW, nodeH, 6);
        rectMode(CORNER);
      }
    }
  }
}

function drawInfoPanel() {
  let panelW = canvasWidth - margin * 4;
  let panelH = 55;
  let panelX = margin * 2;
  let panelY = drawHeight - panelH - 35;

  // Panel background
  fill(255, 255, 255, 240);
  stroke(100);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 8);

  // Panel text
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  text(selectedNodeInfo.name, panelX + 10, panelY + 6);
  textSize(10);
  fill(80);
  text('AOK: ' + selectedNodeInfo.aok + '  |  Oversight: ' + selectedNodeInfo.oversight, panelX + 10, panelY + 22);
  textSize(9);
  fill(60);
  text(selectedNodeInfo.description, panelX + 10, panelY + 37, panelW - 20, panelH - 40);
}

function drawLegend() {
  let legendY = drawHeight - 28;
  let legendX = margin;

  noStroke();
  textSize(9);
  textAlign(LEFT, CENTER);

  // High oversight - teal
  fill(0, 128, 128);
  ellipse(legendX + 5, legendY, 10, 10);
  fill('black');
  text('High oversight', legendX + 14, legendY);

  // Moderate - amber
  let offset1 = 100;
  fill(218, 165, 32);
  noStroke();
  ellipse(legendX + offset1 + 5, legendY, 10, 10);
  fill('black');
  text('Moderate', legendX + offset1 + 14, legendY);

  // Minimal - coral
  let offset2 = 175;
  fill(255, 127, 80);
  noStroke();
  ellipse(legendX + offset2 + 5, legendY, 10, 10);
  fill('black');
  text('Minimal', legendX + offset2 + 14, legendY);

  // Stage indicator
  if (currentStage >= 0) {
    textSize(10);
    fill(70, 130, 180);
    textAlign(RIGHT, CENTER);
    text('Stage ' + (currentStage + 1) + ' of 5', canvasWidth - margin, legendY);
  } else {
    textSize(10);
    fill(100);
    textAlign(RIGHT, CENTER);
    text('All stages', canvasWidth - margin, legendY);
  }
}

function getNodeDescription(name) {
  let descriptions = {
    "Web Scraping": "AI bots automatically collect data from websites, often without editorial oversight.",
    "Satellite Imaging": "AI processes satellite imagery for environmental monitoring and geographic analysis.",
    "Sensor Networks": "IoT sensors with AI collect real-time environmental data under human-designed protocols.",
    "NLP Parsing": "Natural Language Processing extracts structured data from unstructured text automatically.",
    "Image Recognition": "AI classifies and tags visual content, used in art curation and medical imaging.",
    "Data Cleaning": "AI identifies and corrects errors in datasets under researcher supervision.",
    "Pattern Detection": "AI finds correlations and patterns in large datasets that humans might miss.",
    "Statistical Modeling": "AI builds predictive models from data with moderate human parameter guidance.",
    "Sentiment Analysis": "AI gauges public opinion from text data, often with limited human validation.",
    "Recommendation Systems": "AI curates what information users see, shaping knowledge access with minimal oversight.",
    "Diagnostic AI": "AI assists medical and scientific diagnosis with high human expert verification.",
    "Creative AI": "AI generates art, music, and text with moderate human creative direction.",
    "Content Curation": "AI algorithms select and prioritize news and content with minimal human editing.",
    "Translation AI": "AI translates between languages with moderate accuracy and cultural sensitivity.",
    "Search Ranking": "AI determines what information appears first in search results with minimal transparency."
  };
  return descriptions[name] || "An AI application in the knowledge production pipeline.";
}

function mousePressed() {
  if (mouseY > drawHeight) return;

  let numStages = stages.length;
  let stageW = (canvasWidth - margin * 2) / numStages;
  let stageBoxW = stageW * 0.85;
  let stageY = 55;
  let stageH = 40;
  let nodeStartY = stageY + stageH + 25;
  let nodeSpacing = 65;

  let aokFilter = aokSelect.value();
  let oversightThreshold = oversightSlider.value();

  let clicked = false;

  for (let i = 0; i < numStages; i++) {
    let cx = margin + stageW * i + stageW / 2;
    let isActive = (currentStage === -1 || currentStage === i);

    for (let j = 0; j < stages[i].apps.length; j++) {
      let app = stages[i].apps[j];
      let nodeY = nodeStartY + j * nodeSpacing;
      let nodeW = stageBoxW * 0.95;
      let nodeH = 45;

      let aokMatch = (aokFilter === 'All AOKs' || app.aok === aokFilter);
      let oversightMatch = oversightValues[app.oversight] >= oversightThreshold;
      let visible = aokMatch && oversightMatch && isActive;

      if (visible &&
          mouseX > cx - nodeW / 2 && mouseX < cx + nodeW / 2 &&
          mouseY > nodeY - nodeH / 2 && mouseY < nodeY + nodeH / 2) {
        selectedNode = {stage: i, app: j};
        selectedNodeInfo = {
          name: app.name,
          aok: app.aok,
          oversight: app.oversight,
          description: getNodeDescription(app.name)
        };
        clicked = true;
      }
    }
  }

  if (!clicked) {
    selectedNode = null;
    selectedNodeInfo = null;
  }
}

function goPrevious() {
  if (currentStage === -1) {
    currentStage = stages.length - 1;
  } else if (currentStage === 0) {
    currentStage = -1;
  } else {
    currentStage--;
  }
  selectedNode = null;
  selectedNodeInfo = null;
}

function goNext() {
  if (currentStage === -1) {
    currentStage = 0;
  } else if (currentStage === stages.length - 1) {
    currentStage = -1;
  } else {
    currentStage++;
  }
  selectedNode = null;
  selectedNodeInfo = null;
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
