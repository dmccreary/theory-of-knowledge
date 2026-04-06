# OpenAI gpt-image-1 Evaluation for Story Images

**Date:** 2026-04-06
**Project:** Theory of Knowledge Intelligent Textbook
**Test story:** Charles Darwin and the Finches' Beaks

## Background

The Gemini 2.5 Flash Image API hit its $10/month spending cap after generating 78 images (6 stories) on April 5, 2026. Attempts to work around this by creating new Google AI Studio projects on the free tier failed — `gemini-2.5-flash-preview-image` has a hard quota of **0** on free-tier projects. Image generation requires Tier 1 Postpay billing (credit card required).

Rather than raise the Gemini cap, we evaluated OpenAI's `gpt-image-1` as an alternative.

## API Pricing (gpt-image-1)

| Quality | Size | Cost/image | 91 images |
|---------|------|-----------|-----------|
| low | 1024x1024 (square) or 1536x1024 (landscape) | $0.011 | $1.00 |
| medium | 1536x1024 (landscape) | $0.047 | $4.28 |
| high | 1536x1024 (landscape) | $0.167 | $15.20 |

## Test Results

### Low quality ($0.011/image)

- **File:** `docs/stories/charles-darwin/cover-low-quality.png`
- **Size:** 1536x1024 (landscape)
- **Art quality:** Passable but noticeably rough — flat shading, less detail on faces and textures
- **Text rendering:** Main title "CHARLES DARWIN" was readable, but subtitle was garbled: "AJRBINKY FJNCHES' BEAKS" instead of "and the Finches' Beaks"
- **Verdict:** Not acceptable for a published textbook. Text rendering breaks on smaller/mixed-case words. Art quality is significantly below Gemini.

### Medium quality ($0.047/image)

- **Files:** `docs/stories/charles-darwin/cover.png` and `panel-01.png` through `panel-12.png`
- **Size:** 1536x1024 (landscape, 3:2 aspect ratio)
- **Art quality:** Excellent — rich Victorian natural history illustration style, strong period detail, good facial features, consistent tone across all 13 panels
- **Text rendering:** Perfect on the cover: "CHARLES DARWIN and the FINCHES' BEAKS" rendered cleanly and legibly
- **Generation time:** ~25 seconds per image, ~5.5 minutes for 13 images
- **Total cost:** $0.61 for 13 images (1 cover + 12 panels)
- **Verdict:** Very good quality. Comparable to or better than Gemini 2.5 Flash Image in art quality, and notably better at text rendering.

### High quality (not tested)

At $0.167/image ($15.20 for 91 images), the high tier was not tested. Medium quality was already excellent.

## Comparison: Gemini vs OpenAI Medium

| Dimension | Gemini 2.5 Flash Image | OpenAI gpt-image-1 (medium) |
|-----------|----------------------|---------------------------|
| Cost/image | $0.039 | $0.047 |
| 13-image story | $0.51 | $0.61 |
| 91 remaining images | $3.55 | $4.28 |
| Native size | 1344x768 (16:9) | 1536x1024 (3:2) |
| Text rendering | Good (occasional errors) | Very good (clean titles) |
| Art quality | Very good | Very good to excellent |
| Generation speed | ~7s/image | ~25s/image |
| Free tier | Not available for images (as of April 2026) | Not available |
| Billing model | Postpay (credit card required) | Prepaid credits (credit card required) |

## Alternative: Manual Generation via ChatGPT Plus

The image prompts embedded in each story's `index.md` can be manually copy-pasted into a ChatGPT Plus subscription account (which includes image generation at no additional per-image cost). This avoids API charges entirely but requires manual effort:

- **Cost:** $0.00 (included in ChatGPT Plus subscription, currently $20/month)
- **Time:** ~15 minutes per story (manual copy-paste of 13 prompts, manual download of 13 images, manual rename to cover.png / panel-01.png through panel-12.png)
- **Quality:** Same gpt-image-1 model, same quality as API medium/high
- **Tradeoff:** 8 remaining stories × 15 minutes = ~2 hours of manual work vs. $4.28 via API

## Script

A new script was written for this evaluation:

```
scripts/generate-images-openai.py
```

It reads the same `<details><summary>Image Prompt</summary>...</details>` blocks from story markdown files that the Gemini script uses — no prompt modifications needed. Supports `--quality low|medium|high`, `--first-only`, `--skip-existing`, and `--crop-16-9` flags.

## Recommendation

For the remaining 8 stories (91 images), use **OpenAI gpt-image-1 at medium quality**:

```bash
export OPENAI_API_KEY="your-key-here"
for dir in hedy-lamarr maurice-hilleman hannah-arendt katalin-kariko galileo-galilei andreas-vesalius charles-darwin mary-anning; do
  python3 scripts/generate-images-openai.py docs/stories/$dir --quality medium --skip-existing
done
```

Estimated cost: **$4.28** for 91 images (~$0.047 each).
Estimated time: ~40 minutes (91 images × ~25s each).

Alternatively, generate manually via ChatGPT Plus for $0.00 additional cost but ~2 hours of manual work.
