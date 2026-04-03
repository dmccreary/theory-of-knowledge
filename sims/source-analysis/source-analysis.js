// Source Evaluation Tool MicroSim
// Evaluate primary and secondary historical sources on 5 criteria

let canvasWidth = 400;
const CANVAS_HEIGHT = 520;
const drawHeight = 460;
const controlHeight = 60;

let sourceSelect;
let selectedCriterion = -1; // which criterion is expanded, -1 = none

const sources = {
  "Diary of Anne Frank (1944)": {
    type: "Primary",
    provenance: { score: 5, text: "Written by Anne Frank while in hiding" },
    purpose: { score: 4, text: "Personal reflection, not intended for publication" },
    value: { score: 5, text: "First-hand account of Jewish experience under occupation" },
    limitations: { score: 3, text: "Single perspective, edited by father after war" },
    perspective: { score: 4, text: "Young Jewish girl's viewpoint — vivid but limited in scope" }
  },
  "Textbook on World War II (2020)": {
    type: "Secondary",
    provenance: { score: 4, text: "Published by academic press, authored by historian" },
    purpose: { score: 3, text: "Educational — synthesizes many sources but may oversimplify" },
    value: { score: 4, text: "Broad overview with multiple perspectives" },
    limitations: { score: 3, text: "May reflect author's national perspective, compressed timeline" },
    perspective: { score: 3, text: "Western academic viewpoint, may underrepresent non-Western perspectives" }
  },
  "Propaganda Poster (1942)": {
    type: "Primary",
    provenance: { score: 5, text: "Government-issued war propaganda" },
    purpose: { score: 2, text: "Persuasion — designed to influence public opinion, not inform" },
    value: { score: 4, text: "Reveals government messaging strategy and social values" },
    limitations: { score: 2, text: "Deliberately biased, not factual reporting" },
    perspective: { score: 2, text: "Official government position — excludes dissenting views" }
  }
};

const criteriaKeys = ["provenance", "purpose", "value", "limitations", "perspective"];
const criteriaLabels = ["Provenance", "Purpose", "Value", "Limitations", "Perspective"];

function updateCanvasSize() {
  canvasWidth = min(select('main').elt.getBoundingClientRect().width, 600);
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Source dropdown
  sourceSelect = createSelect();
  sourceSelect.parent(document.querySelector('main'));
  for (let name of Object.keys(sources)) {
    sourceSelect.option(name);
  }
  sourceSelect.style('font-size', '14px');
  sourceSelect.style('padding', '4px 8px');
  sourceSelect.style('background-color', 'white');
  sourceSelect.style('margin-top', '6px');

  describe('Source evaluation tool showing star ratings for five criteria of historical sources.');
}

function draw() {
  background('aliceblue');

  let src = sources[sourceSelect.value()];
  let margin = 20;
  let usableWidth = canvasWidth - margin * 2;

  // Title area
  noStroke();
  fill('steelblue');
  textSize(18);
  textAlign(CENTER, TOP);
  text(sourceSelect.value(), canvasWidth / 2, 14);

  // Source type badge
  let badgeColor = src.type === "Primary" ? 'teal' : 'slateblue';
  let badgeText = src.type + " Source";
  textSize(13);
  let badgeW = textWidth(badgeText) + 20;
  let badgeX = canvasWidth / 2 - badgeW / 2;
  let badgeY = 40;
  fill(badgeColor);
  rect(badgeX, badgeY, badgeW, 24, 12);
  fill('white');
  textAlign(CENTER, CENTER);
  text(badgeText, canvasWidth / 2, badgeY + 11);

  // Criteria bars
  let barStartY = 80;
  let barHeight = 44;
  let expandedHeight = 78;
  let gap = 6;
  let currentY = barStartY;

  for (let i = 0; i < criteriaKeys.length; i++) {
    let key = criteriaKeys[i];
    let label = criteriaLabels[i];
    let criterion = src[key];
    let score = criterion.score;
    let isExpanded = (selectedCriterion === i);
    let rowHeight = isExpanded ? expandedHeight : barHeight;

    // Score color: teal for high, coral for low
    let r = map(score, 1, 5, 240, 60);
    let g = map(score, 1, 5, 128, 180);
    let b = map(score, 1, 5, 128, 170);

    // Background bar
    fill(r, g, b, 40);
    stroke(r, g, b, 100);
    strokeWeight(1);
    rect(margin, currentY, usableWidth, rowHeight, 8);

    // Label
    noStroke();
    fill(50);
    textSize(14);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(label, margin + 12, currentY + 16);
    textStyle(NORMAL);

    // Stars
    let starX = margin + 130;
    let starY = currentY + 16;
    drawStars(starX, starY, score, r, g, b);

    // Score text
    fill(80);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(score + "/5", margin + usableWidth - 12, currentY + 16);

    // Expanded text
    if (isExpanded) {
      fill(60);
      textSize(12);
      textAlign(LEFT, TOP);
      let txtX = margin + 14;
      let txtY = currentY + 34;
      let txtW = usableWidth - 28;
      text(criterion.text, txtX, txtY, txtW, 40);
    }

    // Click hint
    if (!isExpanded) {
      fill(150);
      textSize(10);
      textAlign(RIGHT, CENTER);
      text("click to expand", margin + usableWidth - 12, currentY + 34);
    }

    // Store row bounds for click detection
    criteriaRows[i] = { y: currentY, h: rowHeight };

    currentY += rowHeight + gap;
  }

  // Overall reliability score
  let totalScore = 0;
  for (let key of criteriaKeys) {
    totalScore += src[key].score;
  }
  let avgScore = totalScore / criteriaKeys.length;

  let scoreY = currentY + 10;

  // Score bar background
  noStroke();
  fill('silver');
  rect(margin, scoreY, usableWidth, 36, 8);

  // Score bar fill
  let fillW = map(avgScore, 0, 5, 0, usableWidth);
  let scoreR = map(avgScore, 1, 5, 240, 60);
  let scoreG = map(avgScore, 1, 5, 128, 180);
  let scoreB = map(avgScore, 1, 5, 128, 170);
  fill(scoreR, scoreG, scoreB, 180);
  rect(margin, scoreY, fillW, 36, 8);

  // Score text
  fill(30);
  textSize(15);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Overall Reliability: " + avgScore.toFixed(1) + " / 5.0", canvasWidth / 2, scoreY + 17);
  textStyle(NORMAL);

  // Divider line
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Control area label
  noStroke();
  fill(80);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Select a source:", margin, drawHeight + 20);
}

let criteriaRows = [{}, {}, {}, {}, {}];

function drawStars(x, y, score, r, g, b) {
  for (let i = 0; i < 5; i++) {
    if (i < score) {
      fill(r, g, b);
    } else {
      fill(210);
    }
    drawStar(x + i * 22, y, 8, 4, 5);
  }
}

function drawStar(cx, cy, outerR, innerR, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  noStroke();
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    let sx = cx + cos(a) * outerR;
    let sy = cy + sin(a) * outerR;
    vertex(sx, sy);
    sx = cx + cos(a + halfAngle) * innerR;
    sy = cy + sin(a + halfAngle) * innerR;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  let margin = 20;
  let usableWidth = canvasWidth - margin * 2;

  for (let i = 0; i < criteriaRows.length; i++) {
    let row = criteriaRows[i];
    if (mouseX >= margin && mouseX <= margin + usableWidth &&
        mouseY >= row.y && mouseY <= row.y + row.h) {
      if (selectedCriterion === i) {
        selectedCriterion = -1;
      } else {
        selectedCriterion = i;
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, CANVAS_HEIGHT);
}
