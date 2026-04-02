// Source Credibility Analyzer - Rate sources against 6 criteria and compare to expert ratings
// CANVAS_HEIGHT: 580

let containerWidth;
let canvasWidth = 400;
let drawHeight = 350;
let controlHeight = 230;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Criteria labels
let criteriaNames = ["Provenance", "Expertise", "Independence", "Corroboration", "Currency", "Methodology"];

// Source data
let sources = {
  "Nature journal article": {
    expert: [5, 5, 4, 5, 4, 5],
    desc: "Peer-reviewed study in a top scientific journal"
  },
  "Anonymous blog post": {
    expert: [1, 1, 2, 1, 3, 1],
    desc: "Unattributed blog with no citations or methodology"
  },
  "BBC News report": {
    expert: [4, 3, 3, 4, 5, 3],
    desc: "Professional journalism from an established outlet"
  },
  "Government statistics": {
    expert: [4, 4, 2, 4, 4, 4],
    desc: "Official data from a national statistics agency"
  }
};

let sourceKeys = Object.keys(sources);

// Controls
let sourceSelect;
let showExpertButton;
let sliders = [];

// State
let showExpert = false;
let currentSource = "";

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Control area starts at drawHeight
  let controlY = drawHeight + 10;
  let labelWidth = 110;
  let sliderLeft = margin + labelWidth;
  let rowHeight = 30;

  // Row 1: Source dropdown + Show Expert button
  sourceSelect = createSelect();
  sourceSelect.parent(document.querySelector('main'));
  for (let key of sourceKeys) {
    sourceSelect.option(key);
  }
  sourceSelect.position(margin, controlY);
  sourceSelect.size(canvasWidth * 0.55, 24);
  sourceSelect.style('font-size', '13px');
  sourceSelect.style('background-color', 'white');
  sourceSelect.changed(() => {
    showExpert = false;
    resetSliders();
  });

  showExpertButton = createButton('Show Expert');
  showExpertButton.parent(document.querySelector('main'));
  showExpertButton.position(canvasWidth * 0.55 + margin + 10, controlY);
  showExpertButton.size(canvasWidth * 0.35, 24);
  showExpertButton.style('font-size', '13px');
  showExpertButton.style('background-color', 'white');
  showExpertButton.mousePressed(() => {
    showExpert = !showExpert;
    showExpertButton.html(showExpert ? 'Hide Expert' : 'Show Expert');
  });

  // Rows 2-7: 6 sliders
  for (let i = 0; i < 6; i++) {
    let y = controlY + rowHeight * (i + 1) + 5;
    let s = createSlider(1, 5, 3, 1);
    s.parent(document.querySelector('main'));
    s.position(sliderLeft, y);
    s.size(canvasWidth - sliderLeft - margin - 30, 20);
    s.style('background-color', 'white');
    sliders.push(s);
  }

  currentSource = sourceKeys[0];
  describe('Interactive source credibility analyzer where students rate information sources against six criteria and compare to expert ratings.');
}

function resetSliders() {
  for (let s of sliders) {
    s.value(3);
  }
}

function draw() {
  currentSource = sourceSelect.value();
  let src = sources[currentSource];

  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  text("Source Credibility Analyzer", canvasWidth / 2, 10);

  // Source name and description
  textSize(15);
  fill('darkslateblue');
  textAlign(CENTER, TOP);
  text(currentSource, canvasWidth / 2, 38);

  textSize(12);
  fill('dimgray');
  textAlign(CENTER, TOP);
  text(src.desc, canvasWidth / 2 - 10, 60, canvasWidth - 40);

  // Rating bars
  let barAreaTop = 90;
  let barHeight = 28;
  let barSpacing = 40;
  let labelWidth = 110;
  let barLeft = margin + labelWidth;
  let barMaxWidth = canvasWidth - barLeft - margin - 10;

  let totalDiff = 0;

  for (let i = 0; i < 6; i++) {
    let y = barAreaTop + i * barSpacing;
    let studentVal = sliders[i].value();
    let expertVal = src.expert[i];

    // Criterion label
    noStroke();
    fill('black');
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(criteriaNames[i], margin + labelWidth - 8, y + barHeight / 2);

    // Background bar track
    fill('gainsboro');
    noStroke();
    rect(barLeft, y, barMaxWidth, barHeight, 4);

    // Student rating bar
    let studentWidth = map(studentVal, 0, 5, 0, barMaxWidth);
    fill('steelblue');
    rect(barLeft, y, studentWidth, barHeight, 4);

    // Student value label
    fill('white');
    textSize(13);
    textAlign(CENTER, CENTER);
    if (studentWidth > 20) {
      text(studentVal, barLeft + studentWidth / 2, y + barHeight / 2);
    }

    // Expert rating overlay marker
    if (showExpert) {
      let expertX = barLeft + map(expertVal, 0, 5, 0, barMaxWidth);
      stroke('crimson');
      strokeWeight(3);
      line(expertX, y - 2, expertX, y + barHeight + 2);
      noStroke();

      // Expert value label
      fill('crimson');
      textSize(10);
      textAlign(CENTER, BOTTOM);
      text(expertVal, expertX, y - 3);
    }

    // Accumulate difference
    totalDiff += abs(studentVal - expertVal);
  }

  // Score summary
  let maxDiff = 6 * 4; // 6 criteria, max diff of 4 each
  let accuracy = map(totalDiff, 0, maxDiff, 100, 0);
  accuracy = constrain(accuracy, 0, 100);

  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  let scoreY = barAreaTop + 6 * barSpacing + 5;

  if (showExpert) {
    // Color code the accuracy
    if (accuracy >= 80) {
      fill('seagreen');
    } else if (accuracy >= 50) {
      fill('goldenrod');
    } else {
      fill('crimson');
    }
    text("Accuracy: " + nf(accuracy, 1, 0) + "%", margin, scoreY);

    fill('dimgray');
    textSize(11);
    text("(How close your ratings are to the expert assessment)", margin + 140, scoreY + 2);
  } else {
    fill('dimgray');
    textSize(12);
    text("Rate each criterion 1-5, then click \"Show Expert\" to compare.", margin, scoreY);
  }

  // Legend
  if (showExpert) {
    let legendY = scoreY + 22;
    fill('steelblue');
    noStroke();
    rect(margin, legendY, 14, 14, 2);
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text("Your Rating", margin + 20, legendY + 7);

    stroke('crimson');
    strokeWeight(3);
    line(margin + 110, legendY + 2, margin + 110, legendY + 12);
    noStroke();
    fill('crimson');
    text("Expert Rating", margin + 118, legendY + 7);
  }

  // Slider labels in control area
  let controlY = drawHeight + 10;
  let rowHeight = 30;
  let sliderLabelLeft = margin;

  noStroke();
  fill('black');
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i < 6; i++) {
    let y = controlY + rowHeight * (i + 1) + 5 + 10;
    text(criteriaNames[i] + ":", sliderLabelLeft + labelWidth - 8, y);

    // Value display next to slider
    textAlign(LEFT, CENTER);
    fill('black');
    let valX = canvasWidth - margin - 20;
    text(sliders[i].value(), valX, y);
    textAlign(RIGHT, CENTER);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Reposition controls
  let controlY = drawHeight + 10;
  let labelWidth = 110;
  let sliderLeft = margin + labelWidth;
  let rowHeight = 30;

  sourceSelect.position(margin, controlY);
  sourceSelect.size(canvasWidth * 0.55, 24);
  showExpertButton.position(canvasWidth * 0.55 + margin + 10, controlY);
  showExpertButton.size(canvasWidth * 0.35, 24);

  for (let i = 0; i < 6; i++) {
    let y = controlY + rowHeight * (i + 1) + 5;
    sliders[i].position(sliderLeft, y);
    sliders[i].size(canvasWidth - sliderLeft - margin - 30, 20);
  }
}

function updateCanvasSize() {
  let main = document.querySelector('main');
  if (main) {
    containerWidth = main.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(containerWidth, 300);
}
