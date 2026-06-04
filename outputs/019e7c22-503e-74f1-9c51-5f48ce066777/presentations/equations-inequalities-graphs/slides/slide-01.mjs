import { addBase, answer, body, C, footer, heading, note, panel } from "./common.mjs";

export async function slide01(presentation, ctx) {
  const slide = addBase(presentation, ctx, { kicker: "Topic 4", title: "Equations, Inequalities and Graphs" });
  body(slide, ctx, "Cambridge IGCSE Additional Mathematics 0606 · 2028-2030", 64, 152, 760, 30, { size: 20, color: C.muted });
  panel(slide, ctx, 64, 220, 520, 270);
  heading(slide, ctx, "Learning goals", 94, 248, 440, C.blue);
  body(slide, ctx, "• Solve equations involving absolute value\n• Solve absolute value inequalities\n• Use substitution to solve related equations\n• Sketch cubic graphs from three linear factors\n• Solve cubic inequalities from a graph or algebraically", 94, 292, 450, 160, { size: 21 });
  panel(slide, ctx, 640, 220, 520, 270);
  heading(slide, ctx, "Success criteria", 670, 248, 440, C.teal);
  body(slide, ctx, "I can split an absolute value equation into cases.\n\nI can choose a useful substitution.\n\nI can identify x-intercepts and turning behaviour.\n\nI can read inequality solutions from graphs.", 670, 292, 450, 175, { size: 20 });
  answer(slide, ctx, "Lesson focus: connect algebraic method with graph interpretation.", 208, 540, 864, 76);
  note(slide, ctx, "Keep returning to the link between a symbolic answer and what it means on a graph.", 840, 98, 320, 82);
  footer(slide, ctx, 1);
  return slide;
}
