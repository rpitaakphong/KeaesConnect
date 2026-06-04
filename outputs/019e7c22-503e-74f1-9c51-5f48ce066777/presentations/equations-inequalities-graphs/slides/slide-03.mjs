import { addBase, answer, body, C, footer, formula, heading, note, panel } from "./common.mjs";

export async function slide03(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Absolute Value Equations: Core Idea", section: "Rule", sectionColor: C.teal });
  formula(slide, ctx, "For c ≥ 0:\n|A| = c  ⇒  A = c  or  A = -c", 130, 200, 1020, 104, { size: 31, bold: true, color: C.teal });
  panel(slide, ctx, 64, 348, 520, 212);
  heading(slide, ctx, "Example 1", 94, 376, 420, C.blue);
  formula(slide, ctx, "|2x - 3| = 7", 94, 418, 420, 74, { size: 30 });
  panel(slide, ctx, 640, 348, 512, 212);
  heading(slide, ctx, "Two cases", 670, 376, 420, C.blue);
  body(slide, ctx, "2x - 3 = 7  ⇒  x = 5\n\n2x - 3 = -7  ⇒  x = -2", 670, 422, 420, 100, { size: 26 });
  answer(slide, ctx, "x = -2, 5", 400, 596, 480, 68);
  note(slide, ctx, "Ask why there are two answers: absolute value means distance.", 840, 100, 310, 80);
  footer(slide, ctx, 3);
  return slide;
}
