import { addBase, addVGraph, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide08(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Absolute Value Inequalities with Graphs", section: "Read the regions", sectionColor: C.blue });
  panel(slide, ctx, 64, 190, 470, 390);
  heading(slide, ctx, "Example 5", 94, 220, 360, C.blue);
  formula(slide, ctx, "|x - 2| > 3", 104, 270, 390, 64, { size: 30 });
  body(slide, ctx, "Algebraic method:\n\nx - 2 > 3  or  x - 2 < -3\n\nx > 5  or  x < -1", 104, 366, 380, 145, { size: 25 });
  await addVGraph(slide, ctx, 604, 194, 560, 348);
  answer(slide, ctx, "x < -1  or  x > 5", 400, 596, 480, 68);
  body(slide, ctx, "Graph idea: choose the outside regions above y = 3.", 604, 552, 560, 26, { size: 18, color: C.muted, align: "center" });
  footer(slide, ctx, 8);
  return slide;
}
