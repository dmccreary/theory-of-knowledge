// Fallacy Identification Quiz MicroSim
// CANVAS_HEIGHT: 560
// Bloom Level: Apply (L3) - Students classify arguments by logical fallacy
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 490;
let controlHeight = 70;
let canvasHeight = 560;
let containerHeight = canvasHeight;
let margin = 15;
let defaultTextSize = 16;

// Quiz data
let arguments = [
  {text: "You can't trust Dr. Smith's climate research — she once got a parking ticket!", fallacy: "Ad Hominem", difficulty: "basic", hint: "attacking the person", explanation: "Attacks the researcher's character rather than addressing her evidence."},
  {text: "My opponent says we should reduce military spending. Clearly, he wants our country to be defenseless!", fallacy: "Straw Man", difficulty: "basic", hint: "misrepresenting the argument", explanation: "Exaggerates the position into an extreme version that wasn't actually argued."},
  {text: "Either you support this policy completely, or you don't care about children.", fallacy: "False Dilemma", difficulty: "basic", hint: "only two options presented", explanation: "Presents only two extreme options when many moderate positions exist."},
  {text: "God exists because the Bible says so, and the Bible is true because it's the word of God.", fallacy: "Circular Reasoning", difficulty: "basic", hint: "the conclusion is in the premise", explanation: "The conclusion is assumed in the premise — no independent support."},
  {text: "We've always done it this way, so we shouldn't change now.", fallacy: "Appeal to Authority", difficulty: "basic", hint: "tradition as authority", explanation: "Appeals to tradition rather than providing evidence for why the practice is good."},
  {text: "But what about the time YOU were late to class? You can't criticize my attendance!", fallacy: "Tu Quoque", difficulty: "basic", hint: "you did it too", explanation: "Deflects criticism by pointing to the accuser's similar behavior instead of addressing the issue."},
  {text: "If we allow students to use calculators, next they'll stop learning math entirely, and soon no one will be able to add!", fallacy: "Slippery Slope", difficulty: "intermediate", hint: "chain of unlikely consequences", explanation: "Assumes an extreme chain of consequences without evidence for each step."},
  {text: "Many people believe this herbal remedy works, so it must be effective.", fallacy: "Appeal to Authority", difficulty: "intermediate", hint: "popular opinion as proof", explanation: "Appeals to popularity rather than evidence — many people believing something doesn't make it true."},
  {text: "We're discussing climate policy, and I think we should also talk about the economy.", fallacy: "Red Herring", difficulty: "intermediate", hint: "changing the subject", explanation: "Introduces an unrelated topic to divert attention from the original issue."},
  {text: "You haven't proven that ghosts DON'T exist, so they must be real.", fallacy: "Burden of Proof", difficulty: "intermediate", hint: "shifting who must prove", explanation: "Shifts the burden of proof to the skeptic rather than providing evidence for the claim."},
  {text: "Professor Williams says homeopathy works, and she has a PhD.", fallacy: "Appeal to Authority", difficulty: "intermediate", hint: "authority outside their field", explanation: "The authority's expertise is not in the relevant field — a PhD doesn't make someone an expert in everything."},
  {text: "My horoscope said I'd have a good day, and I did! Astrology works!", fallacy: "Circular Reasoning", difficulty: "intermediate", hint: "confirmation after the fact", explanation: "Selectively confirms the prediction while ignoring days it was wrong."},
  {text: "If evolution were true, why are there still monkeys?", fallacy: "Straw Man", difficulty: "advanced", hint: "misunderstanding the claim", explanation: "Misrepresents evolutionary theory — evolution doesn't claim humans descended from modern monkeys."},
  {text: "The politician's tax plan will help the middle class because she genuinely cares about working families.", fallacy: "Red Herring", difficulty: "advanced", hint: "motivation vs evidence", explanation: "Her motivation doesn't address whether the plan will actually work — it's an emotional deflection."},
  {text: "Studies show coffee is bad for you. Other studies show it's good. Therefore, science knows nothing about nutrition.", fallacy: "False Dilemma", difficulty: "advanced", hint: "all or nothing thinking", explanation: "Assumes science must give absolute answers or know nothing — ignores nuance and probability."},
  {text: "You're not a doctor, so you can't possibly understand why vaccines are important.", fallacy: "Ad Hominem", difficulty: "advanced", hint: "dismissing based on credentials", explanation: "Dismisses the argument based on the person's lack of credentials rather than addressing their reasoning."},
  {text: "Society survived for thousands of years without the internet. Why do we suddenly 'need' it now?", fallacy: "Burden of Proof", difficulty: "advanced", hint: "past as proof", explanation: "Implies that because something wasn't needed before, its current value needs extraordinary justification."},
  {text: "If we legalize any recreational drugs, society will collapse into chaos.", fallacy: "Slippery Slope", difficulty: "advanced", hint: "extreme predicted outcome", explanation: "Jumps to an extreme conclusion without evidence for the intermediate steps."}
];

let fallacyNames = [
  "Ad Hominem", "Straw Man", "False Dilemma",
  "Circular Reasoning", "Appeal to Authority", "Tu Quoque",
  "Slippery Slope", "Red Herring", "Burden of Proof"
];

// State
let currentDifficulty = "all";
let filteredArgs = [];
let currentIndex = 0;
let score = 0;
let totalAnswered = 0;
let selectedAnswer = "";
let showFeedback = false;
let showHint = false;
let quizComplete = false;
let reviewMode = false;
let missedQuestions = [];
let reviewIndex = 0;
let feedbackTimer = 0;
let isCorrect = false;

// Colors
let cardBg, correctGreen, wrongRed, buttonColor, buttonHover, highlightYellow;

// Controls
let difficultySelect, hintButton, nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Colors
  cardBg = color(255, 255, 255);
  correctGreen = color(46, 139, 87);
  wrongRed = color(205, 60, 60);
  buttonColor = color(70, 130, 180);
  buttonHover = color(50, 110, 160);
  highlightYellow = color(255, 243, 176);

  // Difficulty selector
  difficultySelect = createSelect();
  difficultySelect.parent(document.querySelector('main'));
  difficultySelect.option('All Levels', 'all');
  difficultySelect.option('Basic', 'basic');
  difficultySelect.option('Intermediate', 'intermediate');
  difficultySelect.option('Advanced', 'advanced');
  difficultySelect.selected('all');
  difficultySelect.changed(onDifficultyChange);
  difficultySelect.style('font-size', '14px');
  difficultySelect.style('padding', '4px 8px');
  difficultySelect.style('background-color', 'white');
  difficultySelect.style('border', '1px solid silver');
  difficultySelect.style('border-radius', '4px');

  // Hint button
  hintButton = createButton('Hint');
  hintButton.parent(document.querySelector('main'));
  hintButton.mousePressed(toggleHint);
  hintButton.style('font-size', '14px');
  hintButton.style('padding', '4px 16px');
  hintButton.style('background-color', 'goldenrod');
  hintButton.style('color', 'white');
  hintButton.style('border', 'none');
  hintButton.style('border-radius', '4px');
  hintButton.style('cursor', 'pointer');

  // Next button
  nextButton = createButton('Next');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(advanceQuestion);
  nextButton.style('font-size', '14px');
  nextButton.style('padding', '4px 16px');
  nextButton.style('background-color', 'steelblue');
  nextButton.style('color', 'white');
  nextButton.style('border', 'none');
  nextButton.style('border-radius', '4px');
  nextButton.style('cursor', 'pointer');
  nextButton.hide();

  filterArguments();
  describe('Fallacy Identification Quiz: classify arguments by logical fallacy type with score tracking and feedback', LABEL);
}

function draw() {
  updateCanvasSize();

  // Draw area background
  background('aliceblue');

  // Control area
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();

  // Position controls
  let controlY = drawHeight + 8;
  difficultySelect.position(margin, controlY);
  hintButton.position(margin + 140, controlY);
  nextButton.position(canvasWidth - margin - 60, controlY);

  if (quizComplete && !reviewMode) {
    drawCompletionScreen();
  } else if (reviewMode) {
    drawReviewScreen();
  } else {
    drawQuizScreen();
  }

  // Progress bar at very top
  drawProgressBar();
}

function drawProgressBar() {
  let barY = 0;
  let barH = 6;
  let total = filteredArgs.length;
  let progress = total > 0 ? totalAnswered / total : 0;

  noStroke();
  fill(220);
  rect(0, barY, canvasWidth, barH);
  fill('steelblue');
  rect(0, barY, canvasWidth * progress, barH);
}

function drawQuizScreen() {
  if (filteredArgs.length === 0) {
    noStroke();
    fill(80);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("No questions available.\nSelect a difficulty level.", canvasWidth / 2, drawHeight / 2);
    return;
  }

  let currentArg = filteredArgs[currentIndex];
  let y = 14;

  // Score display
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, TOP);
  text("Score: " + score + " / " + totalAnswered, margin, y);
  textAlign(RIGHT, TOP);
  text("Question " + (currentIndex + 1) + " of " + filteredArgs.length, canvasWidth - margin, y);

  // Difficulty badge
  textAlign(CENTER, TOP);
  let badgeColor = getDifficultyColor(currentArg.difficulty);
  fill(badgeColor);
  textSize(11);
  text(currentArg.difficulty.toUpperCase(), canvasWidth / 2, y + 2);

  y += 28;

  // Argument card
  let cardX = margin;
  let cardW = canvasWidth - margin * 2;
  let cardPadding = 12;

  // Calculate text height for card
  textSize(15);
  textAlign(LEFT, TOP);
  let textW = cardW - cardPadding * 2;
  let argText = currentArg.text;
  let textH = calcTextHeight(argText, textW, 15);
  let cardH = textH + cardPadding * 2 + 10;

  // Card shadow
  noStroke();
  fill(200, 200, 200, 80);
  rect(cardX + 3, y + 3, cardW, cardH, 8);

  // Card background
  if (showHint) {
    fill(highlightYellow);
  } else {
    fill(cardBg);
  }
  stroke(180);
  strokeWeight(1);
  rect(cardX, y, cardW, cardH, 8);

  // Argument text
  noStroke();
  fill(40);
  textSize(15);
  textAlign(LEFT, TOP);
  textLeading(21);
  text(argText, cardX + cardPadding, y + cardPadding, textW, cardH);

  // Hint text below card
  if (showHint) {
    y += cardH + 4;
    fill('goldenrod');
    textSize(12);
    textAlign(CENTER, TOP);
    noStroke();
    text("Hint: " + currentArg.hint, canvasWidth / 2, y);
    y += 18;
  } else {
    y += cardH + 8;
  }

  // Feedback area (between card and buttons)
  if (showFeedback) {
    let fbX = margin;
    let fbW = canvasWidth - margin * 2;
    let fbPadding = 8;
    let fbColor = isCorrect ? correctGreen : wrongRed;
    let fbText = isCorrect
      ? "Correct! " + currentArg.explanation
      : "Incorrect. The answer is " + currentArg.fallacy + ". " + currentArg.explanation;

    textSize(13);
    let fbTextH = calcTextHeight(fbText, fbW - fbPadding * 2, 13);
    let fbH = fbTextH + fbPadding * 2 + 4;

    noStroke();
    fill(red(fbColor), green(fbColor), blue(fbColor), 30);
    rect(fbX, y, fbW, fbH, 6);

    fill(fbColor);
    textAlign(LEFT, TOP);
    textLeading(18);
    noStroke();
    text(fbText, fbX + fbPadding, y + fbPadding, fbW - fbPadding * 2, fbH);

    y += fbH + 6;
  }

  // 3x3 grid of fallacy buttons
  drawFallacyGrid(y);
}

function drawFallacyGrid(startY) {
  let gridMargin = margin;
  let gridW = canvasWidth - gridMargin * 2;
  let cols = 3;
  let rows = 3;
  let gap = 6;
  let btnW = (gridW - gap * (cols - 1)) / cols;
  let btnH = 36;
  let currentArg = filteredArgs[currentIndex];

  for (let i = 0; i < fallacyNames.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let bx = gridMargin + col * (btnW + gap);
    let by = startY + row * (btnH + gap);

    let isHovered = mouseX > bx && mouseX < bx + btnW && mouseY > by && mouseY < by + btnH;
    let isSelected = showFeedback && selectedAnswer === fallacyNames[i];
    let isCorrectAnswer = showFeedback && fallacyNames[i] === currentArg.fallacy;

    // Button color
    noStroke();
    if (isCorrectAnswer && showFeedback) {
      fill(correctGreen);
    } else if (isSelected && !isCorrect && showFeedback) {
      fill(wrongRed);
    } else if (showFeedback) {
      fill(180);
    } else if (isHovered) {
      fill(buttonHover);
      cursor(HAND);
    } else {
      fill(buttonColor);
    }

    rect(bx, by, btnW, btnH, 5);

    // Button text
    fill(255);
    textSize(11);
    textAlign(CENTER, CENTER);
    noStroke();
    text(fallacyNames[i], bx + btnW / 2, by + btnH / 2);
  }
}

function drawCompletionScreen() {
  hintButton.hide();
  nextButton.hide();
  difficultySelect.hide();

  let centerX = canvasWidth / 2;
  let y = 50;

  // Title
  noStroke();
  fill(50);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Quiz Complete!", centerX, y);
  y += 40;

  // Score circle
  let circleR = 70;
  let percentage = filteredArgs.length > 0 ? round((score / filteredArgs.length) * 100) : 0;

  noFill();
  stroke(220);
  strokeWeight(8);
  ellipse(centerX, y + circleR, circleR * 2, circleR * 2);

  // Score arc
  let angle = map(percentage, 0, 100, 0, TWO_PI);
  stroke(percentage >= 70 ? correctGreen : percentage >= 40 ? 'goldenrod' : wrongRed);
  strokeWeight(8);
  arc(centerX, y + circleR, circleR * 2, circleR * 2, -HALF_PI, -HALF_PI + angle);

  // Score text
  noStroke();
  fill(50);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(percentage + "%", centerX, y + circleR - 8);
  textSize(14);
  fill(100);
  text(score + " of " + filteredArgs.length + " correct", centerX, y + circleR + 22);

  y += circleR * 2 + 30;

  // Performance message
  fill(80);
  textSize(16);
  textAlign(CENTER, TOP);
  noStroke();
  if (percentage >= 90) {
    text("Excellent! You're a fallacy-spotting expert!", centerX, y);
  } else if (percentage >= 70) {
    text("Great work! You have a strong grasp of fallacies.", centerX, y);
  } else if (percentage >= 50) {
    text("Good effort! Keep practicing to sharpen your skills.", centerX, y);
  } else {
    text("Keep learning! Review the fallacies and try again.", centerX, y);
  }
  y += 30;

  // Buttons
  let btnW = 140;
  let btnH = 40;
  let btnGap = 20;

  // Review Missed button
  if (missedQuestions.length > 0) {
    let rbx = centerX - btnW - btnGap / 2;
    let rby = y;
    let isHoveredR = mouseX > rbx && mouseX < rbx + btnW && mouseY > rby && mouseY < rby + btnH;

    noStroke();
    fill(isHoveredR ? color(180, 120, 0) : color(218, 165, 32));
    rect(rbx, rby, btnW, btnH, 6);
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    noStroke();
    text("Review Missed", rbx + btnW / 2, rby + btnH / 2);

    if (isHoveredR) cursor(HAND);
  }

  // Try Again button
  let tbx = missedQuestions.length > 0 ? centerX + btnGap / 2 : centerX - btnW / 2;
  let tby = y;
  let isHoveredT = mouseX > tbx && mouseX < tbx + btnW && mouseY > tby && mouseY < tby + btnH;

  noStroke();
  fill(isHoveredT ? color(50, 110, 160) : buttonColor);
  rect(tbx, tby, btnW, btnH, 6);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  noStroke();
  text("Try Again", tbx + btnW / 2, tby + btnH / 2);

  if (isHoveredT) cursor(HAND);
}

function drawReviewScreen() {
  hintButton.hide();
  nextButton.show();
  difficultySelect.hide();

  if (missedQuestions.length === 0) {
    reviewMode = false;
    quizComplete = true;
    return;
  }

  let item = missedQuestions[reviewIndex];
  let y = 14;

  // Header
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, TOP);
  text("Reviewing Missed Questions", margin, y);
  textAlign(RIGHT, TOP);
  text((reviewIndex + 1) + " of " + missedQuestions.length, canvasWidth - margin, y);
  y += 28;

  // Card
  let cardX = margin;
  let cardW = canvasWidth - margin * 2;
  let cardPadding = 12;

  textSize(15);
  let textW = cardW - cardPadding * 2;
  let textH = calcTextHeight(item.text, textW, 15);
  let cardH = textH + cardPadding * 2 + 10;

  noStroke();
  fill(200, 200, 200, 80);
  rect(cardX + 3, y + 3, cardW, cardH, 8);

  fill(255, 240, 240);
  stroke(wrongRed);
  strokeWeight(1);
  rect(cardX, y, cardW, cardH, 8);

  noStroke();
  fill(40);
  textSize(15);
  textAlign(LEFT, TOP);
  textLeading(21);
  text(item.text, cardX + cardPadding, y + cardPadding, textW, cardH);
  y += cardH + 10;

  // Your answer vs correct
  let infoX = margin;
  let infoW = canvasWidth - margin * 2;

  noStroke();
  fill(wrongRed);
  textSize(13);
  textAlign(LEFT, TOP);
  text("Your answer: " + item.userAnswer, infoX, y);
  y += 20;

  fill(correctGreen);
  text("Correct answer: " + item.fallacy, infoX, y);
  y += 24;

  // Explanation
  fill(60);
  textSize(13);
  textLeading(18);
  noStroke();
  text(item.explanation, infoX, y, infoW, 80);
}

function mousePressed() {
  if (quizComplete && !reviewMode) {
    handleCompletionClick();
    return;
  }

  if (reviewMode || showFeedback || filteredArgs.length === 0) return;

  // Check fallacy button clicks
  let currentArg = filteredArgs[currentIndex];
  let startY = getGridStartY();
  let gridMargin = margin;
  let gridW = canvasWidth - gridMargin * 2;
  let cols = 3;
  let gap = 6;
  let btnW = (gridW - gap * (cols - 1)) / cols;
  let btnH = 36;

  for (let i = 0; i < fallacyNames.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let bx = gridMargin + col * (btnW + gap);
    let by = startY + row * (btnH + gap);

    if (mouseX > bx && mouseX < bx + btnW && mouseY > by && mouseY < by + btnH) {
      selectedAnswer = fallacyNames[i];
      isCorrect = selectedAnswer === currentArg.fallacy;
      showFeedback = true;
      showHint = false;
      totalAnswered++;

      if (isCorrect) {
        score++;
      } else {
        missedQuestions.push({
          text: currentArg.text,
          fallacy: currentArg.fallacy,
          explanation: currentArg.explanation,
          userAnswer: selectedAnswer
        });
      }

      nextButton.show();
      hintButton.hide();
      break;
    }
  }
}

function handleCompletionClick() {
  let centerX = canvasWidth / 2;
  let btnW = 140;
  let btnH = 40;
  let btnGap = 20;

  // Calculate y position for buttons (must match drawCompletionScreen)
  let circleR = 70;
  let y = 50 + 40 + circleR * 2 + 30 + 30;

  // Review Missed button
  if (missedQuestions.length > 0) {
    let rbx = centerX - btnW - btnGap / 2;
    if (mouseX > rbx && mouseX < rbx + btnW && mouseY > y && mouseY < y + btnH) {
      reviewMode = true;
      quizComplete = false;
      reviewIndex = 0;
      return;
    }
  }

  // Try Again button
  let tbx = missedQuestions.length > 0 ? centerX + btnGap / 2 : centerX - btnW / 2;
  if (mouseX > tbx && mouseX < tbx + btnW && mouseY > y && mouseY < y + btnH) {
    resetQuiz();
  }
}

function getGridStartY() {
  if (filteredArgs.length === 0) return 200;

  let currentArg = filteredArgs[currentIndex];
  let y = 14 + 28;

  // Card height
  let cardW = canvasWidth - margin * 2;
  let cardPadding = 12;
  let textW = cardW - cardPadding * 2;
  let textH = calcTextHeight(currentArg.text, textW, 15);
  let cardH = textH + cardPadding * 2 + 10;

  if (showHint) {
    y += cardH + 4 + 18;
  } else {
    y += cardH + 8;
  }

  // Feedback area
  if (showFeedback) {
    let fbW = canvasWidth - margin * 2;
    let fbPadding = 8;
    let fbText = isCorrect
      ? "Correct! " + currentArg.explanation
      : "Incorrect. The answer is " + currentArg.fallacy + ". " + currentArg.explanation;
    let fbTextH = calcTextHeight(fbText, fbW - fbPadding * 2, 13);
    let fbH = fbTextH + fbPadding * 2 + 4;
    y += fbH + 6;
  }

  return y;
}

function advanceQuestion() {
  if (reviewMode) {
    reviewIndex++;
    if (reviewIndex >= missedQuestions.length) {
      reviewMode = false;
      quizComplete = true;
      nextButton.hide();
      difficultySelect.show();
    }
    return;
  }

  currentIndex++;
  if (currentIndex >= filteredArgs.length) {
    quizComplete = true;
    nextButton.hide();
    hintButton.hide();
  } else {
    showFeedback = false;
    showHint = false;
    selectedAnswer = "";
    nextButton.hide();
    hintButton.show();
  }
}

function toggleHint() {
  showHint = !showHint;
}

function onDifficultyChange() {
  currentDifficulty = difficultySelect.value();
  filterArguments();
  resetQuiz();
}

function filterArguments() {
  if (currentDifficulty === "all") {
    filteredArgs = [...arguments];
  } else {
    filteredArgs = arguments.filter(a => a.difficulty === currentDifficulty);
  }
  shuffleArray(filteredArgs);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function resetQuiz() {
  currentIndex = 0;
  score = 0;
  totalAnswered = 0;
  selectedAnswer = "";
  showFeedback = false;
  showHint = false;
  quizComplete = false;
  reviewMode = false;
  missedQuestions = [];
  reviewIndex = 0;
  nextButton.hide();
  hintButton.show();
  difficultySelect.show();
  filterArguments();
}

function calcTextHeight(txt, w, size) {
  push();
  textSize(size);
  textLeading(size * 1.4);
  let words = txt.split(' ');
  let line = '';
  let lines = 1;
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    if (textWidth(testLine) > w && line !== '') {
      lines++;
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  pop();
  return lines * size * 1.4;
}

function getDifficultyColor(diff) {
  if (diff === "basic") return color(46, 139, 87);
  if (diff === "intermediate") return color(218, 165, 32);
  return color(205, 60, 60);
}

function mouseMoved() {
  cursor(ARROW);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  containerWidth = select('main').width;
  if (containerWidth > 0) {
    canvasWidth = containerWidth;
  }
}
