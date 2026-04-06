# Stories: Remaining Image Generation

## Status (2026-04-06)

78 images were generated on April 5 before hitting the Gemini API spending cap ($10/month). 91 images remain across 8 stories.

### Stories with images complete

- Ignaz Semmelweis (13 images)
- Rachel Carson (13 images)
- Ida B. Wells (13 images)
- Alice Stewart (13 images)
- Carl Sagan (13 images)
- Marie Colvin (13 images)

### Stories needing images (0/13 each)

- Hedy Lamarr
- Maurice Hilleman
- Hannah Arendt
- Katalin Karikó
- Galileo Galilei
- Andreas Vesalius
- Charles Darwin
- Mary Anning

## How to generate the remaining images

### Step 1: Raise the spending cap

1. Go to <https://aistudio.google.com/spend>
2. Select project **"Generate Graphic Novel Images"** from the dropdown
3. Click **"Edit spend cap"**
4. Change from `$10` to `$15` (91 images x $0.039 = ~$3.55 additional)
5. Click **Save**

### Step 2: Run the image generation script

Make sure the environment variable is set (it should already be in `~/.zshrc`):

```bash
export GEMINI_API_KEY="AIzaSyAoOvqD5uFGQMr2xHY6EHMEILJfRAoJqV8"
```

Then generate all remaining images:

```bash
for dir in hedy-lamarr maurice-hilleman hannah-arendt katalin-kariko galileo-galilei andreas-vesalius charles-darwin mary-anning; do
  python3 ~/.claude/skills/story-generator/scripts/generate-images.py \
    docs/stories/$dir --skip-existing
done
```

This takes approximately 12 minutes (91 images at 10 RPM).

### Step 3: Verify all images

```bash
for dir in hedy-lamarr maurice-hilleman hannah-arendt katalin-kariko galileo-galilei andreas-vesalius charles-darwin mary-anning; do
  echo "--- $dir ---"
  python3 ~/.claude/skills/story-generator/scripts/verify-images.py docs/stories/$dir
done
```

Every story should report `PASS: all 13 images present and matching 16:9`.

### Step 4: Handle any safety-filter failures

If any image is blocked by Gemini's safety filter:

1. Open the story's `index.md`
2. Find the blocked panel's `<details><summary>Image Prompt</summary>` block
3. Soften trigger words (see examples in the skill docs under "Safety Filter Patterns")
4. Rerun with `--skip-existing` — only the missing panel regenerates

### Notes

- The API key uses the **"Generate Graphic Novel Images"** project on Tier 1 Postpay billing
- The free-tier projects (Theory of Knowledge Book, Test Project 2) have zero quota for `gemini-2.5-flash-preview-image` — they cannot generate images
- The spending cap resets on the 1st of each month (PST)
- All story markdown files and mkdocs navigation are already complete — only the PNG files are missing
