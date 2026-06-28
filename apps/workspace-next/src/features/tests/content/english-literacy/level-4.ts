import { aiText, single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const story = [
  "Dolphins are very intelligent and they seem to be well loved by humans. This aquatic mammal has been able to fascinate us in a variety of ways. They are curious, form strong bonds within their pod, and they have been known to help humans in a variety of circumstances including rescues and with fishing.",
  "There are 36 different species of dolphins that have been recognized. 32 of them are marine dolphins which are those that we are the most aware of and 4 of them are river dolphins. It can be very interesting to look at each of these species uniquely versus dolphins as a whole.",
  "They are very entertaining due to the leaps that they make out of the water. Some of them leap up to 30 feet in the air as they do so. They have to come to the surface at different intervals to get air. This can be from 20 seconds to 30 minutes between when they get air. The body of the dolphin is grayish blue and the skin is very sensitive to human touch and to other elements that could be in the water.",
  "The future is at risk for the various species of dolphins though due to habitat destruction, problems finding food, pollutants in the water, and even injuries or death due to getting tangled up in fishing nets or hitting boats in the water. There are conservation efforts in place out there to help protect them so that they can have a very good future. The average lifespan for a dolphin in the wild is 17 years. However, some have been documented to live to the age of 50!",
];

export const englishLiteracy4: TestDefinition = {
  id: "english-literacy-4",
  title: "English Literacy Level 4",
  subject: "English",
  level: "English Literacy 4",
  status: "active",
  totalPoints: 30,
  aiShortAnswerRubrics: {
    "el4-q26": "Correct if the answer says 32 species are marine dolphins.",
    "el4-q27": "Correct if the answer says the dolphin's body is grayish blue.",
    "el4-q28": "Correct if the answer says dolphins can leap up to 30 feet in the air.",
    "el4-q29": "Correct if the answer says the average lifespan in the wild is 17 years.",
    "el4-q30": "Correct if the answer says dolphins are at risk due to habitat destruction, problems finding food, pollutants, fishing nets, boats, injuries, or death.",
  },
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the homophone that completes each sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        single("el4", 1, "When Sami pulled the bird's (tail / tale), it flapped its wings.", ["tail", "tale"], "tail"),
        single("el4", 2, "Please (right / write) down the following information.", ["right", "write"], "write"),
        single("el4", 3, "The (whole / hole) family will be attending the reunion.", ["whole", "hole"], "whole"),
        single("el4", 4, "We must try our best to (caste / cast) away all our prejudices.", ["caste", "cast"], "cast"),
        single("el4", 5, "The time is half (passed / past) ten.", ["passed", "past"], "past"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Choose the best word from the box.",
      hint: "Type the word that best completes each sentence.",
      wordBank: ["pleasant", "scent", "present", "spread", "trouble", "wrap"],
      questions: [
        text("el4", 6, "She can ___ the gift nicely.", ["wrap"], "wrap", { placeholder: "Word from the box" }),
        text("el4", 7, "The little girl has a ___ attitude.", ["pleasant"], "pleasant", { placeholder: "Word from the box" }),
        text("el4", 8, "He will give me a ___ on my birthday.", ["present"], "present", { placeholder: "Word from the box" }),
        text("el4", 9, "I love to ___ butter on my bread.", ["spread"], "spread", { placeholder: "Word from the box" }),
        text("el4", 10, "This perfume has a good ___.", ["scent"], "scent", { placeholder: "Word from the box" }),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Identify fact or opinion.",
      hint: "Choose fact or opinion.",
      questions: [
        single("el4", 11, "Spring is the most beautiful season of all.", ["fact", "opinion"], "opinion"),
        single("el4", 12, "Your birthday comes only one day a year.", ["fact", "opinion"], "fact"),
        single("el4", 13, "April is a month with 30 days.", ["fact", "opinion"], "fact"),
        single("el4", 14, "Some families eat turkey on Thanksgiving.", ["fact", "opinion"], "fact"),
        single("el4", 15, "Everyone should make Valentine's Day cards.", ["fact", "opinion"], "opinion"),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Complete each sentence with past simple or past continuous.",
      hint: "Use / between two answers when a sentence has two blanks.",
      questions: [
        text("el4", 16, "We ___ the research together last time. (do)", ["did"], "did", { placeholder: "Verb form" }),
        text("el4", 17, "When he ___ from work, his wife ___. (come back / sleep)", ["came back / was sleeping", "came back was sleeping"], "came back / was sleeping", { placeholder: "answer / answer" }),
        text("el4", 18, "Andrew ___ his last weekend with his parents on the farm. (spend)", ["spent"], "spent", { placeholder: "Verb form" }),
        text("el4", 19, "Tom ___ the fence in the garden when his friend ___. (paint / drop by)", ["was painting / dropped by", "was painting dropped by"], "was painting / dropped by", { placeholder: "answer / answer" }),
        text("el4", 20, "My mother ___ a lot of sweets when she ___ in the supermarket. (buy / be)", ["bought / was", "bought was"], "bought / was", { placeholder: "answer / answer" }),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Read the passage and answer the questions.",
      hint: "Choose true or false, then answer the short questions.",
      storyTitle: "Dolphins",
      story,
      storyImage: { src: "/test-assets/english-literacy/level-4/dolphin.png", alt: "Dolphin" },
      questions: [
        single("el4", 21, "Dolphins are aquatic mammals.", ["true", "false"], "true"),
        single("el4", 22, "There are 30 different species of dolphins that have been recognized.", ["true", "false"], "false"),
        single("el4", 23, "Dolphins are intelligent and curious.", ["true", "false"], "true"),
        single("el4", 24, "Four species of dolphins live in the river.", ["true", "false"], "true"),
        single("el4", 25, "The skin of the dolphin is not sensitive to human touch.", ["true", "false"], "false"),
        aiText("el4", 26, "How many species of dolphins are marine dolphins?", "32 species of dolphins are marine dolphins.", ["32", "marine"]),
        aiText("el4", 27, "What is the color of the dolphin's body?", "The dolphin's body is grayish blue.", ["grayish blue", "greyish blue", "blue"]),
        aiText("el4", 28, "How high can a dolphin leap in the air?", "A dolphin can leap up to 30 feet in the air.", ["30", "feet"]),
        aiText("el4", 29, "What is the average life span for a dolphin in the wild?", "The average lifespan is 17 years.", ["17", "years"]),
        aiText("el4", 30, "Why are the dolphins at risk?", "Dolphins are at risk because of habitat destruction, food problems, pollutants, fishing nets, boats, injuries, or death.", ["habitat", "food", "pollut", "fishing", "nets", "boats", "injur", "death"]),
      ],
    },
  ],
};
