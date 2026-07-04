import { single, text } from "@/features/tests/content/english-literacy/helpers";
import type { TestDefinition } from "@/features/tests/lib/types";

const tetrisStory = [
  "Do you like video games? Lots of people do. There are many types of video games. Some people like action games. Other people like driving games. But the most popular game of all time is a puzzle game.",
  "Tetris is a game about making lines. Blocks fall from the top of the screen. They fall one at a time. The player moves the blocks. Once the blocks hit the bottom, they are locked in place. Players try to make lines go across the screen with no gaps. Complete lines disappear. This gives players more room. The blocks pile up during the game. The game ends when the blocks get to the top of the screen.",
  "A man named Alexey made Tetris in 1984. All the pieces in Tetris have four blocks. The word \"tetra\" means four. Alexey named his game after tetra and tennis. He made Tetris while working at a science academy in Moscow. Moscow is in Russia.",
  "Alexey made his game on a screen that only showed letters. He could not use blocks. The blocks were made out of letters in the first game of Tetris. Still, all Alexey's friends loved his game. It was easy to learn and fun to play.",
  "Soon the game spread across the world. It was on every computer. It was in arcades. It came with every one of Nintendo's Game Boy. More than 100 million Game Boys were sold. Tetris was all over the place. Even today Tetris comes with many phones.",
  "Dr. Richard Haier has studied Tetris players. He ran many tests. He found that playing Tetris boosts mental activity. Dr. Haier thinks Tetris is good for the brain. I agree with this finding.",
];

export const summerEnglishLevel3Pretest: TestDefinition = {
  id: "summer-english-level-3-pretest",
  title: "Summer English Level 3 Pre-test",
  subject: "English",
  level: "Summer English Level 3",
  status: "draft",
  durationMinutes: 40,
  totalPoints: 30,
  sections: [
    {
      id: "part1",
      label: "Part I",
      title: "Use a prefix or suffix to make a new word.",
      hint: "Type the newly formed word.",
      questions: [
        text("sel3", 1, "I can't answer this question. It is ___ (possible).", ["impossible"], "impossible"),
        text("sel3", 2, "Our science ___ is very young. (teach)", ["teacher"], "teacher"),
        text("sel3", 3, "Paul never waits in the queues. He is too ___ (patient).", ["impatient"], "impatient"),
        text("sel3", 4, "That was a great film. It was really ___ (enjoy).", ["enjoyable"], "enjoyable"),
        text("sel3", 5, "If you have a haircut, it will change your ___ (appear).", ["appearance"], "appearance"),
        text("sel3", 6, "When you ___ this paragraph, make it shorter. (write)", ["rewrite"], "rewrite"),
        text("sel3", 7, "I like this town. The people are very ___ (friend).", ["friendly"], "friendly"),
        text("sel3", 8, "Kate started crying because she was so ___ (happy).", ["unhappy"], "unhappy"),
      ],
    },
    {
      id: "part2",
      label: "Part II",
      title: "Choose the correct meaning of the word.",
      hint: "Choose one answer for each question.",
      questions: [
        single("sel3", 9, "The word suffice means...", ["enough", "too small", "attractive", "uncomfortable"], "enough", "a"),
        single("sel3", 10, "Something that is collapsible is...", ["easy to close", "side by side", "able to be broken down or folded up", "something that works together with something else"], "able to be broken down or folded up", "c"),
        single("sel3", 11, "What do you do if you make ends meet?", ["tie the ends of the rope together", "make a perfect circle with a drawing tool", "get back to the place you started", "have just enough money to get by"], "have just enough money to get by", "d"),
        single("sel3", 12, "A place that is dank is...", ["soft and cozy", "warm and dry", "clean and fresh", "damp and chilly"], "damp and chilly", "d"),
        single("sel3", 13, "The word vigor means...", ["hunger and thirst", "anxiety and worry", "energy and strength", "greed and selfishness"], "energy and strength", "c"),
        single("sel3", 14, "If you are summoned to the office, that means you are...", ["given detention", "asked questions", "called to appear", "sent a telegram"], "called to appear", "c"),
        single("sel3", 15, "The word gratitude means...", ["large", "justice", "a gift of money", "appreciation"], "appreciation", "d"),
      ],
    },
    {
      id: "part3",
      label: "Part III",
      title: "Write F for fact or O for opinion.",
      hint: "Choose fact or opinion.",
      questions: [
        single("sel3", 16, "The United States is the greatest country in the world.", ["F", "O"], "O", "O"),
        single("sel3", 17, "The Mariana Trench is the deepest place in the ocean.", ["F", "O"], "F", "F"),
        single("sel3", 18, "Carnivores are meat eaters.", ["F", "O"], "F", "F"),
        single("sel3", 19, "All dinosaurs are extinct.", ["F", "O"], "F", "F"),
        single("sel3", 20, "Basketball is more interesting than football.", ["F", "O"], "O", "O"),
      ],
    },
    {
      id: "part4",
      label: "Part IV",
      title: "Circle the correct verb in each sentence.",
      hint: "Choose one answer for each sentence.",
      questions: [
        single("sel3", 21, "All of the dogs in the neighborhood (were, was) barking.", ["were", "was"], "were"),
        single("sel3", 22, "My friends and my mother (like, likes) each other.", ["like", "likes"], "like"),
        single("sel3", 23, "Fifty dollars (is, are) a lot to pay for a dinner.", ["is", "are"], "is"),
        single("sel3", 24, "Six people (live, lives) in a small house.", ["live", "lives"], "live"),
        single("sel3", 25, "Mathematics (is, are) a very difficult subject.", ["is", "are"], "is"),
      ],
    },
    {
      id: "part5",
      label: "Part V",
      title: "Read the passage and answer the questions.",
      hint: "Choose one answer for each question.",
      storyTitle: "Tetris",
      story: tetrisStory,
      questions: [
        single("sel3", 26, "What is the goal of Tetris?", ["To make tall piles of blocks", "To match the colors of blocks", "To make complete lines", "To get blocks to the top of the screen"], "To make complete lines", "c"),
        single("sel3", 27, "After which is Tetris named?", ["Fish", "The number ten", "Paris", "Tennis"], "Tennis", "d"),
        single("sel3", 28, "Which event happened first?", ["Tetris was played with letters instead of blocks", "Tetris was released on the phone", "Tetris was released in the arcade", "Tetris was brought to the Game Boy"], "Tetris was played with letters instead of blocks", "a"),
        single("sel3", 29, "What is the main idea of the second paragraph?", ["To persuade readers to play Tetris", "To explain how Tetris is played", "To describe different types of games", "To compare Tetris to other puzzle games"], "To explain how Tetris is played", "b"),
        single("sel3", 30, "According to Dr. Richard Haier, which is true about Tetris?", ["Tetris lowers blood pressure", "Tetris increases physical strength", "Tetris boosts mental activity", "Tetris has no positive side effects"], "Tetris boosts mental activity", "c"),
      ],
    },
  ],
};
