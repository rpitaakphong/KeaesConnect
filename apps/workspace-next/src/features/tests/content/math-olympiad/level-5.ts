import { field, imageHtml, mathQ, mathTest } from "@/features/tests/content/math-olympiad/helpers";

const assetBase = "/test-assets/math-olympiad/level-5";
const img = (file: string, alt: string, className = "") => imageHtml(`${assetBase}/${file}`, alt, className);

export const mathOlympiad5 = mathTest("math-olympiad-5", "Math Olympiad Level 5", "Math Olympiad 5", [
  {
    id: "part1",
    label: "Part I",
    title: "Large numbers, operations, division, and area",
    hint: "Write exact answers.",
    questions: [
      mathQ("mo5", 1, 2, "Write the following in words.", [
        field("a", "3 002 000", 1, ["three million two thousand"]),
        field("b", "4 018 000", 1, ["four million eighteen thousand"]),
      ]),
      mathQ("mo5", 2, 3, "Calculate the following.", [
        field("a", "92 - 33 - 29", 0.5, ["30"]),
        field("b", "77 + 23 - 51", 0.5, ["49"]),
        field("c", "27 + 45 / 9 - 10", 0.5, ["22"]),
        field("d", "88 - 22 / 2 x 3", 0.5, ["55"]),
        field("e", "(91 + 17) / 9", 0.5, ["12"]),
        field("f", "7 x (32 - 27)", 0.5, ["35"]),
      ], { compact: true }),
      mathQ("mo5", 3, 2, "Divide the following.", [
        field("a", "900 / 300", 0.67, ["3"]),
        field("b", "1500 / 500", 0.67, ["3"]),
        field("c", "49 000 / 700", 0.66, ["70"]),
      ], { compact: true }),
      mathQ("mo5", 4, 1, "Mr Siva bought 132 packets of balloons from a shop. There were 9 balloons in each packet. How many balloons did he buy altogether?", [
        field("answer", "Balloons altogether", 1, ["1188"]),
      ], { visualHtml: balloonPacketsVisual() }),
      mathQ("mo5", 5, 2, "The diagram shows a rectangle. Find the perimeter and area.", [
        field("a", "Perimeter", 1, ["3 1/4 cm", "3.25 cm", "13/4 cm", "3 1/4", "3.25", "13/4"]),
        field("b", "Area", 1, ["21/32 cm2", "21/32 cm²", "21/32"]),
      ], { visualHtml: img("m5_q5.png", "Rectangle measuring seven eighths centimetre by three quarters centimetre", "booklet-diagram-compact") }),
    ],
  },
  {
    id: "part2",
    label: "Part II",
    title: "Ratio, time, angles, and decimals",
    hint: "Use units where appropriate.",
    questions: [
      mathQ("mo5", 6, 2, "Find the shaded area of the rectangle.", [
        field("answer", "Shaded area", 2, ["120 cm2", "120 cm²", "120"]),
      ], { visualHtml: img("m5_q6.png", "Rectangle with shaded area and dimensions 15 cm, 30 cm, and 7 cm", "booklet-diagram-tall") }),
      mathQ("mo5", 7, 1, "Fill in the blanks.", [
        field("a", "15 : 4 = ___ : 20", 0.5, ["75"]),
        field("b", "3 : 10 = ___ : 40", 0.5, ["12"]),
      ], { compact: true }),
      mathQ("mo5", 8, 2, "Hakim can write 25 cards in 150 min. How long will he take to write 27 cards?", [
        field("answer", "Time in minutes", 2, ["162", "162 min"]),
      ]),
      mathQ("mo5", 9, 2, "Find the unknown marked angles.", [
        field("a", "Angle a", 1, ["22", "22°"]),
        field("b", "Angle b", 1, ["125", "125°"]),
      ], { visualHtml: img("m5_q9.png", "Two angle diagrams for angle a and angle b", "booklet-diagram-q9") }),
      mathQ("mo5", 10, 3, "Divide the following.", [
        field("a", "90.8 / 20", 0.75, ["4.54"]),
        field("b", "29.1 / 100", 0.75, ["0.291"]),
        field("c", "462 / 300", 0.75, ["1.54"]),
        field("d", "3800 / 2000", 0.75, ["1.9"]),
      ], { compact: true }),
    ],
  },
  {
    id: "part3",
    label: "Part III",
    title: "Percentages, volume, and geometry",
    hint: "Write each answer in the requested unit.",
    questions: [
      mathQ("mo5", 11, 2, "There are 75 animals at a pet show. 18 are dogs, 36 are cats and the rest are rabbits.", [
        field("a", "Percentage of animals that are cats", 1, ["48%", "48"]),
        field("b", "Percentage of animals that are rabbits", 1, ["28%", "28"]),
      ]),
      mathQ("mo5", 12, 2, "Jean has 2 bottles of 1.5 l milk to be divided equally into 6 cups. What is the volume in each cup? Express your answer in ml.", [
        field("answer", "Volume in each cup", 2, ["500 ml", "500ml", "500"]),
      ], { visualHtml: milkVisual() }),
      mathQ("mo5", 13, 2, "The figure is not drawn to scale. Find angle a and angle b.", [
        field("a", "Angle a", 1, ["35", "35°"]),
        field("b", "Angle b", 1, ["40", "40°"]),
      ], { visualHtml: img("m5_q13.png", "Triangle diagram with angles a and b", "booklet-diagram-tall") }),
      mathQ("mo5", 14, 2, "The trapezium is not drawn to scale. Find the unknown marked angle.", [
        field("b", "Angle b", 2, ["120", "120°"]),
      ], { visualHtml: img("m5_q14.png", "Trapezium angle diagram with angle b", "booklet-diagram-q14") }),
      mathQ("mo5", 15, 2, "Find the height of the cuboid. Volume = 672 cm3, length = 12 cm, width = 8 cm.", [
        field("answer", "Height", 2, ["7", "7 cm"]),
      ], { visualHtml: img("m5_q15.png", "Cuboid with dimensions 12 cm, 8 cm, height, and volume 672 cubic centimetres", "booklet-diagram-wide") }),
    ],
  },
]);

function balloonPacketsVisual() {
  return `<svg class="diagram-svg balloon-packets-visual" viewBox="0 0 600 200" role="img" aria-label="Packets of balloons"><rect width="600" height="200" fill="#fff"/><g>${Array.from({ length: 6 }, (_, i) => `<rect x="${90 + i * 70}" y="55" width="48" height="60" rx="8" fill="#ffd6a5" stroke="#213b4d" stroke-width="3"/><circle cx="${114 + i * 70}" cy="40" r="20" fill="#f7b6d2" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="300" y="165" font-size="15" font-weight="900" text-anchor="middle">132 packets x 9 balloons</text></svg>`;
}

function milkVisual() {
  return `<svg class="diagram-svg" viewBox="0 0 620 210" role="img" aria-label="Milk bottles divided into cups"><rect width="620" height="210" fill="#fff"/><g>${[120, 200].map((x) => `<path d="M${x} 35h46v120h-46z" fill="#fff" stroke="#213b4d" stroke-width="3"/><path d="M${x + 8} 65h30v83h-30z" fill="#d7eef6"/>`).join("")}${Array.from({ length: 6 }, (_, i) => `<path d="M${330 + (i % 3) * 60} ${50 + Math.floor(i / 3) * 62}h40l-5 44h-30z" fill="#fff" stroke="#213b4d" stroke-width="3"/>`).join("")}</g><text x="160" y="185" font-size="15" font-weight="900" text-anchor="middle">2 x 1.5 l</text><text x="405" y="185" font-size="15" font-weight="900">6 cups</text></svg>`;
}
