// Arts Knowledge Types - Three-Column Comparison MicroSim
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;
let canvasHeight = 510;
let margin = 25;
let defaultTextSize = 16;

// Controls
let showScienceCheckbox;
let quizModeButton;

// State
let showScience = false;
let quizMode = false;
let quizScore = 0;
let quizTotal = 0;
let quizFeedback = '';
let quizFeedbackColor = 'black';
let quizCurrentIndex = -1;
let quizButtons = [];
let hoveredCell = null;

// Column definitions
let columns = [
  { name: 'Propositional', icon: '📖', color: [255, 191, 0] },      // amber
  { name: 'Performative', icon: '💃', color: [255, 127, 80] },       // coral
  { name: 'Aesthetic', icon: '👁', color: [0, 128, 128] }             // teal
];

let scienceColumn = { name: 'Scientific', icon: '🔬', color: [100, 149, 237] }; // cornflower

// Row definitions
let rows = [
  'Definition',
  'Example',
  'Can be written?',
  'Requires experience?',
  'Transferable?',
  'Testable?'
];

// Cell data: [value, valueType, tooltip]
// valueType: 'yes', 'no', 'partial', 'text'
let cellData = {
  'Propositional': {
    'Definition': ['Facts & claims about art', 'text', 'Propositional knowledge consists of factual statements that can be expressed as true or false propositions about artworks, artists, or art history.'],
    'Example': ['"Painted in 1889"', 'text', 'The painting Starry Night was created by Van Gogh in 1889. This is a verifiable historical fact about art.'],
    'Can be written?': ['Yes', 'yes', 'Propositional knowledge about art can be fully captured in written language—dates, techniques, historical context, and art criticism.'],
    'Requires experience?': ['No', 'no', 'You can learn art facts from books without ever seeing the original artwork. Reading about art history conveys propositional knowledge.'],
    'Transferable?': ['Yes', 'yes', 'Facts about art transfer easily between people through language, textbooks, lectures, and documentation.'],
    'Testable?': ['Yes', 'yes', 'Propositional art knowledge can be tested through traditional exams, quizzes, and factual verification.']
  },
  'Performative': {
    'Definition': ['Know-how & skill', 'text', 'Performative knowledge is the practical ability to do something—the embodied skill of creating or performing art.'],
    'Example': ['"Playing violin"', 'text', 'Knowing how to play violin involves muscle memory, timing, ear training, and physical coordination that goes beyond reading about it.'],
    'Can be written?': ['Partially', 'partial', 'Instructions and notation can be written, but the actual physical skill—finger pressure, bowing technique, musical feel—cannot be fully captured in words.'],
    'Requires experience?': ['Yes', 'yes', 'You cannot learn to play violin solely from reading. Performative knowledge requires hands-on practice and embodied experience.'],
    'Transferable?': ['Limited', 'partial', 'A teacher can demonstrate and guide, but each learner must develop their own embodied skill. Transfer is partial at best.'],
    'Testable?': ['Yes (by doing)', 'yes', 'Performative knowledge is tested through demonstration—play the piece, perform the dance, create the artwork. Assessment is through observation.']
  },
  'Aesthetic': {
    'Definition': ['Felt quality & response', 'text', 'Aesthetic knowledge is the subjective experience of beauty, emotion, or meaning evoked by encountering art firsthand.'],
    'Example': ['"Feeling of Starry Night"', 'text', 'The specific emotional and perceptual experience of standing before Van Gogh\'s Starry Night—the swirling movement, the depth of feeling it evokes.'],
    'Can be written?': ['No', 'no', 'Words can gesture toward aesthetic experience but cannot reproduce it. No description of Starry Night equals seeing it.'],
    'Requires experience?': ['Yes', 'yes', 'Aesthetic knowledge is inherently experiential. You must encounter the artwork directly to have the aesthetic experience.'],
    'Transferable?': ['No', 'no', 'Each person\'s aesthetic experience is unique and subjective. You cannot transfer your feeling of awe to someone else.'],
    'Testable?': ['No', 'no', 'There is no objective test for aesthetic experience. We cannot verify that two people feel the same thing when viewing art.']
  },
  'Scientific': {
    'Definition': ['Empirical & systematic', 'text', 'Scientific knowledge uses systematic observation, measurement, and experimentation to produce verifiable, reproducible claims.'],
    'Example': ['"Paint composition analysis"', 'text', 'Using spectroscopy to determine the chemical composition of pigments in a painting—objective, measurable, reproducible data.'],
    'Can be written?': ['Yes', 'yes', 'Scientific findings are fully expressible in written form—data, formulas, methods, and conclusions can all be documented precisely.'],
    'Requires experience?': ['No', 'no', 'Scientific knowledge can be learned from published research. You don\'t need to repeat every experiment to accept well-established findings.'],
    'Transferable?': ['Yes', 'yes', 'Scientific knowledge is designed to be transferable—reproducibility is a core requirement of the scientific method.'],
    'Testable?': ['Yes', 'yes', 'Testability and falsifiability are defining features of scientific knowledge. Claims must be empirically verifiable.']
  }
};

// Quiz questions
let quizQuestions = [
  { text: 'Knowing that Picasso co-founded Cubism', answer: 'Propositional', hint: 'This is a historical fact about art.' },
  { text: 'Being able to throw a pot on a wheel', answer: 'Performative', hint: 'This requires physical skill and practice.' },
  { text: 'The chill you feel hearing a minor chord', answer: 'Aesthetic', hint: 'This is a subjective emotional response.' },
  { text: 'Da Vinci used sfumato technique', answer: 'Propositional', hint: 'This is a factual claim about art technique.' },
  { text: 'Knowing how to mix watercolors', answer: 'Performative', hint: 'This is a practical skill learned through practice.' },
  { text: 'The awe of seeing the Sistine Chapel', answer: 'Aesthetic', hint: 'This is a personal, felt experience.' },
  { text: 'Baroque period lasted 1600-1750', answer: 'Propositional', hint: 'This is a verifiable historical date range.' },
  { text: 'Dancing a ballet pas de deux', answer: 'Performative', hint: 'This requires embodied physical ability.' },
  { text: 'Being moved to tears by a poem', answer: 'Aesthetic', hint: 'This is an emotional, subjective response.' },
  { text: 'Knowing impasto uses thick paint', answer: 'Propositional', hint: 'This is a factual definition of a technique.' }
];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1 controls
  showScienceCheckbox = createCheckbox('Show Scientific Knowledge', false);
  showScienceCheckbox.parent(document.querySelector('main'));
  showScienceCheckbox.style('font-size', '14px');
  showScienceCheckbox.style('margin', '4px 10px');
  showScienceCheckbox.changed(function () {
    showScience = this.checked();
  });

  // Row 2 controls
  quizModeButton = createButton('Start Quiz');
  quizModeButton.parent(document.querySelector('main'));
  quizModeButton.style('font-size', '14px');
  quizModeButton.style('margin', '4px 10px');
  quizModeButton.style('padding', '4px 12px');
  quizModeButton.mousePressed(toggleQuizMode);

  describe('Three-column comparison table of knowledge types in the arts: propositional, performative, and aesthetic.');
}

function toggleQuizMode() {
  quizMode = !quizMode;
  if (quizMode) {
    quizModeButton.html('Exit Quiz');
    quizScore = 0;
    quizTotal = 0;
    quizFeedback = '';
    nextQuizQuestion();
    // Create answer buttons
    createQuizButtons();
  } else {
    quizModeButton.html('Start Quiz');
    removeQuizButtons();
  }
}

function createQuizButtons() {
  removeQuizButtons();
  let types = ['Propositional', 'Performative', 'Aesthetic'];
  let colors = ['gold', 'coral', 'teal'];
  for (let i = 0; i < 3; i++) {
    let btn = createButton(types[i]);
    btn.parent(document.querySelector('main'));
    btn.style('font-size', '13px');
    btn.style('margin', '2px 4px');
    btn.style('padding', '4px 10px');
    btn.style('background-color', colors[i]);
    btn.style('color', i === 2 ? 'white' : 'black');
    btn.style('border', 'none');
    btn.style('border-radius', '4px');
    btn.style('cursor', 'pointer');
    btn.mousePressed(makeQuizAnswer(types[i]));
    quizButtons.push(btn);
  }
}

function makeQuizAnswer(type) {
  return function () {
    checkQuizAnswer(type);
  };
}

function removeQuizButtons() {
  for (let btn of quizButtons) {
    btn.remove();
  }
  quizButtons = [];
}

function nextQuizQuestion() {
  quizCurrentIndex = floor(random(quizQuestions.length));
}

function checkQuizAnswer(answer) {
  let q = quizQuestions[quizCurrentIndex];
  quizTotal++;
  if (answer === q.answer) {
    quizScore++;
    quizFeedback = 'Correct! ' + q.hint;
    quizFeedbackColor = 'green';
  } else {
    quizFeedback = 'Not quite. ' + q.hint;
    quizFeedbackColor = 'red';
  }
  nextQuizQuestion();
}

function draw() {
  // Draw area
  background('aliceblue');

  // Control area background
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);
  fill('white');
  rect(4, drawHeight + 4, canvasWidth - 8, controlHeight - 8, 6);

  if (quizMode) {
    drawQuizMode();
  } else {
    drawTable();
  }

  // Draw score in control area if in quiz mode
  if (quizMode) {
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Score: ' + quizScore + '/' + quizTotal, margin, drawHeight + 40);
  }
}

function drawTable() {
  let numCols = showScience ? 4 : 3;
  let labelWidth = 90;
  let tableLeft = margin;
  let tableTop = 10;
  let tableWidth = canvasWidth - margin * 2;
  let colWidth = (tableWidth - labelWidth) / numCols;
  let headerHeight = 50;
  let rowHeight = 55;
  let dataX = tableLeft + labelWidth;

  hoveredCell = null;

  // Title
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Knowledge Types in the Arts', canvasWidth / 2, tableTop);
  textStyle(NORMAL);

  let gridTop = tableTop + 28;

  // Draw column headers
  let activeCols = showScience ? [...columns, scienceColumn] : columns;
  for (let c = 0; c < numCols; c++) {
    let col = activeCols[c];
    let cx = dataX + c * colWidth;

    // Header background
    noStroke();
    fill(col.color[0], col.color[1], col.color[2], 80);
    rect(cx, gridTop, colWidth, headerHeight);

    // Header border
    stroke(150);
    strokeWeight(1);
    noFill();
    rect(cx, gridTop, colWidth, headerHeight);

    // Header text
    noStroke();
    fill('black');
    textSize(colWidth < 70 ? 9 : 11);
    textAlign(CENTER, CENTER);
    text(col.icon, cx + colWidth / 2, gridTop + 16);
    textStyle(BOLD);
    textSize(colWidth < 70 ? 8 : 10);
    text(col.name, cx + colWidth / 2, gridTop + 36);
    textStyle(NORMAL);
  }

  // Draw row labels and cells
  for (let r = 0; r < rows.length; r++) {
    let ry = gridTop + headerHeight + r * rowHeight;

    // Row label background
    noStroke();
    fill(240);
    rect(tableLeft, ry, labelWidth, rowHeight);
    stroke(150);
    strokeWeight(1);
    noFill();
    rect(tableLeft, ry, labelWidth, rowHeight);

    // Row label text
    noStroke();
    fill('black');
    textSize(9);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(rows[r], tableLeft + labelWidth / 2, ry + rowHeight / 2);
    textStyle(NORMAL);

    // Draw cells
    for (let c = 0; c < numCols; c++) {
      let col = activeCols[c];
      let cx = dataX + c * colWidth;
      let cell = cellData[col.name][rows[r]];
      let val = cell[0];
      let vtype = cell[1];

      // Cell background color based on value type
      noStroke();
      if (vtype === 'yes') {
        fill(144, 238, 144, 150); // light green
      } else if (vtype === 'no') {
        fill(255, 127, 80, 100); // light coral
      } else if (vtype === 'partial') {
        fill(255, 191, 0, 100); // light amber
      } else {
        fill(255, 255, 255, 200);
      }
      rect(cx, ry, colWidth, rowHeight);

      // Cell border
      stroke(150);
      strokeWeight(1);
      noFill();
      rect(cx, ry, colWidth, rowHeight);

      // Cell text
      noStroke();
      fill('black');
      textSize(colWidth < 70 ? 8 : 9);
      textAlign(CENTER, CENTER);
      let displayVal = val;
      if (val.length > 18 && colWidth < 80) {
        // Wrap long text
        let words = val.split(' ');
        let line1 = '';
        let line2 = '';
        let onLine1 = true;
        for (let w of words) {
          if (onLine1 && (line1 + ' ' + w).length <= 14) {
            line1 += (line1 ? ' ' : '') + w;
          } else {
            onLine1 = false;
            line2 += (line2 ? ' ' : '') + w;
          }
        }
        text(line1, cx + colWidth / 2, ry + rowHeight / 2 - 7);
        text(line2, cx + colWidth / 2, ry + rowHeight / 2 + 7);
      } else {
        text(displayVal, cx + colWidth / 2, ry + rowHeight / 2);
      }

      // Check hover
      if (mouseX > cx && mouseX < cx + colWidth && mouseY > ry && mouseY < ry + rowHeight) {
        hoveredCell = { x: cx, y: ry, w: colWidth, h: rowHeight, tooltip: cell[2], col: col.name, row: rows[r] };
      }
    }
  }

  // Draw tooltip
  if (hoveredCell) {
    drawTooltip(hoveredCell);
  }
}

function drawTooltip(cell) {
  let tipWidth = min(220, canvasWidth - 20);
  let tipX = constrain(mouseX - tipWidth / 2, 5, canvasWidth - tipWidth - 5);
  let tipY = mouseY + 20;

  // Measure text height
  textSize(11);
  let lines = wrapText(cell.tooltip, tipWidth - 16);
  let tipHeight = lines.length * 15 + 26;

  if (tipY + tipHeight > drawHeight) {
    tipY = mouseY - tipHeight - 10;
  }

  // Shadow
  noStroke();
  fill(0, 0, 0, 40);
  rect(tipX + 3, tipY + 3, tipWidth, tipHeight, 6);

  // Tooltip background
  fill(255, 255, 240);
  stroke(100);
  strokeWeight(1);
  rect(tipX, tipY, tipWidth, tipHeight, 6);

  // Title
  noStroke();
  fill('black');
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(cell.col + ' — ' + cell.row, tipX + 8, tipY + 6);
  textStyle(NORMAL);

  // Body
  textSize(11);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tipX + 8, tipY + 22 + i * 15);
  }
}

function wrapText(txt, maxW) {
  let words = txt.split(' ');
  let lines = [];
  let current = '';
  for (let w of words) {
    let test = current ? current + ' ' + w : w;
    if (textWidth(test) <= maxW) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawQuizMode() {
  if (quizCurrentIndex < 0) return;
  let q = quizQuestions[quizCurrentIndex];

  // Title
  noStroke();
  fill('black');
  textSize(16);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Quiz: Classify the Knowledge', canvasWidth / 2, 20);
  textStyle(NORMAL);

  // Instruction
  textSize(13);
  fill(80);
  text('What type of knowledge is this?', canvasWidth / 2, 50);

  // Question card
  noStroke();
  fill(255);
  rect(margin, 80, canvasWidth - margin * 2, 80, 10);
  stroke(100, 149, 237);
  strokeWeight(2);
  noFill();
  rect(margin, 80, canvasWidth - margin * 2, 80, 10);

  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  text(q.text, canvasWidth / 2, 120);
  textStyle(NORMAL);

  // Feedback
  if (quizFeedback) {
    noStroke();
    fill(quizFeedbackColor);
    textSize(13);
    textAlign(CENTER, TOP);

    let fbLines = wrapText(quizFeedback, canvasWidth - margin * 2 - 20);
    for (let i = 0; i < fbLines.length; i++) {
      text(fbLines[i], canvasWidth / 2, 185 + i * 18);
    }
  }

  // Legend
  let legendY = 250;
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Knowledge Types Reference', canvasWidth / 2, legendY);
  textStyle(NORMAL);

  let refData = [
    { name: 'Propositional', color: [255, 191, 0], desc: 'Facts, claims, things you can state' },
    { name: 'Performative', color: [255, 127, 80], desc: 'Skills, abilities, know-how' },
    { name: 'Aesthetic', color: [0, 128, 128], desc: 'Felt experience, subjective response' }
  ];

  for (let i = 0; i < refData.length; i++) {
    let ry = legendY + 25 + i * 50;
    let rd = refData[i];

    // Color bar
    noStroke();
    fill(rd.color[0], rd.color[1], rd.color[2], 120);
    rect(margin + 10, ry, canvasWidth - margin * 2 - 20, 40, 6);

    // Text
    fill('black');
    textSize(13);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(rd.name, margin + 20, ry + 14);
    textStyle(NORMAL);
    textSize(11);
    fill(60);
    text(rd.desc, margin + 20, ry + 30);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    canvasWidth = max(360, min(mainEl.offsetWidth, 600));
  }
}
