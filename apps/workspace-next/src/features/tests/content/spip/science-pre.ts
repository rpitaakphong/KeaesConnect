import type { TestDefinition } from "@/features/tests/lib/types";

export const spipYear7SciencePre: TestDefinition = {
  "id": "spip-year-7-science-pre",
  "title": "SPIP Year 7 Science Pre-test",
  "subject": "Science",
  "level": "SPIP Year 7",
  "totalPoints": 50,
  "status": "active",
  "sections": [
    {
      "id": "part1",
      "label": "Questions 1-4",
      "title": "Electricity, organs, and solubility",
      "hint": "Answer each part of the question.",
      "questions": [
        {
          "id": "spip-y7s-q1",
          "number": 1,
          "prompt": "Some materials are electrical conductors and others are electrical insulators. Complete the table about these materials.",
          "points": 3,
          "note": "Use: electrical conductor / electrical insulator.",
          "type": "multiText",
          "fields": [
            {
              "id": "copper",
              "label": "copper",
              "placeholder": "answer"
            },
            {
              "id": "graphite",
              "label": "graphite",
              "placeholder": "answer"
            },
            {
              "id": "plastic",
              "label": "plastic",
              "placeholder": "answer"
            },
            {
              "id": "rubber",
              "label": "rubber",
              "placeholder": "answer"
            },
            {
              "id": "wood",
              "label": "wood",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "copper: conductor; graphite: conductor; plastic, rubber, wood: insulator",
            "parts": [
              {
                "id": "copper",
                "accepted": [
                  "conductor"
                ],
                "points": 0.6
              },
              {
                "id": "graphite",
                "accepted": [
                  "conductor"
                ],
                "points": 0.6
              },
              {
                "id": "plastic",
                "accepted": [
                  "insulator"
                ],
                "points": 0.6
              },
              {
                "id": "rubber",
                "accepted": [
                  "insulator"
                ],
                "points": 0.6
              },
              {
                "id": "wood",
                "accepted": [
                  "insulator"
                ],
                "points": 0.6
              }
            ],
            "scoreThresholds": [
              {
                "minCorrect": 5,
                "points": 3
              },
              {
                "minCorrect": 3,
                "points": 2
              },
              {
                "minCorrect": 1,
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q2",
          "number": 2,
          "prompt": "Label the organs on the diagram of a human body.",
          "points": 3,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q2-organs-v3.png",
              "alt": "Human body organs to label",
              "maxWidth": 420
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "brain",
              "label": "Top left label",
              "placeholder": "organ name"
            },
            {
              "id": "heart",
              "label": "Middle left label",
              "placeholder": "organ name"
            },
            {
              "id": "kidney",
              "label": "Lower left label",
              "placeholder": "organ name"
            },
            {
              "id": "lungs",
              "label": "Upper right label",
              "placeholder": "organ name"
            },
            {
              "id": "stomach",
              "label": "Middle right label",
              "placeholder": "organ name"
            },
            {
              "id": "intestines",
              "label": "Lower right label",
              "placeholder": "organ name"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "brain; heart; lung; stomach; kidney; small intestine",
            "parts": [
              {
                "id": "brain",
                "accepted": [
                  "brain"
                ],
                "points": 0.5
              },
              {
                "id": "heart",
                "accepted": [
                  "heart"
                ],
                "points": 0.5
              },
              {
                "id": "kidney",
                "accepted": [
                  "kidney",
                  "kidneys"
                ],
                "points": 0.5
              },
              {
                "id": "lungs",
                "accepted": [
                  "lung",
                  "lungs"
                ],
                "points": 0.5
              },
              {
                "id": "stomach",
                "accepted": [
                  "stomach"
                ],
                "points": 0.5
              },
              {
                "id": "intestines",
                "accepted": [
                  "intestine",
                  "intestines",
                  "small intestine"
                ],
                "points": 0.5
              }
            ],
            "scoreThresholds": [
              {
                "minCorrect": 6,
                "points": 3
              },
              {
                "minCorrect": 4,
                "points": 2
              },
              {
                "minCorrect": 2,
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q3",
          "number": 3,
          "prompt": "Mike is exploring electrical circuits. The lamps are very dim. What can he do to make the lamps brighter?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q3-circuit.png",
              "alt": "Circuit with two dim lamps",
              "maxWidth": 364
            }
          ],
          "type": "singleChoice",
          "responseShape": "object",
          "choices": [
            {
              "value": "add another cell",
              "label": "add another cell"
            },
            {
              "value": "add another lamp",
              "label": "add another lamp"
            },
            {
              "value": "add a switch",
              "label": "add a switch"
            },
            {
              "value": "make the wire longer",
              "label": "make the wire longer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "add another cell",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "add another cell"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q4a",
          "number": 4,
          "prompt": "4(a). Blessy keeps the temperature of the water for each solid the same. Explain why.",
          "points": 1,
          "note": "Blessy has four different solids. She investigates how many grams of each solid she can dissolve in water. Here is what she does Data: sugar / 16 | fertiliser / 30 | salt / 8 | baking powder / 5.",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "So it is a fair test because temperature affects how much solid dissolves.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "fair",
                    "test"
                  ],
                  [
                    "temperature",
                    "affect",
                    "dissolv"
                  ],
                  [
                    "same",
                    "compare"
                  ],
                  [
                    "hotter",
                    "dissolv"
                  ],
                  [
                    "colder",
                    "dissolv"
                  ],
                  [
                    "different",
                    "amount"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q4b",
          "number": 4,
          "prompt": "4(b). Blessy thinks it is a good idea to repeat her investigation. Explain why.",
          "points": 1,
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Repeating makes the results more reliable and helps check for mistakes.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "reliable"
                  ],
                  [
                    "accurate"
                  ],
                  [
                    "check",
                    "mistake"
                  ],
                  [
                    "average"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q4c",
          "number": 4,
          "prompt": "4(c). Blessy has started to draw a bar chart of the results. Complete the bar chart. Include the scale on the y-axis, label on the y-axis, and the other three bars and their labels.",
          "points": 3,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q4c-bar-chart.png",
              "alt": "Incomplete bar chart for dissolved solids",
              "maxWidth": 620
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "scale_top",
              "label": "Scale number",
              "placeholder": "number"
            },
            {
              "id": "scale_middle",
              "label": "Scale number",
              "placeholder": "number"
            },
            {
              "id": "scale_bottom",
              "label": "Scale number",
              "placeholder": "number"
            },
            {
              "id": "solid_4",
              "label": "Name of solid",
              "placeholder": "name of solid"
            },
            {
              "id": "fertiliser",
              "label": "Bar height in g",
              "placeholder": "bar height"
            },
            {
              "id": "solid_5",
              "label": "Name of solid",
              "placeholder": "name of solid"
            },
            {
              "id": "salt",
              "label": "Bar height in g",
              "placeholder": "bar height"
            },
            {
              "id": "solid_6",
              "label": "Name of solid",
              "placeholder": "name of solid"
            },
            {
              "id": "baking_powder",
              "label": "Bar height in g",
              "placeholder": "bar height"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "y-axis: total mass of solid added in g; fertiliser 30 g; salt 8 g; baking powder 5 g",
            "parts": [
              {
                "id": "scale_top",
                "accepted": [
                  "30",
                  "30 g"
                ],
                "points": 0.25
              },
              {
                "id": "scale_middle",
                "accepted": [
                  "20",
                  "20 g"
                ],
                "points": 0.25
              },
              {
                "id": "scale_bottom",
                "accepted": [
                  "10",
                  "10 g"
                ],
                "points": 0.25
              },
              {
                "id": "solid_4",
                "accepted": [
                  "fertiliser",
                  "fertilizer"
                ],
                "points": 0.25
              },
              {
                "id": "fertiliser",
                "accepted": [
                  "30",
                  "30 g"
                ],
                "points": 0.5
              },
              {
                "id": "solid_5",
                "accepted": [
                  "salt"
                ],
                "points": 0.25
              },
              {
                "id": "salt",
                "accepted": [
                  "8",
                  "8 g"
                ],
                "points": 0.5
              },
              {
                "id": "solid_6",
                "accepted": [
                  "baking powder"
                ],
                "points": 0.25
              },
              {
                "id": "baking_powder",
                "accepted": [
                  "5",
                  "5 g"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q4d",
          "number": 4,
          "prompt": "4(d). Which solid is the most soluble in water?",
          "points": 1,
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Solid",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "fertiliser",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "fertiliser",
                  "fertilizer"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "part2",
      "label": "Questions 5-8",
      "title": "Food chains, separation, forces, and changes",
      "hint": "Use the diagrams where shown.",
      "questions": [
        {
          "id": "spip-y7s-q5a",
          "number": 5,
          "prompt": "5(a). Use the information to put the food chain in the correct order.",
          "points": 2,
          "note": "This question is about a food chain. Use these items: leaf | caterpillar | bird | snake | owl.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q5-food-chain.png",
              "alt": "Living things in a food chain",
              "maxWidth": 768
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "pos1",
              "label": "1",
              "placeholder": "answer"
            },
            {
              "id": "pos2",
              "label": "2",
              "placeholder": "answer"
            },
            {
              "id": "pos3",
              "label": "3",
              "placeholder": "answer"
            },
            {
              "id": "pos4",
              "label": "4",
              "placeholder": "answer"
            },
            {
              "id": "pos5",
              "label": "5",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "leaf -> caterpillar -> bird -> snake -> owl",
            "parts": [
              {
                "id": "pos1",
                "accepted": [
                  "leaf"
                ],
                "points": 0.4
              },
              {
                "id": "pos2",
                "accepted": [
                  "caterpillar"
                ],
                "points": 0.4
              },
              {
                "id": "pos3",
                "accepted": [
                  "bird"
                ],
                "points": 0.4
              },
              {
                "id": "pos4",
                "accepted": [
                  "snake"
                ],
                "points": 0.4
              },
              {
                "id": "pos5",
                "accepted": [
                  "owl"
                ],
                "points": 0.4
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q5b",
          "number": 5,
          "prompt": "5(b). Which living thing is the producer in this food chain?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q5-food-chain.png",
              "alt": "Living things in a food chain",
              "maxWidth": 768
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Producer",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "leaf",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "leaf",
                  "plant",
                  "the leaf",
                  "tree"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q6a",
          "number": 6,
          "prompt": "6(a). What dissolves in stage B?",
          "points": 1,
          "note": "Yuri wants to separate a mixture of salt, sand and water.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q6-separation.png",
              "alt": "Stages for separating salt, sand and water",
              "maxWidth": 686
            }
          ],
          "type": "singleChoice",
          "responseShape": "object",
          "choices": [
            {
              "value": "salt",
              "label": "salt"
            },
            {
              "value": "sand",
              "label": "sand"
            },
            {
              "value": "salt and sand",
              "label": "salt and sand"
            },
            {
              "value": "water",
              "label": "water"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "salt",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "salt"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q6b",
          "number": 6,
          "prompt": "6(b). What is substance X?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q6-separation.png",
              "alt": "Stages for separating salt, sand and water",
              "maxWidth": 686
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Substance X",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "salt",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "salt",
                  "wet salt"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q7a",
          "number": 7,
          "prompt": "7(a). Complete Lily's sentences. Choose from: centimetres, kilograms, newtons, seconds.",
          "points": 3,
          "note": "Lily is learning about mass and weight. Word bank: centimetres, kilograms, newtons, seconds.",
          "type": "multiText",
          "fields": [
            {
              "id": "mass",
              "label": "Mass is measured in",
              "placeholder": "answer"
            },
            {
              "id": "weight",
              "label": "Weight is measured in",
              "placeholder": "answer"
            },
            {
              "id": "force",
              "label": "Force is measured in",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "Mass: kilograms; Weight: newtons; Force: newtons",
            "parts": [
              {
                "id": "mass",
                "accepted": [
                  "kilograms",
                  "kg"
                ],
                "points": 1
              },
              {
                "id": "weight",
                "accepted": [
                  "newtons",
                  "newton"
                ],
                "points": 1
              },
              {
                "id": "force",
                "accepted": [
                  "newtons",
                  "newton"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q7b",
          "number": 7,
          "prompt": "7(b). Choose the arrow that shows the direction of the force of gravity on Lily.",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q7b-gravity.png",
              "alt": "Lily standing for gravity arrow",
              "maxWidth": 420
            }
          ],
          "type": "singleChoice",
          "responseShape": "object",
          "choices": [
            {
              "value": "up",
              "label": "up"
            },
            {
              "value": "down",
              "label": "down"
            },
            {
              "value": "left",
              "label": "left"
            },
            {
              "value": "right",
              "label": "right"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "down",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "down"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q8a",
          "number": 8,
          "prompt": "8(a). Only one solid can be separated from water by filtration. Which one?",
          "points": 1,
          "note": "Ahmed adds water to different solids. Data: A / white / forms a colourless solution | B / green / forms a green solution | C / white / forms a white cloudy mixture | D / grey / fizzes and forms a colourless solution | E / white / forms a colourless solution and gets colder | F / blue / forms a blue solution.",
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Solid",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "C"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q8b",
          "number": 8,
          "prompt": "8(b). There is a reversible change when solid A is added to water. Describe how you could reverse this change.",
          "points": 1,
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Description",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Heat it, evaporate the water, or leave it in the Sun to get the solid back.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "evaporat"
                  ],
                  [
                    "heat"
                  ],
                  [
                    "sun"
                  ],
                  [
                    "water",
                    "solid"
                  ],
                  [
                    "crystal"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q8c",
          "number": 8,
          "prompt": "8(c). Two of the solids have an irreversible change when added to water. Write the letter of one of these solids. Explain how you can tell from the results.",
          "points": 2,
          "type": "multiText",
          "fields": [
            {
              "id": "letter",
              "label": "Letter",
              "placeholder": "answer"
            },
            {
              "id": "explanation",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "D because it fizzes/forms gas, or E because the temperature changes/gets colder.",
            "parts": [
              {
                "id": "letter",
                "accepted": [
                  "D",
                  "E"
                ],
                "points": 1
              },
              {
                "id": "explanation",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "fizz"
                  ],
                  [
                    "gas"
                  ],
                  [
                    "bubble"
                  ],
                  [
                    "colder"
                  ],
                  [
                    "temperature",
                    "change"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        }
      ]
    },
    {
      "id": "part3",
      "label": "Questions 9-12",
      "title": "Body systems, energy, recycling, and dissolving",
      "hint": "Some explanation answers are keyword-scored and flagged for review.",
      "questions": [
        {
          "id": "spip-y7s-q9a",
          "number": 9,
          "prompt": "9(a). Mike must use the heart machine to stay alive. Explain what the heart machine does.",
          "points": 2,
          "note": "Mike has a heart that does not work. He uses a heart machine.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q9-heart-machine.png",
              "alt": "Mike with a heart machine and an extra heart machine",
              "maxWidth": 532
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Explanation",
              "placeholder": "Write your explanation."
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "It does the work of the heart: it pumps blood around the body, supplying oxygen and food/nutrients to organs.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "does",
                    "heart"
                  ],
                  [
                    "place",
                    "heart"
                  ],
                  [
                    "instead",
                    "heart"
                  ],
                  [
                    "takes",
                    "heart"
                  ],
                  [
                    "heart",
                    "normally"
                  ]
                ],
                "reviewRecommended": true
              },
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "pump",
                    "blood"
                  ],
                  [
                    "circulat",
                    "blood"
                  ]
                ],
                "reviewRecommended": true
              },
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "oxygen"
                  ]
                ],
                "reviewRecommended": true
              },
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "food"
                  ],
                  [
                    "nutrient"
                  ]
                ],
                "reviewRecommended": true
              },
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "organ"
                  ],
                  [
                    "around",
                    "body"
                  ],
                  [
                    "body"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q9b",
          "number": 9,
          "prompt": "9(b). Mike takes the extra heart machine with him when he goes outside. Explain why Mike needs an extra heart machine.",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q9-heart-machine.png",
              "alt": "Mike with a heart machine and an extra heart machine",
              "maxWidth": 532
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "In case the first heart machine or its batteries stop working or break.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "break"
                  ],
                  [
                    "stop",
                    "work"
                  ],
                  [
                    "fail"
                  ],
                  [
                    "backup"
                  ],
                  [
                    "spare"
                  ],
                  [
                    "battery"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q10",
          "number": 10,
          "prompt": "Draw a line from the statement to the correct explanation.",
          "points": 1,
          "note": "Match A rollercoaster is able to climb up the hill because ... to: there is no friction., its movement gives it the energy to get to the top of the hill., friction in the dip increases its movement., there is no air resistance in the dip..",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q10-rollercoaster.png",
              "alt": "Rollercoaster with dip and hill",
              "maxWidth": 630
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "climb",
              "label": "Explanation",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A rollercoaster is able to climb up the hill because its movement gives it the energy to get to the top of the hill.",
            "parts": [
              {
                "id": "climb",
                "accepted": [
                  "movement energy"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q11a",
          "number": 11,
          "prompt": "11(a). Glass, plastic and metal can be recycled. Write down the name of another material that can be recycled.",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q11-recycling.png",
              "alt": "Recycling bins for glass, plastic and metal",
              "maxWidth": 602
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Material",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "paper, card/cardboard, cloth, books, magazines, batteries, or ink cartridges",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "paper",
                  "cardboard",
                  "card",
                  "cloth",
                  "book",
                  "books",
                  "magazine",
                  "magazines",
                  "clothes",
                  "battery",
                  "batteries",
                  "ink cartridge",
                  "ink cartridges"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q11b",
          "number": 11,
          "prompt": "11(b). Complete the sentences about why the diaper cannot be recycled and how to reduce waste in the environment.",
          "points": 2,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q11b-diaper.png",
              "alt": "Baby wearing a diaper",
              "maxWidth": 602
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "cannot_recycle",
              "label": "This diaper cannot be recycled because",
              "placeholder": "Explain your answer."
            },
            {
              "id": "reduce_waste",
              "label": "To reduce waste this diaper can be",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "It is dirty, toxic, or contains microbes; use a washable/reusable diaper, or compost a biodegradable one.",
            "parts": [
              {
                "id": "cannot_recycle",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "dirty"
                  ],
                  [
                    "waste"
                  ],
                  [
                    "soiled"
                  ],
                  [
                    "toxic"
                  ],
                  [
                    "microbe"
                  ],
                  [
                    "mixed",
                    "material"
                  ],
                  [
                    "cannot",
                    "recycle"
                  ],
                  [
                    "used"
                  ]
                ],
                "reviewRecommended": true
              },
              {
                "id": "reduce_waste",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "reuse"
                  ],
                  [
                    "wash"
                  ],
                  [
                    "cloth"
                  ],
                  [
                    "reusable"
                  ],
                  [
                    "compost"
                  ],
                  [
                    "biodegrad"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q12a",
          "number": 12,
          "prompt": "12(a). Complete the sentences about sugar water. Choose from: insoluble, soluble, solution, sugar, water.",
          "points": 2,
          "note": "Sugar is added to water. The sugar dissolves in water. Word bank: insoluble, soluble, solution, sugar, water.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q12-sugar-water.png",
              "alt": "Sugar added to water makes sugar water",
              "maxWidth": 630
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "solvent",
              "label": "The solvent in sugar water is",
              "placeholder": "answer"
            },
            {
              "id": "solute",
              "label": "The solute in sugar water is",
              "placeholder": "answer"
            },
            {
              "id": "soluble",
              "label": "Sugar dissolves in water because it is",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "solvent: water; solute: sugar; sugar is soluble",
            "parts": [
              {
                "id": "solvent",
                "accepted": [
                  "water"
                ],
                "points": 0.67
              },
              {
                "id": "solute",
                "accepted": [
                  "sugar",
                  "soluble"
                ],
                "points": 0.67
              },
              {
                "id": "soluble",
                "accepted": [
                  "soluble"
                ],
                "points": 0.66
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q12b",
          "number": 12,
          "prompt": "12(b). When sugar dissolves in water, is the sugar still in the water?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q12-sugar-water.png",
              "alt": "Sugar added to water makes sugar water",
              "maxWidth": 630
            }
          ],
          "type": "singleChoice",
          "responseShape": "object",
          "choices": [
            {
              "value": "no",
              "label": "no"
            },
            {
              "value": "sometimes",
              "label": "sometimes"
            },
            {
              "value": "yes",
              "label": "yes"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "yes",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "yes"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "part4",
      "label": "Questions 13-16",
      "title": "Testing, water waste, forces, and filtration",
      "hint": "Complete the practical method and results carefully.",
      "questions": [
        {
          "id": "spip-y7s-q13a",
          "number": 13,
          "prompt": "13(a). Pierre is testing which materials are electrical conductors. Put each instruction letter in the correct order.",
          "points": 2,
          "note": "Pierre is testing which materials are electrical conductors. He builds this electrical circuit. Use these items: A Connect the circuit. | B Record the results and remove the material. | C Put the material into the test box. | D Collect a cell, lamp, test box and wires..",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q13-circuit-test.png",
              "alt": "Circuit with a test box",
              "maxWidth": 364
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "pos1",
              "label": "First instruction",
              "placeholder": "answer"
            },
            {
              "id": "pos2",
              "label": "Second instruction",
              "placeholder": "answer"
            },
            {
              "id": "pos3",
              "label": "Third instruction",
              "placeholder": "answer"
            },
            {
              "id": "pos4",
              "label": "Last instruction",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "D, A, C, B",
            "parts": [
              {
                "id": "pos1",
                "accepted": [
                  "D"
                ],
                "points": 0.5
              },
              {
                "id": "pos2",
                "accepted": [
                  "A"
                ],
                "points": 0.5
              },
              {
                "id": "pos3",
                "accepted": [
                  "C"
                ],
                "points": 0.5
              },
              {
                "id": "pos4",
                "accepted": [
                  "B"
                ],
                "points": 0.5
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q13b",
          "number": 13,
          "prompt": "13(b). Pierre thinks one of his results is incorrect. He wants to test this material again. Which material does he test again?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q13-circuit-test.png",
              "alt": "Circuit with a test box",
              "maxWidth": 364
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Material",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "steel",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "steel"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q13c",
          "number": 13,
          "prompt": "13(c). Pierre makes a conclusion from his results. What conclusion does Pierre make?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q13-circuit-test.png",
              "alt": "Circuit with a test box",
              "maxWidth": 364
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Conclusion",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "Metals conduct electricity and non-metals do not.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "metal",
                    "conduct"
                  ],
                  [
                    "non",
                    "metal",
                    "not"
                  ],
                  [
                    "plastic",
                    "stone",
                    "not"
                  ],
                  [
                    "iron",
                    "lead",
                    "copper"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q14a",
          "number": 14,
          "prompt": "14(a). Aiko measures the volume of water collected from each tap. Write down the name of the apparatus she uses.",
          "points": 1,
          "note": "Aiko investigates where water is wasted in her school. She looks at a tap with drips of water. Aiko collects drips of water from different taps for 2 minutes.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q14-dripping-tap.png",
              "alt": "Tap with drips of water",
              "maxWidth": 602
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Apparatus",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "measuring cylinder",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "measuring cylinder",
                  "measuring cylinders",
                  "graduated cylinder"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q14b",
          "number": 14,
          "prompt": "14(b). Aiko writes down the results. Complete her table of results.",
          "points": 2,
          "note": "Aiko's measurements are shown below.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q14-dripping-tap.png",
              "alt": "Tap with drips of water",
              "maxWidth": 602
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "tap1_volume",
              "label": "tap 1 volume",
              "placeholder": "answer"
            },
            {
              "id": "tap2_number",
              "label": "tap number",
              "placeholder": "answer"
            },
            {
              "id": "tap3_volume",
              "label": "tap 3 volume",
              "placeholder": "answer"
            },
            {
              "id": "tap4_number",
              "label": "tap number",
              "placeholder": "answer"
            },
            {
              "id": "tap4_volume",
              "label": "tap 4 volume",
              "placeholder": "answer"
            },
            {
              "id": "tap5_volume",
              "label": "tap 5 volume",
              "placeholder": "answer"
            }
          ],
          "compact": true,
          "grading": {
            "mode": "auto",
            "display": "tap 1: 0.0 cm3; tap 2: 1.8 cm3; tap 3: 2.9 cm3; tap 4: 3.8 cm3; tap 5: 3.3 cm3",
            "parts": [
              {
                "id": "tap1_volume",
                "accepted": [
                  "0.0",
                  "0",
                  "0.0 cm3",
                  "0 cm3"
                ],
                "points": 0.33
              },
              {
                "id": "tap2_number",
                "accepted": [
                  "2",
                  "tap 2"
                ],
                "points": 0.33
              },
              {
                "id": "tap3_volume",
                "accepted": [
                  "2.9",
                  "2.9 cm3"
                ],
                "points": 0.33
              },
              {
                "id": "tap4_number",
                "accepted": [
                  "4",
                  "tap 4"
                ],
                "points": 0.33
              },
              {
                "id": "tap4_volume",
                "accepted": [
                  "3.8",
                  "3.8 cm3"
                ],
                "points": 0.34
              },
              {
                "id": "tap5_volume",
                "accepted": [
                  "3.3",
                  "3.3 cm3"
                ],
                "points": 0.34
              }
            ],
            "scoreThresholds": [
              {
                "minCorrect": 6,
                "points": 2
              },
              {
                "minCorrect": 4,
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q14c",
          "number": 14,
          "prompt": "14(c). There are drips from all the taps. One of the results is wrong. Circle the result that is wrong. Explain your answer.",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q14-dripping-tap.png",
              "alt": "Tap with drips of water",
              "maxWidth": 602
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "choice",
              "label": "Wrong result",
              "placeholder": "answer"
            },
            {
              "id": "explanation",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "tap 1, because all taps drip but tap 1 has 0.0 cm3/no volume of water collected.",
            "parts": [
              {
                "id": "choice",
                "accepted": [
                  "tap 1"
                ],
                "points": 0.5
              },
              {
                "id": "explanation",
                "accepted": [],
                "points": 0.5,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "all",
                    "tap",
                    "drip"
                  ],
                  [
                    "0"
                  ],
                  [
                    "no",
                    "water"
                  ],
                  [
                    "no",
                    "volume"
                  ],
                  [
                    "nothing",
                    "collected"
                  ],
                  [
                    "other",
                    "volume"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q15a",
          "number": 15,
          "prompt": "15(a). Complete the sentence: When the toy bounces up, the upward force is _____ than the downward force.",
          "points": 1,
          "note": "Jamila has a toy with a spring. She makes the toy move upwards and downwards.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q15-spring-toy.png",
              "alt": "Jamila on a spring toy",
              "maxWidth": 392
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Missing word",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "greater",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "greater",
                  "larger",
                  "more",
                  "bigger",
                  "stronger"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q15b",
          "number": 15,
          "prompt": "15(b). What does Jamila do to make the toy bounce faster?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q15-spring-toy.png",
              "alt": "Jamila on a spring toy",
              "maxWidth": 392
            }
          ],
          "type": "singleChoice",
          "responseShape": "object",
          "choices": [
            {
              "value": "increase the weight of the toy",
              "label": "increase the weight of the toy"
            },
            {
              "value": "push on the spring all of the time",
              "label": "push on the spring all of the time"
            },
            {
              "value": "push on the spring less often",
              "label": "push on the spring less often"
            },
            {
              "value": "push on the spring more often",
              "label": "push on the spring more often"
            },
            {
              "value": "use a longer spring",
              "label": "use a longer spring"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "push on the spring more often",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "push on the spring more often"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q16a",
          "number": 16,
          "prompt": "16(a). Chen cannot use a sieve to separate the mixture of sand and copper sulfate. Explain why.",
          "points": 1,
          "note": "Copper sulfate is a blue solid that dissolves to make a blue solution. Chen filters a mixture of powdered copper sulfate and sand.",
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q16-filtration.png",
              "alt": "Filtration equipment",
              "maxWidth": 490
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Explanation",
              "placeholder": "Explain your answer."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "The particles are too small or similar size, so both solids would pass through the sieve.",
            "parts": [
              {
                "id": "answer",
                "accepted": [],
                "points": 1,
                "normalizer": "keywords",
                "keywords": [
                  [
                    "particle",
                    "small"
                  ],
                  [
                    "same",
                    "size"
                  ],
                  [
                    "both",
                    "pass"
                  ],
                  [
                    "powder"
                  ]
                ],
                "reviewRecommended": true
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q16b",
          "number": 16,
          "prompt": "16(b). What substance does the residue contain?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q16-filtration.png",
              "alt": "Filtration equipment",
              "maxWidth": 490
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Residue",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "sand",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "sand"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q16c",
          "number": 16,
          "prompt": "16(c). What is the name of the filtrate?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q16-filtration.png",
              "alt": "Filtration equipment",
              "maxWidth": 490
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Filtrate",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "copper sulfate solution",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "copper sulfate solution",
                  "copper sulphate solution",
                  "copper sulfate",
                  "copper sulphate",
                  "blue solution"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7s-q16d",
          "number": 16,
          "prompt": "16(d). What colour is the filtrate?",
          "points": 1,
          "visuals": [
            {
              "type": "image",
              "src": "/test-assets/spip/year-7-science-pre/spip-y7s-q16-filtration.png",
              "alt": "Filtration equipment",
              "maxWidth": 490
            }
          ],
          "type": "multiText",
          "fields": [
            {
              "id": "answer",
              "label": "Colour",
              "placeholder": "answer"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "blue",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "blue"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    }
  ]
};
