(function () {
  "use strict";

  const A = "assets/";
  const ans = (id, label, accepted, points = 1, placeholder = "answer") => ({
    id,
    label,
    accepted: Array.isArray(accepted) ? accepted : [accepted],
    points,
    placeholder,
  });
  const review = (id, label, points = 1, placeholder = "Teacher will review this answer.") => ({
    id,
    label,
    accepted: [],
    points,
    placeholder,
    review: true,
  });
  const q = (id, number, prompt, points, responseType, options = {}) => ({
    id,
    number,
    prompt,
    points,
    responseType,
    ...options,
  });
  const img = (src, alt, maxWidth = 520) => ({ src: A + src, alt, maxWidth });

  window.SpipYear7MathPretestData = {
    testId: "spip-year-7-math-pre",
    title: "SPIP Year 7 Math Pre-test",
    subject: "Math",
    level: "SPIP Year 7",
    status: "inactive",
    totalPoints: 40,
    answerKeyStatus: "official-paper-1-key-with-review-items",
    parts: [
      {
        id: "paper1a",
        label: "Questions 1-6",
        title: "Numbers and decimals",
        hint: "Write each answer in the requested box.",
        questions: [
          q("spip-y7m-q1", 1, "Join pairs of decimals to make 1.", 2, "pairConnect", {
            visual: img("spip-y7m-q1-number-pairs.png", "Decimals arranged around lines to be paired", 420),
            nodes: [
              { value: "0.25", x: 50, y: 9 },
              { value: "0.38", x: 72, y: 21 },
              { value: "0.44", x: 82, y: 43 },
              { value: "0.75", x: 72, y: 68 },
              { value: "0.19", x: 50, y: 80 },
              { value: "0.56", x: 30, y: 68 },
              { value: "0.81", x: 18, y: 43 },
              { value: "0.62", x: 30, y: 21 },
            ],
            pairs: [
              ans("p1", "Pair 1", ["0.62 + 0.38", "0.38 + 0.62", "0.62,0.38", "0.38,0.62"], 0.5, "0.62 + 0.38"),
              ans("p2", "Pair 2", ["0.25 + 0.75", "0.75 + 0.25", "0.25,0.75", "0.75,0.25"], 0.5, "0.25 + 0.75"),
              ans("p3", "Pair 3", ["0.19 + 0.81", "0.81 + 0.19", "0.19,0.81", "0.81,0.19"], 0.5, "0.19 + 0.81"),
              ans("p4", "Pair 4", ["0.56 + 0.44", "0.44 + 0.56", "0.56,0.44", "0.44,0.56"], 0.5, "0.56 + 0.44"),
            ],
            displayAnswer: "0.62+0.38; 0.25+0.75; 0.19+0.81; 0.56+0.44",
          }),
          q("spip-y7m-q2", 2, "Translate triangle A by 4 squares up and 2 squares left.", 1, "dragTranslation", {
            reviewRequired: true,
            parts: [review("notes", "Answer / notes", 1, "Describe or place the translated triangle.")],
            displayAnswer: "Translated triangle, teacher reviewed",
          }),
          q("spip-y7m-q3", 3, "Draw a ring around the largest number in each pair.", 2, "largestPairs", {
            rows: [
              ans("r1", "9810 or 9018", ["9810"], 0.4),
              ans("r2", "Half a million or 84 291", ["half a million", "500000", "500,000"], 0.4),
              ans("r3", "Fifteen thousand and seven or 15 060", ["15060", "15 060", "15,060"], 0.4),
              ans("r4", "25 or -52", ["25"], 0.4),
              ans("r5", "-271 or -326", ["-271"], 0.4),
            ],
            displayAnswer: "9810; half a million; 15 060; 25; -271",
          }),
          q("spip-y7m-q4", 4, "Write in figures: three hundredths.", 1, "inline", {
            layout: "plain",
            parts: [ans("answer", "Answer", ["0.03", ".03", "3/100"], 1)],
            displayAnswer: "0.03",
          }),
          q("spip-y7m-q5", 5, "Calculate 6.8 + 17.38.", 1, "inline", {
            layout: "equation",
            equation: "6.8 + 17.38 = {answer}",
            parts: [ans("answer", "Answer", ["24.18"], 1)],
            displayAnswer: "24.18",
          }),
          q("spip-y7m-q6", 6, "Write 1085 thousandths as a decimal.", 1, "inline", {
            layout: "equation",
            equation: "1085 thousandths = {answer}",
            parts: [ans("answer", "Answer", ["1.085"], 1)],
            displayAnswer: "1.085",
          }),
        ],
      },
      {
        id: "paper1b",
        label: "Questions 7-14",
        title: "Measures, patterns, and fractions",
        hint: "Some diagrams are for layout review before this inactive test is activated.",
        questions: [
          q("spip-y7m-q7", 7, "The digital scale shows 16 500 g. Show this mass on the kg scale.", 1, "scaleReview", {
            reviewRequired: true,
            visual: [
              img("spip-y7m-q7-digital-scale.png", "Digital scale reading 16 500 g", 300),
              img("spip-y7m-q7-kg-scale.png", "Blank semicircular kilogram scale from 0 to 20", 520),
            ],
            parts: [review("answer", "Scale mark / notes", 1, "Mark 16.5 kg or describe the arrow position.")],
            displayAnswer: "16.5 kg",
          }),
          q("spip-y7m-q8", 8, "The table shows the times for a race. Who was the third fastest runner and what was their time?", 2, "tableRunner", {
            rows: [
              ["Angelique", "15.23"],
              ["Gabriella", "14.05"],
              ["Aiko", "15.3"],
              ["Manjit", "14.5"],
              ["Blessy", "14.65"],
            ],
            parts: [ans("name", "Runner", ["manjit"], 1), ans("time", "Time", ["14.5", "14.50"], 1)],
            displayAnswer: "Manjit, 14.5 seconds",
          }),
          q("spip-y7m-q9", 9, "Tick the two patterns that can be made with the stamp.", 2, "stampChoices", {
            reviewRequired: true,
            visual: [
              img("spip-y7m-q9-stamp.png", "A stamp and the shape it makes", 520),
              img("spip-y7m-q9-patterns.png", "Four pattern options made from the stamp", 760),
            ],
            choices: ["A", "B", "C", "D"],
            parts: [review("selected", "Selected patterns", 2, "Choose the two options, e.g. A and C.")],
            displayAnswer: "Two correct patterns, teacher verified",
          }),
          q("spip-y7m-q10", 10, "In the number 485 136, what is the value of the 4?", 1, "inline", {
            layout: "equation",
            equation: "Value of 4 = {answer}",
            parts: [ans("answer", "Answer", ["400000", "400,000", "four hundred thousand"], 1)],
            displayAnswer: "400 000",
          }),
          q("spip-y7m-q11", 11, "A train leaves at 08:00 and the journey takes 7 hours. Write the start and finish times.", 2, "inline", {
            layout: "twobox",
            parts: [
              ans("start", "Start time", ["8 am", "8am", "08:00", "8:00"], 1),
              ans("finish", "Finish time", ["3 pm", "3pm", "15:00", "3:00 pm"], 1),
            ],
            displayAnswer: "8 am; 3 pm",
          }),
          q("spip-y7m-q12", 12, "Fill in the missing numbers.", 1, "inline", {
            layout: "equations",
            equations: ["{a} / 3 = 90", "11 / 2 = {b}"],
            parts: [ans("a", "First box", ["270"], 0.5), ans("b", "Second box", ["5.5", "5 1/2", "11/2"], 0.5)],
            displayAnswer: "270; 5.5",
          }),
          q("spip-y7m-q13", 13, "Write the missing digits in the boxes.", 2, "fractionBoxes", {
            parts: [ans("a", "1 7/10 box", ["1"], 0.5), ans("b", "2 1/4 numerator", ["9"], 0.5), ans("c", "17/5 whole-number box", ["3"], 0.5), ans("d", "3 1/2 numerator", ["7"], 0.5)],
            displayAnswer: "1; 9; 3; 7",
          }),
          q("spip-y7m-q14", 14, "Draw a line to match each statement to its likelihood.", 2, "likelihood", {
            reviewRequired: true,
            statements: ["The number is a multiple of 4", "The number has 4 digits", "The number is odd"],
            parts: [review("matches", "Matches", 2, "Multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance.")],
            displayAnswer: "multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance",
          }),
        ],
      },
      {
        id: "paper1c",
        label: "Questions 15-21",
        title: "Calculations, data, time, and angles",
        hint: "Use digits or units where useful.",
        questions: [
          q("spip-y7m-q15", 15, "Write the missing numbers.", 2, "inline", {
            layout: "equations",
            equations: ["150 x 10 = {a}", "200 x {b} = 20 000"],
            parts: [ans("a", "First box", ["1500", "1,500"], 1), ans("b", "Second box", ["100"], 1)],
            displayAnswer: "1500; 100",
          }),
          q("spip-y7m-q16", 16, "What is 25% of 56?", 1, "inline", {
            layout: "equation",
            equation: "25% of 56 = {answer}",
            parts: [ans("answer", "Answer", ["14"], 1)],
            displayAnswer: "14",
          }),
          q("spip-y7m-q17", 17, "The sports club table shows pupils attending activities. Which pupils attended all three activities?", 2, "checkboxes", {
            choices: ["Ahmed", "Carlos", "Hassan", "Mike", "Rajiv", "Youssef"],
            parts: [ans("selected", "Selected pupils", ["hassan,rajiv,youssef", "hassan,youssef,rajiv", "rajiv,hassan,youssef", "rajiv,youssef,hassan", "youssef,hassan,rajiv", "youssef,rajiv,hassan"], 2, "Select all that apply")],
            table: {
              columns: ["Mon", "Tues", "Wed", "Thurs"],
              rows: [
                ["Running", "Mike, Carlos", "Rajiv", "Hassan", "Youssef, Mike"],
                ["Tennis", "", "Ahmed", "Carlos, Mike", "Hassan"],
                ["Swimming", "Hassan", "Youssef", "Rajiv", "Ahmed"],
              ],
            },
            displayAnswer: "Rajiv, Hassan, Youssef",
          }),
          q("spip-y7m-q18", 18, "Write the time shown on the clock, then write the time 2 hours 15 minutes later.", 2, "imageParts", {
            visual: img("spip-y7m-q18-clock.png", "Clock showing 10:47", 360),
            parts: [ans("a", "Clock time", ["10:47", "10.47"], 1), ans("b", "2 h 15 min later", ["13:02", "1:02 pm", "1.02 pm"], 1)],
            displayAnswer: "10:47; 13:02",
          }),
          q("spip-y7m-q19", 19, "Write the missing numbers in the multiplication grid.", 2, "multiplicationGrid", {
            parts: [ans("a", "4 x 0.3", ["1.2"], 0.5), ans("b", "Missing column heading", ["0.4"], 0.5), ans("c", "4 x 0.6", ["2.4"], 0.5), ans("d", "7 x 0.4", ["2.8"], 0.5)],
            displayAnswer: "1.2; 0.4; 2.4; 2.8",
          }),
          q("spip-y7m-q20", 20, "Write the missing numbers in the sequence.", 2, "sequenceBoxes", {
            values: ["{a}", "180", "105", "30", "{b}"],
            parts: [ans("a", "First number", ["255"], 1), ans("b", "Last number", ["-45"], 1)],
            displayAnswer: "255; -45",
          }),
          q("spip-y7m-q21", 21, "Find the missing angles.", 2, "imageParts", {
            visual: [
              img("spip-y7m-q21a-right-triangle.png", "Right angled triangle", 420),
              img("spip-y7m-q21b-angle-y.png", "Angle y diagram", 520),
            ],
            parts: [ans("a", "Smallest angle inside the triangle", ["33", "32", "34"], 1), ans("b", "Angle y", ["158", "158 degrees"], 1)],
            displayAnswer: "33; 158",
          }),
        ],
      },
      {
        id: "paper1d",
        label: "Questions 22-30",
        title: "Missing digits, reasoning, and shape",
        hint: "Questions marked review collect an answer for teacher checking.",
        questions: [
          q("spip-y7m-q22", 22, "Write in the missing digits to make the calculation correct.", 1, "columnAddition", {
            parts: [ans("top", "Top missing digit", ["5"], 0.34), ans("bottomLeft", "Bottom left digit", ["2"], 0.33), ans("bottomRight", "Bottom right digit", ["5"], 0.33)],
            displayAnswer: "3.58 + 2.05 = 5.63",
          }),
          q("spip-y7m-q23", 23, "Write the missing number in each box.", 2, "operationBoxes", {
            parts: [ans("a", "745.03 x 10", ["7450.3", "7,450.3"], 1), ans("b", "60319 / 100", ["603.19"], 1)],
            displayAnswer: "7450.3; 603.19",
          }),
          q("spip-y7m-q24", 24, "Use 26 x 15 = 390 to show how to work out 26 x 14.", 2, "textArea", {
            reviewRequired: true,
            parts: [review("answer", "Answer / working", 2, "Explain that 26 x 14 = 390 - 26 = 364.")],
            displayAnswer: "390 - 26 = 364",
          }),
          q("spip-y7m-q25", 25, "Put these values in order from smallest to largest: 0.65, 2/3, 0.57, 3/5.", 1, "orderBoxes", {
            values: ["0.65", "2/3", "0.57", "3/5"],
            parts: [ans("a", "Smallest", ["0.57"], 0.25), ans("b", "Second", ["3/5", "0.6"], 0.25), ans("c", "Third", ["0.65"], 0.25), ans("d", "Largest", ["2/3", "0.666", "0.667"], 0.25)],
            displayAnswer: "0.57, 3/5, 0.65, 2/3",
          }),
          q("spip-y7m-q26", 26, "Write three numbers with a mode of 6 and a mean of 7.", 2, "threeBoxes", {
            parts: [ans("a", "First number", ["6"], 0.67), ans("b", "Second number", ["6"], 0.67), ans("c", "Third number", ["9"], 0.66)],
            customScore: "modeMean",
            displayAnswer: "6, 6, 9",
          }),
          q("spip-y7m-q27", 27, "Yuri says that 6/8 is larger than 3/4. Is Yuri correct? Use a calculation to explain.", 2, "textArea", {
            reviewRequired: true,
            parts: [review("answer", "Answer / calculation", 2, "No. 6/8 = 3/4.")],
            displayAnswer: "No, because 6/8 = 3/4",
          }),
          q("spip-y7m-q28", 28, "Finn counts in steps of 0.3 starting at 1. What is the 10th number he says?", 1, "imageParts", {
            visual: img("spip-y7m-q28-counting-steps.png", "Finn saying 1, 1.3, 1.6 and so on", 420),
            parts: [ans("answer", "Answer", ["3.7"], 1)],
            displayAnswer: "3.7",
          }),
          q("spip-y7m-q29", 29, "Write 8/5 as a mixed number.", 1, "inline", {
            layout: "equation",
            equation: "8/5 = {answer}",
            parts: [ans("answer", "Answer", ["1 3/5", "1.6", "8/5"], 1)],
            displayAnswer: "1 3/5",
          }),
          q("spip-y7m-q30", 30, "Reflect the shaded shape in the mirror line.", 2, "reflectionGrid", {
            reviewRequired: true,
            parts: [review("cells", "Placed reflection cells", 2, "Click cells to build the reflected shape.")],
            displayAnswer: "Correct reflected shape, teacher reviewed",
          }),
        ],
      },
    ],
  };
})();
