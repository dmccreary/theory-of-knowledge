// Internet Epistemology Interactive Infographic MicroSim
// CANVAS_HEIGHT: 560
// Two-column comparison: Traditional vs Internet-era epistemology
// across 5 dimensions with hover details and Opportunities/Challenges toggle

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---- Controls ----
let viewToggle;

// ---- State ----
let hoveredRow = -1;
let showChallenges = false;

// ---- Data ----
let dimensions = [
  {
    name: "Authority",
    traditional: "Established by credentials and institutions",
    internet: "Democratized but contested \u2014 anyone can claim expertise",
    opportunity: "More voices heard",
    challenge: "Harder to verify expertise"
  },
  {
    name: "Evidence",
    traditional: "Peer-reviewed, slow, high-quality gatekeeping",
    internet: "Abundant but mixed quality \u2014 preprints, blogs, social media",
    opportunity: "Faster dissemination of findings",
    challenge: "Misinformation spreads equally fast"
  },
  {
    name: "Dissemination",
    traditional: "Books, journals, classrooms \u2014 slow but curated",
    internet: "Instant global reach via platforms",
    opportunity: "Universal access to knowledge",
    challenge: "Filter bubbles limit exposure"
  },
  {
    name: "Gatekeeping",
    traditional: "Publishers, editors, universities control access",
    internet: "Algorithms and platforms replace human gatekeepers",
    opportunity: "Reduced barriers to entry",
    challenge: "Algorithmic bias replaces human bias"
  },
  {
    name: "Speed",
    traditional: "Knowledge validated slowly over years",
    internet: "Claims spread in minutes, corrections lag behind",
    opportunity: "Real-time knowledge sharing",
    challenge: "Virality favors sensation over accuracy"
  }
];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  let mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // View toggle checkbox
  viewToggle = createCheckbox(' Show Challenges', false);
  viewToggle.parent(mainElement);
  viewToggle.position(margin, drawHeight + 10);
  viewToggle.style('font-size', '14px');
  viewToggle.style('font-family', 'Arial');
  viewToggle.style('background', 'white');
  viewToggle.style('padding', '4px 10px');
  viewToggle.style('border-radius', '4px');
  viewToggle.style('cursor', 'pointer');
  viewToggle.changed(() => {
    showChallenges = viewToggle.checked();
  });

  textFont('Arial');
  describe('Two-column interactive infographic comparing traditional and internet-era epistemology across five dimensions: Authority, Evidence, Dissemination, Gatekeeping, and Speed', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Title ----
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(17);
  textStyle(BOLD);
  text('Pre-Internet vs Internet-Era Epistemology', canvasWidth / 2, 10);
  textStyle(NORMAL);

  // ---- Column headers ----
  let headerY = 36;
  let headerH = 28;
  let colGap = 40; // gap between columns for arrows
  let leftColX = margin;
  let rightColEnd = canvasWidth - margin;
  let usableWidth = rightColEnd - leftColX - colGap;
  let colWidth = usableWidth / 2;
  let rightColX = leftColX + colWidth + colGap;

  // Traditional header
  noStroke();
  fill(0, 128, 128);
  rect(leftColX, headerY, colWidth, headerH, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  noStroke();
  text('Traditional', leftColX + colWidth / 2, headerY + headerH / 2);

  // Internet header
  noStroke();
  fill(200, 150, 0);
  rect(rightColX, headerY, colWidth, headerH, 4);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  noStroke();
  text('Internet Era', rightColX + colWidth / 2, headerY + headerH / 2);
  textStyle(NORMAL);

  // ---- Rows ----
  let rowStartY = headerY + headerH + 8;
  let rowGap = 6;
  let totalRowSpace = drawHeight - rowStartY - 10;
  let rowHeight = (totalRowSpace - rowGap * (dimensions.length - 1)) / dimensions.length;

  // Detect hovered row
  hoveredRow = -1;
  if (mouseX > margin && mouseX < canvasWidth - margin && mouseY > rowStartY && mouseY < drawHeight - 5) {
    for (let i = 0; i < dimensions.length; i++) {
      let ry = rowStartY + i * (rowHeight + rowGap);
      if (mouseY >= ry && mouseY < ry + rowHeight) {
        hoveredRow = i;
        break;
      }
    }
  }

  for (let i = 0; i < dimensions.length; i++) {
    let ry = rowStartY + i * (rowHeight + rowGap);
    let dim = dimensions[i];
    let isHovered = (hoveredRow === i);

    drawRow(dim, leftColX, rightColX, ry, colWidth, rowHeight, colGap, isHovered);
  }

  // ---- Control area instruction text ----
  noStroke();
  fill(120);
  textSize(11);
  textAlign(LEFT, CENTER);
  textStyle(ITALIC);
  text('Hover a row for details. Toggle to compare opportunities vs challenges.', margin, drawHeight + 50);
  textStyle(NORMAL);

  // ---- View mode indicator ----
  let modeLabel = showChallenges ? 'Viewing: Challenges' : 'Viewing: Opportunities';
  let modeColor = showChallenges ? color(220, 80, 80) : color(46, 139, 87);
  noStroke();
  fill(modeColor);
  textSize(12);
  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  text(modeLabel, canvasWidth - margin, drawHeight + 22);
  textStyle(NORMAL);
}

function drawRow(dim, leftColX, rightColX, y, colWidth, h, colGap, isHovered) {
  let tealR = 0, tealG = 128, tealB = 128;
  let amberR = 200, amberG = 150, amberB = 0;

  // Dimension label (centered above the arrow gap)
  let centerX = leftColX + colWidth + colGap / 2;

  // ---- Left column (Traditional) ----
  if (isHovered) {
    fill(tealR, tealG, tealB, 25);
    stroke(tealR, tealG, tealB, 100);
  } else {
    fill(255, 255, 255, 200);
    stroke(tealR, tealG, tealB, 50);
  }
  strokeWeight(isHovered ? 2 : 1);
  rect(leftColX, y, colWidth, h, 4);

  // Traditional text
  noStroke();
  fill(tealR, tealG, tealB);
  textAlign(LEFT, TOP);
  textSize(isHovered ? 12 : 11);
  textStyle(NORMAL);
  text(dim.traditional, leftColX + 8, y + 6, colWidth - 16, h - 12);

  // ---- Right column (Internet) ----
  let highlightColor;
  let highlightAlpha;
  if (showChallenges) {
    // Coral/red highlight
    highlightColor = color(220, 80, 80);
    highlightAlpha = isHovered ? 30 : 15;
    if (isHovered) {
      fill(220, 80, 80, highlightAlpha);
      stroke(220, 80, 80, 100);
    } else {
      fill(220, 80, 80, highlightAlpha);
      stroke(220, 80, 80, 50);
    }
  } else {
    // Green highlight
    highlightAlpha = isHovered ? 30 : 15;
    if (isHovered) {
      fill(46, 139, 87, highlightAlpha);
      stroke(46, 139, 87, 100);
    } else {
      fill(46, 139, 87, highlightAlpha);
      stroke(46, 139, 87, 50);
    }
  }
  strokeWeight(isHovered ? 2 : 1);
  rect(rightColX, y, colWidth, h, 4);

  // Internet text (primary description or opportunity/challenge based on toggle)
  noStroke();
  if (isHovered) {
    // Show expanded detail on hover
    let detailText = showChallenges ? dim.challenge : dim.opportunity;
    let detailColor = showChallenges ? color(180, 50, 50) : color(30, 110, 70);

    // Main description at top
    fill(amberR, amberG, amberB);
    textAlign(LEFT, TOP);
    textSize(11);
    text(dim.internet, rightColX + 8, y + 6, colWidth - 16, h * 0.5);

    // Separator line
    stroke(200);
    strokeWeight(1);
    let sepY = y + h * 0.55;
    line(rightColX + 10, sepY, rightColX + colWidth - 10, sepY);

    // Opportunity/challenge detail
    noStroke();
    fill(detailColor);
    textSize(12);
    textStyle(BOLD);
    let labelText = showChallenges ? 'Challenge: ' : 'Opportunity: ';
    text(labelText + detailText, rightColX + 8, sepY + 4, colWidth - 16, h * 0.4);
    textStyle(NORMAL);
  } else {
    fill(amberR, amberG, amberB);
    textAlign(LEFT, TOP);
    textSize(11);
    text(dim.internet, rightColX + 8, y + 6, colWidth - 16, h - 12);
  }

  // ---- Connecting arrow between columns ----
  let arrowY = y + h / 2;
  let arrowStartX = leftColX + colWidth + 4;
  let arrowEndX = rightColX - 4;

  stroke(150);
  strokeWeight(1.5);
  line(arrowStartX, arrowY, arrowEndX, arrowY);

  // Arrowhead
  let arrowSize = 6;
  fill(150);
  noStroke();
  triangle(
    arrowEndX, arrowY,
    arrowEndX - arrowSize, arrowY - arrowSize / 2,
    arrowEndX - arrowSize, arrowY + arrowSize / 2
  );

  // ---- Dimension label on arrow ----
  noStroke();
  fill(80);
  textAlign(CENTER, CENTER);
  textSize(10);
  textStyle(BOLD);

  // Background pill for label readability
  let labelW = textWidth(dim.name) + 10;
  fill('aliceblue');
  noStroke();
  rect(centerX - labelW / 2, arrowY - 9, labelW, 18, 9);

  fill(80);
  noStroke();
  text(dim.name, centerX, arrowY);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  viewToggle.position(margin, drawHeight + 10);
  redraw();
}

function updateCanvasSize() {
  let container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
