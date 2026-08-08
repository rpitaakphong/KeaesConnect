import type { TestDefinition } from "@/features/tests/lib/types";

const assets = "/test-assets/spip/year-8-science-pre";
const materials = ["clay", "foam", "rubber", "steel"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
const energyDescriptions = [
  { value: "moving", label: "energy it has because it is moving" },
  { value: "position", label: "energy it has because of its position" },
  { value: "changed shape", label: "energy it has because it has changed shape" },
  { value: "food or fuel", label: "energy stored in food or fuel" },
  { value: "temperature difference", label: "energy that flows because of a temperature difference" },
];
const organisms = ["crustacean", "dolphin", "fish", "killer whale", "phytoplankton"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
const planets = ["earth", "jupiter", "mercury", "saturn", "venus"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
const bins = [
  { id: "14-15", label: "14-15", min: 14, max: 15, baseCount: 6, editable: false },
  { id: "16-17", label: "16-17", min: 16, max: 17, baseCount: 12, editable: true },
  { id: "18-19", label: "18-19", min: 18, max: 19, baseCount: 16, editable: true },
  { id: "20-21", label: "20-21", min: 20, max: 21, baseCount: 8, editable: true },
  { id: "22-23", label: "22-23", min: 22, max: 23, baseCount: 5, editable: false },
];

export const spipYear8SciencePre: TestDefinition = {
  id: "spip-year-8-science-pre",
  title: "SPIP Year 8 Science Pre-test",
  subject: "Science",
  level: "SPIP Year 8",
  totalPoints: 50,
  durationMinutes: 45,
  status: "active",
  sections: [
    {
      id: "questions-1-4",
      label: "Questions 1-4",
      title: "Adaptation, materials and Earth",
      hint: "Use the figures and give scientific explanations where required.",
      groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8s-q1a", number: 1, prompt: "(a) Describe two adaptations shown in the drawing that enable the bat to fly.", points: 2, type: "multiText", compact: true,
          groupIntro: { lead: "The drawing shows a bat that lives in dark caves.", instruction: "Bats catch and eat flying insects." },
          visuals: [{ type: "image", src: `${assets}/q1-bat.png`, alt: "Bat with broad webbed wings", maxWidth: 400 }],
          fields: [{ id: "adaptation1", label: "Adaptation 1" }, { id: "adaptation2", label: "Adaptation 2" }],
          grading: { mode: "conceptGroups", display: "Any two: webbed forelimbs/wings; smooth surface; large surface area", fields: ["adaptation1", "adaptation2"], concepts: [
            { id: "wings", keywords: [["wing"], ["webbed", "forelimb"]], points: 1 },
            { id: "smooth", keywords: [["smooth"]], points: 1 },
            { id: "large-area", keywords: [["large", "surface"], ["large", "wing"], ["wide", "wing"]], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q1b", number: 1, prompt: "(b) The bat's mouth is adapted to catch and eat large insects. Suggest how the mouth is adapted.", points: 1, type: "text",
          grading: { mode: "conceptGroups", display: "Large/wide mouth; pointed, sharp or many teeth; long/large tongue", fields: ["answer"], concepts: [
            { id: "large-mouth", keywords: [["large", "mouth"], ["wide", "mouth"]], points: 1 },
            { id: "teeth", keywords: [["sharp", "teeth"], ["pointed", "teeth"], ["many", "teeth"]], points: 1 },
            { id: "tongue", keywords: [["long", "tongue"], ["large", "tongue"]], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q2a", number: 2, prompt: "(a) Match each scooter part to the material used to make it.", points: 2, type: "multiText", compact: true, uniqueOptions: true,
          groupIntro: { lead: "Mia has a new scooter." },
          visuals: [{ type: "image", src: `${assets}/q2-scooter.png`, alt: "Scooter with frame and tyre labelled", maxWidth: 430 }],
          fields: [{ id: "frame", label: "Frame", options: materials }, { id: "tyre", label: "Tyre", options: materials }],
          grading: { mode: "auto", display: "Frame: steel; tyre: rubber", parts: [
            { id: "frame", accepted: ["steel"], points: 1 }, { id: "tyre", accepted: ["rubber"], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q2b", number: 2, prompt: "(b) Some scooters have a frame made of aluminium. Write down two properties of aluminium that make it useful for making the frame.", points: 2, type: "multiText", compact: true,
          fields: [{ id: "property1", label: "Property 1" }, { id: "property2", label: "Property 2" }],
          grading: { mode: "conceptGroups", display: "Any two: strong, lightweight/low density, shiny, malleable, rigid/not brittle, does not corrode", fields: ["property1", "property2"], concepts: [
            { id: "strong", keywords: [["strong"]], points: 1 },
            { id: "lightweight", keywords: [["lightweight"], ["low", "density"]], points: 1 },
            { id: "shiny", keywords: [["shiny"]], points: 1 },
            { id: "malleable", keywords: [["malleable"]], points: 1 },
            { id: "rigid", keywords: [["rigid"], ["not", "brittle"]], points: 1 },
            { id: "corrosion", keywords: [["does not", "corrode"], ["doesn't", "corrode"], ["not", "rust"], ["does not", "rust"]], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q3a", number: 3, prompt: "(a) Why does the Sun appear to move in the sky during the day?", points: 1, type: "text",
          groupIntro: { lead: "Pierre draws the position of the Sun at different times of the day." },
          visuals: [{ type: "image", src: `${assets}/q3-sun.png`, alt: "Apparent movement of the Sun across the sky", maxWidth: 620 }],
          grading: { mode: "conceptGroups", display: "The Earth moves/rotates/spins (not orbiting the Sun)", fields: ["answer"], concepts: [{ id: "rotation", keywords: [["earth", "rotat"], ["earth", "spin"], ["earth", "move"]], excludedTerms: ["orbit", "around the sun", "round the sun"], points: 1 }] },
        },
        {
          id: "spip-y8s-q3b", number: 3, prompt: "(b) Why is the position of the Sun in the summer sky different from its position in the winter sky?", points: 1, type: "singleChoice", choices: [
            { value: "earth tilted", label: "The Earth has a tilted axis" }, { value: "earth farther", label: "The Earth is further from the Sun" },
            { value: "sun tilted", label: "The Sun has a tilted axis" }, { value: "sun closer", label: "The Sun is closer to the Earth" },
          ], grading: { mode: "auto", display: "The Earth has a tilted axis", parts: [{ id: "answer", accepted: ["earth tilted"], points: 1 }] },
        },
        {
          id: "spip-y8s-q4a", number: 4, prompt: "(a) Why did Louis Pasteur boil the broth at the beginning of the experiment?", points: 1, type: "text",
          groupIntro: { lead: "Louis Pasteur did the following experiment." },
          visuals: [{ type: "image", src: `${assets}/q4-pasteur.png`, alt: "Pasteur broth experiment with swan-neck flasks", maxWidth: 680 }],
          grading: { mode: "conceptGroups", display: "To kill/destroy microorganisms, microbes or bacteria; or sterilise the broth", fields: ["answer"], concepts: [{ id: "sterilise", keywords: [["kill", "microorgan"], ["kill", "microbe"], ["kill", "bacteria"], ["destroy", "microorgan"], ["destroy", "microbe"], ["destroy", "bacteria"], ["sterilis"], ["steriliz"]], points: 1 }] },
        },
        {
          id: "spip-y8s-q4b", number: 4, prompt: "(b) Why did no microorganisms grow in step B?", points: 1, type: "text",
          grading: { mode: "conceptGroups", display: "Microorganisms were caught in the bend or could not get into the broth", fields: ["answer"], concepts: [{ id: "blocked", keywords: [["microorgan", "caught", "bend"], ["bacteria", "caught", "bend"], ["microbe", "caught", "bend"], ["microorgan", "not reach", "broth"], ["bacteria", "not reach", "broth"], ["microbe", "not reach", "broth"], ["microorgan", "could not", "reach"], ["bacteria", "could not", "reach"], ["microbe", "could not", "reach"], ["microorgan", "couldn't", "broth"], ["bacteria", "couldn't", "broth"], ["microbe", "couldn't", "broth"], ["microorgan", "not", "get", "broth"], ["bacteria", "not", "get", "broth"], ["microbe", "not", "get", "broth"]], points: 1 }] },
        },
      ],
    },
    {
      id: "questions-5-8",
      label: "Questions 5-8",
      title: "Changes, Earth and forces",
      hint: "Complete every part, including the interactive measurement and graph tasks.",
      groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8s-q5a", number: 5, prompt: "(a) What is the name of apparatus X?", points: 1, type: "text",
          groupIntro: { lead: "Oliver investigates change of state. He puts crushed ice into a beaker and heats it gently.", instruction: "Every 2 minutes Oliver records the temperature using apparatus X." },
          visuals: [{ type: "image", src: `${assets}/q5-heating.png`, alt: "Crushed ice heated in a beaker with apparatus X", maxWidth: 330 }],
          grading: { mode: "auto", display: "thermometer", parts: [{ id: "answer", accepted: ["thermometer", "a thermometer"], points: 1 }] },
        },
        {
          id: "spip-y8s-q5bi", number: 5, prompt: "(b)(i) The table shows Oliver's results. Describe the pattern in these results after the first two minutes.", points: 1, type: "text",
          visualHtml: `<table class="cambridge-data-table"><thead><tr><th>Time of heating (min)</th><th>Temperature (°C)</th></tr></thead><tbody><tr><td>0</td><td>0</td></tr><tr><td>2</td><td>0</td></tr><tr><td>4</td><td>20</td></tr><tr><td>6</td><td>40</td></tr><tr><td>8</td><td>50</td></tr><tr><td>10</td><td>80</td></tr></tbody></table>`,
          grading: { mode: "conceptGroups", display: "The temperature increases as heating time increases", fields: ["answer"], concepts: [{ id: "increase", keywords: [["temperature", "increase", "time"], ["gets", "hotter", "time"]], points: 1 }] },
        },
        { id: "spip-y8s-q5bii", number: 5, prompt: "(b)(ii) Which result does not fit this pattern?", points: 1, type: "text", inputMode: "number", placeholder: "Temperature (°C)", grading: { mode: "auto", display: "50°C", parts: [{ id: "answer", accepted: ["50", "50 c", "50°c"], points: 1 }] } },
        {
          id: "spip-y8s-q5c", number: 5, prompt: "(c) Complete the sentences about the particles during heating.", points: 2, type: "multiText", compact: true,
          inlineRows: [
            { items: [{ text: "In the first two minutes ice changes from " }, { type: "input", id: "from" }, { text: " to " }, { type: "input", id: "to" }, { text: "." }] },
            { items: [{ text: "In the next two minutes the particles gain more " }, { type: "input", id: "gain" }, { text: " and move " }, { type: "input", id: "move" }, { text: "." }] },
          ],
          fields: [{ id: "from", label: "Starting state" }, { id: "to", label: "New state" }, { id: "gain", label: "What particles gain" }, { id: "move", label: "How particles move" }],
          grading: { mode: "auto", display: "solid to liquid; energy; faster/apart", markGroups: [
            { id: "state-change", partIds: ["from", "to"], minCorrect: 2, points: 1 }, { id: "particles", partIds: ["gain", "move"], minCorrect: 2, points: 1 },
          ], parts: [
            { id: "from", accepted: ["solid", "a solid"], points: 1 }, { id: "to", accepted: ["liquid", "a liquid"], points: 1 },
            { id: "gain", accepted: ["energy", "heat energy", "thermal energy"], points: 1 }, { id: "move", accepted: ["faster", "further apart", "apart", "more quickly", "quicker"], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q6", number: 6, prompt: "The Earth is made of several layers. The diagram shows the different layers of the Earth. Complete the sentences about the structure of the Earth.", points: 4, type: "multiText", compact: true,
          visuals: [{ type: "image", src: `${assets}/q6-earth.png`, alt: "Cutaway diagram showing the layers of the Earth", maxWidth: 300 }],
          inlineRows: [
            { items: [{ text: "(a) The centre of the Earth is called the " }, { type: "input", id: "centre" }, { text: "." }] },
            { items: [{ text: "(b) The mantle contains some liquid rock. This liquid rock is called " }, { type: "input", id: "mantle" }, { text: "." }] },
            { items: [{ text: "(c) Liquid rock that erupts from volcanoes is called " }, { type: "input", id: "erupts" }, { text: "." }] },
            { items: [{ text: "(d) When the liquid rock cools it turns into a type of rock called " }, { type: "input", id: "rock" }, { text: " rock." }] },
          ],
          fields: [{ id: "centre", label: "Centre of the Earth" }, { id: "mantle", label: "Liquid rock in the mantle" }, { id: "erupts", label: "Liquid rock after eruption" }, { id: "rock", label: "Rock formed after cooling" }],
          grading: { mode: "auto", display: "core; magma; lava; igneous", parts: [
            { id: "centre", accepted: ["core", "the core", "inner core", "outer core", "the inner core", "the outer core"], points: 1 }, { id: "mantle", accepted: ["magma"], points: 1 },
            { id: "erupts", accepted: ["lava"], points: 1 }, { id: "rock", accepted: ["igneous", "igneous rock", "basalt", "granite", "pumice"], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q7a", number: 7, prompt: "(a) A 100 N driving force acts forwards and a 60 N force acts backwards. What happens to the truck?", points: 1, type: "singleChoice",
          groupIntro: { lead: "A truck is moving forward.", instruction: "Forces act on the truck." },
          visuals: [{ type: "image", src: `${assets}/q7-forces.png`, alt: "Truck with 100 newton forward force and 60 newton backward force", maxWidth: 680 }],
          choices: ["does not move", "moves backwards", "turns left", "speeds up", "slows down"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) })),
          grading: { mode: "auto", display: "speeds up", parts: [{ id: "answer", accepted: ["speeds up"], points: 1 }] },
        },
        { id: "spip-y8s-q7b", number: 7, prompt: "(b) Name the 60 N force acting against the driving force.", points: 1, type: "text", grading: { mode: "auto", display: "friction / air resistance / resistance / drag", parts: [{ id: "answer", accepted: ["friction", "air resistance", "resistance", "drag"], points: 1 }] } },
        {
          id: "spip-y8s-q7ci", number: 7, prompt: "(c)(i) Draw one arrow on or next to the truck to show its weight.", points: 1, type: "diagramAnnotation", variant: "directionArrow",
          backgroundSrc: `${assets}/q7-truck.png`, backgroundAlt: "Side view of a truck for drawing its weight force",
          geometry: { variant: "directionArrow", region: { minX: 0.04, maxX: 0.96, minY: 0.08, maxY: 0.95 }, direction: "down", angleToleranceDegrees: 28, minLength: 0.08 },
          grading: { mode: "auto", display: "One downward arrow on or next to the truck", parts: [] },
        },
        {
          id: "spip-y8s-q7cii", number: 7, prompt: "(c)(ii) The weight of the truck is increased. What does gravity do to the truck?", points: 1, type: "singleChoice",
          choices: ["moves it backwards", "moves it downwards", "moves it forwards", "moves it upwards", "speeds it up"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) })),
          grading: { mode: "auto", display: "moves it downwards", parts: [{ id: "answer", accepted: ["moves it downwards"], points: 1 }] },
        },
        {
          id: "spip-y8s-q8a", number: 8, prompt: "(a) Measure the length of the three seeds in millimetres. Put each length in the box below the seed.", points: 1, type: "virtualMeasurement", scoringStrategy: "allCorrect",
          groupIntro: { lead: "Jamila and Youssef investigate variation in the length of seeds. They use 50 seeds, measure the length of 47 seeds, and do not have time to measure the length of 3 seeds." },
          backgroundSrc: `${assets}/q8-seeds.png`, backgroundAlt: "Three actual-size seeds to measure",
          measurements: [
            { id: "seed1", label: "Seed 1", unit: "mm", expected: 19.5, tolerance: 0.55, calibration: 28.4, start: { x: 0.17, y: 0.24 }, end: { x: 0.17, y: 0.93 } },
            { id: "seed2", label: "Seed 2", unit: "mm", expected: 18.5, tolerance: 0.55, calibration: 28.4, start: { x: 0.41, y: 0.27 }, end: { x: 0.41, y: 0.93 } },
            { id: "seed3", label: "Seed 3", unit: "mm", expected: 20.5, tolerance: 0.55, calibration: 28.4, start: { x: 0.69, y: 0.21 }, end: { x: 0.69, y: 0.93 } },
          ], grading: { mode: "auto", display: "19-20 mm; 18-19 mm; 20-21 mm", parts: [] },
        },
        {
          id: "spip-y8s-q8b", number: 8, prompt: "(b) Add the three measured seeds to the tally chart and complete the affected totals.", points: 3, type: "tallyTable",
          sourceQuestionId: "spip-y8s-q8a", bins, measurementIds: ["seed1", "seed2", "seed3"], measurementCalibrations: { seed1: 28.4, seed2: 28.4, seed3: 28.4 },
          grading: { mode: "auto", display: "ECF totals: 16-17 = 12; 18-19 = 17 or 18; 20-21 = 9 or 10", parts: [] },
        },
        {
          id: "spip-y8s-q8c", number: 8, prompt: "(c) Use the tally chart to complete the histogram on the grid. Label the y-axis. The x-axis has been done for you.", points: 3, type: "histogram",
          sourceQuestionId: "spip-y8s-q8b", yMaxOptions: [20, 25, 30], axisKeywords: [["number", "seed"], ["total", "seed"], ["frequency"]],
          categories: bins.map((bin) => ({ id: bin.id, label: bin.label, fixedValue: bin.editable ? undefined : bin.baseCount })),
          grading: { mode: "auto", display: "Y-axis: total number of seeds; bars follow the completed tally totals", parts: [] },
        },
      ],
    },
    {
      id: "questions-9-12",
      label: "Questions 9-12",
      title: "Acids, organisms, energy and friction",
      hint: "Select or explain each answer using the information shown.",
      groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8s-q9a", number: 9, prompt: "(a) Which is the best description of a solution with a pH of 5?", points: 1, type: "singleChoice",
          groupIntro: { lead: "Universal Indicator can be used to estimate the pH value of a solution." },
          choices: ["neutral", "strongly acidic", "strongly alkaline", "weakly acidic", "weakly alkaline"].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) })),
          grading: { mode: "auto", display: "weakly acidic", parts: [{ id: "answer", accepted: ["weakly acidic"], points: 1 }] },
        },
        { id: "spip-y8s-q9b", number: 9, prompt: "(b) What is the pH of a neutral solution?", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "7", parts: [{ id: "answer", accepted: ["7", "pH 7"], points: 1 }] } },
        {
          id: "spip-y8s-q10a", number: 10, prompt: "(a) To which group of vertebrates do ostriches belong?", points: 1, type: "text",
          groupIntro: { lead: "Ostriches belong to a group of vertebrates.", instruction: "The drawing shows an ostrich." },
          visuals: [{ type: "image", src: `${assets}/q10-ostrich.png`, alt: "Drawing of an ostrich", maxWidth: 260 }],
          grading: { mode: "auto", display: "birds / Aves", parts: [{ id: "answer", accepted: ["bird", "birds", "aves", "avian", "avians"], points: 1 }] },
        },
        {
          id: "spip-y8s-q10b", number: 10, prompt: "(b) Use the drawing to give two reasons for your answer to part (a).", points: 2, type: "multiText", compact: true,
          fields: [{ id: "reason1", label: "Reason 1" }, { id: "reason2", label: "Reason 2" }],
          grading: { mode: "conceptGroups", display: "Any two: feathers; beak/bill; wings", fields: ["reason1", "reason2"], dependency: { questionId: "spip-y8s-q10a", accepted: ["bird", "birds", "aves", "avian", "avians"] }, concepts: [
            { id: "feathers", keywords: [["feather"]], points: 1 }, { id: "beak", keywords: [["beak"], ["bill"]], points: 1 }, { id: "wings", keywords: [["wing"]], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q11", number: 11, prompt: "Match each type of energy to its description.", points: 3, type: "multiText", compact: true, uniqueOptions: true,
          fields: [
            { id: "chemical", label: "Chemical", options: energyDescriptions }, { id: "elastic", label: "Elastic potential", options: energyDescriptions },
            { id: "gravitational", label: "Gravitational potential", options: energyDescriptions }, { id: "thermal", label: "Heat (thermal)", options: energyDescriptions },
            { id: "kinetic", label: "Kinetic", options: energyDescriptions },
          ],
          grading: { mode: "auto", display: "chemical-food/fuel; elastic-changed shape; gravitational-position; thermal-temperature difference; kinetic-moving", scoreThresholds: [{ minCorrect: 5, points: 3 }, { minCorrect: 3, points: 2 }, { minCorrect: 1, points: 1 }], parts: [
            { id: "chemical", accepted: ["food or fuel"], points: 1 }, { id: "elastic", accepted: ["changed shape"], points: 1 },
            { id: "gravitational", accepted: ["position"], points: 1 }, { id: "thermal", accepted: ["temperature difference"], points: 1 }, { id: "kinetic", accepted: ["moving"], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q12a", number: 12, prompt: "(a) How many of the four statements about friction are true?", points: 1, type: "singleChoice",
          groupIntro: { lead: "Friction is a type of force." },
          note: "Friction acts in the opposite direction to motion. Friction can be reduced by using oil. Friction can be useful. Friction is a force that slows down moving objects.",
          choices: [0, 1, 2, 3, 4].map((value) => ({ value: String(value), label: String(value) })), grading: { mode: "auto", display: "4", parts: [{ id: "answer", accepted: ["4"], points: 1 }] },
        },
        {
          id: "spip-y8s-q12b", number: 12, prompt: "(b) Ice skates have thin blades. There is a layer of water between the thin blade and the ice. Explain how this layer of water helps the skater.", points: 2, type: "text", inputMode: "textarea",
          visuals: [{ type: "image", src: `${assets}/q12-skate.png`, alt: "Ice skate with a thin blade and a layer of water", maxWidth: 360 }],
          grading: { mode: "conceptGroups", display: "Water reduces friction/acts as a lubricant, so the skater can go faster", fields: ["answer"], concepts: [
            { id: "lubrication", keywords: [["reduce", "friction"], ["less", "friction"], ["lubric"]], points: 1 },
            { id: "movement", keywords: [["move", "faster"], ["go", "faster"], ["skate", "faster"], ["travel", "faster"]], points: 1 },
          ] },
        },
      ],
    },
    {
      id: "questions-13-15",
      label: "Questions 13-15",
      title: "Food chains, materials and planets",
      hint: "Complete the sequence and use the planet data table.",
      groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8s-q13", number: 13, prompt: "Complete the ocean food chain from top predator to producer. Sunlight is shown below the final box.", points: 2, type: "multiText", compact: true, uniqueOptions: true,
          visualHtml: `<div class="science-information-block"><p>These organisms all live in the ocean.</p><p><strong>crustacean, dolphin, fish, killer whale, phytoplankton</strong></p><p>The organisms all belong to the same food chain.</p><p>Read the information to help you work out the food chain.</p><ul><li><strong>crustacean</strong> &ndash; eats phytoplankton and is the prey of fish</li><li><strong>dolphin</strong> &ndash; is a predator of fish</li><li><strong>killer whale</strong> &ndash; is the top predator in the food chain</li><li><strong>phytoplankton</strong> &ndash; is a microscopic producer that uses energy from sunlight</li></ul><p>Write the names of the five organisms in the correct boxes to complete the food chain.</p></div>`,
          fields: [1, 2, 3, 4, 5].map((position) => ({ id: `position${position}`, label: `Position ${position}`, options: organisms })),
          grading: { mode: "auto", display: "killer whale -> dolphin -> fish -> crustacean -> phytoplankton -> sunlight", markGroups: [
            { id: "ends", partIds: ["position1", "position5"], minCorrect: 2, points: 1 },
          ], sequenceGroups: [
            { id: "predator-sequence", partIds: ["position1", "position2", "position3", "position4", "position5"], acceptedSequence: ["dolphin", "fish", "crustacean"], points: 1 },
          ], parts: [
            { id: "position1", accepted: ["killer whale"], points: 1 }, { id: "position2", accepted: ["dolphin"], points: 1 },
            { id: "position3", accepted: ["fish"], points: 1 }, { id: "position4", accepted: ["crustacean"], points: 1 }, { id: "position5", accepted: ["phytoplankton"], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q14", number: 14, prompt: "Write two differences between metals and non-metals, other than melting and boiling points.", points: 2, type: "multiText", compact: true,
          visualHtml: `<div class="science-information-block"><p>Some substances are metals and other substances are non-metals.</p><p>Metals often have high melting and boiling points, <strong>but</strong> non-metals often have low melting and boiling points.</p></div>`,
          fields: [{ id: "difference1", label: "Difference 1" }, { id: "difference2", label: "Difference 2" }],
          grading: { mode: "conceptGroups", display: "Any two valid comparisons of heat/electrical conductivity, strength, hardness, ductility, density, malleability, flexibility or sonority", fields: ["difference1", "difference2"], concepts: [
            { id: "heat-conductivity", keywords: [["metal", "conduct", "heat", "non metal"], ["metal", "heat", "conductor", "non metal"]], points: 1 },
            { id: "electrical-conductivity", keywords: [["metal", "conduct", "electric", "non metal"], ["metal", "electrical", "conductor", "non metal"]], points: 1 },
            { id: "strength", keywords: [["metal", "strong", "non metal", "weak"], ["metal", "strong", "non metal", "not"]], points: 1 },
            { id: "hardness", keywords: [["metal", "hard", "non metal", "soft"], ["metal", "hard", "non metal", "not"]], points: 1 },
            { id: "ductility", keywords: [["metal", "ductile", "non metal"], ["metal", "wire", "non metal"]], points: 1 },
            { id: "density", keywords: [["metal", "density", "non metal"]], points: 1 },
            { id: "malleability", keywords: [["metal", "malleable", "non metal"], ["metal", "shape", "non metal", "brittle"]], points: 1 },
            { id: "flexibility", keywords: [["metal", "flexible", "non metal"]], points: 1 },
            { id: "sonority", keywords: [["metal", "sonorous", "non metal"], ["metal", "ring", "non metal"]], points: 1 },
          ] },
        },
        {
          id: "spip-y8s-q15a", number: 15, prompt: "(a) Which planet has the largest orbit?", points: 1, type: "singleChoice", choices: planets,
          groupIntro: { lead: "This question is about different planets." },
          grading: { mode: "auto", display: "Saturn", parts: [{ id: "answer", accepted: ["saturn"], points: 1 }] },
        },
        {
          id: "spip-y8s-q15b", number: 15, prompt: "(b) Which planet takes the shortest time to orbit the Sun?", points: 1, type: "singleChoice", choices: planets,
          grading: { mode: "auto", display: "Mercury", parts: [{ id: "answer", accepted: ["mercury"], points: 1 }] },
        },
        {
          id: "spip-y8s-q15ci", number: 15, prompt: "(c)(i) Chen has a weight of 600 N on Earth. Estimate Chen's weight on Mercury. Circle the correct answer.", points: 1, type: "singleChoice",
          visualHtml: `<div class="science-information-block"><p>Chen finds this information using the internet.</p><p>It shows how much two people weigh on different planets.</p><table class="cambridge-data-table"><thead><tr><th>Planet</th><th>Weight<br>in N</th><th>Weight<br>in N</th></tr></thead><tbody><tr><td>Mercury</td><td>190</td><td>285</td></tr><tr><td>Venus</td><td>450</td><td>682</td></tr><tr><td>Earth</td><td>500</td><td>750</td></tr><tr><td>Jupiter</td><td>1170</td><td>1755</td></tr><tr><td>Saturn</td><td>530</td><td>795</td></tr></tbody></table></div>`,
          choices: ["130 N", "190 N", "230 N", "285 N"].map((value) => ({ value, label: value })), grading: { mode: "auto", display: "230 N", parts: [{ id: "answer", accepted: ["230 N"], points: 1 }] },
        },
        { id: "spip-y8s-q15cii", number: 15, prompt: "(c)(ii) Chen's friend has a mass of 50 kg on Earth. What is his mass on Venus?", points: 1, type: "text", inputMode: "number", placeholder: "kg", grading: { mode: "auto", display: "50 kg", parts: [{ id: "answer", accepted: ["50", "50 kg", "50kg"], points: 1 }] } },
      ],
    },
  ],
};
