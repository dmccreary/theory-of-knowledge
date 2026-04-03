// Creativity Dimensions Radar Chart
// CANVAS_HEIGHT: 580
let drawHeight = 380;
let controlHeight = 200;
let canvasHeight = 580;

let artworks = {
  "Beethoven's 9th": [9, 10, 10, 8],
  "Duchamp's Fountain": [10, 7, 9, 10],
  "Banksy Street Art": [8, 8, 9, 9],
  "Traditional Folk Song": [3, 9, 5, 4],
  "AI-Generated Art": [6, 5, 2, 7]
};

let dimensions = ["Originality", "Value", "Intentionality", "Transformation"];
let artworkNames;

let artworkSelect1, artworkSelect2;
let compareButton;
let sliders = [];
let sliderLabels = [];
let compareMode = false;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  artworkNames = Object.keys(artworks);

  // Row 1: Artwork dropdown + Compare button
  artworkSelect1 = createSelect();
  artworkSelect1.parent(document.querySelector('main'));
  for (let name of artworkNames) {
    artworkSelect1.option(name);
  }
  artworkSelect1.changed(onArtworkChange);

  compareButton = createButton('Compare');
  compareButton.parent(document.querySelector('main'));
  compareButton.mousePressed(toggleCompare);

  artworkSelect2 = createSelect();
  artworkSelect2.parent(document.querySelector('main'));
  for (let name of artworkNames) {
    artworkSelect2.option(name);
  }
  artworkSelect2.selected(artworkNames[1]);
  artworkSelect2.hide();

  // Rows 2-5: Sliders for each dimension
  for (let i = 0; i < 4; i++) {
    let s = createSlider(0, 10, artworks[artworkNames[0]][i], 1);
    s.parent(document.querySelector('main'));
    sliders.push(s);
  }

  textFont('Arial');
  describe('Radar chart showing four dimensions of creativity for different artworks: Originality, Value, Intentionality, and Transformation.');
}

function onArtworkChange() {
  let vals = artworks[artworkSelect1.value()];
  for (let i = 0; i < 4; i++) {
    sliders[i].value(vals[i]);
  }
}

function toggleCompare() {
  compareMode = !compareMode;
  if (compareMode) {
    compareButton.html('Hide Compare');
    artworkSelect2.show();
  } else {
    compareButton.html('Compare');
    artworkSelect2.hide();
  }
}

function draw() {
  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, width, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, width, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, width, drawHeight);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(18);
  text('Creativity Dimensions Radar Chart', width / 2, 10);

  // Radar chart center and radius
  let cx = width / 2;
  let cy = drawHeight / 2 + 15;
  let maxRadius = min(width, drawHeight) * 0.35;

  drawRadarGrid(cx, cy, maxRadius);

  // Get current slider values
  let customValues = [];
  for (let i = 0; i < 4; i++) {
    customValues.push(sliders[i].value());
  }

  // Draw primary polygon
  drawRadarPolygon(cx, cy, maxRadius, customValues, color(70, 130, 180, 120), color(70, 130, 180));

  // Draw compare polygon
  if (compareMode) {
    let compareVals = artworks[artworkSelect2.value()];
    drawRadarPolygon(cx, cy, maxRadius, compareVals, color(255, 127, 80, 80), color(255, 127, 80));

    // Legend
    noStroke();
    fill(70, 130, 180);
    rect(cx + maxRadius - 30, cy - maxRadius + 10, 14, 14, 2);
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);
    noStroke();
    text(artworkSelect1.value(), cx + maxRadius - 12, cy - maxRadius + 17);

    fill('coral');
    noStroke();
    rect(cx + maxRadius - 30, cy - maxRadius + 30, 14, 14, 2);
    fill('black');
    noStroke();
    text(artworkSelect2.value(), cx + maxRadius - 12, cy - maxRadius + 37);
  }

  // Position controls
  positionControls();
}

function drawRadarGrid(cx, cy, maxRadius) {
  let angles = [-HALF_PI, 0, HALF_PI, PI]; // top, right, bottom, left

  // Draw concentric diamonds at 2, 4, 6, 8, 10
  for (let level = 2; level <= 10; level += 2) {
    let r = (level / 10) * maxRadius;
    stroke(200);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < 4; i++) {
      let x = cx + cos(angles[i]) * r;
      let y = cy + sin(angles[i]) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Level labels on top axis
    noStroke();
    fill(150);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(level, cx, cy - r - 2);
  }

  // Draw axes
  for (let i = 0; i < 4; i++) {
    stroke(180);
    strokeWeight(1);
    let x = cx + cos(angles[i]) * maxRadius;
    let y = cy + sin(angles[i]) * maxRadius;
    line(cx, cy, x, y);

    // Axis labels
    noStroke();
    fill('black');
    textSize(13);
    let labelOffset = 18;
    let lx = cx + cos(angles[i]) * (maxRadius + labelOffset);
    let ly = cy + sin(angles[i]) * (maxRadius + labelOffset);

    if (i === 0) {
      textAlign(CENTER, BOTTOM);
      ly -= 5;
    } else if (i === 1) {
      textAlign(LEFT, CENTER);
      lx += 5;
    } else if (i === 2) {
      textAlign(CENTER, TOP);
      ly += 5;
    } else {
      textAlign(RIGHT, CENTER);
      lx -= 5;
    }
    text(dimensions[i], lx, ly);
  }
}

function drawRadarPolygon(cx, cy, maxRadius, values, fillColor, strokeColor) {
  let angles = [-HALF_PI, 0, HALF_PI, PI];

  // Fill polygon
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 4; i++) {
    let r = (values[i] / 10) * maxRadius;
    let x = cx + cos(angles[i]) * r;
    let y = cy + sin(angles[i]) * r;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Draw dots at vertices
  noStroke();
  fill(strokeColor);
  for (let i = 0; i < 4; i++) {
    let r = (values[i] / 10) * maxRadius;
    let x = cx + cos(angles[i]) * r;
    let y = cy + sin(angles[i]) * r;
    ellipse(x, y, 8, 8);
  }

  // Draw value labels at vertices
  fill(strokeColor);
  textSize(12);
  for (let i = 0; i < 4; i++) {
    let r = (values[i] / 10) * maxRadius;
    let x = cx + cos(angles[i]) * r;
    let y = cy + sin(angles[i]) * r;
    let nudge = 14;
    noStroke();
    if (i === 0) {
      textAlign(CENTER, BOTTOM);
      text(values[i], x, y - nudge);
    } else if (i === 1) {
      textAlign(LEFT, CENTER);
      text(values[i], x + nudge, y);
    } else if (i === 2) {
      textAlign(CENTER, TOP);
      text(values[i], x, y + nudge);
    } else {
      textAlign(RIGHT, CENTER);
      text(values[i], x - nudge, y);
    }
  }
}

function positionControls() {
  let leftMargin = 10;
  let rowHeight = 36;
  let yStart = drawHeight + 12;
  let labelWidth = 130;
  let sliderWidth = max(150, width - labelWidth - 80);

  // Row 1: Dropdown + Compare button + optional second dropdown
  artworkSelect1.position(leftMargin, yStart);
  artworkSelect1.size(160);
  compareButton.position(leftMargin + 170, yStart);
  artworkSelect2.position(leftMargin + 280, yStart);
  artworkSelect2.size(160);

  // Rows 2-5: Sliders
  for (let i = 0; i < 4; i++) {
    let y = yStart + rowHeight * (i + 1) + 4;
    sliders[i].position(leftMargin + labelWidth, y);
    sliders[i].size(sliderWidth);
  }

  // Draw slider labels and values
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  for (let i = 0; i < 4; i++) {
    let y = yStart + rowHeight * (i + 1) + 14;
    noStroke();
    text(dimensions[i] + ':', leftMargin, y);

    // Draw current value after slider
    let valX = leftMargin + labelWidth + sliderWidth + 10;
    text(sliders[i].value(), valX, y);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : windowWidth;
  canvasWidth = min(canvasWidth, 900);
}
