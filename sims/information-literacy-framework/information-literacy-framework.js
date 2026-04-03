// Information Literacy Framework - Step-by-step source evaluation
// CANVAS_HEIGHT: 520
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = 520;

let sourceSelect;
let prevBtn;
let nextBtn;
let currentStep = 0; // 0-4 for criteria, 5 for summary

let criteria = ['Authority', 'Accuracy', 'Purpose', 'Currency', 'Relevance'];

let questions = {
  Authority: 'Who created this source? What are their credentials?',
  Accuracy: 'Is the information supported by evidence? Can it be verified?',
  Purpose: 'Why was this source created? To inform, persuade, sell, or entertain?',
  Currency: 'When was this published or last updated? Is the information still valid?',
  Relevance: 'Does this source address your research question directly?'
};

let sources = {
  'Peer-reviewed journal article on climate change': {
    authority: {score: 5, detail: 'Written by climate scientists, peer-reviewed, published in Nature'},
    accuracy: {score: 5, detail: 'Data-driven, transparent methodology, reproducible results'},
    purpose: {score: 4, detail: 'To inform and advance scientific knowledge; some funding bias possible'},
    currency: {score: 4, detail: 'Published 2024, using data through 2023'},
    relevance: {score: 5, detail: 'Directly addresses the research question'}
  },
  'Celebrity Instagram post about nutrition': {
    authority: {score: 1, detail: 'No nutritional qualifications, large following but no expertise'},
    accuracy: {score: 2, detail: 'Anecdotal claims, no citations, contradicts scientific consensus'},
    purpose: {score: 2, detail: 'Primarily promotional — may be a paid endorsement'},
    currency: {score: 5, detail: 'Posted yesterday — very current'},
    relevance: {score: 3, detail: 'Addresses nutrition but not from a knowledge perspective'}
  },
  'Wikipedia article on the French Revolution': {
    authority: {score: 3, detail: 'Crowd-sourced, but well-cited with professional editor oversight'},
    accuracy: {score: 3, detail: 'Generally accurate but can contain errors; check cited sources'},
    purpose: {score: 4, detail: 'To inform — non-profit educational mission'},
    currency: {score: 4, detail: 'Regularly updated by community editors'},
    relevance: {score: 4, detail: 'Good overview but secondary source — follow citations to primaries'}
  }
};

let sourceNames;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  sourceNames = Object.keys(sources);

  // Controls row
  sourceSelect = createSelect();
  sourceSelect.parent(document.querySelector('main'));
  for (let name of sourceNames) {
    sourceSelect.option(name);
  }
  sourceSelect.style('font-size', '14px');
  sourceSelect.style('padding', '4px');
  sourceSelect.style('background', 'white');
  sourceSelect.changed(() => { currentStep = 0; });

  prevBtn = createButton('Previous');
  prevBtn.parent(document.querySelector('main'));
  prevBtn.style('font-size', '14px');
  prevBtn.style('padding', '4px 12px');
  prevBtn.style('background', 'white');
  prevBtn.mousePressed(() => {
    if (currentStep > 0) currentStep--;
  });

  nextBtn = createButton('Next');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.style('font-size', '14px');
  nextBtn.style('padding', '4px 12px');
  nextBtn.style('background', 'white');
  nextBtn.mousePressed(() => {
    if (currentStep < 5) currentStep++;
  });

  describe('Information literacy framework that guides students through evaluating sources using five criteria with star ratings.');
}

function draw() {
  // Draw area background
  fill('aliceblue');
  noStroke();
  rect(0, 0, width, drawHeight);

  // Control area background
  fill('silver');
  rect(0, drawHeight, width, controlHeight);

  let selectedSource = sourceSelect.value();
  let sourceData = sources[selectedSource];
  let margin = 20;
  let contentWidth = width - margin * 2;

  // Title: Source name
  noStroke();
  fill(30);
  textSize(16);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Source Evaluation', margin, 12);

  textStyle(NORMAL);
  textSize(13);
  fill(60);
  text(selectedSource, margin, 34);

  // Step indicator
  textSize(12);
  fill(100);
  textAlign(RIGHT, TOP);
  if (currentStep < 5) {
    text('Step ' + (currentStep + 1) + ' of 5', width - margin, 14);
  } else {
    text('Summary', width - margin, 14);
  }

  // Progress bar
  let barY = 58;
  let barH = 6;
  fill(220);
  rect(margin, barY, contentWidth, barH, 3);
  let progressColor = currentStep < 5 ? color('steelblue') : color('seagreen');
  fill(progressColor);
  let progressW = map(currentStep < 5 ? currentStep + 1 : 5, 0, 5, 0, contentWidth);
  rect(margin, barY, progressW, barH, 3);

  // Step dots
  for (let i = 0; i < 5; i++) {
    let dotX = margin + (contentWidth / 4) * i;
    if (i <= currentStep) {
      fill(progressColor);
    } else {
      fill(200);
    }
    ellipse(dotX + contentWidth / 8 - contentWidth / 8 * 0, barY + barH / 2, 0, 0);
  }

  if (currentStep < 5) {
    drawCriterionStep(sourceData, margin, contentWidth);
  } else {
    drawSummary(sourceData, margin, contentWidth);
  }

  // Position controls
  let controlY = drawHeight + 15;
  sourceSelect.position(margin, controlY);
  sourceSelect.size(min(contentWidth - 200, 340), 28);
  prevBtn.position(width - margin - 150, controlY);
  nextBtn.position(width - margin - 65, controlY);

  // Disable/enable buttons
  if (currentStep === 0) {
    prevBtn.attribute('disabled', '');
  } else {
    prevBtn.removeAttribute('disabled');
  }
  if (currentStep === 5) {
    nextBtn.attribute('disabled', '');
  } else {
    nextBtn.removeAttribute('disabled');
  }
}

function drawCriterionStep(sourceData, margin, contentWidth) {
  let criterionName = criteria[currentStep];
  let key = criterionName.toLowerCase();
  let data = sourceData[key];
  let question = questions[criterionName];
  let startY = 80;

  // Criterion label with icon
  let icons = ['👤', '✓', '🎯', '🕐', '📌'];
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  fill('steelblue');
  text(icons[currentStep] + '  ' + criterionName, margin, startY);

  // Question prompt
  textStyle(ITALIC);
  textSize(14);
  fill(80);
  text(question, margin, startY + 36, contentWidth, 40);

  // Detail box
  let boxY = startY + 85;
  let boxH = 70;
  fill(245, 248, 255);
  stroke(180, 200, 230);
  strokeWeight(1);
  rect(margin, boxY, contentWidth, boxH, 8);

  noStroke();
  fill(50);
  textStyle(NORMAL);
  textSize(14);
  text(data.detail, margin + 14, boxY + 14, contentWidth - 28, boxH - 28);

  // Star rating
  let starY = boxY + boxH + 30;
  noStroke();
  textStyle(BOLD);
  textSize(15);
  fill(60);
  text('Rating:', margin, starY);

  drawStars(margin + 70, starY - 2, data.score, 28);

  textStyle(NORMAL);
  textSize(14);
  fill(100);
  text(data.score + ' / 5', margin + 70 + 28 * 5 + 10, starY + 2);

  // Rating bar
  let ratingBarY = starY + 40;
  let ratingBarW = contentWidth * 0.6;
  fill(230);
  rect(margin, ratingBarY, ratingBarW, 14, 7);
  let ratingColor = getRatingColor(data.score);
  fill(ratingColor);
  rect(margin, ratingBarY, ratingBarW * (data.score / 5), 14, 7);

  // Rating label
  textSize(13);
  fill(ratingColor);
  textStyle(BOLD);
  let labels = ['', 'Poor', 'Weak', 'Moderate', 'Good', 'Excellent'];
  text(labels[data.score], margin + ratingBarW + 12, ratingBarY - 1);

  // Mini rubric showing all 5 criteria progress
  let rubricY = ratingBarY + 50;
  drawMiniRubric(sourceData, margin, rubricY, contentWidth, currentStep);
}

function drawSummary(sourceData, margin, contentWidth) {
  let startY = 78;

  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(20);
  fill('seagreen');
  text('Overall Evaluation Summary', margin, startY);

  // Calculate average
  let total = 0;
  for (let c of criteria) {
    total += sourceData[c.toLowerCase()].score;
  }
  let avg = total / 5;

  // Rating bars for each criterion
  let barStartY = startY + 40;
  let barSpacing = 52;
  let labelW = 90;
  let barW = contentWidth - labelW - 100;

  for (let i = 0; i < 5; i++) {
    let key = criteria[i].toLowerCase();
    let score = sourceData[key].score;
    let y = barStartY + i * barSpacing;

    // Label
    noStroke();
    textStyle(BOLD);
    textSize(13);
    fill(60);
    textAlign(LEFT, TOP);
    text(criteria[i], margin, y + 2);

    // Bar background
    fill(230);
    rect(margin + labelW, y, barW, 18, 9);

    // Bar fill
    let barColor = getRatingColor(score);
    fill(barColor);
    rect(margin + labelW, y, barW * (score / 5), 18, 9);

    // Stars
    drawStars(margin + labelW + barW + 10, y - 2, score, 18);

    // Score text
    textStyle(NORMAL);
    textSize(12);
    fill(100);
    textAlign(LEFT, TOP);
    text(score + '/5', margin + labelW + barW + 10 + 18 * 5 + 5, y + 2);
  }

  // Overall score
  let overallY = barStartY + 5 * barSpacing + 10;
  stroke(180);
  strokeWeight(1);
  line(margin, overallY, margin + contentWidth, overallY);

  noStroke();
  textStyle(BOLD);
  textSize(18);
  let overallColor = getRatingColor(Math.round(avg));
  fill(overallColor);
  textAlign(LEFT, TOP);
  text('Overall Score: ' + avg.toFixed(1) + ' / 5.0', margin, overallY + 14);

  drawStars(margin + 240, overallY + 12, Math.round(avg), 24);

  // Verdict
  textStyle(NORMAL);
  textSize(14);
  fill(80);
  let verdict;
  if (avg >= 4.5) verdict = 'Highly credible source — excellent for academic use.';
  else if (avg >= 3.5) verdict = 'Generally reliable — use with some caution, verify key claims.';
  else if (avg >= 2.5) verdict = 'Mixed reliability — cross-reference with stronger sources.';
  else verdict = 'Low credibility — not suitable as a primary source.';
  text(verdict, margin, overallY + 44, contentWidth, 40);
}

function drawStars(x, y, filledCount, size) {
  textSize(size);
  textAlign(LEFT, TOP);
  noStroke();
  for (let i = 0; i < 5; i++) {
    if (i < filledCount) {
      fill('gold');
    } else {
      fill(210);
    }
    text('★', x + i * size, y);
  }
}

function drawMiniRubric(sourceData, margin, y, contentWidth, activeIndex) {
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  fill(140);
  text('Evaluation Progress', margin, y);

  let dotY = y + 20;
  let spacing = contentWidth / 5;

  for (let i = 0; i < 5; i++) {
    let cx = margin + spacing * i + spacing / 2;
    let key = criteria[i].toLowerCase();
    let score = sourceData[key].score;

    // Circle
    if (i < activeIndex) {
      fill(getRatingColor(score));
    } else if (i === activeIndex) {
      fill('steelblue');
    } else {
      fill(210);
    }
    ellipse(cx, dotY + 12, 28, 28);

    // Score or step number inside circle
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    if (i <= activeIndex) {
      text(score, cx, dotY + 12);
    } else {
      text(i + 1, cx, dotY + 12);
    }

    // Label below
    textAlign(CENTER, TOP);
    textSize(10);
    textStyle(NORMAL);
    if (i <= activeIndex) {
      fill(60);
    } else {
      fill(170);
    }
    text(criteria[i], cx, dotY + 30);
  }

  // Connecting lines
  stroke(200);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    let x1 = margin + spacing * i + spacing / 2 + 16;
    let x2 = margin + spacing * (i + 1) + spacing / 2 - 16;
    if (i < activeIndex) {
      stroke(getRatingColor(sourceData[criteria[i].toLowerCase()].score));
    } else {
      stroke(210);
    }
    line(x1, dotY + 12, x2, dotY + 12);
  }
  noStroke();
}

function getRatingColor(score) {
  if (score >= 5) return color(46, 139, 87);    // seagreen
  if (score >= 4) return color(60, 150, 90);     // green
  if (score >= 3) return color(200, 160, 40);     // amber
  if (score >= 2) return color(210, 120, 50);     // orange
  return color(190, 60, 60);                       // red
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  canvasWidth = container ? container.offsetWidth : 600;
  if (canvasWidth < 400) canvasWidth = 400;
}
