import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/igcse-combined-science/combined";

type Choice = { value: string; label: string };
type SingleChoiceExtras = Partial<Omit<Extract<TestQuestion, { type: "singleChoice" }>, "choices" | "grading" | "id" | "number" | "points" | "prompt" | "type">>;

const letterChoices: Choice[] = ["A", "B", "C", "D"].map((letter) => ({ value: letter, label: letter }));

function mcq(
  paper: "p1" | "p2",
  number: number,
  prompt: string,
  choices: Choice[],
  answer: string,
  visuals?: TestQuestion["visuals"],
  extras: SingleChoiceExtras = {},
): TestQuestion {
  return {
    id: `cie-igcse-combined-science-${paper}-q${number}`,
    number,
    prompt,
    points: 1,
    type: "singleChoice",
    choices,
    visuals,
    ...extras,
    grading: {
      mode: "auto",
      display: answer,
      parts: [{ id: "answer", accepted: [answer], points: 1, normalizer: "text" }],
    },
  };
}

function image(src: string, alt: string, maxWidth = 532): NonNullable<TestQuestion["visuals"]>[number] {
  return { type: "image", src: `${assetBase}/${src}`, alt, maxWidth };
}

function tableChoice(headers: string[], rows: Array<[string, ...string[]]>): Pick<Extract<TestQuestion, { type: "singleChoice" }>, "choiceTable"> {
  return {
    choiceTable: {
      headers: ["", ...headers],
      rows: rows.map(([value, ...cells]) => ({ value, cells })),
    },
  };
}

function dataTable(headers: string[], rows: string[][]): string {
  return [
    '<table class="cambridge-data-table">',
    `<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>`,
    `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`,
    "</table>",
  ].join("");
}

function tableVisual(...parts: string[]): string {
  return `<div class="cambridge-table-visual">${parts.join("")}</div>`;
}

function paragraph(text: string): string {
  return `<p>${text}</p>`;
}

const onionDataVisual = tableVisual(
  dataTable(
    ["total sugar including<br />reducing sugar<br />/ g per 100 g", "starch<br />/ g per 100 g"],
    [["3.7", "0.0"]],
  ),
  paragraph("The onion is tested with Benedict's solution and iodine solution."),
  paragraph("Which set of results is correct?"),
);

const biologyOneToFourChoices = {
  organismAction: [
    { value: "A", label: "excretion" },
    { value: "B", label: "growth" },
    { value: "C", label: "movement" },
    { value: "D", label: "sensitivity" },
  ],
  tissue: [
    { value: "A", label: "blood" },
    { value: "B", label: "heart" },
    { value: "C", label: "plasma" },
    { value: "D", label: "plasmid" },
  ],
};

const onionChoices: Choice[] = [
  { value: "A", label: "Benedict's solution: blue; iodine solution: blue-black" },
  { value: "B", label: "Benedict's solution: blue; iodine solution: yellow-brown" },
  { value: "C", label: "Benedict's solution: red; iodine solution: blue-black" },
  { value: "D", label: "Benedict's solution: red; iodine solution: yellow-brown" },
];

const onionChoiceTable = tableChoice(["Benedict's solution", "iodine solution"], [
  ["A", "blue", "blue-black"],
  ["B", "blue", "yellow-brown"],
  ["C", "red", "blue-black"],
  ["D", "red", "yellow-brown"],
]);

const leafChoices: Choice[] = [
  { value: "A", label: "1 and 2 only" },
  { value: "B", label: "3 and 4 only" },
  { value: "C", label: "1 and 4 only" },
  { value: "D", label: "2 and 3 only" },
];

const viralAntibioticsChoices: Choice[] = [
  { value: "A", label: "antibiotics do not affect viruses" },
  { value: "B", label: "antibiotics are drugs" },
  { value: "C", label: "long-term use of antibiotics may reduce the effectiveness against the viruses" },
  { value: "D", label: "some bacteria are resistant to antibiotics" },
];

const foodChainChoices: Choice[] = [
  { value: "A", label: "X: chemical; Y: light; Z: consumer" },
  { value: "B", label: "X: chemical; Y: kinetic; Z: producer" },
  { value: "C", label: "X: light; Y: chemical; Z: producer" },
  { value: "D", label: "X: light; Y: kinetic; Z: consumer" },
];

const foodChainChoiceTable = tableChoice(["X", "Y", "Z"], [
  ["A", "chemical", "light", "consumer"],
  ["B", "chemical", "kinetic", "producer"],
  ["C", "light", "chemical", "producer"],
  ["D", "light", "kinetic", "consumer"],
]);

const oxideChoices: Choice[] = [
  { value: "A", label: "acidic oxide: NO2; basic oxide: CaO" },
  { value: "B", label: "acidic oxide: SO2; basic oxide: CO2" },
  { value: "C", label: "acidic oxide: CuO; basic oxide: Na2O" },
  { value: "D", label: "acidic oxide: Li2O; basic oxide: SiO2" },
];

const oxideChoiceTable = tableChoice(["acidic oxide", "basic oxide"], [
  ["A", "NO<sub>2</sub>", "CaO"],
  ["B", "SO<sub>2</sub>", "CO<sub>2</sub>"],
  ["C", "CuO", "Na<sub>2</sub>O"],
  ["D", "Li<sub>2</sub>O", "SiO<sub>2</sub>"],
]);

const groupIChoices: Choice[] = [
  { value: "A", label: "They become less dense and less reactive." },
  { value: "B", label: "They become less dense and more reactive." },
  { value: "C", label: "They become more dense and less reactive." },
  { value: "D", label: "They become more dense and more reactive." },
];

const metalExtractionChoices: Choice[] = [
  { value: "A", label: "Aluminium is obtained from bauxite." },
  { value: "B", label: "Iron is obtained by the electrolysis of iron(III) oxide." },
  { value: "C", label: "Iron is obtained by the oxidation of iron(III) oxide." },
  { value: "D", label: "The higher a metal is in the reactivity series the easier it is to extract." },
];

const separationChoices: Choice[] = [
  { value: "A", label: "P: evaporation; Q: filtrate; R: filtration" },
  { value: "B", label: "P: evaporation; Q: residue; R: filtration" },
  { value: "C", label: "P: filtration; Q: filtrate; R: evaporation" },
  { value: "D", label: "P: filtration; Q: residue; R: evaporation" },
];

const separationChoiceTable = tableChoice(["P", "Q", "R"], [
  ["A", "evaporation", "filtrate", "filtration"],
  ["B", "evaporation", "residue", "filtration"],
  ["C", "filtration", "filtrate", "evaporation"],
  ["D", "filtration", "residue", "evaporation"],
]);

const heliumNeonChoices: Choice[] = [
  { value: "A", label: "They are diatomic and have high thermal conductivities." },
  { value: "B", label: "They are diatomic and have low melting points." },
  { value: "C", label: "They are monatomic and have high boiling points." },
  { value: "D", label: "They are monatomic and have low electrical conductivities." },
];

const stateChangeChoices: Choice[] = [
  { value: "A", label: "condensation" },
  { value: "B", label: "evaporation" },
  { value: "C", label: "freezing" },
  { value: "D", label: "melting" },
];

const costChoices: Choice[] = [
  { value: "A", label: "$0.12" },
  { value: "B", label: "$0.16" },
  { value: "C", label: "$3.00" },
  { value: "D", label: "$4.00" },
];

const doubleInsulatedChoices: Choice[] = [
  { value: "A", label: "The outer casing of the heater does not need to be earthed." },
  { value: "B", label: "The outer casing of the heater must be earthed." },
  { value: "C", label: "The heater needs two fuses." },
  { value: "D", label: "The heater needs two trip switches." },
];

const smallStarChoices: Choice[] = [
  { value: "A", label: "red giant -> planetary nebula + white dwarf" },
  { value: "B", label: "red giant -> supernova -> black hole" },
  { value: "C", label: "red supergiant -> planetary nebula + black hole" },
  { value: "D", label: "red supergiant -> supernova -> white dwarf" },
];

const gasVolumeChoiceTable = tableChoice(["temperature", "volume"], [
  ["A", "decreases", "decreases"],
  ["B", "stays the same", "increases"],
  ["C", "increases", "stays the same"],
  ["D", "increases", "decreases"],
]);

const activeImmunityChoiceTable = tableChoice(["infection by a<br />pathogen", "vaccination"], [
  ["A", "yes", "yes"],
  ["B", "yes", "no"],
  ["C", "no", "yes"],
  ["D", "no", "no"],
]);

const deforestationChoiceTable = tableChoice(["species become<br />extinct", "increased risk<br />of flooding", "increase in<br />atmospheric<br />carbon dioxide"], [
  ["A", "no", "no", "yes"],
  ["B", "yes", "yes", "no"],
  ["C", "no", "yes", "no"],
  ["D", "yes", "no", "no"],
]);

const electrolysisChoiceTable = tableChoice(["anode", "cathode"], [
  ["A", "bromide ions", "potassium ions"],
  ["B", "bromine", "potassium"],
  ["C", "potassium", "bromine"],
  ["D", "potassium ions", "bromide ions"],
]);

const fractionChoiceTable = tableChoice(["boiling point of R", "average chain length of R"], [
  ["A", "higher than S", "longer than S"],
  ["B", "higher than S", "shorter than S"],
  ["C", "lower than S", "longer than S"],
  ["D", "lower than S", "shorter than S"],
]);

const coolingChoiceTable = tableChoice(["density of liquid when cooled", "best position for cooling unit"], [
  ["A", "decreases", "P"],
  ["B", "decreases", "Q"],
  ["C", "increases", "P"],
  ["D", "increases", "Q"],
]);

const paper1BiologyQuestions: TestQuestion[] = [
  mcq("p1", 1, "Which word describes an action by an organism that causes a change of position or place?", biologyOneToFourChoices.organismAction, "C"),
  mcq("p1", 2, "Which label represents a plasmid in this diagram of a bacterium?", letterChoices, "C", [image("paper1-q02-bacterium.png", "Bacterium diagram labelled A to D")]),
  mcq("p1", 3, "Which label shows the site of aerobic respiration in this diagram of an animal cell?", letterChoices, "B", [image("paper1-q03-animal-cell.png", "Animal cell diagram labelled A to D")]),
  mcq("p1", 4, "What is a type of tissue in a living organism?", biologyOneToFourChoices.tissue, "A"),
  mcq(
    "p1",
    5,
    "The actual length of a phorid fly is 5.5 mm. What is the magnification of this diagram of a phorid fly?",
    [
      { value: "A", label: "0.16" },
      { value: "B", label: "0.7" },
      { value: "C", label: "6.4" },
      { value: "D", label: "192.5" },
    ],
    "C",
    [image("paper1-q05-phorid-fly.png", "Phorid fly diagram with a 35 mm scale line", 380)],
  ),
  mcq("p1", 6, "An uncooked potato with its skin removed is placed in water with concentrated sugar solution in the hollow. After a few hours, which diagram shows the result?", letterChoices, "C", [image("paper1-q06-potato-osmosis.png", "Potato osmosis experiment and four possible results labelled A to D", 620)]),
  mcq("p1", 7, "The data shows the concentrations of sugar and starch in an onion.", onionChoices, "D", undefined, { visualHtml: onionDataVisual, ...onionChoiceTable }),
  mcq("p1", 8, "The diagram shows a cross-section through a leaf. What are the functions of the tissue labelled X? 1 transport of amino acids; 2 transport of sucrose; 3 transport of water; 4 support.", leafChoices, "B", [image("paper1-q08-leaf-cross-section.png", "Leaf cross-section with tissue X labelled", 620)]),
  mcq(
    "p1",
    9,
    "What is not used to monitor the activity of the heart?",
    [
      { value: "A", label: "an electrocardiogram (ECG)" },
      { value: "B", label: "diet and exercise" },
      { value: "C", label: "the pulse rate" },
      { value: "D", label: "the sound of the heart valves" },
    ],
    "B",
  ),
  mcq(
    "p1",
    10,
    "Which word best describes a disease-causing organism?",
    [
      { value: "A", label: "bacteria" },
      { value: "B", label: "pathogen" },
      { value: "C", label: "pollutant" },
      { value: "D", label: "virus" },
    ],
    "B",
  ),
  mcq("p1", 11, "A doctor tells a patient that they are suffering from a viral infection. Why would the doctor not prescribe antibiotics to the patient?", viralAntibioticsChoices, "A"),
  mcq("p1", 12, "Which row contains the words that can replace X, Y and Z? Energy from the Sun is transferred as X to be stored as Y energy in a Z.", foodChainChoices, "C", undefined, foodChainChoiceTable),
  mcq(
    "p1",
    13,
    "Biodiversity is the number of different R in an area. Which word replaces R in the sentence?",
    [
      { value: "A", label: "food chains" },
      { value: "B", label: "food-webs" },
      { value: "C", label: "organisms" },
      { value: "D", label: "species" },
    ],
    "D",
  ),
];

const paper1ChemistryQuestions: TestQuestion[] = [
  mcq(
    "p1",
    14,
    "Which row describes how the volume of a gas changes when the temperature is changed but the pressure stays the same?",
    [
      { value: "A", label: "temperature decreases; volume decreases" },
      { value: "B", label: "temperature stays the same; volume increases" },
      { value: "C", label: "temperature increases; volume stays the same" },
      { value: "D", label: "temperature increases; volume decreases" },
    ],
    "A",
    undefined,
    gasVolumeChoiceTable,
  ),
  mcq(
    "p1",
    15,
    "Which statement about ionic compounds is correct?",
    [
      { value: "A", label: "They are good electrical conductors when dissolved in water." },
      { value: "B", label: "They are good electrical conductors when molten and when solid." },
      { value: "C", label: "They are formed when atoms share electrons." },
      { value: "D", label: "They have low melting points." },
    ],
    "A",
  ),
  mcq(
    "p1",
    16,
    "Which equation for the reaction between magnesium and dilute hydrochloric acid is correct?",
    [
      { value: "A", label: "Mg(s) + 2HCl(l) -> MgCl2(l) + H2(g)" },
      { value: "B", label: "Mg(s) + 2HCl(aq) -> MgCl2(aq) + H2(g)" },
      { value: "C", label: "2Mg(s) + 2HCl(l) -> 2MgCl2(l) + H2(g)" },
      { value: "D", label: "2Mg(s) + 2HCl(aq) -> 2MgCl2(aq) + H2(g)" },
    ],
    "B",
  ),
  mcq(
    "p1",
    17,
    "Which equation shows a reduction of the underlined substance?",
    [
      { value: "A", label: "C + O2 -> CO2" },
      { value: "B", label: "C + CO2 -> 2CO" },
      { value: "C", label: "Mg + H2O -> MgO + H2" },
      { value: "D", label: "NaOH + HCl -> NaCl + H2O" },
    ],
    "B",
  ),
  mcq(
    "p1",
    18,
    "The products of a reaction are water, calcium chloride and carbon dioxide only. Which reaction mixture gives these products?",
    [
      { value: "A", label: "calcium and hydrochloric acid" },
      { value: "B", label: "calcium hydroxide and hydrochloric acid" },
      { value: "C", label: "calcium carbonate and hydrochloric acid" },
      { value: "D", label: "calcium oxide and hydrochloric acid" },
    ],
    "C",
  ),
  mcq("p1", 19, "Which row identifies the formulas of an acidic oxide and a basic oxide?", oxideChoices, "A", undefined, oxideChoiceTable),
  mcq("p1", 20, "Which statement describes the trends shown by the elements down Group I of the Periodic Table?", groupIChoices, "D"),
  mcq(
    "p1",
    21,
    "Which statements about the transition elements are correct? 1 They have low densities. 2 They form coloured compounds. 3 They often act as catalysts. 4 They have low melting points.",
    [
      { value: "A", label: "1 and 2 only" },
      { value: "B", label: "1 and 4 only" },
      { value: "C", label: "2 and 3 only" },
      { value: "D", label: "3 and 4 only" },
    ],
    "C",
  ),
  mcq("p1", 22, "Which statement describes helium and neon?", heliumNeonChoices, "D"),
  mcq("p1", 23, "Which statement about the industrial extraction of metals from their ores is correct?", metalExtractionChoices, "A"),
  mcq(
    "p1",
    24,
    "What is used to remove tastes and odours from the domestic water supply during water treatment?",
    [
      { value: "A", label: "carbon" },
      { value: "B", label: "chlorine" },
      { value: "C", label: "filtration" },
      { value: "D", label: "sedimentation" },
    ],
    "A",
  ),
  mcq(
    "p1",
    25,
    "Which adverse effects are caused by particulates in the air?",
    [
      { value: "A", label: "acid rain and global warming" },
      { value: "B", label: "cancer and respiratory problems" },
      { value: "C", label: "global warming and cancer" },
      { value: "D", label: "respiratory problems and acid rain" },
    ],
    "B",
  ),
  mcq(
    "p1",
    26,
    "Petroleum is separated by fractional distillation. Which fraction is used as a fuel in diesel engines?",
    [
      { value: "A", label: "naphtha" },
      { value: "B", label: "gasoline" },
      { value: "C", label: "gas oil" },
      { value: "D", label: "refinery gas" },
    ],
    "C",
  ),
  mcq("p1", 27, "A mixture of salt solution and an insoluble solid is separated by P. The insoluble solid that is collected is Q. Pure salt crystals are obtained from the separated salt solution by R of the water. Which words complete gaps P, Q and R?", separationChoices, "D", undefined, separationChoiceTable),
];

const paper1PhysicsQuestions: TestQuestion[] = [
  mcq("p1", 28, "The diagrams show four distance-time graphs. Which graph represents the motion of an object that is at rest?", letterChoices, "C", [image("paper1-q28-distance-time-graphs.png", "Four distance-time graphs labelled A to D")]),
  mcq(
    "p1",
    29,
    "A solid block has a density of 1.1 g / cm3. The block is lowered into liquids X, Y and Z. Liquid X has density 1.0 g / cm3, liquid Y has density 1.2 g / cm3, and liquid Z has density 1.3 g / cm3. In which of the liquids does the block float?",
    [
      { value: "A", label: "in liquid X only" },
      { value: "B", label: "in liquids Y and Z only" },
      { value: "C", label: "in liquids X, Y and Z" },
      { value: "D", label: "in none of the liquids" },
    ],
    "B",
  ),
  mcq(
    "p1",
    30,
    "The diagram shows a force of 200 N pulling an object up a slope. The object moves 5.0 m along the slope. The object moves 3.0 m vertically upwards and 4.0 m horizontally. How much work is done by the 200 N force?",
    [
      { value: "A", label: "600 J" },
      { value: "B", label: "800 J" },
      { value: "C", label: "1000 J" },
      { value: "D", label: "1400 J" },
    ],
    "C",
    [image("paper1-q30-slope-work.png", "Object pulled up a slope with 200 N force")],
  ),
  mcq("p1", 31, "A sample of a substance has a definite shape and a definite volume. The substance changes state. The sample now has no definite shape but still has a definite volume. What is the name of the change of state?", stateChangeChoices, "D"),
  mcq(
    "p1",
    32,
    "Which statement about thermal radiation is correct?",
    [
      { value: "A", label: "It can travel through a vacuum." },
      { value: "B", label: "It is absorbed more quickly by shiny surfaces than by dull surfaces." },
      { value: "C", label: "It is emitted more quickly by shiny surfaces than by dull surfaces." },
      { value: "D", label: "It is mainly ultraviolet radiation." },
    ],
    "A",
  ),
  mcq(
    "p1",
    33,
    "A wave has a frequency of 6.0 kHz and travels at a speed of 300 m / s. What is the wavelength of the wave?",
    [
      { value: "A", label: "0.020 m" },
      { value: "B", label: "0.050 m" },
      { value: "C", label: "20 m" },
      { value: "D", label: "50 m" },
    ],
    "B",
  ),
  mcq("p1", 34, "White light passes through a glass prism and produces a spectrum. Which diagram shows the paths of the red light and the violet light?", letterChoices, "C", [image("paper1-q34-prism-spectrum.png", "Four prism ray diagrams labelled A to D", 602)]),
  mcq(
    "p1",
    35,
    "What is the frequency range of ultrasound?",
    [
      { value: "A", label: "all frequencies between 20 Hz and 20 kHz" },
      { value: "B", label: "all frequencies higher than 20 kHz" },
      { value: "C", label: "all frequencies lower than 20 Hz" },
      { value: "D", label: "all frequencies lower than 20 Hz and all frequencies higher than 20 kHz" },
    ],
    "B",
  ),
  mcq(
    "p1",
    36,
    "Two 24 ohm resistors are connected in series to a 12 V battery. What is the current in one of the resistors?",
    [
      { value: "A", label: "0.25 A" },
      { value: "B", label: "0.50 A" },
      { value: "C", label: "2.0 A" },
      { value: "D", label: "4.0 A" },
    ],
    "A",
    [image("paper1-q36-series-resistors.png", "Two 24 ohm resistors connected in series to a 12 V battery", 322)],
  ),
  mcq("p1", 37, "An electric heater and an electric motor are connected to a mains power supply. The power of the heater is 3.0 kW and the power of the motor is 1.0 kW. The cost of electricity is $0.20 per kW h. What is the total cost of using the heater and the motor for 5.0 hours?", costChoices, "D"),
  mcq("p1", 38, "A teacher wants to connect an electric heater to the mains supply. The safety label on the heater states that the heater is double-insulated. What does the teacher know from reading this label?", doubleInsulatedChoices, "A"),
  mcq(
    "p1",
    39,
    "What is a light-year?",
    [
      { value: "A", label: "the distance travelled by light in a vacuum in 1 year" },
      { value: "B", label: "the distance travelled by light in a vacuum in 100 000 years" },
      { value: "C", label: "the time taken for light to travel across the Universe" },
      { value: "D", label: "the time taken for light to travel across the Milky Way galaxy" },
    ],
    "A",
  ),
  mcq("p1", 40, "Which sequence is part of the life cycle of a small star, about the same size as the Sun?", smallStarChoices, "A"),
];

const paper2BiologyQuestions: TestQuestion[] = [
  mcq("p2", 1, "Which label represents a plasmid in this diagram of a bacterium?", letterChoices, "C", [image("paper2-q01-bacterium.png", "Bacterium diagram labelled A to D")]),
  mcq(
    "p2",
    2,
    "The actual length of a phorid fly is 5500 micrometres long. What is the magnification of this diagram of a phorid fly?",
    [
      { value: "A", label: "0.006" },
      { value: "B", label: "0.16" },
      { value: "C", label: "6.4" },
      { value: "D", label: "157" },
    ],
    "C",
    [image("paper2-q02-phorid-fly.png", "Phorid fly diagram with a 35 mm scale line", 380)],
  ),
  mcq(
    "p2",
    3,
    "Which factor would decrease the rate of diffusion from a plant cell?",
    [
      { value: "A", label: "high temperature" },
      { value: "B", label: "large surface area" },
      { value: "C", label: "small concentration gradient" },
      { value: "D", label: "small diffusion distance" },
    ],
    "C",
  ),
  mcq("p2", 4, "The diagram shows a root hair cell. Which type of transport is shown by the arrows in this diagram?", [
    { value: "A", label: "active transport" },
    { value: "B", label: "diffusion" },
    { value: "C", label: "osmosis" },
    { value: "D", label: "xylem transport" },
  ], "A", [image("paper2-q04-root-hair.png", "Root hair cell diagram with arrows", 532)]),
  mcq("p2", 5, "The data shows the concentrations of sugar and starch in an onion.", onionChoices, "D", undefined, { visualHtml: onionDataVisual, ...onionChoiceTable }),
  mcq(
    "p2",
    6,
    "An aquatic plant is placed in a beaker of water containing hydrogencarbonate indicator and kept in the dark. Which colour will the hydrogencarbonate indicator be after 24 hours?",
    [
      { value: "A", label: "blue" },
      { value: "B", label: "red" },
      { value: "C", label: "purple" },
      { value: "D", label: "yellow" },
    ],
    "D",
  ),
  mcq("p2", 7, "The diagram shows a cross-section through a leaf. What are the functions of the tissue labelled X? 1 transport of amino acids; 2 transport of sucrose; 3 transport of water; 4 support.", leafChoices, "B", [image("paper2-q07-leaf-cross-section.png", "Leaf cross-section with tissue X labelled", 620)]),
  mcq(
    "p2",
    8,
    "Which factors could a person change to reduce their risk of developing coronary heart disease? 1 diet and exercise; 2 stress and smoking; 3 genetic predisposition and age.",
    [
      { value: "A", label: "1 only" },
      { value: "B", label: "1 and 2 only" },
      { value: "C", label: "2 and 3 only" },
      { value: "D", label: "1, 2 and 3" },
    ],
    "B",
  ),
  mcq(
    "p2",
    9,
    "What produces active immunity?",
    [
      { value: "A", label: "infection by a pathogen: yes; vaccination: yes" },
      { value: "B", label: "infection by a pathogen: yes; vaccination: no" },
      { value: "C", label: "infection by a pathogen: no; vaccination: yes" },
      { value: "D", label: "infection by a pathogen: no; vaccination: no" },
    ],
    "A",
    undefined,
    activeImmunityChoiceTable,
  ),
  mcq("p2", 10, "A doctor tells a patient that they are suffering from a viral infection. Why would the doctor not prescribe antibiotics to the patient?", viralAntibioticsChoices, "A"),
  mcq("p2", 11, "Which row contains the words that can replace X, Y and Z? Energy from the Sun is transferred as X to be stored as Y energy in a Z.", foodChainChoices, "C", undefined, foodChainChoiceTable),
  mcq(
    "p2",
    12,
    "Since the introduction of grey squirrels into the UK, the number of red squirrels has decreased. Which statements could explain this decrease? 1 Grey squirrels brought a disease that kills red squirrels. 2 Grey squirrels are better at getting food. 3 Red squirrels are less obvious to predators.",
    [
      { value: "A", label: "1 only" },
      { value: "B", label: "1 and 2 only" },
      { value: "C", label: "2 and 3 only" },
      { value: "D", label: "1, 2 and 3" },
    ],
    "B",
  ),
  mcq(
    "p2",
    13,
    "Which reasons explain why deforestation contributes to climate change?",
    [
      { value: "A", label: "species become extinct: no; increased risk of flooding: no; increase in atmospheric carbon dioxide: yes" },
      { value: "B", label: "species become extinct: yes; increased risk of flooding: yes; increase in atmospheric carbon dioxide: no" },
      { value: "C", label: "species become extinct: no; increased risk of flooding: yes; increase in atmospheric carbon dioxide: no" },
      { value: "D", label: "species become extinct: yes; increased risk of flooding: no; increase in atmospheric carbon dioxide: no" },
    ],
    "A",
    undefined,
    deforestationChoiceTable,
  ),
];

const paper2ChemistryQuestions: TestQuestion[] = [
  mcq(
    "p2",
    14,
    "Which statement describes what happens to the particles of a gas during condensation?",
    [
      { value: "A", label: "They gain energy and get closer together." },
      { value: "B", label: "They gain energy and get further apart." },
      { value: "C", label: "They lose energy and get closer together." },
      { value: "D", label: "They lose energy and get further apart." },
    ],
    "C",
  ),
  mcq(
    "p2",
    15,
    "Which statement describes the giant lattice structure of sodium chloride?",
    [
      { value: "A", label: "It is a random arrangement of alternating positive and negative ions." },
      { value: "B", label: "It is a random arrangement of alternating sodium and chlorine atoms." },
      { value: "C", label: "It is a regular arrangement of alternating positive and negative ions." },
      { value: "D", label: "It is a regular arrangement of alternating sodium and chlorine atoms." },
    ],
    "C",
  ),
  mcq("p2", 16, "Which dot-and-cross diagram shows the outer shell electrons in a molecule of oxygen, O2?", letterChoices, "A", [image("paper2-q16-oxygen-dot-cross.png", "Four dot-and-cross diagrams for oxygen labelled A to D", 620)]),
  mcq(
    "p2",
    17,
    "The formula of sodium phosphate is Na3PO4. The formula of calcium chloride is CaCl2. What is the formula of calcium phosphate?",
    [
      { value: "A", label: "CaPO4" },
      { value: "B", label: "Ca3(PO4)2" },
      { value: "C", label: "Ca(PO4)2" },
      { value: "D", label: "Ca3PO4" },
    ],
    "B",
  ),
  mcq(
    "p2",
    18,
    "Which row identifies the product at each electrode during the electrolysis of molten potassium bromide using inert electrodes?",
    [
      { value: "A", label: "anode: bromide ions; cathode: potassium ions" },
      { value: "B", label: "anode: bromine; cathode: potassium" },
      { value: "C", label: "anode: potassium; cathode: bromine" },
      { value: "D", label: "anode: potassium ions; cathode: bromide ions" },
    ],
    "B",
    undefined,
    electrolysisChoiceTable,
  ),
  mcq(
    "p2",
    19,
    "Which statement explains how a catalyst increases the rate of a chemical reaction?",
    [
      { value: "A", label: "It increases the energy of the particles in the reaction mixture." },
      { value: "B", label: "It increases the minimum energy that colliding particles must have to react." },
      { value: "C", label: "It reduces the energy of the particles in the reaction mixture." },
      { value: "D", label: "It reduces the minimum energy that colliding particles must have to react." },
    ],
    "D",
  ),
  mcq(
    "p2",
    20,
    "Which equation shows a reduction of the underlined substance?",
    [
      { value: "A", label: "C + O2 -> CO2" },
      { value: "B", label: "C + CO2 -> 2CO" },
      { value: "C", label: "Mg + H2O -> MgO + H2" },
      { value: "D", label: "NaOH + HCl -> NaCl + H2O" },
    ],
    "B",
  ),
  mcq("p2", 21, "Which row identifies the formulas of an acidic oxide and a basic oxide?", oxideChoices, "A", undefined, oxideChoiceTable),
  mcq("p2", 22, "Which statement describes the trends shown by the elements down Group I of the Periodic Table?", groupIChoices, "D"),
  mcq(
    "p2",
    23,
    "Aqueous bromine is added to aqueous sodium chloride. Which statement describes the colour of the resulting mixture and explains the observation?",
    [
      { value: "A", label: "It is pale yellow-green because bromine is less reactive than chlorine." },
      { value: "B", label: "It is pale yellow-green because bromine is more reactive than chlorine." },
      { value: "C", label: "It is red-brown because bromine is less reactive than chlorine." },
      { value: "D", label: "It is red-brown because bromine is more reactive than chlorine." },
    ],
    "C",
  ),
  mcq("p2", 24, "Which statement describes helium and neon?", heliumNeonChoices, "D"),
  mcq("p2", 25, "Which statement about the industrial extraction of metals from their ores is correct?", metalExtractionChoices, "A"),
  mcq(
    "p2",
    26,
    "The diagram shows a fractionating column used in the separation of petroleum. Which row explains why fraction R is collected above fraction S?",
    [
      { value: "A", label: "boiling point of R: higher than S; average chain length of R: longer than S" },
      { value: "B", label: "boiling point of R: higher than S; average chain length of R: shorter than S" },
      { value: "C", label: "boiling point of R: lower than S; average chain length of R: longer than S" },
      { value: "D", label: "boiling point of R: lower than S; average chain length of R: shorter than S" },
    ],
    "D",
    [image("paper2-q26-fractionating-column.png", "Fractionating column with fractions R and S labelled", 420)],
    fractionChoiceTable,
  ),
  mcq("p2", 27, "A mixture of salt solution and an insoluble solid is separated by P. The insoluble solid that is collected is Q. Pure salt crystals are obtained from the separated salt solution by R of the water. Which words complete gaps P, Q and R?", separationChoices, "D", undefined, separationChoiceTable),
];

const paper2PhysicsQuestions: TestQuestion[] = [
  mcq(
    "p2",
    28,
    "A car of mass 800 kg is travelling in a straight line at a constant speed of 12 m / s. A constant resultant force then acts on the car causing the speed to increase. After 5.0 s, the speed of the car is 20 m / s. What is the size of the resultant force acting on the car?",
    [
      { value: "A", label: "0 N" },
      { value: "B", label: "500 N" },
      { value: "C", label: "1280 N" },
      { value: "D", label: "3200 N" },
    ],
    "C",
  ),
  mcq(
    "p2",
    29,
    "A rock has a mass of 20 kg. The rock is at rest at a height of 5.0 m above the ground. It then falls to the ground. What is the speed of the rock just before it hits the ground?",
    [
      { value: "A", label: "7.0 m / s" },
      { value: "B", label: "9.9 m / s" },
      { value: "C", label: "44 m / s" },
      { value: "D", label: "98 m / s" },
    ],
    "B",
  ),
  mcq("p2", 30, "A sample of a substance has a definite shape and a definite volume. The substance changes state. The sample now has no definite shape but still has a definite volume. What is the name of the change of state?", stateChangeChoices, "D"),
  mcq(
    "p2",
    31,
    "A tank is full of a warm liquid. A student wants to place a cooling unit inside the tank to cool all the liquid as quickly as possible. There are two possible positions for the cooling unit, P and Q. How does cooling affect the density of the liquid and what is the best position for the cooling unit?",
    [
      { value: "A", label: "decreases density; P" },
      { value: "B", label: "decreases density; Q" },
      { value: "C", label: "increases density; P" },
      { value: "D", label: "increases density; Q" },
    ],
    "C",
    [image("paper2-q31-cooling-tank.png", "Tank showing cooling unit positions P and Q")],
    coolingChoiceTable,
  ),
  mcq(
    "p2",
    32,
    "A seismic P-wave passes through the ground. What is the nature of this wave and what is the direction of vibration of the ground as the P-wave passes through it?",
    [
      { value: "A", label: "longitudinal; at right angles to direction of propagation" },
      { value: "B", label: "longitudinal; parallel to direction of propagation" },
      { value: "C", label: "transverse; at right angles to direction of propagation" },
      { value: "D", label: "transverse; parallel to direction of propagation" },
    ],
    "B",
  ),
  mcq("p2", 33, "White light passes through a glass prism and produces a spectrum. Which diagram shows the paths of the red light and the violet light?", letterChoices, "C", [image("paper2-q33-prism-spectrum.png", "Four prism ray diagrams labelled A to D", 602)]),
  mcq("p2", 34, "An electric heater and an electric motor are connected to a mains power supply. The power of the heater is 3.0 kW and the power of the motor is 1.0 kW. The cost of electricity is $0.20 per kW h. What is the total cost of using the heater and the motor for 5.0 hours?", costChoices, "D"),
  mcq(
    "p2",
    35,
    "A quantity is defined as the electrical work done by a source in moving a unit charge around a complete circuit. What is the quantity?",
    [
      { value: "A", label: "electric current" },
      { value: "B", label: "electromotive force (e.m.f.)" },
      { value: "C", label: "potential difference (p.d.)" },
      { value: "D", label: "resistance" },
    ],
    "B",
  ),
  mcq(
    "p2",
    36,
    "The diagram shows a battery that is connected to three LEDs, P, Q and R. Which of the LEDs are lit?",
    [
      { value: "A", label: "P only" },
      { value: "B", label: "P and Q only" },
      { value: "C", label: "Q and R only" },
      { value: "D", label: "none of them" },
    ],
    "D",
    [image("paper2-q36-led-circuit.png", "Battery connected to LEDs P, Q and R", 364)],
  ),
  mcq(
    "p2",
    37,
    "The diagram shows a 12 V battery connected to an ammeter and two 10 ohm resistors. What is the reading on the ammeter?",
    [
      { value: "A", label: "0.60 A" },
      { value: "B", label: "1.2 A" },
      { value: "C", label: "2.4 A" },
      { value: "D", label: "60 A" },
    ],
    "C",
    [image("paper2-q37-parallel-resistors.png", "12 V battery connected to an ammeter and two 10 ohm resistors", 322)],
  ),
  mcq("p2", 38, "A teacher wants to connect an electric heater to the mains supply. The safety label on the heater states that the heater is double-insulated. What does the teacher know from reading this label?", doubleInsulatedChoices, "A"),
  mcq(
    "p2",
    39,
    "A planet orbits the Sun with an orbital speed of 48 km / s. The radius of the orbit is 5.7 x 10^7 km. What is the orbital period of the planet?",
    [
      { value: "A", label: "3.7 x 10^6 s" },
      { value: "B", label: "7.5 x 10^6 s" },
      { value: "C", label: "8.6 x 10^9 s" },
      { value: "D", label: "1.7 x 10^10 s" },
    ],
    "B",
  ),
  mcq("p2", 40, "Which sequence is part of the life cycle of a small star, about the same size as the Sun?", smallStarChoices, "A"),
];

function sections(biology: TestQuestion[], chemistry: TestQuestion[], physics: TestQuestion[]) {
  return [
    {
      id: "biology",
      label: "Biology Questions 1-13",
      title: "Biology",
      hint: "Choose one answer, A, B, C or D.",
      questions: biology,
    },
    {
      id: "chemistry",
      label: "Chemistry Questions 14-27",
      title: "Chemistry",
      hint: "Choose one answer, A, B, C or D.",
      questions: chemistry,
    },
    {
      id: "physics",
      label: "Physics Questions 28-40",
      title: "Physics",
      hint: "Choose one answer, A, B, C or D.",
      questions: physics,
    },
  ];
}

export const cieIgcseCombinedSciencePaper1Core: TestDefinition = {
  id: "cie-igcse-combined-science-paper-1-core",
  title: "CIE IGCSE Combined Science Paper 1 Core",
  subject: "Science",
  level: "Core",
  status: "active",
  durationMinutes: 45,
  totalPoints: 40,
  sections: sections(paper1BiologyQuestions, paper1ChemistryQuestions, paper1PhysicsQuestions),
};

export const cieIgcseCombinedSciencePaper2Extended: TestDefinition = {
  id: "cie-igcse-combined-science-paper-2-extended",
  title: "CIE IGCSE Combined Science Paper 2 Extended",
  subject: "Science",
  level: "Extended",
  status: "active",
  durationMinutes: 45,
  totalPoints: 40,
  sections: sections(paper2BiologyQuestions, paper2ChemistryQuestions, paper2PhysicsQuestions),
};
