// Knowledge Framework AOK Matrix MicroSim
// CANVAS_HEIGHT: 560
// Interactive matrix comparing 8 AOKs across 4 Knowledge Framework dimensions.
// Bloom's Level 4: Analyze. Click cell for details. Dropdown to highlight AOK row.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = 560;
let margin = 10;

// Controls
let aokSelect;

// State
let selectedCell = null;   // {row, col} or null
let tooltipAlpha = 0;
let tooltipTarget = 0;

// Data
let aoks = [
  "Mathematics", "Natural Sciences", "Human Sciences", "History",
  "The Arts", "Ethics", "Indigenous Knowledge", "Religious Knowledge"
];

let dimensions = ["Scope", "Methods", "Key Concepts", "Historical Development"];

// Short labels for cells
let cellLabels = {
  "Mathematics":          ["Abstract formal systems", "Deductive proof, axioms", "Certainty, proof, abstraction", "Euclid to Gödel to computation"],
  "Natural Sciences":     ["Physical natural world", "Scientific method, experiment", "Falsifiability, paradigm", "Aristotle to Newton to Einstein"],
  "Human Sciences":       ["Human behavior, society", "Surveys, case studies, stats", "Observer effect, correlation", "Durkheim to behaviorism to mixed"],
  "History":              ["Past human events", "Source analysis, narrative", "Evidence, revisionism", "Herodotus to Ranke to postmodern"],
  "The Arts":             ["Aesthetic experience", "Creation, interpretation", "Intent, reception, beauty", "Classical to modern to conceptual"],
  "Ethics":               ["Moral questions", "Reasoning, thought experiments", "Duty, consequences, virtue", "Aristotle to Kant to Singer"],
  "Indigenous Knowledge": ["Holistic understanding", "Oral tradition, observation", "Connection to land, story", "Ancient to colonial disruption to revival"],
  "Religious Knowledge":  ["Transcendent questions", "Revelation, faith, reason", "Sacred texts, authority", "Ancient texts to reformation to interfaith"]
};

// Expanded descriptions for tooltip
let cellDetails = {
  "Mathematics": [
    "Mathematics deals with abstract formal systems — numbers, structures, spaces, and logical relationships that exist independently of the physical world.",
    "Mathematicians use deductive proof from axioms and definitions. Unlike empirical sciences, conclusions follow necessarily from premises.",
    "Key concepts include certainty (proofs are conclusive), abstraction (working with idealized objects), and the nature of mathematical proof itself.",
    "From Euclid's axiomatic geometry, through Gödel's incompleteness theorems showing limits of formal systems, to modern computational mathematics."
  ],
  "Natural Sciences": [
    "The natural sciences investigate the physical and natural world — from subatomic particles to the structure of the universe.",
    "The scientific method involves hypothesis formation, controlled experimentation, observation, and peer-reviewed publication.",
    "Falsifiability (Popper) distinguishes science from non-science. Paradigm shifts (Kuhn) explain how scientific frameworks evolve.",
    "From Aristotle's natural philosophy, through Newton's mechanical universe, to Einstein's relativity and quantum mechanics."
  ],
  "Human Sciences": [
    "The human sciences study human behavior and social structures — psychology, sociology, economics, and anthropology.",
    "Methods include surveys, interviews, case studies, statistical analysis, and ethnography. Both quantitative and qualitative approaches.",
    "The observer effect means studying humans changes their behavior. Correlation must be distinguished from causation.",
    "From Durkheim's founding of sociology, through behaviorism's focus on observable behavior, to modern mixed-methods research."
  ],
  "History": [
    "History examines past human events, seeking to understand what happened, why, and what significance it holds for the present.",
    "Historians analyze primary and secondary sources, construct narratives, and evaluate evidence for reliability and bias.",
    "Key concepts include the nature of historical evidence, revisionism (reinterpreting the past), and the role of perspective.",
    "From Herodotus (the 'father of history'), through Ranke's emphasis on primary sources, to postmodern questioning of grand narratives."
  ],
  "The Arts": [
    "The arts encompass aesthetic experience and creative expression — visual arts, music, literature, theater, and beyond.",
    "Artists create works; audiences interpret them. Knowledge emerges through both the creative process and the act of reception.",
    "Intent (what the artist meant), reception (how audiences respond), and beauty (aesthetic value) are central but contested concepts.",
    "From classical ideals of harmony and proportion, through modernist experimentation, to conceptual art where the idea is paramount."
  ],
  "Ethics": [
    "Ethics addresses moral questions — what we ought to do, what counts as right or wrong, and how we should live.",
    "Ethical reasoning uses logical argument, thought experiments (like the trolley problem), and analysis of moral intuitions.",
    "Three major frameworks: duty-based ethics (Kant), consequentialism (outcomes matter most), and virtue ethics (character focus).",
    "From Aristotle's virtue ethics, through Kant's categorical imperative, to Peter Singer's utilitarian arguments about global responsibility."
  ],
  "Indigenous Knowledge": [
    "Indigenous knowledge systems offer holistic understanding — integrating ecological, spiritual, social, and practical knowledge.",
    "Knowledge is transmitted through oral tradition, experiential learning, ceremonial practice, and direct observation of the natural world.",
    "Central concepts include deep connection to land and place, the role of story as a knowledge carrier, and intergenerational wisdom.",
    "Ancient knowledge systems disrupted by colonialism are now experiencing revival and recognition as valid epistemological frameworks."
  ],
  "Religious Knowledge": [
    "Religious knowledge addresses transcendent questions — the meaning of life, the nature of the divine, moral purpose, and the afterlife.",
    "Sources of knowledge include revelation (divine communication), faith (trust beyond evidence), reason, and sacred texts.",
    "Authority of sacred texts, the role of religious leaders and tradition, and the relationship between faith and reason are central.",
    "From ancient sacred texts, through the Reformation's challenge to institutional authority, to modern interfaith dialogue."
  ]
};

// Color coding by dimension column (subtle background tints)
let dimColors;

// Grid layout variables
let gridX, gridY, gridW, gridH;
let colW, rowH;
let headerH = 30;
let rowLabelW;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Dimension column colors (subtle tints)
  dimColors = [
    color(0, 150, 136, 35),   // teal for Scope
    color(255, 179, 0, 35),   // amber for Methods
    color(100, 120, 220, 35), // blue for Key Concepts
    color(180, 100, 180, 35)  // purple for Historical Dev
  ];

  // Controls
  let yCtrl = drawHeight + 12;

  aokSelect = createSelect();
  aokSelect.parent(document.querySelector('main'));
  aokSelect.option('All AOKs');
  for (let a of aoks) {
    aokSelect.option(a);
  }
  aokSelect.selected('All AOKs');
  aokSelect.style('font-size', '14px');
  aokSelect.style('padding', '4px 8px');
  aokSelect.style('background-color', 'white');

  computeLayout();

  describe('Interactive matrix comparing 8 Areas of Knowledge across 4 Knowledge Framework dimensions. Click any cell for a detailed description. Use the dropdown to highlight a specific AOK row.');
}

function computeLayout() {
  // Row label column width - responsive
  rowLabelW = max(110, canvasWidth * 0.18);
  gridX = margin;
  gridY = margin + 6;
  gridW = canvasWidth - 2 * margin;
  gridH = drawHeight - gridY - 10;

  colW = (gridW - rowLabelW) / 4;
  rowH = (gridH - headerH) / 8;
}

function draw() {
  background('aliceblue');

  computeLayout();

  let highlighted = aokSelect.value();

  // Draw title
  noStroke();
  fill(30);
  textAlign(CENTER, TOP);
  textSize(constrain(canvasWidth * 0.035, 13, 18));
  textStyle(BOLD);
  text('Knowledge Framework Applied to AOKs', canvasWidth / 2, gridY - 2);
  textStyle(NORMAL);

  let tableTop = gridY + 22;

  // Draw column headers
  drawColumnHeaders(tableTop);

  // Draw data rows
  let dataTop = tableTop + headerH;
  for (let r = 0; r < 8; r++) {
    let y = dataTop + r * rowH;
    let isHighlighted = (highlighted === aoks[r]);
    let isDimmed = (highlighted !== 'All AOKs' && !isHighlighted);

    drawRow(r, y, isHighlighted, isDimmed);
  }

  // Draw grid lines
  stroke(180);
  strokeWeight(1);
  // Horizontal lines
  for (let r = 0; r <= 8; r++) {
    let y = dataTop + r * rowH;
    line(gridX, y, gridX + gridW, y);
  }
  // Vertical lines
  line(gridX, tableTop, gridX, dataTop + 8 * rowH);
  line(gridX + rowLabelW, tableTop, gridX + rowLabelW, dataTop + 8 * rowH);
  for (let c = 1; c <= 4; c++) {
    let x = gridX + rowLabelW + c * colW;
    line(x, tableTop, x, dataTop + 8 * rowH);
  }
  // Top and bottom of header
  line(gridX, tableTop, gridX + gridW, tableTop);
  line(gridX, tableTop + headerH, gridX + gridW, tableTop + headerH);
  // Outer right
  line(gridX + gridW, tableTop, gridX + gridW, dataTop + 8 * rowH);

  // Draw tooltip
  if (selectedCell !== null) {
    tooltipTarget = 255;
  } else {
    tooltipTarget = 0;
  }
  tooltipAlpha = lerp(tooltipAlpha, tooltipTarget, 0.2);

  if (tooltipAlpha > 5 && selectedCell !== null) {
    drawTooltip();
  }

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control label
  fill(30);
  textAlign(LEFT, CENTER);
  textSize(13);
  noStroke();
  text('Highlight AOK:', 12, drawHeight + controlHeight / 2);

  // Position dropdown
  aokSelect.position(120, drawHeight + controlHeight / 2 - 12);
}

function drawColumnHeaders(tableTop) {
  let headerColors = [
    color(0, 150, 136),   // teal
    color(200, 150, 0),   // amber
    color(80, 100, 200),  // blue
    color(150, 80, 150)   // purple
  ];

  for (let c = 0; c < 4; c++) {
    let x = gridX + rowLabelW + c * colW;

    // Header background
    noStroke();
    fill(headerColors[c]);
    rect(x, tableTop, colW, headerH);

    // Header text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(constrain(canvasWidth * 0.024, 10, 13));
    textStyle(BOLD);
    noStroke();
    text(dimensions[c], x + colW / 2, tableTop + headerH / 2);
  }

  // Row label header
  noStroke();
  fill(60);
  rect(gridX, tableTop, rowLabelW, headerH);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(constrain(canvasWidth * 0.024, 10, 13));
  textStyle(BOLD);
  noStroke();
  text('AOK', gridX + rowLabelW / 2, tableTop + headerH / 2);
  textStyle(NORMAL);
}

function drawRow(r, y, isHighlighted, isDimmed) {
  let aok = aoks[r];
  let labels = cellLabels[aok];
  let cellTextSize = constrain(canvasWidth * 0.019, 8, 11);

  // Row label background
  noStroke();
  if (isHighlighted) {
    fill(255, 245, 200);
  } else if (isDimmed) {
    fill(240, 240, 240, 150);
  } else {
    fill(r % 2 === 0 ? color(255) : color(248, 248, 252));
  }
  rect(gridX, y, rowLabelW, rowH);

  // Row label text
  if (isDimmed) {
    fill(160);
  } else {
    fill(40);
  }
  textAlign(LEFT, CENTER);
  textSize(cellTextSize + 1);
  textStyle(BOLD);
  noStroke();

  // Wrap long AOK names
  let aokName = aok;
  let nameX = gridX + 5;
  let nameY = y + rowH / 2;
  text(aokName, nameX, nameY - 1, rowLabelW - 8, rowH);
  textStyle(NORMAL);

  // Data cells
  for (let c = 0; c < 4; c++) {
    let x = gridX + rowLabelW + c * colW;

    // Cell background
    noStroke();
    if (isHighlighted) {
      // Bright version of column color
      let dc = dimColors[c];
      fill(red(dc), green(dc), blue(dc), 90);
    } else if (isDimmed) {
      fill(245, 245, 245, 150);
    } else {
      let dc = dimColors[c];
      fill(red(dc), green(dc), blue(dc), alpha(dc));
    }
    rect(x, y, colW, rowH);

    // Cell text
    if (isDimmed) {
      fill(170);
    } else {
      fill(50);
    }
    textAlign(LEFT, CENTER);
    textSize(cellTextSize);
    noStroke();

    // Truncate and wrap text within cell
    let cellText = labels[c];
    let padX = 4;
    let padY = 3;
    text(cellText, x + padX, y + padY, colW - 2 * padX, rowH - 2 * padY);

    // Highlight selected cell
    if (selectedCell !== null && selectedCell.row === r && selectedCell.col === c) {
      noFill();
      stroke(0, 120, 200);
      strokeWeight(2);
      rect(x + 1, y + 1, colW - 2, rowH - 2, 2);
    }
  }
}

function drawTooltip() {
  if (selectedCell === null) return;

  let r = selectedCell.row;
  let c = selectedCell.col;
  let aok = aoks[r];
  let dim = dimensions[c];
  let detail = cellDetails[aok][c];

  // Tooltip dimensions
  let tw = min(canvasWidth - 20, 340);
  let padding = 12;
  let titleSize = constrain(canvasWidth * 0.028, 11, 14);
  let bodySize = constrain(canvasWidth * 0.023, 9, 12);

  // Estimate text height
  textSize(bodySize);
  let estimatedLines = ceil(detail.length / (tw / (bodySize * 0.55)));
  let th = padding * 2 + titleSize + 8 + estimatedLines * (bodySize + 3) + 10;
  th = min(th, 180);

  // Position tooltip near center, avoiding going off canvas
  let tx = (canvasWidth - tw) / 2;
  let ty = drawHeight / 2 - th / 2;

  // Semi-transparent overlay
  noStroke();
  fill(0, 0, 0, tooltipAlpha * 0.25);
  rect(0, 0, canvasWidth, drawHeight);

  // Tooltip box shadow
  fill(0, 0, 0, tooltipAlpha * 0.15);
  rect(tx + 3, ty + 3, tw, th, 6);

  // Tooltip box
  fill(255, 255, 250, tooltipAlpha);
  stroke(0, 120, 200, tooltipAlpha);
  strokeWeight(2);
  rect(tx, ty, tw, th, 6);

  // Title bar
  noStroke();
  let headerColors = [
    color(0, 150, 136),
    color(200, 150, 0),
    color(80, 100, 200),
    color(150, 80, 150)
  ];
  fill(red(headerColors[c]), green(headerColors[c]), blue(headerColors[c]), tooltipAlpha);
  rect(tx, ty, tw, titleSize + 12, 6, 6, 0, 0);
  // Cover bottom corners of title bar
  rect(tx, ty + titleSize + 4, tw, 8);

  // Title text
  fill(255, 255, 255, tooltipAlpha);
  textAlign(LEFT, CENTER);
  textSize(titleSize);
  textStyle(BOLD);
  noStroke();
  text(aok + ' — ' + dim, tx + padding, ty + (titleSize + 12) / 2);
  textStyle(NORMAL);

  // Body text
  fill(40, 40, 40, tooltipAlpha);
  textAlign(LEFT, TOP);
  textSize(bodySize);
  noStroke();
  text(detail, tx + padding, ty + titleSize + 18, tw - 2 * padding, th - titleSize - 28);

  // Close hint
  fill(130, 130, 130, tooltipAlpha);
  textAlign(RIGHT, BOTTOM);
  textSize(9);
  noStroke();
  text('click anywhere to close', tx + tw - padding, ty + th - 4);
}

function mousePressed() {
  // Ignore clicks in control area
  if (mouseY > drawHeight) return;
  if (mouseX < 0 || mouseX > canvasWidth) return;
  if (mouseY < 0) return;

  // If tooltip is showing, close it
  if (selectedCell !== null) {
    selectedCell = null;
    return;
  }

  // Check if click is in a data cell
  let tableTop = gridY + 22;
  let dataTop = tableTop + headerH;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 4; c++) {
      let x = gridX + rowLabelW + c * colW;
      let y = dataTop + r * rowH;

      if (mouseX >= x && mouseX <= x + colW && mouseY >= y && mouseY <= y + rowH) {
        selectedCell = { row: r, col: c };
        tooltipAlpha = 0;
        return;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
}

function updateCanvasSize() {
  containerWidth = select('main').elt.getBoundingClientRect().width;
  canvasWidth = max(360, containerWidth);
}
