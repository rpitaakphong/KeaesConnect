import { addBase, addCubicGraph, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide11(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Cubic Graphs from Three Linear Factors", section: "Sketch features", sectionColor: C.teal });
  panel(slide, ctx, 64, 178, 470, 412);
  heading(slide, ctx, "Useful features", 94, 210, 360, C.teal);
  formula(slide, ctx, "f(x) = (x - a)(x - b)(x - c)", 94, 260, 380, 64, { size: 24 });
  body(slide, ctx, "• x-intercepts at x = a, b, c\n• y-intercept from x = 0\n• Positive leading coefficient:\n  down on the left, up on the right", 94, 356, 380, 134, { size: 23 });
  formula(slide, ctx, "y = (x - 1)(x + 2)(x - 3)", 94, 512, 380, 56, { size: 22, color: C.blue });
  await addCubicGraph(slide, ctx, 604, 188, 560, 340);
  answer(slide, ctx, "Roots: -2, 1, 3     y-intercept: 6", 330, 604, 620, 62);
  footer(slide, ctx, 11);
  return slide;
}
