(function () {
  "use strict";

  const A = "assets/";
  const ans = (id, label, accepted, points = 1, placeholder = "answer", extra = {}) => ({
    id,
    label,
    accepted: Array.isArray(accepted) ? accepted : [accepted],
    points,
    placeholder,
    ...extra,
  });
  const keyword = (id, label, keywords, points = 1, placeholder = "Explain your answer.") => ({
    id,
    label,
    keywords,
    accepted: [],
    points,
    placeholder,
    normalizer: "keywords",
    reviewRecommended: true,
  });
  const q = (id, number, subQuestion, prompt, points, responseType, answerFormat, interactionType, marking, options = {}) => ({
    id,
    number,
    subQuestion,
    prompt,
    points,
    responseType,
    answerFormat,
    interactionType,
    marking,
    implementationShape: options.implementationShape || responseType,
    ...options,
  });
  const img = (src, alt, maxWidth = 720, wide = false) => ({ src: A + src, alt, maxWidth, wide });

  window.SpipYear7SciencePretestData = {
    testId: "spip-year-7-science-pre",
    title: "SPIP Year 7 Science Pre-test",
    subject: "Science",
    level: "SPIP Year 7",
    status: "active",
    durationMinutes: 45,
    totalPoints: 50,
    answerKeyStatus: "paper-derived-with-keyword-review",
    parts: [
      {
        id: "part1",
        label: "Questions 1-4",
        title: "Electricity, organs, and solubility",
        hint: "Answer each part of the question.",
        questions: [
          q("spip-y7s-q1", 1, "", "Some materials are electrical conductors and others are electrical insulators. Complete the table about these materials.", 3, "tickTable", "tick_table", "radio tick grid", "auto_marked", {
            displayAnswer: "copper: conductor; graphite: conductor; plastic, rubber, wood: insulator",
            columns: [
              { id: "conductor", label: "electrical conductor" },
              { id: "insulator", label: "electrical insulator" },
            ],
            tickRows: [
              ans("copper", "copper", ["conductor"], 0.6),
              ans("graphite", "graphite", ["conductor"], 0.6),
              ans("plastic", "plastic", ["insulator"], 0.6),
              ans("rubber", "rubber", ["insulator"], 0.6),
              ans("wood", "wood", ["insulator"], 0.6),
            ],
            scoreThresholds: [
              { minCorrect: 5, points: 3 },
              { minCorrect: 3, points: 2 },
              { minCorrect: 1, points: 1 },
            ],
            implementationShape: "tickRows[{material, acceptedColumn, points}]",
          }),
          q("spip-y7s-q2", 2, "", "Label the organs on the diagram of a human body.", 3, "labelDiagram", "label_diagram", "text labels on image", "auto_marked", {
            visual: img("spip-y7s-q2-organs-v2.png", "Human body organs to label", 480, true),
            displayAnswer: "brain; heart; lung; stomach; kidney; small intestine",
            labelAnchors: [
              ans("brain", "Top left label", ["brain"], 0.5, "organ name", { x: 16, y: 20 }),
              ans("heart", "Middle left label", ["heart"], 0.5, "organ name", { x: 15, y: 42 }),
              ans("kidney", "Lower left label", ["kidney", "kidneys"], 0.5, "organ name", { x: 15, y: 82 }),
              ans("lungs", "Upper right label", ["lung", "lungs"], 0.5, "organ name", { x: 87, y: 41 }),
              ans("stomach", "Middle right label", ["stomach"], 0.5, "organ name", { x: 87, y: 70 }),
              ans("intestines", "Lower right label", ["intestine", "intestines", "small intestine"], 0.5, "organ name", { x: 87, y: 94 }),
            ],
            scoreThresholds: [
              { minCorrect: 6, points: 3 },
              { minCorrect: 4, points: 2 },
              { minCorrect: 2, points: 1 },
            ],
            implementationShape: "labelAnchors[{id,label,accepted,x,y}]",
          }),
          q("spip-y7s-q3", 3, "", "Mike is exploring electrical circuits. The lamps are very dim. What can he do to make the lamps brighter?", 1, "choice", "multiple_choice_single", "radio choice", "auto_marked", {
            visual: img("spip-y7s-q3-circuit.png", "Circuit with two dim lamps", 364),
            displayAnswer: "add another cell",
            choices: [
              { value: "add another cell", label: "add another cell" },
              { value: "add another lamp", label: "add another lamp" },
              { value: "add a switch", label: "add a switch" },
              { value: "make the wire longer", label: "make the wire longer" },
            ],
            parts: [ans("answer", "Answer", ["add another cell"], 1)],
            implementationShape: "choices[{value,label,correct}]",
          }),
          q("spip-y7s-q4a", 4, "a", "Blessy keeps the temperature of the water for each solid the same. Explain why.", 1, "shortText", "short_text", "one-line explanation", "semi_auto_marked", {
            groupIntro: {
              title: "Blessy has four different solids.",
              paragraphs: [
                "She investigates how many grams of each solid she can dissolve in water.",
                "Here is what she does",
              ],
              bullets: [
                "pours 20 cm3 of water into a beaker",
                "adds 1 g of solid to the water and stirs",
                "if the solid dissolves she adds another 1 g of solid and stirs",
                "she keeps adding 1 g of solid at a time until no more dissolves.",
              ],
              resultsIntro: "Here are her results.",
              table: {
                columns: ["name of solid", "total mass of solid added in g"],
                rows: [
                  ["sugar", "16"],
                  ["fertiliser", "30"],
                  ["salt", "8"],
                  ["baking powder", "5"],
                ],
              },
            },
            displayAnswer: "So it is a fair test because temperature affects how much solid dissolves.",
            parts: [keyword("answer", "Explanation", [["fair", "test"], ["temperature", "affect", "dissolv"], ["same", "compare"], ["hotter", "dissolv"], ["colder", "dissolv"], ["different", "amount"]], 1)],
            implementationShape: "parts[{id,keywords,points,reviewRecommended}]",
          }),
          q("spip-y7s-q4b", 4, "b", "Blessy thinks it is a good idea to repeat her investigation. Explain why.", 1, "shortText", "short_text", "one-line explanation", "semi_auto_marked", {
            displayAnswer: "Repeating makes the results more reliable and helps check for mistakes.",
            parts: [keyword("answer", "Explanation", [["reliable"], ["accurate"], ["check", "mistake"], ["average"]], 1)],
            implementationShape: "parts[{id,keywords,points,reviewRecommended}]",
          }),
          q("spip-y7s-q4c", 4, "c", "Blessy has started to draw a bar chart of the results. Complete the bar chart. Include the scale on the y-axis, label on the y-axis, and the other three bars and their labels.", 3, "completeGraph", "complete_graph", "graph/table entry", "semi_auto_marked", {
            visual: img("spip-y7s-q4c-bar-chart.png", "Incomplete bar chart for dissolved solids", 620, true),
            displayAnswer: "y-axis: total mass of solid added in g; fertiliser 30 g; salt 8 g; baking powder 5 g",
            graph: {
              callouts: [
                { number: "1", x: 12, y: 43 },
                { number: "2", x: 12, y: 53 },
                { number: "3", x: 12, y: 62 },
                { number: "4", x: 47, y: 89 },
                { number: "5", x: 64, y: 89 },
                { number: "6", x: 82, y: 89 },
              ],
              yAxis: ans("y_axis", "Y-axis label / scale", ["total mass of solid added in g", "mass of solid added in g", "total mass in g", "mass in g"], 1, "axis label", { normalizer: "keywords", keywords: [["mass"], ["g"]], calloutNumber: "1-3" }),
              bars: [
                ans("fertiliser", "fertiliser", ["30", "30 g"], 0.67, "30", { calloutNumber: "4" }),
                ans("salt", "salt", ["8", "8 g"], 0.66, "8", { calloutNumber: "5" }),
                ans("baking_powder", "baking powder", ["5", "5 g"], 0.67, "5", { calloutNumber: "6" }),
              ],
              answerRows: [
                { number: "1", label: "top y-axis scale number", fields: [ans("scale_top", "Scale number", ["30", "30 g"], 0.25, "number")] },
                { number: "2", label: "middle y-axis scale number", fields: [ans("scale_middle", "Scale number", ["20", "20 g"], 0.25, "number")] },
                { number: "3", label: "bottom y-axis scale number", fields: [ans("scale_bottom", "Scale number", ["10", "10 g"], 0.25, "number")] },
                { number: "4", label: "missing solid and bar", fields: [ans("solid_4", "Name of solid", ["fertiliser", "fertilizer"], 0.25, "name of solid"), ans("fertiliser", "Bar height in g", ["30", "30 g"], 0.5, "bar height")] },
                { number: "5", label: "missing solid and bar", fields: [ans("solid_5", "Name of solid", ["salt"], 0.25, "name of solid"), ans("salt", "Bar height in g", ["8", "8 g"], 0.5, "bar height")] },
                { number: "6", label: "missing solid and bar", fields: [ans("solid_6", "Name of solid", ["baking powder"], 0.25, "name of solid"), ans("baking_powder", "Bar height in g", ["5", "5 g"], 0.5, "bar height")] },
              ],
            },
            implementationShape: "graph{yAxis,bars[],requiredLabels}",
          }),
          q("spip-y7s-q4d", 4, "d", "Which solid is the most soluble in water?", 1, "shortText", "short_text", "one-line answer", "auto_marked", {
            displayAnswer: "fertiliser",
            parts: [ans("answer", "Solid", ["fertiliser", "fertilizer"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
        ],
      },
      {
        id: "part2",
        label: "Questions 5-8",
        title: "Food chains, separation, forces, and changes",
        hint: "Use the diagrams where shown.",
        questions: [
          q("spip-y7s-q5a", 5, "a", "Use the information to draw a food chain. Draw arrows between the boxes to show the direction of energy flow.", 2, "orderingSequence", "ordering_sequence", "order boxes with arrows", "auto_marked", {
            groupIntro: {
              title: "This question is about a food chain.",
            },
            visual: img("spip-y7s-q5-food-chain.png", "Living things in a food chain", 768, true),
            displayAnswer: "leaf -> caterpillar -> bird -> snake -> owl",
            orderItems: ["leaf", "caterpillar", "bird", "snake", "owl"],
            parts: [
              ans("pos1", "1", ["leaf"], 0.4),
              ans("pos2", "2", ["caterpillar"], 0.4),
              ans("pos3", "3", ["bird"], 0.4),
              ans("pos4", "4", ["snake"], 0.4),
              ans("pos5", "5", ["owl"], 0.4),
            ],
            implementationShape: "orderItems[], acceptedOrder[]",
          }),
          q("spip-y7s-q5b", 5, "b", "Which living thing is the producer in this food chain?", 1, "shortText", "short_text", "one-line answer", "auto_marked", {
            visual: img("spip-y7s-q5-food-chain.png", "Living things in a food chain", 768, true),
            displayAnswer: "leaf",
            parts: [ans("answer", "Producer", ["leaf", "plant", "the leaf", "tree"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q6a", 6, "a", "What dissolves in stage B?", 1, "choice", "multiple_choice_single", "radio choice", "auto_marked", {
            groupIntro: {
              title: "Yuri wants to separate a mixture of salt, sand and water.",
            },
            visual: img("spip-y7s-q6-separation.png", "Stages for separating salt, sand and water", 686, true),
            displayAnswer: "salt",
            choices: [
              { value: "salt", label: "salt" },
              { value: "sand", label: "sand" },
              { value: "salt and sand", label: "salt and sand" },
              { value: "water", label: "water" },
            ],
            parts: [ans("answer", "Answer", ["salt"], 1)],
            implementationShape: "choices[]",
          }),
          q("spip-y7s-q6b", 6, "b", "What is substance X?", 1, "shortText", "short_text", "one-line answer", "auto_marked", {
            visual: img("spip-y7s-q6-separation.png", "Stages for separating salt, sand and water", 686, true),
            displayAnswer: "salt",
            parts: [ans("answer", "Substance X", ["salt", "wet salt"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q7a", 7, "a", "Complete Lily's sentences. Choose from: centimetres, kilograms, newtons, seconds.", 3, "wordBank", "fill_blank", "word-bank blanks", "auto_marked", {
            groupIntro: {
              title: "Lily is learning about mass and weight.",
            },
            displayAnswer: "Mass: kilograms; Weight: newtons; Force: newtons",
            wordBank: ["centimetres", "kilograms", "newtons", "seconds"],
            parts: [
              ans("mass", "Mass is measured in", ["kilograms", "kg"], 1),
              ans("weight", "Weight is measured in", ["newtons", "newton"], 1),
              ans("force", "Force is measured in", ["newtons", "newton"], 1),
            ],
            implementationShape: "wordBank[], blanks[]",
          }),
          q("spip-y7s-q7b", 7, "b", "Choose the arrow that shows the direction of the force of gravity on Lily.", 1, "choice", "multiple_choice_single", "radio choice", "auto_marked", {
            visual: img("spip-y7s-q7b-gravity.png", "Lily standing for gravity arrow", 420),
            displayAnswer: "down",
            choiceLayout: "one-row",
            choices: [
              { value: "up", label: "up" },
              { value: "down", label: "down" },
              { value: "left", label: "left" },
              { value: "right", label: "right" },
            ],
            parts: [ans("answer", "Arrow direction", ["down"], 1)],
            implementationShape: "choices[]",
          }),
          q("spip-y7s-q8a", 8, "a", "Only one solid can be separated from water by filtration. Which one?", 1, "shortText", "short_text", "one-letter answer", "auto_marked", {
            groupIntro: {
              title: "Ahmed adds water to different solids.",
              resultsIntro: "Here are his results.",
              table: {
                columns: ["solid", "colour of solid", "effect of adding water"],
                rows: [
                  ["A", "white", "forms a colourless solution"],
                  ["B", "green", "forms a green solution"],
                  ["C", "white", "forms a white cloudy mixture"],
                  ["D", "grey", "fizzes and forms a colourless solution"],
                  ["E", "white", "forms a colourless solution and gets colder"],
                  ["F", "blue", "forms a blue solution"],
                ],
              },
            },
            displayAnswer: "C",
            parts: [ans("answer", "Solid", ["C"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q8b", 8, "b", "There is a reversible change when solid A is added to water. Describe how you could reverse this change.", 1, "shortText", "short_text", "one-line explanation", "semi_auto_marked", {
            displayAnswer: "Heat it, evaporate the water, or leave it in the Sun to get the solid back.",
            parts: [keyword("answer", "Description", [["evaporat"], ["heat"], ["sun"], ["water", "solid"], ["crystal"]], 1)],
            implementationShape: "parts[{id,keywords,points,reviewRecommended}]",
          }),
          q("spip-y7s-q8c", 8, "c", "Two of the solids have an irreversible change when added to water. Write the letter of one of these solids. Explain how you can tell from the results.", 2, "mixed", "mixed", "letter answer plus explanation", "semi_auto_marked", {
            displayAnswer: "D because it fizzes/forms gas, or E because the temperature changes/gets colder.",
            parts: [
              ans("letter", "Letter", ["D", "E"], 1),
              keyword("explanation", "Explanation", [["fizz"], ["gas"], ["bubble"], ["colder"], ["temperature", "change"]], 1),
            ],
            implementationShape: "parts[{letter accepted}, {keywords}]",
          }),
        ],
      },
      {
        id: "part3",
        label: "Questions 9-12",
        title: "Body systems, energy, recycling, and dissolving",
        hint: "Some explanation answers are keyword-scored and flagged for review.",
        questions: [
          q("spip-y7s-q9a", 9, "a", "Mike must use the heart machine to stay alive. Explain what the heart machine does.", 2, "longText", "long_text", "multi-line explanation", "semi_auto_marked", {
            groupIntro: {
              title: "Mike has a heart that does not work. He uses a heart machine.",
            },
            visual: img("spip-y7s-q9-heart-machine.png", "Mike with a heart machine and an extra heart machine", 532, true),
            displayAnswer: "It does the work of the heart: it pumps blood around the body, supplying oxygen and food/nutrients to organs.",
            parts: [
              keyword("answer", "Explanation", [["does", "heart"], ["place", "heart"], ["instead", "heart"], ["takes", "heart"], ["heart", "normally"]], 1, "Write your explanation."),
              keyword("answer", "Explanation", [["pump", "blood"], ["circulat", "blood"]], 1, "Write your explanation."),
              keyword("answer", "Explanation", [["oxygen"]], 1, "Write your explanation."),
              keyword("answer", "Explanation", [["food"], ["nutrient"]], 1, "Write your explanation."),
              keyword("answer", "Explanation", [["organ"], ["around", "body"], ["body"]], 1, "Write your explanation."),
            ],
            implementationShape: "rubricParts[{keywords,points}]",
          }),
          q("spip-y7s-q9b", 9, "b", "Mike takes the extra heart machine with him when he goes outside. Explain why Mike needs an extra heart machine.", 1, "shortText", "short_text", "one-line explanation", "semi_auto_marked", {
            visual: img("spip-y7s-q9-heart-machine.png", "Mike with a heart machine and an extra heart machine", 532, true),
            displayAnswer: "In case the first heart machine or its batteries stop working or break.",
            parts: [keyword("answer", "Explanation", [["break"], ["stop", "work"], ["fail"], ["backup"], ["spare"], ["battery"]], 1)],
            implementationShape: "parts[{id,keywords,points}]",
          }),
          q("spip-y7s-q10", 10, "", "Draw a line from the statement to the correct explanation.", 1, "matching", "matching", "statement to explanation", "auto_marked", {
            visual: img("spip-y7s-q10-rollercoaster.png", "Rollercoaster with dip and hill", 630, true),
            displayAnswer: "A rollercoaster is able to climb up the hill because its movement gives it the energy to get to the top of the hill.",
            sources: [{ id: "climb", label: "A rollercoaster is able to climb up the hill because ..." }],
            targets: [
              { value: "no friction", label: "there is no friction." },
              { value: "movement energy", label: "its movement gives it the energy to get to the top of the hill." },
              { value: "friction increases", label: "friction in the dip increases its movement." },
              { value: "no air resistance", label: "there is no air resistance in the dip." },
            ],
            parts: [ans("climb", "Explanation", ["movement energy"], 1)],
            implementationShape: "matchPairs[{source,target}]",
          }),
          q("spip-y7s-q11a", 11, "a", "Glass, plastic and metal can be recycled. Write down the name of another material that can be recycled.", 1, "shortText", "short_text", "one-line material name", "auto_marked", {
            visual: img("spip-y7s-q11-recycling.png", "Recycling bins for glass, plastic and metal", 602, true),
            displayAnswer: "paper, card/cardboard, cloth, books, magazines, batteries, or ink cartridges",
            parts: [ans("answer", "Material", ["paper", "cardboard", "card", "cloth", "book", "books", "magazine", "magazines", "clothes", "battery", "batteries", "ink cartridge", "ink cartridges"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q11b", 11, "b", "Complete the sentences about why the diaper cannot be recycled and how to reduce waste in the environment.", 2, "mixed", "fill_blank", "sentence blanks and explanation", "semi_auto_marked", {
            visual: img("spip-y7s-q11b-diaper.png", "Baby wearing a diaper", 602, true),
            displayAnswer: "It is dirty, toxic, or contains microbes; use a washable/reusable diaper, or compost a biodegradable one.",
            parts: [
              keyword("cannot_recycle", "This diaper cannot be recycled because", [["dirty"], ["waste"], ["soiled"], ["toxic"], ["microbe"], ["mixed", "material"], ["cannot", "recycle"], ["used"]], 1),
              keyword("reduce_waste", "To reduce waste this diaper can be", [["reuse"], ["wash"], ["cloth"], ["reusable"], ["compost"], ["biodegrad"]], 1),
            ],
            implementationShape: "parts[{blank accepted/keywords}]",
          }),
          q("spip-y7s-q12a", 12, "a", "Complete the sentences about sugar water. Choose from: insoluble, soluble, solution, sugar, water.", 2, "wordBank", "fill_blank", "word-bank blanks", "auto_marked", {
            groupIntro: {
              title: "Sugar is added to water. The sugar dissolves in water.",
            },
            visual: img("spip-y7s-q12-sugar-water.png", "Sugar added to water makes sugar water", 630, true),
            displayAnswer: "solvent: water; solute: sugar; sugar is soluble",
            wordBank: ["insoluble", "soluble", "solution", "sugar", "water"],
            parts: [
              ans("solvent", "The solvent in sugar water is", ["water"], 0.67),
              ans("solute", "The solute in sugar water is", ["sugar", "soluble"], 0.67),
              ans("soluble", "Sugar dissolves in water because it is", ["soluble"], 0.66),
            ],
            implementationShape: "wordBank[], blanks[]",
          }),
          q("spip-y7s-q12b", 12, "b", "When sugar dissolves in water, is the sugar still in the water?", 1, "choice", "multiple_choice_single", "radio choice", "auto_marked", {
            visual: img("spip-y7s-q12-sugar-water.png", "Sugar added to water makes sugar water", 630, true),
            displayAnswer: "yes",
            choices: [
              { value: "no", label: "no" },
              { value: "sometimes", label: "sometimes" },
              { value: "yes", label: "yes" },
            ],
            parts: [ans("answer", "Answer", ["yes"], 1)],
            implementationShape: "choices[]",
          }),
        ],
      },
      {
        id: "part4",
        label: "Questions 13-16",
        title: "Testing, water waste, forces, and filtration",
        hint: "Complete the practical method and results carefully.",
        questions: [
          q("spip-y7s-q13a", 13, "a", "Pierre is testing which materials are electrical conductors. Put each instruction letter in the correct order.", 2, "orderingSequence", "ordering_sequence", "order instruction letters", "auto_marked", {
            groupIntro: {
              title: "Pierre is testing which materials are electrical conductors. He builds this electrical circuit.",
            },
            visual: img("spip-y7s-q13-circuit-test.png", "Circuit with a test box", 364),
            displayAnswer: "D, A, C, B",
            orderItems: [
              "A Connect the circuit.",
              "B Record the results and remove the material.",
              "C Put the material into the test box.",
              "D Collect a cell, lamp, test box and wires.",
            ],
            parts: [
              ans("pos1", "First instruction", ["D"], 0.5),
              ans("pos2", "Second instruction", ["A"], 0.5),
              ans("pos3", "Third instruction", ["C"], 0.5),
              ans("pos4", "Last instruction", ["B"], 0.5),
            ],
            implementationShape: "acceptedOrder:[D,A,C,B]",
          }),
          q("spip-y7s-q13b", 13, "b", "Pierre thinks one of his results is incorrect. He wants to test this material again. Which material does he test again?", 1, "shortText", "short_text", "one-line material answer", "auto_marked", {
            visual: img("spip-y7s-q13-circuit-test.png", "Circuit with a test box", 364),
            displayAnswer: "steel",
            parts: [ans("answer", "Material", ["steel"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q13c", 13, "c", "Pierre makes a conclusion from his results. What conclusion does Pierre make?", 1, "shortText", "short_text", "one-line conclusion", "semi_auto_marked", {
            visual: img("spip-y7s-q13-circuit-test.png", "Circuit with a test box", 364),
            displayAnswer: "Metals conduct electricity and non-metals do not.",
            parts: [keyword("answer", "Conclusion", [["metal", "conduct"], ["non", "metal", "not"], ["plastic", "stone", "not"], ["iron", "lead", "copper"]], 1)],
            implementationShape: "parts[{id,keywords,points}]",
          }),
          q("spip-y7s-q14a", 14, "a", "Aiko measures the volume of water collected from each tap. Write down the name of the apparatus she uses.", 1, "shortText", "short_text", "apparatus name", "auto_marked", {
            groupIntro: {
              title: "Aiko investigates where water is wasted in her school. She looks at a tap with drips of water.",
              paragraphs: [
                "Aiko collects drips of water from different taps for 2 minutes.",
              ],
            },
            visual: img("spip-y7s-q14-dripping-tap.png", "Tap with drips of water", 602, true),
            displayAnswer: "measuring cylinder",
            parts: [ans("answer", "Apparatus", ["measuring cylinder", "measuring cylinders", "graduated cylinder"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q14b", 14, "b", "Aiko writes down the results. Complete her table of results.", 2, "completeTable", "complete_table", "fill missing table cells", "auto_marked", {
            visual: img("spip-y7s-q14-dripping-tap.png", "Tap with drips of water", 602, true),
            displayAnswer: "tap 1: 0.0 cm3; tap 2: 1.8 cm3; tap 3: 2.9 cm3; tap 4: 3.8 cm3; tap 5: 3.3 cm3",
            infoCard: {
              title: "Results",
              items: ["tap 4 = 3.8 cm3", "tap 3 = 2.9 cm3", "tap 2 = 1.8 cm3", "tap 5 = 3.3 cm3", "tap 1 = 0.0 cm3"],
            },
            table: {
              columns: ["tap number", "volume collected in cm3"],
              rows: [
                ["1", { part: "tap1_volume", placeholder: "volume" }],
                [{ part: "tap2_number", placeholder: "tap" }, "1.8"],
                ["3", { part: "tap3_volume", placeholder: "volume" }],
                [{ part: "tap4_number", placeholder: "tap" }, { part: "tap4_volume", placeholder: "volume" }],
                ["5", { part: "tap5_volume", placeholder: "volume" }],
              ],
            },
            parts: [
              ans("tap1_volume", "tap 1 volume", ["0.0", "0", "0.0 cm3", "0 cm3"], 0.33),
              ans("tap2_number", "tap number", ["2", "tap 2"], 0.33),
              ans("tap3_volume", "tap 3 volume", ["2.9", "2.9 cm3"], 0.33),
              ans("tap4_number", "tap number", ["4", "tap 4"], 0.33),
              ans("tap4_volume", "tap 4 volume", ["3.8", "3.8 cm3"], 0.34),
              ans("tap5_volume", "tap 5 volume", ["3.3", "3.3 cm3"], 0.34),
            ],
            scoreThresholds: [
              { minCorrect: 6, points: 2 },
              { minCorrect: 4, points: 1 },
            ],
            implementationShape: "tableCells[{row,col,accepted}]",
          }),
          q("spip-y7s-q14c", 14, "c", "There are drips from all the taps. One of the results is wrong. Circle the result that is wrong. Explain your answer.", 1, "mixed", "mixed", "choice plus explanation", "semi_auto_marked", {
            visual: img("spip-y7s-q14-dripping-tap.png", "Tap with drips of water", 602, true),
            displayAnswer: "tap 1, because all taps drip but tap 1 has 0.0 cm3/no volume of water collected.",
            choices: ["tap 1", "tap 2", "tap 3", "tap 4", "tap 5"].map((value) => ({ value, label: value })),
            parts: [
              ans("choice", "Wrong result", ["tap 1"], 0.5),
              keyword("explanation", "Explanation", [["all", "tap", "drip"], ["0"], ["no", "water"], ["no", "volume"], ["nothing", "collected"], ["other", "volume"]], 0.5),
            ],
            implementationShape: "parts[{choice accepted}, {keywords}]",
          }),
          q("spip-y7s-q15a", 15, "a", "Complete the sentence: When the toy bounces up, the upward force is _____ than the downward force.", 1, "shortText", "fill_blank", "complete sentence", "auto_marked", {
            groupIntro: {
              title: "Jamila has a toy with a spring. She makes the toy move upwards and downwards.",
            },
            visual: img("spip-y7s-q15-spring-toy.png", "Jamila on a spring toy", 392),
            displayAnswer: "greater",
            parts: [ans("answer", "Missing word", ["greater", "larger", "more", "bigger", "stronger"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q15b", 15, "b", "What does Jamila do to make the toy bounce faster?", 1, "choice", "multiple_choice_single", "radio choice", "auto_marked", {
            visual: img("spip-y7s-q15-spring-toy.png", "Jamila on a spring toy", 392),
            displayAnswer: "push on the spring more often",
            choices: [
              { value: "increase the weight of the toy", label: "increase the weight of the toy" },
              { value: "push on the spring all of the time", label: "push on the spring all of the time" },
              { value: "push on the spring less often", label: "push on the spring less often" },
              { value: "push on the spring more often", label: "push on the spring more often" },
              { value: "use a longer spring", label: "use a longer spring" },
            ],
            parts: [ans("answer", "Answer", ["push on the spring more often"], 1)],
            implementationShape: "choices[]",
          }),
          q("spip-y7s-q16a", 16, "a", "Chen cannot use a sieve to separate the mixture of sand and copper sulfate. Explain why.", 1, "shortText", "short_text", "explanation", "semi_auto_marked", {
            groupIntro: {
              title: "Copper sulfate is a blue solid that dissolves to make a blue solution. Chen filters a mixture of powdered copper sulfate and sand.",
            },
            visual: img("spip-y7s-q16-filtration.png", "Filtration equipment", 490),
            displayAnswer: "The particles are too small or similar size, so both solids would pass through the sieve.",
            parts: [keyword("answer", "Explanation", [["particle", "small"], ["same", "size"], ["both", "pass"], ["powder"]], 1)],
            implementationShape: "parts[{id,keywords,points}]",
          }),
          q("spip-y7s-q16b", 16, "b", "What substance does the residue contain?", 1, "shortText", "short_text", "one-line substance", "auto_marked", {
            visual: img("spip-y7s-q16-filtration.png", "Filtration equipment", 490),
            displayAnswer: "sand",
            parts: [ans("answer", "Residue", ["sand"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q16c", 16, "c", "What is the name of the filtrate?", 1, "shortText", "short_text", "one-line filtrate name", "auto_marked", {
            visual: img("spip-y7s-q16-filtration.png", "Filtration equipment", 490),
            displayAnswer: "copper sulfate solution",
            parts: [ans("answer", "Filtrate", ["copper sulfate solution", "copper sulphate solution", "copper sulfate", "copper sulphate", "blue solution"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
          q("spip-y7s-q16d", 16, "d", "What colour is the filtrate?", 1, "shortText", "short_text", "one-line colour", "auto_marked", {
            visual: img("spip-y7s-q16-filtration.png", "Filtration equipment", 490),
            displayAnswer: "blue",
            parts: [ans("answer", "Colour", ["blue"], 1)],
            implementationShape: "parts[{id,accepted}]",
          }),
        ],
      },
    ],
  };
})();
