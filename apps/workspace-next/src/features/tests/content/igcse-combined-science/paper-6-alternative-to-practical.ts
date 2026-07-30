import type { AnswerPart, DependentScoringRule, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/igcse-combined-science/combined/paper6";
const idBase = "cie-igcse-cs-p6";

type Field = Extract<TestQuestion, { type: "multiText" }>["fields"][number];

function image(name: string, alt: string, maxWidth = 500): NonNullable<TestQuestion["visuals"]>[number] {
  return { type: "image", src: `${assetBase}/${name}`, alt, maxWidth };
}

function exact(id: string, accepted: string[], points = 1): AnswerPart {
  return { id, accepted, points, normalizer: "text" };
}

function markingPoint(
  id: string,
  keywords: string[][],
  category?: AnswerPart["category"],
  points = 1,
): AnswerPart {
  return { id, accepted: [], keywords, points, normalizer: "keywords", reviewRecommended: false, category };
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
    id: `${idBase}-${id}`,
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
    scoringStrategy?: "standard" | "investigationPlan";
  } = {},
): TestQuestion {
  return {
    id: `${idBase}-${id}`,
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
      scoringStrategy: options.scoringStrategy,
    },
  };
}

function dependentText(
  id: string,
  number: number,
  prompt: string,
  display: string,
  rule: DependentScoringRule,
  points = 1,
): TestQuestion {
  return {
    id: `${idBase}-${id}`,
    number,
    prompt,
    points,
    type: "text",
    inputMode: "number",
    grading: { mode: "dependent", display, rule },
  };
}

const biologyQuestions: TestQuestion[] = [
  {
    id: `${idBase}-q1a`,
    number: 1,
    prompt: "(a) Make a large biological drawing of the cut surface of the apple shown in Fig. 1.1.",
    points: 3,
    type: "biologicalDrawing",
    referenceSrc: `${assetBase}/q1-apple.png`,
    referenceAlt: "Cut surface of half an apple with five core sections and pips",
    canvasAspectRatio: 4 / 3,
  },
  multiTextQuestion(
    "q1bi",
    1,
    "(b)(i) Record the volume of apple juice remaining in the syringe in experiment 3.",
    1,
    [{ id: "remaining", label: "Experiment 3 volume remaining" }],
    [exact("remaining", ["1.4", "1.4 cm3", "1.4 cm³"])],
    {
      display: "1.4 cm³",
      visuals: [image("q1-syringe.png", "Syringe showing the volume of apple juice remaining", 220)],
      compact: true,
      answerTable: {
        headers: ["experiment", "volume remaining / cm³", "volume added / cm³"],
        rows: [
          { cells: [{ text: "1" }, { text: "1.3" }, { text: "8.7" }] },
          { cells: [{ text: "2" }, { text: "1.5" }, { text: "8.5" }] },
          { cells: [{ text: "3" }, { type: "input", id: "remaining" }, { text: "calculate in (ii)" }] },
        ],
      },
    },
  ),
  dependentText(
    "q1bii",
    1,
    "(b)(ii) Calculate the volume of apple juice added to the DCPIP in experiment 3. Give your answer in cm³.",
    "8.6 cm³ (ECF from (b)(i))",
    {
      type: "subtractFrom",
      sourceQuestionId: `${idBase}-q1bi`,
      sourceField: "remaining",
      minuend: 10,
      tolerance: 0.05,
    },
  ),
  dependentText(
    "q1biii",
    1,
    "(b)(iii) Calculate the average volume of apple juice added. Give your answer in cm³.",
    "8.9 cm³ (ECF from (b)(ii))",
    {
      type: "mean",
      sourceQuestionId: `${idBase}-q1bii`,
      fixedValues: [8.7, 8.5],
      decimalPlaces: 1,
      tolerance: 0.05,
      accepted: ["8.9"],
    },
  ),
  textQuestion(
    "q1biv",
    1,
    "(b)(iv) Suggest why the student repeats the experiment.",
    1,
    [markingPoint("answer", [
      ["minimise", "random", "error"],
      ["reduce", "random", "error"],
      ["identify", "anomal"],
      ["spot", "anomal"],
      ["average", "reliable"],
    ])],
    { display: "To minimise random error by averaging, or to identify anomalous results." },
  ),
  multiTextQuestion(
    "q2",
    2,
    "Plan an investigation to determine the relationship between light intensity and the volume of oxygen gas produced by an aquatic plant.",
    7,
    [
      { id: "apparatus", label: "Additional apparatus and chemicals", placeholder: "Name the light source, gas collection and measuring apparatus." },
      { id: "method", label: "Method and safety", placeholder: "Describe a repeatable method and link each safety precaution to its hazard." },
      { id: "measurements", label: "Measurements", placeholder: "Explain how light intensity is varied and how oxygen volume is recorded." },
      { id: "controls", label: "Control variables", placeholder: "State the variables kept constant." },
      { id: "processing", label: "Processing and conclusion", placeholder: "Explain rate calculation, repeats and graphing." },
    ],
    [
      markingPoint("apparatus", [["lamp"], ["light", "source"], ["led"]], "apparatus"),
      markingPoint("apparatus", [["gas", "syringe"], ["measuring", "cylinder"]], "apparatus"),
      markingPoint("apparatus", [["stopwatch"], ["timer"], ["ruler"], ["light", "meter"]], "apparatus"),
      markingPoint("method", [["plant", "light", "oxygen"], ["place", "lamp", "plant"], ["collect", "gas"]], "method"),
      markingPoint("method", [
        ["water", "electric", "keep", "away"],
        ["water", "electric", "dry"],
        ["hot", "lamp", "heat", "shield"],
        ["hot", "lamp", "glove"],
        ["hot", "lamp", "do not touch"],
      ], "method"),
      markingPoint("measurements", [
        ["vary", "distance"],
        ["change", "distance"],
        ["vary", "brightness"],
        ["change", "brightness"],
        ["number", "lamp"],
        ["light", "intensity", "record"],
      ], "measurements"),
      markingPoint("measurements", [["volume", "gas"], ["volume", "oxygen"], ["water", "displacement"]], "measurements"),
      markingPoint("controls", [["carbon dioxide"], ["co2", "concentration"]], "controls"),
      markingPoint("controls", [["temperature", "water"], ["water", "temperature"]], "controls"),
      markingPoint("controls", [["wavelength"], ["colour", "light"], ["same", "plant"], ["time", "same"]], "controls"),
      markingPoint("processing", [["volume", "time"], ["volume", "per", "second"], ["rate", "oxygen"]], "processing"),
      markingPoint("processing", [["repeat", "anomal"], ["repeat", "mean"], ["repeat", "average"]], "processing"),
      markingPoint("processing", [["graph", "volume", "light", "intensity"], ["plot", "volume", "intensity"]], "processing"),
    ],
    {
      display: "One valid point from each category, then two additional distinct marking points.",
      visuals: [image("q2-aquatic-plant.png", "Aquatic plant under a funnel and an inverted test-tube", 430)],
      scoringStrategy: "investigationPlan",
    },
  ),
];

const chemistryQuestions: TestQuestion[] = [
  textQuestion("q3ai", 3, "(a)(i) Identify the gas that gives a squeaky pop with a lighted splint.", 1, [exact("answer", ["hydrogen", "h2"])], { display: "hydrogen" }),
  textQuestion(
    "q3aii",
    3,
    "(a)(ii) Aqueous copper(II) sulfate makes the reaction faster. Suggest one observation that shows the reaction is faster.",
    1,
    [markingPoint("answer", [["fizz", "more"], ["bubble", "faster"], ["effervescence", "more"], ["solid", "disappear", "faster"]])],
    { display: "More rapid fizzing, or the solid disappears more quickly." },
  ),
  textQuestion(
    "q3aiii",
    3,
    "(a)(iii) A white precipitate forms when aqueous sodium hydroxide is added. Suggest both possible identities of the cation produced from metal F.",
    1,
    [markingPoint("answer", [["zinc", "calcium"], ["zn", "ca"]])],
    { display: "zinc ions and calcium ions" },
  ),
  multiTextQuestion(
    "q3bi",
    3,
    "(b)(i) Read the two stopwatches and record the time taken to the nearest second for 5 cm³ and 25 cm³ of gas.",
    2,
    [{ id: "first", label: "Time for 5 cm³" }, { id: "last", label: "Time for 25 cm³" }],
    [exact("first", ["10", "10 s", "10 seconds"]), exact("last", ["57", "57 s", "57 seconds"])],
    {
      display: "10 s; 57 s",
      visuals: [image("q3-gas-apparatus.png", "Apparatus for collecting gas over water", 560), image("q3-stopwatches.png", "Stopwatch readings for 5 and 25 cubic centimetres of gas", 470)],
      compact: true,
      answerTable: {
        headers: ["volume of gas / cm³", "time / s"],
        rows: [
          { cells: [{ text: "5" }, { type: "input", id: "first" }] },
          { cells: [{ text: "10" }, { text: "22" }] },
          { cells: [{ text: "15" }, { text: "34" }] },
          { cells: [{ text: "20" }, { text: "46" }] },
          { cells: [{ text: "25" }, { type: "input", id: "last" }] },
        ],
      },
    },
  ),
  multiTextQuestion(
    "q3bii",
    3,
    "(b)(ii) State the independent variable and the dependent variable.",
    1,
    [{ id: "independent", label: "Independent variable" }, { id: "dependent", label: "Dependent variable" }],
    [
      markingPoint("independent", [["volume", "gas"]]),
      markingPoint("dependent", [["time", "taken"], ["time"]]),
    ],
    {
      display: "independent: volume of gas collected; dependent: time taken",
      scoreThresholds: [{ minCorrect: 2, points: 1 }],
    },
  ),
  {
    id: `${idBase}-q3biiiiv`,
    number: 3,
    prompt: "(b)(iii)-(iv) Plot volume of gas collected (vertical axis) against time taken, then draw a line of best fit.",
    points: 4,
    type: "practicalGraph",
    sourceQuestionId: `${idBase}-q3bi`,
    sourceFields: { first: "first", last: "last" },
    fixedXValues: [10, 22, 34, 46, 57],
    data: [5, 10, 15, 20, 25].map((value) => ({ label: `${value} cm³`, y: value })),
    correctAxes: {
      xQuantity: "time taken",
      xUnit: "s",
      yQuantity: "volume of gas collected",
      yUnit: "cm3",
    },
    scaleOptions: [30, 40, 60, 80],
    pointTolerance: 0.025,
  },
  textQuestion(
    "q3bv",
    3,
    "(b)(v) Describe the relationship between the volume of gas collected and the time taken.",
    1,
    [markingPoint("answer", [["volume", "increase", "time", "increase"], ["more", "gas", "longer", "time"]])],
    { display: "As the volume of gas collected increases, the time taken increases." },
  ),
  textQuestion(
    "q3bvi",
    3,
    "(b)(vi) Suggest one possible source of error in measuring the time taken.",
    1,
    [markingPoint("answer", [
      ["look", "volume", "stopwatch", "same", "time"],
      ["reaction", "start", "stopwatch", "delay"],
      ["human", "reaction", "time"],
    ])],
    { display: "Difficulty watching the volume and stopwatch together, or a delay in starting the stopwatch." },
  ),
  textQuestion(
    "q3bvii",
    3,
    "(b)(vii) Suggest one way to obtain a more accurate measurement of the volume of gas collected.",
    1,
    [markingPoint("answer", [["gas", "syringe"], ["reactants", "separate", "stopper"], ["mix", "inside", "stoppered"]])],
    { display: "Use a gas syringe, or keep the reactants separate inside the stoppered tube before mixing." },
  ),
];

const widthCalibration = 3.5;
const thicknessCalibration = 1.1;

const physicsQuestions: TestQuestion[] = [
  {
    id: `${idBase}-q4ai`,
    number: 4,
    prompt: "(a)(i) Draw a double-headed arrow to show the length L of the metre rule and label it L.",
    points: 1,
    type: "diagramAnnotation",
    variant: "doubleArrow",
    backgroundSrc: `${assetBase}/q4-metre-rule.png`,
    backgroundAlt: "Metre rule labelled with width and thickness",
    geometry: {
      variant: "doubleArrow",
      start: { x: 0.11, y: 0.18 },
      end: { x: 0.94, y: 0.18 },
      endpointTolerance: 0.1,
      labelRegion: { minX: 0.42, maxX: 0.64, minY: 0.24, maxY: 0.58 },
      label: "L",
    },
  },
  {
    id: `${idBase}-q4aii`,
    number: 4,
    prompt: "(a)(ii) Use the virtual ruler to measure width w and thickness t to the nearest 0.1 cm.",
    points: 2,
    type: "virtualMeasurement",
    backgroundSrc: `${assetBase}/q4-rule-end.png`,
    backgroundAlt: "Actual-size end of a metre rule showing width and thickness",
    measurements: [
      {
        id: "w",
        label: "width w",
        unit: "cm",
        expected: 2.5,
        tolerance: 0.15,
        calibration: widthCalibration,
        start: { x: 0.01, y: 0.55 },
        end: { x: 0.724, y: 0.55 },
      },
      {
        id: "t",
        label: "thickness t",
        unit: "cm",
        expected: 0.5,
        tolerance: 0.1,
        calibration: thicknessCalibration,
        start: { x: 0.92, y: 0.54 },
        end: { x: 0.92, y: 0.995 },
      },
    ],
  },
  textQuestion(
    "q4aiii",
    4,
    "(a)(iii) State why it is not appropriate to record these ruler measurements to the nearest 0.01 cm.",
    1,
    [markingPoint("answer", [["ruler", "precision", "0.1"], ["smallest", "division", "0.1"], ["millimetre", "division"]])],
    { display: "The ruler's smallest division is 0.1 cm, so it does not have 0.01 cm precision." },
  ),
  dependentText(
    "q4aiv",
    4,
    "(a)(iv) The length L is 100.0 cm. Calculate the volume V = L × w × t. Give your answer in cm³.",
    "125 cm³ (ECF from (a)(ii))",
    {
      type: "product",
      factors: [
        { value: 100 },
        { sourceQuestionId: `${idBase}-q4aii`, measurementId: "w", measurementCalibration: widthCalibration },
        { sourceQuestionId: `${idBase}-q4aii`, measurementId: "t", measurementCalibration: thicknessCalibration },
      ],
      tolerance: 0.6,
    },
  ),
  textQuestion(
    "q4bi",
    4,
    "(b)(i) The pivot is at 60.0 cm and the load centre is at 67.1 cm. Calculate distance x₁.",
    1,
    [exact("answer", ["7.1", "7.1 cm"])],
    { display: "7.1 cm", inputMode: "number", visuals: [image("q4-balance-method.png", "Balancing method with a pivot at 60 cm and a load on the metre rule", 560)] },
  ),
  textQuestion("q4bii", 4, "(b)(ii) The pivot is moved to 70.0 cm and the load centre is at 84.2 cm. Calculate distance x₂.", 1, [exact("answer", ["14.2", "14.2 cm"])], { display: "14.2 cm", inputMode: "number" }),
  dependentText(
    "q4biii",
    4,
    "(b)(iii) Calculate the mass M using M = 5(x₁ + x₂). Give your answer in g.",
    "106.5 g (106, 107 and 110 accepted; ECF from (b)(i)-(ii))",
    {
      type: "scaledSum",
      sourceQuestionIds: [`${idBase}-q4bi`, `${idBase}-q4bii`],
      multiplier: 5,
      tolerance: 0.6,
      accepted: ["106", "107", "110"],
    },
  ),
  textQuestion(
    "q4ci",
    4,
    "(c)(i) State the name of the apparatus shown in Fig. 4.4.",
    1,
    [exact("answer", ["balance", "electronic balance", "top pan balance", "top-pan balance"])],
    { display: "electronic balance / top-pan balance", visuals: [image("q4-electronic-balance.png", "Electronic balance reading 0.1 g while empty", 250)] },
  ),
  textQuestion("q4cii", 4, "(c)(ii) State the type of error shown by the balance reading 0.1 g when empty.", 1, [exact("answer", ["zero error", "systematic error", "calibration error", "zero", "systematic", "calibration"])], { display: "zero / systematic / calibration error" }),
  {
    id: `${idBase}-q4d`,
    number: 4,
    prompt: "(d) Calculate density ρ = M / V. Give the value to two significant figures and state the unit.",
    points: 3,
    type: "multiText",
    fields: [
      { id: "value", label: "Density to two significant figures" },
      { id: "unit", label: "Unit" },
    ],
    compact: true,
    grading: {
      mode: "dependent",
      display: "0.85 g/cm³ (ECF from volume and mass)",
      rule: {
        type: "density",
        massQuestionId: `${idBase}-q4biii`,
        volumeQuestionId: `${idBase}-q4aiv`,
        valueField: "value",
        unitField: "unit",
        significantFigures: 2,
        unitAccepted: ["g/cm3", "g cm-3", "g/cm³", "g cm⁻³"],
        tolerance: 0.005,
      },
    },
  },
];

export const cieIgcseCombinedSciencePaper6AlternativeToPractical: TestDefinition = {
  id: "cie-igcse-combined-science-paper-6-alternative-to-practical",
  title: "CIE IGCSE Combined Science Paper 6 Alternative to Practical",
  subject: "Combined Science",
  level: "Alternative to Practical",
  totalPoints: 40,
  status: "active",
  durationMinutes: 60,
  sections: [
    {
      id: "biology",
      label: "Biology Questions 1-2",
      title: "Biology Questions 1-2",
      hint: "Answer all parts. Use the drawing and planning tools where provided.",
      groupByQuestionNumber: true,
      questions: biologyQuestions,
    },
    {
      id: "chemistry",
      label: "Chemistry Question 3",
      title: "Chemistry Question 3",
      hint: "Record readings carefully and complete the practical graph.",
      groupByQuestionNumber: true,
      questions: chemistryQuestions,
    },
    {
      id: "physics",
      label: "Physics Question 4",
      title: "Physics Question 4",
      hint: "Use the interactive measurement and annotation tools where provided.",
      groupByQuestionNumber: true,
      questions: physicsQuestions,
    },
  ],
};
