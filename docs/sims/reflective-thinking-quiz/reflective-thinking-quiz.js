// Reflective Thinking Quiz MicroSim
// Assess your own reflective thinking habits through 6 scenario-based questions
// Bloom Level: Evaluate (L5) - Students judge their own reasoning patterns
// MicroSim template version 2026.02

// Canvas dimensions
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// Color scheme: Teal background, amber highlights, coral feedback
let tealBg, tealDark, amber, coral, cream, darkText;

// Quiz state
let currentScenario = 0;
let selectedOption = -1;
let showFeedback = false;
let showProfile = false;
let responses = []; // stores the level chosen for each scenario (1-4)
let hoveredOption = -1;

// Button references
let nextButton;
let tryAgainButton;

// Scenarios data
let scenarios = [
  {
    title: "Media Literacy",
    context: "Your friend shares a news article claiming that a new study proves chocolate prevents cancer.",
    question: "What is your first reaction?",
    options: [
      "Cool, I love chocolate! Time to eat more.",
      "That sounds too good to be true, but interesting.",
      "I'd want to see the actual study and check who funded the research.",
      "I'd check the study design, consider my own bias toward wanting it to be true, and look for alternative explanations or conflicting evidence."
    ],
    feedback: [
      "Level 1 - Unreflective Acceptance: Accepting a claim without questioning it leaves you vulnerable to misinformation. Knowledge claims require evidence.",
      "Level 2 - Initial Skepticism: Healthy doubt is a start, but without follow-up action, skepticism alone does not deepen understanding.",
      "Level 3 - Evidence-Seeking: Checking sources and funding shows strong critical thinking. You are evaluating the reliability of the knowledge claim.",
      "Level 4 - Deep Reflection: Examining your own biases alongside the evidence demonstrates metacognition — thinking about your own thinking. This is the hallmark of reflective practice."
    ]
  },
  {
    title: "Authority and Evidence",
    context: "Your teacher states that a historical event happened for a specific reason, but you recently read a different interpretation in a well-regarded book.",
    question: "How do you respond?",
    options: [
      "The teacher is the expert, so they must be right.",
      "That's interesting — I wonder which version is correct.",
      "I'd compare both sources and look for primary evidence to evaluate each interpretation.",
      "I'd consider why the interpretations differ — what assumptions, perspectives, or evidence each relies on — and reflect on why I find one more convincing."
    ],
    feedback: [
      "Level 1 - Appeal to Authority: Accepting a claim solely because of someone's position is a logical fallacy. Even experts can present incomplete perspectives.",
      "Level 2 - Awareness of Disagreement: Recognizing a conflict is important, but framing it as 'which is correct' assumes only one answer exists.",
      "Level 3 - Comparative Analysis: Seeking primary evidence and comparing sources shows sophisticated evaluation of knowledge claims.",
      "Level 4 - Epistemological Reflection: Analyzing the underlying assumptions and your own inclinations demonstrates awareness of how knowledge is constructed and interpreted."
    ]
  },
  {
    title: "Perspective and Bias",
    context: "You learn about a cultural practice from another country that seems very strange or even wrong to you.",
    question: "What is your response?",
    options: [
      "That's just weird. My way of doing things is normal.",
      "Different cultures do different things, I suppose.",
      "I'd research the practice to understand its cultural context and significance before judging it.",
      "I'd examine why it seems 'wrong' to me — what cultural assumptions am I bringing? How might someone from that culture view my practices?"
    ],
    feedback: [
      "Level 1 - Ethnocentric Reaction: Judging other cultures by your own standards without reflection is a form of cognitive bias called ethnocentrism.",
      "Level 2 - Surface Tolerance: Acknowledging difference is a start, but without genuine inquiry, it remains superficial understanding.",
      "Level 3 - Contextual Inquiry: Researching before judging shows respect for evidence and cultural context as important to knowledge.",
      "Level 4 - Critical Self-Examination: Questioning your own cultural lens is the deepest form of reflective thinking. It recognizes that your perspective is one among many."
    ]
  },
  {
    title: "Emotion vs. Evidence",
    context: "A close friend tearfully tells you that a specific alternative medicine cured their chronic illness, even though clinical trials have not supported its effectiveness.",
    question: "How do you think about their claim?",
    options: [
      "If it worked for them, it must be a real cure.",
      "I'm happy for them, but I'm not sure about it myself.",
      "I'd consider that their improvement could have other explanations, like placebo effect or natural recovery, while being supportive.",
      "I'd reflect on how my emotional connection to my friend might influence my judgment, examine the evidence carefully, and consider why anecdotal testimony feels so compelling."
    ],
    feedback: [
      "Level 1 - Anecdotal Reasoning: Personal testimony, especially from someone we trust, can feel convincing but is not reliable evidence for causal claims.",
      "Level 2 - Cautious Doubt: Being uncertain is reasonable, but without examining why you doubt, the response stays at the surface level.",
      "Level 3 - Alternative Explanations: Considering placebo effects and natural recovery shows understanding of confounding variables in knowledge claims.",
      "Level 4 - Metacognitive Awareness: Recognizing how emotion and relationship influence your judgment is a sophisticated reflective skill. It separates empathy from epistemology."
    ]
  },
  {
    title: "Belief Perseverance",
    context: "You have always believed that people use only 10% of their brains. You encounter a neuroscience article explaining that this is a myth and that brain imaging shows widespread activity.",
    question: "What do you do with this new information?",
    options: [
      "I don't believe it. I've heard the 10% thing my whole life.",
      "Hmm, maybe. But it's hard to let go of what I've always thought.",
      "I'd read the neuroscience evidence carefully and update my belief if the evidence is strong.",
      "I'd examine why I held this belief so firmly, what made it feel true, and reflect on how resistant I am to changing beliefs even when faced with evidence."
    ],
    feedback: [
      "Level 1 - Belief Perseverance: Clinging to a belief despite contrary evidence is a well-documented cognitive bias. Familiarity does not equal truth.",
      "Level 2 - Emotional Resistance: Recognizing it's 'hard to let go' shows self-awareness, but without actively engaging with the evidence, the old belief persists.",
      "Level 3 - Evidence-Based Updating: Willingness to change your mind based on evidence is a cornerstone of rational thinking and intellectual honesty.",
      "Level 4 - Reflective Metacognition: Examining why you held the belief and how you resist change reveals deep understanding of your own cognitive processes."
    ]
  },
  {
    title: "Authority Bias",
    context: "A political commentator you respect and generally agree with makes a claim about economic policy that you haven't verified independently.",
    question: "How do you treat this claim?",
    options: [
      "If they said it, it's probably true. They're usually right.",
      "I'll take their word for it, but I know they could be wrong.",
      "I'd look for independent data and expert analysis before forming my own view.",
      "I'd ask myself why I trust this source, whether my agreement is based on evidence or ideological alignment, and seek out perspectives that challenge the claim."
    ],
    feedback: [
      "Level 1 - Authority Bias: Trusting a source because you agree with them creates an echo chamber. Agreement is not evidence.",
      "Level 2 - Conditional Trust: Acknowledging fallibility is good, but without action, the bias still shapes your belief.",
      "Level 3 - Independent Verification: Seeking independent data shows commitment to evidence over loyalty to a source.",
      "Level 4 - Self-Interrogation: Examining why you trust a source and whether alignment drives agreement is the deepest level of reflective thinking about authority."
    ]
  }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Define colors
  tealBg = color(0, 128, 128);
  tealDark = color(0, 100, 100);
  amber = color(255, 191, 0);
  coral = color(255, 100, 80);
  cream = color(255, 253, 240);
  darkText = color(30, 30, 30);

  // Create Next button
  nextButton = createButton('Next Scenario');
  nextButton.parent(document.querySelector('main'));
  nextButton.position(canvasWidth / 2 - 70, drawHeight + 10);
  nextButton.mousePressed(advanceScenario);
  nextButton.style('font-size', '16px');
  nextButton.style('padding', '6px 20px');
  nextButton.style('background-color', '#008080');
  nextButton.style('color', 'white');
  nextButton.style('border', 'none');
  nextButton.style('border-radius', '4px');
  nextButton.style('cursor', 'pointer');
  nextButton.hide();

  // Create Try Again button
  tryAgainButton = createButton('Try Again');
  tryAgainButton.parent(document.querySelector('main'));
  tryAgainButton.position(canvasWidth / 2 - 50, drawHeight + 10);
  tryAgainButton.mousePressed(resetQuiz);
  tryAgainButton.style('font-size', '16px');
  tryAgainButton.style('padding', '6px 20px');
  tryAgainButton.style('background-color', '#FF6450');
  tryAgainButton.style('color', 'white');
  tryAgainButton.style('border', 'none');
  tryAgainButton.style('border-radius', '4px');
  tryAgainButton.style('cursor', 'pointer');
  tryAgainButton.hide();

  describe('Reflective Thinking Quiz: a self-assessment with 6 scenarios testing your level of reflective thinking', LABEL);
}

function draw() {
  updateCanvasSize();

  if (showProfile) {
    drawProfile();
  } else {
    drawScenario();
  }

  // Control area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Update button positions on resize
  if (showProfile) {
    nextButton.hide();
    tryAgainButton.position(canvasWidth / 2 - 50, drawHeight + 10);
    tryAgainButton.show();
  } else if (showFeedback) {
    if (currentScenario < scenarios.length - 1) {
      nextButton.html('Next Scenario');
    } else {
      nextButton.html('See My Profile');
    }
    nextButton.position(canvasWidth / 2 - 70, drawHeight + 10);
    nextButton.show();
    tryAgainButton.hide();
  } else {
    nextButton.hide();
    tryAgainButton.hide();
  }
}

function drawScenario() {
  let scenario = scenarios[currentScenario];

  // Drawing area background - teal
  fill(tealBg);
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  let contentWidth = canvasWidth - margin * 2;
  let yPos = 15;

  // Title
  fill(cream);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  text('Reflective Thinking Quiz', canvasWidth / 2, yPos);
  yPos += 30;

  // Progress indicator
  textSize(14);
  textStyle(NORMAL);
  fill(amber);
  text('Scenario ' + (currentScenario + 1) + ' of ' + scenarios.length + '  —  ' + scenario.title, canvasWidth / 2, yPos);
  yPos += 30;

  // Progress bar
  let barWidth = contentWidth * 0.6;
  let barX = (canvasWidth - barWidth) / 2;
  fill(0, 80, 80);
  noStroke();
  rect(barX, yPos, barWidth, 6, 3);
  fill(amber);
  rect(barX, yPos, barWidth * ((currentScenario + (showFeedback ? 1 : 0)) / scenarios.length), 6, 3);
  yPos += 20;

  // Scenario panel
  let panelX = margin;
  let panelWidth = contentWidth;
  fill(cream);
  noStroke();
  rect(panelX, yPos, panelWidth, 70, 8);

  fill(darkText);
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(NORMAL);
  text(scenario.context, panelX + 12, yPos + 10, panelWidth - 24);
  yPos += 55;

  // Question
  fill(amber);
  textSize(17);
  textStyle(BOLD);
  text(scenario.question, panelX + 12, yPos + 10);
  yPos += 40;
  textStyle(NORMAL);

  // Options
  let optionHeight = 52;
  let optionGap = 6;

  for (let i = 0; i < 4; i++) {
    let optY = yPos + i * (optionHeight + optionGap);
    let isSelected = (selectedOption === i);
    let isHovered = (hoveredOption === i && !showFeedback);

    // Option background
    if (isSelected && showFeedback) {
      fill(255, 240, 220); // highlighted after selection
      stroke(coral);
      strokeWeight(2);
    } else if (isSelected) {
      fill(220, 245, 245);
      stroke(tealDark);
      strokeWeight(2);
    } else if (isHovered) {
      fill(240, 250, 250);
      stroke(0, 140, 140);
      strokeWeight(1);
    } else {
      fill(255, 255, 255, 230);
      stroke(200);
      strokeWeight(1);
    }
    rect(panelX, optY, panelWidth, optionHeight, 6);

    // Option letter
    fill(isSelected ? tealDark : color(100));
    noStroke();
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    let letter = String.fromCharCode(65 + i); // A, B, C, D
    text(letter + '.', panelX + 10, optY + 8);

    // Option text
    fill(darkText);
    textStyle(NORMAL);
    textSize(14);
    text(scenario.options[i], panelX + 32, optY + 8, panelWidth - 44);
  }

  // Feedback panel
  if (showFeedback && selectedOption >= 0) {
    let feedbackY = yPos + 4 * (optionHeight + optionGap) + 5;
    let feedbackHeight = drawHeight - feedbackY - 5;

    // Feedback background
    fill(50, 40, 40, 220);
    noStroke();
    rect(panelX, feedbackY, panelWidth, feedbackHeight, 8);

    // Feedback text
    fill(coral);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    noStroke();
    text(scenario.feedback[selectedOption], panelX + 12, feedbackY + 10, panelWidth - 24);
    textStyle(NORMAL);
  }
}

function drawProfile() {
  // Background
  fill(tealBg);
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  let contentWidth = canvasWidth - margin * 2;
  let yPos = 15;

  // Title
  fill(cream);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  textStyle(BOLD);
  text('Your Reflective Thinking Profile', canvasWidth / 2, yPos);
  yPos += 40;

  // Count how many of each level
  let levelCounts = [0, 0, 0, 0];
  for (let i = 0; i < responses.length; i++) {
    levelCounts[responses[i] - 1]++;
  }

  // Calculate average
  let sum = 0;
  for (let i = 0; i < responses.length; i++) {
    sum += responses[i];
  }
  let average = sum / responses.length;

  // Summary text
  textSize(16);
  textStyle(NORMAL);
  fill(cream);
  let summaryText = "";
  if (average >= 3.5) {
    summaryText = "Excellent! You consistently demonstrate deep reflective thinking. You naturally question assumptions, examine evidence, and consider your own biases.";
  } else if (average >= 2.5) {
    summaryText = "Good progress! You show strong critical thinking skills. With practice, you can deepen your reflection by examining your own cognitive biases more consistently.";
  } else if (average >= 1.5) {
    summaryText = "You are developing your reflective thinking skills. Try to move beyond initial reactions and actively seek evidence before forming conclusions.";
  } else {
    summaryText = "Reflective thinking is a skill that develops with practice. Start by pausing before accepting claims and asking: What is the evidence?";
  }
  textAlign(LEFT, TOP);
  text(summaryText, margin + 10, yPos, contentWidth - 20);
  yPos += 75;

  // Average score display
  fill(amber);
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Average Level: ' + nf(average, 1, 1) + ' / 4.0', canvasWidth / 2, yPos);
  yPos += 35;
  textStyle(NORMAL);

  // Bar chart
  let chartX = margin + 40;
  let chartWidth = contentWidth - 80;
  let chartHeight = 160;
  let barMaxWidth = chartWidth - 120;

  let levelLabels = ['Level 1: Accept', 'Level 2: Skeptic', 'Level 3: Evidence', 'Level 4: Reflect'];
  let levelColors = [color(200, 80, 80), color(220, 160, 60), color(60, 180, 120), color(40, 150, 200)];
  let barH = 30;
  let barGap = 10;

  for (let i = 0; i < 4; i++) {
    let barY = yPos + i * (barH + barGap);

    // Label
    fill(cream);
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(levelLabels[i], chartX + 110, barY + barH / 2);

    // Bar background
    fill(0, 80, 80);
    noStroke();
    rect(chartX + 120, barY, barMaxWidth, barH, 4);

    // Bar fill
    let barW = (levelCounts[i] / scenarios.length) * barMaxWidth;
    fill(levelColors[i]);
    if (barW > 0) {
      rect(chartX + 120, barY, barW, barH, 4);
    }

    // Count label
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(levelCounts[i] + ' / ' + scenarios.length, chartX + 125 + barW, barY + barH / 2);
    textStyle(NORMAL);
  }

  yPos += 4 * (barH + barGap) + 20;

  // Per-scenario breakdown
  fill(cream);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text('Scenario Breakdown', canvasWidth / 2, yPos);
  yPos += 25;
  textStyle(NORMAL);

  let scenarioLabels = ['Media', 'Authority', 'Culture', 'Emotion', 'Belief', 'Bias'];
  let dotSize = 24;
  let dotSpacing = (contentWidth - 40) / 6;
  let dotsStartX = margin + 20 + dotSpacing / 2;

  for (let i = 0; i < responses.length; i++) {
    let dx = dotsStartX + i * dotSpacing;
    let level = responses[i];

    // Scenario label
    fill(cream);
    textAlign(CENTER, TOP);
    textSize(12);
    text(scenarioLabels[i], dx, yPos);

    // Level dot
    fill(levelColors[level - 1]);
    noStroke();
    circle(dx, yPos + 30, dotSize);

    // Level number
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(level, dx, yPos + 30);
    textStyle(NORMAL);
  }
}

function mousePressed() {
  if (showProfile || showFeedback) return;

  let scenario = scenarios[currentScenario];
  let panelX = margin;
  let panelWidth = canvasWidth - margin * 2;
  let optionHeight = 52;
  let optionGap = 6;
  // yPos calculation must match drawScenario
  let yPos = 15 + 30 + 30 + 20 + 55 + 40; // title + progress + bar + padding + scenario + question

  for (let i = 0; i < 4; i++) {
    let optY = yPos + i * (optionHeight + optionGap);
    if (mouseX >= panelX && mouseX <= panelX + panelWidth &&
        mouseY >= optY && mouseY <= optY + optionHeight) {
      selectedOption = i;
      showFeedback = true;
      responses.push(i + 1); // store level 1-4
      break;
    }
  }
}

function mouseMoved() {
  if (showProfile || showFeedback) {
    hoveredOption = -1;
    return;
  }

  let panelX = margin;
  let panelWidth = canvasWidth - margin * 2;
  let optionHeight = 52;
  let optionGap = 6;
  let yPos = 15 + 30 + 30 + 20 + 55 + 40;

  hoveredOption = -1;
  for (let i = 0; i < 4; i++) {
    let optY = yPos + i * (optionHeight + optionGap);
    if (mouseX >= panelX && mouseX <= panelX + panelWidth &&
        mouseY >= optY && mouseY <= optY + optionHeight) {
      hoveredOption = i;
      break;
    }
  }
}

function advanceScenario() {
  if (currentScenario < scenarios.length - 1) {
    currentScenario++;
    selectedOption = -1;
    showFeedback = false;
    hoveredOption = -1;
  } else {
    showProfile = true;
  }
}

function resetQuiz() {
  currentScenario = 0;
  selectedOption = -1;
  showFeedback = false;
  showProfile = false;
  responses = [];
  hoveredOption = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
