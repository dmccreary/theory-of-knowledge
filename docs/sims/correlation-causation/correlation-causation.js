// Correlation vs Causation MicroSim - Interactive scatter plot with hidden confounds
// CANVAS_HEIGHT: 510

let containerWidth;
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 50;
let defaultTextSize = 14;

// Controls
let datasetSelect;
let revealButton;
let trendlineCheckbox;

// State
let confoundRevealed = false;
let hoveredPoint = null;

// Plot area
let plotLeft, plotRight, plotTop, plotBottom;

// Datasets
let datasets = {
  "Ice Cream & Drowning": {
    xLabel: "Ice Cream Sales ($K)",
    yLabel: "Drowning Deaths",
    confound: "Temperature (°F)",
    points: [
      {x:10,y:5,c:55},{x:15,y:8,c:60},{x:25,y:12,c:70},{x:35,y:18,c:75},
      {x:45,y:25,c:80},{x:50,y:30,c:85},{x:55,y:28,c:88},{x:40,y:22,c:78},
      {x:20,y:10,c:65},{x:30,y:15,c:72},{x:48,y:27,c:83},{x:12,y:6,c:58},
      {x:38,y:20,c:76},{x:52,y:29,c:86},{x:22,y:11,c:67}
    ],
    explanation: "Both ice cream sales and drowning increase with temperature. Temperature is the confounding variable — the correlation is real, but the causal link is through a third factor."
  },
  "Education & Income": {
    xLabel: "Years of Education",
    yLabel: "Annual Income ($K)",
    confound: "Family Wealth",
    points: [
      {x:8,y:25,c:1},{x:10,y:30,c:1},{x:12,y:40,c:2},{x:14,y:55,c:2},
      {x:16,y:65,c:3},{x:18,y:80,c:3},{x:12,y:50,c:3},{x:10,y:35,c:2},
      {x:16,y:45,c:1},{x:14,y:70,c:3},{x:8,y:20,c:1},{x:18,y:90,c:3},
      {x:12,y:35,c:1},{x:16,y:75,c:3},{x:14,y:48,c:2}
    ],
    explanation: "Family wealth enables both more education AND higher income through networks and opportunities. The education-income link is partially confounded by socioeconomic background."
  },
  "Screen Time & Sleep": {
    xLabel: "Daily Screen Hours",
    yLabel: "Sleep Quality (1-10)",
    confound: "Stress Level",
    points: [
      {x:2,y:8,c:1},{x:3,y:7,c:2},{x:5,y:6,c:2},{x:7,y:4,c:3},
      {x:8,y:3,c:3},{x:4,y:7,c:1},{x:6,y:5,c:3},{x:1,y:9,c:1},
      {x:9,y:2,c:3},{x:3,y:8,c:1},{x:5,y:5,c:2},{x:7,y:3,c:3},
      {x:2,y:9,c:1},{x:6,y:4,c:2},{x:8,y:2,c:3}
    ],
    explanation: "Stressed people both use screens more (as coping/distraction) AND sleep worse. Stress is a confounding variable that partially explains the correlation."
  }
};

let datasetNames;
let currentDataset;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  datasetNames = Object.keys(datasets);
  currentDataset = datasets[datasetNames[0]];

  // Row 1 controls: dataset dropdown + reveal button
  datasetSelect = createSelect();
  datasetSelect.parent(document.querySelector('main'));
  for (let name of datasetNames) {
    datasetSelect.option(name);
  }
  datasetSelect.changed(() => {
    currentDataset = datasets[datasetSelect.value()];
    confoundRevealed = false;
    revealButton.html('Reveal Confound');
  });
  datasetSelect.style('font-size', '14px');
  datasetSelect.style('padding', '4px 8px');
  datasetSelect.style('margin-right', '10px');

  revealButton = createButton('Reveal Confound');
  revealButton.parent(document.querySelector('main'));
  revealButton.mousePressed(() => {
    confoundRevealed = !confoundRevealed;
    revealButton.html(confoundRevealed ? 'Hide Confound' : 'Reveal Confound');
  });
  revealButton.style('font-size', '14px');
  revealButton.style('padding', '4px 12px');
  revealButton.style('margin-right', '10px');

  // Row 2 control: trendline checkbox
  trendlineCheckbox = createCheckbox(' Show Trendline', true);
  trendlineCheckbox.parent(document.querySelector('main'));
  trendlineCheckbox.style('font-size', '14px');
  trendlineCheckbox.style('margin-top', '6px');

  describe('Interactive scatter plot showing correlation versus causation with hidden confounding variables.');
}

function draw() {
  // Drawing area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Title
  noStroke();
  fill('black');
  textSize(18);
  textAlign(CENTER, TOP);
  text('Correlation vs. Causation', canvasWidth / 2, 10);

  // Plot area
  plotLeft = margin + 10;
  plotRight = canvasWidth - margin;
  plotTop = 40;
  plotBottom = drawHeight - 80;

  let data = currentDataset;
  let pts = data.points;

  // Compute data ranges
  let xMin = Infinity, xMax = -Infinity;
  let yMin = Infinity, yMax = -Infinity;
  let cMin = Infinity, cMax = -Infinity;
  for (let p of pts) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
    if (p.c < cMin) cMin = p.c;
    if (p.c > cMax) cMax = p.c;
  }

  // Add padding to ranges
  let xPad = (xMax - xMin) * 0.1;
  let yPad = (yMax - yMin) * 0.1;
  let xRangeMin = xMin - xPad;
  let xRangeMax = xMax + xPad;
  let yRangeMin = yMin - yPad;
  let yRangeMax = yMax + yPad;

  // Draw axes
  stroke('gray');
  strokeWeight(1);
  line(plotLeft, plotTop, plotLeft, plotBottom);
  line(plotLeft, plotBottom, plotRight, plotBottom);

  // Axis tick marks and labels
  noStroke();
  fill('dimgray');
  textSize(11);

  // X-axis ticks
  let xTicks = 5;
  textAlign(CENTER, TOP);
  for (let i = 0; i <= xTicks; i++) {
    let val = xRangeMin + (xRangeMax - xRangeMin) * (i / xTicks);
    let px = map(val, xRangeMin, xRangeMax, plotLeft, plotRight);
    stroke('gray');
    strokeWeight(1);
    line(px, plotBottom, px, plotBottom + 5);
    noStroke();
    text(nf(val, 0, 0), px, plotBottom + 8);
  }

  // Y-axis ticks
  let yTicks = 5;
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= yTicks; i++) {
    let val = yRangeMin + (yRangeMax - yRangeMin) * (i / yTicks);
    let py = map(val, yRangeMin, yRangeMax, plotBottom, plotTop);
    stroke('gray');
    strokeWeight(1);
    line(plotLeft - 5, py, plotLeft, py);
    // Light grid lines
    stroke(220);
    line(plotLeft, py, plotRight, py);
    noStroke();
    text(nf(val, 0, 0), plotLeft - 8, py);
  }

  // Axis labels
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, TOP);
  text(data.xLabel, (plotLeft + plotRight) / 2, plotBottom + 24);

  push();
  translate(15, (plotTop + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text(data.yLabel, 0, 0);
  pop();

  // Draw trendline if checked
  if (trendlineCheckbox.checked()) {
    let reg = linearRegression(pts);
    let x1 = xRangeMin;
    let y1 = reg.slope * x1 + reg.intercept;
    let x2 = xRangeMax;
    let y2 = reg.slope * x2 + reg.intercept;
    let px1 = map(x1, xRangeMin, xRangeMax, plotLeft, plotRight);
    let py1 = map(y1, yRangeMin, yRangeMax, plotBottom, plotTop);
    let px2 = map(x2, xRangeMin, xRangeMax, plotLeft, plotRight);
    let py2 = map(y2, yRangeMin, yRangeMax, plotBottom, plotTop);
    stroke('coral');
    strokeWeight(2);
    line(px1, py1, px2, py2);

    // Show r value
    let r = correlationCoefficient(pts);
    noStroke();
    fill('coral');
    textSize(12);
    textAlign(RIGHT, TOP);
    text('r = ' + nf(r, 1, 2), plotRight - 5, plotTop + 5);
  }

  // Check for hovered point
  hoveredPoint = null;
  for (let p of pts) {
    let px = map(p.x, xRangeMin, xRangeMax, plotLeft, plotRight);
    let py = map(p.y, yRangeMin, yRangeMax, plotBottom, plotTop);
    let d = dist(mouseX, mouseY, px, py);
    if (d < 10) {
      hoveredPoint = p;
    }
  }

  // Draw data points
  for (let p of pts) {
    let px = map(p.x, xRangeMin, xRangeMax, plotLeft, plotRight);
    let py = map(p.y, yRangeMin, yRangeMax, plotBottom, plotTop);

    if (confoundRevealed) {
      // Color by confound value: cool (blue) to warm (red)
      let t = (cMax === cMin) ? 0.5 : (p.c - cMin) / (cMax - cMin);
      let r = lerp(50, 220, t);
      let g = lerp(100, 60, t);
      let b = lerp(200, 50, t);
      fill(r, g, b);
      stroke(r * 0.7, g * 0.7, b * 0.7);
    } else {
      fill('teal');
      stroke(0, 100, 100);
    }
    strokeWeight(1);
    let isHovered = (hoveredPoint === p);
    ellipse(px, py, isHovered ? 16 : 12, isHovered ? 16 : 12);
  }

  // Draw confound legend when revealed
  if (confoundRevealed) {
    let legendX = plotRight - 130;
    let legendY = plotTop + 5;
    let legendW = 125;
    let legendH = 50;

    // Legend background
    noStroke();
    fill(255, 255, 255, 220);
    rect(legendX, legendY, legendW, legendH, 5);

    // Legend title
    fill('black');
    textSize(11);
    textAlign(LEFT, TOP);
    noStroke();
    text(data.confound, legendX + 5, legendY + 5);

    // Gradient bar
    for (let i = 0; i < 100; i++) {
      let t = i / 100;
      let r = lerp(50, 220, t);
      let g = lerp(100, 60, t);
      let b = lerp(200, 50, t);
      stroke(r, g, b);
      strokeWeight(2);
      let gx = legendX + 5 + i;
      line(gx, legendY + 22, gx, legendY + 32);
    }

    // Gradient labels
    noStroke();
    fill('dimgray');
    textSize(10);
    textAlign(LEFT, TOP);
    text('Low', legendX + 5, legendY + 36);
    textAlign(RIGHT, TOP);
    text('High', legendX + 105, legendY + 36);
  }

  // Draw tooltip for hovered point
  if (hoveredPoint) {
    let px = map(hoveredPoint.x, xRangeMin, xRangeMax, plotLeft, plotRight);
    let py = map(hoveredPoint.y, yRangeMin, yRangeMax, plotBottom, plotTop);

    let tipLines = [
      data.xLabel + ': ' + hoveredPoint.x,
      data.yLabel + ': ' + hoveredPoint.y
    ];
    if (confoundRevealed) {
      tipLines.push(data.confound + ': ' + hoveredPoint.c);
    }

    textSize(11);
    let tipW = 0;
    for (let line of tipLines) {
      let w = textWidth(line);
      if (w > tipW) tipW = w;
    }
    tipW += 16;
    let tipH = tipLines.length * 16 + 10;

    // Position tooltip to avoid going off canvas
    let tipX = px + 12;
    let tipY = py - tipH - 5;
    if (tipX + tipW > canvasWidth) tipX = px - tipW - 12;
    if (tipY < 0) tipY = py + 12;

    noStroke();
    fill(255, 255, 255, 230);
    rect(tipX, tipY, tipW, tipH, 4);
    stroke('gray');
    strokeWeight(0.5);
    noFill();
    rect(tipX, tipY, tipW, tipH, 4);

    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    for (let i = 0; i < tipLines.length; i++) {
      text(tipLines[i], tipX + 8, tipY + 6 + i * 16);
    }
  }

  // Draw explanation text when confound is revealed
  if (confoundRevealed) {
    noStroke();
    fill('darkslategray');
    textSize(11);
    textAlign(LEFT, TOP);
    let explainY = drawHeight - 65;
    let explainW = plotRight - plotLeft;
    text(data.explanation, plotLeft, explainY, explainW, 60);
  }

  // Control area label
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('Hover over points for details', 10, drawHeight + controlHeight / 2);
}

function linearRegression(pts) {
  let n = pts.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let p of pts) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }
  let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  let intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function correlationCoefficient(pts) {
  let n = pts.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let p of pts) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
    sumYY += p.y * p.y;
  }
  let num = n * sumXY - sumX * sumY;
  let den = sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  return den === 0 ? 0 : num / den;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
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
