import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide05(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Absolute Value Equals Absolute Value", section: "Shortcut", sectionColor: C.blue });
  formula(slide, ctx, "|x - 4| = |2x + 1|", 360, 178, 560, 72, { size: 32 });
  panel(slide, ctx, 96, 300, 480, 230);
  heading(slide, ctx, "Same sign", 126, 330, 360, C.blue);
  body(slide, ctx, "x - 4 = 2x + 1\n\n⇒ x = -5", 126, 385, 380, 95, { size: 29 });
  panel(slide, ctx, 704, 300, 480, 230);
  heading(slide, ctx, "Opposite sign", 734, 330, 360, C.teal);
  body(slide, ctx, "x - 4 = -(2x + 1)\n\n⇒ 3x = 3\n⇒ x = 1", 734, 385, 380, 110, { size: 27 });
  answer(slide, ctx, "x = -5, 1", 400, 594, 480, 68);
  body(slide, ctx, "Equal absolute values usually mean same sign or opposite sign.", 248, 548, 784, 28, { size: 20, color: C.muted, align: "center" });
  footer(slide, ctx, 5);
  return slide;
}
