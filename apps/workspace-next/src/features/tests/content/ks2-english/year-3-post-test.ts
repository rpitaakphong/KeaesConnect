import type { AnswerPart, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const prefix = "ks2-y3-eng-post";
const part = (id: string, accepted: string[], points = 1, normalizer: AnswerPart["normalizer"] = "text"): AnswerPart => ({ id, accepted, points, normalizer });
const choice = (value: string, label = value) => ({ value, label });

function textQuestion(number: number, prompt: string, accepted: string[], display: string, extra: Partial<TestQuestion> = {}): TestQuestion {
  return {
    id: `${prefix}-q${number}`,
    number,
    prompt,
    points: 1,
    type: "text",
    placeholder: "Type your answer",
    grading: { mode: "auto", display, parts: [part("answer", accepted)] },
    ...extra,
  } as TestQuestion;
}

function singleQuestion(number: number, prompt: string, choices: Array<{ value: string; label: string }>, accepted: string, display = accepted, extra: Partial<TestQuestion> = {}): TestQuestion {
  return {
    id: `${prefix}-q${number}`,
    number,
    prompt,
    points: 1,
    type: "singleChoice",
    choices,
    grading: { mode: "auto", display, parts: [part("answer", [accepted])] },
    ...extra,
  } as TestQuestion;
}

const questions: TestQuestion[] = [
  textQuestion(1, "The boys were livid because they missed the bus. Write a synonym for livid.", ["angry", "upset"], "angry or upset", {
    promptParts: [{ text: "The boys were " }, { text: "livid", underline: true }, { text: " because they missed the bus. Write a synonym for livid." }],
  }),
  textQuestion(2, "It is illegal to throw trash in the street. Write the meaning of illegal.", ["not legal"], "not legal", {
    promptParts: [{ text: "It is " }, { text: "illegal", underline: true }, { text: " to throw trash in the street. Write the meaning of illegal." }],
  }),
  textQuestion(3, "Change serious to an adverb by adding a suffix.", ["seriously"], "seriously", {
    promptParts: [{ text: "Change " }, { text: "serious", underline: true }, { text: " to an adverb by adding a suffix." }],
  }),
  singleQuestion(4, "The wind ___ the kite across the sky.", [choice("blue"), choice("blew")], "blew"),
  singleQuestion(5, "Select the misspelled word in the sentence: They took their freinds to the mall to buy clothes.", ["They", "took", "their", "freinds", "to", "the", "mall", "buy", "clothes"].map((word) => choice(word.toLowerCase(), word)), "freinds"),
  textQuestion(6, "Use an apostrophe to write the contraction of he would.", ["he'd", "he’d"], "he’d"),
  singleQuestion(7, "The ___ bikes are in the garage. Choose the apostrophe that shows plural possession.", [choice("girl's", "girl’s"), choice("girls'", "girls’")], "girls'", "girls’"),
  {
    id: `${prefix}-q8`, number: 8, prompt: "Select the incorrectly spelled word and write its correct form.", points: 2, type: "multiText",
    fields: [
      { id: "selected", label: "Incorrect word", options: [choice("untidy"), choice("irlegible"), choice("misunderstand")], control: "radio" },
      { id: "correction", label: "Correct spelling", placeholder: "Write the correct form" },
    ],
    grading: { mode: "auto", display: "irlegible → illegible", parts: [part("selected", ["irlegible"]), part("correction", ["illegible"])] },
  },
  {
    id: `${prefix}-q9`, number: 9, prompt: "Select the two adjectives: In the dark forest lived a wicked witch.", points: 2, type: "multiChoice",
    choices: ["in", "the", "dark", "forest", "lived", "a", "wicked", "witch"].map((word) => choice(word)),
    grading: { mode: "auto", display: "dark; wicked", parts: [part("selected", ["dark"], 1, "contains"), part("selected", ["wicked"], 1, "contains")] },
  },
  singleQuestion(10, "The class went to the stadium to play football. What word class is play?", [choice("adjective"), choice("verb"), choice("noun")], "verb", "verb", {
    promptParts: [{ text: "The class went to the stadium to " }, { text: "play", underline: true }, { text: " football. What word class is play?" }],
  }),
  {
    id: `${prefix}-q11`, number: 11, prompt: "Write the three main parts of a story in order.", points: 3, type: "multiText", compact: true,
    fields: [
      { id: "beginning", label: "First part", placeholder: "First part" },
      { id: "middle", label: "Second part", placeholder: "Second part" },
      { id: "end", label: "Third part", placeholder: "Third part" },
    ],
    grading: { mode: "auto", display: "beginning; middle; end", parts: [part("beginning", ["beginning"]), part("middle", ["middle"]), part("end", ["end"])] },
  },
  {
    id: `${prefix}-q12`, number: 12, prompt: "Correct the spelling and punctuation mistakes: I didnt enjoy the rainy seeson.", points: 2, type: "multiText", compact: true,
    fields: [{ id: "didnt", label: "Correct didnt", placeholder: "Correct punctuation" }, { id: "season", label: "Correct seeson", placeholder: "Correct spelling" }],
    grading: { mode: "auto", display: "didn’t; season", parts: [part("didnt", ["didn't", "didn’t"]), part("season", ["season"])] },
  },
  {
    id: `${prefix}-q13`, number: 13, prompt: "Correct the capitalisation and ending punctuation: Will you visit china on your holiday", points: 2, type: "multiText", compact: true,
    fields: [
      { id: "country", label: "Country name", options: [choice("correct-China", "China"), choice("lowercase-china", "china")], control: "radio" },
      { id: "punctuation", label: "Ending punctuation", options: [choice("full-stop", "."), choice("question-mark", "?"), choice("exclamation-mark", "!")], control: "radio" },
    ],
    grading: { mode: "auto", display: "China; ?", parts: [part("country", ["correct-China"]), part("punctuation", ["question-mark"])] },
  },
  textQuestion(14, "You might get sick ___ you eat too much candy. Write the correct conjunction.", ["if"], "if"),
  singleQuestion(15, "Select the verb: The boys read books in the library.", ["the", "boys", "read", "books", "in", "library"].map((word) => choice(word)), "read"),
  singleQuestion(16, "The cat ___ been chasing the mouse all morning.", [choice("has"), choice("have")], "has"),
  singleQuestion(17, "Select the common noun: He hiked all day in the mountains.", ["he", "hiked", "all", "day", "in", "the", "mountains"].map((word) => choice(word)), "mountains"),
  textQuestion(18, "The children walked ___ the river bank. Complete the sentence with a preposition.", ["along", "near", "next to"], "along, near or next to"),
  singleQuestion(19, "Choose the sentence with speech marks correctly showing direct speech.", [
    choice("correct", "“Can I have some juice?” asked Ted."),
    choice("quote-all", "“Can I have some juice? asked Ted.”"),
    choice("no-quotes", "Can I have some juice? asked Ted."),
  ], "correct", "“Can I have some juice?” asked Ted."),
  {
    id: `${prefix}-q20`, number: 20, prompt: "Select the three places where commas belong: The giraffe has brown black white and orange spots.", points: 3, type: "multiChoice",
    choices: [choice("brown", "after brown"), choice("black", "after black"), choice("white", "after white"), choice("orange", "after orange")],
    grading: { mode: "auto", display: "brown, black, white, and orange", parts: [part("selected", ["brown"], 1, "contains"), part("selected", ["black"], 1, "contains"), part("selected", ["white"], 1, "contains")] },
  },
];

export const ks2Year3EnglishPostTest: TestDefinition = {
  id: "ks2-year-3-english-post-test",
  title: "KS2 Year 3 English Post-Test",
  subject: "English",
  level: "Key Stage 2 · Year 3",
  status: "draft",
  durationMinutes: 30,
  totalPoints: 28,
  sections: [
    { id: "part1", label: "Part I", title: "Vocabulary and word building", hint: "Read each sentence carefully, then type the best answer.", questions: questions.slice(0, 3) },
    { id: "part2", label: "Part II", title: "Spelling and apostrophes", hint: "Choose or write the correct form.", questions: questions.slice(3, 8) },
    { id: "part3", label: "Part III", title: "Word classes and story structure", hint: "Select the correct words and complete each answer.", questions: questions.slice(8, 11) },
    { id: "part4", label: "Part IV", title: "Punctuation and grammar", hint: "Correct each sentence or choose the best answer.", questions: questions.slice(11, 18) },
    { id: "part5", label: "Part V", title: "Direct speech and commas", hint: "Choose the correctly punctuated answers.", questions: questions.slice(18, 20) },
  ],
};
