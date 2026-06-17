(function () {
  "use strict";

  const field = (id, label, points, accepted, normalizer = "text", placeholder = "", visualHtml = "") => ({ id, label, points, accepted, normalizer, placeholder, visualHtml });
  const q = (number, points, prompt, fields, extra = {}) => ({
    id: `mo2-q${number}`,
    number,
    points,
    prompt,
    fields: fields.map(({ id, label, placeholder, visualHtml }) => ({ id, label, placeholder, visualHtml })),
    answerParts: fields,
    display: fields.map((item) => item.accepted[0]).join(", "),
    ...extra,
  });
  const choice = (number, points, prompt, choices, accepted, extra = {}) => ({
    id: `mo2-q${number}`,
    number,
    points,
    prompt,
    responseType: "choice",
    choices,
    answerParts: [field("answer", "Answer", points, accepted)],
    display: accepted.join(", "),
    ...extra,
  });

  window.MathOlympiadData = {
    testId: "math-olympiad-2",
    title: "Math Olympiad Level 2",
    level: "Math Olympiad 2",
    subject: "Math",
    totalPoints: 30,
    parts: [
      {
        id: "part1",
        label: "Part I",
        title: "Numbers and word problems",
        hint: "Write the answers shown by the numbers and pictures.",
        questions: [
          q(1, 2, "Write the following in numerals.", [
            field("a", "6 hundreds 8 tens 2 ones", 1, ["682"]),
            field("b", "9 hundreds 7 tens", 1, ["970"]),
          ]),
          q(2, 1, "Cheryl had 923 marbles. She gave 53 of the marbles to Norman. How many marbles did Cheryl have left?", [
            field("answer", "She had ___ marbles left.", 1, ["870"]),
          ]),
          q(3, 2, "Hui En sold 156 muffins during a school carnival. Latifah sold 308 muffins. How many more muffins did Latifah sell?", [
            field("answer", "Latifah sold ___ more muffins.", 2, ["152"]),
          ]),
          q(4, 2, "Subtract.", [
            field("a", "423 - 156", 1, ["267"]),
            field("b", "856 - 379", 1, ["477"]),
          ], { compact: true }),
          q(5, 2, "Mr Chen had 771 oranges at his fruit stall. He sold 345 oranges in the afternoon. How many oranges did he have left?", [
            field("answer", "He had ___ oranges left.", 2, ["426"]),
          ]),
        ],
      },
      {
        id: "part2",
        label: "Part II",
        title: "Multiplication, division, measures, and money",
        hint: "Use the operation shown in each question.",
        questions: [
          q(6, 2, "There are 8 flowers on each stalk. There are 3 stalks.", [
            field("a", "3 x 8", 1, ["24"]),
            field("b", "There are ___ flowers altogether.", 1, ["24", "twenty four", "twenty-four"], "text", "answer in words"),
          ], { visualHtml: bookletImage("m2_q6.png", "Three flower stalks with eight flowers on each stalk") }),
          q(7, 3, "Divide.", [
            field("a", "16 ÷ 2", 0.5, ["8"]),
            field("b", "18 ÷ 2", 0.5, ["9"]),
            field("c", "30 ÷ 5", 0.5, ["6"]),
            field("d", "24 ÷ 4", 0.5, ["6"]),
            field("e", "27 ÷ 3", 0.5, ["9"]),
            field("f", "100 ÷ 10", 0.5, ["10"]),
          ], { compact: true }),
          q(8, 2, "Pencil A is 6 cm. Pencil B is 11 cm.", [
            field("a", "Which pencil is shorter?", 1, ["A", "Pencil A"]),
            field("b", "How much shorter is it?", 1, ["5", "5 cm"]),
          ], { visualHtml: bookletImage("m2_q8.png", "Pencil A and Pencil B with length arrows", "math-booklet-image-reduced") }),
          q(9, 2, "The total mass of a table and a chair is 22 kg. The mass of the chair is 10 kg. What is the mass of the table?", [
            field("answer", "The mass of the table is ___ kg.", 2, ["12", "12 kg"]),
          ]),
          q(10, 2, "Mrs Lee left the house with $120. She had $70 left after buying groceries. How much did her groceries cost?", [
            field("answer", "Her groceries cost $___", 2, ["50", "$50"]),
          ]),
        ],
      },
      {
        id: "part3",
        label: "Part III",
        title: "Fractions, time, comparison, graphs, and shapes",
        hint: "Choose or write the best answer.",
        questions: [
          choice(11, 1, "Circle the figures shown that are one-quarter shaded.", [
            { value: "a", label: "A only" },
            { value: "b-c", label: "B and C" },
            { value: "all", label: "A, B, and C" },
          ], ["b-c"], { visualHtml: bookletImage("m2_q11.png", "Three shaded figures labelled A, B, and C", "math-booklet-image-q11") }),
          q(12, 2, "Fill in the blanks with the correct time.", [
            field("a", "It is 1 hour after the time shown.", 1, ["9.00 p.m.", "9:00 pm", "9 pm"], "time", "answer in time", clockCard("8.00 p.m.", 8, 0)),
            field("b", "It is 30 minutes after the time shown.", 1, ["4.30 p.m.", "4:30 pm", "4.30 pm"], "time", "answer in time", clockCard("4.00 p.m.", 4, 0)),
          ]),
          choice(13, 2, "Container A holds ___ water than Container B.", [
            { value: "more", label: "more" },
            { value: "less", label: "less" },
          ], ["less"], { visualHtml: bookletImage("m2_q13.png", "Container A and Container B poured into measuring glasses", "math-booklet-image-q13") }),
          q(14, 3, "The pictograph shows pupils' favourite colours.", [
            field("a", "___ pupils like blue most.", 0.5, ["4"]),
            field("b", "___ pupils like red most.", 0.5, ["3"]),
            field("c", "___ more pupils prefer yellow to blue.", 0.5, ["2"]),
            field("d", "5 more pupils prefer green to ___.", 0.5, ["red"]),
            field("e", "3 more pupils prefer ___ to red.", 0.5, ["yellow"]),
            field("f", "There are ___ pupils in the group.", 0.5, ["21"]),
          ], { visualHtml: colourPictograph() }),
          q(15, 2, "Name the shape of each shaded face.", [
            field("a", "Brick shaded face", 1, ["rectangle"]),
            field("b", "Cheese shaded face", 1, ["triangle"]),
          ], { visualHtml: solidFacesVisual() }),
        ],
      },
    ],
  };

  function bookletImage(fileName, alt, className = "") {
    return `<img class="booklet-diagram math-booklet-image ${className}" src="assets/${fileName}" alt="${alt}">`;
  }
  function clockCard(label, hour, minute) {
    return `<svg class="diagram-svg" viewBox="0 0 260 230" role="img" aria-label="Clock showing ${label}"><rect width="260" height="230" fill="#fff"/>${clock(130, 96, hour, minute)}<text x="130" y="205" text-anchor="middle" font-size="22" font-weight="900">${label}</text></svg>`;
  }
  function clock(cx, cy, hour, minute) {
    const hAngle = ((hour % 12) + minute / 60) * 30;
    const mAngle = minute * 6;
    return `<g><circle cx="${cx}" cy="${cy}" r="62" fill="#fff" stroke="#213b4d" stroke-width="4"/><text x="${cx}" y="${cy - 42}" text-anchor="middle" font-size="14" font-weight="900">12</text><text x="${cx + 42}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="900">3</text><text x="${cx}" y="${cy + 50}" text-anchor="middle" font-size="14" font-weight="900">6</text><text x="${cx - 42}" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="900">9</text><line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(hAngle * Math.PI / 180) * 34}" y2="${cy - Math.cos(hAngle * Math.PI / 180) * 34}" stroke="#213b4d" stroke-width="5" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(mAngle * Math.PI / 180) * 46}" y2="${cy - Math.cos(mAngle * Math.PI / 180) * 46}" stroke="#213b4d" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  function colourPictograph() {
    const rows = [["Blue", 4, "#60a5fa"], ["Red", 3, "#ef4444"], ["Yellow", 6, "#facc15"], ["Green", 8, "#22c55e"]];
    return `<svg class="diagram-svg" viewBox="0 0 720 310" role="img" aria-label="Pictograph of favourite colours"><rect width="720" height="310" fill="#fff"/><g transform="translate(72 31) scale(0.8)"><rect x="30" y="25" width="660" height="240" fill="#fff" stroke="#213b4d" stroke-width="3"/><line x1="180" y1="25" x2="180" y2="265" stroke="#213b4d" stroke-width="3"/>${rows.map((row, i) => `<line x1="30" y1="${85 + i * 60}" x2="690" y2="${85 + i * 60}" stroke="#213b4d" stroke-width="2"/><text x="58" y="${65 + i * 60}" font-size="19" font-weight="900">${row[0]}</text>${Array.from({ length: row[1] }, (_, j) => `<circle cx="${215 + j * 44}" cy="${57 + i * 60}" r="12" fill="${row[2]}" stroke="#213b4d" stroke-width="2"/>`).join("")}`).join("")}</g></svg>`;
  }
  function solidFacesVisual() {
    return `<svg class="diagram-svg solid-faces-visual" viewBox="0 0 650 250" role="img" aria-label="Brick and cheese solid faces"><rect width="650" height="250" fill="#fff"/><g transform="translate(110 55)"><path d="M0 50h130v75H0z" fill="#fff" stroke="#213b4d" stroke-width="4"/><path d="M130 50l58-36v75l-58 36z" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><path d="M0 50l58-36h130l-58 36z" fill="#ffd6a5" stroke="#213b4d" stroke-width="4"/></g><g transform="translate(410 55)"><path d="M0 125L130 20v105z" fill="#f7c873" stroke="#213b4d" stroke-width="4"/><path d="M130 20l54 32v73h-54z" fill="#fff7df" stroke="#213b4d" stroke-width="4"/></g></svg>`;
  }
})();
