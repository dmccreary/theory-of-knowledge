# Book Chapter Generator Session Log

**Skill:** book-chapter-generator
**Date:** 2026-04-02
**Project:** theory-of-knowledge
**Course:** Theory of Knowledge (TOK) — IB Diploma Programme
**Target Audience:** High school students ages 16–19

## Session Overview

This session designed and generated a 16-chapter structure for the Theory of Knowledge intelligent textbook, covering all 275 concepts from the learning graph with zero dependency violations. The session also included an update to the chapter-content-generator skill in the claude-skills repo (v0.06 → v0.07) to address student feedback about instructional scaffolding.

## Phase 1: Skill Update (claude-skills repo)

### Student Feedback

A student from University of St. Thomas (SEIS666: Digital Transformation with Generative AI) reported that generated chapter content consistently introduces concepts, diagrams, and code examples before the reader has the vocabulary to interpret them. Three specific examples:

1. RAG pipeline diagram uses "vectors" and "embeddings" before either term is defined
2. REST API code example contains `temperature` and `max_tokens` with no bridge to later explanations
3. Tables introduce concepts before prose explains them

### Changes to chapter-content-generator SKILL.md (v0.06 → v0.07)

- Added **"Scaffolding — define before you display"** as Step 2.4, Principle 3 with four sub-rules (vocabulary before visuals, bridge sentences before code, prose-first tables, signpost what's coming)
- Added Best Practice #9: "Scaffolding — the experience of reading"
- Added Scaffolding pitfalls section with 8 do/don't items
- Added SCAFFOLDING (CRITICAL) section to the parallel agent prompt template
- Version bumped to 0.07 in all locations
- Committed, pushed, and deployed claude-skills repo

---

## Phase 2: Chapter Structure Design (theory-of-knowledge repo)

### Input Analysis

#### Course Description
- **Subject:** IB Theory of Knowledge
- **Audience:** Ages 16–19, IB Diploma Programme
- **Reading Level:** Senior High (determined from "ages 16–19" and IB context)
- **Tone:** Inquiry-driven, Socratic, encouraging of multiple perspectives
- **Assessment:** TOK Essay (1,600 words) and TOK Exhibition (950 words)
- **Themes:** Knowledge and the Knower, Knowledge and Language, Knowledge and Technology, Knowledge and Politics
- **AOKs:** Mathematics, Natural Sciences, Human Sciences, History, The Arts, Ethics, Indigenous Knowledge, Religious Knowledge

#### Learning Graph
- **275 concepts** across 12 taxonomy groups
- **490 edges** (dependency relationships)
- **Single root:** Knowledge (id: 1) — the only concept with zero prerequisites
- **Maximum depth:** 13 (Scientific Revolutions → Thomas Kuhn → Paradigm Shift → ...)
- **Depth distribution:** Heaviest at depths 5-8 (170 concepts, 62% of total)

#### Edge Direction Validation (MANDATORY)
- Built prerequisite map using `prereqs[edge['from']].add(edge['to'])` (dependency direction)
- Foundational concept: Knowledge (id: 1) — exactly 1 concept with no prerequisites
- **Result: PASSED** — Knowledge is the sole foundational concept, which is correct for a TOK course

#### Taxonomy Distribution

| Taxonomy | Count | Avg Depth | Role in Structure |
|----------|-------|-----------|-------------------|
| METH (Discipline Methods) | 55 | 8.3 | Largest group, split across 4 chapters |
| THEM (Themes and Perspectives) | 47 | 4.9 | Split across 5 chapters by theme |
| MISN (Misinformation) | 25 | 6.8 | Single dedicated chapter |
| ARGU (Reasoning/Argumentation) | 25 | 5.6 | Single dedicated chapter |
| FOUND (Foundation Concepts) | 18 | 2.5 | Split across first 3 chapters |
| SKEP (Skepticism/Critical Thinking) | 18 | 6.6 | Split across 3 chapters by dependency |
| BIAS (Cognitive Biases) | 17 | 4.2 | Single dedicated chapter |
| EVID (Evidence and Justification) | 15 | 4.8 | Single dedicated chapter |
| AOK (Areas of Knowledge) | 15 | 5.5 | Single chapter with math methods |
| ETHC (Ethics and Values) | 15 | 7.9 | Single dedicated chapter |
| ASMT (TOK Assessment) | 13 | 6.2 | Capstone chapter |
| THEO (Theories of Knowledge) | 12 | 4.0 | Split across 2 chapters |

#### Hub Concepts (Most Depended-Upon)
The concepts with the most dependents constrained the chapter structure most:

| Concept | Dependents | Depth | Implication |
|---------|------------|-------|-------------|
| Knowledge | 26 | 0 | Must be in Ch 1 |
| Evidence | 23 | 3 | Must be early (Ch 2) |
| Cognitive Biases | 16 | 3 | Must precede 16 concepts |
| Truth | 11 | 1 | Must be in Ch 1 |
| Argumentation | 11 | 4 | Must precede fallacies, rhetoric, translation |
| Areas of Knowledge | 11 | 5 | Must precede all AOK-specific methods |
| Moral Reasoning | 11 | 7 | Must precede all ethics concepts |
| Scientific Method | 10 | 7 | Must precede paradigms, falsifiability |

---

### Design Decisions and Tradeoffs

#### Decision 1: 16 Chapters (vs. 12 or 20)

**Chosen:** 16 chapters, average 17.2 concepts per chapter

**Considered alternatives:**
- **12 chapters** (~23 concepts each): Would require combining AOKs into mega-chapters (e.g., "Natural Sciences, Human Sciences, and History" at 39 concepts). Rejected because chapters over 25 concepts are too dense for high school students.
- **15 chapters** (~18.3 each): Attempted this first. Required merging either Arts (10 concepts) with something unrelated, or Politics (8 concepts) with Assessment (10 concepts). Both merges felt thematically incoherent.
- **18 chapters** (~15.3 each): Considered splitting Natural Sciences (23) and Reasoning (24) into two chapters each. Rejected because 18 chapters would make the textbook feel fragmented.
- **20 chapters** (~13.8 each): Too many thin chapters for the concept count.

**Tradeoff:** 16 is slightly above the skill's "optimal 10–15" range, but with 275 concepts (vs. the typical 200), the higher count is justified. The smallest chapters (Arts: 10, Knowledge and Language: 11) are focused enough to stand alone.

#### Decision 2: METH Split Across 4 Chapters

**Chosen:** Mathematics (Ch 9), Natural Sciences (Ch 10), Human Sciences/History (Ch 11), Arts (Ch 12)

**Rationale:** METH is the largest taxonomy (55 concepts) with average depth 8.3. A single chapter would have 55 concepts — over double the 25-concept maximum. The natural split follows the AOK boundaries: math, natural sciences, human sciences + history, and arts.

**Tradeoff:** This means the AOKs are introduced in Ch 9 but their methods aren't fully explored until Ch 12. Students encounter the AOK overview first, then progressively deeper dives. This mirrors how the IB course itself works — overview first, then depth.

**Alternative considered:** Embedding methods directly in the AOK chapter (Ch 9). Rejected: would create a 70+ concept mega-chapter.

#### Decision 3: Theme Introductions in Ch 4 (not in dedicated theme chapters)

**Chosen:** Knowledge and Language (226), Knowledge and Technology (239), Knowledge and Politics (251), and Meaning (229) are introduced in Ch 4 (Knowledge and the Knower) rather than in their dedicated theme chapters (Ch 7, 14, 15).

**Rationale:** These are depth-1 concepts that multiple later concepts depend on. Specifically:
- **Framing Effect** (Ch 5, Cognitive Biases) depends on Meaning → Knowledge and Language
- **Algorithmic Bias** (Ch 14) depends on Algorithms → Knowledge and Technology
- **Censorship** (Ch 8) depends on Intellectual Freedom → Knowledge and Politics

By introducing the theme shells early, downstream chapters don't have to wait for the full theme treatment.

**Tradeoff:** Ch 4 becomes a 18-concept "hub" chapter that introduces 4 themes briefly before the Knower theme gets full treatment. This means students encounter "Knowledge and Technology" and "Knowledge and Politics" as concepts before those themes are deeply explored (Ch 14–15). The chapter's title "Knowledge and the Knower" slightly understates its scope.

**Alternative considered:** Keeping theme intros in their dedicated chapters and reordering. Rejected: would force Cognitive Biases (Ch 5) to come after Knowledge and Language (Ch 7), disrupting the natural flow from "what is knowledge" → "how knowledge fails" → "how to reason" → "language" → "disciplines."

#### Decision 4: Language Chapter After Argumentation

**Chosen:** Ch 6 (Reasoning and Argumentation) before Ch 7 (Knowledge and Language)

**Rationale:** Three language concepts depend on Argumentation:
- **Translation** (231) depends on Argumentation and Meaning
- **Rhetoric** (235) depends on Argumentation and Knowledge and Language
- **Metaphor** (234) depends on Persuasion (a sub-concept of Argumentation) and Meaning

**Tradeoff:** Thematically, one might expect Language (a "ways of knowing" topic) to come before Argumentation (a skills topic). But the dependency graph makes this impossible without splitting the language chapter. The compromise was putting Knowledge and Language + Meaning early (Ch 4) and the full language treatment later (Ch 7).

#### Decision 5: Skepticism Concepts Split Across 3 Chapters

**Chosen:**
- Ch 1: Critical Thinking (depth 2) — foundation for everything
- Ch 8: Philosophical skepticism traditions, intellectual virtues, denialism (depth 3–7)
- Ch 10: Scientific Skepticism, Pseudoscience, Science Denial, Demarcation Problem (depth 8–10)

**Rationale:** SKEP concepts span depths 2–10. The science-dependent concepts (Scientific Skepticism, Pseudoscience, Science Denial) require Scientific Method and Falsifiability, which are Natural Sciences concepts in Ch 10. Placing them all in a single "Skepticism" chapter would either require putting Scientific Method before Ch 10 or creating a forward reference.

**Tradeoff:** The skepticism narrative is split. A student interested in "what is skepticism and how does it apply to science?" must read Ch 8 and then wait until Ch 10. However, each placement is locally coherent: Ch 8 covers the philosophical tradition, Ch 10 covers the scientific application.

#### Decision 6: Ethics of AI Moved to Ch 14 (Technology) from Ch 13 (Ethics)

**Chosen:** Ethics of AI (211) placed in Ch 14 (Knowledge, Technology, and Power) instead of Ch 13 (Ethics and Values)

**Rationale:** Ethics of AI depends on both Moral Reasoning (Ch 13) AND Artificial Intelligence (Ch 14). Since AI is introduced in Ch 14, Ethics of AI can't appear in Ch 13 without a forward reference. This was the single dependency violation caught during validation.

**Tradeoff:** The ethics chapter loses one concept (15 → 15 concepts after the move). The technology chapter gains an ethical dimension, which actually strengthens it thematically — Ch 14 becomes "Knowledge, Technology, and Power" covering both technological capability and its ethical/power implications.

#### Decision 7: Power and Knowledge Concepts in Ch 14 (not a separate Politics chapter)

**Chosen:** Power and Knowledge (252), Epistemic Injustice (258), Representation (209) placed in Ch 14 alongside technology concepts.

**Rationale:** Initially designed a standalone "Knowledge, Politics, and Power" chapter with only 8 concepts (below the 10-concept minimum preference). Merging with technology created a 19-concept chapter with a coherent theme: how technology and power structures shape whose knowledge counts.

**Tradeoff:** Some politics concepts that depend on Information Ecosystem (Ch 15) — Information Overload (261), Attention Economy (262), Epistemology of Internet (250) — couldn't join Ch 14 and were placed in Ch 16 instead. This splits the "politics" theme across Ch 14 and Ch 16.

**Alternative considered:** Merging all politics into the Misinformation chapter (Ch 15). Rejected: would create a 33-concept chapter, well over the 25-concept maximum.

#### Decision 8: Conspiracy Theories in Ch 15 (not Ch 8)

**Chosen:** Conspiracy Theories (73) placed in Ch 15 (Misinformation) rather than Ch 8 (Skepticism)

**Rationale:** Conspiracy Theories depends on Motivated Reasoning (Ch 5, Cognitive Biases) AND Misinformation (81), which is the lead concept of Ch 15. Since Misinformation depends on Truth and Knowledge Claims, it couldn't be placed earlier without disrupting the structure.

**Tradeoff:** Conspiracy Theories might seem like a skepticism topic, but its dependency on Misinformation makes it a natural fit for Ch 15. Students will have already covered Motivated Reasoning (Ch 5) and various bias concepts before reaching this topic.

#### Decision 9: Intellectual Freedom and Censorship in Ch 8 (not a Politics chapter)

**Chosen:** Intellectual Freedom (254) and Censorship (253) placed in Ch 8 (Skepticism and Intellectual Virtues) rather than a later Politics chapter.

**Rationale:** These are depth 2-3 concepts (very early in the dependency chain). Censorship in Art (198, Ch 12) depends on Censorship. Content Moderation (105, Ch 15) depends on Censorship. Placing them early makes downstream chapters work without forward references.

**Tradeoff:** Thematically, censorship and intellectual freedom are "politics" concepts (THEM-Politics in the taxonomy). Placing them in the Skepticism chapter is a dependency-driven choice, not a thematic one. The chapter title was expanded to "Skepticism, Intellectual Virtues, and Knowledge Production" to accommodate the broader scope.

#### Decision 10: Qualitative and Quantitative Methods in Ch 10 (not Ch 11)

**Chosen:** Qualitative Methods (171) and Quantitative Methods (172) placed in Ch 10 (Natural Sciences) rather than Ch 11 (Human Sciences)

**Rationale:** Controlled Experiments (178) depends on both Scientific Method AND Quantitative Methods. If Quantitative Methods were in Ch 11, Controlled Experiments couldn't be in Ch 10. Since Controlled Experiments is core to the scientific method, it belongs in Ch 10.

**Tradeoff:** Human Sciences students might expect to encounter qualitative and quantitative methods for the first time in their chapter. Instead, these are introduced in the Natural Sciences chapter and then applied in the Human Sciences chapter (Observer Effect, Surveys and Sampling, Case Studies all reference them).

---

### Dependency Violation Resolution

#### Initial Validation
- First run: **1 violation** — Ethics of AI (211, Ch 13) needs Artificial Intelligence (242, Ch 14)
- **Fix:** Moved Ethics of AI from Ch 13 to Ch 14
- Second run: **0 violations** ✓

#### Cross-Taxonomy Concept Placements

Several concepts were placed outside their home taxonomy to satisfy dependencies:

| Concept | Home Taxonomy | Placed In | Reason |
|---------|--------------|-----------|--------|
| Critical Thinking (63) | SKEP | Ch 1 (FOUND) | Depth 2, hub for 9 dependents |
| Ways of Knowing (144) | AOK | Ch 1 (FOUND) | Depth 2, needed by Knower concepts |
| Reflective Thinking (270) | ASMT | Ch 1 (FOUND) | Depth 3, needed by Metacognition |
| Information Literacy (94) | MISN | Ch 4 (THEM) | Depth 4, needed by Identity and Knowledge |
| Empiricism (151) | METH | Ch 4 (THEM) | Relates to the knower's epistemology |
| Rationalism (152) | METH | Ch 4 (THEM) | Relates to the knower's epistemology |
| Authority in Knowledge (215) | ETHC | Ch 3 (EVID) | Needed by Authority Bias (Ch 5) |
| Cross-Cultural Knowledge (142) | AOK | Ch 4 (THEM) | Depends on Culture and Knowledge |
| Claim and Evidence (125) | ARGU | Ch 3 (EVID) | Naturally fits with evidence types |
| Knowledge Framework (273) | ASMT | Ch 9 (AOK) | Depends on Areas of Knowledge |
| Interdisciplinary Inquiry (141) | AOK | Ch 11 (METH) | Depends on Historical Revisionism |
| Scientific Skepticism (65) | SKEP | Ch 10 (METH) | Depends on Scientific Method |
| Pseudoscience (70) | SKEP | Ch 10 (METH) | Depends on Scientific Skepticism |
| Conspiracy Theories (73) | SKEP | Ch 15 (MISN) | Depends on Misinformation |
| Ethics of AI (211) | ETHC | Ch 14 (THEM) | Depends on Artificial Intelligence |

---

### Final Chapter Structure

| Ch | Title | Concepts | Range |
|----|-------|----------|-------|
| 1 | Foundations of Knowledge | 14 | d0–d3 |
| 2 | Theories of Truth and Knowledge | 15 | d2–d5 |
| 3 | Evidence and Justification | 20 | d4–d6 |
| 4 | Knowledge and the Knower | 18 | d1–d5 |
| 5 | Cognitive Biases | 17 | d3–d6 |
| 6 | Reasoning and Argumentation | 24 | d3–d8 |
| 7 | Knowledge and Language | 11 | d2–d7 |
| 8 | Skepticism, Intellectual Virtues, and Knowledge Production | 16 | d3–d8 |
| 9 | Areas of Knowledge and Mathematical Methods | 19 | d5–d11 |
| 10 | Natural Sciences and the Scientific Method | 23 | d5–d13 |
| 11 | Human Sciences and History | 16 | d7–d9 |
| 12 | The Arts as Knowledge | 10 | d7–d8 |
| 13 | Ethics and Values in Knowledge | 15 | d7–d11 |
| 14 | Knowledge, Technology, and Power | 19 | d2–d10 |
| 15 | Misinformation and the Information Age | 25 | d4–d9 |
| 16 | TOK Assessment and Synthesis | 13 | d5–d10 |
| | **Total** | **275** | |

### Files Created

| File | Description |
|------|-------------|
| `docs/chapters/index.md` | Main chapter overview with links and one-sentence summaries |
| `docs/chapters/01-foundations-of-knowledge/index.md` | Ch 1 outline (14 concepts) |
| `docs/chapters/02-theories-of-truth-and-knowledge/index.md` | Ch 2 outline (15 concepts) |
| `docs/chapters/03-evidence-and-justification/index.md` | Ch 3 outline (20 concepts) |
| `docs/chapters/04-knowledge-and-the-knower/index.md` | Ch 4 outline (18 concepts) |
| `docs/chapters/05-cognitive-biases/index.md` | Ch 5 outline (17 concepts) |
| `docs/chapters/06-reasoning-and-argumentation/index.md` | Ch 6 outline (24 concepts) |
| `docs/chapters/07-knowledge-and-language/index.md` | Ch 7 outline (11 concepts) |
| `docs/chapters/08-skepticism-and-intellectual-virtues/index.md` | Ch 8 outline (16 concepts) |
| `docs/chapters/09-areas-of-knowledge-and-mathematics/index.md` | Ch 9 outline (19 concepts) |
| `docs/chapters/10-natural-sciences-and-scientific-method/index.md` | Ch 10 outline (23 concepts) |
| `docs/chapters/11-human-sciences-and-history/index.md` | Ch 11 outline (16 concepts) |
| `docs/chapters/12-the-arts-as-knowledge/index.md` | Ch 12 outline (10 concepts) |
| `docs/chapters/13-ethics-and-values-in-knowledge/index.md` | Ch 13 outline (15 concepts) |
| `docs/chapters/14-knowledge-technology-and-power/index.md` | Ch 14 outline (19 concepts) |
| `docs/chapters/15-misinformation-and-the-information-age/index.md` | Ch 15 outline (25 concepts) |
| `docs/chapters/16-tok-assessment-and-synthesis/index.md` | Ch 16 outline (13 concepts) |
| `mkdocs.yml` | Updated nav section with all 16 chapters |

### Next Steps

1. Review the chapter structure at `http://127.0.0.1:8000/theory-of-knowledge/`
2. Run the `chapter-content-generator` skill (v0.07) to populate each chapter with detailed content
3. Each chapter index.md has "TODO: Generate Chapter Content" as a placeholder
4. After content generation, run `glossary-generator`, `quiz-generator`, and `faq-generator` skills
