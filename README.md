# Theory of Knowledge

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/theory-of-knowledge/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Ftheory--of--knowledge-blue?logo=github)](https://github.com/dmccreary/theory-of-knowledge)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/claude-skills)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/theory-of-knowledge/](https://dmccreary.github.io/theory-of-knowledge/)

## Overview

This is an interactive, AI-generated intelligent textbook for the **IB Theory of Knowledge (TOK)** course — a core component of the International Baccalaureate Diploma Programme. Designed for high school students ages 16–19, it examines how knowledge is produced, validated, and communicated across disciplines and cultures.

Built with MkDocs and the Material theme, this textbook incorporates a learning graph with 275 interconnected concepts, interactive MicroSimulations, structured inquiry activities, and a friendly learning mascot named Sofia the Owl who guides students through epistemological questions with her signature prompt: *"But how do we know?"*

The 16 chapters cover the full TOK curriculum — from foundations of knowledge and theories of truth through areas of knowledge (mathematics, natural sciences, human sciences, the arts, ethics) to contemporary topics like misinformation, technology, and power. Whether you're a student preparing for the TOK essay and exhibition or an educator looking for structured course materials, this textbook provides comprehensive, accessible coverage with hands-on interactive elements.

**Disclaimer:** Although this course is carefully aligned with the IB Diploma Programme, the author is not associated with the International Baccalaureate Organization (IBO) in any way.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/theory-of-knowledge.git
cd theory-of-knowledge
```

### Install Dependencies

This project uses MkDocs with the Material theme:

```bash
pip install mkdocs
pip install mkdocs-material
```

### Build and Serve Locally

Build the site:

```bash
mkdocs build
```

Serve locally for development (with live reload):

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000`

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This will build the site and push it to the `gh-pages` branch.

### Using the Book

**Navigation:**

- Use the left sidebar to browse chapters
- Click the search icon to search all content
- Each chapter includes reflection questions and exercises

**Interactive MicroSims:**

- Found in the "MicroSims" section
- Each simulation runs standalone in your browser
- The Learning Graph Viewer lets you explore all 275 concepts and their dependencies

## Repository Structure

```
theory-of-knowledge/
├── docs/                              # MkDocs documentation source
│   ├── chapters/                      # 16 chapter directories
│   │   ├── 01-foundations-of-knowledge/
│   │   │   └── index.md
│   │   ├── 02-theories-of-truth-and-knowledge/
│   │   └── ...
│   ├── sims/                          # Interactive MicroSimulations
│   │   └── graph-viewer/              # Learning graph viewer
│   ├── learning-graph/                # Learning graph data and analysis
│   │   ├── concept-list.md            # 275 concepts
│   │   ├── quality-metrics.md         # Quality analysis
│   │   └── concept-taxonomy.md        # Bloom's taxonomy mapping
│   ├── img/                           # Images and mascot artwork
│   │   └── mascot/                    # Sofia the Owl poses
│   ├── css/                           # Custom stylesheets
│   ├── glossary.md                    # Term definitions
│   ├── references.md                  # Curated references
│   └── index.md                       # Home page
├── mkdocs.yml                         # MkDocs configuration
└── README.md                          # This file
```

## Reporting Issues

Found a bug, typo, or have a suggestion for improvement? Please report it:

[GitHub Issues](https://github.com/dmccreary/theory-of-knowledge/issues)

When reporting issues, please include:

- Description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**

- **Share** — copy and redistribute the material
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

## Acknowledgements

This project is built on the shoulders of giants in the open source community:

- **[MkDocs](https://www.mkdocs.org/)** — Static site generator optimized for project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — Beautiful, responsive theme
- **[vis-network](https://visjs.org/)** — Network visualization library for learning graphs
- **[MathJax](https://www.mathjax.org/)** — Mathematical notation rendering
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted content generation
- **[GitHub Pages](https://pages.github.com/)** — Free hosting for open source projects

Special thanks to the educators and developers who contribute to making educational resources accessible and interactive.

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Feel free to connect on LinkedIn or open an issue on GitHub.
