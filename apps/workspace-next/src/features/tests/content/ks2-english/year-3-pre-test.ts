import type { AnswerPart, MultiChoiceQuestion, MultiTextQuestion, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const prefix = "ks2-y3-eng-pre";
const choice = (value: string, label = value) => ({ value, label });

function part(id: string, accepted: string[], normalizer: AnswerPart["normalizer"] = "englishText"): AnswerPart {
  return { id, accepted, points: 1, normalizer };
}

function question(number: number, prompt: string, display: string, parts: AnswerPart[]) {
  return {
    id: `${prefix}-q${number}`,
    number,
    prompt,
    points: 1,
    grading: {
      mode: "auto" as const,
      display,
      parts,
      ...(parts.length > 1 ? { scoreThresholds: [{ minCorrect: parts.length, points: 1 }] } : {}),
    },
  };
}

function text(
  number: number,
  prompt: string,
  accepted: string[],
  { display = accepted.join(" / "), target, exact = false }: { display?: string; target?: string; exact?: boolean } = {},
): TestQuestion {
  const targetIndex = target ? prompt.lastIndexOf(target) : -1;
  return {
    ...question(number, prompt, display, [part("answer", accepted, exact ? "englishExact" : "englishText")]),
    type: "text",
    placeholder: "Type your answer",
    ...(target && targetIndex >= 0 ? {
      promptParts: [
        { text: prompt.slice(0, targetIndex) },
        { text: target, underline: true },
        { text: prompt.slice(targetIndex + target.length) },
      ],
    } : {}),
  };
}

function single(number: number, prompt: string, values: string[], answer: string): TestQuestion {
  return {
    ...question(number, prompt, answer, [part("answer", [answer])]),
    type: "singleChoice",
    choices: values.map((value) => choice(value)),
  };
}

function multiple(
  number: number,
  prompt: string,
  choices: MultiChoiceQuestion["choices"],
  accepted: string[],
  display: string,
): MultiChoiceQuestion {
  return { ...question(number, prompt, display, [part("selected", accepted, "set")]), type: "multiChoice", choices };
}

function fields(
  number: number,
  prompt: string,
  fields: MultiTextQuestion["fields"],
  parts: AnswerPart[],
  display: string,
): MultiTextQuestion {
  return { ...question(number, prompt, display, parts), type: "multiText", fields, compact: true };
}

const questions: TestQuestion[] = [
  text(1, "Write a synonym for the underlined word. The boys were ravenous because they missed breakfast.", ["hungry", "starving", "famished"], { target: "ravenous" }),
  text(2, "Write the meaning of the underlined word with a prefix. It is impossible to live on the moon.", ["not possible"], { target: "impossible" }),
  text(3, "Change the underlined adjective to an adverb by adding a suffix. The hungry boy ate his lunch.", ["hungrily"], { target: "hungry" }),
  single(4, "Select the correct homophone. The weather / whether was perfect for a picnic.", ["weather", "whether"], "weather"),
  single(5, "Select the misspelled word. The shirt cost fourty dollars because it was satin.", ["The", "shirt", "cost", "fourty", "dollars", "because", "it", "was", "satin"], "fourty"),
  text(6, "Use an apostrophe to write the contraction of will not.", ["won’t"]),
  single(7, "Select the correct use of an apostrophe to show singular possession. The horse’s / horses’ stable was in the barn.", ["horse’s", "horses’"], "horse’s"),
  fields(8, "Select the word that is spelled incorrectly and write the correct form.",
    [
      { id: "selected", label: "Incorrect word", options: ["inpossible", "irregular", "misbehave"].map((value) => choice(value)), control: "radio" },
      { id: "correction", label: "Correct spelling" },
    ],
    [part("selected", ["inpossible"]), part("correction", ["impossible"])], "inpossible → impossible"),
  multiple(9, "Select the adjectives. Behind the empty park was a huge field.",
    ["Behind", "the", "empty", "park", "was", "a", "huge", "field"].map((value) => choice(value)), ["empty", "huge"], "empty, huge"),
  {
    ...single(10, "Is the underlined word an adjective, verb or noun? The class went on a trip to see a play at the theatre.", ["adjective", "verb", "noun"], "noun"),
    promptParts: [
      { text: "Is the underlined word an adjective, verb or noun? The class went on a trip to see a " },
      { text: "play", underline: true },
      { text: " at the theatre." },
    ],
  },
  fields(11, "Write the three main parts of a story in order.",
    [{ id: "first", label: "First part" }, { id: "second", label: "Second part" }, { id: "third", label: "Third part" }],
    [part("first", ["beginning"]), part("second", ["middle"]), part("third", ["end"])], "beginning, middle, end"),
  fields(12, "Correct the spelling and punctuation mistakes. I couldnt carry the heavey box.",
    [{ id: "first", label: "First correction" }, { id: "second", label: "Second correction" }],
    [part("first", ["couldn’t"]), part("second", ["heavy"])], "couldn’t, heavy"),
  text(13, "Rewrite the sentence and correct the punctuation and capitalization mistakes. The family went to paris on their holiday", ["The family went to Paris on their holiday."], { exact: true }),
  text(14, "Write the correct conjunction in the blank. My mom was angry ___ I broke her vase.", ["because"]),
  single(15, "Select the verb. The boys played football in the park.", ["The", "boys", "played", "football", "in", "the", "park"], "played"),
  single(16, "Complete the sentence using has or have. The birds ___ been singing all morning.", ["has", "have"], "have"),
  single(17, "Select the common noun. He walked along the river.", ["He", "walked", "along", "the", "river"], "river"),
  text(18, "Complete the sentence with a preposition. The train rushed ___ the tunnel.", ["into", "through"]),
  text(19, "Rewrite the sentence with speech marks to show direct speech. Stop that! shouted Jacob.",
    ["“Stop that!” shouted Jacob.", "‘Stop that!’ shouted Jacob."], { exact: true, display: "“Stop that!” shouted Jacob." }),
  multiple(20, "Select where the commas belong. The girl has long curly black hair.",
    ["The", "girl", "has", "long", "curly", "black", "hair"].map((value) => choice(value, `After “${value}”`)),
    ["long", "curly"], "The girl has long, curly, black hair."),
];

export const ks2Year3EnglishPreTest: TestDefinition = {
  id: "ks2-year-3-english-pre-test",
  title: "KS2 Year 3 English Pre-Test",
  subject: "English",
  level: "Key Stage 2 · Year 3",
  status: "draft",
  durationMinutes: 30,
  suggestedTimer: true,
  totalPoints: 20,
  resultMode: "scoreWithCorrections",
  sections: [
    { id: "part1", label: "Part I", title: "Vocabulary and word building", questions: questions.slice(0, 3) },
    { id: "part2", label: "Part II", title: "Spelling and apostrophes", questions: questions.slice(3, 8) },
    { id: "part3", label: "Part III", title: "Word classes and story structure", questions: questions.slice(8, 11) },
    { id: "part4", label: "Part IV", title: "Punctuation and grammar", questions: questions.slice(11, 18) },
    { id: "part5", label: "Part V", title: "Direct speech and commas", questions: questions.slice(18, 20) },
  ],
};
