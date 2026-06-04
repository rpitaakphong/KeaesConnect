import { addBase, body, C, footer, heading, panel } from "./common.mjs";

export async function slide02(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Starter: Quick Recall", section: "Warm-up", sectionColor: C.blue });
  panel(slide, ctx, 64, 210, 512, 370);
  heading(slide, ctx, "Questions", 94, 242, 420, C.blue);
  body(slide, ctx, "1. What does |x| mean?\n2. When is |x| = 5?\n3. When is |x| = 0?\n4. What is the graph of y = |x| shaped like?\n5. What happens when we draw y = |f(x)|?", 94, 292, 430, 230, { size: 24 });
  panel(slide, ctx, 640, 210, 512, 370, { fill: "#FBFCFD" });
  heading(slide, ctx, "Answers", 670, 242, 420, C.teal);
  body(slide, ctx, "1. Distance from 0; always non-negative\n2. x = 5 or x = -5\n3. x = 0\n4. A V-shape\n5. Negative parts reflect above the x-axis", 670, 292, 420, 230, { size: 24 });
  body(slide, ctx, "Use mini whiteboards for fast confidence checks.", 64, 612, 700, 30, { size: 19, color: C.muted });
  footer(slide, ctx, 2);
  return slide;
}
