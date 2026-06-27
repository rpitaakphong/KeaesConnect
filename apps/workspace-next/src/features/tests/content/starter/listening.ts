import type { TestDefinition, TestQuestion } from "@/features/tests/lib/types";

const assetBase = "/test-assets/starter-listening";
const image = (name: string) => `${assetBase}/${name}`;

function textPart(id: string, accepted: string[], points = 1) {
  return { id, accepted, points };
}

function imageChoice(questionNumber: number, correct: string, prompt: string): TestQuestion {
  return {
    id: `starter-listening-p3q${questionNumber}`,
    number: questionNumber,
    prompt,
    points: 1,
    type: "singleChoice",
    choices: ["a", "b", "c"].map((choice) => ({
      value: choice,
      label: choice.toUpperCase(),
      image: image(`part3-q${questionNumber}-${choice}.png`),
      alt: `Part 3 question ${questionNumber} choice ${choice.toUpperCase()}`,
    })),
    grading: {
      mode: "auto",
      display: correct.toUpperCase(),
      parts: [{ id: "answer", accepted: [correct], points: 1 }],
    },
  };
}

export const starterProgressListening: TestDefinition = {
  id: "starter-progress-listening",
  title: "Starter Progress Listening",
  subject: "English",
  level: "Cambridge Starters",
  totalPoints: 20,
  status: "active",
  audioSrc: image("starter-progress-listening.mp3"),
  audioMode: "lockedOnceStarted",
  sections: [
    {
      id: "part1",
      label: "Listening Part 1",
      title: "Listen and draw lines.",
      hint: "Choose an object, then choose where it belongs in the room. The radio has been done for you.",
      questions: [
        {
          id: "starter-listening-part1",
          number: 1,
          prompt: "Put each object in the correct place in the room.",
          points: 5,
          type: "multiText",
          fields: [
            { id: "clock", label: "Clock" },
            { id: "book", label: "Book" },
            { id: "phone", label: "Phone" },
            { id: "camera", label: "Camera" },
            { id: "shell", label: "Shell" },
          ],
          grading: {
            mode: "auto",
            display: "clock: between the two pictures; book: under the small table; phone: mat; camera: cupboard; shell: table next to the robot",
            parts: [
              textPart("clock", ["between-pictures"]),
              textPart("book", ["under-table"]),
              textPart("phone", ["rug"]),
              textPart("camera", ["cupboard"]),
              textPart("shell", ["robot"]),
            ],
          },
        },
      ],
    },
    {
      id: "part2",
      label: "Listening Part 2",
      title: "Listen and write.",
      hint: "Write a name or a number for each answer.",
      questions: [
        {
          id: "starter-listening-part2",
          number: 2,
          prompt: "Listen and write the answers.",
          points: 5,
          type: "multiText",
          visuals: [{ type: "image", src: image("part2-illustration.png"), alt: "Children and a birthday cake", maxWidth: 560 }],
          fields: [
            { id: "p2q1", label: "1" },
            { id: "p2q2", label: "2" },
            { id: "p2q3", label: "3" },
            { id: "p2q4", label: "4" },
            { id: "p2q5", label: "5" },
          ],
          compact: true,
          grading: {
            mode: "auto",
            display: "1 Alex; 2 eight; 3 three; 4 socks; 5 twelve",
            parts: [
              textPart("p2q1", ["Alex"]),
              textPart("p2q2", ["8", "eight", "class 8", "class eight"]),
              textPart("p2q3", ["3", "three"]),
              textPart("p2q4", ["Socks"]),
              textPart("p2q5", ["12", "twelve"]),
            ],
          },
        },
      ],
    },
    {
      id: "part3",
      label: "Listening Part 3",
      title: "Listen and choose.",
      hint: "Choose A, B, or C for each question.",
      questions: [
        imageChoice(1, "a", "Which is May?"),
        imageChoice(2, "b", "Which is Nick's favourite ice-cream?"),
        imageChoice(3, "b", "What is Ben doing?"),
        imageChoice(4, "c", "Where is Kim's doll?"),
        imageChoice(5, "a", "What is Dad doing?"),
      ],
    },
    {
      id: "part4",
      label: "Listening Part 4",
      title: "Listen and colour.",
      hint: "Choose a colour, then tap the part of the picture to colour it. The duck has been done for you.",
      questions: [
        {
          id: "starter-listening-part4",
          number: 4,
          prompt: "Colour the picture.",
          points: 5,
          type: "multiText",
          fields: [
            { id: "man-bird", label: "bird on the man's head" },
            { id: "tree-bird", label: "bird in the tree" },
            { id: "flying-bird", label: "flying bird" },
            { id: "standing-bird", label: "bird near the house" },
            { id: "flower-bird", label: "bird between the flowers" },
          ],
          grading: {
            mode: "auto",
            display: "bird on man's head: pink; bird in tree: yellow; flying bird: green; bird near house: brown; bird between flowers: red",
            parts: [
              textPart("man-bird", ["#f472b6"]),
              textPart("tree-bird", ["#facc15"]),
              textPart("flying-bird", ["#22c55e"]),
              textPart("standing-bird", ["#8b5a2b"]),
              textPart("flower-bird", ["#ef4444"]),
            ],
          },
        },
      ],
    },
  ],
};
