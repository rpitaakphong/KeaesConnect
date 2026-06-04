import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide07(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Absolute Value Inequalities", section: "Inside vs outside", sectionColor: C.teal });
  panel(slide, ctx, 64, 190, 520, 340);
  heading(slide, ctx, "Main ideas", 94, 220, 420, C.teal);
  body(slide, ctx, "|A| < c  means  -c < A < c\n\n|A| ≤ c  means  -c ≤ A ≤ c\n\n|A| > c  means  A > c or A < -c\n\n|A| ≥ c  means  A ≥ c or A ≤ -c", 94, 276, 420, 190, { size: 24 });
  panel(slide, ctx, 640, 190, 520, 340);
  heading(slide, ctx, "Example 4", 670, 220, 420, C.blue);
  formula(slide, ctx, "|2x - 1| ≤ 5", 690, 268, 420, 62, { size: 29 });
  body(slide, ctx, "-5 ≤ 2x - 1 ≤ 5\n\n-4 ≤ 2x ≤ 6\n\n-2 ≤ x ≤ 3", 704, 350, 390, 120, { size: 25, align: "center" });
  answer(slide, ctx, "-2 ≤ x ≤ 3", 400, 590, 480, 70);
  footer(slide, ctx, 7);
  return slide;
}
