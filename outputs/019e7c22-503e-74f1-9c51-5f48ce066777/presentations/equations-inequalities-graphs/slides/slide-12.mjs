import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide12(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Modulus of a Cubic and Cubic Inequalities", section: "Graph comparison", sectionColor: C.blue });
  panel(slide, ctx, 64, 190, 520, 350);
  heading(slide, ctx, "Modulus of a cubic", 94, 220, 430, C.blue);
  body(slide, ctx, "To sketch y = |f(x)|:\n\n• keep parts of f(x) above the x-axis\n• reflect parts below the x-axis upward\n• x-intercepts stay the same", 94, 282, 420, 152, { size: 25 });
  formula(slide, ctx, "f(x) = (x + 1)(x - 2)(x - 4)", 104, 464, 400, 54, { size: 21, color: C.teal });
  panel(slide, ctx, 640, 190, 520, 350);
  heading(slide, ctx, "Cubic inequality", 670, 220, 430, C.teal);
  formula(slide, ctx, "(x - 1)(x + 1)(x - 3) ≤ 0", 690, 270, 420, 60, { size: 23 });
  body(slide, ctx, "Roots: -1, 1, 3\n\nFor positive leading coefficient, signs alternate:\nnegative, positive, negative, positive", 690, 354, 420, 126, { size: 22 });
  answer(slide, ctx, "x ∈ (-∞, -1] ∪ [1, 3]", 378, 594, 524, 68);
  footer(slide, ctx, 12);
  return slide;
}
