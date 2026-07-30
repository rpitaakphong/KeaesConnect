import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/igcse-combined-science/combined/paper3";

type Field = { id: string; label: string; placeholder?: string };

function image(name: string, alt: string, maxWidth = 520): NonNullable<TestQuestion["visuals"]>[number] {
  return { type: "image", src: `${assetBase}/${name}`, alt, maxWidth };
}

function exact(id: string, accepted: string[], points = 1): AnswerPart {
  return { id, accepted, points, normalizer: "text" };
}

function markingPoint(id: string, keywords: string[][], points = 1): AnswerPart {
  return { id, accepted: [], keywords, points, normalizer: "keywords", reviewRecommended: true };
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
    id: `cie-igcse-cs-p3-${id}`,
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
    id: `cie-igcse-cs-p3-${id}`,
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

const table91 = table(
  ["", "aluminium", "ethanol", "poly(ethene)", "sulfur", "water"],
  [
    ["density in g / cm<sup>3</sup>", "2.7", "0.8", "0.9", "2.0", "1.0"],
    ["state at 25 °C", "solid", "liquid", "solid", "solid", "liquid"],
    ["electrical property", "conductor", "insulator", "", "insulator", "insulator"],
  ],
);

const questions: TestQuestion[] = [
  multiTextQuestion(
    "q1a",
    1,
    "(a) Complete Table 1.1 for the labelled animal and plant cells.",
    4,
    [
      { id: "aName", label: "Name of structure A" },
      { id: "dFunction", label: "Function of mitochondria D" },
      { id: "vacuoleLetter", label: "Letter for the vacuole" },
      { id: "vacuoleFunction", label: "Function of the vacuole" },
    ],
    [
      exact("aName", ["cell membrane", "cell surface membrane"]),
      markingPoint("dFunction", [["aerobic", "respiration"], ["site", "respiration"]]),
      exact("vacuoleLetter", ["G"]),
      markingPoint("vacuoleFunction", [["support"], ["storage"], ["stores", "cell sap"]]),
    ],
    {
      display: "A: cell membrane; D: site of aerobic respiration; G: support (storage accepted)",
      visuals: [image("paper3-q01-cells.png", "Animal and plant cells labelled A to G", 500)],
      answerTable: {
        headers: ["Letter", "Name of structure", "Function"],
        rows: [
          { cells: [{ text: "A" }, { type: "input", id: "aName" }, { text: "controls movement into and out of cells" }] },
          { cells: [{ text: "D" }, { text: "mitochondria" }, { type: "input", id: "dFunction" }] },
          { cells: [{ type: "input", id: "vacuoleLetter" }, { text: "vacuole" }, { type: "input", id: "vacuoleFunction" }] },
        ],
      },
    },
  ),
  multiTextQuestion(
    "q1b",
    1,
    "(b) Complete the order of increasing size between cell and organism using organ, organ system and tissue.",
    2,
    [
      { id: "first", label: "First after cell" },
      { id: "second", label: "Second" },
      { id: "third", label: "Third" },
    ],
    [exact("first", ["tissue"]), exact("second", ["organ"]), exact("third", ["organ system"])],
    {
      display: "cell → tissue → organ → organ system → organism",
      compact: true,
      scoreThresholds: [{ minCorrect: 2, points: 1 }, { minCorrect: 3, points: 2 }],
    },
  ),
  textQuestion("q1ci", 1, "(c)(i) State the name of an upper chamber of the heart.", 1, [exact("answer", ["atrium", "atria"])], { display: "atrium / atria" }),
  textQuestion("q1cii", 1, "(c)(ii) State the type of blood vessel that transports blood to the heart.", 1, [exact("answer", ["vein", "veins"])], { display: "vein" }),
  textQuestion(
    "q1ciii",
    1,
    "(c)(iii) State the function of red blood cells.",
    1,
    [markingPoint("answer", [["transport", "oxygen"], ["carry", "oxygen"]])],
    { display: "transport oxygen" },
  ),
  textQuestion(
    "q1d",
    1,
    "(d) State one other way, apart from white blood cells, that the human body defends itself against pathogens.",
    1,
    [markingPoint("answer", [["skin"], ["hair", "nose"], ["mucus"], ["stomach", "acid"]])],
    { display: "skin / hairs in the nose / mucus / stomach acid" },
  ),

  multiTextQuestion(
    "q2ai",
    2,
    "(a)(i) Complete the sentences to explain the iodine-test results. Only plant X contains ___, showing that photosynthesis requires ___.",
    2,
    [{ id: "substance", label: "Substance in plant X" }, { id: "requirement", label: "Required substance" }],
    [exact("substance", ["starch"]), exact("requirement", ["carbon dioxide", "co2"])],
    {
      display: "starch; carbon dioxide",
      visuals: [
        image("paper3-q02-photosynthesis-setup.png", "Plants X and Y in clear bags with different carbon dioxide conditions", 540),
        image("paper3-q02-iodine-results.png", "Iodine test results for plants X and Y", 520),
      ],
      compact: true,
    },
  ),
  textQuestion("q2aii", 2, "(a)(ii) State the name of the green pigment needed for photosynthesis.", 1, [exact("answer", ["chlorophyll"])]),
  textQuestion(
    "q2bi",
    2,
    "(b)(i) Identify the temperature at which the rate of photosynthesis for plant Q is highest.",
    1,
    [exact("answer", ["28", "29", "30", "28 c", "29 c", "30 c", "28 °c", "29 °c", "30 °c"])],
    { display: "28–30 °C", inputMode: "number", visuals: [image("paper3-q02-temperature-graph.png", "Graph of photosynthesis rate against temperature for plants R, Q and S", 540)] },
  ),
  textQuestion(
    "q2bii",
    2,
    "(b)(ii) Desert temperatures are often higher than 40 °C. Explain why plant S would not survive in a desert. Use the word enzyme.",
    2,
    [
      markingPoint("answer", [["enzyme", "lower", "temperature"], ["enzyme", "stop"], ["enzyme", "denature"]]),
      markingPoint("answer", [["no", "photosynthesis"], ["no", "glucose"], ["no", "sugar"], ["no", "carbohydrate"]]),
    ],
    { display: "Its enzyme stops working above its optimum, so photosynthesis and glucose production stop." },
  ),
  textQuestion(
    "q2ci",
    2,
    "(c)(i) Identify part X on the carpel.",
    1,
    [exact("answer", ["stigma"])],
    { visuals: [image("paper3-q02-carpel.png", "Carpel from an insect-pollinated flower with part X labelled", 360)] },
  ),
  textQuestion(
    "q2cii",
    2,
    "(c)(ii) Describe fertilisation in an ovule.",
    1,
    [markingPoint("answer", [["pollen", "nucleus", "fuses", "nucleus", "ovule"], ["male", "nucleus", "fuses", "female", "nucleus"]])],
    { display: "A pollen nucleus fuses with a nucleus in the ovule." },
  ),

  textQuestion(
    "q3ai",
    3,
    "(a)(i) Identify the producer in the food web.",
    1,
    [exact("answer", ["phytoplankton"])],
    { visuals: [image("paper3-q03-food-web.png", "Food web containing fox, puffin, fish, squid, zooplankton and phytoplankton", 430)] },
  ),
  {
    id: "cie-igcse-cs-p3-q3aii",
    number: 3,
    prompt: "(a)(ii) Select each term that describes the puffin in the food web.",
    points: 2,
    type: "multiChoice",
    choices: ["carnivore", "herbivore", "primary consumer", "secondary consumer", "tertiary consumer"].map((label) => ({ value: label, label })),
    grading: {
      mode: "auto",
      display: "carnivore; tertiary consumer",
      parts: [
        { id: "selected", accepted: ["carnivore"], points: 1, normalizer: "contains" },
        { id: "selected", accepted: ["tertiary consumer"], points: 1, normalizer: "contains" },
      ],
    },
  },
  textQuestion(
    "q3aiii",
    3,
    "(a)(iii) Pollution can kill squid. Explain how this may reduce the number of foxes.",
    2,
    [
      markingPoint("answer", [["less", "squid", "puffin"], ["fewer", "squid", "puffin"], ["puffin", "less", "food"]]),
      markingPoint("answer", [["less", "puffin", "fox"], ["fewer", "puffin", "fox"], ["fox", "less", "food"]]),
    ],
    { display: "Puffins have less squid to eat, then foxes have fewer puffins to eat." },
  ),
  multiTextQuestion(
    "q3aiv",
    3,
    "(a)(iv) State two reasons, other than pollution, why squid may become endangered.",
    2,
    [{ id: "reason1", label: "Reason 1" }, { id: "reason2", label: "Reason 2" }],
    [
      markingPoint("reason1", [["climate", "change"], ["habitat", "destruction"], ["hunting"], ["overharvesting"], ["introduced", "species"]]),
      markingPoint("reason2", [["climate", "change"], ["habitat", "destruction"], ["hunting"], ["overharvesting"], ["introduced", "species"]]),
    ],
    { display: "Any two approved causes, such as climate change and overharvesting." },
  ),
  multiTextQuestion(
    "q3b",
    3,
    "(b) Complete the definition: A decomposer gets its ___ from dead or waste ___ material.",
    2,
    [{ id: "first", label: "First blank" }, { id: "second", label: "Second blank" }],
    [exact("first", ["energy"]), exact("second", ["organic"])],
    { display: "energy; organic", compact: true },
  ),

  textQuestion(
    "q4a",
    4,
    "(a) State the name of the positive electrode in the electrolysis apparatus.",
    1,
    [exact("answer", ["anode"])],
    { visuals: [image("paper3-q04-electrolysis.png", "Electrolysis of concentrated aqueous sodium chloride using inert electrodes", 470)] },
  ),
  multiTextQuestion(
    "q4b",
    4,
    "(b) Identify the gases produced at the positive and negative electrodes.",
    2,
    [{ id: "positive", label: "Positive electrode" }, { id: "negative", label: "Negative electrode" }],
    [exact("positive", ["chlorine", "cl2"]), exact("negative", ["hydrogen", "h2"])],
    { display: "positive: chlorine; negative: hydrogen", compact: true },
  ),
  textQuestion(
    "q4ci",
    4,
    "(c)(i) State what is meant by an alkali.",
    1,
    [markingPoint("answer", [["soluble", "base"], ["soluble", "metal", "oxide"], ["soluble", "metal", "hydroxide"]])],
    { display: "a soluble base" },
  ),
  textQuestion("q4cii", 4, "(c)(ii) Methyl orange changes from orange to which colour in an alkali?", 1, [exact("answer", ["yellow"])]),
  multiTextQuestion(
    "q4di",
    4,
    "(d)(i) Complete the word equation: sodium hydroxide + sulfuric acid → ___ + ___.",
    1,
    [{ id: "product1", label: "First product" }, { id: "product2", label: "Second product" }],
    [
      { id: "product1", accepted: ["sodium sulfate"], points: 0.5, normalizer: "text" },
      { id: "product2", accepted: ["water"], points: 0.5, normalizer: "text" },
    ],
    { display: "sodium sulfate + water", compact: true, scoreThresholds: [{ minCorrect: 2, points: 1 }] },
  ),
  textQuestion(
    "q4dii",
    4,
    "(d)(ii) State what is meant by an exothermic reaction.",
    2,
    [
      markingPoint("answer", [["thermal", "energy", "surroundings"], ["heat", "surroundings"]]),
      markingPoint("answer", [["surroundings", "temperature", "increase"], ["surroundings", "warmer"]]),
    ],
    { display: "Thermal energy is transferred to the surroundings, increasing their temperature." },
  ),

  multiTextQuestion(
    "q5a",
    5,
    "(a) State one use of refinery gas and one use of gasoline.",
    2,
    [{ id: "refineryGas", label: "Refinery gas" }, { id: "gasoline", label: "Gasoline" }],
    [
      markingPoint("refineryGas", [["heating"], ["cooking"]]),
      markingPoint("gasoline", [["car"], ["van"], ["lorry"], ["vehicle"], ["fuel"]]),
    ],
    {
      display: "refinery gas: heating/cooking; gasoline: fuel for cars, vans or lorries",
      visuals: [image("paper3-q05-fractional-distillation.png", "Fractional distillation of petroleum", 390)],
    },
  ),
  textQuestion(
    "q5bi",
    5,
    "(b)(i) State the molecular formula of hydrocarbon A.",
    1,
    [exact("answer", ["c3h8", "C3H8"])],
    { display: "C3H8", visuals: [image("paper3-q05-hydrocarbons.png", "Displayed formulae of hydrocarbons A and B", 510)] },
  ),
  multiTextQuestion(
    "q5bii",
    5,
    "(b)(ii) State which hydrocarbon is saturated and give a reason.",
    1,
    [{ id: "hydrocarbon", label: "Hydrocarbon" }, { id: "reason", label: "Reason" }],
    [
      { id: "hydrocarbon", accepted: ["A"], points: 0.5, normalizer: "text" },
      { id: "reason", accepted: [], keywords: [["all", "carbon", "carbon", "single"], ["all", "c c", "single"]], points: 0.5, normalizer: "keywords", reviewRecommended: true },
    ],
    { display: "A, because all carbon–carbon bonds are single.", scoreThresholds: [{ minCorrect: 2, points: 1 }] },
  ),
  multiTextQuestion(
    "q5biii",
    5,
    "(b)(iii) State the chemical test used to distinguish A and B, and the observation for each.",
    2,
    [{ id: "test", label: "Test" }, { id: "aObservation", label: "Observation for A" }, { id: "bObservation", label: "Observation for B" }],
    [
      markingPoint("test", [["aqueous", "bromine"], ["bromine", "water"], ["br2"]]),
      { id: "aObservation", accepted: [], keywords: [["stays", "orange"], ["remains", "orange"]], points: 0.5, normalizer: "keywords", reviewRecommended: true },
      { id: "bObservation", accepted: [], keywords: [["decolour"], ["colorless"], ["colourless"]], points: 0.5, normalizer: "keywords", reviewRecommended: true },
    ],
    { display: "Aqueous bromine remains orange with A and is decolourised by B." },
  ),
  multiTextQuestion(
    "q5c",
    5,
    "(c) Complete the balanced equation, including missing state symbols: CH4(g) + ___ O2(___) → CO2(___) + ___ H2O(l).",
    2,
    [{ id: "coefficients", label: "Coefficients for O2 and H2O (in order)" }, { id: "states", label: "States for O2 and CO2 (in order)" }],
    [exact("coefficients", ["2, 2", "2 2", "2,2"]), exact("states", ["g, g", "g g", "g,g"])],
    { display: "CH4(g) + 2O2(g) → CO2(g) + 2H2O(l)" },
  ),
  textQuestion(
    "q5d",
    5,
    "(d) State one physical property of methane.",
    1,
    [markingPoint("answer", [["low", "melting", "point"], ["low", "boiling", "point"], ["low", "electrical", "conductivity"], ["poor", "electrical", "conductor"]])],
    { display: "low melting point / low boiling point / low electrical conductivity" },
  ),

  multiTextQuestion(
    "q6a",
    6,
    "(a) For an iron atom shown as ⁵⁶₂₆Fe, deduce the number of electrons and neutrons.",
    2,
    [{ id: "electrons", label: "Electrons" }, { id: "neutrons", label: "Neutrons" }],
    [exact("electrons", ["26"]), exact("neutrons", ["30"])],
    { display: "26 electrons; 30 neutrons", compact: true },
  ),
  textQuestion(
    "q6bi",
    6,
    "(b)(i) Describe how Fe²⁺ ions are formed from iron atoms.",
    1,
    [markingPoint("answer", [["loses", "two", "electron"], ["lose", "2", "electron"]])],
    { display: "An iron atom loses two electrons." },
  ),
  textQuestion(
    "q6bii",
    6,
    "(b)(ii) Describe what is observed when aqueous sodium hydroxide is added to aqueous iron(II) ions.",
    2,
    [markingPoint("answer", [["green"]]), markingPoint("answer", [["precipitate"], ["ppt"]])],
    { display: "A green precipitate forms." },
  ),
  textQuestion("q6ci", 6, "(c)(i) Explain why iron reacting with dilute hydrochloric acid is a chemical change.", 1, [markingPoint("answer", [["new", "substance"]])], { display: "A new substance is made." }),
  textQuestion(
    "q6cii",
    6,
    "(c)(ii) State the test for hydrogen and the positive result.",
    1,
    [markingPoint("answer", [["lighted", "splint", "squeaky", "pop"], ["burning", "splint", "pop"]])],
    { display: "A lighted splint gives a squeaky pop." },
  ),
  textQuestion(
    "q6d",
    6,
    "(d) Describe what is meant by a catalyst.",
    2,
    [markingPoint("answer", [["increase", "rate"], ["speeds", "reaction"]]), markingPoint("answer", [["unchanged", "end"], ["not", "used", "up"]])],
    { display: "A catalyst increases reaction rate and is unchanged at the end." },
  ),

  textQuestion(
    "q7ai",
    7,
    "(a)(i) State the name of component X in the heater circuit.",
    1,
    [exact("answer", ["electric motor", "motor"])],
    { display: "electric motor", visuals: [image("paper3-q07-heater-circuit.png", "Electric heater circuit with component X", 390)] },
  ),
  {
    id: "cie-igcse-cs-p3-q7aii",
    number: 7,
    prompt: "(a)(ii) The current in component X is 0.5 A and the current in the heater is 8.3 A. Select the current from the source.",
    points: 1,
    type: "singleChoice",
    choices: ["0.5 A", "7.8 A", "8.3 A", "8.8 A"].map((label) => ({ value: label, label })),
    grading: { mode: "auto", display: "8.8 A", parts: [exact("answer", ["8.8 A"])] },
  },
  multiTextQuestion(
    "q7aiii",
    7,
    "(a)(iii) A 2.0 kW heater runs for 5.5 hours at $0.15 per kWh. Calculate the cost.",
    2,
    [{ id: "working", label: "Working or formula" }, { id: "answer", label: "Final cost ($)" }],
    [
      markingPoint("working", [["0.15", "2.0", "5.5"], ["cost", "power", "time"]]),
      { id: "answer", accepted: ["1.65", "1.70", "$1.65", "$1.70"], points: 2, normalizer: "text" },
    ],
    { display: "$1.65 ($1.70 accepted)" },
  ),
  multiTextQuestion(
    "q7b",
    7,
    "(b) A wind turbine produces 2200 W. Calculate the energy transferred in 15 seconds.",
    2,
    [{ id: "working", label: "Working or formula" }, { id: "answer", label: "Final energy (J)" }],
    [
      markingPoint("working", [["2200", "15"], ["energy", "power", "time"]]),
      { id: "answer", accepted: ["33000", "33 000", "33000 j"], points: 2, normalizer: "text" },
    ],
    { display: "33 000 J", visuals: [image("paper3-q07-wind-turbine.png", "Wind turbine", 390)] },
  ),
  textQuestion("q7ci", 7, "(c)(i) State the colour of visible light with the longest wavelength.", 1, [exact("answer", ["red"])]),
  textQuestion("q7cii", 7, "(c)(ii) State one other region, apart from visible light, in which most solar energy is radiated.", 1, [exact("answer", ["infrared", "infra-red", "ultraviolet", "ultra-violet", "uv", "ir"])], { display: "infrared or ultraviolet" }),

  multiTextQuestion(
    "q8ai",
    8,
    "(a)(i) A spacecraft has a mass of 3.1 × 10³ kg. Calculate its weight on Earth. Include the unit.",
    3,
    [{ id: "working", label: "Working or formula" }, { id: "answer", label: "Final answer, including unit" }],
    [
      markingPoint("working", [["weight", "mass", "gravitational"], ["w", "m", "g"], ["3.1", "10", "9.8"]]),
      { id: "answer", accepted: ["30000 n", "30 000 n", "30 x 10^3 n", "30 × 10^3 n", "30380 n", "30400 n", "30.38 kn", "30.4 kn"], points: 3, normalizer: "text" },
    ],
    { display: "30 000 N (30.38 kN or 30.4 kN accepted)" },
  ),
  textQuestion("q8aii", 8, "(a)(ii) State what is meant by accelerates.", 1, [markingPoint("answer", [["increase", "speed"], ["gets", "faster"]])], { display: "increases in speed" }),
  textQuestion("q8aiii", 8, "(a)(iii) Calculate the number of hours in 3.2 days.", 1, [exact("answer", ["76.8", "76.8 h", "76 h 48 min"])], { display: "76.8 h" }),
  multiTextQuestion(
    "q8aiv",
    8,
    "(a)(iv) The Earth–Moon distance is 384 000 km. Calculate the spacecraft's average speed using your answer to (a)(iii).",
    2,
    [{ id: "working", label: "Working or formula" }, { id: "answer", label: "Final speed (km/h)" }],
    [
      markingPoint("working", [["384000", "76.8"], ["speed", "distance", "time"]]),
      { id: "answer", accepted: ["5000", "5000 km/h", "5000 km h"], points: 2, normalizer: "text" },
    ],
    { display: "5000 km/h" },
  ),
  multiTextQuestion(
    "q8av",
    8,
    "(a)(v) State whether radio waves travel faster, slower or at the same speed as visible light, and give a reason.",
    1,
    [{ id: "speed", label: "Speed comparison" }, { id: "reason", label: "Reason" }],
    [
      { id: "speed", accepted: ["same", "same speed", "at the same speed"], points: 0.5, normalizer: "text" },
      { id: "reason", accepted: [], keywords: [["both", "electromagnetic", "same", "speed"], ["all", "electromagnetic", "same", "speed"]], points: 0.5, normalizer: "keywords", reviewRecommended: true },
    ],
    { display: "same speed; both are electromagnetic waves, which travel at the same speed", scoreThresholds: [{ minCorrect: 2, points: 1 }] },
  ),
  textQuestion("q8b", 8, "(b) State the name of the planet that orbits closest to the Sun.", 1, [exact("answer", ["Mercury"])]),
  textQuestion("q8c", 8, "(c) State the name of the galaxy that contains the Sun.", 1, [exact("answer", ["Milky Way", "the Milky Way"])]),

  multiTextQuestion(
    "q9a",
    9,
    "(a) Use Table 9.1 to state the electrical property of poly(ethene) and give a reason.",
    1,
    [{ id: "property", label: "Electrical property" }, { id: "reason", label: "Reason" }],
    [
      { id: "property", accepted: ["insulator"], points: 0.5, normalizer: "text" },
      { id: "reason", accepted: [], keywords: [["plastic"], ["polymer"], ["not", "metal"], ["not", "carbon"]], points: 0.5, normalizer: "keywords", reviewRecommended: true },
    ],
    {
      display: "insulator, because it is a plastic/polymer and not a metal or carbon",
      visualHtml: table91,
      scoreThresholds: [{ minCorrect: 2, points: 1 }],
    },
  ),
  textQuestion(
    "q9b",
    9,
    "(b) Predict what happens to a 0.9 g/cm³ poly(ethene) ball in water and in ethanol. Explain using Table 9.1.",
    2,
    [
      markingPoint("answer", [["water", "float"], ["floats", "water"]]),
      markingPoint("answer", [["ethanol", "sink"], ["sinks", "ethanol"], ["density", "between", "water", "ethanol"]]),
    ],
    { display: "It floats in water and sinks in ethanol because its density lies between theirs.", visualHtml: table91 },
  ),
  multiTextQuestion(
    "q9c",
    9,
    "(c) Identify which particle diagram shows ethanol and sulfur at 25 °C, and explain in terms of particles.",
    2,
    [{ id: "ethanol", label: "Ethanol" }, { id: "sulfur", label: "Sulfur" }, { id: "explanation", label: "Explanation" }],
    [
      { id: "ethanol", accepted: ["Y"], points: 0.5, normalizer: "text" },
      { id: "sulfur", accepted: ["X"], points: 0.5, normalizer: "text" },
      markingPoint("explanation", [["sulfur", "solid", "ethanol", "liquid"], ["solid", "regular", "liquid", "irregular"], ["solid", "closely", "packed", "liquid", "less"]]),
    ],
    { display: "ethanol Y; sulfur X; a solid is regular/more closely packed and a liquid is irregular/less closely packed", visuals: [image("paper3-q09-particles.png", "Particle arrangements X and Y", 470)] },
  ),
  multiTextQuestion(
    "q9di",
    9,
    "(d)(i) An aluminium mirror has a mass of 9.0 g and density 2.7 g/cm³. Calculate its volume.",
    2,
    [{ id: "working", label: "Working or formula" }, { id: "answer", label: "Final volume (cm³)" }],
    [
      markingPoint("working", [["9.0", "2.7"], ["volume", "mass", "density"]]),
      { id: "answer", accepted: ["3.3", "3.33", "3.333", "3.3 cm3", "3.33 cm3", "3.333 cm3"], points: 2, normalizer: "text" },
    ],
    { display: "3.3 cm³" },
  ),
  {
    id: "cie-igcse-cs-p3-q9dii",
    number: 9,
    prompt: "(d)(ii) Draw the normal and place i at the angle of incidence. Then draw the reflected ray to show how the eye sees the image.",
    points: 2,
    type: "rayDiagram",
    backgroundSrc: `${assetBase}/paper3-q09-ray-diagram.png`,
    backgroundAlt: "Object, incident ray, eye and vertical aluminium mirror",
    geometry: {
      incidence: { x: 0.826, y: 0.485 },
      incidentSource: { x: 0.36, y: 0.1825 },
      eye: { x: 0.36, y: 0.8175 },
      normalTolerance: 0.045,
      labelRegion: { minX: 0.59, maxX: 0.78, minY: 0.34, maxY: 0.49 },
      eyeTolerance: 0.085,
      angleToleranceDegrees: 10,
    },
  },
];

export const cieIgcseCombinedSciencePaper3Core: TestDefinition = {
  id: "cie-igcse-combined-science-paper-3-core",
  title: "CIE IGCSE Combined Science Paper 3 Core",
  subject: "Combined Science",
  level: "Core",
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
