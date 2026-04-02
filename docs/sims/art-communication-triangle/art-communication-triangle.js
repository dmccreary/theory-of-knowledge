// Art Communication Triangle MicroSim
// CANVAS_HEIGHT: 465
// Triangle diagram showing Artist-Artwork-Audience meaning-making relationships
// with three theory modes: Intentionalism, Formalism, Reception Theory.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 45;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Controls
let theorySelect;
let caseSelect;

// Triangle vertices (computed in setup)
let vArtist, vArtwork, vAudience;
let vertexRadius = 38;

// Hover state
let hoveredVertex = null; // 'artist', 'artwork', 'audience', or null

// Theory descriptions
let theories = {
  'Intentionalism': 'Meaning flows from the artist\'s intent through the artwork to the audience. The creator\'s purpose is the key to interpretation.',
  'Formalism': 'Meaning resides in the artwork itself — its form, structure, and material properties. Artist intent and audience response are secondary.',
  'Reception Theory': 'Meaning is created by the audience during the act of reception. Each viewer constructs their own interpretation of the work.'
};

// Case study data: each case has info for artist, artwork, audience
let caseStudies = {
  "Duchamp's Fountain": {
    artist: 'Marcel Duchamp challenged art conventions by submitting a mass-produced urinal as sculpture (1917).',
    artwork: 'A porcelain urinal signed "R. Mutt" — a readymade object reframed as art by institutional context.',
    audience: 'Audiences remain divided: some see genius provocation, others see a cynical joke. Context shapes reception.'
  },
  "Banksy's Shredded Painting": {
    artist: 'Banksy embedded a shredder in the frame to destroy the work at auction, critiquing art commodification.',
    artwork: 'Girl with Balloon, partially shredded mid-auction — the destruction itself became a new artwork.',
    audience: 'The auction audience gasped, then applauded. The shredded piece sold for more than the original — irony or validation?'
  },
  "Shakespeare's Hamlet": {
    artist: 'Shakespeare drew on revenge tragedy conventions and political anxieties of Elizabethan England.',
    artwork: 'A five-act tragedy exploring doubt, action, and mortality through dense poetic language and dramatic structure.',
    audience: 'Each era reinterprets Hamlet: Romantic hero, Freudian case study, postcolonial subject. The text supports all readings.'
  }
};

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  // Compute triangle vertices centered in draw area
  let cx = canvasWidth / 2;
  let triTop = 65;
  let triBottom = 270;
  let triHalfWidth = 130;

  vArtist = { x: cx - triHalfWidth, y: triBottom, label: 'Artist', sub: 'Intent', col: 'coral' };
  vArtwork = { x: cx, y: triTop, label: 'Artwork', sub: 'Form', col: 'gold' };
  vAudience = { x: cx + triHalfWidth, y: triBottom, label: 'Audience', sub: 'Reception', col: 'teal' };

  // Controls row
  let yCtrl = drawHeight + 8;

  theorySelect = createSelect();
  theorySelect.parent(document.querySelector('main'));
  theorySelect.option('Intentionalism');
  theorySelect.option('Formalism');
  theorySelect.option('Reception Theory');
  theorySelect.position(10, yCtrl);
  theorySelect.style('font-size', '13px');

  caseSelect = createSelect();
  caseSelect.parent(document.querySelector('main'));
  caseSelect.option("Duchamp's Fountain");
  caseSelect.option("Banksy's Shredded Painting");
  caseSelect.option("Shakespeare's Hamlet");
  caseSelect.position(canvasWidth / 2 + 5, yCtrl);
  caseSelect.style('font-size', '13px');

  describe('Triangle diagram showing Artist, Artwork, and Audience vertices with animated arrows illustrating three art interpretation theories.');
}

function draw() {
  // Drawing area
  background('aliceblue');
  stroke('silver');
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // Control area
  noStroke();
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Control labels
  fill(60);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text('Theory:', 10, drawHeight + 28);
  text('Case Study:', canvasWidth / 2 + 5, drawHeight + 28);

  // Detect hover
  hoveredVertex = null;
  if (dist(mouseX, mouseY, vArtist.x, vArtist.y) < vertexRadius) hoveredVertex = 'artist';
  else if (dist(mouseX, mouseY, vArtwork.x, vArtwork.y) < vertexRadius) hoveredVertex = 'artwork';
  else if (dist(mouseX, mouseY, vAudience.x, vAudience.y) < vertexRadius) hoveredVertex = 'audience';

  // Draw triangle edges (light)
  stroke(200);
  strokeWeight(2);
  line(vArtist.x, vArtist.y, vArtwork.x, vArtwork.y);
  line(vArtwork.x, vArtwork.y, vAudience.x, vAudience.y);
  line(vAudience.x, vAudience.y, vArtist.x, vArtist.y);

  // Draw animated arrows based on theory
  let theory = theorySelect.value();
  drawTheoryArrows(theory);

  // Draw vertices
  drawVertex(vArtist, hoveredVertex === 'artist');
  drawVertex(vArtwork, hoveredVertex === 'artwork');
  drawVertex(vAudience, hoveredVertex === 'audience');

  // Title
  noStroke();
  fill(40);
  textSize(15);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('Art Communication Triangle', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // Theory description in center of triangle
  let cx = (vArtist.x + vArtwork.x + vAudience.x) / 3;
  let cy = (vArtist.y + vArtwork.y + vAudience.y) / 3;
  noStroke();
  fill(60);
  textSize(11);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  let desc = theories[theory];
  text(desc, cx - 80, cy - 25, 160, 60);
  textStyle(NORMAL);

  // Tooltip on hover
  if (hoveredVertex) {
    drawTooltip();
  }

  // Theory label below triangle
  noStroke();
  fill(80);
  textSize(13);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(theory, canvasWidth / 2, 295);
  textStyle(NORMAL);
}

function drawVertex(v, hovered) {
  let r = hovered ? vertexRadius + 5 : vertexRadius;

  // Shadow
  noStroke();
  fill(0, 0, 0, 30);
  ellipse(v.x + 2, v.y + 2, r * 2, r * 2);

  // Circle
  stroke(60);
  strokeWeight(2);
  fill(v.col);
  ellipse(v.x, v.y, r * 2, r * 2);

  // Label
  noStroke();
  fill(40);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text(v.label, v.x, v.y - 7);
  textStyle(NORMAL);
  textSize(10);
  fill(70);
  text(v.sub, v.x, v.y + 9);
}

function drawTheoryArrows(theory) {
  let t = (frameCount % 120) / 120; // 0 to 1 animation cycle

  if (theory === 'Intentionalism') {
    // Artist -> Artwork -> Audience
    drawAnimatedArrow(vArtist, vArtwork, t, 'coral');
    drawAnimatedArrow(vArtwork, vAudience, t, 'gold');
  } else if (theory === 'Formalism') {
    // Arrows cycle around Artwork: Artist->Artwork, Audience->Artwork
    drawAnimatedArrow(vArtist, vArtwork, t, 'coral');
    drawAnimatedArrow(vAudience, vArtwork, t, 'teal');
    // Pulsing glow on Artwork
    noStroke();
    let pulse = sin(frameCount * 0.08) * 30 + 30;
    fill(255, 215, 0, pulse);
    ellipse(vArtwork.x, vArtwork.y, vertexRadius * 2.8, vertexRadius * 2.8);
  } else if (theory === 'Reception Theory') {
    // Audience -> Artwork
    drawAnimatedArrow(vAudience, vArtwork, t, 'teal');
    // Audience radiating interpretation lines
    let pulse = sin(frameCount * 0.08) * 30 + 30;
    noStroke();
    fill(0, 128, 128, pulse);
    ellipse(vAudience.x, vAudience.y, vertexRadius * 2.8, vertexRadius * 2.8);
  }
}

function drawAnimatedArrow(from, to, t, col) {
  // Offset start/end to edge of vertex circles
  let angle = atan2(to.y - from.y, to.x - from.x);
  let sx = from.x + cos(angle) * vertexRadius;
  let sy = from.y + sin(angle) * vertexRadius;
  let ex = to.x - cos(angle) * vertexRadius;
  let ey = to.y - sin(angle) * vertexRadius;

  // Draw arrow line
  stroke(col);
  strokeWeight(3);
  line(sx, sy, ex, ey);

  // Arrowhead at end
  let aSize = 10;
  let ax = ex - cos(angle) * aSize;
  let ay = ey - sin(angle) * aSize;
  let perpX = cos(angle + HALF_PI) * aSize * 0.5;
  let perpY = sin(angle + HALF_PI) * aSize * 0.5;
  noStroke();
  fill(col);
  triangle(ex, ey, ax + perpX, ay + perpY, ax - perpX, ay - perpY);

  // Animated dot traveling along the arrow
  let dx = sx + (ex - sx) * t;
  let dy = sy + (ey - sy) * t;
  noStroke();
  fill('white');
  ellipse(dx, dy, 10, 10);
  fill(col);
  ellipse(dx, dy, 7, 7);

  // Second dot offset by half cycle
  let t2 = (t + 0.5) % 1;
  let dx2 = sx + (ex - sx) * t2;
  let dy2 = sy + (ey - sy) * t2;
  noStroke();
  fill('white');
  ellipse(dx2, dy2, 10, 10);
  fill(col);
  ellipse(dx2, dy2, 7, 7);
}

function drawTooltip() {
  let caseName = caseSelect.value();
  let caseData = caseStudies[caseName];
  let tipText = '';
  let tipColor = 'gray';

  if (hoveredVertex === 'artist') {
    tipText = caseData.artist;
    tipColor = 'coral';
  } else if (hoveredVertex === 'artwork') {
    tipText = caseData.artwork;
    tipColor = 'gold';
  } else if (hoveredVertex === 'audience') {
    tipText = caseData.audience;
    tipColor = 'teal';
  }

  // Tooltip box
  let tw = canvasWidth - 40;
  let th = 65;
  let tx = 20;
  let ty = 320;

  // Background
  noStroke();
  fill(255, 250, 240, 240);
  rect(tx, ty, tw, th, 8);

  // Left color bar
  fill(tipColor);
  noStroke();
  rect(tx, ty, 5, th, 8, 0, 0, 8);

  // Case study title
  fill(80);
  textSize(10);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text(caseName + ' — ' + hoveredVertex.charAt(0).toUpperCase() + hoveredVertex.slice(1), tx + 12, ty + 5);
  textStyle(NORMAL);

  // Tip text
  fill(60);
  textSize(10);
  textAlign(LEFT, TOP);
  text(tipText, tx + 12, ty + 20, tw - 20, th - 25);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);

  // Recompute triangle vertices
  let cx = canvasWidth / 2;
  let triTop = 65;
  let triBottom = 270;
  let triHalfWidth = min(130, (canvasWidth - 80) / 2);

  vArtist.x = cx - triHalfWidth;
  vArtist.y = triBottom;
  vArtwork.x = cx;
  vArtwork.y = triTop;
  vAudience.x = cx + triHalfWidth;
  vAudience.y = triBottom;
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    containerWidth = mainEl.getBoundingClientRect().width;
  } else {
    containerWidth = windowWidth;
  }
  canvasWidth = min(containerWidth, 450);
}
