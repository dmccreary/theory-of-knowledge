// Algorithm Filter Knowledge - Flow Diagram
// CANVAS_HEIGHT: 480

// Global variables
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = 480;
let margin = 25;
let defaultTextSize = 16;

// Controls
let randomizeBtn;
let strictnessSlider;
let relevanceCb, popularityCb, personalizationCb, monetizationCb;

// Data
let dots = [];
let filterNames = ['Relevance', 'Popularity', 'Personalization', 'Monetization'];
let filterColors = ['dodgerblue', 'orange', 'mediumseagreen', 'crimson'];
let dotColors = ['red', 'blue', 'green', 'orange', 'purple', 'teal',
                 'magenta', 'gold', 'coral', 'deepskyblue', 'salmon',
                 'mediumseagreen', 'slateblue', 'tomato', 'darkcyan'];

// Cached results
let stageCounts = [];
let survivingDots = [];

function setup() {
    updateCanvasSize();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    generateDots();

    // Row 1: Randomize button + Strictness slider
    randomizeBtn = createButton('Randomize');
    randomizeBtn.parent(document.querySelector('main'));
    randomizeBtn.mousePressed(generateDots);

    strictnessSlider = createSlider(10, 90, 50, 1);
    strictnessSlider.parent(document.querySelector('main'));
    strictnessSlider.style('width', '120px');
    strictnessSlider.input(recalculate);

    // Row 2: 4 checkboxes
    relevanceCb = createCheckbox('Relevance', true);
    relevanceCb.parent(document.querySelector('main'));
    relevanceCb.changed(recalculate);

    popularityCb = createCheckbox('Popularity', true);
    popularityCb.parent(document.querySelector('main'));
    popularityCb.changed(recalculate);

    personalizationCb = createCheckbox('Personalization', true);
    personalizationCb.parent(document.querySelector('main'));
    personalizationCb.changed(recalculate);

    monetizationCb = createCheckbox('Monetization', true);
    monetizationCb.parent(document.querySelector('main'));
    monetizationCb.changed(recalculate);

    recalculate();
    noLoop();

    describe('Flow diagram showing how algorithmic filters progressively reduce information from a large pool to a small set.');
}

function generateDots() {
    dots = [];
    let numDots = 100;
    for (let i = 0; i < numDots; i++) {
        dots.push({
            col: random(dotColors),
            filterScore: random(1)
        });
    }
    recalculate();
    redraw();
}

function recalculate() {
    let strictness = strictnessSlider ? strictnessSlider.value() / 100 : 0.5;
    let checkboxes = [relevanceCb, popularityCb, personalizationCb, monetizationCb];

    stageCounts = [dots.length];
    let remaining = dots.slice();

    for (let i = 0; i < 4; i++) {
        if (checkboxes[i] && checkboxes[i].checked()) {
            // Each filter removes a fraction based on strictness
            // Different filters have slightly different removal rates
            let baseRate = [0.35, 0.30, 0.40, 0.25][i];
            let removalRate = baseRate * strictness;
            let keepCount = Math.max(1, Math.round(remaining.length * (1 - removalRate)));
            remaining = remaining.slice(0, keepCount);
        }
        stageCounts.push(remaining.length);
    }

    survivingDots = remaining;
    redraw();
}

function draw() {
    updateCanvasSize();

    // Draw area background
    fill('aliceblue');
    stroke('silver');
    strokeWeight(1);
    rect(0, 0, canvasWidth, drawHeight);

    // Control area background
    fill('white');
    stroke('silver');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(24);
    text('Algorithm Filter', canvasWidth / 2, 8);
    text('Knowledge', canvasWidth / 2, 34);

    let topY = 68;
    let bottomY = drawHeight - 15;
    let usableHeight = bottomY - topY;

    // Layout: left pool | filters | right pool
    let leftPoolX = margin;
    let leftPoolW = 70;
    let rightPoolX = canvasWidth - margin - 70;
    let rightPoolW = 70;
    let filterZoneLeft = leftPoolX + leftPoolW + 10;
    let filterZoneRight = rightPoolX - 10;
    let filterZoneW = filterZoneRight - filterZoneLeft;

    // Draw left pool label
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(11);
    text('All Available', leftPoolX + leftPoolW / 2, topY);
    text('Information', leftPoolX + leftPoolW / 2, topY + 13);

    // Draw left pool dots
    let poolTop = topY + 30;
    let poolBottom = bottomY - 20;
    let poolH = poolBottom - poolTop;
    let cols = 7;
    let dotSize = 7;
    let spacingX = leftPoolW / (cols + 1);
    let rows = Math.ceil(dots.length / cols);
    let spacingY = Math.min(poolH / (rows + 1), 12);

    for (let i = 0; i < dots.length; i++) {
        let col = i % cols;
        let row = Math.floor(i / cols);
        let dx = leftPoolX + spacingX * (col + 1);
        let dy = poolTop + spacingY * (row + 0.5);
        if (dy < poolBottom) {
            noStroke();
            fill(dots[i].col);
            ellipse(dx, dy, dotSize, dotSize);
        }
    }

    // Draw count below left pool
    noStroke();
    fill('black');
    textSize(13);
    textAlign(CENTER, TOP);
    text(dots.length, leftPoolX + leftPoolW / 2, poolBottom + 2);

    // Draw filter bars
    let checkboxes = [relevanceCb, popularityCb, personalizationCb, monetizationCb];
    let numFilters = 4;
    let filterSpacing = filterZoneW / (numFilters + 1);
    let barWidth = 14;
    let barTop = poolTop;
    let barBottom = poolBottom;

    for (let i = 0; i < numFilters; i++) {
        let fx = filterZoneLeft + filterSpacing * (i + 1);
        let isEnabled = checkboxes[i] && checkboxes[i].checked();

        // Draw filter bar
        if (isEnabled) {
            fill(filterColors[i]);
        } else {
            fill('lightgray');
        }
        stroke('gray');
        strokeWeight(1);
        rect(fx - barWidth / 2, barTop, barWidth, barBottom - barTop, 4);

        // Draw filter name vertically
        noStroke();
        fill('black');
        textSize(9);
        textAlign(CENTER, BOTTOM);
        push();
        translate(fx, barTop - 3);
        rotate(-HALF_PI);
        textAlign(LEFT, CENTER);
        text(filterNames[i], 0, 0);
        pop();

        // Draw count below bar
        noStroke();
        fill('black');
        textSize(11);
        textAlign(CENTER, TOP);
        let countAfter = stageCounts[i + 1];
        text(countAfter, fx, barBottom + 2);

        // Draw filtered-out count in red above the count
        if (isEnabled && i + 1 < stageCounts.length) {
            let filtered = stageCounts[i] - stageCounts[i + 1];
            if (filtered > 0) {
                fill('crimson');
                textSize(9);
                text('-' + filtered, fx, barBottom + 16);
            }
        }

        // Draw flow lines between stages
        stroke('silver');
        strokeWeight(1);
        let midY = (barTop + barBottom) / 2;
        if (i === 0) {
            // From left pool to first filter
            line(leftPoolX + leftPoolW + 2, midY, fx - barWidth / 2 - 2, midY);
        }
        if (i > 0) {
            let prevFx = filterZoneLeft + filterSpacing * i;
            line(prevFx + barWidth / 2 + 2, midY, fx - barWidth / 2 - 2, midY);
        }
        if (i === numFilters - 1) {
            // From last filter to right pool
            line(fx + barWidth / 2 + 2, midY, rightPoolX - 2, midY);
        }

        // Draw small arrows on flow lines
        noStroke();
        fill('silver');
        let arrowX;
        if (i === 0) {
            arrowX = fx - barWidth / 2 - 6;
        } else {
            let prevFx = filterZoneLeft + filterSpacing * i;
            arrowX = fx - barWidth / 2 - 6;
        }
        triangle(arrowX, midY - 3, arrowX, midY + 3, arrowX + 5, midY);

        if (i === numFilters - 1) {
            let arrowEndX = rightPoolX - 6;
            triangle(arrowEndX, midY - 3, arrowEndX, midY + 3, arrowEndX + 5, midY);
        }
    }

    // Draw right pool label
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(11);
    text('What You', rightPoolX + rightPoolW / 2, topY);
    text('See', rightPoolX + rightPoolW / 2, topY + 13);

    // Draw right pool dots
    let rCols = 5;
    let rSpacingX = rightPoolW / (rCols + 1);
    let rRows = Math.ceil(survivingDots.length / rCols);
    let rSpacingY = Math.min(poolH / (rRows + 1), 14);

    for (let i = 0; i < survivingDots.length; i++) {
        let col = i % rCols;
        let row = Math.floor(i / rCols);
        let dx = rightPoolX + rSpacingX * (col + 1);
        let dy = poolTop + rSpacingY * (row + 0.5);
        if (dy < poolBottom) {
            noStroke();
            fill(survivingDots[i].col);
            ellipse(dx, dy, dotSize, dotSize);
        }
    }

    // Draw count below right pool
    noStroke();
    fill('black');
    textSize(13);
    textAlign(CENTER, TOP);
    text(survivingDots.length, rightPoolX + rightPoolW / 2, poolBottom + 2);

    // Draw strictness label in control area
    noStroke();
    fill('black');
    textSize(12);
    textAlign(LEFT, CENTER);
    text('Strictness: ' + (strictnessSlider ? strictnessSlider.value() : 50) + '%',
         margin + 90, drawHeight + 18);

    // Position controls
    if (randomizeBtn) {
        randomizeBtn.position(canvasOffsetX() + margin, canvasOffsetY() + drawHeight + 6);
    }
    if (strictnessSlider) {
        strictnessSlider.position(canvasOffsetX() + margin + 170, canvasOffsetY() + drawHeight + 10);
    }

    // Position checkboxes in row 2
    let cbY = canvasOffsetY() + drawHeight + 38;
    let cbSpacing = (canvasWidth - 2 * margin) / 4;
    if (relevanceCb) relevanceCb.position(canvasOffsetX() + margin, cbY);
    if (popularityCb) popularityCb.position(canvasOffsetX() + margin + cbSpacing, cbY);
    if (personalizationCb) personalizationCb.position(canvasOffsetX() + margin + cbSpacing * 2, cbY);
    if (monetizationCb) monetizationCb.position(canvasOffsetX() + margin + cbSpacing * 3, cbY);
}

function canvasOffsetX() {
    let canvas = document.querySelector('main canvas');
    return canvas ? canvas.offsetLeft : 0;
}

function canvasOffsetY() {
    let canvas = document.querySelector('main canvas');
    return canvas ? canvas.offsetTop : 0;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    redraw();
}

function updateCanvasSize() {
    let container = document.querySelector('main');
    if (container) {
        canvasWidth = Math.max(300, container.offsetWidth);
    }
    canvasHeight = drawHeight + controlHeight;
}
