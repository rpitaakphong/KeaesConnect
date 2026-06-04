import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide04(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Variables on Both Sides", section: "Check first", sectionColor: C.amber });
  formula(slide, ctx, "|3x + 1| = 2x + 7", 360, 178, 560, 72, { size: 32 });
  panel(slide, ctx, 64, 302, 330, 250);
  heading(slide, ctx, "1. RHS must work", 94, 332, 250, C.amber);
  body(slide, ctx, "2x + 7 ≥ 0\n\nThis matters because |A| can never be negative.", 94, 386, 260, 110, { size: 23 });
  panel(slide, ctx, 472, 302, 330, 250);
  heading(slide, ctx, "2. Split cases", 502, 332, 250, C.blue);
  body(slide, ctx, "3x + 1 = 2x + 7\n⇒ x = 6\n\n3x + 1 = -(2x + 7)\n⇒ 5x = -8\n⇒ x = -8/5", 502, 382, 260, 138, { size: 22 });
  panel(slide, ctx, 880, 302, 330, 250);
  heading(slide, ctx, "3. Check", 910, 332, 250, C.teal);
  body(slide, ctx, "Both values make\n2x + 7 ≥ 0,\nso both are valid.", 910, 390, 250, 100, { size: 23 });
  answer(slide, ctx, "x = 6,  -8/5", 400, 594, 480, 68);
  footer(slide, ctx, 4);
  return slide;
}
