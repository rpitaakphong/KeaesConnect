import { addBase, answer, body, C, footer, formula, heading, panel } from "./common.mjs";

export async function slide10(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "A Cleaner Exam-Style Substitution", section: "Exponential form", sectionColor: C.teal });
  formula(slide, ctx, "e²ˣ - 7eˣ + 10 = 0", 390, 178, 500, 72, { size: 32 });
  panel(slide, ctx, 126, 308, 300, 204);
  heading(slide, ctx, "1. Let", 156, 338, 220, C.teal);
  body(slide, ctx, "u = eˣ\n\nu² - 7u + 10 = 0", 156, 390, 220, 86, { size: 26 });
  panel(slide, ctx, 490, 308, 300, 204);
  heading(slide, ctx, "2. Factorise", 520, 338, 220, C.blue);
  body(slide, ctx, "(u - 5)(u - 2) = 0\n\nu = 5 or u = 2", 520, 390, 220, 86, { size: 24 });
  panel(slide, ctx, 854, 308, 300, 204);
  heading(slide, ctx, "3. Back to x", 884, 338, 220, C.amber);
  body(slide, ctx, "eˣ = 5 ⇒ x = ln 5\n\neˣ = 2 ⇒ x = ln 2", 884, 390, 220, 86, { size: 23 });
  answer(slide, ctx, "x = ln 2,  ln 5", 400, 594, 480, 68);
  footer(slide, ctx, 10);
  return slide;
}
