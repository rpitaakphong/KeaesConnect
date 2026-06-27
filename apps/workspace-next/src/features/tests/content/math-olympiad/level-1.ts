import { field, mathMultiChoice, mathQ, mathTest } from "@/features/tests/content/math-olympiad/helpers";

const shape = (value: string, label: string, visualHtml: string) => ({ value, label, visualHtml });

export const mathOlympiad1 = mathTest("math-olympiad-1", "Math Olympiad Level 1", "Math Olympiad 1", [
  {
    id: "part1",
    label: "Part I",
    title: "Numbers, addition, subtraction, and shapes",
    hint: "Write or choose the answers shown by each picture.",
    questions: [
      mathQ("mo1", 1, 1, "What are the missing numbers?", [
        field("a", "4, ___, 6", 0.34, ["5"]),
        field("b", "6, ___, 8", 0.33, ["7"]),
        field("c", "8, ___", 0.33, ["9"]),
      ], { visualHtml: numberPathVisual() }),
      mathQ("mo1", 2, 1, "Complete the number bond.", [
        field("top", "Top number bond answer", 0.5, ["3"]),
        field("bottom", "Bottom number bond answer", 0.5, ["1"]),
      ], { visualHtml: numberBondVisual() }),
      mathQ("mo1", 3, 2, "There are 5 oranges. Add 3 more oranges.", [
        field("equation", "5 + 3 =", 1, ["8"]),
        field("total", "There are ___ oranges altogether.", 1, ["8"]),
      ], { visualHtml: objectsVisual("orange", 5, 3) }),
      mathQ("mo1", 4, 2, "There are 5 cakes. 2 cakes are burnt. Fill in the blanks.", [
        field("equation", "5 - 2 =", 1, ["3"]),
        field("left", "There are ___ cakes left.", 1, ["3"]),
      ], { visualHtml: objectsVisual("cake", 5, 2) }),
      mathMultiChoice("mo1", 5, 2, "Colour the shapes that match the name on the left: Square.", [
        shape("triangle", "Triangle", polygon("150,25 260,190 40,190")),
        shape("upright-square", "Square", rectSvg(50, 50, 160, 160)),
        shape("rectangle", "Rectangle", rectSvg(25, 75, 220, 110)),
        shape("tilted-square", "Tilted square", `<svg viewBox="0 0 300 220" role="img" aria-label="Tilted square"><rect width="300" height="220" fill="#fff"/><rect x="82" y="42" width="135" height="135" transform="rotate(45 150 110)" fill="#e9fbf8" stroke="#213b4d" stroke-width="8"/></svg>`),
        shape("circle", "Circle", `<svg viewBox="0 0 300 220" role="img" aria-label="Circle"><rect width="300" height="220" fill="#fff"/><circle cx="150" cy="110" r="75" fill="#e9fbf8" stroke="#213b4d" stroke-width="8"/></svg>`),
        shape("upside-down-triangle", "Upside-down triangle", polygon("40,30 260,30 150,195")),
      ], ["upright-square", "tilted-square"]),
    ],
  },
  {
    id: "part2",
    label: "Part II",
    title: "Position, word problems, measuring, and comparing",
    hint: "Use the diagrams to answer each question.",
    questions: [
      mathQ("mo1", 6, 2, "Fill in the blanks.", [
        field("a", "Which triangle is 5th from the left?", 1, ["E"]),
        field("b", "Which triangle is 3rd from the right?", 1, ["D"]),
      ], { visualHtml: triangleRowVisual() }),
      mathQ("mo1", 7, 2, "Siti has 14 beads. She buys 2 more beads. How many beads does she have now?", [
        field("first", "First addend", 0.4, ["14"]),
        field("operator", "Operator", 0.4, ["+"]),
        field("second", "Second addend", 0.4, ["2"]),
        field("result", "Equation result", 0.4, ["16"]),
        field("final", "Siti has ___ beads now.", 0.4, ["16"]),
      ], { visualHtml: beadVisual() }),
      mathQ("mo1", 8, 2, "Compare the lengths of the pencils.", [
        field("a", "Pencil ___ is the longest.", 1, ["B"]),
        field("b", "Pencil C is as long as Pencil ___.", 1, ["A"]),
      ], { visualHtml: pencilVisual() }),
      mathQ("mo1", 9, 2, "Fill in the blanks.", [
        field("a", "1 more than 5 is", 1, ["6"]),
        field("b", "1 less than 7 is", 1, ["6"]),
      ]),
      mathQ("mo1", 10, 3, "The graph shows the books on Meiling's bookshelf.", [
        field("a", "Chinese Literature books", 0.75, ["7"]),
        field("b1", "First same book category", 0.38, ["English Literature", "English"]),
        field("b2", "Second same book category", 0.37, ["Bedtime story", "Bedtime"]),
        field("c", "Fewer Malay Literature books than Chinese Literature books", 0.75, ["3"]),
        field("d", "Books altogether", 0.75, ["17"]),
      ], { visualHtml: bookGraphVisual() }),
    ],
  },
  {
    id: "part3",
    label: "Part III",
    title: "Subtraction, groups, sharing, time, and subtraction strategies",
    hint: "Answer each blank exactly.",
    questions: [
      mathQ("mo1", 11, 2, "Subtract.", [
        field("a", "6 - 2", 0.67, ["4"]),
        field("b", "16 - 2", 0.67, ["14"]),
        field("c", "26 - 2", 0.66, ["24"]),
      ], { visualHtml: baseTenVisual(), compact: true }),
      mathQ("mo1", 12, 2, "Fill in the blanks.", [
        field("groups", "There are ___ groups of 4 triangles.", 1, ["2"]),
        field("total", "There are ___ triangles altogether.", 1, ["8"]),
      ], { visualHtml: triangleGroupsVisual() }),
      mathQ("mo1", 13, 2, "Share 6 pears equally among 2 children.", [
        field("each", "Each child gets ___ pears.", 2, ["3"]),
      ], { visualHtml: pearVisual() }),
      mathQ("mo1", 14, 2, "Uncle Tam and family came to visit at what time?", [
        field("time", "Visit time", 2, ["10:30", "10.30", "10 30"], "time"),
      ], { visualHtml: clockVisual() }),
      mathQ("mo1", 15, 3, "Subtract.", [
        field("a1", "49 - 30 - 5", 0.75, ["14"]),
        field("a2", "49 - 35", 0.75, ["14"]),
        field("b1", "69 - 20 - 3", 0.75, ["46"]),
        field("b2", "69 - 23", 0.75, ["46"]),
      ], { compact: true }),
    ],
  },
]);

function numberPathVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 720 140" role="img" aria-label="Number path 4 blank 6 blank 8 blank"><rect width="720" height="140" fill="#fff"/><g font-size="28" font-weight="900" text-anchor="middle">${[4, 5, 6, 7, 8, 9].map((n, i) => `<circle cx="${80 + i * 110}" cy="70" r="34" fill="${i % 2 ? "#e9fbf8" : "#fff"}" stroke="#213b4d" stroke-width="4"/><text x="${80 + i * 110}" y="80">${[4, 6, 8].includes(n) ? n : "?"}</text>`).join("")}</g></svg>`;
}

function numberBondVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 520 250" role="img" aria-label="Number bond showing 4 split into 3 and 1"><rect width="520" height="250" fill="#fff"/><circle cx="260" cy="62" r="36" fill="#fff" stroke="#213b4d" stroke-width="4"/><text x="260" y="73" font-size="32" font-weight="900" text-anchor="middle">4</text><line x1="240" y1="95" x2="190" y2="155" stroke="#213b4d" stroke-width="4"/><line x1="280" y1="95" x2="330" y2="155" stroke="#213b4d" stroke-width="4"/><circle cx="180" cy="182" r="36" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><circle cx="340" cy="182" r="36" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><text x="180" y="192" font-size="28" font-weight="900" text-anchor="middle">?</text><text x="340" y="192" font-size="28" font-weight="900" text-anchor="middle">?</text></svg>`;
}

function objectsVisual(kind: "orange" | "cake", shown: number, changed: number) {
  const fill = kind === "orange" ? "#f59e0b" : "#f9c5d1";
  return `<svg class="diagram-svg" viewBox="0 0 620 180" role="img" aria-label="${shown} ${kind}s and ${changed} more or removed"><rect width="620" height="180" fill="#fff"/><g>${Array.from({ length: shown }, (_, i) => `<circle cx="${80 + i * 55}" cy="78" r="24" fill="${fill}" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="300" y="145" font-size="20" font-weight="900" text-anchor="middle">${kind === "orange" ? "5 + 3" : "5 - 2"}</text></svg>`;
}

function rectSvg(x: number, y: number, w: number, h: number) {
  return `<svg viewBox="0 0 300 220" role="img" aria-label="Rectangle"><rect width="300" height="220" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e9fbf8" stroke="#213b4d" stroke-width="8"/></svg>`;
}

function polygon(points: string) {
  return `<svg viewBox="0 0 300 220" role="img" aria-label="Triangle"><rect width="300" height="220" fill="#fff"/><polygon points="${points}" fill="#e9fbf8" stroke="#213b4d" stroke-width="8"/></svg>`;
}

function triangleRowVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 720 160" role="img" aria-label="Triangles labelled A B C D E F"><rect width="720" height="160" fill="#fff"/><g>${["A", "B", "C", "D", "E", "F"].map((l, i) => `<polygon points="${70 + i * 110},112 ${120 + i * 110},34 ${170 + i * 110},112" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><text x="${120 + i * 110}" y="95" text-anchor="middle" font-size="24" font-weight="900">${l}</text>`).join("")}</g></svg>`;
}

function beadVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 720 160" role="img" aria-label="Beads"><rect width="720" height="160" fill="#fff"/><g>${Array.from({ length: 16 }, (_, i) => `<circle cx="${55 + i * 38}" cy="78" r="15" fill="${i < 14 ? "#79d1d8" : "#ffd45c"}" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="360" y="135" text-anchor="middle" font-size="18" font-weight="900">14 beads + 2 beads</text></svg>`;
}

function pencilVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 620 220" role="img" aria-label="Pencils A B and C"><rect width="620" height="220" fill="#fff"/><g font-size="20" font-weight="900">${pencil(90, 45, 210, "A")}${pencil(90, 95, 300, "B")}${pencil(90, 145, 210, "C")}</g></svg>`;
}

function pencil(x: number, y: number, width: number, label: string) {
  return `<text x="45" y="${y + 16}">${label}</text><rect x="${x}" y="${y}" width="${width}" height="22" fill="#ffd45c" stroke="#213b4d" stroke-width="3"/><polygon points="${x + width},${y} ${x + width + 32},${y + 11} ${x + width},${y + 22}" fill="#f5deb3" stroke="#213b4d" stroke-width="3"/>`;
}

function bookGraphVisual() {
  const rows: Array<[string, number]> = [["English Literature", 4], ["Malay Literature", 4], ["Chinese Literature", 7], ["Bedtime story", 2]];
  return `<svg class="diagram-svg" viewBox="0 0 760 300" role="img" aria-label="Books on bookshelf pictograph"><rect width="760" height="300" fill="#fff"/><g font-size="17" font-weight="900">${rows.map(([label, count], i) => `<text x="44" y="${55 + i * 55}">${label}</text>${Array.from({ length: count }, (_, j) => `<rect x="${250 + j * 42}" y="${32 + i * 55}" width="24" height="34" fill="#79d1d8" stroke="#213b4d" stroke-width="2"/>`).join("")}`).join("")}</g></svg>`;
}

function baseTenVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 620 170" role="img" aria-label="Base ten subtraction"><rect width="620" height="170" fill="#fff"/><text x="310" y="82" text-anchor="middle" font-size="24" font-weight="900">6 - 2, 16 - 2, 26 - 2</text></svg>`;
}

function triangleGroupsVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 520 160" role="img" aria-label="Two groups of four triangles"><rect width="520" height="160" fill="#fff"/><g>${Array.from({ length: 8 }, (_, i) => `<polygon points="${70 + i * 46},110 ${92 + i * 46},62 ${114 + i * 46},110" fill="#e9fbf8" stroke="#213b4d" stroke-width="3"/>`).join("")}</g></svg>`;
}

function pearVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 520 160" role="img" aria-label="Six pears"><rect width="520" height="160" fill="#fff"/><g>${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${90 + i * 58}" cy="82" rx="22" ry="30" fill="#a3d977" stroke="#213b4d" stroke-width="3"/><path d="M${90 + i * 58} 52c5-15 15-16 22-8" fill="none" stroke="#498b32" stroke-width="3"/>`).join("")}</g></svg>`;
}

function clockVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 300 260" role="img" aria-label="Clock showing 10:30"><rect width="300" height="260" fill="#fff"/><circle cx="150" cy="118" r="78" fill="#fff" stroke="#213b4d" stroke-width="5"/><text x="150" y="58" text-anchor="middle" font-size="16" font-weight="900">12</text><text x="207" y="124" text-anchor="middle" font-size="16" font-weight="900">3</text><text x="150" y="184" text-anchor="middle" font-size="16" font-weight="900">6</text><text x="92" y="124" text-anchor="middle" font-size="16" font-weight="900">9</text><line x1="150" y1="118" x2="122" y2="92" stroke="#213b4d" stroke-width="6" stroke-linecap="round"/><line x1="150" y1="118" x2="150" y2="178" stroke="#213b4d" stroke-width="5" stroke-linecap="round"/></svg>`;
}
