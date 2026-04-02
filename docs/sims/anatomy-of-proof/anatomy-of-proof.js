// Anatomy of a Mathematical Proof
// CANVAS_HEIGHT: 580

// ---- Canvas dimensions ----
let containerWidth;
let canvasWidth = 400;
let drawHeight = 535;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// ---- Controls ----
let proofSelect;
let prevButton;
let nextButton;

// ---- State ----
let currentProof = 0;
let visibleSteps = 1;
let hoveredStep = -1;

// ---- Color palette (named-style RGB) ----
let colorAxiom, colorDefinition, colorStep, colorContradiction, colorConclusion;

// ---- Proof data ----
let proofs = [];

function buildProofs() {
  proofs = [
    {
      name: 'Infinite Primes (Euclid)',
      steps: [
        {
          text: 'Every integer > 1\nhas a prime factor',
          type: 'axiom',
          explanation: 'This is a fundamental axiom of number theory: any whole number greater than 1 can be divided by at least one prime number.',
          dependencies: []
        },
        {
          text: 'Assume finite set of\nall primes: p\u2081, p\u2082, \u2026, p\u2099',
          type: 'definition',
          explanation: 'We begin a proof by contradiction. Suppose, for the sake of argument, that there are only finitely many primes, and we can list them all.',
          dependencies: []
        },
        {
          text: 'Construct\nN = (p\u2081 \u00d7 p\u2082 \u00d7 \u2026 \u00d7 p\u2099) + 1',
          type: 'step',
          explanation: 'Multiply all the primes in our assumed complete list together, then add 1. This creates a specific number N that we can reason about.',
          dependencies: [1]
        },
        {
          text: 'N is greater than\nevery prime in our list',
          type: 'step',
          explanation: 'Since N is the product of all listed primes plus 1, it must be larger than any individual prime in the list.',
          dependencies: [2]
        },
        {
          text: 'N must have a\nprime factor (by Step 1)',
          type: 'step',
          explanation: 'By our axiom, since N > 1, it must be divisible by at least one prime number. Call this prime factor q.',
          dependencies: [0, 3]
        },
        {
          text: 'This factor cannot be\nin our list (remainder 1)',
          type: 'contradiction',
          explanation: 'If we divide N by any prime p\u1d62 from our list, we get a remainder of 1 (because N = product + 1). So q is a prime NOT in our list \u2014 contradicting our assumption!',
          dependencies: [2, 4]
        },
        {
          text: 'Therefore, there are\ninfinitely many primes',
          type: 'conclusion',
          explanation: 'Our assumption that primes are finite led to a contradiction. Therefore, the set of prime numbers must be infinite. QED.',
          dependencies: [5]
        }
      ]
    },
    {
      name: 'Pythagorean Theorem',
      steps: [
        {
          text: 'Given: right triangle\nwith sides a, b, c',
          type: 'definition',
          explanation: 'We start with a right triangle where c is the hypotenuse (the side opposite the right angle) and a, b are the other two sides.',
          dependencies: []
        },
        {
          text: 'Construct square of\nside (a + b)',
          type: 'step',
          explanation: 'Build a large square with side length (a + b). Inside it, arrange four copies of the right triangle, leaving a tilted square of side c in the center.',
          dependencies: [0]
        },
        {
          text: 'Area of large square\n= (a + b)\u00b2 = a\u00b2 + 2ab + b\u00b2',
          type: 'step',
          explanation: 'The total area of the outer square can be computed by expanding (a + b) squared using algebra.',
          dependencies: [1]
        },
        {
          text: 'Same area = 4 triangles\n+ inner square = 4(\u00bdab) + c\u00b2',
          type: 'step',
          explanation: 'We can also compute the same total area by adding up the four triangles (each with area \u00bdab) plus the inner square (area c\u00b2).',
          dependencies: [1]
        },
        {
          text: 'a\u00b2 + 2ab + b\u00b2 = 2ab + c\u00b2',
          type: 'step',
          explanation: 'Setting the two area expressions equal: (a + b)\u00b2 = 4(\u00bdab) + c\u00b2, which simplifies to a\u00b2 + 2ab + b\u00b2 = 2ab + c\u00b2.',
          dependencies: [2, 3]
        },
        {
          text: 'Therefore a\u00b2 + b\u00b2 = c\u00b2',
          type: 'conclusion',
          explanation: 'Subtracting 2ab from both sides gives us the Pythagorean Theorem: the sum of the squares of the two shorter sides equals the square of the hypotenuse. QED.',
          dependencies: [4]
        }
      ]
    },
    {
      name: 'Irrationality of \u221a2',
      steps: [
        {
          text: 'Definition: rational = a/b\nwhere a,b are integers, b\u22600',
          type: 'definition',
          explanation: 'A rational number is any number that can be expressed as a fraction of two integers. We need this definition to know what we are trying to disprove.',
          dependencies: []
        },
        {
          text: 'Assume \u221a2 = a/b\nin lowest terms (gcd = 1)',
          type: 'definition',
          explanation: 'Proof by contradiction: assume \u221a2 IS rational, so \u221a2 = a/b where the fraction is fully reduced (a and b share no common factors).',
          dependencies: [0]
        },
        {
          text: 'Then 2 = a\u00b2/b\u00b2\nso a\u00b2 = 2b\u00b2',
          type: 'step',
          explanation: 'Square both sides of \u221a2 = a/b. This gives us 2 = a\u00b2/b\u00b2, and multiplying both sides by b\u00b2 yields a\u00b2 = 2b\u00b2.',
          dependencies: [1]
        },
        {
          text: 'a\u00b2 is even,\nso a must be even',
          type: 'step',
          explanation: 'Since a\u00b2 = 2b\u00b2, a\u00b2 is divisible by 2 (even). But if a\u00b2 is even, then a itself must be even (an odd number squared is always odd).',
          dependencies: [2]
        },
        {
          text: 'Write a = 2k,\nthen (2k)\u00b2 = 2b\u00b2\nso 4k\u00b2 = 2b\u00b2',
          type: 'step',
          explanation: 'Since a is even, write a = 2k for some integer k. Substituting into a\u00b2 = 2b\u00b2 gives 4k\u00b2 = 2b\u00b2.',
          dependencies: [3]
        },
        {
          text: 'b\u00b2 = 2k\u00b2,\nso b is also even',
          type: 'step',
          explanation: 'Dividing 4k\u00b2 = 2b\u00b2 by 2 gives b\u00b2 = 2k\u00b2. By the same logic as before, b must be even.',
          dependencies: [4]
        },
        {
          text: 'Both a and b are even\n\u2014 contradicts gcd(a,b) = 1',
          type: 'contradiction',
          explanation: 'If both a and b are even, they share a common factor of 2. But we assumed a/b was in lowest terms! This is a contradiction.',
          dependencies: [3, 5]
        },
        {
          text: 'Therefore \u221a2\nis irrational',
          type: 'conclusion',
          explanation: 'Our assumption that \u221a2 is rational led to a contradiction. Therefore \u221a2 cannot be expressed as a fraction \u2014 it is irrational. QED.',
          dependencies: [6]
        }
      ]
    }
  ];
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  let mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  buildProofs();

  // Colors
  colorAxiom = color(0, 150, 136);        // teal
  colorDefinition = color(218, 165, 32);   // goldenrod/amber
  colorStep = color(255, 255, 224);        // lightyellow/cream
  colorContradiction = color(240, 128, 128); // lightcoral
  colorConclusion = color(255, 248, 220);  // cornsilk with gold border

  // Proof selector dropdown
  proofSelect = createSelect();
  proofSelect.parent(mainElement);
  for (let i = 0; i < proofs.length; i++) {
    proofSelect.option(proofs[i].name);
  }
  proofSelect.selected(proofs[0].name);
  proofSelect.position(10, drawHeight + 10);
  proofSelect.style('font-size', '12px');
  proofSelect.changed(() => {
    for (let i = 0; i < proofs.length; i++) {
      if (proofs[i].name === proofSelect.value()) {
        currentProof = i;
        visibleSteps = 1;
        break;
      }
    }
  });

  // Previous button
  prevButton = createButton('Previous');
  prevButton.parent(mainElement);
  prevButton.position(canvasWidth - 160, drawHeight + 10);
  prevButton.mousePressed(() => {
    if (visibleSteps > 1) visibleSteps--;
  });

  // Next button
  nextButton = createButton('Next');
  nextButton.parent(mainElement);
  nextButton.position(canvasWidth - 70, drawHeight + 10);
  nextButton.mousePressed(() => {
    let maxSteps = proofs[currentProof].steps.length;
    if (visibleSteps < maxSteps) visibleSteps++;
  });

  textFont('Arial');
  describe('Step-through proof visualizer showing the logical structure of mathematical proofs as flowcharts with color-coded steps', LABEL);
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
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Anatomy of a Proof', canvasWidth / 2, 8);

  // Subtitle with proof name
  textSize(14);
  fill(80);
  text(proofs[currentProof].name, canvasWidth / 2, 36);

  // Step counter
  let totalSteps = proofs[currentProof].steps.length;
  textSize(12);
  fill(100);
  text('Step ' + visibleSteps + ' of ' + totalSteps, canvasWidth / 2, 54);

  // Draw the proof flowchart
  let steps = proofs[currentProof].steps;
  let boxW = canvasWidth - 60;
  let boxH = 40;
  let startY = 72;
  let spacingY = computeSpacing(steps.length, startY, drawHeight - 20, boxH);

  // Compute box positions
  let positions = [];
  for (let i = 0; i < steps.length; i++) {
    let bx = canvasWidth / 2;
    let by = startY + i * spacingY + boxH / 2;
    positions.push({ x: bx, y: by });
  }

  // Detect hover
  hoveredStep = -1;
  for (let i = 0; i < visibleSteps; i++) {
    let p = positions[i];
    if (mouseX >= p.x - boxW / 2 && mouseX <= p.x + boxW / 2 &&
        mouseY >= p.y - boxH / 2 && mouseY <= p.y + boxH / 2) {
      hoveredStep = i;
    }
  }

  // Draw dependency arrows first (behind boxes)
  for (let i = 0; i < visibleSteps; i++) {
    let step = steps[i];
    for (let d = 0; d < step.dependencies.length; d++) {
      let depIdx = step.dependencies[d];
      if (depIdx < visibleSteps) {
        drawArrow(positions[depIdx].x, positions[depIdx].y + boxH / 2,
                  positions[i].x, positions[i].y - boxH / 2);
      }
    }
  }

  // Draw step boxes
  for (let i = 0; i < steps.length; i++) {
    let p = positions[i];
    let step = steps[i];
    let isVisible = i < visibleSteps;
    let isHovered = (i === hoveredStep);

    if (isVisible) {
      // Box fill color based on type
      let boxColor = getStepColor(step.type);
      fill(boxColor);

      // Border
      if (step.type === 'conclusion') {
        stroke(218, 165, 32); // gold border
        strokeWeight(3);
      } else if (isHovered) {
        stroke(0, 100, 200);
        strokeWeight(2);
      } else {
        stroke(120);
        strokeWeight(1);
      }

      rectMode(CENTER);
      rect(p.x, p.y, boxW, boxH, 8);
      rectMode(CORNER);

      // Step number badge
      let badgeX = p.x - boxW / 2 + 16;
      let badgeY = p.y;
      noStroke();
      fill(60);
      ellipse(badgeX, badgeY, 22, 22);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(11);
      text(i + 1, badgeX, badgeY - 1);

      // Step text
      noStroke();
      fill(getTextColor(step.type));
      textAlign(CENTER, CENTER);
      textSize(12);
      text(step.text.replace(/\n/g, ' '), p.x + 10, p.y, boxW - 50, boxH - 6);

      // Type label
      textSize(9);
      fill(getTypeLabelColor(step.type));
      textAlign(RIGHT, CENTER);
      text(step.type.toUpperCase(), p.x + boxW / 2 - 6, p.y - boxH / 2 + 10);
    } else {
      // Dimmed placeholder
      fill(230, 230, 240, 120);
      noStroke();
      rectMode(CENTER);
      rect(p.x, p.y, boxW, boxH, 8);
      rectMode(CORNER);

      fill(180);
      textAlign(CENTER, CENTER);
      textSize(12);
      text('Step ' + (i + 1) + ' — click Next to reveal', p.x, p.y);
    }
  }

  // Draw tooltip for hovered step
  if (hoveredStep >= 0 && hoveredStep < visibleSteps) {
    drawTooltip(steps[hoveredStep].explanation);
  }

  // Legend
  drawLegend();
}

function getStepColor(type) {
  switch (type) {
    case 'axiom': return color(0, 150, 136, 60);         // teal translucent
    case 'definition': return color(218, 165, 32, 60);    // amber translucent
    case 'step': return color(255, 255, 224);             // lightyellow
    case 'contradiction': return color(240, 128, 128, 80);// coral translucent
    case 'conclusion': return color(255, 248, 220);       // cornsilk
    default: return color(240);
  }
}

function getTextColor(type) {
  switch (type) {
    case 'axiom': return color(0, 80, 70);
    case 'definition': return color(100, 70, 0);
    case 'contradiction': return color(120, 20, 20);
    default: return color(40);
  }
}

function getTypeLabelColor(type) {
  switch (type) {
    case 'axiom': return color(0, 120, 110);
    case 'definition': return color(160, 120, 0);
    case 'step': return color(120, 120, 80);
    case 'contradiction': return color(200, 60, 60);
    case 'conclusion': return color(180, 140, 0);
    default: return color(100);
  }
}

function computeSpacing(numSteps, startY, endY, boxH) {
  let available = endY - startY - boxH;
  if (numSteps <= 1) return 0;
  return available / (numSteps - 1);
}

function drawArrow(x1, y1, x2, y2) {
  let gap = 4;
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len = sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  let ux = dx / len;
  let uy = dy / len;

  let sx = x1 + ux * gap;
  let sy = y1 + uy * gap;
  let ex = x2 - ux * gap;
  let ey = y2 - uy * gap;

  stroke(100, 100, 160);
  strokeWeight(1.5);
  line(sx, sy, ex, ey);

  // Arrowhead
  let arrowSize = 7;
  let angle = atan2(ey - sy, ex - sx);
  fill(100, 100, 160);
  noStroke();
  push();
  translate(ex, ey);
  rotate(angle);
  triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
  pop();
}

function drawTooltip(explanationText) {
  let tooltipW = canvasWidth - 30;
  let tooltipH = 70;
  let tooltipX = 15;
  let tooltipY = drawHeight - tooltipH - 8;

  // Background
  fill(255, 255, 240, 245);
  stroke(100, 100, 160);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipW, tooltipH, 6);

  // Label
  noStroke();
  fill(0, 100, 160);
  textAlign(LEFT, TOP);
  textSize(10);
  text('EXPLANATION', tooltipX + 8, tooltipY + 4);

  // Text
  fill(40);
  textSize(11);
  textAlign(LEFT, TOP);
  text(explanationText, tooltipX + 8, tooltipY + 18, tooltipW - 16, tooltipH - 22);
}

function drawLegend() {
  let lx = 12;
  let ly = drawHeight - 88;
  let dotSize = 10;
  let spacing = 64;

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(9);

  let legendItems = [
    { label: 'Axiom', col: color(0, 150, 136) },
    { label: 'Defn', col: color(218, 165, 32) },
    { label: 'Step', col: color(200, 200, 150) },
    { label: 'Contra.', col: color(240, 128, 128) },
    { label: 'Concl.', col: color(218, 165, 32) }
  ];

  for (let i = 0; i < legendItems.length; i++) {
    let ix = lx + i * spacing;
    fill(legendItems[i].col);
    if (i === 4) {
      // conclusion: gold border box
      stroke(218, 165, 32);
      strokeWeight(2);
      rect(ix, ly - dotSize / 2, dotSize, dotSize, 2);
      noStroke();
    } else {
      noStroke();
      rect(ix, ly - dotSize / 2, dotSize, dotSize, 2);
    }
    fill(80);
    noStroke();
    text(legendItems[i].label, ix + dotSize + 3, ly);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.offsetWidth;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = max(350, min(containerWidth, 500));

  // Reposition controls
  if (proofSelect) proofSelect.position(10, drawHeight + 10);
  if (prevButton) prevButton.position(canvasWidth - 160, drawHeight + 10);
  if (nextButton) nextButton.position(canvasWidth - 70, drawHeight + 10);
}
