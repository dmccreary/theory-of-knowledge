// Availability Heuristic Risk Perception: Side-by-side bar chart comparing perceived vs actual risk
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;
let canvasHeight = 510;
let margin = 25;
let defaultTextSize = 16;

let risks = [
  {name: "Shark Attack",   perceived: 85, actual: 1,   category: "dramatic"},
  {name: "Plane Crash",    perceived: 75, actual: 2,   category: "dramatic"},
  {name: "Terrorism",      perceived: 80, actual: 3,   category: "dramatic"},
  {name: "Heart Disease",  perceived: 25, actual: 100, category: "everyday"},
  {name: "Car Accident",   perceived: 40, actual: 55,  category: "everyday"},
  {name: "Falling",        perceived: 15, actual: 45,  category: "everyday"},
  {name: "Food Poisoning", perceived: 20, actual: 30,  category: "everyday"},
  {name: "Drowning",       perceived: 30, actual: 20,  category: "everyday"}
];

let sortSelect;
let mediaSlider;
let mediaValueLabel;
let hoveredIndex = -1;
let tooltipText = "";
let tooltipX = 0;
let tooltipY = 0;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1 controls
  sortSelect = createSelect();
  sortSelect.parent(document.querySelector('main'));
  sortSelect.option("By Perceived");
  sortSelect.option("By Actual");
  sortSelect.style('font-size', '14px');
  sortSelect.style('margin-right', '15px');
  sortSelect.style('margin-top', '4px');

  mediaSlider = createSlider(1, 5, 1, 0.1);
  mediaSlider.parent(document.querySelector('main'));
  mediaSlider.style('width', '140px');
  mediaSlider.style('margin-top', '4px');

  mediaValueLabel = createSpan('Media Factor: 1.0x');
  mediaValueLabel.parent(document.querySelector('main'));
  mediaValueLabel.style('font-size', '14px');
  mediaValueLabel.style('margin-left', '8px');

  describe('Side-by-side horizontal bar chart comparing perceived versus actual risk for 8 common dangers, showing how the availability heuristic distorts risk perception.');
}

function draw() {
  // Background
  background('aliceblue');

  // Control area background
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  line(0, drawHeight, canvasWidth, drawHeight);

  // Update media label
  let mediaFactor = mediaSlider.value();
  mediaValueLabel.html('Media Factor: ' + nf(mediaFactor, 1, 1) + 'x');

  // Build sorted data with media-adjusted perceived values
  let sortedRisks = risks.map(function(r, i) {
    let adjustedPerceived = r.category === "dramatic"
      ? min(r.perceived * mediaFactor, 100)
      : r.perceived;
    return {
      name: r.name,
      perceived: adjustedPerceived,
      actual: r.actual,
      category: r.category,
      origIndex: i
    };
  });

  let sortMode = sortSelect.value();
  if (sortMode === "By Perceived") {
    sortedRisks.sort(function(a, b) { return b.perceived - a.perceived; });
  } else {
    sortedRisks.sort(function(a, b) { return b.actual - a.actual; });
  }

  // Layout constants
  let titleY = 22;
  let headerY = 42;
  let chartTop = 55;
  let chartBottom = drawHeight - 15;
  let numBars = sortedRisks.length;
  let barAreaHeight = chartBottom - chartTop;
  let barSpacing = barAreaHeight / numBars;
  let barHeight = barSpacing * 0.6;

  let labelWidth = 95;
  let gapWidth = 30;
  let chartAreaWidth = canvasWidth - margin * 2 - labelWidth - gapWidth;
  let halfChart = chartAreaWidth / 2;

  let leftChartX = margin + labelWidth;
  let rightChartX = leftChartX + halfChart + gapWidth;

  // Title
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("Perceived vs Actual Risk", canvasWidth / 2, titleY - 14);

  // Column headers
  textSize(12);
  textStyle(BOLD);
  fill('coral');
  textAlign(CENTER, TOP);
  text("Perceived Risk", leftChartX + halfChart / 2, headerY);
  fill('teal');
  text("Actual Risk", rightChartX + halfChart / 2, headerY);

  // Reset hover
  hoveredIndex = -1;

  // Draw bars
  for (let i = 0; i < numBars; i++) {
    let r = sortedRisks[i];
    let y = chartTop + i * barSpacing + (barSpacing - barHeight) / 2;
    let cy = y + barHeight / 2;

    // Risk name labels
    noStroke();
    textSize(10);
    textStyle(NORMAL);
    textAlign(RIGHT, CENTER);
    fill(r.category === "dramatic" ? 'coral' : 'teal');
    text(r.name, leftChartX - 5, cy);

    // Perceived bar
    let pWidth = map(r.perceived, 0, 100, 0, halfChart);
    let pColor = r.category === "dramatic" ? color(255, 127, 80, 200) : color(0, 128, 128, 200);
    fill(pColor);
    noStroke();
    rect(leftChartX, y, pWidth, barHeight, 0, 3, 3, 0);

    // Actual bar
    let aWidth = map(r.actual, 0, 100, 0, halfChart);
    let aColor = r.category === "dramatic" ? color(255, 127, 80, 120) : color(0, 128, 128, 120);
    fill(aColor);
    rect(rightChartX, y, aWidth, barHeight, 0, 3, 3, 0);

    // Gap line (dashed) connecting perceived to actual
    stroke(180);
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(leftChartX + pWidth, cy, rightChartX, cy);
    drawingContext.setLineDash([]);
    strokeWeight(1);

    // Small value labels on bars
    noStroke();
    fill(60);
    textSize(9);
    textAlign(LEFT, CENTER);
    if (pWidth > 20) {
      text(nf(r.perceived, 1, 0), leftChartX + pWidth - 18, cy);
    }
    if (aWidth > 20) {
      text(nf(r.actual, 1, 0), rightChartX + aWidth - 18, cy);
    }

    // Hover detection
    if (mouseX > margin && mouseX < canvasWidth - margin &&
        mouseY > y && mouseY < y + barHeight) {
      hoveredIndex = i;
      let diff = r.perceived - r.actual;
      let direction = diff > 0 ? "over-perceived" : "under-perceived";
      tooltipText = r.name + "\nPerceived: " + nf(r.perceived, 1, 0) +
                    "  Actual: " + nf(r.actual, 1, 0) +
                    "\n" + abs(diff).toFixed(0) + " pts " + direction;
      tooltipX = mouseX;
      tooltipY = mouseY;
    }
  }

  // Axis lines
  stroke('silver');
  strokeWeight(1);
  // Left chart baseline
  line(leftChartX, chartTop - 5, leftChartX, chartBottom);
  // Right chart baseline
  line(rightChartX, chartTop - 5, rightChartX, chartBottom);

  // Legend
  noStroke();
  textSize(10);
  textAlign(LEFT, CENTER);
  let legendY = drawHeight - 10;
  fill('coral');
  rect(margin, legendY - 5, 10, 10, 2);
  fill(80);
  text("Dramatic (media-amplified)", margin + 14, legendY);

  fill('teal');
  rect(canvasWidth / 2 + 10, legendY - 5, 10, 10, 2);
  fill(80);
  text("Everyday (under-reported)", canvasWidth / 2 + 28, legendY);

  // Tooltip
  if (hoveredIndex >= 0) {
    let lines = tooltipText.split("\n");
    let tw = 0;
    textSize(11);
    for (let l = 0; l < lines.length; l++) {
      tw = max(tw, textWidth(lines[l]));
    }
    let th = lines.length * 15 + 10;
    let tx = tooltipX + 12;
    let ty = tooltipY - th - 5;
    if (tx + tw + 12 > canvasWidth) tx = tooltipX - tw - 20;
    if (ty < 0) ty = tooltipY + 15;

    fill(255, 255, 255, 230);
    stroke(150);
    strokeWeight(1);
    rect(tx, ty, tw + 12, th, 4);

    noStroke();
    fill(40);
    textSize(11);
    textAlign(LEFT, TOP);
    for (let l = 0; l < lines.length; l++) {
      text(lines[l], tx + 6, ty + 5 + l * 15);
    }
  }

  // Control area label
  noStroke();
  fill(100);
  textSize(11);
  textAlign(LEFT, CENTER);
  text("Sort:", margin, drawHeight + 16);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = min(container.offsetWidth, 500);
    canvasWidth = max(canvasWidth, 350);
  }
}
