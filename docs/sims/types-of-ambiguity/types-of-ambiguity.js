// Types of Ambiguity Classification Exercise
// Analyze (L4): Classify sentences as Lexical, Syntactic, or Referential
// CANVAS_HEIGHT: 520, drawHeight: 460, controlHeight: 60

let sentences = [
  {text:"I saw her duck.", type:"Lexical", explanation:"'Duck' could be a noun (the bird) or a verb (to lower one's head). The ambiguity is in the word itself."},
  {text:"Flying planes can be dangerous.", type:"Syntactic", explanation:"Is it dangerous to fly planes, or are planes that are flying dangerous? The sentence structure allows both readings."},
  {text:"The chicken is ready to eat.", type:"Syntactic", explanation:"Is the chicken ready to eat something, or ready to be eaten? The grammatical structure is ambiguous."},
  {text:"She told her mother that she was wrong.", type:"Referential", explanation:"Who was wrong — 'she' or 'her mother'? The pronoun 'she' could refer to either person."},
  {text:"I went to the bank.", type:"Lexical", explanation:"'Bank' could mean a financial institution or the edge of a river. The word has multiple meanings."},
  {text:"The professor said on Monday he would give an exam.", type:"Syntactic", explanation:"Did the professor speak on Monday, or is the exam on Monday? The phrase placement is ambiguous."},
  {text:"John asked Bill to help him.", type:"Referential", explanation:"Who does 'him' refer to — John himself, or someone else? The reference is unclear."},
  {text:"I found the bat in the cave.", type:"Lexical", explanation:"'Bat' could be the flying mammal or a sports equipment. Context is needed to disambiguate."},
  {text:"Visiting relatives can be boring.", type:"Syntactic", explanation:"Is visiting them boring, or are the relatives who are visiting boring? The sentence structure allows both."},
  {text:"The lawyer questioned the witness in her office.", type:"Referential", explanation:"Whose office — the lawyer's or the witness's? The pronoun 'her' could refer to either."}
];

let currentIndex = 0;
let score = 0;
let answered = false;
let selectedAnswer = "";
let shuffledSentences = [];
let gameOver = false;

// Track results by type
let results = {Lexical: {correct: 0, total: 0}, Syntactic: {correct: 0, total: 0}, Referential: {correct: 0, total: 0}};

// Buttons
let btnLexical, btnSyntactic, btnReferential, btnNext;

// Colors
let tealColor = "teal";
let goldenrodColor = "goldenrod";
let coralColor = "coral";

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, 520);
  canvas.parent(document.querySelector('main'));

  textFont('Arial');

  // Shuffle sentences
  shuffledSentences = shuffle(sentences.slice(), true);

  // Classification buttons
  btnLexical = createButton('Lexical');
  btnLexical.parent(document.querySelector('main'));
  btnLexical.style('background-color', tealColor);
  btnLexical.style('color', 'white');
  btnLexical.style('border', 'none');
  btnLexical.style('padding', '10px 20px');
  btnLexical.style('font-size', '16px');
  btnLexical.style('border-radius', '6px');
  btnLexical.style('cursor', 'pointer');
  btnLexical.style('margin-right', '10px');
  btnLexical.mousePressed(() => checkAnswer("Lexical"));

  btnSyntactic = createButton('Syntactic');
  btnSyntactic.parent(document.querySelector('main'));
  btnSyntactic.style('background-color', goldenrodColor);
  btnSyntactic.style('color', 'white');
  btnSyntactic.style('border', 'none');
  btnSyntactic.style('padding', '10px 20px');
  btnSyntactic.style('font-size', '16px');
  btnSyntactic.style('border-radius', '6px');
  btnSyntactic.style('cursor', 'pointer');
  btnSyntactic.style('margin-right', '10px');
  btnSyntactic.mousePressed(() => checkAnswer("Syntactic"));

  btnReferential = createButton('Referential');
  btnReferential.parent(document.querySelector('main'));
  btnReferential.style('background-color', coralColor);
  btnReferential.style('color', 'white');
  btnReferential.style('border', 'none');
  btnReferential.style('padding', '10px 20px');
  btnReferential.style('font-size', '16px');
  btnReferential.style('border-radius', '6px');
  btnReferential.style('cursor', 'pointer');
  btnReferential.mousePressed(() => checkAnswer("Referential"));

  // Next button
  btnNext = createButton('Next →');
  btnNext.parent(document.querySelector('main'));
  btnNext.style('background-color', 'white');
  btnNext.style('border', '2px solid silver');
  btnNext.style('padding', '8px 24px');
  btnNext.style('font-size', '15px');
  btnNext.style('border-radius', '6px');
  btnNext.style('cursor', 'pointer');
  btnNext.style('margin-left', '20px');
  btnNext.mousePressed(nextSentence);
  btnNext.hide();

  describe('Classification exercise for types of ambiguity: Lexical, Syntactic, and Referential. Students classify ambiguous sentences and receive feedback.');
}

function draw() {
  background('aliceblue');
  let drawHeight = 460;
  let controlY = drawHeight;
  let margin = 20;
  let cw = width;

  if (gameOver) {
    drawFinalScreen(margin, cw, drawHeight);
  } else {
    drawExercise(margin, cw, drawHeight);
  }

  // Control area
  fill('silver');
  noStroke();
  rect(0, controlY, cw, 60);

  // Score display in control area
  fill(50);
  noStroke();
  textSize(16);
  textAlign(RIGHT, CENTER);
  text('Score: ' + score + ' / ' + shuffledSentences.length, cw - margin, controlY + 30);
}

function drawExercise(margin, cw, drawHeight) {
  let current = shuffledSentences[currentIndex];

  // Progress bar
  let barY = 15;
  let barH = 10;
  let barW = cw - 2 * margin;
  fill('silver');
  noStroke();
  rect(margin, barY, barW, barH, 5);
  fill(tealColor);
  rect(margin, barY, barW * (currentIndex / shuffledSentences.length), barH, 5);

  // Progress text
  fill(100);
  noStroke();
  textSize(13);
  textAlign(LEFT, TOP);
  text('Question ' + (currentIndex + 1) + ' of ' + shuffledSentences.length, margin, barY + barH + 5);

  // Sentence card
  let cardX = margin;
  let cardY = 55;
  let cardW = cw - 2 * margin;
  let cardH = 100;

  fill('white');
  noStroke();
  rect(cardX, cardY, cardW, cardH, 10);

  // Sentence text
  fill(30);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  text('"' + current.text + '"', cw / 2, cardY + cardH / 2);
  textStyle(NORMAL);

  // Instruction
  fill(100);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  if (!answered) {
    text('What type of ambiguity does this sentence contain?', cw / 2, cardY + cardH + 15);
  }

  // Type legend
  let legendY = cardY + cardH + 40;
  textSize(12);
  textAlign(LEFT, TOP);

  fill(tealColor);
  noStroke();
  rect(margin, legendY, 12, 12, 2);
  fill(80);
  text('Lexical — a word has multiple meanings', margin + 18, legendY);

  fill(goldenrodColor);
  noStroke();
  rect(margin, legendY + 20, 12, 12, 2);
  fill(80);
  text('Syntactic — sentence structure allows multiple readings', margin + 18, legendY + 20);

  fill(coralColor);
  noStroke();
  rect(margin, legendY + 40, 12, 12, 2);
  fill(80);
  text('Referential — a pronoun or reference is unclear', margin + 18, legendY + 40);

  // Feedback area
  if (answered) {
    let fbY = legendY + 75;
    let fbH = drawHeight - fbY - 10;
    let isCorrect = selectedAnswer === current.type;

    // Feedback card
    if (isCorrect) {
      fill(230, 255, 230);
    } else {
      fill(255, 230, 230);
    }
    noStroke();
    rect(cardX, fbY, cardW, fbH, 10);

    // Result header
    textSize(18);
    textAlign(LEFT, TOP);
    noStroke();
    if (isCorrect) {
      fill('green');
      text('✓ Correct!', cardX + 15, fbY + 12);
    } else {
      fill('red');
      text('✗ Not quite. The answer is ' + current.type + '.', cardX + 15, fbY + 12);
    }

    // Explanation
    fill(50);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    let explanationX = cardX + 15;
    let explanationW = cardW - 30;
    text(current.explanation, explanationX, fbY + 40, explanationW);

    // Color indicator for correct type
    let indicatorColor;
    if (current.type === "Lexical") indicatorColor = tealColor;
    else if (current.type === "Syntactic") indicatorColor = goldenrodColor;
    else indicatorColor = coralColor;

    fill(indicatorColor);
    noStroke();
    rect(cardX, fbY, 6, fbH, 3, 0, 0, 3);
  }
}

function drawFinalScreen(margin, cw, drawHeight) {
  // Title
  fill(30);
  noStroke();
  textSize(28);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Exercise Complete!', cw / 2, 30);
  textStyle(NORMAL);

  // Overall score
  let pct = Math.round((score / shuffledSentences.length) * 100);
  textSize(22);
  fill(50);
  noStroke();
  text(score + ' / ' + shuffledSentences.length + '  (' + pct + '%)', cw / 2, 70);

  // Score message
  textSize(16);
  fill(80);
  noStroke();
  let msg;
  if (pct === 100) msg = 'Perfect! You are an ambiguity expert!';
  else if (pct >= 70) msg = 'Great job! You have a solid grasp of ambiguity types.';
  else if (pct >= 50) msg = 'Good effort! Review the types and try again.';
  else msg = 'Keep practicing! Ambiguity can be tricky.';
  text(msg, cw / 2, 105);

  // Results by type
  let boxY = 150;
  let boxW = (cw - 4 * margin) / 3;
  let boxH = 160;
  let types = [
    {name: "Lexical", color: tealColor, desc: "Word meaning"},
    {name: "Syntactic", color: goldenrodColor, desc: "Sentence structure"},
    {name: "Referential", color: coralColor, desc: "Pronoun reference"}
  ];

  for (let i = 0; i < 3; i++) {
    let bx = margin + i * (boxW + margin);
    let t = types[i];
    let r = results[t.name];

    // Card background
    fill('white');
    noStroke();
    rect(bx, boxY, boxW, boxH, 10);

    // Color top bar
    fill(t.color);
    noStroke();
    rect(bx, boxY, boxW, 8, 10, 10, 0, 0);

    // Type name
    fill(t.color);
    noStroke();
    textSize(18);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text(t.name, bx + boxW / 2, boxY + 20);
    textStyle(NORMAL);

    // Description
    fill(120);
    noStroke();
    textSize(12);
    text(t.desc, bx + boxW / 2, boxY + 45);

    // Score circle
    let cx = bx + boxW / 2;
    let cy = boxY + 95;
    let cr = 35;

    noFill();
    stroke('silver');
    strokeWeight(4);
    ellipse(cx, cy, cr * 2, cr * 2);

    if (r.total > 0) {
      stroke(t.color);
      strokeWeight(4);
      let angle = (r.correct / r.total) * TWO_PI;
      arc(cx, cy, cr * 2, cr * 2, -HALF_PI, -HALF_PI + angle);
    }

    fill(50);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(r.correct + '/' + r.total, cx, cy);

    // Percentage
    fill(100);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    let typePct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    text(typePct + '%', cx, cy + cr + 5);
  }

  // Restart prompt
  fill(100);
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text('Click "Restart" below to try again with a new order.', cw / 2, boxY + boxH + 30);
}

function checkAnswer(answer) {
  if (answered || gameOver) return;
  answered = true;
  selectedAnswer = answer;

  let current = shuffledSentences[currentIndex];
  let isCorrect = answer === current.type;

  if (isCorrect) score++;

  // Track results by type
  results[current.type].total++;
  if (isCorrect) results[current.type].correct++;

  // Hide classification buttons, show next
  btnLexical.hide();
  btnSyntactic.hide();
  btnReferential.hide();

  if (currentIndex < shuffledSentences.length - 1) {
    btnNext.show();
    btnNext.html('Next →');
  } else {
    btnNext.show();
    btnNext.html('See Results');
  }
}

function nextSentence() {
  if (gameOver) {
    // Restart
    currentIndex = 0;
    score = 0;
    answered = false;
    selectedAnswer = "";
    gameOver = false;
    results = {Lexical: {correct: 0, total: 0}, Syntactic: {correct: 0, total: 0}, Referential: {correct: 0, total: 0}};
    shuffledSentences = shuffle(sentences.slice(), true);
    btnNext.hide();
    btnLexical.show();
    btnSyntactic.show();
    btnReferential.show();
    return;
  }

  currentIndex++;
  answered = false;
  selectedAnswer = "";
  btnNext.hide();

  if (currentIndex >= shuffledSentences.length) {
    gameOver = true;
    btnNext.show();
    btnNext.html('Restart');
  } else {
    btnLexical.show();
    btnSyntactic.show();
    btnReferential.show();
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, 520);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  canvasWidth = mainEl ? mainEl.offsetWidth : 400;
  if (canvasWidth < 300) canvasWidth = 300;
}
