(function () {
  "use strict";

  const field = (id, label, points, accepted, normalizer = "text") => ({ id, label, points, accepted, normalizer });
  const q = (number, points, prompt, fields, extra = {}) => ({
    id: `mo3-q${number}`,
    number,
    points,
    prompt,
    fields: fields.map(({ id, label }) => ({ id, label })),
    answerParts: fields,
    display: fields.map((item) => item.accepted[0]).join(", "),
    ...extra,
  });
  const choice = (number, points, prompt, choices, accepted, extra = {}) => ({
    id: `mo3-q${number}`,
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
    testId: "math-olympiad-3",
    title: "Math Olympiad Level 3",
    level: "Math Olympiad 3",
    subject: "Math",
    totalPoints: 30,
    parts: [
      {
        id: "part1",
        label: "Part I",
        title: "Place value, money, multiplication, and division",
        hint: "Write numbers clearly.",
        questions: [
          q(1, 1, "Fill in the blanks.", [
            field("a", "7145 = ___ + 100 + 40 + 5", 0.5, ["7000"]),
            field("b", "9802 = 9000 + ___ + 2", 0.5, ["800"]),
          ]),
          q(2, 2, "Mr Ravi gave $3985 to his wife and $468 to his son. He was left with $2790.", [
            field("a", "How much more money did Mr Ravi give his wife than his son?", 1, ["3517", "$3517"]),
            field("b", "How much money did Mr Ravi have at first?", 1, ["7243", "$7243"]),
          ]),
          q(3, 3, "Multiply the following.", [
            field("a", "83 x 6", 0.75, ["498"]),
            field("b", "95 x 7", 0.75, ["665"]),
            field("c", "96 x 8", 0.75, ["768"]),
            field("d", "29 x 9", 0.75, ["261"]),
          ], { compact: true }),
          q(4, 2, "Fill in the blanks.", [
            field("a", "28 ÷ ___ = 7", 0.5, ["4"]),
            field("b", "30 ÷ ___ = 6", 0.5, ["5"]),
            field("c", "48 ÷ ___ = 8", 0.5, ["6"]),
            field("d", "70 ÷ ___ = 7", 0.5, ["10"]),
          ], { compact: true }),
          q(5, 2, "3 boxes contained 35 buttons each. The buttons were sewn equally onto 7 shirts. How many buttons were sewn on each shirt?", [
            field("answer", "Buttons on each shirt", 2, ["15"]),
          ]),
        ],
      },
      {
        id: "part2",
        label: "Part II",
        title: "Money, measurement, mass, and volume",
        hint: "Include units only when helpful.",
        questions: [
          q(6, 2, "A dress costs $45.85. It costs $9.60 less than a coat.", [
            field("a", "How much does the coat cost?", 1, ["55.45", "$55.45"]),
            field("b", "Find the total cost of the dress and the coat.", 1, ["101.30", "101.3", "$101.30", "$101.3"]),
          ]),
          q(7, 2, "Convert the following to centimetres or metres.", [
            field("a", "6 m 20 cm = ___ cm", 1, ["620"]),
            field("b", "3 km 150 m = ___ m", 1, ["3150"]),
          ], { compact: true }),
          q(8, 2, "Jack is 1 m 46 cm tall. His father is 27 cm taller than he.", [
            field("a", "How tall is Jack's father?", 1, ["1 m 73 cm", "1m73cm", "173 cm"]),
            field("b", "Find their total height.", 1, ["3 m 19 cm", "3m19cm", "319 cm"]),
          ]),
          q(9, 2, "The total mass of 6 apples and a durian is 2 kg 400 g. The mass of the durian is 1 kg 500 g. The apples are of the same mass.", [
            field("a", "What is the mass of the 6 apples?", 1, ["900 g", "900g"]),
            field("b", "What is the mass of each apple?", 1, ["150 g", "150g"]),
          ]),
          q(10, 2, "A mug can hold 1200 ml of water. If the mug can hold 6 times as much water as a cup, how much water can the cup hold?", [
            field("answer", "Cup capacity", 2, ["200 ml", "200ml", "200"]),
          ]),
        ],
      },
      {
        id: "part3",
        label: "Part III",
        title: "Graphs, fractions, time, lines, and perimeter",
        hint: "Use the graph or figure information.",
        questions: [
          q(11, 3, "The bar graph shows the number of books five pupils read in a year.", [
            field("a", "Betty read ___ more books than Alice.", 0.6, ["15"]),
            field("b", "Samy read 20 fewer books than ___.", 0.6, ["Betty"]),
            field("c", "Minah read 4 times as many books as ___.", 0.6, ["Mike"]),
            field("d", "Samy read ___ more pages than Mike.", 0.6, ["625"]),
            field("e", "The five pupils read ___ books altogether.", 0.6, ["120"]),
          ], { visualHtml: booksBarGraph() }),
          q(12, 2, "Fill in the blanks to make 1 whole.", [
            field("a", "4/5 and ___ make 1 whole.", 1, ["1/5"]),
            field("b", "___ and 9/10 make 1 whole.", 1, ["1/10"]),
          ]),
          q(13, 2, "Find the equivalent time.", [
            field("a_hours", "190 min hours", 0.5, ["3"]),
            field("a_minutes", "190 min minutes", 0.5, ["10"]),
            field("b_hours", "115 min hours", 0.5, ["1"]),
            field("b_minutes", "115 min minutes", 0.5, ["55"]),
          ], {
            inlineRows: [
              { items: [
                { text: "190 min =" },
                { type: "input", id: "a_hours" },
                { text: "h" },
                { type: "input", id: "a_minutes" },
                { text: "min" },
              ] },
              { items: [
                { text: "115 min =" },
                { type: "input", id: "b_hours" },
                { text: "h" },
                { type: "input", id: "b_minutes" },
                { text: "min" },
              ] },
            ],
          }),
          choice(14, 1, "Choose the green line that is parallel to the blue line.", [
            { value: "parallel", label: "A", visualHtml: lineOption("parallel") },
            { value: "perpendicular", label: "B", visualHtml: lineOption("perpendicular") },
            { value: "horizontal", label: "C", visualHtml: lineOption("horizontal") },
          ], ["parallel"]),
          q(15, 2, "Find the perimeter of the figure.", [
            field("answer", "Perimeter in cm", 2, ["51", "51 cm"]),
          ], { visualHtml: perimeterVisual() }),
        ],
      },
    ],
  };

  function booksBarGraph() {
    const bars = [["Mike",10],["Samy",15],["Alice",20],["Betty",35],["Minah",40]];
    const y = (value) => 300 - value * 5.6;
    const grid = [15, 20, 35, 40].map((value) => (
      `<line x1="126" y1="${y(value)}" x2="640" y2="${y(value)}" stroke="#213b4d" stroke-width="2" stroke-dasharray="4 5"/>`
    )).join("");
    const ticks = [0, 5, 10, 15, 20, 25, 30, 35, 40].map((value) => (
      `<line x1="126" y1="${y(value)}" x2="${value % 10 === 0 ? 144 : 138}" y2="${y(value)}" stroke="#213b4d" stroke-width="3"/>`
    )).join("");
    const labels = [0, 10, 20, 30, 40].map((value) => (
      `<text x="108" y="${y(value) + 7}" text-anchor="end" font-size="20" font-weight="800">${value}</text>`
    )).join("");
    const columns = bars.map(([name, value], index) => {
      const x = 184 + index * 92;
      return `<rect x="${x}" y="${y(value)}" width="50" height="${300 - y(value)}" fill="#b8b8b8" stroke="#213b4d" stroke-width="3"/>
        <text x="${x + 25}" y="333" text-anchor="middle" font-size="21" font-weight="800">${name}</text>`;
    }).join("");
    return `<svg class="graph-svg" viewBox="0 0 720 370" role="img" aria-label="Books read bar graph">
      <rect width="720" height="370" fill="#fff"/>
      <text x="40" y="156" font-size="21" font-weight="900" text-anchor="middle">Number</text>
      <text x="40" y="184" font-size="21" font-weight="900" text-anchor="middle">of</text>
      <text x="40" y="212" font-size="21" font-weight="900" text-anchor="middle">books</text>
      ${grid}
      <line x1="126" y1="${y(40)}" x2="126" y2="300" stroke="#213b4d" stroke-width="3"/>
      <line x1="126" y1="300" x2="650" y2="300" stroke="#213b4d" stroke-width="3"/>
      ${ticks}
      ${labels}
      ${columns}
    </svg>`;
  }
  function lineOption(type) {
    const extra = type === "parallel" ? "M20 70L105 30" : type === "perpendicular" ? "M62 20L62 95" : "M20 70L105 70";
    return `<svg viewBox="0 0 130 110" aria-hidden="true"><rect width="130" height="110" fill="#fff"/><path d="M18 90L112 46" stroke="#213b4d" stroke-width="4"/><path d="${extra}" stroke="#008f9c" stroke-width="4"/></svg>`;
  }
  function perimeterVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 640 320" role="img" aria-label="Perimeter figure with side lengths 12 cm, 12 cm, 15 cm, 2 cm, 5 cm, and 5 cm">
      <rect width="640" height="320" fill="#fff"/>
      <path d="M155 70H350L300 118L345 232L455 288H155Z" fill="#fff" stroke="#213b4d" stroke-width="4" stroke-linejoin="round"/>
      <text x="252" y="52" text-anchor="middle" font-size="24" font-weight="900">12 cm</text>
      <text x="116" y="182" text-anchor="middle" font-size="24" font-weight="900">12 cm</text>
      <text x="305" y="314" text-anchor="middle" font-size="24" font-weight="900">15 cm</text>
      <text x="347" y="112" font-size="22" font-weight="900">2 cm</text>
      <text x="352" y="182" font-size="22" font-weight="900">5 cm</text>
      <text x="423" y="246" font-size="22" font-weight="900">5 cm</text>
    </svg>`;
  }
})();
