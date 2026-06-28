import type { TestDefinition } from "@/features/tests/lib/types";

export const spipYear7MathPre: TestDefinition = {
  "id": "spip-year-7-math-pre",
  "title": "SPIP Year 7 Math Pre-test",
  "subject": "Math",
  "level": "SPIP Year 7",
  "totalPoints": 40,
  "status": "active",
  "sections": [
    {
      "id": "paper1a",
      "label": "Questions 1-6",
      "title": "Numbers and decimals",
      "hint": "Write each answer in the requested box.",
      "questions": [
        {
          "id": "spip-y7m-q1",
          "number": 1,
          "prompt": "Join pairs of decimals to make 1.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "p1",
              "label": "Pair 1",
              "placeholder": "0.62 + 0.38"
            },
            {
              "id": "p2",
              "label": "Pair 2",
              "placeholder": "0.25 + 0.75"
            },
            {
              "id": "p3",
              "label": "Pair 3",
              "placeholder": "0.19 + 0.81"
            },
            {
              "id": "p4",
              "label": "Pair 4",
              "placeholder": "0.56 + 0.44"
            }
          ],
          "compact": true,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q1-number-pairs.png",
              "alt": "Decimals arranged around lines to be paired",
              "maxWidth": 420
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "0.62+0.38; 0.25+0.75; 0.19+0.81; 0.56+0.44",
            "parts": [
              {
                "id": "p1",
                "accepted": [
                  "0.62 + 0.38",
                  "0.38 + 0.62",
                  "0.62,0.38",
                  "0.38,0.62"
                ],
                "points": 0.5
              },
              {
                "id": "p2",
                "accepted": [
                  "0.25 + 0.75",
                  "0.75 + 0.25",
                  "0.25,0.75",
                  "0.75,0.25"
                ],
                "points": 0.5
              },
              {
                "id": "p3",
                "accepted": [
                  "0.19 + 0.81",
                  "0.81 + 0.19",
                  "0.19,0.81",
                  "0.81,0.19"
                ],
                "points": 0.5
              },
              {
                "id": "p4",
                "accepted": [
                  "0.56 + 0.44",
                  "0.44 + 0.56",
                  "0.56,0.44",
                  "0.44,0.56"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q2",
          "number": 2,
          "prompt": "Translate triangle A by 4 squares up and 2 squares left.",
          "points": 1,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "notes",
              "label": "Answer / notes",
              "placeholder": "Describe or place the translated triangle."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Translated triangle, teacher reviewed",
            "parts": [
              {
                "id": "notes",
                "accepted": [],
                "points": 1,
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q3",
          "number": 3,
          "prompt": "Draw a ring around the largest number in each pair.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "r1",
              "label": "9810 or 9018",
              "placeholder": "answer"
            },
            {
              "id": "r2",
              "label": "Half a million or 84 291",
              "placeholder": "answer"
            },
            {
              "id": "r3",
              "label": "Fifteen thousand and seven or 15 060",
              "placeholder": "answer"
            },
            {
              "id": "r4",
              "label": "25 or -52",
              "placeholder": "answer"
            },
            {
              "id": "r5",
              "label": "-271 or -326",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "9810; half a million; 15 060; 25; -271",
            "parts": [
              {
                "id": "r1",
                "accepted": [
                  "9810"
                ],
                "points": 0.4
              },
              {
                "id": "r2",
                "accepted": [
                  "half a million",
                  "500000",
                  "500,000"
                ],
                "points": 0.4
              },
              {
                "id": "r3",
                "accepted": [
                  "15060",
                  "15 060",
                  "15,060"
                ],
                "points": 0.4
              },
              {
                "id": "r4",
                "accepted": [
                  "25"
                ],
                "points": 0.4
              },
              {
                "id": "r5",
                "accepted": [
                  "-271"
                ],
                "points": 0.4
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q4",
          "number": 4,
          "prompt": "Write in figures: three hundredths.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "0.03",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "0.03",
                  ".03",
                  "3/100"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q5",
          "number": 5,
          "prompt": "Calculate 6.8 + 17.38.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "24.18",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "24.18"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q6",
          "number": 6,
          "prompt": "Write 1085 thousandths as a decimal.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "1.085",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "1.085"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "paper1b",
      "label": "Questions 7-14",
      "title": "Measures, patterns, and fractions",
      "hint": "Some drawing questions are collected for teacher review.",
      "questions": [
        {
          "id": "spip-y7m-q7",
          "number": 7,
          "prompt": "The digital scale shows 16 500 g. Show this mass on the kg scale.",
          "points": 1,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Scale mark / notes",
              "placeholder": "Mark 16.5 kg or describe the arrow position."
            }
          ],
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q7-digital-scale.png",
              "alt": "Digital scale reading 16 500 g",
              "maxWidth": 300
            },
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q7-kg-scale.png",
              "alt": "Blank semicircular kilogram scale from 0 to 20",
              "maxWidth": 520
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "16.5 kg",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q8",
          "number": 8,
          "prompt": "The table shows the times for a race. Who was the third fastest runner and what was their time?",
          "points": 2,
          "note": "Source rows: Angelique / 15.23 | Gabriella / 14.05 | Aiko / 15.3 | Manjit / 14.5 | Blessy / 14.65",
          "type": "multiText",
          "fields": [
            {
              "id": "name",
              "label": "Runner",
              "placeholder": "answer"
            },
            {
              "id": "time",
              "label": "Time",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Manjit, 14.5 seconds",
            "parts": [
              {
                "id": "name",
                "accepted": [
                  "manjit"
                ],
                "points": 1
              },
              {
                "id": "time",
                "accepted": [
                  "14.5",
                  "14.50"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q9",
          "number": 9,
          "prompt": "Tick the two patterns that can be made with the stamp.",
          "points": 2,
          "note": "Teacher review item. Choices: A, B, C, D",
          "type": "multiText",
          "fields": [
            {
              "id": "selected",
              "label": "Selected patterns",
              "placeholder": "Choose the two options, e.g. A and C."
            }
          ],
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q9-stamp.png",
              "alt": "A stamp and the shape it makes",
              "maxWidth": 520
            },
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q9-patterns.png",
              "alt": "Four pattern options made from the stamp",
              "maxWidth": 760
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Two correct patterns, teacher verified",
            "parts": [
              {
                "id": "selected",
                "accepted": [],
                "points": 2,
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q10",
          "number": 10,
          "prompt": "In the number 485 136, what is the value of the 4?",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "400 000",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "400000",
                  "400,000",
                  "four hundred thousand"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q11",
          "number": 11,
          "prompt": "A train leaves at 08:00 and the journey takes 7 hours. Write the start and finish times.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "start",
              "label": "Start time",
              "placeholder": "answer"
            },
            {
              "id": "finish",
              "label": "Finish time",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "8 am; 3 pm",
            "parts": [
              {
                "id": "start",
                "accepted": [
                  "8 am",
                  "8am",
                  "08:00",
                  "8:00"
                ],
                "points": 1
              },
              {
                "id": "finish",
                "accepted": [
                  "3 pm",
                  "3pm",
                  "15:00",
                  "3:00 pm"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q12",
          "number": 12,
          "prompt": "Fill in the missing numbers.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "First box",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Second box",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "270; 5.5",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "270"
                ],
                "points": 0.5
              },
              {
                "id": "b",
                "accepted": [
                  "5.5",
                  "5 1/2",
                  "11/2"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q13",
          "number": 13,
          "prompt": "Write the missing digits in the boxes.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "1 7/10 box",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "2 1/4 numerator",
              "placeholder": "answer"
            },
            {
              "id": "c",
              "label": "17/5 whole-number box",
              "placeholder": "answer"
            },
            {
              "id": "d",
              "label": "3 1/2 numerator",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "1; 9; 3; 7",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "1"
                ],
                "points": 0.5
              },
              {
                "id": "b",
                "accepted": [
                  "9"
                ],
                "points": 0.5
              },
              {
                "id": "c",
                "accepted": [
                  "3"
                ],
                "points": 0.5
              },
              {
                "id": "d",
                "accepted": [
                  "7"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q14",
          "number": 14,
          "prompt": "Draw a line to match each statement to its likelihood.",
          "points": 2,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "matches",
              "label": "Matches",
              "placeholder": "Multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "multiple of 4 -> unlikely; 4 digits -> impossible; odd -> even chance",
            "parts": [
              {
                "id": "matches",
                "accepted": [],
                "points": 2,
                "reviewRecommended": true
              }
            ]
          }
        }
      ]
    },
    {
      "id": "paper1c",
      "label": "Questions 15-21",
      "title": "Calculations, data, time, and angles",
      "hint": "Use digits or units where useful.",
      "questions": [
        {
          "id": "spip-y7m-q15",
          "number": 15,
          "prompt": "Write the missing numbers.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "First box",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Second box",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "1500; 100",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "1500",
                  "1,500"
                ],
                "points": 1
              },
              {
                "id": "b",
                "accepted": [
                  "100"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q16",
          "number": 16,
          "prompt": "What is 25% of 56?",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "14",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "14"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q17",
          "number": 17,
          "prompt": "The sports club table shows pupils attending activities. Which pupils attended all three activities?",
          "points": 2,
          "note": "Choices: Ahmed, Carlos, Hassan, Mike, Rajiv, Youssef Table columns: Mon, Tues, Wed, Thurs",
          "type": "multiText",
          "fields": [
            {
              "id": "selected",
              "label": "Selected pupils",
              "placeholder": "Select all that apply"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Rajiv, Hassan, Youssef",
            "parts": [
              {
                "id": "selected",
                "accepted": [
                  "hassan,rajiv,youssef",
                  "hassan,youssef,rajiv",
                  "rajiv,hassan,youssef",
                  "rajiv,youssef,hassan",
                  "youssef,hassan,rajiv",
                  "youssef,rajiv,hassan"
                ],
                "points": 2
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q18",
          "number": 18,
          "prompt": "Write the time shown on the clock, then write the time 2 hours 15 minutes later.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "Clock time",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "2 h 15 min later",
              "placeholder": "answer"
            }
          ],
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q18-clock.png",
              "alt": "Clock showing 10:47",
              "maxWidth": 360
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "10:47; 13:02",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "10:47",
                  "10.47"
                ],
                "points": 1
              },
              {
                "id": "b",
                "accepted": [
                  "13:02",
                  "1:02 pm",
                  "1.02 pm"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q19",
          "number": 19,
          "prompt": "Write the missing numbers in the multiplication grid.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "4 x 0.3",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Missing column heading",
              "placeholder": "answer"
            },
            {
              "id": "c",
              "label": "4 x 0.6",
              "placeholder": "answer"
            },
            {
              "id": "d",
              "label": "7 x 0.4",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "1.2; 0.4; 2.4; 2.8",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "1.2"
                ],
                "points": 0.5
              },
              {
                "id": "b",
                "accepted": [
                  "0.4"
                ],
                "points": 0.5
              },
              {
                "id": "c",
                "accepted": [
                  "2.4"
                ],
                "points": 0.5
              },
              {
                "id": "d",
                "accepted": [
                  "2.8"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q20",
          "number": 20,
          "prompt": "Write the missing numbers in the sequence.",
          "points": 2,
          "note": "Values: {a}, 180, 105, 30, {b}",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "First number",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Last number",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "255; -45",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "255"
                ],
                "points": 1
              },
              {
                "id": "b",
                "accepted": [
                  "-45"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q21",
          "number": 21,
          "prompt": "Find the missing angles.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "Smallest angle inside the triangle",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Angle y",
              "placeholder": "answer"
            }
          ],
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q21a-right-triangle.png",
              "alt": "Right angled triangle",
              "maxWidth": 420
            },
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q21b-angle-y.png",
              "alt": "Angle y diagram",
              "maxWidth": 520
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "33; 158",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "33",
                  "32",
                  "34"
                ],
                "points": 1
              },
              {
                "id": "b",
                "accepted": [
                  "158",
                  "158 degrees"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "paper1d",
      "label": "Questions 22-30",
      "title": "Missing digits, reasoning, and shape",
      "hint": "Questions marked review collect an answer for teacher checking.",
      "questions": [
        {
          "id": "spip-y7m-q22",
          "number": 22,
          "prompt": "Write in the missing digits to make the calculation correct.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "top",
              "label": "Top missing digit",
              "placeholder": "answer"
            },
            {
              "id": "bottomLeft",
              "label": "Bottom left digit",
              "placeholder": "answer"
            },
            {
              "id": "bottomRight",
              "label": "Bottom right digit",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "3.58 + 2.05 = 5.63",
            "parts": [
              {
                "id": "top",
                "accepted": [
                  "5"
                ],
                "points": 0.34
              },
              {
                "id": "bottomLeft",
                "accepted": [
                  "2"
                ],
                "points": 0.33
              },
              {
                "id": "bottomRight",
                "accepted": [
                  "5"
                ],
                "points": 0.33
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q23",
          "number": 23,
          "prompt": "Write the missing number in each box.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "745.03 x 10",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "60319 / 100",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "7450.3; 603.19",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "7450.3",
                  "7,450.3"
                ],
                "points": 1
              },
              {
                "id": "b",
                "accepted": [
                  "603.19"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q24",
          "number": 24,
          "prompt": "Use 26 x 15 = 390 to show how to work out 26 x 14.",
          "points": 2,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer / working",
              "placeholder": "Explain that 26 x 14 = 390 - 26 = 364."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "390 - 26 = 364",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 2,
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q25",
          "number": 25,
          "prompt": "Put these values in order from smallest to largest: 0.65, 2/3, 0.57, 3/5.",
          "points": 1,
          "note": "Values: 0.65, 2/3, 0.57, 3/5",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "Smallest",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Second",
              "placeholder": "answer"
            },
            {
              "id": "c",
              "label": "Third",
              "placeholder": "answer"
            },
            {
              "id": "d",
              "label": "Largest",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "0.57, 3/5, 0.65, 2/3",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "0.57"
                ],
                "points": 0.25
              },
              {
                "id": "b",
                "accepted": [
                  "3/5",
                  "0.6"
                ],
                "points": 0.25
              },
              {
                "id": "c",
                "accepted": [
                  "0.65"
                ],
                "points": 0.25
              },
              {
                "id": "d",
                "accepted": [
                  "2/3",
                  "0.666",
                  "0.667"
                ],
                "points": 0.25
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q26",
          "number": 26,
          "prompt": "Write three numbers with a mode of 6 and a mean of 7.",
          "points": 2,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "a",
              "label": "First number",
              "placeholder": "answer"
            },
            {
              "id": "b",
              "label": "Second number",
              "placeholder": "answer"
            },
            {
              "id": "c",
              "label": "Third number",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "6, 6, 9",
            "parts": [
              {
                "id": "a",
                "accepted": [
                  "6"
                ],
                "points": 0.67
              },
              {
                "id": "b",
                "accepted": [
                  "6"
                ],
                "points": 0.67
              },
              {
                "id": "c",
                "accepted": [
                  "9"
                ],
                "points": 0.66
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q27",
          "number": 27,
          "prompt": "Yuri says that 6/8 is larger than 3/4. Is Yuri correct? Use a calculation to explain.",
          "points": 2,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer / calculation",
              "placeholder": "No. 6/8 = 3/4."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "No, because 6/8 = 3/4",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 2,
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q28",
          "number": 28,
          "prompt": "Finn counts in steps of 0.3 starting at 1. What is the 10th number he says?",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-math-pre/spip-y7m-q28-counting-steps.png",
              "alt": "Finn saying 1, 1.3, 1.6 and so on",
              "maxWidth": 420
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "3.7",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "3.7"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q29",
          "number": 29,
          "prompt": "Write 8/5 as a mixed number.",
          "points": 1,
          "note": "",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Answer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "1 3/5",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "1 3/5",
                  "1.6",
                  "8/5"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7m-q30",
          "number": 30,
          "prompt": "Reflect the shaded shape in the mirror line.",
          "points": 2,
          "note": "Teacher review item.",
          "type": "multiText",
          "fields": [
            {
              "id": "cells",
              "label": "Placed reflection cells",
              "placeholder": "Click cells to build the reflected shape."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Correct reflected shape, teacher reviewed",
            "parts": [
              {
                "id": "cells",
                "accepted": [],
                "points": 2,
                "reviewRecommended": true
              }
            ]
          }
        }
      ]
    }
  ]
};
