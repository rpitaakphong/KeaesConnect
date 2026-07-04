import { single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const story = [
  "Every day after school and on Saturdays too Tanya is supposed to practice her piano lessons for an hour. Her piano teacher and her parents all tell her that she needs to practice in order to become good at playing the piano.",
  "Tanya doesn't much like playing scales over and over again. Her feet dangle from the high piano bench. Sometimes she spends time just kicking her feet back and forth instead of playing the piano. She daydreams about being at the playground with her friends or reading a good story.",
  "A voice from far away calls out to remind her she is supposed to practice until supper is ready.",
  "One evening Grandma comes to eat supper with the family. Grandma asks Tanya how the piano lessons are coming.",
  "Tanya replies, \"I get tired of practicing.\" Grandma says, \"Let's go shopping on Saturday.\" On Saturday they go to the music store and look at all kinds of instruments. \"What instrument do you like the best?\" asks Grandma.",
  "\"I think the drums are neat! Drums are part of the marching band,\" answers Tanya. Now Tanya loves to practice the drums every day. Sometimes Mom calls out, \"Tanya, you've practiced enough for today. You can play outside until supper.\"",
];

export const summerEnglishLevel1Pretest: TestDefinition = {
  id: "summer-english-level-1-pretest",
  title: "Summer English Level 1 Pre-test",
  subject: "English",
  level: "Summer English Level 1",
  status: "draft",
  durationMinutes: 40,
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Circle the word that does not belong to the group.",
      hint: "Choose one answer for each group.",
      questions: [
        single("sel1", 1, "little, tiny, huge, small", ["little", "tiny", "huge", "small"], "huge"),
        single("sel1", 2, "steady, fast, rapid, quick", ["steady", "fast", "rapid", "quick"], "steady"),
        single("sel1", 3, "jolly, joyful, glad, unhappy", ["jolly", "joyful", "glad", "unhappy"], "unhappy"),
        single("sel1", 4, "freezing, snowy, warm, chilly", ["freezing", "snowy", "warm", "chilly"], "warm"),
        single("sel1", 5, "noisy, quiet, deafening, loud", ["noisy", "quiet", "deafening", "loud"], "quiet"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Circle the word that comes first in alphabetical order.",
      hint: "Choose one answer for each row.",
      questions: [
        single("sel1", 6, "numbers, teach, loud, grand", ["numbers", "teach", "loud", "grand"], "grand"),
        single("sel1", 7, "seen, bright, sight, truth", ["seen", "bright", "sight", "truth"], "bright"),
        single("sel1", 8, "mot, light, stick, clap", ["mot", "light", "stick", "clap"], "clap"),
        single("sel1", 9, "rule, rope, rake, ruler", ["rule", "rope", "rake", "ruler"], "rake"),
        single("sel1", 10, "speak, spark, spam, spear", ["speak", "spark", "spam", "spear"], "spam"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Arrange the sentences to make a meaningful paragraph.",
      hint: "Type the order number, 1-5, for each sentence.",
      questions: [
        text("sel1", 11, "Mike was invited to Lee's birthday celebration.", ["1"], "1", { inputMode: "number" }),
        text("sel1", 12, "Lee's dad took Mike home.", ["5"], "5", { inputMode: "number" }),
        text("sel1", 13, "Mike came to Lee's house at 10.30 am.", ["2"], "2", { inputMode: "number" }),
        text("sel1", 14, "He ate a lot of cake and three hotdogs.", ["3"], "3", { inputMode: "number" }),
        text("sel1", 15, "After eating too much, he felt sick.", ["4"], "4", { inputMode: "number" }),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Match the word to its meaning.",
      hint: "Choose the matching meaning.",
      questions: [
        single("sel1", 16, "Fetch", ["a little pool of water", "to get something and bring it back", "to use water to get soap off", "wet dirt", "to pull"], "to get something and bring it back", "b"),
        single("sel1", 17, "Mud", ["a little pool of water", "to get something and bring it back", "to use water to get soap off", "wet dirt", "to pull"], "wet dirt", "d"),
        single("sel1", 18, "Puddle", ["a little pool of water", "to get something and bring it back", "to use water to get soap off", "wet dirt", "to pull"], "a little pool of water", "a"),
        single("sel1", 19, "Drag", ["a little pool of water", "to get something and bring it back", "to use water to get soap off", "wet dirt", "to pull"], "to pull", "e"),
        single("sel1", 20, "Rinse", ["a little pool of water", "to get something and bring it back", "to use water to get soap off", "wet dirt", "to pull"], "to use water to get soap off", "c"),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Choose the correct word to complete the sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        single("sel1", 21, "My mother has a long (hare, hair).", ["hare", "hair"], "hair"),
        single("sel1", 22, "I can (write, right) my name in French.", ["write", "right"], "write"),
        single("sel1", 23, "(Wear, Where) do you live?", ["Wear", "Where"], "Where"),
        single("sel1", 24, "I've got a (pear, pair), an apple and an orange.", ["pear", "pair"], "pear"),
        single("sel1", 25, "Sheila ate a (peace, piece) of cake.", ["peace", "piece"], "piece"),
      ],
    },
    {
      id: "part6",
      label: "Part VI",
      title: "Read the story and answer the questions.",
      hint: "Choose one answer for each question.",
      storyTitle: "Practice Time!",
      story,
      questions: [
        single("sel1", 26, "How long was Tanya supposed to practice the piano?", ["1/2 hour", "3/4 hour", "1 hour"], "1 hour", "c"),
        single("sel1", 27, "Instead of practicing, sometimes Tanya...", ["played with her friends", "read a story", "daydreamed"], "daydreamed", "c"),
        single("sel1", 28, "Who reminded Tanya she must practice until supper is ready?", ["Mom", "Dad", "Grandma"], "Mom", "a"),
        single("sel1", 29, "Who took Tanya to the music store?", ["Mom", "Dad", "Grandma"], "Grandma", "c"),
        single("sel1", 30, "Why does Tanya like the drums?", ["Drums are part of the marching band", "Drums are easier to play than the piano", "Drums are louder than the piano"], "Drums are part of the marching band", "a"),
      ],
    },
  ],
};
