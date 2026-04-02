// Echo Chambers vs Filter Bubbles Split-Screen MicroSim
// CANVAS_HEIGHT: 560
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 100;
let canvasHeight = 560;

// Controls
let stepButton, resetButton;
let algorithmSlider;

// State
let stepCount = 0;
let nodes = [];
let edges = [];
let feedCards = [];
let preferenceScore = 0.5; // 0=all coral, 1=all teal
let echoDiversity = 1.0;
let bubbleDiversity = 1.0;

// Colors
let tealColor, coralColor;

function setup() {
    updateCanvasSize();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    tealColor = color(0, 150, 136);
    coralColor = color(255, 111, 97);

    // Row 1: Buttons
    stepButton = createButton('Step Forward');
    stepButton.parent(document.querySelector('main'));
    stepButton.mousePressed(doStep);

    resetButton = createButton('Reset');
    resetButton.parent(document.querySelector('main'));
    resetButton.mousePressed(doReset);

    // Row 2: Slider
    algorithmSlider = createSlider(1, 10, 5, 1);
    algorithmSlider.parent(document.querySelector('main'));
    algorithmSlider.style('width', '180px');

    initSimulation();
}

function initSimulation() {
    stepCount = 0;
    preferenceScore = 0.5;
    echoDiversity = 1.0;
    bubbleDiversity = 1.0;
    initNetwork();
    initFeed();
}

function doReset() {
    initSimulation();
}

function doStep() {
    stepCount++;
    updateEchoChamber();
    updateFilterBubble();
}

// ---- ECHO CHAMBER (LEFT) ----

function initNetwork() {
    nodes = [];
    edges = [];
    let halfW = canvasWidth / 2;
    let cx = halfW / 2;
    let cy = drawHeight / 2 + 10;
    let radius = min(halfW, drawHeight) * 0.32;

    for (let i = 0; i < 20; i++) {
        let angle = (TWO_PI / 20) * i + random(-0.15, 0.15);
        let r = radius * random(0.5, 1.0);
        let viewpoint = random() < 0.5 ? 'teal' : 'coral';
        nodes.push({
            x: cx + cos(angle) * r,
            y: cy + sin(angle) * r,
            viewpoint: viewpoint
        });
    }

    // Create initial edges: mix of same and cross-viewpoint
    for (let i = 0; i < 20; i++) {
        for (let j = i + 1; j < 20; j++) {
            let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            if (d < radius * 0.7 && random() < 0.35) {
                edges.push({ a: i, b: j });
            }
        }
    }
    // Ensure minimum edges
    if (edges.length < 15) {
        for (let i = 0; i < 20 && edges.length < 20; i++) {
            let j = (i + 3) % 20;
            let exists = edges.some(e => (e.a === i && e.b === j) || (e.a === j && e.b === i));
            if (!exists) edges.push({ a: min(i, j), b: max(i, j) });
        }
    }
    calcEchoDiversity();
}

function updateEchoChamber() {
    let strength = algorithmSlider.value();

    // Try to remove a cross-viewpoint edge
    for (let attempt = 0; attempt < strength; attempt++) {
        let crossEdges = edges.filter(e => nodes[e.a].viewpoint !== nodes[e.b].viewpoint);
        if (crossEdges.length > 0) {
            let idx = floor(random(crossEdges.length));
            let removeEdge = crossEdges[idx];
            edges = edges.filter(e => e !== removeEdge);
            break;
        }
    }

    // Try to add a same-viewpoint edge
    for (let attempt = 0; attempt < 20; attempt++) {
        let i = floor(random(20));
        let j = floor(random(20));
        if (i === j) continue;
        if (i > j) { let t = i; i = j; j = t; }
        if (nodes[i].viewpoint !== nodes[j].viewpoint) continue;
        let exists = edges.some(e => e.a === i && e.b === j);
        if (!exists) {
            edges.push({ a: i, b: j });
            break;
        }
    }

    calcEchoDiversity();
}

function calcEchoDiversity() {
    if (edges.length === 0) { echoDiversity = 0; return; }
    let cross = edges.filter(e => nodes[e.a].viewpoint !== nodes[e.b].viewpoint).length;
    echoDiversity = cross / edges.length;
}

function drawEchoChamber() {
    let halfW = canvasWidth / 2;

    // Title
    noStroke();
    fill(50);
    textAlign(CENTER, TOP);
    textSize(14);
    text('Echo Chamber', halfW / 2, 30);
    textSize(11);
    fill(100);
    text('(self-selected)', halfW / 2, 47);

    // Draw edges
    for (let e of edges) {
        let a = nodes[e.a];
        let b = nodes[e.b];
        let cross = a.viewpoint !== b.viewpoint;
        stroke(cross ? color(180) : (a.viewpoint === 'teal' ? color(0, 150, 136, 100) : color(255, 111, 97, 100)));
        strokeWeight(cross ? 1 : 1.5);
        line(a.x, a.y, b.x, b.y);
    }

    // Draw nodes
    noStroke();
    for (let n of nodes) {
        fill(n.viewpoint === 'teal' ? tealColor : coralColor);
        ellipse(n.x, n.y, 14, 14);
    }

    // Diversity meter
    drawDiversityMeter(halfW / 2, drawHeight - 50, echoDiversity, 'Diversity');
}

// ---- FILTER BUBBLE (RIGHT) ----

function initFeed() {
    feedCards = [];
    for (let i = 0; i < 8; i++) {
        feedCards.push({
            viewpoint: random() < 0.5 ? 'teal' : 'coral',
            liked: false,
            visible: true
        });
    }
    preferenceScore = 0.5;
    calcBubbleDiversity();
}

function updateFilterBubble() {
    let strength = algorithmSlider.value() / 10;

    // Count likes to shift preference
    let tealLikes = feedCards.filter(c => c.liked && c.viewpoint === 'teal').length;
    let coralLikes = feedCards.filter(c => c.liked && c.viewpoint === 'coral').length;
    let totalLikes = tealLikes + coralLikes;

    if (totalLikes > 0) {
        let likeRatio = tealLikes / totalLikes;
        preferenceScore = lerp(preferenceScore, likeRatio, strength * 0.3);
    }

    // Regenerate feed based on preference + algorithm strength
    feedCards = [];
    for (let i = 0; i < 8; i++) {
        let biasedProb = lerp(0.5, preferenceScore, strength);
        feedCards.push({
            viewpoint: random() < biasedProb ? 'teal' : 'coral',
            liked: false,
            visible: true
        });
    }
    calcBubbleDiversity();
}

function calcBubbleDiversity() {
    let tealCount = feedCards.filter(c => c.viewpoint === 'teal').length;
    let ratio = tealCount / feedCards.length;
    bubbleDiversity = 1 - abs(ratio - 0.5) * 2;
}

function drawFilterBubble() {
    let halfW = canvasWidth / 2;
    let rightX = halfW;

    // Title
    noStroke();
    fill(50);
    textAlign(CENTER, TOP);
    textSize(14);
    text('Filter Bubble', rightX + halfW / 2, 30);
    textSize(11);
    fill(100);
    text('(algorithm-driven)', rightX + halfW / 2, 47);

    // Draw feed cards
    let cardW = min(halfW - 40, 160);
    let cardH = 36;
    let startX = rightX + (halfW - cardW) / 2;
    let startY = 68;
    let gap = 6;

    for (let i = 0; i < feedCards.length; i++) {
        let c = feedCards[i];
        let cy = startY + i * (cardH + gap);
        let baseColor = c.viewpoint === 'teal' ? tealColor : coralColor;

        // Card background
        fill(red(baseColor), green(baseColor), blue(baseColor), 50);
        stroke(baseColor);
        strokeWeight(1.5);
        rect(startX, cy, cardW, cardH, 6);

        // Content label
        noStroke();
        fill(c.viewpoint === 'teal' ? color(0, 120, 110) : color(200, 80, 60));
        textAlign(LEFT, CENTER);
        textSize(11);
        let label = c.viewpoint === 'teal' ? 'Viewpoint A' : 'Viewpoint B';
        text(label, startX + 10, cy + cardH / 2);

        // Like button area
        let btnX = startX + cardW - 40;
        let btnY = cy + 6;
        let btnW = 32;
        let btnH = cardH - 12;

        if (c.liked) {
            fill(baseColor);
        } else {
            fill(255);
            stroke(baseColor);
            strokeWeight(1);
        }
        rect(btnX, btnY, btnW, btnH, 4);

        noStroke();
        fill(c.liked ? color(255) : baseColor);
        textAlign(CENTER, CENTER);
        textSize(12);
        text('♥', btnX + btnW / 2, btnY + btnH / 2);
    }

    // Preference meter
    let meterY = drawHeight - 75;
    let meterW = cardW;
    let meterH = 12;
    noStroke();
    fill(120);
    textAlign(CENTER, TOP);
    textSize(11);
    text('Algorithm Preference', rightX + halfW / 2, meterY - 16);

    // Background
    fill(220);
    rect(startX, meterY, meterW, meterH, 6);
    // Teal portion
    let tealW = meterW * preferenceScore;
    fill(tealColor);
    rect(startX, meterY, tealW, meterH, tealW >= meterW - 1 ? 6 : 0);
    // Coral portion
    if (tealW < meterW) {
        fill(coralColor);
        let rx = startX + tealW;
        rect(rx, meterY, meterW - tealW, meterH, tealW <= 1 ? 6 : 0);
    }

    // Labels
    noStroke();
    fill(100);
    textSize(9);
    textAlign(LEFT, TOP);
    text('A', startX, meterY + meterH + 3);
    textAlign(RIGHT, TOP);
    text('B', startX + meterW, meterY + meterH + 3);

    // Diversity meter
    drawDiversityMeter(rightX + halfW / 2, drawHeight - 50, bubbleDiversity, 'Diversity');
}

// ---- SHARED ----

function drawDiversityMeter(cx, cy, value, label) {
    let barW = 100;
    let barH = 10;
    let x = cx - barW / 2;

    noStroke();
    fill(100);
    textAlign(CENTER, TOP);
    textSize(11);
    text(label + ': ' + nf(value * 100, 1, 0) + '%', cx, cy - 15);

    // Background bar
    fill(220);
    rect(x, cy, barW, barH, 5);

    // Fill bar
    let fillColor = lerpColor(color(255, 80, 60), color(0, 180, 140), value);
    fill(fillColor);
    rect(x, cy, barW * value, barH, 5);
}

function handleFeedClick(mx, my) {
    let halfW = canvasWidth / 2;
    let rightX = halfW;
    let cardW = min(halfW - 40, 160);
    let cardH = 36;
    let startX = rightX + (halfW - cardW) / 2;
    let startY = 68;
    let gap = 6;

    for (let i = 0; i < feedCards.length; i++) {
        let cy = startY + i * (cardH + gap);
        let btnX = startX + cardW - 40;
        let btnY = cy + 6;
        let btnW = 32;
        let btnH = cardH - 12;

        if (mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH) {
            feedCards[i].liked = !feedCards[i].liked;
            // Shift preference slightly on each like
            let shift = algorithmSlider.value() * 0.02;
            if (feedCards[i].liked) {
                if (feedCards[i].viewpoint === 'teal') {
                    preferenceScore = min(1, preferenceScore + shift);
                } else {
                    preferenceScore = max(0, preferenceScore - shift);
                }
            }
            calcBubbleDiversity();
            break;
        }
    }
}

function mousePressed() {
    handleFeedClick(mouseX, mouseY);
}

function draw() {
    // Draw area
    background('aliceblue');

    // Divider
    stroke(180);
    strokeWeight(1);
    let halfW = canvasWidth / 2;
    line(halfW, 20, halfW, drawHeight - 10);

    // Step counter
    noStroke();
    fill(60);
    textAlign(CENTER, TOP);
    textSize(13);
    text('Step: ' + stepCount, canvasWidth / 2, 8);

    drawEchoChamber();
    drawFilterBubble();

    // Control area background
    noStroke();
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Control labels
    fill(60);
    textAlign(LEFT, CENTER);
    textSize(12);
    text('Algorithm Strength: ' + algorithmSlider.value(), 10, drawHeight + 55);

    textAlign(RIGHT, CENTER);
    fill(100);
    textSize(11);
    text('Click ♥ on cards, then Step Forward', canvasWidth - 10, drawHeight + 85);

    describe('Split-screen simulation comparing echo chambers and filter bubbles. Left side shows a network where cross-viewpoint connections drop over time. Right side shows an algorithmic feed that narrows based on user likes.');
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    // Reposition network nodes for new width
    let halfW = canvasWidth / 2;
    let cx = halfW / 2;
    let cy = drawHeight / 2 + 10;
    let radius = min(halfW, drawHeight) * 0.32;
    for (let i = 0; i < nodes.length; i++) {
        let angle = (TWO_PI / 20) * i;
        let r = radius * random(0.5, 1.0);
        nodes[i].x = cx + cos(angle) * r;
        nodes[i].y = cy + sin(angle) * r;
    }
}

function updateCanvasSize() {
    let main = document.querySelector('main');
    canvasWidth = main ? main.offsetWidth : 400;
    canvasWidth = max(canvasWidth, 400);
}
