# Token Usage Report: Chapter Content Generation

**Date:** 2026-04-02
**Skill:** Chapter Content Generator v0.07
**Model:** Claude Opus 4.6 (1M context)
**Execution Mode:** Sequential

## Per-Chapter Summary

| Ch | Title | Words | Concepts | Tokens | Tool Uses | Elapsed | Notes |
|----|-------|------:|:--------:|-------:|----------:|--------:|-------|
| 4 | Knowledge and the Knower | 5,894 | 18 | 33,800 | 7 | 3m 42s | |
| 5 | Cognitive Biases | 5,393 | 17 | 34,600 | 13 | 3m 50s | |
| 6 | Reasoning and Argumentation | 4,968 | 24 | 32,100 | 7 | 3m 11s | |
| 7 | Knowledge and Language | 4,833 | 11 | 29,100 | 11 | 3m 36s | |
| 8 | Skepticism and Intellectual Virtues | 4,993 | 16 | 29,800 | 12 | 3m 32s | |
| 9 | Areas of Knowledge and Mathematics | 5,367 | 19 | 33,600 | 7 | 3m 22s | |
| 10 | Natural Sciences and Scientific Method | 5,120 | 23 | 29,600 | 8 | 3m 10s | |
| 11 | Human Sciences and History | 5,542 | 16 | 31,100 | 11 | 3m 42s | Retry after timeout (1st attempt: 30m 34s, 0 tokens) |
| 12 | The Arts as Knowledge | 6,081 | 10 | ~30,000 | 6 | 3m 26s | Token count not reported (rate limit hit after completion) |
| 13 | Ethics and Values in Knowledge | 5,076 | 15 | 31,400 | 7 | 3m 00s | |
| 14 | Knowledge, Technology, and Power | 4,877 | 19 | 41,800 | 35 | 7m 25s | High tool use count |
| 15 | Misinformation and the Information Age | 5,705 | 25 | 36,300 | 9 | 3m 52s | |
| 16 | TOK Assessment and Synthesis | 5,529 | 13 | 30,900 | 9 | 3m 31s | |
| **Total** | | **69,378** | **226** | **~424,200** | **142** | **~49m 19s** | |

## Aggregate Statistics

| Metric | Value |
|--------|-------|
| Total chapters generated | 13 |
| Total words produced | 69,378 |
| Total agent tokens (successful runs) | ~424,200 |
| Average tokens per chapter | ~32,600 |
| Average words per chapter | 5,337 |
| Average elapsed time per chapter | 3m 47s |
| Total agent elapsed time | ~49m 19s |
| Total wall-clock time (incl. timeout + rate limit pause) | 2h 3m 28s |
| Words produced per 1k tokens | ~163 |
| Tool uses (total across all agents) | 142 |

## Efficiency Notes

- **Chapter 11** timed out on the first attempt (30m 34s, no output). The retry succeeded in 3m 42s. The timeout consumed wall-clock time but no tokens were billed (0 tokens reported).
- **Chapter 12** completed successfully but hit the rate limit immediately after. Token count was not reported by the agent; estimated at ~30k based on comparable chapters.
- **Chapter 14** used significantly more tool uses (35) and tokens (41.8k) than average, likely due to the agent iterating more on content structure. Elapsed time was also the longest at 7m 25s.
- **Rate limit pause** between chapters 12 and 13 lasted approximately 42 minutes (11:18 to 12:00).

## Cost Estimate

At Opus 4.6 pricing (~$15/M input, ~$75/M output tokens):

- Agent tokens are a mix of input and output. Assuming a typical 70/30 input/output split:
  - Input tokens: ~297,000 x $15/M = ~$4.46
  - Output tokens: ~127,000 x $75/M = ~$9.53
- **Estimated agent cost: ~$14.00**
- Parent conversation overhead (setup, context reads, coordination): ~$5-8
- **Estimated total session cost: ~$19-22**

This produced 69,378 words of educational content at roughly **$0.29 per 1,000 words**.
