# Image Generation Log: alice-stewart

**Run date:** 2026-04-05  
**Run started:** 2026-04-05T17:51:47-05:00  
**Run finished:** 2026-04-05T17:53:08-05:00  
**Total wall-clock:** 80.9 seconds (1.3 minutes)  
**Story directory:** `docs/stories/alice-stewart`  
**Source index:** `docs/stories/alice-stewart/index.md`  
**Model:** `gemini-2.5-flash-image`  
**Aspect ratio:** `16:9` (native, no post-processing)  
**Rate limit:** 10 RPM  
**Rate-limiter total sleep:** 2.0 seconds  
**CLI flags:** (none)

## Summary

- **Images generated:** 13
- **Total input tokens:** 2,692
- **Total output tokens:** 16,770
- **Total tokens:** 19,462
- **Total PNG payload:** 24,251,589 bytes (23.13 MB)
- **Sum of per-image wall-clock:** 78.4 seconds
- **Paid-tier cost:** $0.5039
- **Free-tier quota used:** 13/500 (2.6% of one day)
- **Actual cost on free tier:** $0.00

## Per-Image Details

| # | File | Dimensions | Size (bytes) | Tokens in | Tokens out | Total tokens | Wall-clock (s) | Paid cost (USD) |
|---|------|------------|--------------|-----------|------------|--------------|----------------|-----------------|
| 1 | `cover.png` | 1344x768 | 1,623,261 | 307 | 1290 | 1597 | 5.8 | $0.0388 |
| 2 | `panel-01.png` | 1344x768 | 2,051,490 | 244 | 1290 | 1534 | 5.7 | $0.0388 |
| 3 | `panel-02.png` | 1344x768 | 2,117,493 | 198 | 1290 | 1488 | 6.0 | $0.0388 |
| 4 | `panel-03.png` | 1344x768 | 1,918,987 | 196 | 1290 | 1486 | 5.7 | $0.0388 |
| 5 | `panel-04.png` | 1344x768 | 1,805,030 | 171 | 1290 | 1461 | 5.5 | $0.0388 |
| 6 | `panel-05.png` | 1344x768 | 1,775,037 | 189 | 1290 | 1479 | 6.3 | $0.0388 |
| 7 | `panel-06.png` | 1344x768 | 2,098,296 | 207 | 1290 | 1497 | 5.4 | $0.0388 |
| 8 | `panel-07.png` | 1344x768 | 2,068,047 | 195 | 1290 | 1485 | 7.6 | $0.0388 |
| 9 | `panel-08.png` | 1344x768 | 1,709,694 | 192 | 1290 | 1482 | 6.0 | $0.0388 |
| 10 | `panel-09.png` | 1344x768 | 1,880,018 | 199 | 1290 | 1489 | 6.4 | $0.0388 |
| 11 | `panel-10.png` | 1344x768 | 1,795,286 | 192 | 1290 | 1482 | 5.8 | $0.0388 |
| 12 | `panel-11.png` | 1344x768 | 1,642,855 | 197 | 1290 | 1487 | 6.6 | $0.0388 |
| 13 | `panel-12.png` | 1344x768 | 1,766,095 | 205 | 1290 | 1495 | 5.8 | $0.0388 |

## Prompt Excerpts

First ~160 characters of each prompt, for provenance:

1. **`cover.png`** — Please generate a wide-landscape 16:9 cover image for a graphic novel titled "The Doctor Who Wouldn't Let Go" in mid-century British editorial illustration styl
2. **`panel-01.png`** — I am about to ask you to generate a series of images for a graphic novel. Please make the images have a consistent style and consistent characters. Do not ask a
3. **`panel-02.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 2 of 12. Make the characters and style consistent with the prio
4. **`panel-03.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 3 of 12. Make the characters and style consistent with the prio
5. **`panel-04.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 4 of 12. Make the characters and style consistent with the prio
6. **`panel-05.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 5 of 12. Make the characters and style consistent with the prio
7. **`panel-06.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 6 of 12. Make the characters and style consistent with the prio
8. **`panel-07.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 7 of 12. Make the characters and style consistent with the prio
9. **`panel-08.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 8 of 12. Make the characters and style consistent with the prio
10. **`panel-09.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 9 of 12. Make the characters and style consistent with the prio
11. **`panel-10.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 10 of 12. Make the characters and style consistent with the pri
12. **`panel-11.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 11 of 12. Make the characters and style consistent with the pri
13. **`panel-12.png`** — Please generate a 16:9 image in mid-century British editorial illustration style depicting panel 12 of 12, blended with a subtle modern overlay. The composition

## Notes

- Token counts and costs come directly from `response.usage_metadata` on each API response.
- All images returned at native 16:9 via `types.ImageConfig(aspect_ratio="16:9")`. No post-processing.
- Free-tier rate limits: 10 RPM, 500 RPD, ~250,000 TPM. This run used 13 of 500 daily requests.
- The machine-readable JSONL equivalent of this log lives at `logs/image-generation-usage.jsonl`.
