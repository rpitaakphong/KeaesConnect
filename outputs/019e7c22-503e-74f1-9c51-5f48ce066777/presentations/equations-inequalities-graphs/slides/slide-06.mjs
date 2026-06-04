import { addBase, answer, body, C, footer, heading, panel } from "./common.mjs";

export async function slide06(presentation, ctx) {
  const slide = addBase(presentation, ctx, { title: "Practice 1: Guided Questions", section: "Pair work", sectionColor: C.green });
  panel(slide, ctx, 64, 206, 390, 330);
  heading(slide, ctx, "Try these", 94, 238, 300, C.green);
  body(slide, ctx, "1. |x + 6| = 4\n\n2. |5x - 2| = 3x + 4\n\n3. |x - 1| = |x + 5|", 94, 294, 300, 170, { size: 27 });
  panel(slide, ctx, 510, 206, 680, 330, { fill: "#FBFCFD" });
  heading(slide, ctx, "Answers", 540, 238, 580, C.blue);
  body(slide, ctx, "1. x = -2, -10\n\n2. x = 3, -1/4  (both valid after checking)\n\n3. x = -2  (the same-sign case is impossible)", 540, 294, 570, 168, { size: 26 });
  answer(slide, ctx, "Exam habit: show checks when variables appear outside modulus bars.", 230, 586, 820, 66);
  footer(slide, ctx, 6);
  return slide;
}
