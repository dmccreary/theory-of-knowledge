// Capstone Portfolio Knowledge Web - vis-network MicroSim
// Interactive network where students build a personal knowledge web
// CANVAS_HEIGHT: 685

let network = null;
let graphData = null;
let nodesDataSet = null;
let edgesDataSet = null;
let addEdgeMode = false;
let edgeSourceNode = null;
let nextNodeId = 100;
let nextEdgeId = 1000;
let nodeNotes = {};  // nodeId -> note text

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const mainEl = document.querySelector('main');
    mainEl.innerHTML = `
        <div id="network-container"></div>
        <div id="title-overlay">
            <h1>Capstone Portfolio Knowledge Web</h1>
            <div class="subtitle">Build your personal map connecting portfolio components to chapters</div>
        </div>
        <div id="legend-overlay">
            <h3>Legend</h3>
            <div class="legend-item">
                <div class="legend-dot star" style="background:#daa520"></div>
                <span class="legend-label">Portfolio Components</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot" style="background:#2ba8a8"></div>
                <span class="legend-label">Chapter Nodes</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot" style="background:#9370db"></div>
                <span class="legend-label">Your Custom Nodes</span>
            </div>
        </div>
        <div id="control-panel">
            <h2>Portfolio Builder</h2>
            <div class="ctrl-section">
                <label>Add Custom Node</label>
                <input type="text" id="node-label-input" placeholder="Enter node label...">
                <button class="btn-primary" id="add-node-btn">Add Node</button>
            </div>
            <div class="ctrl-section">
                <label>Connect Nodes</label>
                <button class="btn-toggle" id="add-edge-btn">Add Edge Mode: OFF</button>
                <div style="font-size:10px; color:#777; margin-top:4px; line-height:1.4;">
                    When ON, click a source node then a target node to connect them.
                </div>
            </div>
            <div class="ctrl-section">
                <label>Physics</label>
                <div class="checkbox-row">
                    <input type="checkbox" id="physics-toggle">
                    <span>Enable physics simulation</span>
                </div>
            </div>
            <div class="ctrl-section">
                <label>Actions</label>
                <button class="btn-danger" id="reset-btn">Reset to Default</button>
            </div>
            <div class="ctrl-section">
                <label>Node Details</label>
                <div id="detail-content">
                    <p class="prompt-text">Click a node to see details.<br><br>
                    <em>Double-click</em> any node to add personal notes.</p>
                </div>
            </div>
        </div>
        <div id="status-bar">Ready</div>
    `;

    try {
        const resp = await fetch('data.json');
        graphData = await resp.json();
        buildNetwork();
        setupControls();
        setStatus('Ready — click nodes to explore, double-click to add notes');
    } catch (err) {
        console.error('Failed to load data.json:', err);
        document.getElementById('detail-content').innerHTML =
            '<p style="color:#f88">Error loading data.json</p>';
    }
}

function buildNetwork() {
    const container = document.getElementById('network-container');

    const cx = 340, cy = 340;
    const innerR = 110, outerR = 270;

    const portfolioCount = graphData.portfolioNodes.length;
    const chapterCount = graphData.chapterNodes.length;

    // Position portfolio nodes in inner ring (star shape, gold)
    const pNodes = graphData.portfolioNodes.map((n, i) => {
        const angle = (2 * Math.PI * i / portfolioCount) - Math.PI / 2;
        const x = cx + innerR * Math.cos(angle);
        const y = cy + innerR * Math.sin(angle);
        return {
            id: n.id,
            label: n.label,
            x: x,
            y: y,
            fixed: true,
            shape: 'star',
            size: 28,
            color: {
                background: '#daa520',
                border: '#b8860b',
                highlight: { background: '#f0c040', border: '#ffffff' },
                hover: { background: '#f0c040', border: '#ffffff' }
            },
            font: {
                size: 12,
                color: '#ffffff',
                face: 'Arial',
                multi: 'md',
                bold: { color: '#ffffff' }
            },
            borderWidth: 2,
            borderWidthSelected: 3,
            shadow: { enabled: true, color: 'rgba(218,165,32,0.4)', size: 10 },
            group: 'portfolio'
        };
    });

    // Position chapter nodes in outer ring (teal gradient, circular)
    const cNodes = graphData.chapterNodes.map((n, i) => {
        const angle = (2 * Math.PI * i / chapterCount) - Math.PI / 2;
        const x = cx + outerR * Math.cos(angle);
        // Slight y-offset to avoid perfectly horizontal edges
        const y = cy + outerR * Math.sin(angle) + (Math.abs(Math.sin(angle)) < 0.1 ? 10 : 0);
        return {
            id: n.id,
            label: n.label,
            x: x,
            y: y,
            fixed: true,
            shape: 'circle',
            size: 22,
            color: {
                background: n.teal,
                border: n.teal,
                highlight: { background: n.teal, border: '#ffffff' },
                hover: { background: n.teal, border: '#ffffff' }
            },
            font: {
                size: 10,
                color: '#ffffff',
                face: 'Arial',
                multi: 'md',
                bold: { color: '#ffffff' }
            },
            borderWidth: 2,
            borderWidthSelected: 3,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)', size: 6 },
            group: 'chapter'
        };
    });

    // Build edges
    const edgeObjects = graphData.edges.map((e, i) => ({
        id: i,
        from: e.from,
        to: e.to,
        label: e.label,
        width: 2,
        color: { color: 'rgba(218,165,32,0.4)', highlight: '#daa520', hover: '#daa520' },
        font: { size: 9, color: '#999', strokeWidth: 3, strokeColor: 'rgba(26,26,46,0.85)', multi: 'md', align: 'middle' },
        smooth: { type: 'curvedCW', roundness: 0.12 },
        hoverWidth: 1.5,
        selectionWidth: 2
    }));

    nextEdgeId = edgeObjects.length;

    nodesDataSet = new vis.DataSet([...pNodes, ...cNodes]);
    edgesDataSet = new vis.DataSet(edgeObjects);

    const options = {
        interaction: {
            zoomView: false,
            dragView: false,
            dragNodes: true,
            hover: true,
            navigationButtons: true,
            tooltipDelay: 200
        },
        physics: { enabled: false },
        edges: {
            smooth: { type: 'curvedCW', roundness: 0.12 }
        }
    };

    network = new vis.Network(container, { nodes: nodesDataSet, edges: edgesDataSet }, options);

    network.on('click', handleClick);
    network.on('doubleClick', handleDoubleClick);
}

function handleClick(params) {
    if (addEdgeMode && params.nodes.length > 0) {
        handleEdgeModeClick(params.nodes[0]);
        return;
    }

    if (params.nodes.length > 0) {
        showNodeDetail(params.nodes[0]);
    } else if (params.edges.length > 0) {
        showEdgeDetail(params.edges[0]);
    } else {
        showPrompt();
    }
}

function handleDoubleClick(params) {
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodesDataSet.get(nodeId);
        const currentNote = nodeNotes[nodeId] || '';
        const newNote = prompt('Add notes for "' + node.label.replace(/\n/g, ' ') + '":', currentNote);
        if (newNote !== null) {
            nodeNotes[nodeId] = newNote;
            showNodeDetail(nodeId);
            setStatus('Note saved for "' + node.label.replace(/\n/g, ' ') + '"');
        }
    }
}

function handleEdgeModeClick(nodeId) {
    if (!edgeSourceNode) {
        edgeSourceNode = nodeId;
        const node = nodesDataSet.get(nodeId);
        setStatus('Edge source: "' + node.label.replace(/\n/g, ' ') + '" — now click the target node', true);
        // Highlight source
        network.selectNodes([nodeId]);
    } else {
        if (edgeSourceNode === nodeId) {
            setStatus('Cannot connect a node to itself. Click a different target.', true);
            return;
        }
        // Check if edge already exists
        const existing = edgesDataSet.get().find(e =>
            (e.from === edgeSourceNode && e.to === nodeId) ||
            (e.from === nodeId && e.to === edgeSourceNode)
        );
        if (existing) {
            setStatus('Edge already exists between these nodes.', true);
            edgeSourceNode = null;
            network.unselectAll();
            return;
        }

        const edgeLabel = prompt('Label for this connection (optional):') || '';
        edgesDataSet.add({
            id: nextEdgeId++,
            from: edgeSourceNode,
            to: nodeId,
            label: edgeLabel,
            width: 2,
            color: { color: 'rgba(147,112,219,0.5)', highlight: '#9370db', hover: '#9370db' },
            font: { size: 9, color: '#b8a0e0', strokeWidth: 3, strokeColor: 'rgba(26,26,46,0.85)', multi: 'md', align: 'middle' },
            smooth: { type: 'curvedCW', roundness: 0.12 },
            hoverWidth: 1.5,
            selectionWidth: 2,
            dashes: true
        });

        const srcNode = nodesDataSet.get(edgeSourceNode);
        const tgtNode = nodesDataSet.get(nodeId);
        setStatus('Connected "' + srcNode.label.replace(/\n/g, ' ') + '" to "' + tgtNode.label.replace(/\n/g, ' ') + '"', true);
        edgeSourceNode = null;
        network.unselectAll();
    }
}

function showNodeDetail(nodeId) {
    const node = nodesDataSet.get(nodeId);
    if (!node) return;

    const label = node.label.replace(/\n/g, ' ');
    let html = '';

    // Find description from data
    const pNode = graphData.portfolioNodes.find(n => n.id === nodeId);
    if (pNode) {
        html += `<h3 style="color:#daa520">${label}</h3>`;
        html += `<p>${pNode.description}</p>`;
    } else {
        html += `<h3 style="color:#2ba8a8">${label}</h3>`;
    }

    // Show connected nodes
    const connectedEdges = edgesDataSet.get().filter(e => e.from === nodeId || e.to === nodeId);
    if (connectedEdges.length > 0) {
        html += `<div style="margin-top:8px; font-size:11px; color:#aaa; font-weight:600;">CONNECTIONS (${connectedEdges.length})</div>`;
        connectedEdges.forEach(e => {
            const otherId = e.from === nodeId ? e.to : e.from;
            const otherNode = nodesDataSet.get(otherId);
            if (otherNode) {
                const otherLabel = otherNode.label.replace(/\n/g, ' ');
                const borderColor = otherNode.group === 'portfolio' ? '#daa520' : (otherNode.group === 'custom' ? '#9370db' : '#2ba8a8');
                html += `<div class="connection-item" style="border-left-color:${borderColor}">
                    <div class="conn-label">${otherLabel}</div>
                    ${e.label ? '<div class="conn-edge">' + e.label.replace(/\n/g, ' ') + '</div>' : ''}
                </div>`;
            }
        });
    }

    // Show notes if any
    if (nodeNotes[nodeId]) {
        html += `<div class="node-notes">
            <div class="note-label">Your Notes</div>
            <div class="note-text">${nodeNotes[nodeId]}</div>
        </div>`;
    }

    html += `<p style="font-size:10px; color:#666; margin-top:8px;"><em>Double-click to add/edit notes</em></p>`;

    document.getElementById('detail-content').innerHTML = html;
}

function showEdgeDetail(edgeId) {
    const edge = edgesDataSet.get(edgeId);
    if (!edge) return;
    const fromNode = nodesDataSet.get(edge.from);
    const toNode = nodesDataSet.get(edge.to);
    if (!fromNode || !toNode) return;

    const html = `<h3>Connection</h3>
        <p><strong>${fromNode.label.replace(/\n/g, ' ')}</strong> &rarr; <strong>${toNode.label.replace(/\n/g, ' ')}</strong></p>
        ${edge.label ? '<p style="color:#8cb4e0; font-style:italic;">' + edge.label.replace(/\n/g, ' ') + '</p>' : ''}`;
    document.getElementById('detail-content').innerHTML = html;
}

function showPrompt() {
    document.getElementById('detail-content').innerHTML =
        `<p class="prompt-text">Click a node to see details.<br><br>
        <em>Double-click</em> any node to add personal notes.</p>`;
}

function setStatus(msg, highlight) {
    const bar = document.getElementById('status-bar');
    bar.textContent = msg;
    bar.className = highlight ? 'active' : '';
}

function setupControls() {
    // Add Node
    document.getElementById('add-node-btn').addEventListener('click', addCustomNode);
    document.getElementById('node-label-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomNode();
    });

    // Add Edge toggle
    document.getElementById('add-edge-btn').addEventListener('click', toggleEdgeMode);

    // Physics toggle
    document.getElementById('physics-toggle').addEventListener('change', (e) => {
        const enabled = e.target.checked;
        network.setOptions({ physics: { enabled: enabled } });

        // When physics enabled, unfix custom nodes so they participate
        if (enabled) {
            nodesDataSet.forEach(n => {
                if (n.group === 'custom') {
                    nodesDataSet.update({ id: n.id, fixed: false });
                }
            });
        } else {
            // Re-fix all nodes when physics disabled
            nodesDataSet.forEach(n => {
                nodesDataSet.update({ id: n.id, fixed: true });
            });
        }

        setStatus(enabled ? 'Physics enabled — nodes will settle into positions' : 'Physics disabled — nodes are fixed');
    });

    // Reset
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Reset the network to its default state? Your custom nodes, edges, and notes will be lost.')) {
            nodeNotes = {};
            edgeSourceNode = null;
            addEdgeMode = false;
            document.getElementById('add-edge-btn').textContent = 'Add Edge Mode: OFF';
            document.getElementById('add-edge-btn').classList.remove('active');
            document.getElementById('physics-toggle').checked = false;
            nextNodeId = 100;
            nextEdgeId = 1000;
            buildNetwork();
            setupClickHandlers();
            showPrompt();
            setStatus('Network reset to default');
        }
    });
}

function setupClickHandlers() {
    network.on('click', handleClick);
    network.on('doubleClick', handleDoubleClick);
}

function addCustomNode() {
    const input = document.getElementById('node-label-input');
    const label = input.value.trim();
    if (!label) {
        setStatus('Please enter a label for the new node');
        input.focus();
        return;
    }

    // Place near center with some randomness
    const cx = 340, cy = 340;
    const angle = Math.random() * 2 * Math.PI;
    const radius = 140 + Math.random() * 60;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    nodesDataSet.add({
        id: nextNodeId,
        label: label,
        x: x,
        y: y,
        fixed: !document.getElementById('physics-toggle').checked,
        shape: 'circle',
        size: 18,
        color: {
            background: '#9370db',
            border: '#7b5fbf',
            highlight: { background: '#a880eb', border: '#ffffff' },
            hover: { background: '#a880eb', border: '#ffffff' }
        },
        font: {
            size: 11,
            color: '#ffffff',
            face: 'Arial',
            multi: 'md',
            bold: { color: '#ffffff' }
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        shadow: { enabled: true, color: 'rgba(147,112,219,0.3)', size: 6 },
        group: 'custom'
    });

    setStatus('Added node: "' + label + '" (id: ' + nextNodeId + ')');
    nextNodeId++;
    input.value = '';
    input.focus();
}

function toggleEdgeMode() {
    addEdgeMode = !addEdgeMode;
    edgeSourceNode = null;
    const btn = document.getElementById('add-edge-btn');

    if (addEdgeMode) {
        btn.textContent = 'Add Edge Mode: ON';
        btn.classList.add('active');
        setStatus('Edge mode ON — click a source node, then a target node', true);
    } else {
        btn.textContent = 'Add Edge Mode: OFF';
        btn.classList.remove('active');
        network.unselectAll();
        setStatus('Edge mode OFF');
    }
}
