# KS2 Science Progress Test 1: audit fixes

The test retains 37 question parts, 40 marks, the existing response formats and the original partial-credit bands. This change fixes presentation and local/demo marking. Live Supabase grading, test registration and saved results are outside this change.

## Behavior

- The KS2 sections opt into `visualPlacement: "perQuestion"`. Every part keeps its own diagrams and tables; other tests retain the shared-image default.
- Each group displays its source introduction. The ramp investigation states that height is varied, and the shadow question includes the original 9 am reference.
- Question 8(b) accepts either complete relationship, taller/longer or shorter/shorter, through the existing sequence-group grader. Mixed or incomplete combinations earn no mark.
- Question 8(c) uses an explicit inclusive numeric range of 21-26 minutes. Finite decimal responses such as `23.0` and `23.5` work; empty, malformed and out-of-range responses do not. Questions without the new `numericRange` metadata retain their existing marking behavior.
- Scoped KS2 grid sizing keeps the figures inside question cards, and the 8(d) option graphs use readable sizes.

## Verification

- `npm run verify:ks2-science`: 297 original audit cases and 21 additional edge cases pass; the primary response set scores 40/40 and blanks score zero. This check also runs before every build, including Netlify builds.
- All nine 8(b) combinations, numeric boundaries and invalid inputs, and the partial-credit bands for 4(d), 6(e) and 7(b) are covered.
- `node scripts/verify-diagnostic-keys.mjs`: the existing 53-part diagnostic scores 80/80 and passes its 21 regression cases.
- Type checking, lint and the production build pass.
- All eight KS2 sections were checked at 1440x900, 768x1024 and 390x844. All expected assets load, all eight introductions appear, and neither the page nor question cards overflow horizontally.
- A browser demo submission with shorter/shorter for 8(b) and `23.5` for 8(c) scores 2/40, with the other 35 parts blank. No database is used.
- SPIP Year 8 Science still displays four shared image groups and their introductions in its first section. The Combined Science diagnostic still displays three groups and four shared images in its first section.

## Before and after

Before: the graph-reading question has no graph.

![Before: missing candle graph](ks2-science-evidence/candles-before.png)

After: the graph is displayed beside question 8(c).

![After: restored candle graph](ks2-science-evidence/candles-after.png)

The restored shadow question includes the morning reference and all four intact alternatives.

![After: restored shadow reference and choices](ks2-science-evidence/shadows-after.png)

## Source provenance

The original paper is the Standards and Testing Agency's 2012 KS2 Science Sampling Test B, STA/12/5593. The answer reference is STA/12/5591, printed pages 20-35. Crown copyright 2012; the original publication permits reuse under the Open Government Licence.

- [Question paper, clean redistribution](https://www.sats-papers.co.uk/sats-papers/ks2/science/2012/ks2-science-2012-test-b.pdf)
- [Original mark scheme](https://primarytools.co.uk/files/Tests/KS2/science2012/PrimaryTools.co.uk-2012SciKS2MarkScheme.pdf)

The two shadow assets were re-extracted from page 14 rendered with Poppler at 1800 pixels high. Crop bounds in the 1273x1800 page image are `(650, 230, 960, 468)` for the morning reference and `(180, 715, 1035, 1295)` for the choices. No new diagrams were generated, and the official top-left key is retained.

Review the deployment linked by Netlify on the pull request with `assignment=demo`. Production and the repository's approval rules remain unchanged until the user reviews and approves a merge.
