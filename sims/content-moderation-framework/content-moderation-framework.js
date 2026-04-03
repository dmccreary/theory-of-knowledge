// Content Moderation Decision Framework: Evaluate social media posts and explore moderation trade-offs
// CANVAS_HEIGHT: 520
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 60;
let canvasHeight = 520;
let margin = 20;

let scenarios = [
  {
    post: "BREAKING: New study proves vitamin C cures cancer! Share before they take this down!",
    type: "Health Misinformation",
    truthfulness: 1, harm: 4,
    context: "No credible source cited",
    intent: "Likely clickbait",
    feedback: {
      "Leave Up": {pro: "Protects free expression; adults can judge for themselves.", con: "Could cause real harm if people delay medical treatment based on this claim."},
      "Add Warning": {pro: "Preserves the post while alerting readers to check sources.", con: "Many users ignore warning labels and share anyway."},
      "Reduce Distribution": {pro: "Limits spread without outright censorship.", con: "Still visible to followers; harm continues at smaller scale."},
      "Remove": {pro: "Prevents dangerous health misinformation from spreading.", con: "Sets precedent for removing health claims — who decides what's 'misinformation'?"}
    },
    recommended: "Add Warning"
  },
  {
    post: "Politicians are all lizard people wearing human suits. Wake up, sheeple! #TruthRevealed",
    type: "Political Satire / Conspiracy",
    truthfulness: 1, harm: 2,
    context: "Could be satire or genuine belief",
    intent: "Ambiguous",
    feedback: {
      "Leave Up": {pro: "Likely satire or harmless; low real-world harm potential.", con: "Some users may take it seriously, eroding trust in institutions."},
      "Add Warning": {pro: "Flags it for critical readers without removing humor.", con: "Warning on obvious satire may seem heavy-handed."},
      "Reduce Distribution": {pro: "Limits reach of potentially misleading content.", con: "Disproportionate response to likely humorous content."},
      "Remove": {pro: "Prevents any possible spread of conspiratorial thinking.", con: "Massive overreach — chills political satire and humor."}
    },
    recommended: "Leave Up"
  },
  {
    post: "[Video clip] Politician says 'I hate this country' — taken from speech where full quote was 'I hate this country being divided'",
    type: "Out-of-Context Video",
    truthfulness: 2, harm: 4,
    context: "Deliberately misleading edit",
    intent: "Manipulation",
    feedback: {
      "Leave Up": {pro: "The clip is technically 'real' footage.", con: "Deliberately misleading edits manipulate public opinion."},
      "Add Warning": {pro: "Provides context so viewers can judge the full quote.", con: "The misleading version may still dominate perception."},
      "Reduce Distribution": {pro: "Slows viral spread of manipulated content.", con: "Doesn't address the fundamental deception for those who see it."},
      "Remove": {pro: "Stops deliberate manipulation from influencing voters.", con: "Removing political content raises censorship concerns."}
    },
    recommended: "Add Warning"
  },
  {
    post: "All members of [ethnic group] are criminals and should be deported immediately.",
    type: "Hate Speech",
    truthfulness: 1, harm: 5,
    context: "Direct dehumanization",
    intent: "Incitement",
    feedback: {
      "Leave Up": {pro: "Some argue even hateful speech should be protected.", con: "Directly dehumanizes a group and could incite violence."},
      "Add Warning": {pro: "Flags the content as harmful.", con: "A warning label is inadequate for direct incitement to harm."},
      "Reduce Distribution": {pro: "Limits how many people see the incitement.", con: "Still available — victims of the targeted group can still see it."},
      "Remove": {pro: "Prevents incitement and protects targeted communities.", con: "Defining hate speech boundaries can be subjective."}
    },
    recommended: "Remove"
  },
  {
    post: "The moon landing was staged in a Hollywood studio. Here's 'proof' — the flag waves!",
    type: "Conspiracy Theory",
    truthfulness: 1, harm: 2,
    context: "Long-debunked claim",
    intent: "Genuine belief",
    feedback: {
      "Leave Up": {pro: "Low harm; good opportunity for scientific counter-arguments.", con: "Erodes trust in scientific institutions over time."},
      "Add Warning": {pro: "Links to debunking resources alongside the claim.", con: "May give the claim more attention (Streisand effect)."},
      "Reduce Distribution": {pro: "Limits spread without direct censorship.", con: "Relatively harmless content doesn't warrant algorithmic suppression."},
      "Remove": {pro: "Prevents spread of scientific misinformation.", con: "Extreme overreaction — sets dangerous precedent for removing unpopular opinions."}
    },
    recommended: "Leave Up"
  },
  {
    post: "[Realistic AI-generated video of world leader declaring war]",
    type: "Deepfake",
    truthfulness: 1, harm: 5,
    context: "Synthetic media, no disclaimer",
    intent: "Deception or disruption",
    feedback: {
      "Leave Up": {pro: "Virtually none — this is fabricated content posing as real.", con: "Could cause mass panic, diplomatic crises, or real-world violence."},
      "Add Warning": {pro: "Alerts viewers this may be synthetic media.", con: "In a crisis, people act before reading labels."},
      "Reduce Distribution": {pro: "Slows viral panic.", con: "Even limited spread of a fake war declaration is extremely dangerous."},
      "Remove": {pro: "Prevents potentially catastrophic real-world consequences.", con: "Must act fast — detection and removal speed is the real challenge."}
    },
    recommended: "Remove"
  }
];

let actionLabels = ["Leave Up", "Add Warning", "Reduce Distribution", "Remove"];
let actionColors = ["teal", "orange", "goldenrod", "coral"];
let actionBgColors = ["rgb(230,248,246)", "rgb(255,243,224)", "rgb(255,248,220)", "rgb(255,228,225)"];

let currentScenario = 0;
let chosenAction = -1;
let answered = false;
let showSummary = false;
let decisions = [];
let scrollOffset = 0;

let actionButtons = [];
let nextBtn, tryAgainBtn;

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textWrap(WORD);

  // Create action buttons
  for (let i = 0; i < 4; i++) {
    let btn = createButton(actionLabels[i]);
    btn.parent(document.querySelector('main'));
    btn.style('font-size', '12px');
    btn.style('padding', '6px 8px');
    btn.style('border', '2px solid ' + actionColors[i]);
    btn.style('background', 'white');
    btn.style('color', actionColors[i]);
    btn.style('font-weight', 'bold');
    btn.style('cursor', 'pointer');
    btn.style('border-radius', '4px');
    let idx = i;
    btn.mousePressed(function() { handleAction(idx); });
    actionButtons.push(btn);
  }

  nextBtn = createButton('Next Scenario');
  nextBtn.parent(document.querySelector('main'));
  nextBtn.style('font-size', '14px');
  nextBtn.style('padding', '8px 20px');
  nextBtn.style('background', 'white');
  nextBtn.style('cursor', 'pointer');
  nextBtn.style('border-radius', '4px');
  nextBtn.mousePressed(advanceScenario);
  nextBtn.hide();

  tryAgainBtn = createButton('Try Again');
  tryAgainBtn.parent(document.querySelector('main'));
  tryAgainBtn.style('font-size', '14px');
  tryAgainBtn.style('padding', '8px 20px');
  tryAgainBtn.style('background', 'white');
  tryAgainBtn.style('cursor', 'pointer');
  tryAgainBtn.style('border-radius', '4px');
  tryAgainBtn.mousePressed(resetExercise);
  tryAgainBtn.hide();

  describe('A content moderation decision exercise with 6 social media scenarios. Users choose to leave up, add warning, reduce distribution, or remove each post, then see arguments for and against their decision.');
}

function draw() {
  background('aliceblue');

  // Control area
  noStroke();
  fill('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (showSummary) {
    drawSummary();
    hideActionButtons();
    nextBtn.hide();
    positionButton(tryAgainBtn, canvasWidth / 2 - 40, drawHeight + 15);
    tryAgainBtn.show();
  } else {
    drawProgress();
    drawPostCard();
    if (answered) {
      hideActionButtons();
      drawFeedback();
      positionButton(nextBtn, canvasWidth / 2 - 55, drawHeight + 15);
      nextBtn.show();
      tryAgainBtn.hide();
    } else {
      positionActionButtons();
      nextBtn.hide();
      tryAgainBtn.hide();
    }
  }
}

function drawProgress() {
  let barX = margin;
  let barY = 10;
  let barW = canvasWidth - margin * 2;
  let barH = 8;

  noStroke();
  fill(210);
  rect(barX, barY, barW, barH, 4);

  let progress = (answered ? currentScenario + 1 : currentScenario) / scenarios.length;
  fill('steelblue');
  rect(barX, barY, barW * progress, barH, 4);

  noStroke();
  fill(100);
  textSize(10);
  textAlign(RIGHT, TOP);
  text((currentScenario + 1) + ' / ' + scenarios.length, barX + barW, barY + 12);
}

function drawPostCard() {
  let scenario = scenarios[currentScenario];
  let cardX = margin;
  let cardY = 32;
  let cardW = canvasWidth - margin * 2;
  let cardH = 130;

  // Card shadow
  noStroke();
  fill(200);
  rect(cardX + 2, cardY + 2, cardW, cardH, 8);

  // Card background
  fill(255);
  rect(cardX, cardY, cardW, cardH, 8);

  // Type label
  fill('steelblue');
  textSize(10);
  textAlign(LEFT, TOP);
  noStroke();
  text(scenario.type.toUpperCase(), cardX + 12, cardY + 10);

  // Post content
  fill(30);
  textSize(13);
  textAlign(LEFT, TOP);
  noStroke();
  text(scenario.post, cardX + 12, cardY + 28, cardW - 24);

  // Metadata row
  let metaY = cardY + 90;
  textSize(10);
  fill(120);
  noStroke();
  textAlign(LEFT, TOP);
  text('Truthfulness: ' + scenario.truthfulness + '/5', cardX + 12, metaY);
  text('Harm potential: ' + scenario.harm + '/5', cardX + 12, metaY + 14);
  textAlign(RIGHT, TOP);
  text('Context: ' + scenario.context, cardX + cardW - 12, metaY, (cardW / 2) - 12);
}

function drawFeedback() {
  let scenario = scenarios[currentScenario];
  let chosen = actionLabels[chosenAction];
  let fb = scenario.feedback[chosen];
  let panelY = 210;
  let panelW = canvasWidth - margin * 2;

  // Decision label
  noStroke();
  fill(actionColors[chosenAction]);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Your decision: ' + chosen, margin, panelY);

  // For argument
  let argY = panelY + 22;
  noStroke();
  fill(230, 248, 230);
  rect(margin, argY, panelW, 56, 6);
  fill('darkgreen');
  textSize(11);
  textAlign(LEFT, TOP);
  noStroke();
  text('FOR:', margin + 8, argY + 6);
  fill(40);
  textSize(11);
  text(fb.pro, margin + 8, argY + 20, panelW - 16);

  // Against argument
  let againstY = argY + 64;
  noStroke();
  fill(255, 228, 225);
  rect(margin, againstY, panelW, 56, 6);
  fill('darkred');
  textSize(11);
  textAlign(LEFT, TOP);
  noStroke();
  text('AGAINST:', margin + 8, againstY + 6);
  fill(40);
  textSize(11);
  text(fb.con, margin + 8, againstY + 20, panelW - 16);

  // Recommended action
  let recY = againstY + 66;
  let recAction = scenario.recommended;
  let recIdx = actionLabels.indexOf(recAction);
  noStroke();
  fill(240, 240, 255);
  rect(margin, recY, panelW, 40, 6);
  fill(80);
  textSize(11);
  textAlign(LEFT, TOP);
  noStroke();
  text('Many platforms would: ', margin + 8, recY + 6);
  fill(actionColors[recIdx]);
  textSize(12);
  noStroke();
  text(recAction, margin + 8 + textWidth('Many platforms would: '), recY + 5);
  fill(80);
  textSize(10);
  noStroke();
  let matchText = (chosen === recAction) ? "Your choice matched!" : "Your choice differed — both perspectives have merit.";
  text(matchText, margin + 8, recY + 22);
}

function drawSummary() {
  // Title
  noStroke();
  fill(30);
  textSize(18);
  textAlign(CENTER, TOP);
  text('Your Moderation Summary', canvasWidth / 2, 15);

  // Count each action type
  let counts = [0, 0, 0, 0];
  let matches = 0;
  for (let i = 0; i < decisions.length; i++) {
    counts[decisions[i]]++;
    if (actionLabels[decisions[i]] === scenarios[i].recommended) {
      matches++;
    }
  }

  // Bar chart
  let chartX = margin + 10;
  let chartY = 50;
  let chartW = canvasWidth - margin * 2 - 20;
  let barH = 30;
  let barGap = 12;
  let maxCount = max(1, max(counts));

  for (let i = 0; i < 4; i++) {
    let y = chartY + i * (barH + barGap);

    // Label
    noStroke();
    fill(60);
    textSize(11);
    textAlign(RIGHT, CENTER);
    text(actionLabels[i], chartX + 100, y + barH / 2);

    // Bar background
    noStroke();
    fill(230);
    rect(chartX + 108, y, chartW - 130, barH, 4);

    // Bar fill
    let barWidth = (counts[i] / maxCount) * (chartW - 130);
    fill(actionColors[i]);
    rect(chartX + 108, y, barWidth, barH, 4);

    // Count label
    noStroke();
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    if (counts[i] > 0) {
      text(counts[i], chartX + 108 + barWidth / 2, y + barH / 2);
    }
  }

  // Scenario breakdown
  let breakdownY = chartY + 4 * (barH + barGap) + 10;
  noStroke();
  fill(60);
  textSize(13);
  textAlign(LEFT, TOP);
  text('Scenario Breakdown:', margin, breakdownY);

  for (let i = 0; i < decisions.length; i++) {
    let rowY = breakdownY + 22 + i * 28;

    // Background
    noStroke();
    let isMatch = actionLabels[decisions[i]] === scenarios[i].recommended;
    fill(isMatch ? 'rgb(230,248,230)' : 'rgb(255,243,230)');
    rect(margin, rowY, canvasWidth - margin * 2, 24, 4);

    // Scenario type
    fill(60);
    textSize(10);
    textAlign(LEFT, CENTER);
    noStroke();
    text((i + 1) + '. ' + scenarios[i].type, margin + 6, rowY + 12);

    // Your choice
    fill(actionColors[decisions[i]]);
    textSize(10);
    textAlign(RIGHT, CENTER);
    noStroke();
    let choiceText = actionLabels[decisions[i]];
    if (isMatch) choiceText += ' ✓';
    text(choiceText, canvasWidth - margin - 6, rowY + 12);
  }

  // Match score
  let scoreY = breakdownY + 22 + 6 * 28 + 8;
  noStroke();
  fill(60);
  textSize(13);
  textAlign(CENTER, TOP);
  text('Matched common platform decisions: ' + matches + ' / 6', canvasWidth / 2, scoreY);

  // Reflection prompt
  let reflectY = scoreY + 22;
  fill(100);
  textSize(11);
  textAlign(CENTER, TOP);
  noStroke();
  text('Reflect: Who should decide what stays online?\nWhat values guide your moderation choices?', canvasWidth / 2, reflectY, canvasWidth - margin * 2);
}

function positionActionButtons() {
  let btnY = 172;
  let totalW = 0;
  let gap = 6;

  // Calculate total button width for centering
  for (let i = 0; i < 4; i++) {
    actionButtons[i].show();
  }

  let btnWidths = [70, 90, 120, 65];
  for (let w of btnWidths) totalW += w;
  totalW += gap * 3;

  let startX = (canvasWidth - totalW) / 2;
  let cnv = document.querySelector('main canvas');
  if (!cnv) return;
  let r = cnv.getBoundingClientRect();

  let x = startX;
  for (let i = 0; i < 4; i++) {
    actionButtons[i].position(r.left + x, r.top + btnY);
    actionButtons[i].style('width', btnWidths[i] + 'px');
    x += btnWidths[i] + gap;
  }
}

function hideActionButtons() {
  for (let i = 0; i < 4; i++) {
    actionButtons[i].hide();
  }
}

function positionButton(btn, x, y) {
  let cnv = document.querySelector('main canvas');
  if (!cnv) return;
  let r = cnv.getBoundingClientRect();
  btn.position(r.left + x, r.top + y);
}

function handleAction(idx) {
  if (answered || showSummary) return;
  chosenAction = idx;
  answered = true;
  decisions.push(idx);
}

function advanceScenario() {
  if (currentScenario < scenarios.length - 1) {
    currentScenario++;
    chosenAction = -1;
    answered = false;
  } else {
    showSummary = true;
  }
}

function resetExercise() {
  currentScenario = 0;
  chosenAction = -1;
  answered = false;
  showSummary = false;
  decisions = [];
  hideActionButtons();
  nextBtn.hide();
  tryAgainBtn.hide();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let container = document.querySelector('main');
  if (container) {
    canvasWidth = min(container.offsetWidth - 10, 500);
  }
}
