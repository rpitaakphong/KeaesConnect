import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/igcse-combined-science/combined/paper4";

type Field = Extract<TestQuestion, { type: "multiText" }>["fields"][number];

function image(name: string, alt: string, maxWidth = 500): NonNullable<TestQuestion["visuals"]>[number] {
  return { type: "image", src: `${assetBase}/${name}`, alt, maxWidth };
}

function exact(id: string, accepted: string[], points = 1): AnswerPart {
  return { id, accepted, points, normalizer: "text" };
}

function markingPoint(id: string, keywords: string[][], points = 1): AnswerPart {
  return { id, accepted: [], keywords, points, normalizer: "keywords", reviewRecommended: false };
}

function textQuestion(
  id: string,
  number: number,
  prompt: string,
  points: number,
  parts: AnswerPart[],
  options: {
    display?: string;
    inputMode?: "text" | "number" | "textarea";
    note?: string;
    visuals?: TestQuestion["visuals"];
    visualHtml?: string;
  } = {},
): TestQuestion {
  return {
    id: `cie-igcse-cs-p4-${id}`,
    number,
    prompt,
    points,
    type: "text",
    inputMode: options.inputMode || (parts.some((part) => part.normalizer === "keywords") ? "textarea" : "text"),
    note: options.note,
    visuals: options.visuals,
    visualHtml: options.visualHtml,
    grading: { mode: "auto", display: options.display || parts.flatMap((part) => part.accepted).join(" / "), parts },
  };
}

function multiTextQuestion(
  id: string,
  number: number,
  prompt: string,
  points: number,
  fields: Field[],
  parts: AnswerPart[],
  options: {
    display?: string;
    note?: string;
    visuals?: TestQuestion["visuals"];
    visualHtml?: string;
    compact?: boolean;
    answerTable?: Extract<TestQuestion, { type: "multiText" }>["answerTable"];
    scoreThresholds?: Array<{ minCorrect: number; points: number }>;
  } = {},
): TestQuestion {
  return {
    id: `cie-igcse-cs-p4-${id}`,
    number,
    prompt,
    points,
    type: "multiText",
    fields,
    compact: options.compact,
    answerTable: options.answerTable,
    note: options.note,
    visuals: options.visuals,
    visualHtml: options.visualHtml,
    grading: {
      mode: "auto",
      display: options.display || parts.flatMap((part) => part.accepted).join(" / "),
      parts,
      scoreThresholds: options.scoreThresholds,
    },
  };
}

function singleChoice(
  id: string,
  number: number,
  prompt: string,
  choices: string[],
  correct: string,
  options: { display?: string; visuals?: TestQuestion["visuals"]; visualHtml?: string } = {},
): TestQuestion {
  return {
    id: `cie-igcse-cs-p4-${id}`,
    number,
    prompt,
    points: 1,
    type: "singleChoice",
    choices: choices.map((label) => ({ value: label, label })),
    visuals: options.visuals,
    visualHtml: options.visualHtml,
    grading: { mode: "auto", display: options.display || correct, parts: [exact("answer", [correct])] },
  };
}

function table(headers: string[], rows: string[][]) {
  return [
    '<div class="cambridge-table-visual">',
    '<table class="cambridge-data-table">',
    `<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>`,
    `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`,
    "</table>",
    "</div>",
  ].join("");
}

const table21 = table(
  ["test-tube", "conditions", "colour at start", "colour after one hour"],
  [
    ["A", "dark", "red", "yellow"],
    ["B", "light", "red", "red"],
    ["C", "light", "red", "purple"],
  ],
);

const table51 = table(
  ["", "aluminium", "copper"],
  [
    ["density in g / cm<sup>3</sup>", "2.7", "8.9"],
    ["melting point / °C", "660", "1084"],
    ["electrical conductivity", "high", "high"],
    ["other information", "forms a protective aluminium oxide layer", "some copper compounds are toxic"],
  ],
);

const questions: TestQuestion[] = [
  textQuestion(
    "q1a",
    1,
    "(a) Explain why washing hands before handling food is important for controlling the spread of disease.",
    2,
    [
      markingPoint("answer", [["pathogen", "disease"], ["microorganism", "disease"]]),
      markingPoint("answer", [["remove", "pathogen"], ["stop", "spread"], ["prevent", "food", "pathogen"], ["hygiene"]]),
    ],
    { display: "Pathogens spread disease; washing removes them and prevents their spread to food.", visuals: [image("q1-hygiene-sign.png", "Wash your hands before handling food sign", 230)] },
  ),
  textQuestion(
    "q1bi",
    1,
    "(b)(i) Describe two differences between the antibody response after the initial vaccination and after the booster vaccination.",
    2,
    [
      markingPoint("answer", [["initial", "fewer", "antibod"], ["booster", "more", "antibod"], ["initial", "lower", "peak"]]),
      markingPoint("answer", [["initial", "slower"], ["booster", "faster"], ["initial", "decrease", "faster"], ["initial", "lower", "after"]]),
    ],
    { display: "The initial response is slower and produces fewer antibodies; antibody levels also fall faster and lower.", visuals: [image("q1-antibody-response.png", "Antibody response after initial and booster vaccinations", 500)] },
  ),
  singleChoice("q1bii", 1, "(b)(ii) Select the term that describes the response shown.", ["phagocytosis", "assimilation", "active immunity", "transmissible disease"], "active immunity"),
  textQuestion(
    "q1c",
    1,
    "(c) Explain how platelets in the blood help defend the body against disease.",
    2,
    [markingPoint("answer", [["platelet", "clot"], ["form", "clot"]]), markingPoint("answer", [["clot", "seal"], ["prevent", "pathogen", "entry"], ["stop", "pathogen", "enter"]])],
    { display: "Platelets form a clot that seals the wound and prevents pathogen entry." },
  ),
  textQuestion("q1di", 1, "(d)(i) State the name of the arteries in the heart that may become blocked in heart disease.", 1, [exact("answer", ["coronary", "coronary artery", "coronary arteries"])]),
  textQuestion("q1dii", 1, "(d)(ii) State the name of the blood component that transports oxygen.", 1, [exact("answer", ["red blood cell", "red blood cells", "erythrocyte", "erythrocytes"])], { display: "red blood cells" }),

  {
    id: "cie-igcse-cs-p4-q2ai",
    number: 2,
    prompt: "(a)(i) Select the two substances transported by cells Q.",
    points: 1,
    type: "multiChoice",
    choices: ["amino acids", "fatty acids", "glycerol", "glucose", "nitrate ions", "starch", "sucrose"].map((label) => ({ value: label, label })),
    visuals: [image("q2-stem.png", "Section through a plant stem showing cells Q and xylem", 470)],
    grading: { mode: "auto", display: "amino acids; sucrose", parts: [{ id: "selected", accepted: ["amino acids", "sucrose"], points: 1, normalizer: "set" }] },
  },
  textQuestion("q2aii", 2, "(a)(ii) State one function of xylem other than transport.", 1, [exact("answer", ["support", "supporting the plant", "structural support"])], { display: "support" }),
  textQuestion(
    "q2b",
    2,
    "(b) State the balanced symbol equation for photosynthesis.",
    2,
    [
      markingPoint("answer", [["6co2", "6h2o"], ["6 co2", "6 h2o"]]),
      markingPoint("answer", [["c6h12o6", "6o2"], ["c6h12o6", "6 o2"]]),
    ],
    { display: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" },
  ),
  textQuestion(
    "q2c",
    2,
    "(c) Explain the results for test-tube A and test-tube C. Use the words respiration and photosynthesis.",
    4,
    [
      markingPoint("answer", [["a", "carbon dioxide", "respiration"], ["dark", "carbon dioxide", "respiration"]]),
      markingPoint("answer", [["a", "no", "photosynthesis"], ["dark", "no", "photosynthesis"], ["photosynthesis", "light"]]),
      markingPoint("answer", [["c", "carbon dioxide", "photosynthesis"], ["purple", "carbon dioxide", "photosynthesis"]]),
      markingPoint("answer", [["photosynthesis", "higher", "respiration"], ["photosynthesis", "greater", "respiration"], ["photosynthesis", "faster", "respiration"]]),
    ],
    {
      display: "A: respiration releases CO₂ and darkness prevents photosynthesis. C: photosynthesis uses CO₂ faster than respiration releases it.",
      visuals: [image("q2-gas-exchange.png", "Aquatic plant gas-exchange test-tubes A, B and C", 500)],
      visualHtml: table21,
    },
  ),
  textQuestion(
    "q2d",
    2,
    "(d) Explain the effect of deforestation on biodiversity.",
    2,
    [
      markingPoint("answer", [["less", "food"], ["fewer", "food"]]),
      markingPoint("answer", [["species", "extinct"], ["remove", "habitat"], ["loss", "habitat"], ["remove", "shelter"]]),
    ],
    { display: "It removes habitats and food, so some species may become extinct." },
  ),

  textQuestion("q3ai", 3, "(a)(i) State the function of part X in the digestive system.", 1, [exact("answer", ["egestion", "egest faeces", "egest feces"])], { display: "egestion", visuals: [image("q3-digestive-system.png", "Human digestive system with parts X and Y labelled", 350)] }),
  multiTextQuestion(
    "q3aii",
    3,
    "(a)(ii) Complete the sentences about part Y and digestion of fats and oils.",
    3,
    [
      { id: "organ", label: "Part Y" },
      { id: "enzyme", label: "Enzyme released" },
      { id: "products", label: "Products of fat digestion" },
    ],
    [exact("organ", ["pancreas"]), exact("enzyme", ["lipase"]), exact("products", ["fatty acids and glycerol", "glycerol and fatty acids", "fatty acid and glycerol"])],
    { display: "pancreas; lipase; fatty acids and glycerol", compact: true },
  ),
  textQuestion(
    "q3bi",
    3,
    "(b)(i) The enzyme shown is active in the mouth. Explain why its activity changes when it reaches the stomach.",
    3,
    [
      markingPoint("answer", [["stomach", "acid"], ["stomach", "lower", "ph"]]),
      markingPoint("answer", [["active site", "change", "shape"], ["enzyme", "denature"]]),
      markingPoint("answer", [["substrate", "no longer", "fit"], ["not", "complementary"], ["enzyme substrate", "no longer", "form"]]),
    ],
    { display: "The stomach's lower pH changes the active-site shape, so the substrate no longer fits.", visuals: [image("q3-enzyme-graph.png", "Graph of enzyme activity against pH", 500)] },
  ),
  {
    id: "cie-igcse-cs-p4-q3bii",
    number: 3,
    prompt: "(b)(ii) Draw a curve on Fig. 3.2 to show the activity of a protease enzyme found in the stomach.",
    points: 1,
    type: "diagramAnnotation",
    variant: "curve",
    backgroundSrc: `${assetBase}/q3-enzyme-graph.png`,
    backgroundAlt: "Graph of enzyme activity against pH",
    geometry: {
      variant: "curve",
      plot: { minX: 0.16, maxX: 0.92, minY: 0.06, maxY: 0.87 },
      optimum: { minX: 0.235, maxX: 0.39 },
      baselineTolerance: 0.18,
    },
  },

  textQuestion(
    "q4ai",
    4,
    "(a)(i) Define activation energy.",
    1,
    [markingPoint("answer", [["minimum", "energy", "colliding", "particles", "react"], ["minimum", "energy", "collision", "reaction"]])],
    { display: "the minimum energy that colliding particles must have to react", visuals: [image("q4-reaction-pathways.png", "Reaction pathway diagrams for reactions 1 and 2", 540)] },
  ),
  {
    id: "cie-igcse-cs-p4-q4aii",
    number: 4,
    prompt: "(a)(ii) Draw and label an arrow to show the activation energy for reaction 2.",
    points: 1,
    type: "diagramAnnotation",
    variant: "arrow",
    backgroundSrc: `${assetBase}/q4-reaction-pathways.png`,
    backgroundAlt: "Reaction pathway diagrams for reactions 1 and 2",
    geometry: {
      variant: "arrow",
      start: { x: 0.775, y: 0.54 },
      peak: { x: 0.775, y: 0.06 },
      endpointTolerance: 0.1,
      labelTolerance: 0.15,
    },
  },
  textQuestion(
    "q4b",
    4,
    "(b) State how the temperature changes during reaction 2 and give a reason.",
    1,
    [markingPoint("answer", [["temperature", "decrease", "endothermic"], ["temperature", "decrease", "takes in", "thermal"], ["temperature", "decrease", "products", "more", "energy"]])],
    { display: "The temperature decreases because the reaction is endothermic and takes in thermal energy." },
  ),
  {
    id: "cie-igcse-cs-p4-q4ci",
    number: 4,
    prompt: "(c)(i) Calcium carbonate reacts with dilute hydrochloric acid to produce calcium chloride. Select the other two products.",
    points: 2,
    type: "multiChoice",
    choices: ["carbon dioxide", "hydrogen", "oxygen", "water"].map((label) => ({ value: label, label })),
    grading: {
      mode: "auto",
      display: "carbon dioxide and water",
      parts: [{ id: "selected", accepted: ["carbon dioxide", "water"], points: 2, normalizer: "set" }],
    },
  },
  textQuestion(
    "q4cii",
    4,
    "(c)(ii) Explain, using particle collisions and energy, why increasing the temperature increases the rate of reaction.",
    2,
    [
      markingPoint("answer", [["collision", "more", "frequent"], ["collision", "frequency", "increase"]]),
      markingPoint("answer", [["more", "particles", "activation", "energy"], ["more", "successful", "collision"], ["more", "energetic", "collision"]]),
    ],
    { display: "Collisions occur more frequently and more particles have energy above the activation energy." },
  ),

  textQuestion("q5ai", 5, "(a)(i) Use Table 5.1 to state why aluminium and copper are used in electrical cables.", 1, [markingPoint("answer", [["high", "electrical", "conductivity"], ["good", "conductor"]])], { display: "high electrical conductivity", visualHtml: table51 }),
  textQuestion("q5aii", 5, "(a)(ii) Use Table 5.1 to state why aluminium is used in overhead electrical cables.", 1, [markingPoint("answer", [["aluminium", "lower", "density"], ["aluminium", "light"], ["low", "density"]])], { display: "Aluminium has a low density and is lightweight." }),
  textQuestion("q5aiii", 5, "(a)(iii) Use Table 5.1 to state why copper is not used to make food containers.", 1, [markingPoint("answer", [["copper", "compound", "toxic"], ["aluminium", "not", "corrode"], ["aluminium", "protective", "oxide"]])], { display: "Some copper compounds are toxic." }),
  textQuestion("q5bi", 5, "(b)(i) State what is meant by an alloy.", 1, [markingPoint("answer", [["mixture", "metal", "element"], ["metal", "mixed", "other", "element"]])], { display: "a mixture of a metal with one or more other elements", visuals: [image("q5-alloy-particles.png", "Particle arrangements in pure iron and steel", 500)] }),
  textQuestion(
    "q5bii",
    5,
    "(b)(ii) Explain why steel is stronger than pure iron.",
    2,
    [
      markingPoint("answer", [["different", "size", "particles"], ["different", "size", "atoms"]]),
      markingPoint("answer", [["stop", "layers", "sliding"], ["prevent", "layers", "slide"], ["difficult", "layers", "slide"]]),
    ],
    { display: "Different-sized particles prevent the layers from sliding over each other." },
  ),
  textQuestion("q5biii", 5, "(b)(iii) Stainless steel is used to make cutlery because it is strong. State one other reason why it is used for cutlery.", 1, [markingPoint("answer", [["hard"], ["resistant", "rust"], ["does not", "corrode"]])], { display: "hard / resistant to rusting / does not corrode" }),
  multiTextQuestion(
    "q5c",
    5,
    "(c) Select the principal method used to extract each metal from its ore.",
    2,
    [
      { id: "aluminium", label: "Aluminium", options: [{ value: "electrolysis", label: "Electrolysis" }, { value: "carbon", label: "Heating with carbon" }] },
      { id: "copper", label: "Copper", options: [{ value: "electrolysis", label: "Electrolysis" }, { value: "carbon", label: "Heating with carbon" }] },
      { id: "iron", label: "Iron", options: [{ value: "electrolysis", label: "Electrolysis" }, { value: "carbon", label: "Heating with carbon" }] },
    ],
    [exact("aluminium", ["electrolysis"]), exact("copper", ["carbon"]), exact("iron", ["carbon"])],
    { display: "aluminium: electrolysis; copper and iron: heating with carbon", scoreThresholds: [{ minCorrect: 2, points: 1 }, { minCorrect: 3, points: 2 }] },
  ),

  textQuestion(
    "q6a",
    6,
    "(a) Exhaust emissions contain carbon dioxide, carbon monoxide and carbon particulates. Describe how each of these three substances forms in a car engine.",
    2,
    [
      markingPoint("answer", [["carbon monoxide", "carbon particulate", "incomplete combustion"], ["carbon monoxide", "soot", "incomplete combustion"]]),
      markingPoint("answer", [["carbon dioxide", "complete combustion"]]),
    ],
    { display: "Carbon monoxide and carbon particulates form by incomplete combustion; carbon dioxide forms by complete combustion." },
  ),
  multiTextQuestion(
    "q6b",
    6,
    "(b) Complete the state symbols in the combustion equations: CO₂(__), CO(__), C(__), C₈H₁₈(__).",
    2,
    [
      { id: "gases", label: "State symbols for CO₂ and CO, in order" },
      { id: "solidLiquid", label: "State symbols for C and C₈H₁₈, in order" },
    ],
    [
      exact("gases", ["g, g", "g g", "g,g"]),
      exact("solidLiquid", ["s, l", "s l", "s,l"]),
    ],
    { display: "CO₂(g), CO(g), C(s), C₈H₁₈(l)", compact: true },
  ),
  textQuestion("q6ci", 6, "(c)(i) Carbon dioxide contains two double bonds. Explain why carbon dioxide is not an unsaturated molecule.", 1, [markingPoint("answer", [["double", "bond", "not", "two", "carbon"], ["double", "bond", "between", "carbon", "oxygen"], ["only", "one", "carbon"]])], { display: "The double bonds are not between two carbon atoms.", visualHtml: '<div class="science-equation">O=C=O</div>' }),
  textQuestion(
    "q6cii",
    6,
    "(c)(ii) Suggest two actions that reduce the effect of carbon dioxide emissions on the environment.",
    2,
    [
      markingPoint("answer", [["reduce", "deforestation"], ["plant", "trees"], ["reduce", "livestock"]]),
      markingPoint("answer", [["reduce", "fossil", "fuel"], ["renewable"], ["wind"], ["solar"], ["hydrogen"]]),
    ],
    { display: "Reduce deforestation and fossil-fuel use; increase renewable energy." },
  ),
  textQuestion("q6di", 6, "(d)(i) Complete and balance the equation: CO + NO → CO₂ + N₂.", 1, [exact("answer", ["2co + 2no -> 2co2 + n2", "2co+2no->2co2+n2", "2CO + 2NO → 2CO2 + N2"])], { display: "2CO + 2NO → 2CO₂ + N₂" }),
  textQuestion(
    "q6dii",
    6,
    "(d)(ii) Explain how removing oxides of nitrogen from exhaust gases reduces harm to the environment.",
    2,
    [markingPoint("answer", [["acid", "rain"]]), markingPoint("answer", [["nitrogen", "oxide", "remove"], ["no", "removed"], ["less", "nitrogen", "oxide"]])],
    { display: "Removing oxides of nitrogen reduces acid rain." },
  ),

  textQuestion("q7ai", 7, "(a)(i) Determine the time taken by the student to reach maximum speed.", 1, [exact("answer", ["40", "40 s", "40 seconds"])], { display: "40 s", inputMode: "number", visuals: [image("q7-speed-time-graph.png", "Speed-time graph for a student walking to school", 540)] }),
  {
    id: "cie-igcse-cs-p4-q7aii",
    number: 7,
    prompt: "(a)(ii) Place X at a point on the graph when the student is decelerating.",
    points: 1,
    type: "diagramAnnotation",
    variant: "point",
    backgroundSrc: `${assetBase}/q7-speed-time-graph.png`,
    backgroundAlt: "Speed-time graph for a student walking to school",
    geometry: {
      variant: "point",
      segment: { start: { x: 0.84, y: 0.11 }, end: { x: 0.98, y: 0.77 } },
      tolerance: 0.045,
    },
  },
  multiTextQuestion(
    "q7aiii",
    7,
    "(a)(iii) Determine the distance the student walks at constant speed.",
    3,
    [{ id: "data", label: "Graph values used" }, { id: "working", label: "Formula or working" }, { id: "answer", label: "Final distance (m)" }],
    [
      markingPoint("data", [["1.5", "60"], ["40", "100"], ["constant", "1.5"]]),
      markingPoint("working", [["distance", "speed", "time"], ["1.5", "60"], ["area"]]),
      { id: "answer", accepted: ["90", "90 m"], points: 3, normalizer: "text" },
    ],
    { display: "1.5 × 60 = 90 m" },
  ),
  multiTextQuestion(
    "q7b",
    7,
    "(b) A student of mass 55 kg climbs 0.15 m. Calculate the increase in gravitational potential energy.",
    3,
    [{ id: "formula", label: "Formula or working" }, { id: "answer", label: "Final answer" }, { id: "unit", label: "Unit" }],
    [
      markingPoint("formula", [["mgh"], ["55", "9.8", "0.15"], ["mass", "gravity", "height"]]),
      { id: "answer", accepted: ["81", "80.9", "80.85"], points: 2, normalizer: "text" },
      exact("unit", ["j", "joule", "joules"]),
    ],
    { display: "55 × 9.8 × 0.15 = 81 J" },
  ),

  textQuestion("q8ai", 8, "(a)(i) State the region of the electromagnetic spectrum with the main effect that warms the Earth.", 1, [exact("answer", ["infrared", "infra-red", "ir"])], { display: "infrared" }),
  multiTextQuestion(
    "q8aii",
    8,
    "(a)(ii) Complete the explanation of global warming by selecting the correct term for each blank.",
    1,
    [
      { id: "first", label: "Thermal energy is...", options: [{ value: "absorbed", label: "absorbed" }, { value: "reflected", label: "reflected" }] },
      { id: "second", label: "Energy absorbed is...", options: [{ value: "greater than", label: "greater than" }, { value: "less than", label: "less than" }] },
      { id: "third", label: "Energy that is...", options: [{ value: "emitted", label: "emitted" }, { value: "stored", label: "stored" }] },
    ],
    [exact("first", ["absorbed"]), exact("second", ["greater than"]), exact("third", ["emitted"])],
    { display: "absorbed; greater than; emitted", scoreThresholds: [{ minCorrect: 3, points: 1 }] },
  ),
  textQuestion("q8bi", 8, "(b)(i) State the type of wave that requires a medium to travel.", 1, [exact("answer", ["sound", "sound wave", "sound waves"])], { display: "sound" }),
  textQuestion(
    "q8bii",
    8,
    "(b)(ii) Describe the difference between transverse and longitudinal waves in terms of the direction of vibrations.",
    2,
    [
      markingPoint("answer", [["transverse", "perpendicular"], ["transverse", "right angle"]]),
      markingPoint("answer", [["longitudinal", "parallel"]]),
    ],
    { display: "Transverse vibrations are perpendicular to propagation; longitudinal vibrations are parallel." },
  ),
  multiTextQuestion(
    "q8c",
    8,
    "(c) The Earth orbits the Sun at radius 1.51 × 10⁸ km in 365.25 days. Calculate its average speed in km/h.",
    3,
    [{ id: "time", label: "Time conversion or value (h)" }, { id: "formula", label: "Formula or working" }, { id: "answer", label: "Final speed (km/h)" }],
    [
      markingPoint("time", [["365.25", "24"], ["8766"]]),
      markingPoint("formula", [["2", "pi", "radius", "time"], ["circumference", "time"], ["2πr", "t"]]),
      { id: "answer", accepted: ["108000", "1.08 x 10^5", "1.08 × 10^5", "1.08e5"], points: 3, normalizer: "text" },
    ],
    { display: "1.08 × 10⁵ km/h" },
  ),
  textQuestion("q8di", 8, "(d)(i) State the stage after the main-sequence stage in the life cycle of the Sun.", 1, [exact("answer", ["red giant"])], { display: "red giant" }),
  textQuestion("q8dii", 8, "(d)(ii) Explain why the Sun will not become a black hole.", 1, [markingPoint("answer", [["not", "massive", "enough"], ["small", "mass"], ["insufficient", "mass"], ["only", "massive", "star", "black hole"]])], { display: "The Sun does not have enough mass; only very massive stars become black holes." }),

  textQuestion("q9ai", 9, "(a)(i) Components T and U have resistances 5.4 Ω and 3.5 Ω. Calculate their combined resistance.", 1, [exact("answer", ["8.9", "8.9 ohm", "8.9 Ω"])], { display: "8.9 Ω", visuals: [image("q9-circuit.png", "Circuit used in a toy car with components P to U", 380)] }),
  multiTextQuestion(
    "q9aii",
    9,
    "(a)(ii) The current in R is 2.7 A and in T is 2.5 A. Determine the current in S and U.",
    2,
    [{ id: "s", label: "Current in S (A)" }, { id: "u", label: "Current in U (A)" }],
    [exact("s", ["0.2", "0.2 a"]), exact("u", ["2.5", "2.5 a"])],
    { display: "S = 0.2 A; U = 2.5 A", compact: true },
  ),
  textQuestion("q9aiii", 9, "(a)(iii) State the name of component S.", 1, [exact("answer", ["light emitting diode", "light-emitting diode", "led"])], { display: "light-emitting diode (LED)" }),
  multiTextQuestion(
    "q9bi",
    9,
    "(b)(i) Complete the energy-transfer diagram for the toy car: ___ energy in the battery → ___ energy of the car.",
    2,
    [{ id: "input", label: "Energy in the battery" }, { id: "output", label: "Energy of the moving car" }],
    [exact("input", ["chemical", "chemical energy"]), exact("output", ["kinetic", "kinetic energy"])],
    { display: "chemical energy → kinetic energy", compact: true },
  ),
  multiTextQuestion(
    "q9bii",
    9,
    "(b)(ii) The car transfers 32 J of useful energy in 10 s and the battery power is 3.6 W. Calculate the efficiency.",
    3,
    [{ id: "power", label: "Useful power calculation" }, { id: "formula", label: "Efficiency formula or working" }, { id: "answer", label: "Final efficiency (%)" }],
    [
      markingPoint("power", [["32", "10"], ["3.2"], ["power", "energy", "time"]]),
      markingPoint("formula", [["3.2", "3.6", "100"], ["useful", "power", "input", "power"]]),
      { id: "answer", accepted: ["88.9", "88.9%", "88.89", "88.888"], points: 3, normalizer: "text" },
    ],
    { display: "3.2 ÷ 3.6 × 100 = 88.9%" },
  ),
];

export const cieIgcseCombinedSciencePaper4Extended: TestDefinition = {
  id: "cie-igcse-combined-science-paper-4-extended",
  title: "CIE IGCSE Combined Science Paper 4 Extended",
  subject: "Combined Science",
  level: "Extended",
  totalPoints: 80,
  status: "active",
  durationMinutes: 75,
  sections: [
    {
      id: "biology",
      label: "Biology 1–3",
      title: "Biology",
      hint: "Answer all parts of Questions 1–3.",
      groupByQuestionNumber: true,
      questions: questions.filter((question) => question.number <= 3),
    },
    {
      id: "chemistry",
      label: "Chemistry 4–6",
      title: "Chemistry",
      hint: "Answer all parts of Questions 4–6.",
      groupByQuestionNumber: true,
      questions: questions.filter((question) => question.number >= 4 && question.number <= 6),
    },
    {
      id: "physics",
      label: "Physics 7–9",
      title: "Physics",
      hint: "Answer all parts of Questions 7–9. Show working and include units where requested.",
      groupByQuestionNumber: true,
      questions: questions.filter((question) => question.number >= 7),
    },
  ],
};
