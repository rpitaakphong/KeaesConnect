import { addBase, answer, body, C, footer, heading, panel } from "./common.mjs";

export async function slide13(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Quick Teacher Assessment Check", section: "Exit questions", sectionColor: C.green });
  panel(slide, ctx, 64, 196, 526, 360);
  heading(slide, ctx, "Exit questions", 94, 228, 430, C.green);
  body(slide, ctx, "1. Solve |x - 7| = 2\n\n2. Solve |3x + 1| < 4\n\n3. What are the roots of (x - 2)(x + 1)(x - 5)?\n\n4. State one feature of y = |f(x)| compared with y = f(x).", 94, 286, 430, 190, { size: 24 });
  panel(slide, ctx, 650, 196, 526, 360, { fill: "#FBFCFD" });
  heading(slide, ctx, "Answers", 680, 228, 430, C.blue);
  body(slide, ctx, "1. x = 5, 9\n\n2. -5/3 < x < 1\n\n3. x = 2, -1, 5\n\n4. Negative parts are reflected above the x-axis.", 680, 286, 430, 190, { size: 24 });
  answer(slide, ctx, "Use answers to decide support, consolidation, or challenge next.", 270, 594, 740, 66);
  footer(slide, ctx, 13);
  return slide;
}
