// Quantitative vs Qualitative Research Methods - Side-by-Side Comparison
// Analyze (L4): Compare across 6 dimensions with discipline context

let canvasWidth = 400;
const CANVAS_HEIGHT = 520;
const drawHeight = 460;
const controlHeight = 60;

let disciplineSelect;

const dimensions = ["Data Type", "Methods", "Strengths", "Limitations", "Best For", "Example"];

const comparison = {
  quantitative: {
    "Data Type": "Numbers, measurements, statistics",
    "Methods": "Surveys, experiments, statistical analysis",
    "Strengths": "Objectivity, large samples, replicability",
    "Limitations": "May miss context, oversimplify complexity",
    "Best For": "Testing hypotheses, measuring trends",
    "Example": "Measuring vaccine effectiveness in 10,000 patients"
  },
  qualitative: {
    "Data Type": "Words, images, observations, meanings",
    "Methods": "Interviews, ethnography, case studies",
    "Strengths": "Rich detail, captures context and meaning",
    "Limitations": "Small samples, researcher bias, hard to replicate",
    "Best For": "Exploring experiences, understanding 'why'",
    "Example": "Interviewing patients about their vaccination decisions"
  }
};

const disciplines = {
  "General": {
    quant: "Measuring vaccine effectiveness in 10,000 patients",
    qual: "Interviewing patients about their vaccination decisions"
  },
  "Psychology": {
    quant: "Brain imaging studies measuring neural activity",
    qual: "Phenomenological interviews about lived experience"
  },
  "Sociology": {
    quant: "Census data analysis of income inequality",
    qual: "Ethnographic study of a community's values"
  },
  "Education": {
    quant: "Standardized test score comparisons",
    qual: "Classroom observation of teaching methods"
  }
};

let hoveredCell = null; // {col, row}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));

  // Controls row
  let controlY = drawHeight + 12;

  // Discipline dropdown
  disciplineSelect = createSelect();
  disciplineSelect.parent(document.querySelector('main'));
  disciplineSelect.position(80, controlY);
  disciplineSelect.style('font-size', '14px');
  disciplineSelect.style('padding', '3px 6px');
  disciplineSelect.style('background', 'white');
  for (let d of Object.keys(disciplines)) {
    disciplineSelect.option(d);
  }
  disciplineSelect.selected("General");

  describe('Side-by-side comparison of quantitative and qualitative research methods across six dimensions with discipline context dropdown.');
}

function draw() {
  background('aliceblue');

  // Update example row based on discipline
  let disc = disciplineSelect.value();
  comparison.quantitative["Example"] = disciplines[disc].quant;
  comparison.qualitative["Example"] = disciplines[disc].qual;

  let margin = 10;
  let headerHeight = 40;
  let dividerWidth = 30;
  let colWidth = (canvasWidth - margin * 2 - dividerWidth) / 2;
  let leftX = margin;
  let rightX = margin + colWidth + dividerWidth;
  let centerX = margin + colWidth + dividerWidth / 2;

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Quantitative vs. Qualitative Methods", canvasWidth / 2, 18);

  // Column headers
  let colHeaderY = headerHeight;
  let colHeaderH = 28;

  // Quantitative header
  fill('steelblue');
  rect(leftX, colHeaderY, colWidth, colHeaderH, 5, 5, 0, 0);
  fill('white');
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("QUANTITATIVE", leftX + colWidth / 2, colHeaderY + colHeaderH / 2);

  // Qualitative header
  fill('seagreen');
  rect(rightX, colHeaderY, colWidth, colHeaderH, 5, 5, 0, 0);
  fill('white');
  text("QUALITATIVE", rightX + colWidth / 2, colHeaderY + colHeaderH / 2);

  // VS divider
  fill('gray');
  textSize(12);
  textStyle(BOLD);
  text("vs", centerX, colHeaderY + colHeaderH / 2);

  // Rows
  let rowStartY = colHeaderY + colHeaderH + 4;
  let rowHeight = (drawHeight - rowStartY - 50) / dimensions.length; // leave room for summary
  let rowGap = 2;

  hoveredCell = null;

  for (let i = 0; i < dimensions.length; i++) {
    let dim = dimensions[i];
    let y = rowStartY + i * rowHeight;
    let cellH = rowHeight - rowGap;

    // Dimension label (centered between columns)
    noStroke();
    fill('gray');
    rect(leftX, y, canvasWidth - margin * 2, 16, 3);
    fill('white');
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(dim.toUpperCase(), canvasWidth / 2, y + 8);

    let cellY = y + 17;
    let cellContentH = cellH - 17;

    // Check hover
    let leftHovered = mouseX >= leftX && mouseX <= leftX + colWidth &&
                      mouseY >= cellY && mouseY <= cellY + cellContentH;
    let rightHovered = mouseX >= rightX && mouseX <= rightX + colWidth &&
                       mouseY >= cellY && mouseY <= cellY + cellContentH;

    // Quantitative cell
    if (leftHovered) {
      fill(200, 215, 235);
      hoveredCell = {col: 'quantitative', row: dim};
    } else {
      fill(225, 235, 245);
    }
    rect(leftX, cellY, colWidth, cellContentH, 3);

    // Qualitative cell
    if (rightHovered) {
      fill(200, 230, 215);
      hoveredCell = {col: 'qualitative', row: dim};
    } else {
      fill(225, 245, 230);
    }
    rect(rightX, cellY, colWidth, cellContentH, 3);

    // Cell text
    textStyle(NORMAL);
    textSize(11);
    textAlign(LEFT, TOP);

    // Quantitative text
    fill('black');
    noStroke();
    let quantText = comparison.quantitative[dim];
    drawWrappedText(quantText, leftX + 5, cellY + 3, colWidth - 10, cellContentH - 6);

    // Qualitative text
    let qualText = comparison.qualitative[dim];
    drawWrappedText(qualText, rightX + 5, cellY + 3, colWidth - 10, cellContentH - 6);

    // VS line between cells
    stroke('silver');
    strokeWeight(1);
    line(centerX, cellY, centerX, cellY + cellContentH);
    noStroke();
  }

  // Summary row
  let summaryY = rowStartY + dimensions.length * rowHeight + 2;
  let summaryH = drawHeight - summaryY - 4;

  fill('steelblue');
  rect(leftX, summaryY, colWidth, summaryH, 3);
  fill('white');
  textSize(10);
  textStyle(ITALIC);
  textAlign(CENTER, CENTER);
  text("Best when you need to measure,\ncount, or generalize", leftX + colWidth / 2, summaryY + summaryH / 2);

  fill('seagreen');
  rect(rightX, summaryY, colWidth, summaryH, 3);
  fill('white');
  text("Best when you need to explore,\nunderstand, or interpret", rightX + colWidth / 2, summaryY + summaryH / 2);

  // VS in summary
  fill('gray');
  textStyle(BOLD);
  textSize(11);
  textAlign(CENTER, CENTER);
  noStroke();
  text("vs", centerX, summaryY + summaryH / 2);

  // Control label
  fill('black');
  textSize(12);
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  noStroke();
  text("Discipline:", margin, drawHeight + 24);

  // Hover tooltip
  if (hoveredCell) {
    drawTooltip();
  }
}

function drawWrappedText(txt, x, y, maxW, maxH) {
  noStroke();
  let words = txt.split(' ');
  let line = '';
  let lineY = y;
  let lineH = 14;

  for (let w of words) {
    let testLine = line.length === 0 ? w : line + ' ' + w;
    if (textWidth(testLine) > maxW && line.length > 0) {
      if (lineY + lineH > y + maxH) break;
      text(line, x, lineY);
      line = w;
      lineY += lineH;
    } else {
      line = testLine;
    }
  }
  if (line.length > 0 && lineY + lineH <= y + maxH + 4) {
    text(line, x, lineY);
  }
}

function drawTooltip() {
  let txt = comparison[hoveredCell.col][hoveredCell.row];
  let colLabel = hoveredCell.col === 'quantitative' ? 'Quantitative' : 'Qualitative';
  let heading = colLabel + " — " + hoveredCell.row;

  textSize(12);
  textStyle(NORMAL);
  let tipW = min(280, canvasWidth - 20);
  let tipH = 60;

  let tipX = mouseX + 12;
  let tipY = mouseY - tipH - 5;

  // Keep tooltip on screen
  if (tipX + tipW > canvasWidth - 5) tipX = mouseX - tipW - 12;
  if (tipY < 5) tipY = mouseY + 18;

  // Shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(tipX + 2, tipY + 2, tipW, tipH, 5);

  // Background
  fill(255, 255, 240);
  stroke('gray');
  strokeWeight(1);
  rect(tipX, tipY, tipW, tipH, 5);

  // Heading
  noStroke();
  fill(hoveredCell.col === 'quantitative' ? 'steelblue' : 'seagreen');
  textStyle(BOLD);
  textSize(11);
  textAlign(LEFT, TOP);
  text(heading, tipX + 8, tipY + 6);

  // Body
  fill('black');
  textStyle(NORMAL);
  textSize(11);
  drawWrappedText(txt, tipX + 8, tipY + 24, tipW - 16, 32);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = max(360, mainEl.offsetWidth);
  } else {
    canvasWidth = max(360, windowWidth);
  }
}
