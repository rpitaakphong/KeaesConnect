import { aiText, choice, single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const story = [
  "In the freezing ocean waters of Antarctica, the planet's largest seals make their home in a frozen world. These giants are southern elephant seals, and they can grow as long as the length of a car and weigh as much as two cars combined. The name \"elephant seal\" comes from both the males' enormous size and from their giant trunk-like nose, called a proboscis. Females do not have a proboscis and they are much smaller.",
  "A thick layer of blubber keeps southern elephant seals warm in their icy habitat. The seals are clumsy on land, but in water they're graceful swimmers and incredible divers. They can easily dive 1,000 to 4,000 feet to hunt for squid, octopus, and various kinds of fish. Elephant seals are able to stay underwater for 20 minutes or more. The longest underwater session researchers observed is an amazing two hours! When they return to the surface to breathe, it's only for a few minutes. Then they dive again.",
  "While elephant seals spend most of their time swimming, they also gather on beaches in groups called colonies. One reason they come to land is to give birth and breed. Males arrive before females. They battle for dominance, deciding who will have large harems of females. Raising their enormous bodies, the males inflate their snouts and bellow. Usually these confrontations end quickly. However, sometimes only a physical battle can settle the matter. These fights can be bloody, but permanent injury is rare.",
  "Females arriving on land give birth to a single pup they've been carrying since the previous year. Newborns weigh about 90 pounds. The mother nurses her pup for a little over three weeks. After this, she breeds with a dominant male and then returns to the sea to feed. Her pup now weighs well over 200 pounds and is on its own. If it survives, it too will enter the sea within a couple of months.",
  "A second reason elephant seals come to land is to molt. When they molt, they shed old skin and fur and new skin and fur grows. A smaller species, the northern elephant seal, lives in the Pacific Ocean, dispersed from Baja, California to Alaska. Both northern and southern elephant seals were once hunted nearly to extinction. However, under legal protections both have made incredible comebacks.",
];

export const englishLiteracy5: TestDefinition = {
  id: "english-literacy-5",
  title: "English Literacy Level 5",
  subject: "English",
  level: "English Literacy 5",
  status: "active",
  totalPoints: 30,
  aiShortAnswerRubrics: {
    "el5-q26": "Correct if the answer says elephant seals are clumsy or have difficulty moving on land, but move easily, gracefully, or swim well in water.",
    "el5-q27": "Correct if the answer says males arrive first to battle or fight for dominance and decide which males will have large harems of females.",
    "el5-q28": "Correct if the answer gives two reasons elephant seals come on land: to give birth/breed and to molt.",
    "el5-q29": "Correct if the answer says elephant seals obtain food by diving or hunting underwater, and eat squid, octopus, and fish.",
    "el5-q30": "Correct if the answer says elephant seals are not currently in danger of extinction because legal protections or laws helped their populations recover.",
  },
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Choose the word that is spelled correctly.",
      hint: "Choose one correctly spelled word for each item.",
      questions: [
        single("el5", 1, "Choose the correctly spelled word.", ["experiment", "experement", "iksperement", "expirement"], "experiment"),
        single("el5", 2, "Choose the correctly spelled word.", ["sphaggetti", "spaghetti", "sphagheti", "spagethie"], "spaghetti"),
        single("el5", 3, "Choose the correctly spelled word.", ["beleve", "bileive", "believe", "belive"], "believe"),
        single("el5", 4, "Choose the correctly spelled word.", ["business", "buseness", "businesse", "bussiness"], "business"),
        single("el5", 5, "Choose the correctly spelled word.", ["article", "artecle", "arteckle", "artickel"], "article"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Choose the appropriate word.",
      hint: "Choose the word that completes each sentence.",
      questions: [
        single("el5", 6, "My best friend is very (thoughtfully / thoughtful).", ["thoughtfully", "thoughtful"], "thoughtful"),
        single("el5", 7, "This problem is very (complication / complicated).", ["complication", "complicated"], "complicated"),
        single("el5", 8, "The reporter said the news (briefly / brief).", ["briefly", "brief"], "briefly"),
        single("el5", 9, "Julie is a (talentful / talented) girl.", ["talentful", "talented"], "talented"),
        single("el5", 10, "Ballet dancers move (graceful / gracefully).", ["graceful", "gracefully"], "gracefully"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Identify active or passive voice.",
      hint: "Choose active or passive.",
      questions: [
        single("el5", 11, "My wallet was lost in the bus station.", [choice("a", "active"), choice("p", "passive")], "p", "passive"),
        single("el5", 12, "Sara writes a biography of a famous actress.", [choice("a", "active"), choice("p", "passive")], "a", "active"),
        single("el5", 13, "The mechanic fixed the broken engine.", [choice("a", "active"), choice("p", "passive")], "a", "active"),
        single("el5", 14, "This shop is owned by my father.", [choice("a", "active"), choice("p", "passive")], "p", "passive"),
        single("el5", 15, "The baby spilled the milk on the floor.", [choice("a", "active"), choice("p", "passive")], "a", "active"),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Choose the word that does not belong.",
      hint: "Choose the odd word in each group.",
      questions: [
        single("el5", 16, "Choose the word that does not belong: beauty, character, attitude, manner.", ["beauty", "character", "attitude", "manner"], "beauty"),
        single("el5", 17, "Choose the word that does not belong: produce, remove, create, invent.", ["produce", "remove", "create", "invent"], "remove"),
        single("el5", 18, "Choose the word that does not belong: fresh, new, different, current.", ["fresh", "new", "different", "current"], "different"),
        single("el5", 19, "Choose the word that does not belong: true, real, fake, genuine.", ["true", "real", "fake", "genuine"], "fake"),
        single("el5", 20, "Choose the word that does not belong: strange, ordinary, normal, common.", ["strange", "ordinary", "normal", "common"], "strange"),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Write the correct form of the adjective.",
      hint: "Type the comparative or superlative form.",
      questions: [
        text("el5", 21, "Spending your free time reading is far ___ than spending it watching TV. (good)", ["better"], "better", { placeholder: "Adjective form" }),
        text("el5", 22, "February is the ___ month in Chicago. (cold)", ["coldest"], "coldest", { placeholder: "Adjective form" }),
        text("el5", 23, "My friend is ___ than yours. (fabulous)", ["more fabulous"], "more fabulous", { placeholder: "Adjective form" }),
        text("el5", 24, "Gulliver's Travels is the ___ book that I've ever read. (interesting)", ["most interesting"], "most interesting", { placeholder: "Adjective form" }),
        text("el5", 25, "You are the ___ person I know. (kind)", ["kindest"], "kindest", { placeholder: "Adjective form" }),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Read the passage and answer the questions.",
      hint: "Write short answers. These answers are graded by AI when you submit.",
      storyTitle: "World's Largest Seal",
      story,
      storyImage: { src: "/test-assets/english-literacy/level-5/elephant-seal.png", alt: "Elephant seal" },
      questions: [
        aiText("el5", 26, "Describe how an elephant seal's movements are different on land than in the water.", "On land, an elephant seal is clumsy and has difficulty moving; in water, it moves easily and gracefully.", ["clumsy", "land", "water", "graceful", "swim"]),
        aiText("el5", 27, "Why do male elephant seals arrive on land before females during the breeding season?", "Males arrive first to fight for dominance and decide which males will have large harems of females.", ["male", "dominance", "fight", "harem", "female"]),
        aiText("el5", 28, "Describe two reasons why elephant seals come on land.", "Elephant seals come on land to breed and give birth, and to molt.", ["birth", "breed", "molt"]),
        aiText("el5", 29, "How does an elephant seal obtain its food? What foods are part of its diet?", "An elephant seal obtains food by diving to hunt. It eats squid, octopus, and fish.", ["dive", "hunt", "squid", "octopus", "fish"]),
        aiText("el5", 30, "Are elephant seals in danger of becoming extinct today? Why or why not?", "Elephant seals are not in danger of becoming extinct today because laws protect their populations.", ["not", "legal", "protect", "law", "comeback", "recover"]),
      ],
    },
  ],
};
