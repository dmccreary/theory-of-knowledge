// Translation Loss - Layered visualization of meaning layers and what survives translation
// CANVAS_HEIGHT: 510
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 60;
let canvasHeight = 510;
let margin = 20;
let defaultTextSize = 16;

let words = {
  "Saudade (Portuguese)": {
    denotation: {text: "A deep emotional state of longing", survives: true, translation: "Longing, nostalgia"},
    connotation: {text: "Bittersweet, beautiful sadness, uniquely Portuguese identity", survives: false, translation: "'Nostalgia' misses the sweet pleasure in the pain"},
    cultural: {text: "Central to Portuguese identity, fado music, maritime history of sailors leaving", survives: false, translation: "No equivalent cultural resonance in English"},
    sound: {text: "The soft 'sau-DA-deh' evokes a sigh", survives: false, translation: "English alternatives lack the melodic quality"}
  },
  "Hygge (Danish)": {
    denotation: {text: "Cozy, comfortable togetherness", survives: true, translation: "Coziness"},
    connotation: {text: "Warmth, safety, intimacy, candlelight, contentment", survives: false, translation: "'Cozy' misses the social and emotional richness"},
    cultural: {text: "Central to Danish identity, linked to long dark winters, social trust", survives: false, translation: "English has no equivalent cultural practice"},
    sound: {text: "'HOO-gah' — warm, rounded sound matches the feeling", survives: false, translation: "'Coziness' sounds clinical by comparison"}
  },
  "Schadenfreude (German)": {
    denotation: {text: "Pleasure derived from others' misfortune", survives: true, translation: "Borrowed directly into English"},
    connotation: {text: "Slightly guilty, human but not noble", survives: true, translation: "The borrowed word carries some connotation"},
    cultural: {text: "German philosophical tradition of analyzing emotions precisely", survives: false, translation: "English lacks this tradition of emotional taxonomy"},
    sound: {text: "'SHAH-den-froy-deh' — hard consonants match the concept's edge", survives: false, translation: "The English pronunciation softens it"}
  }
};

let layerKeys = ['denotation', 'connotation', 'cultural', 'sound'];
let layerNames = ['Denotation', 'Connotation', 'Cultural Context', 'Sound / Rhythm'];
let layerColors = ['teal', 'goldenrod', 'coral', 'mediumpurple'];

let wordSelect;
let selectedWord = "Saudade (Portuguese)";
let selectedLayer = -1; // -1 means none selected
let explanationText = "Click a layer to see what survives translation.";

// Animation
let peelAnimations = [0, 0, 0, 0]; // 0=full, 1=fully peeled
let peelTargets = [0, 0, 0, 0];
let crackOffsets = [];

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  wordSelect = createSelect();
  wordSelect.parent(document.querySelector('main'));
  for (let key of Object.keys(words)) {
    wordSelect.option(key);
  }
  wordSelect.selected(selectedWord);
  wordSelect.changed(() => {
    selectedWord = wordSelect.value();
    selectedLayer = -1;
    explanationText = "Click a layer to see what survives translation.";
    updatePeelTargets();
  });

  // Generate crack offsets for visual effect
  for (let i = 0; i < 20; i++) {
    crackOffsets.push({x: random(-3, 3), y: random(-2, 2)});
  }

  updatePeelTargets();
}

function updatePeelTargets() {
  let data = words[selectedWord];
  for (let i = 0; i < 4; i++) {
    let key = layerKeys[i];
    peelTargets[i] = data[key].survives ? 0 : 1;
  }
}

function draw() {
  background('aliceblue');

  // Control area
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Animate peeling
  for (let i = 0; i < 4; i++) {
    peelAnimations[i] = lerp(peelAnimations[i], peelTargets[i], 0.08);
  }

  // Layout
  let leftX = margin;
  let rightX = canvasWidth / 2 + 10;
  let layerAreaW = canvasWidth / 2 - margin - 10;
  let topY = 60;
  let layerH = 70;
  let gap = 8;
  let totalH = 4 * layerH + 3 * gap;

  // Title
  noStroke();
  fill('black');
  textSize(15);
  textAlign(CENTER, TOP);
  text("What Is Lost in Translation?", canvasWidth / 2, 8);

  // Column headers
  textSize(12);
  textAlign(CENTER, TOP);
  fill('black');
  noStroke();
  text("Original", leftX + layerAreaW / 2, 30);
  text("Translation", rightX + layerAreaW / 2, 30);

  // Arrow between columns
  stroke('gray');
  strokeWeight(2);
  let arrowY = 44;
  line(canvasWidth / 2 - 8, arrowY, canvasWidth / 2 + 4, arrowY);
  line(canvasWidth / 2 + 1, arrowY - 4, canvasWidth / 2 + 5, arrowY);
  line(canvasWidth / 2 + 1, arrowY + 4, canvasWidth / 2 + 5, arrowY);

  // Draw layers from top (sound) to bottom (denotation)
  for (let i = 3; i >= 0; i--) {
    let yPos = topY + (3 - i) * (layerH + gap);
    let data = words[selectedWord][layerKeys[i]];
    let peel = peelAnimations[i];
    let isSelected = (selectedLayer === i);
    let col = layerColors[i];

    // LEFT SIDE: Original word layer (always solid)
    noStroke();
    if (isSelected) {
      stroke('black');
      strokeWeight(2);
    }
    fill(col);
    rect(leftX, yPos, layerAreaW, layerH, 6);

    // Layer label on left
    noStroke();
    fill('white');
    textSize(13);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(layerNames[i], leftX + layerAreaW / 2, yPos + layerH / 2);
    textStyle(NORMAL);

    // RIGHT SIDE: Translation layer
    if (isSelected) {
      stroke('black');
      strokeWeight(2);
    } else {
      noStroke();
    }

    if (data.survives) {
      // Survives: draw solid
      fill(col);
      rect(rightX, yPos, layerAreaW, layerH, 6);
      noStroke();
      fill('white');
      textSize(11);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text(layerNames[i], rightX + layerAreaW / 2, yPos + layerH / 2 - 10);
      textStyle(NORMAL);
      textSize(10);
      text("Survives", rightX + layerAreaW / 2, yPos + layerH / 2 + 10);
    } else {
      // Does not survive: faded, cracked appearance
      let fadeAlpha = map(peel, 0, 1, 255, 40);

      // Draw faded layer
      let c = color(col);
      let r = red(c);
      let g = green(c);
      let b = blue(c);
      noStroke();
      fill(r, g, b, fadeAlpha);
      rect(rightX, yPos, layerAreaW, layerH, 6);

      // Draw crack lines when peeled
      if (peel > 0.3) {
        let crackAlpha = map(peel, 0.3, 1, 0, 200);
        stroke(255, 255, 255, crackAlpha);
        strokeWeight(1.5);
        // Draw diagonal crack lines
        let numCracks = 5;
        for (let c = 0; c < numCracks; c++) {
          let cx = rightX + (c + 1) * layerAreaW / (numCracks + 1);
          let ci = c % crackOffsets.length;
          let ox = crackOffsets[ci].x * 2;
          line(cx + ox, yPos + 2, cx - ox + crackOffsets[(ci + 3) % crackOffsets.length].x * 3, yPos + layerH - 2);
        }
      }

      // "Lost" label
      if (peel > 0.5) {
        let labelAlpha = map(peel, 0.5, 1, 0, 220);
        noStroke();
        fill(80, 80, 80, labelAlpha);
        textSize(12);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text("LOST", rightX + layerAreaW / 2, yPos + layerH / 2);
        textStyle(NORMAL);
      }
    }

    // Selection highlight border on left
    if (isSelected) {
      noFill();
      stroke('black');
      strokeWeight(2);
      rect(leftX, yPos, layerAreaW, layerH, 6);
    }
  }

  // Explanation panel at bottom of draw area
  let panelY = topY + totalH + 12;
  let panelH = drawHeight - panelY - 8;
  noStroke();
  fill(255, 255, 255, 200);
  rect(margin, panelY, canvasWidth - margin * 2, panelH, 6);

  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  let wrapW = canvasWidth - margin * 2 - 16;
  text(explanationText, margin + 8, panelY + 8, wrapW, panelH - 12);

  // Control area label
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text("Word:", 8, drawHeight + controlHeight / 2);

  // Position dropdown
  wordSelect.position(58, drawHeight + controlHeight / 2 - 12 + select('canvas').elt.offsetTop);
  wordSelect.style('font-size', '14px');
  wordSelect.style('padding', '2px 6px');
  wordSelect.style('background-color', 'white');

  describe('Layered visualization showing four layers of meaning — denotation, connotation, cultural context, and sound/rhythm — and which layers survive translation. Layers that are lost appear faded and cracked on the right side.');
}

function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;

  let topY = 60;
  let layerH = 70;
  let gap = 8;

  for (let i = 3; i >= 0; i--) {
    let yPos = topY + (3 - i) * (layerH + gap);
    if (mouseY >= yPos && mouseY <= yPos + layerH) {
      if (selectedLayer === i) {
        selectedLayer = -1;
        explanationText = "Click a layer to see what survives translation.";
      } else {
        selectedLayer = i;
        let data = words[selectedWord][layerKeys[i]];
        let status = data.survives ? "SURVIVES" : "LOST";
        explanationText = layerNames[i] + " [" + status + "]\n\n" +
          "Original: " + data.text + "\n\n" +
          "In translation: " + data.translation;
      }
      return;
    }
  }

  // Clicked outside layers
  selectedLayer = -1;
  explanationText = "Click a layer to see what survives translation.";
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  let parent = document.querySelector('main');
  if (parent) {
    canvasWidth = min(400, parent.offsetWidth - 20);
  }
}
