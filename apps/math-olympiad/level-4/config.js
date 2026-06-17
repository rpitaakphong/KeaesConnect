(function () {
  "use strict";

  const field = (id, label, points, accepted, normalizer = "text") => ({ id, label, points, accepted, normalizer });
  const q = (number, points, prompt, fields, extra = {}) => ({
    id: `mo4-q${number}`,
    number,
    points,
    prompt,
    fields: fields.map(({ id, label }) => ({ id, label })),
    answerParts: fields,
    display: fields.map((item) => item.accepted[0]).join(", "),
    ...extra,
  });
  const choice = (number, points, prompt, choices, accepted, extra = {}) => ({
    id: `mo4-q${number}`,
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
    testId: "math-olympiad-4",
    title: "Math Olympiad Level 4",
    level: "Math Olympiad 4",
    subject: "Math",
    totalPoints: 30,
    parts: [
      {
        id: "part1",
        label: "Part I",
        title: "Numerals, rounding, multiplication, and data tables",
        hint: "Use the data given in each question.",
        questions: [
          q(1, 1, "Write the following in numerals.", [
            field("a", "Twelve thousand and nine", 0.5, ["12009"]),
            field("b", "Sixty-three thousand and forty-five", 0.5, ["63045"]),
          ]),
          q(2, 2, "Fill in the blanks.", [
            field("a", "556 rounded to the nearest ten", 0.67, ["560"]),
            field("b", "9729 rounded to the nearest hundred", 0.67, ["9700"]),
            field("c", "12501 rounded to the nearest thousand", 0.66, ["13000"]),
          ]),
          q(3, 1, "Multiply the following.", [
            field("a", "82 x 15", 0.5, ["1230"]),
            field("b", "56 x 27", 0.5, ["1512"]),
          ], { compact: true }),
          q(4, 2, "Christine and David have stickers. Christine has 5 times as many as David. David has 172 stickers.", [
            field("a", "How many stickers does Christine have?", 1, ["860"]),
            field("b", "What is the total number of stickers?", 1, ["1032"]),
          ]),
          q(5, 3, "Complete the table for Shuli, James, and Ken, then answer the questions.", [
            field("shuli_age", "Shuli age", 0.2, ["9 y 6 m", "9 yr 6 mth", "9 years 6 months", "9y 6m"]),
            field("shuli_height", "Shuli height", 0.2, ["146 cm", "146"]),
            field("shuli_mass", "Shuli mass", 0.2, ["39 kg", "39"]),
            field("james_age", "James age", 0.2, ["10 y 1 m", "10 yr 1 mth", "10 years 1 month", "10y 1m"]),
            field("james_height", "James height", 0.2, ["151 cm", "151"]),
            field("james_mass", "James mass", 0.2, ["42 kg", "42"]),
            field("ken_age", "Ken age", 0.2, ["8 y 8 m", "8 yr 8 mth", "8 years 8 months", "8y 8m"]),
            field("ken_height", "Ken height", 0.2, ["138 cm", "138"]),
            field("ken_mass", "Ken mass", 0.2, ["37 kg", "37"]),
            field("a", "(a) How much older is James than Shuli?", 0.2, ["7 months", "7 mth", "7"]),
            field("b", "(b) How much younger is Ken than Shuli?", 0.2, ["10 months", "10 mth", "10"]),
            field("c", "(c) How much taller is James than Ken?", 0.2, ["13 cm", "13"]),
            field("d", "(d) How much lighter is Ken than Shuli?", 0.2, ["2 kg", "2"]),
            field("e", "(e) What is their total height?", 0.2, ["435 cm", "435"]),
            field("f", "(f) What is their total mass?", 0.2, ["118 kg", "118"]),
          ], {
            visualHtml: pupilFlashcardsVisual(),
            answerTable: {
              headers: ["Name", "Age", "Height", "Mass"],
              rows: [
                { cells: [
                  { text: "Shuli" },
                  { type: "input", id: "shuli_age" },
                  { type: "input", id: "shuli_height" },
                  { type: "input", id: "shuli_mass" },
                ] },
                { cells: [
                  { text: "James" },
                  { type: "input", id: "james_age" },
                  { type: "input", id: "james_height" },
                  { type: "input", id: "james_mass" },
                ] },
                { cells: [
                  { text: "Ken" },
                  { type: "input", id: "ken_age" },
                  { type: "input", id: "ken_height" },
                  { type: "input", id: "ken_mass" },
                ] },
              ],
            },
            followupFieldIds: ["a", "b", "c", "d", "e", "f"],
          }),
        ],
      },
      {
        id: "part2",
        label: "Part II",
        title: "Graphs, fractions, directions, and geometry",
        hint: "Use the diagram or graph information.",
        questions: [
          q(6, 3, "The line graph shows shirts sold from Monday to Saturday.", [
            field("a", "Shirts sold on Tuesday", 0.6, ["35"]),
            field("b", "Least number of shirts sold on which day?", 0.6, ["Monday", "Mon"]),
            field("c", "How many fewer shirts on Saturday than Friday?", 0.6, ["10"]),
            field("d", "Money collected from 30 shirts at $20 each", 0.6, ["600", "$600"]),
            field("e", "Total shirts from Monday to Wednesday", 0.6, ["90"]),
          ], { visualHtml: bookletImage("m4_q6.png", "Line graph showing shirts sold from Monday to Saturday", "math-booklet-image-wide") }),
          q(7, 2, "Arrange the fractions from smallest to greatest.", [
            field("a_3_8", "Question 7(a), 3/8 rank", 0.25, ["2"]),
            field("a_5_12", "Question 7(a), 5/12 rank", 0.25, ["3"]),
            field("a_1_4", "Question 7(a), 1/4 rank", 0.25, ["1"]),
            field("a_5_6", "Question 7(a), 5/6 rank", 0.25, ["4"]),
            field("b_5_6", "Question 7(b), 5/6 rank", 0.25, ["4"]),
            field("b_1_12", "Question 7(b), 1/12 rank", 0.25, ["1"]),
            field("b_2_3", "Question 7(b), 2/3 rank", 0.25, ["2"]),
            field("b_7_9", "Question 7(b), 7/9 rank", 0.25, ["3"]),
          ], {
            rankRows: [
              { label: "(a)", items: [
                { text: "3/8", id: "a_3_8" },
                { text: "5/12", id: "a_5_12" },
                { text: "1/4", id: "a_1_4" },
                { text: "5/6", id: "a_5_6" },
              ] },
              { label: "(b)", items: [
                { text: "5/6", id: "b_5_6" },
                { text: "1/12", id: "b_1_12" },
                { text: "2/3", id: "b_2_3" },
                { text: "7/9", id: "b_7_9" },
              ] },
            ],
          }),
          q(8, 2, "Solve each of the following.", [
            field("a", "1/6 of 30", 1, ["5"]),
            field("b", "3/8 of 32", 1, ["12"]),
          ], { compact: true, visualHtml: fractionOfVisual() }),
          q(9, 2, "Fill in the blanks in the direction table.", [
            field("a", "Question 9(a), Jessica will be facing", 0.5, ["North"]),
            field("b", "Question 9(b), Jessica will be facing", 0.5, ["East"]),
            field("c", "Question 9(c), clockwise turn in degrees", 0.5, ["315", "315°"]),
            field("d", "Question 9(d), anticlockwise turn in degrees", 0.5, ["45", "45°"]),
          ], {
            visualHtml: bookletImage("m4_q9.png", "Jessica with eight compass directions", "math-booklet-image-medium"),
            answerTable: {
              headers: ["", "Jessica is facing", "If Jessica turns", "She will be facing"],
              rows: [
                { cells: [
                  { text: "(a)" },
                  { text: "South" },
                  { text: "180° clockwise" },
                  { type: "input", id: "a" },
                ] },
                { cells: [
                  { text: "(b)" },
                  { text: "South-west" },
                  { text: "135° anticlockwise" },
                  { type: "input", id: "b" },
                ] },
                { cells: [
                  { text: "(c)" },
                  { text: "North-west" },
                  { type: "input", id: "c", suffix: "clockwise" },
                  { text: "West" },
                ] },
                { cells: [
                  { text: "(d)" },
                  { text: "East" },
                  { type: "input", id: "d", suffix: "anticlockwise" },
                  { text: "North-east" },
                ] },
              ],
            },
          }),
          q(10, 2, "The figure is made up of two squares. Find DE.", [
            field("answer", "DE in cm", 2, ["4", "4 cm"]),
          ], { visualHtml: bookletImage("m4_q10.png", "Large square ABCD with smaller square EFGC, AB is 10 cm, GC is 6 cm, find DE", "math-booklet-image-narrow") }),
        ],
      },
      {
        id: "part3",
        label: "Part III",
        title: "Decimals, distance, time, area, and symmetry",
        hint: "Give exact answers.",
        questions: [
          q(11, 2, "Fill in the blanks with the missing decimals.", [
            field("a", "27.308 = 27 + 0.3 + ___", 1, ["0.008"]),
            field("b", "8.467 = 8 + 0.4 + ___ + 0.007", 1, ["0.06"]),
          ], { compact: true }),
          q(12, 2, "Jim cycled from his home to the market and then to his school.", [
            field("answer", "Total distance in km", 2, ["13.13", "13 13/100"]),
          ], { visualHtml: bookletImage("m4_q12.png", "Route from Home to Market to School showing 5.38 km and 7 3/4 km", "math-booklet-image-route") }),
          q(13, 2, "Write down the times using the 12-hour and 24-hour clocks.", [
            field("a", "Write 10.45 a.m. in 24-hour clock", 0.5, ["10:45", "10.45"], "time"),
            field("b", "Write 10.45 p.m. in 24-hour clock", 0.5, ["22:45", "22.45"], "time"),
            field("c", "Write 01 35 in 12-hour clock", 0.5, ["1:35 a.m.", "1.35 a.m.", "1:35 am"], "time"),
            field("d", "Write 13 35 in 12-hour clock", 0.5, ["1:35 p.m.", "1.35 p.m.", "1:35 pm"], "time"),
          ]),
          q(14, 2, "Find the perimeter and area of the figure.", [
            field("a", "Perimeter", 1, ["48 cm", "48"]),
            field("b", "Area", 1, ["119 cm2", "119 cm²", "119"]),
          ], { visualHtml: bookletImage("m4_q14.png", "Composite figure with dimensions 4 cm, 5 cm, 4 cm, 8 cm, and 3 cm", "math-booklet-image-area") }),
          choice(15, 2, "Choose the figure with symmetrical shape.", [
            { value: "correct", label: "A", visualHtml: symmetryOption(true) },
            { value: "not-reflected", label: "B", visualHtml: symmetryOption(false) },
            { value: "shifted", label: "C", visualHtml: shiftedOption() },
          ], ["correct"]),
        ],
      },
    ],
  };

  function pupilFlashcardsVisual() {
    const cards = [
      ["Shuli", "Age: 9 yr 6 mth", "Height: 146 cm", "Mass: 39 kg"],
      ["James", "Age: 10 yr 1 mth", "Height: 151 cm", "Mass: 42 kg"],
      ["Ken", "Age: 8 yr 8 mth", "Height: 138 cm", "Mass: 37 kg"],
    ];
    return `<div class="pupil-flashcards" role="img" aria-label="Data flashcards for Shuli, James, and Ken">${cards.map((card) => `
      <section class="pupil-flashcard">
        <strong>${card[0]}</strong>
        <span>${card[1]}</span>
        <span>${card[2]}</span>
        <span>${card[3]}</span>
      </section>
    `).join("")}</div>`;
  }

  function bookletImage(fileName, alt, className = "") {
    return `<img class="booklet-diagram math-booklet-image ${className}" src="assets/${fileName}" alt="${alt}">`;
  }

  function shirtsLineGraph() {
    const pts = [["Mon",20],["Tue",35],["Wed",35],["Thu",45],["Fri",50],["Sat",40]];
    const coords = pts.map((p,i)=>[95+i*95,290-p[1]*4.5,p]);
    return `<svg class="graph-svg shirts-line-graph" viewBox="0 0 740 350" role="img" aria-label="Shirts sold line graph"><rect width="740" height="350" fill="#fff"/><line x1="75" y1="290" x2="660" y2="290" stroke="#213b4d" stroke-width="3"/><line x1="75" y1="50" x2="75" y2="290" stroke="#213b4d" stroke-width="3"/>${[10,20,30,40,50].map(v=>`<text x="56" y="${294-v*4.5}" text-anchor="end" font-size="15">${v}</text><line x1="75" y1="${290-v*4.5}" x2="660" y2="${290-v*4.5}" stroke="#d7e6e6"/>`).join("")}<polyline points="${coords.map(c=>`${c[0]},${c[1]}`).join(" ")}" fill="none" stroke="#008f9c" stroke-width="4"/>${coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="7" fill="#fff" stroke="#213b4d" stroke-width="3"/><text x="${c[0]}" y="322" text-anchor="middle" font-size="17" font-weight="800">${c[2][0]}</text>`).join("")}</svg>`;
  }
  function fractionOfVisual() {
    return `<svg class="diagram-svg fraction-quantity-visual" viewBox="0 0 560 180" role="img" aria-label="Fraction of quantities"><rect width="560" height="180" fill="#fff"/><circle cx="170" cy="90" r="55" fill="#e9fbf8" stroke="#213b4d" stroke-width="4"/><path d="M170 90L170 35A55 55 0 0 1 217 118Z" fill="#79d1d8"/><text x="170" y="166" font-size="15" font-weight="900" text-anchor="middle">1/6 of 30</text><rect x="330" y="45" width="120" height="90" fill="#fff" stroke="#213b4d" stroke-width="4"/><rect x="330" y="45" width="45" height="90" fill="#79d1d8"/><text x="390" y="166" font-size="15" font-weight="900" text-anchor="middle">3/8 of 32</text></svg>`;
  }
  function compassVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 640 300" role="img" aria-label="Jessica with eight compass directions">
      <rect width="640" height="300" fill="#fff"/>
      <g stroke="#213b4d" stroke-width="3" stroke-linecap="round">
        <line x1="320" y1="80" x2="320" y2="128"/>
        <line x1="320" y1="172" x2="320" y2="222"/>
        <line x1="228" y1="150" x2="278" y2="150"/>
        <line x1="362" y1="150" x2="412" y2="150"/>
        <line x1="255" y1="85" x2="292" y2="122"/>
        <line x1="385" y1="85" x2="348" y2="122"/>
        <line x1="255" y1="215" x2="292" y2="178"/>
        <line x1="385" y1="215" x2="348" y2="178"/>
      </g>
      <g font-size="18" font-weight="900" text-anchor="middle">
        <text x="320" y="56">North</text>
        <text x="320" y="256">South</text>
        <text x="195" y="158">West</text>
        <text x="445" y="158">East</text>
        <text x="238" y="74">North-west</text>
        <text x="402" y="74">North-east</text>
        <text x="238" y="246">South-west</text>
        <text x="402" y="246">South-east</text>
      </g>
      <g stroke="#213b4d" stroke-width="3" fill="#fff">
        <circle cx="320" cy="140" r="18"/>
        <path d="M300 206L312 164H328L340 206Z"/>
        <line x1="306" y1="176" x2="292" y2="198"/>
        <line x1="334" y1="176" x2="348" y2="198"/>
        <line x1="310" y1="206" x2="303" y2="228"/>
        <line x1="330" y1="206" x2="337" y2="228"/>
      </g>
      <text x="365" y="184" font-size="18" font-weight="900">Jessica</text>
    </svg>`;
  }
  function twoSquaresVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 620 360" role="img" aria-label="Large square ABCD with smaller square EFGC, AB is 10 cm, GC is 6 cm, find DE"><rect width="620" height="360" fill="#fff"/>
      <defs>
        <marker id="mo4-q10-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0 0L5 2.5L0 5Z" fill="#213b4d"/>
        </marker>
      </defs>
      <g stroke="#213b4d" stroke-width="3.2" fill="none" stroke-linejoin="round">
        <rect x="146" y="82" width="250" height="250"/>
        <rect x="247" y="183" width="149" height="149" fill="#e9fbf8"/>
      </g>
      <g font-size="24" font-weight="900" fill="#213b4d">
        <text x="112" y="82">A</text>
        <text x="402" y="82">B</text>
        <text x="402" y="349">C</text>
        <text x="112" y="349">D</text>
        <text x="238" y="349">E</text>
        <text x="225" y="181">F</text>
        <text x="404" y="181">G</text>
      </g>
      <g stroke="#213b4d" stroke-width="2.6" fill="none" marker-start="url(#mo4-q10-arrow)" marker-end="url(#mo4-q10-arrow)">
        <line x1="128" y1="63" x2="396" y2="63"/>
        <line x1="415" y1="183" x2="415" y2="332"/>
        <line x1="128" y1="346" x2="247" y2="346"/>
      </g>
      <g font-size="15" font-weight="900" fill="#213b4d">
        <text x="262" y="48" text-anchor="middle">10 cm</text>
        <text x="438" y="263">6 cm</text>
        <text x="188" y="358" text-anchor="middle">?</text>
      </g>
    </svg>`;
  }
  function routeMapVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 660 230" role="img" aria-label="Cycling route map"><rect width="660" height="230" fill="#fff"/><g transform="translate(66 23) scale(0.8)"><circle cx="100" cy="115" r="28" fill="#ffd6a5" stroke="#213b4d" stroke-width="3"/><circle cx="330" cy="80" r="28" fill="#d7eef6" stroke="#213b4d" stroke-width="3"/><circle cx="560" cy="150" r="28" fill="#d3c2f0" stroke="#213b4d" stroke-width="3"/><path d="M128 112C200 50 250 48 302 76M358 85C430 92 480 122 532 148" fill="none" stroke="#008f9c" stroke-width="5"/><text x="100" y="180" text-anchor="middle" font-size="17" font-weight="900">Home</text><text x="330" y="42" text-anchor="middle" font-size="17" font-weight="900">Market</text><text x="560" y="205" text-anchor="middle" font-size="17" font-weight="900">School</text><text x="214" y="62" font-size="16" font-weight="900">10.45 km</text><text x="445" y="113" font-size="16" font-weight="900">2.68 km</text></g></svg>`;
  }
  function areaFigureVisual() {
    return `<svg class="diagram-svg" viewBox="0 0 640 340" role="img" aria-label="T-shaped composite figure with dimensions 4 cm, 5 cm, 4 cm, 8 cm, and 3 cm"><rect width="640" height="340" fill="#fff"/>
      <path d="M190 60H450V220H370V280H270V220H190Z" fill="#fff" stroke="#213b4d" stroke-width="4" stroke-linejoin="miter"/>
      <g stroke="#213b4d" stroke-width="3">
        <line x1="186" y1="302" x2="266" y2="302"/>
        <line x1="274" y1="302" x2="366" y2="302"/>
        <line x1="374" y1="302" x2="454" y2="302"/>
        <line x1="470" y1="66" x2="470" y2="214"/>
        <line x1="470" y1="226" x2="470" y2="274"/>
      </g>
      <g stroke="#213b4d" stroke-width="2">
        <line x1="190" y1="288" x2="190" y2="314"/>
        <line x1="270" y1="288" x2="270" y2="314"/>
        <line x1="370" y1="288" x2="370" y2="314"/>
        <line x1="450" y1="288" x2="450" y2="314"/>
        <line x1="458" y1="60" x2="482" y2="60"/>
        <line x1="458" y1="220" x2="482" y2="220"/>
        <line x1="458" y1="280" x2="482" y2="280"/>
      </g>
      <g font-size="22" font-weight="900" fill="#213b4d">
        <text x="230" y="328" text-anchor="middle">4 cm</text>
        <text x="320" y="328" text-anchor="middle">5 cm</text>
        <text x="410" y="328" text-anchor="middle">4 cm</text>
        <text x="494" y="148">8 cm</text>
        <text x="494" y="258">3 cm</text>
      </g>
    </svg>`;
  }
  function symmetryOption(correct) {
    const right = correct ? "M70 25l35 35-35 35" : "M90 25l20 35-20 35";
    return `<svg viewBox="0 0 140 120" aria-hidden="true"><rect width="140" height="120" fill="#fff"/><line x1="70" y1="12" x2="70" y2="108" stroke="#213b4d" stroke-width="3" stroke-dasharray="6 5"/><path d="M70 25L35 60l35 35" fill="none" stroke="#008f9c" stroke-width="4"/><path d="${right}" fill="none" stroke="#008f9c" stroke-width="4"/></svg>`;
  }
  function shiftedOption() {
    return `<svg viewBox="0 0 140 120" aria-hidden="true"><rect width="140" height="120" fill="#fff"/><line x1="70" y1="12" x2="70" y2="108" stroke="#213b4d" stroke-width="3" stroke-dasharray="6 5"/><path d="M70 25L35 60l35 35" fill="none" stroke="#008f9c" stroke-width="4"/><path d="M84 35l35 35-35 35" fill="none" stroke="#008f9c" stroke-width="4"/></svg>`;
  }
})();
