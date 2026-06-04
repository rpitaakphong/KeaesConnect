import { addBase, body, C, footer, heading, panel } from "./common.mjs";

export async function slide14(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Student Worksheet Mini-Practice", section: "Independent work", sectionColor: C.blue });
  panel(slide, ctx, 64, 184, 536, 392);
  heading(slide, ctx, "Questions", 94, 216, 430, C.blue);
  body(slide, ctx, "1. Solve |4x - 9| = 11\n2. Solve |2x + 3| = x + 8\n3. Solve |x - 4| ≤ 6\n4. Solve e²ˣ - 3eˣ - 4 = 0\n5. If g(x) = (x - 2)(x + 1)(x - 4), state the x-intercepts.\n6. Solve (x - 2)(x + 1)(x - 4) > 0", 94, 272, 444, 190, { size: 21 });
  panel(slide, ctx, 660, 184, 536, 392, { fill: "#FBFCFD" });
  heading(slide, ctx, "Answers", 690, 216, 430, C.teal);
  body(slide, ctx, "1. x = 5, -1/2\n2. x = 5, -5/3\n3. -2 ≤ x ≤ 10\n4. x = ln 4\n5. x = 2, -1, 4\n6. (-1, 2) ∪ (4, ∞)", 690, 272, 430, 176, { size: 23 });
  body(slide, ctx, "Mark for method: case splitting, valid substitution, roots/intercepts, and correct interval notation.", 168, 616, 944, 32, { size: 20, color: C.muted, align: "center" });
  footer(slide, ctx, 14);
  return slide;
}
