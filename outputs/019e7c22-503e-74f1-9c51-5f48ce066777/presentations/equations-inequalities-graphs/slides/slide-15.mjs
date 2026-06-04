import { addBase, body, C, footer, heading, panel } from "./common.mjs";

export async function slide15(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Marking Guidance and Differentiation", section: "Teacher support", sectionColor: C.amber });
  panel(slide, ctx, 64, 188, 342, 370);
  heading(slide, ctx, "Credit for", 94, 220, 260, C.green);
  body(slide, ctx, "• correct case splitting\n• accurate algebra\n• useful substitution\n• roots and intercepts\n• interval or union notation\n• checks where needed", 94, 276, 260, 176, { size: 22 });
  panel(slide, ctx, 470, 188, 342, 370);
  heading(slide, ctx, "Common errors", 500, 220, 260, C.coral);
  body(slide, ctx, "• treating |A| as negative\n• giving one modulus answer\n• keeping invalid substitution roots\n• sketching without intercepts\n• confusing < with ≤", 500, 276, 260, 170, { size: 22 });
  panel(slide, ctx, 876, 188, 342, 370);
  heading(slide, ctx, "Differentiation", 906, 220, 260, C.blue);
  body(slide, ctx, "Support:\nnumber lines, templates, marked roots\n\nChallenge:\njustify intervals, both-side modulus, non-zero cubic thresholds", 906, 276, 250, 190, { size: 21 });
  body(slide, ctx, "Keep the exam focus: method marks come from readable reasoning, not just final answers.", 180, 616, 920, 32, { size: 20, color: C.muted, align: "center" });
  footer(slide, ctx, 15);
  return slide;
}
