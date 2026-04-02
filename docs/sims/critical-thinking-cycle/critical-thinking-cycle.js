// Critical Thinking Cycle MicroSim
// An interactive cyclical diagram with five stages of critical thinking.
// Students click stages or step through with Next/Previous, selecting different claims to analyze.
// MicroSim template version 2026.02

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// ---- Cycle data ----
let stages = [
  {
    name: 'Question\nAssumptions',
    shortName: 'Question Assumptions',
    color: null, // set in setup
    angle: -Math.PI / 2 // top (12 o'clock)
  },
  {
    name: 'Evaluate\nEvidence',
    shortName: 'Evaluate Evidence',
    color: null,
    angle: -Math.PI / 2 + (2 * Math.PI / 5)
  },
  {
    name: 'Recognize\nBias',
    shortName: 'Recognize Bias',
    color: null,
    angle: -Math.PI / 2 + 2 * (2 * Math.PI / 5)
  },
  {
    name: 'Consider\nAlternatives',
    shortName: 'Consider Alternatives',
    color: null,
    angle: -Math.PI / 2 + 3 * (2 * Math.PI / 5)
  },
  {
    name: 'Draw\nConclusions',
    shortName: 'Draw Conclusions',
    color: null,
    angle: -Math.PI / 2 + 4 * (2 * Math.PI / 5)
  }
];

// Stage colors: teal-to-amber gradient
let stageColors = [
  [0, 150, 136],    // teal
  [38, 166, 120],   // teal-green
  [120, 170, 80],   // olive-green
  [200, 160, 50],   // amber-gold
  [230, 140, 30]    // amber
];

// ---- Claims and worked examples ----
let claims = [
  {
    label: 'The Earth is approximately 4.5 billion years old',
    type: 'Scientific Claim',
    steps: [
      {
        question: 'What assumptions underlie this claim?',
        analysis: 'This claim assumes that radiometric dating methods are reliable, that the laws of physics have been constant over time, and that scientists have accurately measured decay rates of isotopes in rocks.',
        prompt: 'Can you identify any assumption here that someone might challenge?'
      },
      {
        question: 'What evidence supports or undermines this claim?',
        analysis: 'Multiple independent dating methods (uranium-lead, potassium-argon, rubidium-strontium) converge on approximately 4.5 billion years. Meteorite samples and lunar rocks confirm this. The evidence is cross-verified across different labs worldwide.',
        prompt: 'How does having MULTIPLE lines of evidence strengthen a claim?'
      },
      {
        question: 'What biases might affect how we evaluate this claim?',
        analysis: 'Confirmation bias could lead us to accept this uncritically because it comes from scientists. Alternatively, cultural or religious commitments might lead someone to reject it regardless of evidence. Authority bias may prevent us from questioning the methods.',
        prompt: 'Which bias do you think is most likely to affect YOUR evaluation?'
      },
      {
        question: 'What alternative explanations exist?',
        analysis: 'Young Earth creationism proposes an age of ~6,000-10,000 years based on biblical genealogies. Some propose that decay rates changed over time. However, these alternatives lack the convergent evidence that supports the scientific consensus.',
        prompt: 'What would make an alternative explanation worth taking seriously?'
      },
      {
        question: 'What conclusion can we reasonably draw?',
        analysis: 'The convergence of multiple independent methods, the consistency across labs, and the lack of viable alternative mechanisms make this a well-supported scientific claim. Our conclusion: highly reliable, supported by strong empirical evidence.',
        prompt: 'How confident are you in this conclusion? What might change your mind?'
      }
    ]
  },
  {
    label: 'Vaccines cause autism',
    type: 'False Claim',
    steps: [
      {
        question: 'What assumptions underlie this claim?',
        analysis: 'This claim assumes a causal link between vaccination timing and autism onset. It assumes that correlation (autism is often diagnosed around vaccination age) equals causation, and that one retracted 1998 study was valid.',
        prompt: 'Why might someone confuse correlation with causation here?'
      },
      {
        question: 'What evidence supports or undermines this claim?',
        analysis: 'The original 1998 Wakefield study was retracted for fraud. Dozens of large-scale studies involving millions of children have found NO link. The timing coincidence occurs because autism symptoms emerge at the same age vaccinations are given.',
        prompt: 'How should we treat evidence from a study that was retracted for fraud?'
      },
      {
        question: 'What biases might affect how we evaluate this claim?',
        analysis: 'Post hoc reasoning ("my child was vaccinated, then diagnosed, so vaccines caused it") is powerful. Fear bias amplifies perceived risks. The Dunning-Kruger effect may lead people to overestimate their ability to evaluate medical research.',
        prompt: 'How does emotional investment in a belief make it harder to evaluate evidence?'
      },
      {
        question: 'What alternative explanations exist?',
        analysis: 'Autism has strong genetic components identified through twin studies and genome research. Better diagnostic criteria and increased awareness explain rising diagnosis rates. The timing overlap is coincidental, not causal.',
        prompt: 'Which explanation better fits ALL the available evidence?'
      },
      {
        question: 'What conclusion can we reasonably draw?',
        analysis: 'The overwhelming scientific evidence shows no causal link between vaccines and autism. The original claim was based on fraudulent research. This is a clear case where critical thinking reveals a false but emotionally compelling narrative.',
        prompt: 'What does this example teach us about the importance of checking sources?'
      }
    ]
  },
  {
    label: 'Democracy is the best system of government',
    type: 'Value Claim',
    steps: [
      {
        question: 'What assumptions underlie this claim?',
        analysis: 'This claim assumes we can rank political systems objectively. It assumes a shared definition of "best" and "democracy." It also assumes that one system can be universally optimal regardless of cultural context, history, or economic conditions.',
        prompt: 'What does "best" mean here? Best for whom, and by what criteria?'
      },
      {
        question: 'What evidence supports or undermines this claim?',
        analysis: 'Democracies tend to score higher on human development, press freedom, and corruption indices. However, some non-democratic nations (e.g., Singapore) achieve high prosperity. Democracies can also produce poor outcomes through populism or gridlock.',
        prompt: 'Can statistical correlations prove that one system is "best"?'
      },
      {
        question: 'What biases might affect how we evaluate this claim?',
        analysis: 'Cultural bias: those raised in democracies may assume their system is naturally superior. Survivorship bias: we compare successful democracies to failed autocracies while ignoring failed democracies and successful non-democracies.',
        prompt: 'How might your OWN cultural background shape your view of this claim?'
      },
      {
        question: 'What alternative explanations exist?',
        analysis: 'Meritocratic governance, constitutional monarchy, or technocratic systems each claim different strengths. Some argue the "best" system depends on context: a nation\'s history, culture, economic development, and social cohesion all matter.',
        prompt: 'Is it possible that no single system is "best" for all contexts?'
      },
      {
        question: 'What conclusion can we reasonably draw?',
        analysis: 'Unlike empirical claims, value claims cannot be settled by evidence alone. Democracy has demonstrable strengths, but calling it "the best" requires defining criteria and acknowledging context. This is a normative claim, not a purely factual one.',
        prompt: 'How is evaluating a value claim different from evaluating a factual claim?'
      }
    ]
  }
];

let activeStage = 0;
let selectedClaim = 0;

// ---- Controls ----
let claimSelect;
let prevButton;
let nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  // Assign colors
  for (let i = 0; i < stages.length; i++) {
    stages[i].color = stageColors[i];
  }

  // Create claim dropdown
  claimSelect = createSelect();
  claimSelect.parent(mainElement);
  for (let i = 0; i < claims.length; i++) {
    claimSelect.option(claims[i].label);
  }
  claimSelect.selected(claims[0].label);
  claimSelect.position(10, drawHeight + 12);
  claimSelect.style('font-size', '13px');
  claimSelect.style('max-width', (canvasWidth - 200) + 'px');
  claimSelect.changed(() => {
    for (let i = 0; i < claims.length; i++) {
      if (claims[i].label === claimSelect.value()) {
        selectedClaim = i;
        break;
      }
    }
  });

  // Previous button
  prevButton = createButton('Previous');
  prevButton.parent(mainElement);
  prevButton.position(canvasWidth - 170, drawHeight + 12);
  prevButton.mousePressed(() => {
    activeStage = (activeStage - 1 + stages.length) % stages.length;
  });

  // Next button
  nextButton = createButton('Next');
  nextButton.parent(mainElement);
  nextButton.position(canvasWidth - 80, drawHeight + 12);
  nextButton.mousePressed(() => {
    activeStage = (activeStage + 1) % stages.length;
  });

  textFont('Arial');
  describe('Critical Thinking Cycle: interactive diagram with five stages that students click through to analyze knowledge claims', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // ---- Title ----
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Critical Thinking Cycle', canvasWidth / 2, 10);

  // ---- Show selected claim ----
  textSize(18);
  fill(80);
  textAlign(LEFT, TOP);
  let claimText = 'Claim (' + claims[selectedClaim].type + '): "' + claims[selectedClaim].label + '"';
  let claimW = canvasWidth - 40;
  let claimX = 20;
  text(claimText, claimX, 40, claimW);

  // ---- Draw the cycle ----
  let cycleRadius = Math.min(canvasWidth * 0.22, 130);
  let centerX = canvasWidth * 0.3;
  let centerY = 280;
  let nodeRadius = Math.min(canvasWidth * 0.09, 52);

  // Narrow screen adjustment
  if (canvasWidth < 500) {
    centerX = canvasWidth / 2;
    centerY = 265;
    cycleRadius = Math.min(canvasWidth * 0.25, 120);
    nodeRadius = Math.min(canvasWidth * 0.1, 48);
  }

  // Draw arrows between stages
  for (let i = 0; i < stages.length; i++) {
    let next = (i + 1) % stages.length;
    let x1 = centerX + cycleRadius * cos(stages[i].angle);
    let y1 = centerY + cycleRadius * sin(stages[i].angle);
    let x2 = centerX + cycleRadius * cos(stages[next].angle);
    let y2 = centerY + cycleRadius * sin(stages[next].angle);

    // Shorten arrow to not overlap with node circles
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dist = sqrt(dx * dx + dy * dy);
    let offsetStart = nodeRadius + 4;
    let offsetEnd = nodeRadius + 10;
    let ax1 = x1 + (dx / dist) * offsetStart;
    let ay1 = y1 + (dy / dist) * offsetStart;
    let ax2 = x2 - (dx / dist) * offsetEnd;
    let ay2 = y2 - (dy / dist) * offsetEnd;

    stroke(100);
    strokeWeight(2);
    line(ax1, ay1, ax2, ay2);

    // Arrowhead
    let arrowSize = 8;
    let angle = atan2(ay2 - ay1, ax2 - ax1);
    fill(100);
    noStroke();
    triangle(
      ax2, ay2,
      ax2 - arrowSize * cos(angle - PI / 6), ay2 - arrowSize * sin(angle - PI / 6),
      ax2 - arrowSize * cos(angle + PI / 6), ay2 - arrowSize * sin(angle + PI / 6)
    );
  }

  // Draw stage nodes
  for (let i = 0; i < stages.length; i++) {
    let x = centerX + cycleRadius * cos(stages[i].angle);
    let y = centerY + cycleRadius * sin(stages[i].angle);
    let c = stages[i].color;

    // Glow effect for active stage
    if (i === activeStage) {
      noStroke();
      for (let g = 20; g > 0; g--) {
        fill(c[0], c[1], c[2], 8);
        ellipse(x, y, nodeRadius * 2 + g * 3, nodeRadius * 2 + g * 3);
      }
      fill(c[0], c[1], c[2]);
      stroke(255);
      strokeWeight(3);
    } else {
      fill(c[0], c[1], c[2], 180);
      stroke(c[0] * 0.7, c[1] * 0.7, c[2] * 0.7);
      strokeWeight(1.5);
    }

    ellipse(x, y, nodeRadius * 2, nodeRadius * 2);

    // Stage label
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(Math.min(12, nodeRadius * 0.28));
    text(stages[i].name, x, y);
  }

  // ---- Worked example panel ----
  let panelX, panelY, panelW, panelH;
  if (canvasWidth >= 500) {
    panelX = canvasWidth * 0.55;
    panelY = 150;
    panelW = canvasWidth * 0.42;
    panelH = 260;
  } else {
    panelX = 15;
    panelY = centerY + cycleRadius + nodeRadius + 20;
    panelW = canvasWidth - 30;
    panelH = drawHeight - panelY - 10;
  }

  // Panel background
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  let step = claims[selectedClaim].steps[activeStage];

  // Stage indicator at top of panel
  let sc = stageColors[activeStage];
  noStroke();
  fill(sc[0], sc[1], sc[2]);
  textAlign(LEFT, TOP);
  textSize(15);
  let stageLabel = 'Stage ' + (activeStage + 1) + ': ' + stages[activeStage].shortName;
  text(stageLabel, panelX + 12, panelY + 10);

  // Guiding question
  fill(30, 30, 120);
  textSize(13);
  textStyle(BOLD);
  text(step.question, panelX + 12, panelY + 32, panelW - 24);
  textStyle(NORMAL);

  // Analysis
  fill(50);
  textSize(12);
  let analysisY = panelY + 60;
  text(step.analysis, panelX + 12, analysisY, panelW - 24);

  // Student prompt
  let promptY = panelY + panelH - 40;
  fill(180, 100, 0);
  textSize(12);
  textStyle(ITALIC);
  text(step.prompt, panelX + 12, promptY, panelW - 24);
  textStyle(NORMAL);

  // ---- Step indicator dots ----
  let dotY = drawHeight - 20;
  let dotSpacing = 18;
  let dotsStartX = canvasWidth / 2 - (stages.length - 1) * dotSpacing / 2;
  for (let i = 0; i < stages.length; i++) {
    let dx = dotsStartX + i * dotSpacing;
    if (i === activeStage) {
      fill(stageColors[i][0], stageColors[i][1], stageColors[i][2]);
      noStroke();
      ellipse(dx, dotY, 12, 12);
    } else {
      fill(200);
      noStroke();
      ellipse(dx, dotY, 8, 8);
    }
  }

  // Instructions text
  noStroke();
  fill(120);
  textSize(11);
  textAlign(CENTER, BOTTOM);
  text('Click a stage in the cycle or use Previous / Next to step through', canvasWidth / 2, drawHeight - 2);
}

// Handle mouse clicks on stage nodes
function mousePressed() {
  let cycleRadius = Math.min(canvasWidth * 0.22, 130);
  let centerX = canvasWidth * 0.3;
  let centerY = 280;
  let nodeRadius = Math.min(canvasWidth * 0.09, 52);

  if (canvasWidth < 500) {
    centerX = canvasWidth / 2;
    centerY = 265;
    cycleRadius = Math.min(canvasWidth * 0.25, 120);
    nodeRadius = Math.min(canvasWidth * 0.1, 48);
  }

  for (let i = 0; i < stages.length; i++) {
    let x = centerX + cycleRadius * cos(stages[i].angle);
    let y = centerY + cycleRadius * sin(stages[i].angle);
    let d = dist(mouseX, mouseY, x, y);
    if (d < nodeRadius) {
      activeStage = i;
      break;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  // Reposition controls
  claimSelect.style('max-width', (canvasWidth - 200) + 'px');
  claimSelect.position(10, drawHeight + 12);
  prevButton.position(canvasWidth - 170, drawHeight + 12);
  nextButton.position(canvasWidth - 80, drawHeight + 12);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
