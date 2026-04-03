---
title: Godel's Incompleteness Visualized
description: Interactive p5.js MicroSim for godel's incompleteness visualized.
image: /sims/godel-incompleteness/godel-incompleteness.png
og:image: /sims/godel-incompleteness/godel-incompleteness.png
twitter:image: /sims/godel-incompleteness/godel-incompleteness.png
social:
   cards: false
quality_score: 0
---

# Godel's Incompleteness Visualized

<iframe src="main.html" height="452" width="100%" scrolling="no"></iframe>

[Run the Godel's Incompleteness Visualized MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This interactive MicroSim helps students explain Godel's First Incompleteness Theorem by identifying the relationship between provable statements and true statements within a formal system.. It supports the learning objectives in Chapter: Areas of Knowledge and Mathematical Methods.

## How to Use

Use the interactive controls below the drawing area to explore the visualization. Hover over elements for additional information and click to see detailed descriptions.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/theory-of-knowledge/sims/godel-incompleteness/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
9-12 (High School / IB TOK)

### Duration
15-20 minutes

### Prerequisites
- Basic understanding of formal systems (axioms, rules, theorems)
- Awareness that mathematics aims to prove statements as true or false
- Familiarity with the idea that some questions may not have definitive answers

### Learning Objectives
- **Explain** Godel's First Incompleteness Theorem using a nested sets diagram, distinguishing between true statements, provable statements, and undecidable statements within a formal system

### Activities
1. **Exploration** (5 min): Open the sim and observe the nested sets diagram at Stage 1. Identify the outermost set (all statements), the middle set (true statements), and the innermost set (provable statements). Note that the provable set is smaller than the true set. Click through to Stage 2 and read the explanation of why these sets differ.
2. **Guided Practice** (10 min): Step through all 5 stages of the visualization. At each stage, pause and write one sentence summarizing the key idea. Pay special attention to Stage 3, where the "Godel sentence" appears in the region that is true but not provable. Discuss with a partner: What does it mean for a statement to be true but unprovable? Can you think of an everyday analogy?
3. **Assessment** (5 min): Draw your own simplified version of the nested sets diagram from memory, labeling all three regions: provable-and-true, true-but-not-provable, and neither-true-nor-provable. Write one example of a knowledge claim from everyday life that might be "true but hard to prove" and explain the parallel to Godel's theorem.

### Assessment
- Correctly labels the three regions of the nested sets diagram and explains what each contains
- Articulates in their own words why provable statements form a proper subset of true statements
- Connects the concept of inherent limitations in formal systems to broader TOK questions about the limits of mathematical knowledge

## Quiz

Test your understanding with this review question.

#### 1. What does Godel's First Incompleteness Theorem demonstrate about sufficiently powerful formal systems?

<div class="upper-alpha" markdown>
1. Every true statement in the system can eventually be proved if we work long enough.
2. There exist statements within the system that are true but cannot be proved within the system.
3. Mathematics is unreliable because its axioms might be wrong.
4. Formal systems are unnecessary because intuition is a more reliable Way of Knowing.
</div>

??? question "Show Answer"
    The correct answer is **B**. Godel's First Incompleteness Theorem shows that in any consistent formal system powerful enough to express basic arithmetic, there exist statements that are true but cannot be proved within that system. This does not make mathematics unreliable; rather, it reveals inherent limitations on what formal proof can achieve.

    **Concept Tested:** Godel's First Incompleteness Theorem

## References

1. Nagel, E., & Newman, J. R. (2001). *Godel's Proof*. NYU Press.
2. Hofstadter, D. R. (1979). *Godel, Escher, Bach: An Eternal Golden Braid*. Basic Books.
