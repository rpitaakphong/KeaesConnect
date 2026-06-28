import { field, imageHtml, mathQ, mathTest } from "@/features/tests/content/math-olympiad/helpers";

const assetBase = "/test-assets/math-olympiad/level-6";
const img = (file: string, alt: string, className = "") => imageHtml(`${assetBase}/${file}`, alt, className);

export const mathOlympiad6 = mathTest("math-olympiad-6", "Math Olympiad Level 6", "Math Olympiad 6", [
  {
    id: "part1",
    label: "Part I",
    title: "Algebra, angles, and solids",
    hint: "Write exact answers.",
    questions: [
      mathQ("mo6", 1, 2, "Simplify the following expressions.", [
        field("a", "2d + 7d", 0.34, ["9d"]),
        field("b", "10m - 7m", 0.34, ["3m"]),
        field("c", "10n + n - 4n", 0.33, ["7n"]),
        field("d", "9p - 3p + 2p", 0.33, ["8p"]),
        field("e", "5k - 4k - 1 + 3", 0.33, ["k + 2", "k+2"]),
        field("f", "4g + g + 7 + 2", 0.33, ["5g + 9", "5g+9"]),
      ], { compact: true }),
      mathQ("mo6", 2, 2, "Find the values of the following expressions when n = 3.", [
        field("a", "(n - 1) / 2", 0.5, ["1"]),
        field("b", "(11 - n) / 4", 0.5, ["2"]),
        field("c", "3n / 9 + 2", 0.5, ["3"]),
        field("d", "4n / 3 + 9", 0.5, ["13"]),
      ], { compact: true }),
      mathQ("mo6", 3, 2, "ABCG is a rhombus. ACDE is a rectangle and CGE is a diagonal of the rectangle. Find angle ABC.", [
        field("answer", "angle ABC", 2, ["72", "72°"]),
      ], { visualHtml: img("m6_q3.png", "Rhombus ABCG and rectangle ACDE angle diagram", "booklet-diagram-q3") }),
      mathQ("mo6", 4, 2, "ABCD is a trapezium in which AD // BC and EC = ED. Find angle EDC.", [
        field("answer", "angle EDC", 2, ["43", "43°"]),
      ], { visualHtml: img("m6_q4.png", "Trapezium ABCD with angle and equal-side markings", "booklet-diagram-q4") }),
      mathQ("mo6", 5, 2, "How many faces and edges are there in the solid below?", [
        field("faces", "Faces", 1, ["6"]),
        field("edges", "Edges", 1, ["12"]),
      ], { visualHtml: img("m6_q5.png", "Cuboid solid for counting faces and edges", "booklet-diagram-q5") }),
    ],
  },
  {
    id: "part2",
    label: "Part II",
    title: "Nets, fractions, ratio, and percentage",
    hint: "Use units where appropriate.",
    questions: [
      mathQ("mo6", 6, 2, "Identify the solid that can be formed from the net shown below, then find the surface area of the solid.", [
        field("a", "Solid", 1, ["triangular prism"]),
        field("b", "Surface area", 1, ["104", "104 cm2", "104 cm²"]),
      ], { visualHtml: img("m6_q6.png", "Net of a triangular prism with dimensions 6 cm, 5 cm, and 4 cm", "booklet-diagram-medium") }),
      mathQ("mo6", 7, 2, "The table shows the length of 3 pieces of ribbon. Ribbon A is 2 3/4 cm, Ribbon B is 9 5/12 cm, and Ribbon C is 10 3/4 cm. Express answers as fractions in their simplest form.", [
        field("a", "Total length of Ribbon A and Ribbon B", 1, ["12 1/6 cm", "12 1/6", "73/6 cm", "73/6"]),
        field("b", "Total length of the 3 pieces of ribbon", 1, ["22 11/12 cm", "22 11/12", "275/12 cm", "275/12"]),
      ]),
      mathQ("mo6", 8, 2, "The figure below shows a rectangular carpet. Find the perimeter of the carpet as a fraction in cm.", [
        field("answer", "Perimeter", 2, ["136 4/15 cm", "136 4/15", "2044/15 cm", "2044/15"]),
      ], { visualHtml: img("m6_q8.png", "Rectangular carpet measuring 45 1/3 cm by 22 4/5 cm", "booklet-diagram-q8") }),
      mathQ("mo6", 9, 2, "Fill in the blanks.", [
        field("a", "10 : 17 = 30 : ___", 1, ["51"]),
        field("b1", "5 : 12 : 8 = ___ : 60 : ___, first blank", 0.5, ["25"]),
        field("b2", "5 : 12 : 8 = ___ : 60 : ___, second blank", 0.5, ["40"]),
      ], { compact: true }),
      mathQ("mo6", 10, 2, "Aminah bought a dress for $18. The usual price of the dress was $20. What was the percentage discount Aminah received?", [
        field("answer", "Percentage discount", 2, ["10%", "10"]),
      ]),
    ],
  },
  {
    id: "part3",
    label: "Part III",
    title: "Speed, area, graphs, volume, and average",
    hint: "Write each answer in the requested unit.",
    questions: [
      mathQ("mo6", 11, 2, "The distance of PQ to the distance of QR was in the ratio 1 : 2. Jack took 2 h to cycle from P to Q. From Q to R, he increased his average speed by 5 km/h.", [
        field("a", "Time taken from Q to R", 1, ["12 h", "12"]),
        field("b", "Average speed from P to R", 1, ["15 km/h", "15 kmh", "15"]),
      ], { visualHtml: img("m6_q11.png", "Line segment from P to Q to R with PQ labelled 30 km", "booklet-diagram-q11") }),
      mathQ("mo6", 12, 2, "Find the area of the three-quarter circle. Take pi = 3.14. Give your answer correct to the nearest whole number.", [
        field("answer", "Area", 2, ["191", "191 cm2", "191 cm²"]),
      ], { visualHtml: img("m6_q12.png", "Three-quarter circle with radius 9 cm", "booklet-diagram-q12") }),
      mathQ("mo6", 13, 2, "The bar graph shows the number of pupils who visited the school library from Monday to Friday.", [
        field("a", "More pupils on Wednesday than on Monday", 0.5, ["50"]),
        field("b", "Percentage increase from Tuesday to Thursday", 0.5, ["66.67%", "66.67", "66 2/3%", "66 2/3"]),
        field("c", "Average daily number of pupils for the week", 0.5, ["190"]),
        field("d", "Books borrowed on Thursday", 0.5, ["1250"]),
      ], { visualHtml: img("m6_q13.png", "Bar graph showing library visitors from Monday to Friday", "booklet-diagram-q13") }),
      mathQ("mo6", 14, 2, "The figure shows a rectangular tank that was filled up to 1/3 of its height with 7.2 litres of oil. Find the height of the tank and how many more litres of oil are needed to fill the tank to its brim. 1 litre = 1000 cm3.", [
        field("a", "Height of the tank", 1, ["36 cm", "36"]),
        field("b", "More oil needed", 1, ["14.4 l", "14.4 litres", "14.4 liters", "14.4"]),
      ], { visualHtml: img("m6_q14.png", "Rectangular tank partly filled with oil, 30 cm by 20 cm", "booklet-diagram-q14") }),
      mathQ("mo6", 15, 2, "The average score of 3 tests that Jeffery took was 65 marks. He scored 85 marks for Mathematics. His English score was 12/17 of his Mathematics score. How many marks did Jeffery score for the last test?", [
        field("answer", "Last test score", 2, ["50"]),
      ]),
    ],
  },
]);
