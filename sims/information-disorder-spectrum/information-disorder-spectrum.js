// Information Disorder Spectrum - Classification Exercise
// CANVAS_HEIGHT: 520
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = 520;

let examples = [
  {text: "A grandmother shares a fake health tip on Facebook, believing it to be true.", answer: "Misinformation", explanation: "Shared without intent to deceive — the sharer genuinely believes it."},
  {text: "A government agency creates fake social media accounts to spread false stories about an opposition leader.", answer: "Disinformation", explanation: "Deliberately false content created with intent to deceive and manipulate."},
  {text: "A news outlet publishes a politician's real but private medical records to damage their campaign.", answer: "Malinformation", explanation: "True information shared with malicious intent to cause harm."},
  {text: "A state-run media channel repeatedly broadcasts one-sided coverage to promote the ruling party.", answer: "Propaganda", explanation: "Systematic effort to shape perception using biased or misleading information."},
  {text: "A student misquotes a statistic in a class presentation, having misread the original source.", answer: "Misinformation", explanation: "An honest mistake — false information spread without intent to deceive."},
  {text: "A company creates a fake grassroots campaign to oppose environmental regulations.", answer: "Disinformation", explanation: "Deliberately manufactured to appear organic while serving corporate interests."},
  {text: "A journalist publishes leaked emails that reveal corporate corruption.", answer: "Malinformation", explanation: "True information, but the leak was motivated by revenge rather than public interest."},
  {text: "A wartime government poster urges citizens to buy war bonds with emotional imagery.", answer: "Propaganda", explanation: "Government-sponsored persuasion using emotional appeals rather than balanced information."},
  {text: "An AI chatbot confidently provides incorrect historical dates in response to a student's question.", answer: "Misinformation", explanation: "The AI has no intent — it generates plausible but false information."},
  {text: "A political party edits a video to make an opponent appear to say something they didn't.", answer: "Disinformation", explanation: "Deliberately manipulated media designed to deceive viewers."}
];

let currentIndex = 0;
let score = 0;
let answered = false;
let selectedAnswer = "";
let isCorrect = false;
let gameOver = false;
let nextButton;
let categoryButtons = [];
let categoryNames = ["Misinformation", "Disinformation", "Malinformation", "Propaganda"];
let categoryColors;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  categoryColors = {
    "Misinformation": color(0, 128, 128),
    "Disinformation": color(255, 127, 80),
    "Malinformation": color(255, 191, 0),
    "Propaganda": color(147, 112, 219)
  };

  // Create category buttons
  for (let i = 0; i < categoryNames.length; i++) {
    let btn = createButton(categoryNames[i]);
    btn.parent(document.querySelector('main'));
    btn.style('font-size', '15px');
    btn.style('padding', '10px 16px');
    btn.style('border', 'none');
    btn.style('border-radius', '8px');
    btn.style('cursor', 'pointer');
    btn.style('font-weight', 'bold');
    btn.style('color', 'white');
    let c = categoryColors[categoryNames[i]];
    btn.style('background-color', `rgb(${red(c)},${green(c)},${blue(c)})`);
    let name = categoryNames[i];
    btn.mousePressed(() => checkAnswer(name));
    categoryButtons.push(btn);
  }

  // Next button
  nextButton = createButton('Next →');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.style('padding', '8px 20px');
  nextButton.style('border', '2px solid steelblue');
  nextButton.style('border-radius', '6px');
  nextButton.style('cursor', 'pointer');
  nextButton.style('background-color', 'white');
  nextButton.style('color', 'steelblue');
  nextButton.style('font-weight', 'bold');
  nextButton.mousePressed(nextExample);
  nextButton.hide();

  describe('Classification exercise for types of information disorder with example cards and category buttons.');
}

function draw() {
  // Draw area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, width, drawHeight);

  // Control area background
  fill('silver');
  rect(0, drawHeight, width, controlHeight);

  let margin = 20;
  let usableWidth = width - margin * 2;

  if (gameOver) {
    drawFinalScreen(margin, usableWidth);
    positionControlsFinal(margin, usableWidth);
    return;
  }

  // Title
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Information Disorder Spectrum', width / 2, 12);

  // Progress bar
  let barX = margin;
  let barY = 40;
  let barW = usableWidth;
  let barH = 10;
  noStroke();
  fill(220);
  rect(barX, barY, barW, barH, 5);
  let progressColor = color(0, 128, 128);
  fill(progressColor);
  rect(barX, barY, barW * (currentIndex / examples.length), barH, 5);

  // Progress text
  fill(120);
  textSize(12);
  textStyle(NORMAL);
  textAlign(RIGHT, CENTER);
  text(`${currentIndex + 1} of ${examples.length}`, width - margin, barY + barH + 14);

  // Example card
  let cardX = margin;
  let cardY = 72;
  let cardW = usableWidth;
  let cardH = 120;
  fill(255);
  stroke(200);
  strokeWeight(1);
  rect(cardX, cardY, cardW, cardH, 10);

  noStroke();
  fill(80);
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(NORMAL);
  textWrap(WORD);
  text(examples[currentIndex].text, cardX + 16, cardY + 16, cardW - 32);

  // Category label
  fill(120);
  textSize(12);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  text('Classify this example:', width / 2, cardY + cardH + 12);

  // Position category buttons
  let btnY = cardY + cardH + 32;
  positionCategoryButtons(margin, usableWidth, btnY);

  // Feedback area
  if (answered) {
    let feedbackY = btnY + 55;
    let feedbackH = drawHeight - feedbackY - 10;
    if (feedbackH < 60) feedbackH = 60;

    noStroke();
    if (isCorrect) {
      fill(230, 255, 230);
    } else {
      fill(255, 230, 230);
    }
    rect(margin, feedbackY, usableWidth, feedbackH, 10);

    // Feedback header
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    textStyle(BOLD);
    if (isCorrect) {
      fill(0, 128, 0);
      text('✓ Correct!', margin + 14, feedbackY + 12);
    } else {
      fill(180, 0, 0);
      text('✗ Not quite — the answer is ' + examples[currentIndex].answer, margin + 14, feedbackY + 12);
    }

    // Explanation
    textStyle(NORMAL);
    textSize(13);
    fill(60);
    textWrap(WORD);
    text(examples[currentIndex].explanation, margin + 14, feedbackY + 36, usableWidth - 28);
  }

  // Control area: score display
  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('Score: ' + score + ' / ' + examples.length, margin, drawHeight + controlHeight / 2);

  // Position next button in control area
  if (answered) {
    nextButton.position(width - margin - 90, drawHeight + (controlHeight - 36) / 2);
    nextButton.show();
  } else {
    nextButton.hide();
  }
}

function positionCategoryButtons(margin, usableWidth, btnY) {
  let totalBtns = categoryButtons.length;
  let gap = 10;
  let btnW = (usableWidth - gap * (totalBtns - 1)) / totalBtns;
  if (btnW > 160) btnW = 160;
  let totalW = btnW * totalBtns + gap * (totalBtns - 1);
  let startX = margin + (usableWidth - totalW) / 2;

  for (let i = 0; i < totalBtns; i++) {
    let bx = startX + i * (btnW + gap);
    categoryButtons[i].position(bx, btnY);
    categoryButtons[i].style('width', btnW + 'px');

    if (answered) {
      categoryButtons[i].attribute('disabled', '');
      categoryButtons[i].style('opacity', '0.5');
      categoryButtons[i].style('cursor', 'default');
    } else {
      categoryButtons[i].removeAttribute('disabled');
      categoryButtons[i].style('opacity', '1');
      categoryButtons[i].style('cursor', 'pointer');
    }
  }
}

function checkAnswer(selected) {
  if (answered || gameOver) return;
  answered = true;
  selectedAnswer = selected;
  isCorrect = selected === examples[currentIndex].answer;
  if (isCorrect) score++;
}

function nextExample() {
  currentIndex++;
  answered = false;
  selectedAnswer = "";
  isCorrect = false;
  nextButton.hide();

  if (currentIndex >= examples.length) {
    gameOver = true;
    // Hide category buttons
    for (let btn of categoryButtons) {
      btn.hide();
    }
  }
}

function drawFinalScreen(margin, usableWidth) {
  noStroke();
  fill(50);
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  text('Exercise Complete!', width / 2, 30);

  // Score circle
  let cx = width / 2;
  let cy = 140;
  let r = 70;
  let pct = score / examples.length;

  // Background circle
  noFill();
  stroke(220);
  strokeWeight(8);
  arc(cx, cy, r * 2, r * 2, -HALF_PI, -HALF_PI + TWO_PI);

  // Score arc
  if (pct >= 0.7) {
    stroke(0, 180, 0);
  } else if (pct >= 0.4) {
    stroke(255, 191, 0);
  } else {
    stroke(220, 50, 50);
  }
  strokeWeight(8);
  arc(cx, cy, r * 2, r * 2, -HALF_PI, -HALF_PI + TWO_PI * pct);

  // Score text
  noStroke();
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  text(score + '/' + examples.length, cx, cy - 6);
  textSize(13);
  textStyle(NORMAL);
  fill(120);
  text(Math.round(pct * 100) + '%', cx, cy + 18);

  // Message
  let msg;
  if (pct === 1) msg = "Perfect score! You can distinguish all forms of information disorder.";
  else if (pct >= 0.7) msg = "Great work! You have a solid grasp of information disorder types.";
  else if (pct >= 0.4) msg = "Good effort! Review the differences between these categories.";
  else msg = "Keep studying! Understanding information disorder is a vital skill.";

  noStroke();
  fill(80);
  textAlign(CENTER, TOP);
  textSize(15);
  textStyle(NORMAL);
  textWrap(WORD);
  text(msg, margin + 20, cy + r + 30, usableWidth - 40);

  // Legend
  let legendY = cy + r + 80;
  let legendItems = categoryNames;
  let lx = margin + 20;

  textAlign(LEFT, CENTER);
  textSize(13);
  textStyle(BOLD);
  fill(80);
  noStroke();
  text('Categories:', lx, legendY);
  legendY += 24;

  textStyle(NORMAL);
  for (let i = 0; i < legendItems.length; i++) {
    let c = categoryColors[legendItems[i]];
    fill(c);
    noStroke();
    rect(lx, legendY + i * 22 - 5, 12, 12, 3);
    fill(60);
    text(legendItems[i], lx + 20, legendY + i * 22);
  }
}

function positionControlsFinal(margin, usableWidth) {
  // Show restart button in control area
  nextButton.html('Restart');
  nextButton.mousePressed(() => {
    currentIndex = 0;
    score = 0;
    answered = false;
    selectedAnswer = "";
    isCorrect = false;
    gameOver = false;
    nextButton.html('Next →');
    nextButton.mousePressed(nextExample);
    for (let btn of categoryButtons) {
      btn.show();
    }
  });
  nextButton.position(width - margin - 90, drawHeight + (controlHeight - 36) / 2);
  nextButton.show();

  // Score in control area
  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text('Score: ' + score + ' / ' + examples.length, margin, drawHeight + controlHeight / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, canvasHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = mainEl ? mainEl.offsetWidth : windowWidth;
}
