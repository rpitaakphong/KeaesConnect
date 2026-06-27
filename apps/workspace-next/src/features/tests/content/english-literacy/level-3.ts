import { aiText, single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const story = [
  "In May, 1886, Coca Cola was invented by Doctor John Pemberton, a pharmacist from Atlanta, Georgia. John Pemberton concocted the Coca Cola formula in a three-legged brass kettle in his backyard. The name was a suggestion given by John Pemberton's bookkeeper Frank Robinson. Being a bookkeeper, Frank Robinson also had excellent penmanship. It was he who first scripted \"Coca Cola\" into the flowing letters which has become the famous logo of today.",
  "The soft drink was first sold to the public at the soda fountain in Jacob's Pharmacy in Atlanta on May 8, 1886. About nine servings of the soft drink were sold each day. Sales for that first year added up to a total of about $50. The funny thing was that it cost John Pemberton over $70 in expenses, so the first year of sales were a loss. Until 1905, the soft drink, marketed as a tonic, contained extracts of cocaine as well as the caffeine-rich kola nut.",
];

export const englishLiteracy3: TestDefinition = {
  id: "english-literacy-3",
  title: "English Literacy Level 3",
  subject: "English",
  level: "English Literacy 3",
  status: "active",
  totalPoints: 30,
  aiShortAnswerRubrics: {
    "el3-q26": "Correct if the answer identifies John Pemberton as the inventor.",
    "el3-q27": "Correct if the answer identifies Frank Robinson as the person who made the famous logo.",
    "el3-q28": "Correct if the answer says Coca Cola was first sold at the soda fountain in Jacob's Pharmacy, optionally in Atlanta.",
    "el3-q29": "Correct if the answer says May 8, 1886.",
    "el3-q30": "Correct if the answer says about $50.",
  },
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the word with a similar meaning.",
      hint: "Choose one answer for the underlined word in each sentence.",
      questions: [
        single("el3", 1, "I like this song. It makes me at ease.", ["courageous", "comfortable", "capable"], "comfortable"),
        single("el3", 2, "The ground is moist this morning.", ["wet", "warm", "weird"], "wet"),
        single("el3", 3, "The bullies at school irritate me.", ["envy", "agree", "annoy"], "annoy"),
        single("el3", 4, "The school is close to our house.", ["few", "gone", "near"], "near"),
        single("el3", 5, "We can predict the weather.", ["forget", "forecast", "form"], "forecast"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Identify the underlined word.",
      hint: "Choose adjective or adverb.",
      questions: [
        single("el3", 6, "Charlotte made a delicious salad.", ["adjective", "adverb"], "adjective"),
        single("el3", 7, "Amy speaks softly.", ["adjective", "adverb"], "adverb"),
        single("el3", 8, "The grumpy lady never smiles.", ["adjective", "adverb"], "adjective"),
        single("el3", 9, "Jessie narrated a funny story.", ["adjective", "adverb"], "adjective"),
        single("el3", 10, "Joe left the party happily.", ["adjective", "adverb"], "adverb"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Write the plural form of each noun.",
      hint: "Type the plural noun.",
      questions: [
        text("el3", 11, "Mouse", ["mice"], "mice", { placeholder: "Plural form" }),
        text("el3", 12, "House", ["houses"], "houses", { placeholder: "Plural form" }),
        text("el3", 13, "Fairy", ["fairies"], "fairies", { placeholder: "Plural form" }),
        text("el3", 14, "Shelf", ["shelves"], "shelves", { placeholder: "Plural form" }),
        text("el3", 15, "Sheep", ["sheep"], "sheep", { placeholder: "Plural form" }),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Choose the subject in each sentence.",
      hint: "Choose the phrase that is the subject.",
      questions: [
        single("el3", 16, "The boys are playing in the park.", ["the boys", "are playing", "the park"], "the boys", "the boys"),
        single("el3", 17, "Ravi is drinking juice.", ["Ravi", "is drinking", "juice"], "Ravi", "Ravi"),
        single("el3", 18, "The Eiffel Tower is amazing.", ["the Eiffel Tower", "is", "amazing"], "the Eiffel Tower", "the Eiffel Tower"),
        single("el3", 19, "He is a clever but lazy boy.", ["he", "clever", "lazy boy"], "he"),
        single("el3", 20, "The parrot was sitting on the branch of the tree.", ["the parrot", "the branch", "the tree"], "the parrot", "the parrot"),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Read the story and answer the questions.",
      hint: "Choose true or false, then answer the short questions.",
      storyTitle: "Coca Cola",
      story,
      storyImage: { src: "/test-assets/english-literacy/level-3/cola-bottle.png", alt: "Coca Cola bottle" },
      questions: [
        single("el3", 21, "Coca Cola was invented in June, 1886.", ["true", "false"], "false"),
        single("el3", 22, "Dr. John Pemberton is a pharmacist.", ["true", "false"], "true"),
        single("el3", 23, "Dr. Pemberton used a four-legged brass kettle to make the soft drink.", ["true", "false"], "false"),
        single("el3", 24, "Frank Robinson is a librarian.", ["true", "false"], "false"),
        single("el3", 25, "Mr. Robinson has bad penmanship.", ["true", "false"], "false"),
        aiText("el3", 26, "Who invented Coca Cola?", "John Pemberton", ["john pemberton", "doctor john pemberton"]),
        aiText("el3", 27, "Who made the famous logo of Coca Cola?", "Frank Robinson", ["frank robinson"]),
        aiText("el3", 28, "Where was Coca Cola first sold to the public?", "at the soda fountain in Jacob's Pharmacy in Atlanta", ["soda fountain", "jacob", "pharmacy", "atlanta"]),
        aiText("el3", 29, "When was Coca Cola first sold to the public?", "May 8, 1886", ["may 8", "1886"]),
        aiText("el3", 30, "How much was the sales for the first year of Coca Cola?", "about $50", ["50", "$50"]),
      ],
    },
  ],
};
