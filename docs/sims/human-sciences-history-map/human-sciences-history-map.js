// Human Sciences & History Methods Map - vis-network MicroSim
// Concept map relating human sciences and history methods
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
            <h1>Human Sciences &amp; History Methods</h1>
            <div class="subtitle">Concept map of methods, shared challenges, and connections</div>
        </div>
        <div id="legend-overlay"><h3>Legend</h3><div id="legend-items"></div></div>
        <div id="info-panel">
            <h2>Methods Map</h2>
            <button id="reset-btn">Reset View</button>
            <div id="detail-content">
                <p class="prompt-text">Click a <em>node</em> to see its description and connections.<br><br>
                Hover over an <em>edge</em> to see how two concepts relate.<br><br>
                <span style="color:#4A90D9;">Blue</span> = Human Sciences &nbsp;
                <span style="color:#2E8B57;">Green</span> = History &nbsp;
                <span style="color:#DAA520;">Amber</span> = Shared</p>
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

    // Separate nodes by group for layout
    const hsNodes = graphData.nodes.filter(n => n.group === 'human-science');
    const histNodes = graphData.nodes.filter(n => n.group === 'history');
    const sharedNodes = graphData.nodes.filter(n => n.group === 'shared');

    const cx = 330, cy = 340;

    // Human science nodes on the left arc
    // History nodes on the right arc
    // Shared nodes in the centre

    const positionedNodes = graphData.nodes.map(n => {
        const g = groups[n.group];
        let x, y;

        if (n.group === 'human-science') {
            const idx = hsNodes.indexOf(n);
            const total = hsNodes.length;
            // Left arc from top-left to bottom-left
            const startAngle = Math.PI * 0.75;
            const endAngle = Math.PI * 1.35;
            const angle = startAngle + (endAngle - startAngle) * idx / (total - 1);
            const r = 260;
            x = cx + r * Math.cos(angle);
            y = cy + r * Math.sin(angle);
        } else if (n.group === 'history') {
            const idx = histNodes.indexOf(n);
            const total = histNodes.length;
            // Right arc from top-right to bottom-right
            const startAngle = -Math.PI * 0.35;
            const endAngle = Math.PI * 0.25;
            const angle = startAngle + (endAngle - startAngle) * idx / (total - 1);
            const r = 260;
            x = cx + r * Math.cos(angle);
            // Slight y-offset to avoid perfectly horizontal edges
            y = cy + r * Math.sin(angle) + (Math.abs(Math.sin(angle)) < 0.1 ? 10 : 0);
        } else {
            // Shared nodes in a vertical column in the centre
            const idx = sharedNodes.indexOf(n);
            const total = sharedNodes.length;
            const spacing = 120;
            const startY = cy - (total - 1) * spacing / 2;
            x = cx;
            y = startY + idx * spacing;
        }

        const shape = n.group === 'shared' ? 'diamond' : 'dot';

        const nodeObj = {
            id: n.id,
            label: n.label,
            x: x,
            y: y,
            fixed: true,
            shape: shape,
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
        const fromNode = graphData.nodes.find(n => n.id === e.from);
        const toNode = graphData.nodes.find(n => n.id === e.to);
        // Color edge by the "from" node's group
        const edgeColor = groups[fromNode.group].color;
        // Use tooltip for hover description
        const edgeObj = {
            id: i,
            from: e.from,
            to: e.to,
            label: e.label,
            title: e.description,
            width: 2,
            color: { color: edgeColor, opacity: 0.45, highlight: edgeColor, hover: edgeColor },
            font: { size: 9, color: '#cccccc', strokeWidth: 3, strokeColor: 'rgba(26,26,46,0.85)', multi: 'md', align: 'middle' },
            smooth: { type: 'curvedCW', roundness: 0.15 },
            hoverWidth: 1.5,
            selectionWidth: 2
        };
        originalEdgeColors[i] = { color: edgeColor, opacity: 0.45 };
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
    showNodeDetail(nodeId);
    highlightNodeConnections(nodeId);
}

function highlightNodeConnections(nodeId) {
    // Find all edges connected to this node (from or to)
    const connectedEdges = graphData.edges.filter(e => e.from === nodeId || e.to === nodeId);
    const connectedNodeIds = new Set([nodeId]);
    connectedEdges.forEach(e => {
        connectedNodeIds.add(e.from);
        connectedNodeIds.add(e.to);
    });

    // Dim non-connected nodes
    nodesDataSet.forEach(n => {
        if (connectedNodeIds.has(n.id)) {
            nodesDataSet.update({
                id: n.id, opacity: 1.0,
                color: {
                    background: originalNodeColors[n.id].background,
                    border: originalNodeColors[n.id].border,
                    highlight: { background: originalNodeColors[n.id].background, border: '#ffffff' },
                    hover: { background: originalNodeColors[n.id].background, border: '#ffffff' }
                }
            });
        } else {
            nodesDataSet.update({
                id: n.id, opacity: 0.15,
                color: {
                    background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)',
                    highlight: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' },
                    hover: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' }
                }
            });
        }
    });

    // Dim non-connected edges
    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge && (srcEdge.from === nodeId || srcEdge.to === nodeId)) {
            const fromNode = graphData.nodes.find(n => n.id === srcEdge.from);
            const edgeColor = graphData.groups[fromNode.group].color;
            edgesDataSet.update({
                id: e.id,
                color: { color: edgeColor, opacity: 0.85, highlight: edgeColor, hover: edgeColor },
                width: 3
            });
        } else {
            edgesDataSet.update({
                id: e.id,
                color: { color: 'rgba(80,80,80,0.1)', opacity: 0.08 },
                width: 1
            });
        }
    });
}

function resetHighlights() {
    nodesDataSet.forEach(n => {
        const oc = originalNodeColors[n.id];
        nodesDataSet.update({
            id: n.id, opacity: 1.0,
            color: {
                background: oc.background, border: oc.border,
                highlight: { background: oc.background, border: '#ffffff' },
                hover: { background: oc.background, border: '#ffffff' }
            }
        });
    });
    edgesDataSet.forEach(e => {
        const srcEdge = graphData.edges[e.id];
        if (srcEdge) {
            const oc = originalEdgeColors[e.id];
            edgesDataSet.update({
                id: e.id,
                color: { color: oc.color, opacity: oc.opacity, highlight: oc.color, hover: oc.color },
                width: 2
            });
        }
    });
}

function showNodeDetail(nodeId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    const groupColor = graphData.groups[node.group].color;
    const groupLabel = graphData.groups[node.group].label;
    const cleanLabel = node.label.replace(/\n/g, ' ');

    let html = `<div class="node-detail-header" style="color:${groupColor}">${cleanLabel}</div>`;
    html += `<div style="font-size:11px;color:#888;margin-bottom:6px;">${groupLabel}</div>`;
    html += `<div class="node-description">${node.description}</div>`;

    // Find connected edges
    const connectedEdges = graphData.edges.filter(e => e.from === nodeId || e.to === nodeId);

    if (connectedEdges.length > 0) {
        html += `<div class="connections-heading">Connections</div>`;
        connectedEdges.forEach(e => {
            const otherId = e.from === nodeId ? e.to : e.from;
            const otherNode = graphData.nodes.find(n => n.id === otherId);
            const otherColor = graphData.groups[otherNode.group].color;
            html += `<div class="connection-item" style="border-left-color:${otherColor}">
                <div class="concept-name" style="color:${otherColor}">${otherNode.label.replace(/\n/g, ' ')}</div>
                <div class="edge-label">${e.label.replace(/\n/g, ' ')}</div>
                <div class="description">${e.description}</div>
            </div>`;
        });
    }

    document.getElementById('detail-content').innerHTML = html;
}

function showPrompt() {
    document.getElementById('detail-content').innerHTML =
        `<p class="prompt-text">Click a <em>node</em> to see its description and connections.<br><br>
        Hover over an <em>edge</em> to see how two concepts relate.<br><br>
        <span style="color:#4A90D9;">Blue</span> = Human Sciences &nbsp;
        <span style="color:#2E8B57;">Green</span> = History &nbsp;
        <span style="color:#DAA520;">Amber</span> = Shared</p>`;
}

function buildLegend() {
    const legendDiv = document.getElementById('legend-items');
    const groups = graphData.groups;
    let html = '';

    const groupOrder = ['human-science', 'history', 'shared'];
    groupOrder.forEach(key => {
        const g = groups[key];
        const dotClass = key === 'shared' ? 'legend-dot diamond' : 'legend-dot';
        html += `<div class="legend-item" data-group="${key}">
            <div class="${dotClass}" style="background:${g.color}"></div>
            <span class="legend-label">${g.label}</span>
        </div>`;
    });

    legendDiv.innerHTML = html;

    // Click legend item to highlight that group
    legendDiv.querySelectorAll('.legend-item[data-group]').forEach(el => {
        el.addEventListener('click', () => {
            const grp = el.getAttribute('data-group');
            highlightGroup(grp);
        });
    });
}

function highlightGroup(groupKey) {
    const groupNodes = graphData.nodes.filter(n => n.group === groupKey);
    const groupNodeIds = new Set(groupNodes.map(n => n.id));

    // Find all edges connected to this group
    const connectedEdgeIndices = [];
    const connectedNodeIds = new Set(groupNodeIds);
    graphData.edges.forEach((e, i) => {
        if (groupNodeIds.has(e.from) || groupNodeIds.has(e.to)) {
            connectedEdgeIndices.push(i);
            connectedNodeIds.add(e.from);
            connectedNodeIds.add(e.to);
        }
    });

    nodesDataSet.forEach(n => {
        if (connectedNodeIds.has(n.id)) {
            nodesDataSet.update({
                id: n.id, opacity: 1.0,
                color: {
                    background: originalNodeColors[n.id].background,
                    border: originalNodeColors[n.id].border,
                    highlight: { background: originalNodeColors[n.id].background, border: '#ffffff' },
                    hover: { background: originalNodeColors[n.id].background, border: '#ffffff' }
                }
            });
        } else {
            nodesDataSet.update({
                id: n.id, opacity: 0.15,
                color: {
                    background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)',
                    highlight: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' },
                    hover: { background: 'rgba(80,80,80,0.3)', border: 'rgba(80,80,80,0.3)' }
                }
            });
        }
    });

    const connectedSet = new Set(connectedEdgeIndices);
    edgesDataSet.forEach(e => {
        if (connectedSet.has(e.id)) {
            const srcEdge = graphData.edges[e.id];
            const fromNode = graphData.nodes.find(n => n.id === srcEdge.from);
            const edgeColor = graphData.groups[fromNode.group].color;
            edgesDataSet.update({
                id: e.id,
                color: { color: edgeColor, opacity: 0.85, highlight: edgeColor, hover: edgeColor },
                width: 3
            });
        } else {
            edgesDataSet.update({
                id: e.id,
                color: { color: 'rgba(80,80,80,0.1)', opacity: 0.08 },
                width: 1
            });
        }
    });

    // Show group summary in panel
    const g = graphData.groups[groupKey];
    const nodes = graphData.nodes.filter(n => n.group === groupKey);
    let html = `<div class="node-detail-header" style="color:${g.color}">${g.label}</div>`;
    html += `<div class="node-description">${nodes.length} concepts in this category:</div>`;
    nodes.forEach(n => {
        html += `<div class="connection-item" style="border-left-color:${g.color}; cursor:pointer;" onclick="handleNodeClick(${n.id})">
            <div class="concept-name" style="color:${g.color}">${n.label.replace(/\n/g, ' ')}</div>
            <div class="description">${n.description.substring(0, 80)}...</div>
        </div>`;
    });
    document.getElementById('detail-content').innerHTML = html;
}

function setupControls() {
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetHighlights();
        showPrompt();
    });
}
