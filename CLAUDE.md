# Theory of Knowledge (TOK) Intelligent Textbook

## Project Overview

- **Subject:** Theory of Knowledge (TOK) — IB Diploma Programme
- **Audience:** High school students ages 16-19
- **Reading Level:** Accessible but intellectually rigorous; define technical terms on first use
- **Tone:** Inquiry-driven, Socratic, encouraging of multiple perspectives

## Learning Mascot: Sofia the Owl

### Character Overview

- **Name:** Sofia
- **Species:** Owl (barn owl inspired)
- **Personality:** Curious, thoughtful, encouraging, gently Socratic
- **Catchphrase:** "But how do we know?"
- **Visual:** A round, friendly owl with warm teal and cream feathers, large expressive amber eyes. No accessories, no glasses, not holding anything. Clean minimal design with expressive wings used for gestures.

### Voice and Tone

Sofia speaks as a wise but approachable guide — never lecturing, always inviting students to think alongside her. Her voice is:

- **Socratic:** Asks genuine questions rather than stating conclusions. "What would happen if we looked at this from a different culture's perspective?" rather than "Different cultures see this differently."
- **Warm but not childish:** Treats students as capable young thinkers. No baby talk, no over-simplification.
- **Epistemologically precise:** Uses TOK vocabulary naturally. Says "knowledge claim" not "idea," says "justification" not "reason."
- **Inclusive:** Acknowledges that different perspectives exist without dismissing any. "Some knowers might argue..." rather than "The correct view is..."

### Signature Phrases

Use these naturally — don't force every one into every chapter:

- "But how do we know?" (primary catchphrase — use in welcome admonitions)
- "Let's question that!"
- "What perspective might we be missing?"
- "What evidence would change your mind?"
- "That's a common assumption — let's examine it."
- "This is where it gets interesting..."
- "You're thinking like an epistemologist!"

Refer to students as "knowledge explorers" or "fellow knowers."

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar:

```markdown
!!! mascot-welcome "Title Here"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sofia waving welcome">
    Admonition text goes here after the img tag.
```

**Image path rule:** The `src` path is relative to the rendered page URL. For chapter pages at `chapters/NN-name/index.md`, use `../../img/mascot/`. For pages at `learning-graph/page.md`, use `../../img/mascot/`.

### Admonition Types and When to Use Each

#### mascot-welcome — Chapter Openings

**When:** The very first element of every chapter, immediately after the H1 heading.

**Purpose:** Welcome students to the topic, preview what they'll explore, spark curiosity.

**Title format:** "Welcome, Knowledge Explorers!" or a topic-specific welcome.

**Content pattern:**
1. A warm greeting connecting to the chapter topic
2. The catchphrase "But how do we know?" tied to the chapter's central question
3. A brief preview of what's ahead (1-2 sentences)

```markdown
!!! mascot-welcome "Welcome, Knowledge Explorers!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sofia waving welcome">
    Welcome to our exploration of cognitive biases! Have you ever been absolutely
    certain about something, only to discover you were wrong? But how do we know
    when our own thinking is leading us astray? Let's find out together.
```

#### mascot-thinking — Key Epistemological Insights

**When:** After introducing a concept that has deep epistemological implications. Place these at moments where students should pause and reflect — not after every definition, but after ideas that shift how they think about knowledge.

**Purpose:** Signal "this is important — stop and think about this."

**Title format:** "Key Insight," "Sofia's Reflection," or a concept-specific title.

**Good triggers:**

- When a concept challenges common assumptions (e.g., the Gettier Problem)
- When two AOKs handle the same question differently
- When a real-world example perfectly illustrates an abstract idea
- After introducing a paradigm shift or epistemological tension

```markdown
!!! mascot-thinking "Key Insight"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sofia thinking">
    Notice how the same piece of evidence — a statistical correlation — counts as
    strong support in epidemiology but would be considered insufficient in physics.
    The standards of evidence aren't universal; they're shaped by each discipline's
    methods and history.
```

#### mascot-tip — Practical Advice

**When:** When there's a concrete strategy, technique, or heuristic students can apply. Especially useful before assessment-related sections.

**Purpose:** Give actionable, practical guidance.

**Good triggers:**

- Tips for writing TOK essays or exhibitions
- Strategies for evaluating sources or detecting bias
- Techniques for constructing arguments or identifying fallacies
- Study strategies or discussion frameworks

```markdown
!!! mascot-tip "Sofia's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sofia giving a tip">
    When evaluating a knowledge claim, ask three questions: What is the evidence?
    Who is the source, and what might their perspective be? What would it take to
    disprove this claim? These three questions will serve you well in every AOK.
```

#### mascot-warning — Common Mistakes and Fallacies

**When:** When students commonly make a specific error in reasoning, or when a logical fallacy is particularly tempting in context.

**Purpose:** Flag pitfalls before students fall into them.

**Good triggers:**

- Common logical fallacies in context (e.g., confusing correlation with causation)
- Frequent misunderstandings of TOK concepts
- Oversimplifications that miss important nuance
- Biases that are especially active in the topic being discussed

```markdown
!!! mascot-warning "Watch Out!"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sofia warning">
    Be careful not to commit the genetic fallacy here — dismissing a knowledge
    claim solely because of where it came from. Even unreliable sources can
    occasionally make true claims. Evaluate the evidence on its own merits.
```

#### mascot-encourage — Difficult Content

**When:** Before or during sections that are conceptually challenging, abstract, or potentially frustrating.

**Purpose:** Normalize struggle and provide reassurance.

**Good triggers:**

- Abstract philosophical concepts (e.g., Gettier Problem, Pyrrhonian Skepticism)
- Sections requiring students to hold multiple perspectives simultaneously
- Topics where there are no clear right answers
- Assessment preparation when students may feel overwhelmed

```markdown
!!! mascot-encourage "You've Got This!"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sofia encouraging">
    Epistemological frameworks can feel abstract at first — that's completely
    normal. Every great philosopher struggled with these same questions.
    The goal isn't to find the "right" answer but to reason carefully about
    why you hold the position you do.
```

#### mascot-celebration — Section Completion

**When:** At the end of major sections or chapters, after students have worked through substantial content.

**Purpose:** Acknowledge progress and reinforce what was learned.

**Good triggers:**

- End of a chapter
- After completing a particularly challenging section
- After a milestone (e.g., understanding all six AOKs)
- When students have built enough knowledge to see connections

```markdown
!!! mascot-celebration "Excellent Progress!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sofia celebrating">
    You've now explored how all eight Areas of Knowledge use different methods
    of inquiry to produce knowledge. You're thinking like an epistemologist!
    In the next chapter, we'll see how these methods intersect and sometimes
    conflict.
```

#### mascot-neutral — General Notes

**When:** For general sidebars, cross-references, interesting asides, or contextual notes that don't fit the other categories.

**Purpose:** Provide supplementary information in Sofia's voice without a strong emotional tone.

```markdown
!!! mascot-neutral "A Note from Sofia"
    <img src="../../img/mascot/neutral.png" class="mascot-admonition-img" alt="Sofia neutral pose">
    This concept connects to what we explored in Chapter 3 about the role of
    language in shaping knowledge. You might want to revisit that section
    to see how these ideas build on each other.
```

### Chapter Placement Pattern

A typical chapter should include Sofia **4-6 times** in this pattern:

1. **Opening** (mascot-welcome) — Always first, right after the H1
2. **First key insight** (mascot-thinking) — After the first major concept
3. **Practical tip or warning** (mascot-tip or mascot-warning) — Mid-chapter
4. **Encouragement** (mascot-encourage) — Before or during the hardest section (optional)
5. **Second key insight** (mascot-thinking) — After the second major concept (optional)
6. **Closing** (mascot-celebration) — End of chapter, before exercises/questions

**Spacing rule:** Leave at least 2-3 paragraphs of regular content between mascot admonitions. Never place them back-to-back.

### Do's and Don'ts

**Do:**

- Use Sofia to introduce new topics warmly
- Include the catchphrase "But how do we know?" in welcome admonitions
- Keep dialogue brief (1-3 sentences, max 4)
- Match the pose/image to the content type
- Make Sofia's observations genuinely useful — not just cheerleading
- Connect Sofia's comments to specific TOK concepts and vocabulary
- Vary which signature phrases you use across chapters

**Don't:**

- Use Sofia more than 6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Sofia's personality or speech patterns
- Give Sofia accessories or objects to hold
- Have Sofia state facts — she should ask questions and offer perspectives
- Use the same title text repeatedly (vary "Key Insight," "Sofia's Reflection," etc.)
- Have Sofia break the fourth wall or reference being an AI-generated character

## Disclaimer

Although this course is carefully aligned with the International Baccalaureate Diploma Programme, the author is not associated with the International Baccalaureate Organization (IBO) in any way.
