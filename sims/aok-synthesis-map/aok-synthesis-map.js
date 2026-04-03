// AOK Synthesis Map - vis-network MicroSim
// Compares how 6 Areas of Knowledge address 5 epistemological concepts
// CANVAS_HEIGHT: 685

let network = null;
let graphData = null;
let nodesDataSet = null;
let edgesDataSet = null;
let originalNodeColors = {};
let originalEdgeColors = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const mainEl = document.querySelector('main');
    mainEl.innerHTML = `
        <div id="network-container"></div>
        <div id="title-overlay">
            <h1>Cross-AOK Synthesis Map</h1>
            <div class="subtitle">How Areas of Knowledge address epistemological concepts</div>
        </div>
        <div id="legend-overlay"><h3>Legend</h3><div id="legend-items"></div></div>
        <div id="info-panel">
            <h2>AOK Synthesis</h2>
            <div class="compare-section">
                <label>Compare Two AOKs</label>
                <select id="aok-select-1"><option value="">— Select AOK 1 —</option></select>
                <select id="aok-select-2"><option value="">— Select AOK 2 —</option></select>
                <button id="compare-btn">Compare</button>
                <button id="reset-btn">Reset View</button>
            </div>
            <div id="detail-content">
                <p class="prompt-text">Click a <em>concept node</em> to see how each AOK handles it.<br><br>
                Click an <em>AOK node</em> to see how it addresses all 5 concepts.<br><br>
                Or use the dropdowns above to compare two AOKs side by side.</p>
            </div>
        </div>
    `;

    try {
        const resp = await fetch('data.json');
        graphData = await resp.json();
        buildNetwork();
        buildLegend();
        setupControls();
    } catch (err) {
        console.error('Failed to load data.json:', err);
        document.getElementById('detail-content').innerHTML =
            '<p style="color:#f88">Error loading data.json</p>';
    }
}

function buildNetwork() {
    const container = document.getElementById('network-container');
    const groups = graphData.groups;

    // Position concept nodes in a smaller inner ring, AOK nodes in an outer ring
    const conceptIds = graphData.nodes.filter(n => n.group === 'concept').map(n => n.id);
    const aokIds = graphData.nodes.filter(n => n.group !== 'concept').map(n => n.id);

    const cx = 350, cy = 340;
    const innerR = 120, outerR = 280;

    const positionedNodes = graphData.nodes.map(n => {
        const g = groups[n.group];
        let x, y;
        if (n.group === 'concept') {
            const idx = conceptIds.indexOf(n.id);
            const angle = (2 * Math.PI * idx / conceptIds.length) - Math.PI / 2;
            x = cx + innerR * Math.cos(angle);
            y = cy + innerR * Math.sin(angle);
        } else {
            const idx = aokIds.indexOf(n.id);
            const angle = (2 * Math.PI * idx / aokIds.length) - Math.PI / 2;
            x = cx + outerR * Math.cos(angle);
            // Slight y-offset to avoid perfectly horizontal edges
            y = cy + outerR * Math.sin(angle) + (Math.abs(Math.sin(angle)) < 0.1 ? 10 : 0);
        }

        const nodeObj = {
            id: n.id,
            label: n.label,
            x: x,
            y: y,
            fixed: true,
            shape: g.shape === 'box' ? 'box' : 'circle',
            size: g.size,
            color: {
                background: g.color,
                border: g.color,
                highlight: { background: g.color, border: '#ffffff' },
                hover: { background: g.color, border: '#ffffff' }
            },
            font: {
                size: g.font_size,
                color: '#ffffff',
                face: 'Arial',
                multi: 'md',
                bold: { color: '#ffffff' }
            },
            borderWidth: 2,
            borderWidthSelected: 3,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', size: 8 }
        };
        originalNodeColors[n.id] = { background: g.color, border: g.color };
        return nodeObj;
    });

    const positionedEdges = graphData.edges.map((e, i) => {
        const aokGroup = graphData.nodes.find(n => n.id === e.from).group;
        const aokColor = groups[aokGroup].color;
        const edgeObj = {
            id: i,
            from: e.from,
            to: e.to,
            label: e.label,
            width: e.width,
            color: { color: aokColor, opacity: 0.5, highlight: aokColor, hover: aokColor },
            font: { size: 9, color: '#cccccc', strokeWidth: 3, strokeColor: 'rgba(26,26,46,0.85)', multi: 'md', align: 'middle' },
            smooth: { type: 'curvedCW', roundness: 0.15 },
            hoverWidth: 1.5,
            selectionWidth: 2
        };
        originalEdgeColors[i] = { color: aokColor, opacity: 0.5 };
        return edgeObj;
    });

    nodesDataSet = new vis.DataSet(positionedNodes);
    edgesDataSet = new vis.DataSet(positionedEdges);

    const options = {
        interaction: {
            zoomView: false,
            dragView: false,
            dragNodes: false,
            hover: true,
            navigationButtons: true,
            tooltipDelay: 200
        },
        physics: { enabled: false },
        edges: {
            smooth: { type: 'curvedCW', roundness: 0.15 }
        }
    };

    network = new vis.Network(container, { nodes: nodesDataSet, edges: edgesDataSet }, options);

    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            handleNodeClick(params.nodes[0]);
        } else {
            resetHighlights();
            showPrompt();
        }
    });
}

function handleNodeClick(nodeId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (node.group === 'concept') {
        showConceptDetail(nodeId);
        highlightConceptConnections(nodeId);
    } else {
        showAokDetail(nodeId);
        highlightAokConnections(nodeId);
    }
}

function highlightConceptConnections(conceptId) {
    const connectedEdges = graphData.edges.filter(e => e.to === conceptId);
    const connectedAokIds = connectedEdges.map(e => e.from);
    const activeNodeIds = new Set([conceptId, ...connectedAokIds]);
    const activeEdgeIndices = new Set(connectedEdges.map((_, i) =>
        graphData.edges.findIndex(e => e.from === connectedEdges[_] ? connectedEdges[_].from : -1)
    ));

    // Dim all nodes
    nodesDataSet.forEach(n => {
        if (activeNodeIds.has(n.id)) {
            nodesDataSet.update({ id: n.id, opacity: 1.0,
                color: { ...n.color, background: originalNodeColors[n.id].background, border: originalNodeColors[n.id].border }
            });
        } else {
            nodesDataSet.update({ id: n.id, opacity: 0.15,
                color: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)',
                         highlight: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' },
                         hover: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' } }
            });
        }
    });

    // Dim/show edges
    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge && srcEdge.to === conceptId) {
            const aokGroup = graphData.nodes.find(n => n.id === srcEdge.from).group;
            const aokColor = graphData.groups[aokGroup].color;
            edgesDataSet.update({ id: e.id, color: { color: aokColor, opacity: 0.85, highlight: aokColor }, width: srcEdge.width + 1 });
        } else {
            edgesDataSet.update({ id: e.id, color: { color: 'rgba(80,80,80,0.1)', opacity: 0.08 }, width: 1 });
        }
    });
}

function highlightAokConnections(aokId) {
    const connectedEdges = graphData.edges.filter(e => e.from === aokId);
    const connectedConceptIds = connectedEdges.map(e => e.to);
    const activeNodeIds = new Set([aokId, ...connectedConceptIds]);

    nodesDataSet.forEach(n => {
        if (activeNodeIds.has(n.id)) {
            nodesDataSet.update({ id: n.id, opacity: 1.0,
                color: { ...n.color, background: originalNodeColors[n.id].background, border: originalNodeColors[n.id].border,
                         highlight: { background: originalNodeColors[n.id].background, border: '#ffffff' },
                         hover: { background: originalNodeColors[n.id].background, border: '#ffffff' } }
            });
        } else {
            nodesDataSet.update({ id: n.id, opacity: 0.15,
                color: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)',
                         highlight: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' },
                         hover: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' } }
            });
        }
    });

    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge && srcEdge.from === aokId) {
            const aokGroup = graphData.nodes.find(n => n.id === aokId).group;
            const aokColor = graphData.groups[aokGroup].color;
            edgesDataSet.update({ id: e.id, color: { color: aokColor, opacity: 0.85, highlight: aokColor }, width: srcEdge.width + 1 });
        } else {
            edgesDataSet.update({ id: e.id, color: { color: 'rgba(80,80,80,0.1)', opacity: 0.08 }, width: 1 });
        }
    });
}

function resetHighlights() {
    nodesDataSet.forEach(n => {
        const oc = originalNodeColors[n.id];
        nodesDataSet.update({ id: n.id, opacity: 1.0,
            color: { background: oc.background, border: oc.border,
                     highlight: { background: oc.background, border: '#ffffff' },
                     hover: { background: oc.background, border: '#ffffff' } }
        });
    });
    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge) {
            const oc = originalEdgeColors[e.id];
            edgesDataSet.update({ id: e.id, color: { color: oc.color, opacity: oc.opacity, highlight: oc.color }, width: srcEdge.width });
        }
    });
}

function showConceptDetail(conceptId) {
    const concept = graphData.nodes.find(n => n.id === conceptId);
    const connectedEdges = graphData.edges.filter(e => e.to === conceptId);

    let html = `<h3>${concept.label.replace(/\n/g, ' ')}</h3>`;
    html += `<p style="color:#aaa; font-size:11px; margin-bottom:10px;">How each AOK addresses <strong>${concept.label.replace(/\n/g, ' ')}</strong>:</p>`;

    connectedEdges.forEach(e => {
        const aokNode = graphData.nodes.find(n => n.id === e.from);
        const aokColor = graphData.groups[aokNode.group].color;
        html += `<div class="connection-item" style="border-left-color:${aokColor}">
            <div class="concept-name" style="color:${aokColor}">${aokNode.label.replace(/\n/g, ' ')}</div>
            <div class="edge-label">${e.label.replace(/\n/g, ' ')}</div>
            <div class="description">${e.description}</div>
        </div>`;
    });

    document.getElementById('detail-content').innerHTML = html;
}

function showAokDetail(aokId) {
    const aok = graphData.nodes.find(n => n.id === aokId);
    const aokColor = graphData.groups[aok.group].color;
    const connectedEdges = graphData.edges.filter(e => e.from === aokId);

    let html = `<h3 style="color:${aokColor}">${aok.label.replace(/\n/g, ' ')}</h3>`;
    html += `<p style="color:#aaa; font-size:11px; margin-bottom:10px;">How <strong>${aok.label.replace(/\n/g, ' ')}</strong> addresses each concept:</p>`;

    connectedEdges.forEach(e => {
        const conceptNode = graphData.nodes.find(n => n.id === e.to);
        html += `<div class="connection-item" style="border-left-color:${aokColor}">
            <div class="concept-name">${conceptNode.label.replace(/\n/g, ' ')}</div>
            <div class="edge-label">${e.label.replace(/\n/g, ' ')}</div>
            <div class="description">${e.description}</div>
        </div>`;
    });

    document.getElementById('detail-content').innerHTML = html;
}

function showCompareView(aokId1, aokId2) {
    const aok1 = graphData.nodes.find(n => n.id === aokId1);
    const aok2 = graphData.nodes.find(n => n.id === aokId2);
    const color1 = graphData.groups[aok1.group].color;
    const color2 = graphData.groups[aok2.group].color;
    const edges1 = graphData.edges.filter(e => e.from === aokId1);
    const edges2 = graphData.edges.filter(e => e.from === aokId2);

    // Highlight both AOKs and all concepts
    const conceptIds = graphData.nodes.filter(n => n.group === 'concept').map(n => n.id);
    const activeNodeIds = new Set([aokId1, aokId2, ...conceptIds]);

    nodesDataSet.forEach(n => {
        if (activeNodeIds.has(n.id)) {
            nodesDataSet.update({ id: n.id, opacity: 1.0,
                color: { background: originalNodeColors[n.id].background, border: originalNodeColors[n.id].border,
                         highlight: { background: originalNodeColors[n.id].background, border: '#ffffff' },
                         hover: { background: originalNodeColors[n.id].background, border: '#ffffff' } }
            });
        } else {
            nodesDataSet.update({ id: n.id, opacity: 0.1,
                color: { background: 'rgba(80,80,80,0.2)', border: 'rgba(80,80,80,0.2)',
                         highlight: { background: 'rgba(80,80,80,0.2)', border: 'rgba(80,80,80,0.2)' },
                         hover: { background: 'rgba(80,80,80,0.2)', border: 'rgba(80,80,80,0.2)' } }
            });
        }
    });

    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge && (srcEdge.from === aokId1 || srcEdge.from === aokId2)) {
            const c = srcEdge.from === aokId1 ? color1 : color2;
            edgesDataSet.update({ id: e.id, color: { color: c, opacity: 0.85, highlight: c }, width: srcEdge.width + 1 });
        } else {
            edgesDataSet.update({ id: e.id, color: { color: 'rgba(80,80,80,0.08)', opacity: 0.05 }, width: 1 });
        }
    });

    // Build comparison panel
    let html = `<h3>Comparing AOKs</h3>`;
    html += `<div style="display:flex;gap:6px;margin-bottom:12px;">
        <span style="background:${color1};padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600;">${aok1.label.replace(/\n/g, ' ')}</span>
        <span style="color:#666;">vs</span>
        <span style="background:${color2};padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600;">${aok2.label.replace(/\n/g, ' ')}</span>
    </div>`;

    conceptIds.forEach(cid => {
        const concept = graphData.nodes.find(n => n.id === cid);
        const e1 = edges1.find(e => e.to === cid);
        const e2 = edges2.find(e => e.to === cid);
        html += `<div style="margin-bottom:10px;">
            <div style="font-weight:600;font-size:12px;color:#ccc;margin-bottom:4px;">${concept.label.replace(/\n/g, ' ')}</div>
            <div class="compare-row">
                <div class="compare-cell" style="border-left:3px solid ${color1}">
                    <div class="cell-label">${e1 ? e1.label.replace(/\n/g, ' ') : '—'}</div>
                </div>
                <div class="compare-cell" style="border-left:3px solid ${color2}">
                    <div class="cell-label">${e2 ? e2.label.replace(/\n/g, ' ') : '—'}</div>
                </div>
            </div>
        </div>`;
    });

    document.getElementById('detail-content').innerHTML = html;
}

function showPrompt() {
    document.getElementById('detail-content').innerHTML =
        `<p class="prompt-text">Click a <em>concept node</em> to see how each AOK handles it.<br><br>
        Click an <em>AOK node</em> to see how it addresses all 5 concepts.<br><br>
        Or use the dropdowns above to compare two AOKs side by side.</p>`;
}

function buildLegend() {
    const legendDiv = document.getElementById('legend-items');
    const groups = graphData.groups;
    let html = '';

    // Concepts first
    html += `<div class="legend-item">
        <div class="legend-dot concept" style="background:${groups['concept'].color}"></div>
        <span class="legend-label">Concepts</span>
    </div>`;

    // AOKs
    const aokGroups = Object.entries(groups).filter(([k]) => k !== 'concept');
    aokGroups.forEach(([key, g]) => {
        html += `<div class="legend-item" data-group="${key}">
            <div class="legend-dot" style="background:${g.color}"></div>
            <span class="legend-label">${g.label}</span>
        </div>`;
    });

    legendDiv.innerHTML = html;

    // Click legend item to highlight that AOK
    legendDiv.querySelectorAll('.legend-item[data-group]').forEach(el => {
        el.addEventListener('click', () => {
            const grp = el.getAttribute('data-group');
            const node = graphData.nodes.find(n => n.group === grp);
            if (node) handleNodeClick(node.id);
        });
    });
}

function setupControls() {
    const sel1 = document.getElementById('aok-select-1');
    const sel2 = document.getElementById('aok-select-2');

    const aokNodes = graphData.nodes.filter(n => n.group !== 'concept');
    aokNodes.forEach(n => {
        const label = n.label.replace(/\n/g, ' ');
        sel1.innerHTML += `<option value="${n.id}">${label}</option>`;
        sel2.innerHTML += `<option value="${n.id}">${label}</option>`;
    });

    document.getElementById('compare-btn').addEventListener('click', () => {
        const id1 = parseInt(sel1.value);
        const id2 = parseInt(sel2.value);
        if (!id1 || !id2) {
            document.getElementById('detail-content').innerHTML =
                '<p class="prompt-text" style="color:#f88;">Please select two different AOKs to compare.</p>';
            return;
        }
        if (id1 === id2) {
            document.getElementById('detail-content').innerHTML =
                '<p class="prompt-text" style="color:#f88;">Please select two <em>different</em> AOKs.</p>';
            return;
        }
        showCompareView(id1, id2);
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        sel1.value = '';
        sel2.value = '';
        resetHighlights();
        showPrompt();
    });
}
