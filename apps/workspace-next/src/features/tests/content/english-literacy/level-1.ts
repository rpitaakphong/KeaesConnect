import { choice, single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const assetBase = "/test-assets/english-literacy/level-1";
const image = (name: string) => `${assetBase}/${name}`;

export const englishLiteracy1: TestDefinition = {
  id: "english-literacy-1",
  title: "English Literacy Level 1",
  subject: "English",
  level: "English Literacy 1",
  status: "active",
  totalPoints: 30,
  sections: [
    {
      id: "partA",
      label: "Part A",
      title: "Which word rhymes with the word on the left?",
      hint: "Choose one answer for each word.",
      questions: [
        single("el1", 1, "Boat", ["bat", "coat", "bet"], "coat"),
        single("el1", 2, "Glad", ["sad", "happy", "cat"], "sad"),
        single("el1", 3, "Cage", ["car", "page", "cake"], "page"),
        single("el1", 4, "Wish", ["list", "wash", "fish"], "fish"),
        single("el1", 5, "Play", ["bay", "baby", "pal"], "bay"),
      ],
    },
    {
      id: "part2",
      label: "Part 2",
      title: "Name each picture using words with consonant blends.",
      hint: "Type the name of each picture.",
      questions: [
        text("el1", 6, "Name the picture for question 6.", ["truck"], "truck", { image: image("q6-truck-color.png"), alt: "Truck" }),
        text("el1", 7, "Name the picture for question 7.", ["crab"], "crab", { image: image("q7-crab-color.png"), alt: "Crab" }),
        text("el1", 8, "Name the picture for question 8.", ["flag"], "flag", { image: image("q8-flag-color.png"), alt: "Flag" }),
        text("el1", 9, "Name the picture for question 9.", ["glue"], "glue", { image: image("q9-glue-color.png"), alt: "Glue" }),
        text("el1", 10, "Name the picture for question 10.", ["oven"], "oven", { image: image("q10-oven-color.png"), alt: "Oven" }),
        text("el1", 11, "Name the picture for question 11.", ["clock"], "clock", { image: image("q11-clock-color.png"), alt: "Clock" }),
        text("el1", 12, "Name the picture for question 12.", ["crown"], "crown", { image: image("q12-crown-color.png"), alt: "Crown" }),
        text("el1", 13, "Name the picture for question 13.", ["broom"], "broom", { image: image("q13-broom-color.png"), alt: "Broom" }),
        text("el1", 14, "Name the picture for question 14.", ["frog"], "frog", { image: image("q14-frog-color.png"), alt: "Frog" }),
        text("el1", 15, "Name the picture for question 15.", ["spoon"], "spoon", { image: image("q15-spoon-color.png"), alt: "Spoon" }),
      ],
    },
    {
      id: "part3",
      label: "Part 3",
      title: "Cross the odd one out.",
      hint: "Choose the picture that does not belong.",
      questions: [
        single("el1", 16, "Choose the odd one out: star, cloud, car.", [
          choice("star", "Star", image("q16-star-color.png")),
          choice("cloud", "Cloud", image("q16-cloud-color.png")),
          choice("car", "Car", image("q16-car-color.png")),
        ], "cloud", "cloud"),
        single("el1", 17, "Choose the odd one out: coin, toys, boy.", [
          choice("coin", "Coin", image("q17-coin-color.png")),
          choice("toys", "Toys", image("q17-toys-color.png")),
          choice("boy", "Boy", image("q17-boy-color.png")),
        ], "coin", "coin"),
        single("el1", 18, "Choose the odd one out: glass, grass, boat.", [
          choice("glass", "Glass", image("q18-glass-color.png")),
          choice("grass", "Grass", image("q18-grass-color.png")),
          choice("boat", "Boat", image("q18-boat-color.png")),
        ], "boat", "boat"),
        single("el1", 19, "Choose the odd one out: mouse, house, dog.", [
          choice("mouse", "Mouse", image("q19-mouse-color.png")),
          choice("house", "House", image("q19-house-color.png")),
          choice("dog", "Dog", image("q19-dog-color.png")),
        ], "dog", "dog"),
        single("el1", 20, "Choose the odd one out: honey, bee, money.", [
          choice("honey", "Honey", image("q20-honey-color.png")),
          choice("bee", "Bee", image("q20-bee-color.png")),
          choice("money", "Money", image("q20-money-color.png")),
        ], "bee", "bee"),
      ],
    },
    {
      id: "part4",
      label: "Part 4",
      title: "Write the missing letters in each word.",
      hint: "Type only the missing letters.",
      questions: [
        text("el1", 21, "sup __ market", ["er"], "er", { placeholder: "Missing letters" }),
        text("el1", 22, "__ agonfly", ["dr"], "dr", { placeholder: "Missing letters" }),
        text("el1", 23, "rainb __", ["ow"], "ow", { placeholder: "Missing letters" }),
        text("el1", 24, "bestfr __ nd", ["ie"], "ie", { placeholder: "Missing letters" }),
        text("el1", 25, "bedr __ m", ["oo"], "oo", { placeholder: "Missing letters" }),
      ],
    },
    {
      id: "part5",
      label: "Part 5",
      title: "Read the story and write true or false.",
      hint: "Choose true or false for each sentence.",
      story: [
        "It's Arbor Day, and Marla and Tio are planting a tree in their backyard. Their parents are watching TV in the living room and they don't know what the children are doing. Marla and Tio learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.",
      ],
      questions: [
        single("el1", 26, "It is New Year's Day.", ["true", "false"], "false"),
        single("el1", 27, "Marla and Tio are playing in the park.", ["true", "false"], "false"),
        single("el1", 28, "Their parents are watching TV.", ["true", "false"], "true"),
        single("el1", 29, "The children are planting flowers.", ["true", "false"], "false"),
        single("el1", 30, "Their teachers said trees provide home for birds.", ["true", "false"], "true"),
      ],
    },
  ],
};
