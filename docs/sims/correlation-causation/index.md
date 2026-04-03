---
title: Correlation vs. Causation
description: Interactive p5.js MicroSim for correlation vs. causation.
image: /sims/correlation-causation/correlation-causation.png
og:image: /sims/correlation-causation/correlation-causation.png
twitter:image: /sims/correlation-causation/correlation-causation.png
social:
   cards: false
quality_score: 0
---

# Correlation vs. Causation

<iframe src="main.html" height="432" width="100%" scrolling="no"></iframe>

[Run the Correlation vs. Causation MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This interactive MicroSim helps students distinguish between correlational and causal relationships by identifying confounding variables in real-world examples.. It supports the learning objectives in Chapter: Human Sciences and History.

## How to Use

Use the interactive controls below the drawing area to explore the visualization. Hover over elements for additional information and click to see detailed descriptions.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/theory-of-knowledge/sims/correlation-causation/main.html"
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
- Basic understanding of scatter plots and what a positive or negative trend looks like
- Awareness that the Natural Sciences use evidence to support knowledge claims
- Familiarity with the idea that not all patterns in data reflect cause-and-effect relationships

### Learning Objectives
- **Evaluate** the difference between correlation and causation by identifying confounding variables that offer alternative explanations for observed patterns

### Activities

1. **Exploration** (5 min): Load the "Ice Cream Sales & Drowning Deaths" dataset in the sim. Observe the scatter plot — there is a clear positive correlation. Before revealing the confound, write down your prediction: Does ice cream cause drowning? What alternative explanation might account for the pattern? Now click to reveal the hidden confounding variable (temperature/season). Notice how the correlation remains real, but the causal story changes completely.
2. **Guided Practice** (10 min): Explore at least two additional datasets in the sim. For each one, follow this protocol with a partner: (a) describe the correlation you observe, (b) hypothesize a direct causal mechanism, (c) brainstorm at least two possible confounding variables, (d) reveal the actual confound and compare it to your hypotheses. Discuss the TOK knowledge question: "In the Human Sciences, how can researchers ever establish causation rather than mere correlation?" Consider why randomized controlled experiments are valued in the Natural Sciences and what happens when such experiments are impossible (e.g., in economics, history, or ethics).
3. **Assessment** (5 min): A news headline reads: "Study finds that people who eat breakfast daily earn 20% more than those who skip it." Apply what you have learned: identify the implied causal claim, propose two plausible confounding variables, and explain in 3-4 sentences why the correlation alone is insufficient to establish that eating breakfast causes higher income. Connect your reasoning to the TOK concept of evidence and justification in the Human Sciences.

### Assessment

- Students can correctly distinguish between a correlational claim and a causal claim
- Students can propose at least two plausible confounding variables for a given correlation
- Students can explain why correlation alone is insufficient justification for a causal knowledge claim, with reference to methodology in the Natural or Human Sciences

## Quiz

Test your understanding with this review question.

#### 1. A study finds a strong positive correlation between the number of firefighters sent to a fire and the amount of property damage caused by the fire. What is the most likely explanation?

<div class="upper-alpha" markdown>
1. Firefighters cause property damage when fighting fires
2. Property damage causes more firefighters to be called
3. A confounding variable — the severity of the fire — causes both more firefighters to be dispatched and more property damage
4. The correlation is a statistical error and not real
</div>

??? question "Show Answer"
    The correct answer is **C**. The severity of the fire is a confounding variable that independently causes both an increase in firefighters dispatched and an increase in property damage. Option A mistakes correlation for direct causation. Option B reverses the causal direction but still ignores the confound. Option D incorrectly dismisses the correlation itself — the correlation is real, but the causal interpretation is what is flawed.

    **Concept Tested:** Confounding Variables and the Correlation-Causation Distinction

## References

1. Pearl, J. (2009). *Causality: Models, Reasoning, and Inference* (2nd ed.). Cambridge University Press.
2. Vigen, T. (2015). *Spurious Correlations*. Hachette Books.
