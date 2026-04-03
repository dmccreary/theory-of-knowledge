# MicroSim Generator Session Log

**Skill:** microsim-generator (meta-skill)
**Date:** 2026-04-02
**Execution Mode:** Sequential (batches of 4 agents in parallel)

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-04-02 ~12:20 |
| End Time | 2026-04-02 ~22:30 |
| Rate limit pauses | ~2 hours total |

## Summary

| Metric | Value |
|--------|-------|
| Total MicroSims generated | 64 (+ 4 pre-existing) |
| Total JavaScript lines | 28,205 |
| Average lines per sim | 414 |
| Libraries used | p5.js (61), vis-network (3) |
| Scaffolding files created | 64 × 3 (main.html, index.md, metadata.json) |
| Iframe heights fixed | 67 |
| Chapter iframes updated | 31 changes across 16 chapters |
| MkDocs nav entries | 69 |

## Generation Batches

| Batch | Sims | Status |
|-------|------|--------|
| 1 (sims 1-4) | ai-ethics-dimensions, ai-knowledge-production-map, algorithm-filter-knowledge, anachronism-detection | Done |
| 2 (sims 5-8) | anatomy-of-proof, aok-synthesis-map, argument-anatomy, art-as-knowledge-map | Done |
| 3 (sims 9-12) | art-communication-triangle, arts-knowledge-types, availability-heuristic-risk, bias-self-diagnostic | Done |
| 4 (sims 13-16) | capstone-portfolio-web, cartesian-doubt-layers, certainty-spectrum-aok, claim-to-knowledge-workflow | Done |
| 5 (sims 17-20) | cognitive-dissonance-model, conceptual-metaphor-map, content-moderation-framework, correlation-causation | Done |
| 6 (sims 21-24) | creativity-dimensions, debunking-vs-prebunking, deductive-inductive-comparison, demarcation-spectrum | Done |
| 7 (sims 25-28) | dunning-kruger-curve, echo-chambers-filter-bubbles, empiricism-rationalism-compare, epistemological-frameworks | Done |
| 8 (sims 29-32) | ethical-dilemma-anatomy, ethical-frameworks-comparison, evidence-evaluation-workflow, evidence-strength-hierarchy | Done |
| 9 (sims 33-36) | exhibition-analysis, fallacy-identifier, godel-incompleteness, hermeneutic-circle | Done |
| 10 (sims 37-40) | human-sciences-history-map, info-warfare-anatomy, information-disorder-spectrum, information-literacy-framework | Done |
| 11 (sims 41-44) | intellectual-virtues-wheel, internet-epistemology, jtb-venn-diagram, knowledge-dissemination-network | Done |
| 12 (sims 45-48) | knowledge-framework-aok, knowledge-production-pipeline, knowledge-type-classifier, kuhn-cycle | Done |
| 13 (sims 49-52) | language-tool-constraint, quant-qual-methods, question-levels, reductio-flowchart | Done |
| 14 (sims 53-56) | research-ethics-checkpoints, sampling-methods, sense-perception-pipeline, simulation-knowledge-cycle | Done |
| 15 (sims 57-60) | source-analysis, source-credibility-analyzer, theory-law-model, three-theories-of-truth | Done (rate limit hit after completion) |
| 16 (sims 61-64) | tok-themes-interaction, translation-loss, types-of-ambiguity, ways-of-knowing-web | Done |

## Post-Generation Steps

- [x] fix-iframe-heights.py — 67 heights fixed
- [x] add-iframes-to-chapter.py — 31 changes across 16 chapters
- [x] update-mkdocs-nav.py — 69 entries added
- [ ] validate-sims.py — not yet run
- [ ] test-iframe-heights.py (Playwright) — not yet run
- [ ] bk-capture-screenshot — not yet run

## MicroSim Types Generated

| Type | Count | Examples |
|------|-------|---------|
| Classification quiz | 8 | anachronism-detection, fallacy-identifier, knowledge-type-classifier |
| Comparison/infographic | 12 | deductive-inductive-comparison, ethical-frameworks-comparison |
| Concept map | 6 | art-as-knowledge-map, tok-themes-interaction |
| Cyclical diagram | 3 | kuhn-cycle, hermeneutic-circle, simulation-knowledge-cycle |
| Flowchart/workflow | 5 | claim-to-knowledge-workflow, evidence-evaluation-workflow |
| Interactive exercise | 4 | bias-self-diagnostic, content-moderation-framework |
| Network simulation | 2 | debunking-vs-prebunking, echo-chambers-filter-bubbles |
| Pipeline diagram | 4 | knowledge-production-pipeline, sense-perception-pipeline |
| Radar chart | 2 | ai-ethics-dimensions, creativity-dimensions |
| Scatter plot | 1 | correlation-causation |
| Spectrum/draggable | 2 | certainty-spectrum-aok, demarcation-spectrum |
| Step-through | 6 | anatomy-of-proof, godel-incompleteness, cartesian-doubt-layers |
| Venn diagram | 1 | jtb-venn-diagram |
| vis-network graph | 3 | aok-synthesis-map, capstone-portfolio-web, human-sciences-history-map |
| Other | 5 | dunning-kruger-curve, evidence-strength-hierarchy, etc. |
