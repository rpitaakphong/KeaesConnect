import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/english-literacy/level-2";
const choice = (value: string, label = value) => ({ value, label });
const answer = (accepted: string[], points = 1) => ({ id: "answer", accepted, points, normalizer: "text" as const });

type QuestionExtras = Partial<Pick<TestQuestion, "note" | "visuals">>;

const single = (number: number, prompt: string, choices: string[], accepted: string, display = accepted): TestQuestion => ({
  id: `el2-q${number}`,
  number,
  prompt,
  points: 1,
  type: "singleChoice",
  choices: choices.map((item) => choice(item)),
  grading: { mode: "auto", display, parts: [answer([accepted])] },
});

const text = (number: number, prompt: string, accepted: string[], display: string, extra: QuestionExtras & { placeholder?: string; inputMode?: "text" | "number" | "textarea" } = {}): TestQuestion => ({
  id: `el2-q${number}`,
  number,
  prompt,
  points: 1,
  type: "text",
  placeholder: extra.placeholder,
  inputMode: extra.inputMode || "text",
  visuals: extra.visuals,
  note: extra.note,
  grading: { mode: "auto", display, parts: [answer(accepted)] },
});

const aiText = (number: number, prompt: string, display: string, contentTerms: string[]): TestQuestion => ({
  id: `el2-q${number}`,
  number,
  prompt,
  points: 1,
  type: "text",
  inputMode: "textarea",
  placeholder: "Write a short answer",
  grading: { mode: "aiSplit", display, contentTerms },
});

const story = [
  "Rima was a beggar girl. One day a lady gave her some saplings and seeds of flower plants instead of alms and said, 'Plant these saplings and seeds. You will gain a hundred times more from them.'",
  "Rima did not understand anything but decided to do as the lady had said. She went to her small hut and dug the ground by its side. Then she planted the saplings and sowed the seeds. She watered them well and a few weeks later, flowers bloomed around her hut. One day a few women came to buy the flowers Rima had grown. So from that day Rima plucked the flowers and sold them door to door. Sometimes, she sold them in the market and on the roads. She was earning her living well and had stopped begging. Soon some people became regular buyers of her flowers. She saved enough money to open a small flower shop in the market and people went to see Rima's flower collection.",
  "Rima thanked the lady who had led her to get green gold.",
];

export const englishLiteracy2: TestDefinition = {
  id: "english-literacy-2",
  title: "English Literacy Level 2",
  subject: "English",
  level: "English Literacy 2",
  status: "active",
  totalPoints: 30,
  aiShortAnswerRubrics: {
    "el2-q21": "Correct if the answer says the lady gave Rima saplings and seeds of flower plants.",
    "el2-q22": "Correct if the answer says Rima planted the saplings/seeds and/or sowed/watered them.",
    "el2-q23": "Correct if the answer says she saved or earned money from selling flowers.",
    "el2-q24": "Correct if the answer says the plants or flowers helped her earn money or improve her life.",
  },
  sections: [
    {
      id: "partA",
      label: "Part A",
      title: "Circle the words that best complete each sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        single(1, "I (eight / ate) a lot for breakfast today.", ["eight", "ate"], "ate"),
        single(2, "Mr. Smith is an (I / eye) doctor.", ["I", "eye"], "eye"),
        single(3, "Vic is spending his (week / weak) in the province.", ["week", "weak"], "week"),
        single(4, "I can't (wait / weight) to see you.", ["wait", "weight"], "wait"),
        single(5, "My mom bought (too / two) shirts for me.", ["too", "two"], "two"),
      ],
    },
    {
      id: "part2",
      label: "Part 2",
      title: "Write the plural form by adding -s or -es.",
      hint: "Type the plural form for each picture.",
      questions: [
        text(6, "Truck", ["trucks"], "trucks", { visuals: [{ type: "image", src: `${assetBase}/q6-trucks.png`, alt: "Two trucks", maxWidth: 240 }] }),
        text(7, "Box", ["boxes"], "boxes", { visuals: [{ type: "image", src: `${assetBase}/q7-boxes.png`, alt: "Two boxes", maxWidth: 240 }] }),
        text(8, "Tomato", ["tomatoes"], "tomatoes", { visuals: [{ type: "image", src: `${assetBase}/q8-tomatoes.png`, alt: "Tomatoes", maxWidth: 240 }] }),
        text(9, "Key", ["keys"], "keys", { visuals: [{ type: "image", src: `${assetBase}/q9-keys.png`, alt: "Keys", maxWidth: 240 }] }),
      ],
    },
    {
      id: "part3",
      label: "Part 3",
      title: "Divide the word into syllables.",
      hint: "Use a slash between syllables, for example: rab/bit.",
      questions: [
        text(10, "Effect", ["ef/fect", "ef fect"], "ef/fect", { placeholder: "Use / between syllables" }),
        text(11, "Faster", ["fast/er", "fast er"], "fast/er", { placeholder: "Use / between syllables" }),
        text(12, "Happens", ["hap/pens", "hap pens"], "hap/pens", { placeholder: "Use / between syllables" }),
        text(13, "Beautiful", ["beau/ti/ful", "beau ti ful"], "beau/ti/ful", { placeholder: "Use / between syllables" }),
        text(14, "Light", ["light"], "light", { placeholder: "Use / between syllables" }),
        text(15, "Elephant", ["el/e/phant", "el e phant"], "el/e/phant", { placeholder: "Use / between syllables" }),
      ],
    },
    {
      id: "part4",
      label: "Part 4",
      title: "Underline the correct pronoun.",
      hint: "Choose the correct pronoun.",
      questions: [
        single(16, "The boys are over there. Can you see (they / them)?", ["they", "them"], "them"),
        single(17, "Listen to (him / he)!", ["him", "he"], "him"),
        single(18, "Look at (she / her). She's very pretty.", ["she", "her"], "her"),
        single(19, "Can you tell (we / us) your name?", ["we", "us"], "us"),
        single(20, "Please help (I / me).", ["I", "me"], "me"),
      ],
    },
    {
      id: "part5",
      label: "Part 5",
      title: "Read the story and answer the questions.",
      hint: "Write a short answer. These answers are graded by AI when you submit.",
      storyTitle: "Green Gold",
      story,
      questions: [
        aiText(21, "What did the lady give to Rima?", "The lady gave Rima saplings and seeds of flower plants.", ["sapling", "seed", "plant", "flower"]),
        aiText(22, "What did she do with the seeds?", "Rima planted the saplings/seeds and sowed or watered them.", ["plant", "sow", "water", "dug"]),
        aiText(23, "How did Rima put up a small flower shop?", "She saved or earned money from selling flowers.", ["save", "earn", "money", "sold", "sell", "flower"]),
        aiText(24, "Why did she call it green gold?", "The plants or flowers helped her earn money or improve her life.", ["money", "earn", "life", "flower", "plant", "green gold"]),
      ],
    },
    {
      id: "part6",
      label: "Part 6",
      title: "Number the sentences 1-6 to put them in order.",
      hint: "Type the correct order number for each sentence.",
      questions: [
        text(25, "She saved enough money to open a small flower shop in the market.", ["5"], "5", { inputMode: "number" }),
        text(26, "She thanked the lady who gave her the green gold.", ["6"], "6", { inputMode: "number" }),
        text(27, "She watered the plants.", ["3"], "3", { inputMode: "number" }),
        text(28, "Rima went to her small hut and dug the ground then she planted seeds.", ["2"], "2", { inputMode: "number" }),
        text(29, "A lady gave her seeds and told her to plant it.", ["1"], "1", { inputMode: "number" }),
        text(30, "Flowers bloomed and people bought flowers.", ["4"], "4", { inputMode: "number" }),
      ],
    },
  ],
};
