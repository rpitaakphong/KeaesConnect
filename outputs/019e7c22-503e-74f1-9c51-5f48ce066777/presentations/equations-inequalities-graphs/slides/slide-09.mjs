import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide09(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Substitution into Related Equations", section: "Pattern spotting", sectionColor: C.amber });
  formula(slide, ctx, "(x² - 5x)² - 6(x² - 5x) - 16 = 0", 180, 178, 920, 72, { size: 30 });
  panel(slide, ctx, 64, 302, 330, 250);
  heading(slide, ctx, "1. Substitute", 94, 332, 250, C.amber);
  body(slide, ctx, "Let u = x² - 5x\n\nThen:\nu² - 6u - 16 = 0", 94, 386, 250, 120, { size: 24 });
  panel(slide, ctx, 472, 302, 330, 250);
  heading(slide, ctx, "2. Solve u", 502, 332, 250, C.blue);
  body(slide, ctx, "(u - 8)(u + 2) = 0\n\nu = 8 or u = -2", 502, 392, 250, 100, { size: 25 });
  panel(slide, ctx, 880, 302, 330, 250);
  heading(slide, ctx, "3. Substitute back", 910, 332, 250, C.teal);
  body(slide, ctx, "x² - 5x = 8\nor\nx² - 5x = -2", 910, 400, 250, 98, { size: 25 });
  answer(slide, ctx, "x = (5 ± √57)/2,  (5 ± √17)/2", 306, 594, 668, 68);
  footer(slide, ctx, 9);
  return slide;
}
