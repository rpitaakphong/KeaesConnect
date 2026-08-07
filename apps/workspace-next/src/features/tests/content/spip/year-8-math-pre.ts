import type { GeometryPoint, TestDefinition } from "@/features/tests/lib/types";

const assets = "/test-assets/spip/year-8-math-pre";
const names = ["Oliver", "Jamila", "Anastasia", "Hassan", "Youssef", "Blessy"].map((label) => ({ value: label.toLowerCase(), label }));
const triangle: [GeometryPoint, GeometryPoint, GeometryPoint] = [
  { x: 0.087, y: 0.473 },
  { x: 0.863, y: 0.024 },
  { x: 0.863, y: 0.923 },
];

function interpolate(start: GeometryPoint, end: GeometryPoint, ratio: number) {
  return { x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio };
}

const triangleSnapPoints = triangle.flatMap((start, index) => {
  const end = triangle[(index + 1) % triangle.length];
  return Array.from({ length: 7 }, (_, step) => interpolate(start, end, step / 6));
});
const coordinateSnapPoints = Array.from({ length: 9 }, (_, index) => 0.062 + index * 0.104).flatMap((x) => [
  { x, y: 0.091 },
  { x, y: 0.831 },
]);

export const spipYear8MathPre: TestDefinition = {
  id: "spip-year-8-math-pre",
  title: "SPIP Year 8 Math Pre-test",
  subject: "Math",
  level: "SPIP Year 8",
  totalPoints: 45,
  durationMinutes: 55,
  status: "active",
  sections: [
    {
      id: "questions-1-7",
      label: "Questions 1-7",
      title: "Number, measurement and shape",
      hint: "Show working where a question is worth more than one mark.",
      groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8m-q1a", number: 1, prompt: "(a) A multiple of 12", points: 1, type: "text", inputMode: "number",
          groupIntro: { lead: "Here is a list of numbers.", items: ["6", "10", "19", "25", "35", "40", "48"], instruction: "From the list, write down:" },
          grading: { mode: "auto", display: "48", parts: [{ id: "answer", accepted: ["48"], points: 1 }] },
        },
        { id: "spip-y8m-q1b", number: 1, prompt: "(b) A prime number", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "19", parts: [{ id: "answer", accepted: ["19"], points: 1 }] } },
        { id: "spip-y8m-q1c", number: 1, prompt: "(c) A square number", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "25", parts: [{ id: "answer", accepted: ["25"], points: 1 }] } },
        {
          id: "spip-y8m-q2", number: 2, prompt: "A formula used in science is v = u + at. Work out v when u = 7, a = 5 and t = 9.", points: 2, type: "text", inputMode: "number",
          grading: { mode: "auto", display: "52", parts: [{ id: "answer", accepted: ["52", "52.0"], points: 2 }] },
        },
        { id: "spip-y8m-q3", number: 3, prompt: "47 students go to a sports centre in buses. A bus can hold 14 students. Find the number of buses needed.", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "4 buses", parts: [{ id: "answer", accepted: ["4", "4 buses"], points: 1 }] } },
        {
          id: "spip-y8m-q4a", number: 4, prompt: "(a) Write the names of the people who gave the smallest and largest estimates.", points: 1, type: "multiText", compact: true,
          groupIntro: {
            lead: "Six people estimate the mass of a cake in kilograms.",
            table: { headers: ["Name", "Estimate (kg)"], rows: [["Oliver", "0.75"], ["Jamila", "0.8"], ["Anastasia", "0.71"], ["Hassan", "0.385"], ["Youssef", "0.6"], ["Blessy", "0.799"]] },
          },
          fields: [
            { id: "smallest", label: "Gives the smallest estimate", options: names, control: "select" },
            { id: "largest", label: "Gives the largest estimate", options: names, control: "select" },
          ],
          grading: { mode: "auto", display: "Hassan; Jamila", scoreThresholds: [{ minCorrect: 2, points: 1 }], parts: [{ id: "smallest", accepted: ["hassan", "h"], points: 1 }, { id: "largest", accepted: ["jamila", "j"], points: 1 }] },
        },
        {
          id: "spip-y8m-q4b", number: 4, prompt: "(b) The actual mass is 0.68 kg. Whose estimate is closest?", points: 1, type: "singleChoice", choices: names,
          grading: { mode: "auto", display: "Anastasia", parts: [{ id: "answer", accepted: ["anastasia"], points: 1 }] },
        },
        {
          id: "spip-y8m-q5a", number: 5, prompt: "(a) Draw one straight line to divide the triangle into a trapezium and an equilateral triangle.", points: 1, type: "geometryConstruction", boardMaxWidth: 340, hideUndo: true, maxSegments: 1,
          groupIntro: { lead: "Here is an equilateral triangle drawn on an isometric grid.", instruction: "The completed example shows how one straight line can divide an equilateral triangle into two right-angled triangles." },
          visuals: [{ type: "image", src: `${assets}/q5-example.png`, alt: "Example showing an equilateral triangle divided into two right-angled triangles", maxWidth: 280 }],
          backgroundSrc: `${assets}/q5-grid.png`, backgroundAlt: "Equilateral triangle on an isometric grid", snapPoints: triangleSnapPoints,
          geometry: { variant: "trianglePartition", triangle, partition: "trapeziumTriangle", subdivisions: 6, endpointTolerance: 0.035 },
          grading: { mode: "auto", display: "Any correct orientation dividing the triangle into the required shapes", parts: [] },
        },
        {
          id: "spip-y8m-q5b", number: 5, prompt: "(b) Draw two straight lines to divide the triangle into a rhombus and two equilateral triangles.", points: 1, type: "geometryConstruction", boardMaxWidth: 340, hideUndo: true, maxSegments: 2,
          backgroundSrc: `${assets}/q5-grid.png`, backgroundAlt: "Equilateral triangle on an isometric grid", snapPoints: triangleSnapPoints,
          geometry: { variant: "trianglePartition", triangle, partition: "rhombusTwoTriangles", subdivisions: 6, endpointTolerance: 0.035 },
          grading: { mode: "auto", display: "Any correct orientation dividing the triangle into the required shapes", parts: [] },
        },
        {
          id: "spip-y8m-q6", number: 6, prompt: "The scale shows measurements in kilograms. Write down scale reading (kg) and measurement (g).", points: 2, type: "multiText", compact: true,
          visuals: [{ type: "image", src: `${assets}/q6-scale.png`, alt: "Kilogram scale with pointer at 0.65 kilograms", maxWidth: 560 }],
          fields: [{ id: "reading", label: "Scale reading (kg)", placeholder: "kg" }, { id: "grams", label: "Measurement (g)", placeholder: "grams" }],
          grading: { mode: "dependent", display: "0.65 kg = 650 g", rule: { type: "fieldConversion", sourceField: "reading", targetField: "grams", multiplier: 1000, sourceAccepted: ["0.65", ".65"], fullCreditAccepted: ["650"], tolerance: 0.01 } },
        },
        {
          id: "spip-y8m-q7", number: 7, prompt: "Name the solid with 5 faces, 9 edges and 6 vertices.", points: 1, type: "text",
          visualHtml: `<table class="cambridge-data-table"><thead><tr><th>Faces</th><th>Edges</th><th>Vertices</th></tr></thead><tbody><tr><td>5</td><td>9</td><td>6</td></tr></tbody></table>`,
          grading: { mode: "auto", display: "Triangular prism", parts: [{ id: "answer", accepted: ["triangular prism", "triangle prism", "trianglar prism"], points: 1 }] },
        },
      ],
    },
    {
      id: "questions-8-14", label: "Questions 8-14", title: "Data, calculation and reasoning", hint: "Use the diagrams and tables provided.", groupByQuestionNumber: true,
      questions: [
        { id: "spip-y8m-q8a", number: 8, prompt: "(a) Write down the range of marks.", points: 1, type: "text", inputMode: "number", groupIntro: { lead: "Some students take a test. Their marks are shown in the frequency diagram." }, visuals: [{ type: "image", src: `${assets}/q8-frequency.png`, alt: "Frequency diagram of student marks", maxWidth: 590 }], grading: { mode: "auto", display: "6", parts: [{ id: "answer", accepted: ["6"], points: 1 }] } },
        { id: "spip-y8m-q8b", number: 8, prompt: "(b) Find the total number of students who took the test.", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "31", parts: [{ id: "answer", accepted: ["31"], points: 1 }] } },
        { id: "spip-y8m-q8c", number: 8, prompt: "(c) Find the median mark.", points: 1, type: "text", inputMode: "number", grading: { mode: "auto", display: "8", parts: [{ id: "answer", accepted: ["8"], points: 1 }] } },
        {
          id: "spip-y8m-q9", number: 9, prompt: "Complete the missing digits in this subtraction.", points: 2, type: "multiText", compact: true,
          fields: [{ id: "top", label: "First missing digit", placeholder: " " }, { id: "middle", label: "Second missing digit", placeholder: " " }, { id: "bottom", label: "Third missing digit", placeholder: " " }],
          inlineRows: [
            { className: "spip-y8m-q9-row", items: [{ text: "" }, { type: "input", id: "top" }, { text: "2" }, { text: "." }, { text: "3" }, { text: "3" }] },
            { className: "spip-y8m-q9-row", items: [{ text: "−" }, { text: "1" }, { text: "4" }, { text: "." }, { type: "input", id: "middle" }, { text: "9" }] },
            { className: "spip-y8m-q9-row spip-y8m-q9-result", items: [{ text: "" }, { text: "2" }, { text: "7" }, { text: "." }, { text: "9" }, { type: "input", id: "bottom" }] },
          ],
          grading: { mode: "auto", display: "42.33 − 14.39 = 27.94", scoreThresholds: [{ minCorrect: 2, points: 1 }, { minCorrect: 3, points: 2 }], parts: [{ id: "top", accepted: ["4"], points: 1 }, { id: "middle", accepted: ["3"], points: 1 }, { id: "bottom", accepted: ["4"], points: 1 }] },
        },
        {
          id: "spip-y8m-q10", number: 10, prompt: "Find the order of rotational symmetry for each of these two-dimensional shapes. The first one has been done for you.", points: 2, type: "multiText", compact: true,
          visuals: [{ type: "image", src: `${assets}/q10-rotational-symmetry.png`, alt: "Four shapes for rotational symmetry, with the first completed as an example", maxWidth: 700 }],
          fields: [{ id: "shape2", label: "Order of second shape", placeholder: " " }, { id: "shape3", label: "Order of third shape", placeholder: " " }, { id: "shape4", label: "Order of fourth shape", placeholder: " " }],
          inlineRows: [{ className: "spip-y8m-q10-order-row", items: [{ text: "Order 2" }, { type: "input", id: "shape2", prefix: "Order" }, { type: "input", id: "shape3", prefix: "Order" }, { type: "input", id: "shape4", prefix: "Order" }] }],
          grading: { mode: "auto", display: "1; 6; 3", scoreThresholds: [{ minCorrect: 2, points: 1 }, { minCorrect: 3, points: 2 }], parts: [{ id: "shape2", accepted: ["1"], points: 1 }, { id: "shape3", accepted: ["6"], points: 1 }, { id: "shape4", accepted: ["3"], points: 1 }] },
        },
        {
          id: "spip-y8m-q11", number: 11, prompt: "Orange juice and grapefruit juice are mixed in the ratio 3:1 to make 10 litres. Find the amount of orange juice.", points: 2, type: "multiText", compact: true,
          fields: [{ id: "working", label: "Working", placeholder: "Show your calculation" }, { id: "answer", label: "Orange juice", placeholder: "litres" }],
          grading: { mode: "auto", display: "7.5 litres", scoringStrategy: "highestCorrect", parts: [{ id: "working", accepted: [], normalizer: "keywords", keywords: [["10", "4"], ["2.5"], ["3/4", "10"]], points: 1, reviewRecommended: false }, { id: "answer", accepted: ["7.5", "7.5 litres", "7.5l", "7 1/2"], points: 2 }] },
        },
        {
          id: "spip-y8m-q12", number: 12, prompt: "Draw the line x = 2 on the grid.", points: 1, type: "geometryConstruction", maxSegments: 1,
          backgroundSrc: `${assets}/q12-coordinate-grid.png`, backgroundAlt: "Coordinate grid from negative four to four", snapPoints: coordinateSnapPoints,
          geometry: { variant: "coordinateLine", start: { x: 0.685, y: 0.091 }, end: { x: 0.685, y: 0.831 }, endpointTolerance: 0.025 },
          grading: { mode: "auto", display: "A ruled vertical line at x = 2 across the complete grid", parts: [] },
        },
        {
          id: "spip-y8m-q13", number: 13, prompt: "Class 7P has mean 56 and range 27. Class 7T has mean 60 and range 20. Pierre says 7P did better. Explain why he is wrong.", points: 1, type: "text", inputMode: "textarea",
          visualHtml: `<table class="cambridge-data-table"><thead><tr><th>Class</th><th>Mean</th><th>Range</th></tr></thead><tbody><tr><td>7P</td><td>56</td><td>27</td></tr><tr><td>7T</td><td>60</td><td>20</td></tr></tbody></table>`,
          grading: { mode: "auto", display: "7T has the higher mean; a higher range does not mean better performance.", parts: [{ id: "answer", accepted: [], normalizer: "keywords", keywords: [["7t", "higher", "mean"], ["7t", "4", "average"], ["7p", "less consistent"], ["range", "not", "better"]], points: 1, reviewRecommended: true }] },
        },
        {
          id: "spip-y8m-q14", number: 14, prompt: "Complete the train-journey table.", points: 2, type: "multiText", compact: true,
          fields: [{ id: "duration", label: "First journey duration" }, { id: "departure", label: "Second journey departure" }],
          answerTable: { headers: ["Departure", "Arrival", "Journey length"], rows: [
            { cells: [{ text: "08:45" }, { text: "13:15" }, { type: "input", id: "duration" }] },
            { cells: [{ type: "input", id: "departure" }, { text: "06:05" }, { text: "8 h 25 min" }] },
          ] },
          grading: { mode: "auto", display: "4 hours 30 minutes; 21:40", parts: [{ id: "duration", accepted: ["4 hours 30 minutes", "4 h 30 min", "4hr30min", "270 minutes", "4.5 hours"], points: 1 }, { id: "departure", accepted: ["21:40", "2140", "21.40", "9:40 pm", "9.40 pm"], normalizer: "time", points: 1 }] },
        },
      ],
    },
    {
      id: "questions-15-21", label: "Questions 15-21", title: "Survey, area and probability", hint: "Select every required response before moving on.", groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8m-q15", number: 15, prompt: "Tick the questions relevant to finding whether boys spend more time playing sports than girls.", points: 1, type: "multiChoice",
          choices: [{ value: "gender", label: "Are you a boy or a girl?" }, { value: "age", label: "How old are you?" }, { value: "hours", label: "How many hours did you play sports this week?" }, { value: "football", label: "Do you like football?" }],
          grading: { mode: "auto", display: "Gender and weekly sports hours", parts: [{ id: "selected", accepted: ["gender", "hours"], normalizer: "set", points: 1 }] },
        },
        {
          id: "spip-y8m-q16", number: 16, prompt: "Work out the surface area of a cube with side length 5 cm.", points: 2, type: "text", inputMode: "number", placeholder: "cm²",
          visuals: [{ type: "image", src: `${assets}/q16-cube-net.png`, alt: "Cube and its net, each edge labelled 5 centimetres", maxWidth: 420 }],
          grading: { mode: "auto", display: "150 cm²", parts: [{ id: "answer", accepted: ["150", "150 cm2", "150 cm²"], points: 2 }] },
        },
        {
          id: "spip-y8m-q17", number: 17, prompt: "Rectangle ABCD has A = (1,1), B = (3,1) and C = (3,2). Find D.", points: 1, type: "multiText", compact: true,
          fields: [{ id: "x", label: "x-coordinate" }, { id: "y", label: "y-coordinate" }],
          inlineRows: [{ className: "spip-y8m-q17-coordinate-row", items: [{ text: "D = (" }, { type: "input", id: "x" }, { text: "," }, { type: "input", id: "y" }, { text: ")" }] }],
          grading: { mode: "auto", display: "(1, 2)", scoreThresholds: [{ minCorrect: 2, points: 1 }], parts: [{ id: "x", accepted: ["1"], points: 1 }, { id: "y", accepted: ["2"], points: 1 }] },
        },
        {
          id: "spip-y8m-q18", number: 18, prompt: "Aiko rounds her whole number to 2000 to the nearest 1000. Lily rounds hers to 1900 to the nearest 100. Aiko says her number must be larger. Is she correct? Explain.", points: 1, type: "multiText", compact: true,
          fields: [{ id: "decision", label: "Decision", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] }, { id: "reason", label: "Explanation", placeholder: "Give a counterexample or compare the possible ranges" }],
          grading: { mode: "auto", display: "No; for example Aiko could have 1568 while Lily has 1900.", scoreThresholds: [{ minCorrect: 2, points: 1 }], parts: [{ id: "decision", accepted: ["no"], points: 1 }, { id: "reason", accepted: [], normalizer: "keywords", keywords: [["1568", "1900"], ["1500", "1900"], ["aiko", "1500"], ["1850", "1950", "1500", "2500"]], points: 1, reviewRecommended: true }] },
        },
        {
          id: "spip-y8m-q19", number: 19, prompt: "M is a time in minutes. Complete the units for M ÷ (60 × 24) and M ÷ (60 × 24 × 7).", points: 1, type: "multiText", compact: true,
          fields: [{ id: "first", label: "M ÷ (60 × 24)", options: ["hours", "days", "weeks"].map((label) => ({ value: label, label })) }, { id: "second", label: "M ÷ (60 × 24 × 7)", options: ["hours", "days", "weeks"].map((label) => ({ value: label, label })) }],
          grading: { mode: "auto", display: "days; weeks", scoreThresholds: [{ minCorrect: 2, points: 1 }], parts: [{ id: "first", accepted: ["days", "day"], points: 1 }, { id: "second", accepted: ["weeks", "week"], points: 1 }] },
        },
        {
          id: "spip-y8m-q20", number: 20, prompt: "AOB = 40°, BOC is a right angle, and AOD is a straight line. Find angle COD.", points: 1, type: "text", inputMode: "number",
          visuals: [{ type: "image", src: `${assets}/q20-angles.png`, alt: "Angles AOB, BOC and COD on straight line AD", maxWidth: 420 }],
          grading: { mode: "auto", display: "50°", parts: [{ id: "answer", accepted: ["50", "50°", "50 degrees"], points: 1 }] },
        },
        {
          id: "spip-y8m-q21", number: 21, prompt: "The red die has faces 1,2,3,4,5,6. The green die has faces 2,3,5,6,8,8. Complete both sentences.", hidePrompt: true, points: 1, type: "multiText", compact: true,
          visualHtml: `<div class="spip-y8m-q21-intro"><p>Ahmed has two fair six-sided dice.<br>One die is red and the other is green.</p><p>The faces of the red die are numbered 1, 2, 3, 4, 5, 6.<br>The faces of the green die are numbered 2, 3, 5, 6, 8, 8.</p><p>Complete these sentences.</p></div>`,
          fields: [{ id: "even", label: "More likely to roll an even number", options: [{ value: "red", label: "Red" }, { value: "green", label: "Green" }] }, { id: "impossible", label: "Impossible to roll a 1", options: [{ value: "red", label: "Red" }, { value: "green", label: "Green" }] }],
          inlineRows: [
            { className: "spip-y8m-q21-sentence", items: [{ text: "Ahmed is more likely to roll an even number on the" }, { type: "select", id: "even" }, { text: "die." }] },
            { className: "spip-y8m-q21-sentence", items: [{ text: "It is impossible for Ahmed to roll a 1 on the" }, { type: "select", id: "impossible" }, { text: "die." }] },
          ],
          grading: { mode: "auto", display: "green; green", scoreThresholds: [{ minCorrect: 2, points: 1 }], parts: [{ id: "even", accepted: ["green"], points: 1 }, { id: "impossible", accepted: ["green"], points: 1 }] },
        },
      ],
    },
    {
      id: "questions-22-27", label: "Questions 22-27", title: "Algebra, percentages and construction", hint: "Give working for multi-mark calculations.", groupByQuestionNumber: true,
      questions: [
        {
          id: "spip-y8m-q22", number: 22, prompt: "Find an expression for the perimeter of the whole shape made from two identical rectangles of length q and width p.", points: 1, type: "text",
          visuals: [{ type: "image", src: `${assets}/q22-rectangles.png`, alt: "Two identical rectangles of length q and width p joined at right angles", maxWidth: 420 }],
          grading: { mode: "auto", display: "4q + 2p", parts: [{ id: "answer", accepted: ["4q+2p", "2p+4q", "2(p+2q)", "q+q+q+q+p+p"], normalizer: "linearExpression", points: 1 }] },
        },
        {
          id: "spip-y8m-q23", number: 23, prompt: "The scores are 3, 4, 5, 2.5 and 6. Work out the mean.", points: 2, type: "text",
          grading: { mode: "auto", display: "4.1", parts: [{ id: "answer", accepted: ["4.1", "4.10"], points: 2 }] },
        },
        {
          id: "spip-y8m-q24", number: 24, prompt: "50 women out of 70 and 110 men out of 150 own a bicycle. Show that the percentage for women is less than the percentage for men.", points: 2, type: "multiText", compact: true,
          visuals: [{ type: "image", src: `${assets}/q24-bicycle-claim.png`, alt: "A student states that the percentage of women who own a bicycle is less than the percentage of men", maxWidth: 520 }],
          fields: [{ id: "women", label: "Women" }, { id: "men", label: "Men" }],
          grading: { mode: "auto", display: "Women 71.42…%; men 73.33…%", parts: [{ id: "women", accepted: ["71", "71%", "71.4", "71.42", "71.43", "0.71", "0.714", "0.7142"], points: 1 }, { id: "men", accepted: ["73", "73%", "73.3", "73.33", "0.73", "0.733", "0.7333"], points: 1 }] },
        },
        {
          id: "spip-y8m-q25", number: 25, prompt: "A 30 cm by 20 cm rectangle is removed from a square of side 2 m. Find the remaining area in square metres.", points: 3, type: "multiText", compact: true,
          visuals: [{ type: "image", src: `${assets}/q25-remaining-area.png`, alt: "Square ABCD with a rectangle removed from corner C", maxWidth: 390 }],
          fields: [{ id: "conversion", label: "Converted dimensions or one area" }, { id: "method", label: "Area method" }, { id: "answer", label: "Remaining area", placeholder: "m²" }],
          grading: { mode: "auto", display: "3.94 m²", scoringStrategy: "highestCorrect", parts: [
            { id: "conversion", accepted: [], normalizer: "keywords", keywords: [["0.3", "0.2"], ["2", "4"], ["0.06"], ["40000"], ["600"]], points: 1, reviewRecommended: false },
            { id: "method", accepted: [], normalizer: "keywords", keywords: [["2", "2", "0.3", "0.2"], ["40000", "600"], ["39400"]], points: 2, reviewRecommended: false },
            { id: "answer", accepted: ["3.94", "3.94 m2", "3.94 m²"], points: 3 },
          ] },
        },
        {
          id: "spip-y8m-q26", number: 26, prompt: "Use the two given 6 cm sides and 108° angle to complete the regular pentagon.", points: 2, type: "geometryConstruction", maxSegments: 3,
          backgroundSrc: `${assets}/q26-pentagon.png`, backgroundAlt: "Two sides of a regular pentagon, each 6 centimetres, meeting at 108 degrees",
          snapPoints: [{ x: 0.176, y: 0.07 }, { x: 0.679, y: 0.07 }, { x: 0.835, y: 0.622 }],
          geometry: { variant: "regularPentagon", givenVertices: [{ x: 0.176, y: 0.07 }, { x: 0.679, y: 0.07 }, { x: 0.835, y: 0.622 }], aspectRatio: 0.867, sideTolerance: 0.008, angleToleranceDegrees: 1, closeTolerance: 0.025 },
          grading: { mode: "auto", display: "Regular pentagon with 6 cm sides and 108° internal angles", parts: [] },
        },
        {
          id: "spip-y8m-q27", number: 27, prompt: "Find the difference between 7/10 and 5/8. Write the answer as a decimal.", points: 1, type: "text", hidePrompt: true,
          visualHtml: `<div class="spip-y8m-q27-prompt">Find the difference between <span class="frac" aria-label="seven tenths"><span>7</span><span>10</span></span> and <span class="frac" aria-label="five eighths"><span>5</span><span>8</span></span>.<br>Write your answer as a decimal.</div>`,
          grading: { mode: "auto", display: "0.075", parts: [{ id: "answer", accepted: ["0.075", ".075", "-0.075", "-.075"], points: 1 }] },
        },
      ],
    },
  ],
};
