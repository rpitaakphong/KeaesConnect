(function () {
  "use strict";

  const field = (id, label, points, accepted, normalizer = "text") => ({ id, label, points, accepted, normalizer });
  const q = (number, points, prompt, fields, extra = {}) => ({
    id: `mo5-q${number}`,
    number,
    points,
    prompt,
    fields: fields.map(({ id, label }) => ({ id, label })),
    answerParts: fields,
    display: fields.map((item) => item.accepted[0]).join(", "),
    ...extra,
  });

  window.MathOlympiadData = {
    testId: "math-olympiad-5",
    title: "Math Olympiad Level 5",
    level: "Math Olympiad 5",
    subject: "Math",
    totalPoints: 30,
    parts: [
      {
        id: "part1",
        label: "Part I",
        title: "Large numbers, operations, division, and area",
        hint: "Write exact answers.",
        questions: [
          q(1, 2, "Write the following in words.", [
            field("a", "3 002 000", 1, ["three million two thousand"]),
            field("b", "4 018 000", 1, ["four million eighteen thousand"]),
          ]),
          q(2, 3, "Calculate the following.", [
            field("a", "92 - 33 - 29", 0.5, ["30"]),
            field("b", "77 + 23 - 51", 0.5, ["49"]),
            field("c", "27 + 45 ÷ 9 - 10", 0.5, ["22"]),
            field("d", "88 - 22 ÷ 2 × 3", 0.5, ["55"]),
            field("e", "(91 + 17) ÷ 9", 0.5, ["12"]),
            field("f", "7 x (32 - 27)", 0.5, ["35"]),
          ], { compact: true }),
          q(3, 2, "Divide the following.", [
            field("a", "900 ÷ 300", 0.67, ["3"]),
            field("b", "1500 ÷ 500", 0.67, ["3"]),
            field("c", "49 000 ÷ 700", 0.66, ["70"]),
          ], { compact: true }),
          q(4, 1, "Mr Siva bought 132 packets of balloons from a shop. There were 9 balloons in each packet. How many balloons did he buy altogether?", [
            field("answer", "Balloons altogether", 1, ["1188"]),
          ], { visualHtml: balloonPacketsVisual() }),
          q(5, 2, "The diagram shows a rectangle. Find the perimeter and area.", [
            field("a", "Perimeter", 1, ["3 1/4 cm", "3.25 cm", "13/4 cm", "3 1/4", "3.25", "13/4"]),
            field("b", "Area", 1, ["21/32 cm2", "21/32 cm²", "21/32"]),
          ], { visualHtml: bookletImage("m5_q5.png", "Rectangle measuring seven eighths centimetre by three quarters centimetre", "booklet-diagram-compact") }),
        ],
      },
      {
        id: "part2",
        label: "Part II",
        title: "Ratio, time, angles, and decimals",
        hint: "Use units where appropriate.",
        questions: [
          q(6, 2, "Find the shaded area of the rectangle.", [
            field("answer", "Shaded area", 2, ["120 cm2", "120 cm²", "120"]),
          ], { visualHtml: bookletImage("m5_q6.png", "Rectangle with shaded area and dimensions 15 cm, 30 cm, and 7 cm", "booklet-diagram-tall") }),
          q(7, 1, "Fill in the blanks.", [
            field("a", "15 : 4 = ___ : 20", 0.5, ["75"]),
            field("b", "3 : 10 = ___ : 40", 0.5, ["12"]),
          ], { compact: true }),
          q(8, 2, "Hakim can write 25 cards in 150 min. How long will he take to write 27 cards?", [
            field("answer", "Time in minutes", 2, ["162", "162 min"]),
          ]),
          q(9, 2, "Find the unknown marked angles.", [
            field("a", "Angle a", 1, ["22", "22°"]),
            field("b", "Angle b", 1, ["125", "125°"]),
          ], { visualHtml: bookletImage("m5_q9.png", "Two angle diagrams for angle a and angle b", "booklet-diagram-q9") }),
          q(10, 3, "Divide the following.", [
            field("a", "90.8 ÷ 20", 0.75, ["4.54"]),
            field("b", "29.1 ÷ 100", 0.75, ["0.291"]),
            field("c", "462 ÷ 300", 0.75, ["1.54"]),
            field("d", "3800 ÷ 2000", 0.75, ["1.9"]),
          ], { compact: true }),
        ],
      },
      {
        id: "part3",
        label: "Part III",
        title: "Percentages, volume, and geometry",
        hint: "Write each answer in the requested unit.",
        questions: [
          q(11, 2, "There are 75 animals at a pet show. 18 are dogs, 36 are cats and the rest are rabbits.", [
            field("a", "Percentage of animals that are cats", 1, ["48%", "48"]),
            field("b", "Percentage of animals that are rabbits", 1, ["28%", "28"]),
          ]),
          q(12, 2, "Jean has 2 bottles of 1.5 l milk to be divided equally into 6 cups. What is the volume in each cup? Express your answer in ml.", [
            field("answer", "Volume in each cup", 2, ["500 ml", "500ml", "500"]),
          ], { visualHtml: milkVisual() }),
          q(13, 2, "The figure is not drawn to scale. Find ∠a and ∠b.", [
            field("a", "Angle a", 1, ["35", "35°"]),
            field("b", "Angle b", 1, ["40", "40°"]),
          ], { visualHtml: bookletImage("m5_q13.png", "Triangle diagram with angles a and b", "booklet-diagram-tall") }),
          q(14, 2, "The trapezium is not drawn to scale. Find the unknown marked angle.", [
            field("b", "Angle b", 2, ["120", "120°"]),
          ], { visualHtml: bookletImage("m5_q14.png", "Trapezium angle diagram with angle b", "booklet-diagram-q14") }),
          q(15, 2, "Find the height of the cuboid. Volume = 672 cm³, length = 12 cm, width = 8 cm.", [
            field("answer", "Height", 2, ["7", "7 cm"]),
          ], { visualHtml: bookletImage("m5_q15.png", "Cuboid with dimensions 12 cm, 8 cm, height, and volume 672 cubic centimetres", "booklet-diagram-wide") }),
        ],
      },
    ],
  };

  function bookletImage(fileName, alt, className = "") {
    return `<img class="booklet-diagram math-booklet-image ${className}" src="assets/${fileName}" alt="${alt}">`;
  }

  function balloonPacketsVisual() {
    return `<svg class="diagram-svg balloon-packets-visual" viewBox="0 0 600 200" role="img" aria-label="Packets of balloons"><rect width="600" height="200" fill="#fff"/><g>${Array.from({length:6},(_,i)=>`<rect x="${90+i*70}" y="55" width="48" height="60" rx="8" fill="#ffd6a5" stroke="#213b4d" stroke-width="3"/><circle cx="${114+i*70}" cy="40" r="20" fill="#f7b6d2" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="300" y="165" font-size="15" font-weight="900" text-anchor="middle">132 packets × 9 balloons</text></svg>`;
  }
  function rectangleVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 520 175" role="img" aria-label="Rectangle measuring 7/8 cm by 3/4 cm"><rect width="520" height="175" fill="#fff"/><rect x="150" y="42" width="210" height="82" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><text x="255" y="158" font-size="15" font-weight="900" text-anchor="middle">7/8 cm</text><text x="410" y="85" font-size="15" font-weight="900" text-anchor="middle" transform="rotate(90 410 85)">3/4 cm</text></svg>`;
  }
  function shadedAreaVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 520 330" role="img" aria-label="Rectangle 15 cm by 30 cm with shaded triangular area and 7 cm bottom segment"><rect width="520" height="330" fill="#fff"/>
      <g transform="translate(145 55)">
        <rect x="0" y="0" width="180" height="210" fill="#fff" stroke="#213b4d" stroke-width="4"/>
        <polygon points="0,210 180,0 96,210" fill="#d7e0e2" stroke="#213b4d" stroke-width="3"/>
        <line x1="0" y1="210" x2="180" y2="0" stroke="#213b4d" stroke-width="3"/>
        <line x1="96" y1="210" x2="180" y2="0" stroke="#213b4d" stroke-width="3"/>
        <line x1="0" y1="-16" x2="180" y2="-16" stroke="#213b4d" stroke-width="3"/>
        <line x1="198" y1="0" x2="198" y2="210" stroke="#213b4d" stroke-width="3"/>
        <line x1="96" y1="228" x2="180" y2="228" stroke="#213b4d" stroke-width="3"/>
        <g stroke="#213b4d" stroke-width="2">
          <line x1="0" y1="-25" x2="0" y2="-7"/>
          <line x1="180" y1="-25" x2="180" y2="-7"/>
          <line x1="189" y1="0" x2="207" y2="0"/>
          <line x1="189" y1="210" x2="207" y2="210"/>
          <line x1="96" y1="218" x2="96" y2="238"/>
          <line x1="180" y1="218" x2="180" y2="238"/>
        </g>
        <g font-size="15" font-weight="900" fill="#213b4d">
          <text x="90" y="-28" text-anchor="middle">15 cm</text>
          <text x="220" y="110">30 cm</text>
          <text x="138" y="258" text-anchor="middle">7 cm</text>
        </g>
      </g>
    </svg>`;
  }
  function milkVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 620 210" role="img" aria-label="Milk bottles divided into cups"><rect width="620" height="210" fill="#fff"/><g>${[120,200].map(x=>`<path d="M${x} 35h46v120h-46z" fill="#fff" stroke="#213b4d" stroke-width="3"/><path d="M${x+8} 65h30v83h-30z" fill="#d7eef6"/>`).join("")}${Array.from({length:6},(_,i)=>`<path d="M${330+(i%3)*60} ${50+Math.floor(i/3)*62}h40l-5 44h-30z" fill="#fff" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="160" y="185" font-size="15" font-weight="900" text-anchor="middle">2 × 1.5 l</text><text x="405" y="185" font-size="15" font-weight="900">6 cups</text></svg>`;
  }
  function cuboidVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 780 380" role="img" aria-label="Cuboid volume height problem"><rect width="780" height="380" fill="#fff"/><g transform="translate(190 105) scale(0.7)"><path d="M60 58h240l78-54H138z" fill="#fff" stroke="#213b4d" stroke-width="4"/><path d="M300 58l78-54v160l-78 70z" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><path d="M60 58h240v176H60z" fill="#fff" stroke="#213b4d" stroke-width="4"/><text x="180" y="285" font-size="15" font-weight="900" text-anchor="middle">12 cm</text><text x="380" y="245" font-size="15" font-weight="900">8 cm</text><text x="430" y="105" font-size="15" font-weight="900">Height</text></g><text x="575" y="70" font-size="22" font-weight="900" text-anchor="middle">Volume = 672 cm³</text></svg>`;
  }
})();
