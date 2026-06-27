import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/starter-reading-writing";
const image = (name: string) => `${assetBase}/${name}`;

function autoPart(id: string, accepted: string[]) {
  return { id, accepted, points: 1 };
}

function choiceQuestion(
  id: string,
  number: number,
  prompt: string,
  choices: Array<{ value: string; label: string }>,
  correct: string,
  visual?: { src: string; alt: string; maxWidth?: number },
): TestQuestion {
  return {
    id,
    number,
    prompt,
    points: 1,
    type: "singleChoice",
    choices,
    visuals: visual ? [{ type: "image", ...visual }] : undefined,
    grading: {
      mode: "auto",
      display: correct,
      parts: [autoPart("answer", [correct])],
    },
  };
}

function textQuestion(
  id: string,
  number: number,
  prompt: string,
  correct: string,
  options: {
    note?: string;
    placeholder?: string;
    visual?: { src: string; alt: string; maxWidth?: number };
  } = {},
): TestQuestion {
  return {
    id,
    number,
    prompt,
    points: 1,
    note: options.note,
    type: "text",
    placeholder: options.placeholder || "answer",
    visuals: options.visual ? [{ type: "image", ...options.visual }] : undefined,
    grading: {
      mode: "auto",
      display: correct,
      parts: [autoPart("answer", [correct])],
    },
  };
}

const tickCrossChoices = [
  { value: "tick", label: "Tick" },
  { value: "cross", label: "Cross" },
];

const yesNoChoices = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const starterProgressReadingWriting: TestDefinition = {
  id: "starter-progress-reading-writing",
  title: "Starter Progress Reading & Writing",
  subject: "English",
  level: "Cambridge Starters",
  totalPoints: 25,
  status: "active",
  sections: [
    {
      id: "part1",
      label: "Reading & Writing Part 1",
      title: "Look and read. Put a tick or a cross.",
      hint: "Choose Tick if the sentence is true. Choose Cross if it is not true.",
      questions: [
        choiceQuestion("starter-rw-p1q1", 1, "This is a lizard.", tickCrossChoices, "cross", { src: image("rw-p1-lizard.jpg"), alt: "Lizard picture", maxWidth: 260 }),
        choiceQuestion("starter-rw-p1q2", 2, "This is a bike.", tickCrossChoices, "tick", { src: image("rw-p1-bike.jpg"), alt: "Bike picture", maxWidth: 260 }),
        choiceQuestion("starter-rw-p1q3", 3, "This is a pineapple.", tickCrossChoices, "tick", { src: image("rw-p1-pineapple.jpg"), alt: "Pineapple picture", maxWidth: 260 }),
        choiceQuestion("starter-rw-p1q4", 4, "This is a television.", tickCrossChoices, "cross", { src: image("rw-p1-phone.jpg"), alt: "Phone picture", maxWidth: 260 }),
        choiceQuestion("starter-rw-p1q5", 5, "This is a guitar.", tickCrossChoices, "tick", { src: image("rw-p1-guitar.jpg"), alt: "Guitar picture", maxWidth: 260 }),
      ],
    },
    {
      id: "part2",
      label: "Reading & Writing Part 2",
      title: "Look and read. Write yes or no.",
      hint: "Use the picture to decide each answer.",
      story: ["Look at the beach picture, then choose Yes or No for each sentence."],
      storyImage: {
        src: image("rw-p2-beach.jpg"),
        alt: "Beach scene with children, elephants, monkeys, a duck, a crocodile, and a boat",
        maxWidth: 920,
      },
      storyLayout: "heroImage",
      questions: [
        choiceQuestion("starter-rw-p2q1", 1, "There are two children in the sea.", yesNoChoices, "yes"),
        choiceQuestion("starter-rw-p2q2", 2, "The duck is walking behind the two elephants.", yesNoChoices, "yes"),
        choiceQuestion("starter-rw-p2q3", 3, "The girls are playing with a ball.", yesNoChoices, "no"),
        choiceQuestion("starter-rw-p2q4", 4, "The woman in the boat has got a camera.", yesNoChoices, "yes"),
        choiceQuestion("starter-rw-p2q5", 5, "The crocodile is eating a coconut.", yesNoChoices, "no"),
      ],
    },
    {
      id: "part3",
      label: "Reading & Writing Part 3",
      title: "Look at the pictures. Write the words.",
      hint: "Spell each word from the letters shown.",
      questions: [
        textQuestion("starter-rw-p3q1", 1, "Blue trousers", "jeans", { note: "Letters: n a j s e", visual: { src: image("rw-p3-jeans.jpg"), alt: "Blue trousers", maxWidth: 220 } }),
        textQuestion("starter-rw-p3q2", 2, "Purple shoes", "shoes", { note: "Letters: e s o h s", visual: { src: image("rw-p3-shoes.jpg"), alt: "Purple shoes", maxWidth: 220 } }),
        textQuestion("starter-rw-p3q3", 3, "Green jacket", "jacket", { note: "Letters: c j t k e a", visual: { src: image("rw-p3-jacket.jpg"), alt: "Green jacket", maxWidth: 220 } }),
        textQuestion("starter-rw-p3q4", 4, "Handbag", "handbag", { note: "Letters: n g a a b d h", visual: { src: image("rw-p3-handbag.jpg"), alt: "Handbag", maxWidth: 220 } }),
        textQuestion("starter-rw-p3q5", 5, "Green trousers", "trousers", { note: "Letters: r o t s r e u s", visual: { src: image("rw-p3-trousers.jpg"), alt: "Green trousers", maxWidth: 220 } }),
      ],
    },
    {
      id: "part4",
      label: "Reading & Writing Part 4",
      title: "Choose a word from the box.",
      hint: "Complete the horse text with one word for each blank.",
      wordBank: ["hippo", "water", "carrots", "hair", "man", "house", "piano"],
      story: [
        "I've got four legs, two ears, two eyes and long ___ on my head.",
        "I'm a big animal. I don't live in a ___ or a garden.",
        "I like eating ___ and apples. I drink ___.",
        "A woman, a ___ or a child can ride me.",
        "What am I? I am a horse.",
      ],
      storyImage: {
        src: image("rw-p4-horse.jpg"),
        alt: "A horse",
        maxWidth: 260,
      },
      questions: [
        textQuestion("starter-rw-p4q1", 1, "Long _____ on my head.", "hair", { placeholder: "Choose a word" }),
        textQuestion("starter-rw-p4q2", 2, "I do not live in a _____ or a garden.", "house", { placeholder: "Choose a word" }),
        textQuestion("starter-rw-p4q3", 3, "I like eating _____ and apples.", "carrots", { placeholder: "Choose a word" }),
        textQuestion("starter-rw-p4q4", 4, "I drink _____.", "water", { placeholder: "Choose a word" }),
        textQuestion("starter-rw-p4q5", 5, "A woman, a _____ or a child can ride me.", "man", { placeholder: "Choose a word" }),
      ],
    },
    {
      id: "part5",
      label: "Reading & Writing Part 5",
      title: "Write one-word answers.",
      hint: "Use the classroom pictures.",
      questions: [
        textQuestion("starter-rw-p5q1", 1, "What is the teacher drawing? a ...", "fish", { visual: { src: image("rw-p5-classroom-1.jpg"), alt: "Teacher drawing a fish in the classroom", maxWidth: 420 } }),
        textQuestion("starter-rw-p5q2", 2, "Who is holding the cat? a ...", "girl", { visual: { src: image("rw-p5-classroom-2.jpg"), alt: "A girl holding a cat in the classroom", maxWidth: 420 } }),
        textQuestion("starter-rw-p5q3", 3, "What is the teacher doing now?", "writing", { visual: { src: image("rw-p5-classroom-2.jpg"), alt: "Teacher writing in the classroom", maxWidth: 420 } }),
        textQuestion("starter-rw-p5q4", 4, "Where is the cat now? at the ...", "window", { visual: { src: image("rw-p5-classroom-3.jpg"), alt: "The cat at the classroom window", maxWidth: 420 } }),
        textQuestion("starter-rw-p5q5", 5, "How many children are looking at the cat?", "two", { visual: { src: image("rw-p5-classroom-3.jpg"), alt: "Children looking at the cat", maxWidth: 420 } }),
      ],
    },
  ],
};
