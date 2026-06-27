import type { TestDefinition } from "@/features/tests/lib/types";

export const spipYear7EnglishPre: TestDefinition = {
  "id": "spip-year-7-english-pre",
  "title": "SPIP Year 7 English Pre-test",
  "subject": "English",
  "level": "SPIP Year 7",
  "totalPoints": 50,
  "status": "active",
  "audioSrc": "/test-assets/spip/year-7-english-pre/audio/spip-y7-english-listening.mp3",
  "answerPayload": "rwAnswers",
  "aiShortAnswerRubrics": {
    "spip-y7e-w1": "5 marks: 1 mark for apologising for not being able to go to the party; 1 mark for explaining why the student cannot go; 1 mark for saying what present is being sent; up to 2 marks for understandable age-appropriate English, card-like tone/format, grammar, spelling, clarity, and reasonable adherence to the 35-45 word instruction."
  },
  "sections": [
    {
      "id": "listening1",
      "label": "Listening Part 1",
      "title": "Questions 1-7",
      "hint": "For each question, choose the correct answer.",
      "questions": [
        {
          "id": "spip-y7e-l1",
          "number": 1,
          "prompt": "What did the girl buy on her shopping trip?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q1-a.png",
              "alt": "Listening question 1, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q1-b.png",
              "alt": "Listening question 1, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q1-c.png",
              "alt": "Listening question 1, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l2",
          "number": 2,
          "prompt": "Why did the plane leave late?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q2-a.png",
              "alt": "Listening question 2, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q2-b.png",
              "alt": "Listening question 2, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q2-c.png",
              "alt": "Listening question 2, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l3",
          "number": 3,
          "prompt": "What activity does the woman want to book for the weekend?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q3-a.png",
              "alt": "Listening question 3, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q3-b.png",
              "alt": "Listening question 3, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q3-c.png",
              "alt": "Listening question 3, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l4",
          "number": 4,
          "prompt": "Which cake will the girl order?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q4-a.png",
              "alt": "Listening question 4, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q4-b.png",
              "alt": "Listening question 4, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q4-c.png",
              "alt": "Listening question 4, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l5",
          "number": 5,
          "prompt": "How much must customers spend to get a free gift?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q5-a.png",
              "alt": "Listening question 5, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q5-b.png",
              "alt": "Listening question 5, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q5-c.png",
              "alt": "Listening question 5, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l6",
          "number": 6,
          "prompt": "What did the family do on Sunday?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q6-a.png",
              "alt": "Listening question 6, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q6-b.png",
              "alt": "Listening question 6, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q6-c.png",
              "alt": "Listening question 6, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l7",
          "number": 7,
          "prompt": "Which programme is on first?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q7-a.png",
              "alt": "Listening question 7, option A illustration"
            },
            {
              "value": "b",
              "label": "B",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q7-b.png",
              "alt": "Listening question 7, option B illustration"
            },
            {
              "value": "c",
              "label": "C",
              "image": "/test-assets/spip/year-7-english-pre/listening/listen-q7-c.png",
              "alt": "Listening question 7, option C illustration"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "listening2",
      "label": "Listening Part 2",
      "title": "Questions 8-13",
      "hint": "For each question, choose the correct answer.",
      "questions": [
        {
          "id": "spip-y7e-l8",
          "number": 8,
          "prompt": "You will hear two friends talking about a new clothes shop. What does the girl say about it?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "The staff are helpful."
            },
            {
              "value": "b",
              "label": "It only has the latest fashions."
            },
            {
              "value": "c",
              "label": "Prices are reduced at the moment."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l9",
          "number": 9,
          "prompt": "You will hear two friends talking about a pop band's website. They think the site would be better if",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "its information was up to date."
            },
            {
              "value": "b",
              "label": "it was easier to buy concert tickets."
            },
            {
              "value": "c",
              "label": "the band members answered messages."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l10",
          "number": 10,
          "prompt": "You will hear a woman telling a friend about an art competition she's won. How does she feel about it?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "upset that the prize isn't valuable"
            },
            {
              "value": "b",
              "label": "excited that the judges liked her picture"
            },
            {
              "value": "c",
              "label": "disappointed that she can't use the prize"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l11",
          "number": 11,
          "prompt": "You will hear two friends talking about the girl's flatmate. The girl thinks that her flatmate",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "is too untidy."
            },
            {
              "value": "b",
              "label": "talks too much."
            },
            {
              "value": "c",
              "label": "plays music too loud."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l12",
          "number": 12,
          "prompt": "You will hear two friends talking about a football match. They agree that their team lost because",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "the players weren't confident enough."
            },
            {
              "value": "b",
              "label": "they were missing some key players."
            },
            {
              "value": "c",
              "label": "the players didn't do the right training."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l13",
          "number": 13,
          "prompt": "You will hear two friends talking about a tennis match they played. The boy wants the girl to",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "help him to get fitter."
            },
            {
              "value": "b",
              "label": "practise with him more often."
            },
            {
              "value": "c",
              "label": "enter more competitions with him."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "listening3",
      "label": "Listening Part 3",
      "title": "Questions 14-19",
      "hint": "Write one or two words, a number, a date, or a time.",
      "storyTitle": "Anita's holiday in Cuba",
      "story": [
        "In the National Gardens, the (14) _____ was the thing that attracted most people.",
        "On the swimming trip, electronic armbands kept the (15) _____ away.",
        "On the day in the countryside, Anita almost fell off a (16) _____.",
        "In the capital city, Anita saw a (17) _____ in a theatre.",
        "Anita enjoyed visiting a farm where (18) _____ is produced.",
        "Anita bought some (19) _____ as gifts."
      ],
      "questions": [
        {
          "id": "spip-y7e-l14",
          "number": 14,
          "prompt": "In the National Gardens, the thing that attracted most people was the",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "waterfall",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "waterfall",
                  "waterfalls",
                  "waterfal",
                  "fantastic waterfall",
                  "fantastic waterfalls",
                  "fantastic waterfal",
                  "a waterfall",
                  "an waterfall",
                  "the waterfall",
                  "a fantastic waterfall",
                  "an fantastic waterfall",
                  "the fantastic waterfall"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l15",
          "number": 15,
          "prompt": "Electronic armbands kept the _____ away.",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "shark",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "shark",
                  "sharks",
                  "a shark",
                  "an shark",
                  "the shark"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l16",
          "number": 16,
          "prompt": "Anita almost fell off a",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "horse",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "horse",
                  "a horse",
                  "an horse",
                  "her horse",
                  "the horse"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l17",
          "number": 17,
          "prompt": "In the capital city, Anita saw a _____ in a theatre.",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "musical",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "musical",
                  "musical show",
                  "musical play",
                  "a musical",
                  "an musical",
                  "the musical",
                  "a musical show",
                  "an musical show",
                  "the musical show",
                  "a musical play",
                  "an musical play",
                  "the musical play"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l18",
          "number": 18,
          "prompt": "Anita enjoyed visiting a farm where _____ is produced.",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "sugar",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "sugar",
                  "suger"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l19",
          "number": 19,
          "prompt": "Anita bought some _____ as gifts.",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "text",
          "placeholder": "answer",
          "grading": {
            "mode": "auto",
            "display": "rings",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "ring",
                  "rings",
                  "some rings",
                  "some ring"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "listening4",
      "label": "Listening Part 4",
      "title": "Questions 20-25",
      "hint": "For each question, choose the correct answer.",
      "storyTitle": "Interview with Vicky Prince",
      "story": [
        "You will hear an interview with Vicky Prince, a champion swimmer who now works as a swimming coach."
      ],
      "questions": [
        {
          "id": "spip-y7e-l20",
          "number": 20,
          "prompt": "Vicky first went in for competitions because",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "she had joined a swimming club."
            },
            {
              "value": "b",
              "label": "her parents were keen on swimming."
            },
            {
              "value": "c",
              "label": "her swimming teacher encouraged her."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l21",
          "number": 21,
          "prompt": "As a teenager, Vicky's training involved",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "exercising on land as well as in the water."
            },
            {
              "value": "b",
              "label": "going without meals during the day."
            },
            {
              "value": "c",
              "label": "travelling to a pool once a day."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l22",
          "number": 22,
          "prompt": "What did Vicky find hard about her training programme?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "She couldn't go on school trips."
            },
            {
              "value": "b",
              "label": "She lost some of her friends."
            },
            {
              "value": "c",
              "label": "She missed lots of parties."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l23",
          "number": 23,
          "prompt": "What helped Vicky to do well in the national finals?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "She was not expected to win."
            },
            {
              "value": "b",
              "label": "She trained harder than usual."
            },
            {
              "value": "c",
              "label": "She wanted to take a cup home."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l24",
          "number": 24,
          "prompt": "As a swimming coach, Vicky thinks she's best at teaching people",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "to deal with failure."
            },
            {
              "value": "b",
              "label": "to improve their technique."
            },
            {
              "value": "c",
              "label": "to get swimming qualifications."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-l25",
          "number": 25,
          "prompt": "Why has Vicky started doing long-distance swimming?",
          "points": 1,
          "note": "Official listening audio and answer key are available. Listening is included in the current score.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "She needed to get fit again."
            },
            {
              "value": "b",
              "label": "She thought it would be fun."
            },
            {
              "value": "c",
              "label": "She wanted to do some travelling."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "reading1",
      "label": "Reading Part 1",
      "title": "Questions 1-5",
      "hint": "For each question, choose the correct answer.",
      "questions": [
        {
          "id": "spip-y7e-r1",
          "number": 1,
          "prompt": "Choose the sentence that best matches the notice.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "visualHtml": "<div class=\"legacy-notice\"><strong>Competition notice<\/strong><p>Entrants must be 18 or over.<\/p><p>Web reconstruction from PDF text.<\/p><\/div>",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "The competition is open to people over a certain age."
            },
            {
              "value": "b",
              "label": "There is a maximum age limit for this competition."
            },
            {
              "value": "c",
              "label": "Only eighteen-year-olds are allowed to enter this competition."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r2",
          "number": 2,
          "prompt": "Adam is telling Rachel to",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "visualHtml": "<div class=\"legacy-note-card\"><strong>Adam to Rachel<\/strong><p>Could you bring the thing I need tomorrow? Web reconstruction from PDF text.<\/p><\/div>",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "post something for him."
            },
            {
              "value": "b",
              "label": "find out how to do something."
            },
            {
              "value": "c",
              "label": "give him something he needs."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r3",
          "number": 3,
          "prompt": "Choose the sentence that best matches the laboratory notice.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "visualHtml": "<div class=\"legacy-notice\"><strong>Laboratory<\/strong><p>The public are not permitted beyond this point unless accompanied by a staff member.<\/p><\/div>",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "Members of staff must be accompanied if they wish to pass this point."
            },
            {
              "value": "b",
              "label": "Members of the public can't go through unless they are visiting someone working here."
            },
            {
              "value": "c",
              "label": "Members of the public may go further if a company employee goes with them."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r4",
          "number": 4,
          "prompt": "Choose the sentence that best matches Tom's message to Jane.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "visualHtml": "<div class=\"legacy-note-card\"><strong>Tom to Jane<\/strong><p>Morning favour message. Web reconstruction from PDF text.<\/p><\/div>",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "Tom wants to persuade Jane to take him to college tomorrow morning."
            },
            {
              "value": "b",
              "label": "Tom would like Jane to do him a favour tomorrow morning."
            },
            {
              "value": "c",
              "label": "Tom is reminding Jane they have to get up early tomorrow morning."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r5",
          "number": 5,
          "prompt": "Choose the sentence that best matches the Careers Centre notice.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "visualHtml": "<div class=\"legacy-notice\"><strong>Careers Centre<\/strong><p>Free copies of advertisements on this board are available from the Careers Centre.<\/p><\/div>",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "The Careers Centre will give you a copy of any advertisement on this board."
            },
            {
              "value": "b",
              "label": "This board is used to advertise the work done by the Careers Centre."
            },
            {
              "value": "c",
              "label": "If you ask the Careers Centre, you can advertise for free on this board."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "reading2",
      "label": "Reading Part 2",
      "title": "Questions 6-10",
      "hint": "Choose the market that is most suitable for each person.",
      "storyTitle": "City Markets",
      "story": [
        "The people below all want to visit a city market. Decide which market would be most suitable.",
        "A. Beckfield Market: World-famous for second-hand camera equipment and books on photography. Old pictures of local places of interest are available, and there is hot soup in cold weather.",
        "B. Rosewell Hill: In a historic building with late-night opening hours. Performers entertain the crowds and there are pictures by well-known and beginning artists.",
        "C. Camberwall Market: A large indoor market open from morning until late in a modern setting. Find rare gold and silver jewellery and designer clothes. Restaurants are nearby.",
        "D. Cobbledown Road: A small all-weather market with locally produced jewellery and musical instruments, plus home-made cakes.",
        "E. Oldford Lane: In the historic city centre, with jewellery and clothes. Bargains are found in the morning and stalls close after lunch.",
        "F. Purford Market: Close to museums and art galleries, with lunch, fresh fruit, special breads, regional cheese, seating, and local bands.",
        "G. Teddingley Market: Under historic city walls, with good-value new and second-hand clothes, unusual albums by international singers, and hot world food.",
        "H. Frome Place: Open during daytime shopping hours, with a sandwich bar, old books, and gifts from all over the world."
      ],
      "questions": [
        {
          "id": "spip-y7e-r6",
          "number": 6,
          "prompt": "Jenny wants locally-produced traditional food, somewhere convenient to eat, and a market near local attractions.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A"
            },
            {
              "value": "b",
              "label": "B"
            },
            {
              "value": "c",
              "label": "C"
            },
            {
              "value": "d",
              "label": "D"
            },
            {
              "value": "e",
              "label": "E"
            },
            {
              "value": "f",
              "label": "F"
            },
            {
              "value": "g",
              "label": "G"
            },
            {
              "value": "h",
              "label": "H"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "F",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "f"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r7",
          "number": 7,
          "prompt": "Matt wants reasonably priced clothes, something hot to eat, and rare recordings by different bands.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A"
            },
            {
              "value": "b",
              "label": "B"
            },
            {
              "value": "c",
              "label": "C"
            },
            {
              "value": "d",
              "label": "D"
            },
            {
              "value": "e",
              "label": "E"
            },
            {
              "value": "f",
              "label": "F"
            },
            {
              "value": "g",
              "label": "G"
            },
            {
              "value": "h",
              "label": "H"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "G",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "g"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r8",
          "number": 8,
          "prompt": "Sammie wants to visit after spending the day in the city, photograph a historic place, and buy a painting by an unknown artist.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A"
            },
            {
              "value": "b",
              "label": "B"
            },
            {
              "value": "c",
              "label": "C"
            },
            {
              "value": "d",
              "label": "D"
            },
            {
              "value": "e",
              "label": "E"
            },
            {
              "value": "f",
              "label": "F"
            },
            {
              "value": "g",
              "label": "G"
            },
            {
              "value": "h",
              "label": "H"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r9",
          "number": 9,
          "prompt": "Alexia wants a special necklace for her grandmother, to spend the whole day at the market, and to stay inside.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A"
            },
            {
              "value": "b",
              "label": "B"
            },
            {
              "value": "c",
              "label": "C"
            },
            {
              "value": "d",
              "label": "D"
            },
            {
              "value": "e",
              "label": "E"
            },
            {
              "value": "f",
              "label": "F"
            },
            {
              "value": "g",
              "label": "G"
            },
            {
              "value": "h",
              "label": "H"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r10",
          "number": 10,
          "prompt": "Ella wants objects from other countries, a second-hand book for the journey home, and a snack.",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "A"
            },
            {
              "value": "b",
              "label": "B"
            },
            {
              "value": "c",
              "label": "C"
            },
            {
              "value": "d",
              "label": "D"
            },
            {
              "value": "e",
              "label": "E"
            },
            {
              "value": "f",
              "label": "F"
            },
            {
              "value": "g",
              "label": "G"
            },
            {
              "value": "h",
              "label": "H"
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "H",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "h"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "reading3",
      "label": "Reading Part 3",
      "title": "Questions 11-15",
      "hint": "Read the article and choose the correct answer.",
      "storyTitle": "Artist Peter Fuller talks about his hobby",
      "story": [
        "There's a popular idea that artists are not supposed to be into sport, but mountain biking is a huge part of my life. It gets me out of my studio, and into the countryside. More importantly, racing along as fast as you can leaves you no time to worry about anything else.",
        "I'm in my sixties now, but I started cycling when I was a kid. In the summer my friends and I would ride into the woods and see who was brave enough to go down steep hills or do big jumps. The bikes we had then weren't built for that, and often broke.",
        "By the 1980s mountain bikes were everywhere. At that time I was into skateboarding. I did that for a decade until falling off on hard surfaces started to hurt too much. Mountain biking seemed a fairly safe way to keep fit, so I took that up instead.",
        "In the end I stopped racing, mainly because I knew what it could mean to my career if I had a bad crash. But I still like to do a three-hour mountain bike ride every week. If I see a rider ahead, I have to beat them to the top."
      ],
      "questions": [
        {
          "id": "spip-y7e-r11",
          "number": 11,
          "prompt": "Peter enjoys mountain biking because",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "it gives him the opportunity to enjoy the views."
            },
            {
              "value": "b",
              "label": "he can use the time to plan his work."
            },
            {
              "value": "c",
              "label": "he is able to stop thinking about his problems."
            },
            {
              "value": "d",
              "label": "it helps him to concentrate better."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r12",
          "number": 12,
          "prompt": "What does Peter say about cycling during his childhood?",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "He is sorry he didn't take more care of his bike."
            },
            {
              "value": "b",
              "label": "His friends always had better quality bikes than he did."
            },
            {
              "value": "c",
              "label": "His bike wasn't suitable for the activities he was doing."
            },
            {
              "value": "d",
              "label": "He was more interested in designing bikes than riding them."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "C",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "c"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r13",
          "number": 13,
          "prompt": "Peter says he returned to cycling after several years",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "because he had become unfit."
            },
            {
              "value": "b",
              "label": "so that he could enter races."
            },
            {
              "value": "c",
              "label": "in order to meet new people."
            },
            {
              "value": "d",
              "label": "to replace an activity he had given up."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "D",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "d"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r14",
          "number": 14,
          "prompt": "How does Peter feel about cycling now?",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "He is proud that he is still so fast."
            },
            {
              "value": "b",
              "label": "He is keen to do less now that he is older."
            },
            {
              "value": "c",
              "label": "He regrets the fact that he can no longer compete."
            },
            {
              "value": "d",
              "label": "He wishes more people were involved in the sport."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "A",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "a"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r15",
          "number": 15,
          "prompt": "What would be a good introduction to this article?",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "For Peter Fuller, nothing matters more than mountain biking, not even his career."
            },
            {
              "value": "b",
              "label": "Artist Peter Fuller takes mountain biking pretty seriously. Here he describes how it all began and what he gets out of it."
            },
            {
              "value": "c",
              "label": "Peter Fuller explains how he became an artist only as a result of his interest in mountain biking."
            },
            {
              "value": "d",
              "label": "After discovering mountain biking late in life, Peter Fuller gave up art for a while."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "reading4",
      "label": "Reading Part 4",
      "title": "Questions 16-20",
      "hint": "Five sentences have been removed from the text. Choose the correct sentence for each gap.",
      "storyTitle": "A new life",
      "story": [
        "I used to work as a college lecturer in the north of England, running photography courses. It wasn't a bad job and I really liked my students, but I began to feel tired of doing the same thing every day. (16)",
        "I'd always loved travelling, so one weekend I typed 'international volunteering' into a search engine. At the top of the results page was the opportunity to stay on an island in the Indian Ocean and help protect the beaches and sea life. (17) I had some diving experience, and the more I talked about it, the more I wanted to do it.",
        "So I contacted the organisation. One week later they offered to send me to the island and I accepted. (18) After all, the volunteer job was only for two months during the summer holidays. I thought after I'd finished, I'd come home.",
        "As soon as I got to the island, I was sure I'd done the right thing. My first dive was incredible. (19) I felt so lucky to be able to experience that every day.",
        "In fact I loved it so much that I never came home. I've now been on the island for ten years and have a permanent job as a marine educator. Of course not everything about my new life is perfect. (20) However, I can't imagine going back to my old life.",
        "A. That's why I knew it was a terrible plan.",
        "B. I had trained in icy water in the UK so the crystal clear warm water felt amazing.",
        "C. They always ask lots of questions.",
        "D. I work far harder than I used to.",
        "E. I began joking to friends about sending in an application.",
        "F. Afterwards, some people were surprised by my decision but I wasn't too worried.",
        "G. I decided I needed a break.",
        "H. I needed to explain that first."
      ],
      "questions": [
        {
          "id": "spip-y7e-r16",
          "number": 16,
          "prompt": "Gap 16",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "That's why I knew it was a terrible plan."
            },
            {
              "value": "b",
              "label": "I had trained in icy water in the UK so the crystal clear warm water felt amazing."
            },
            {
              "value": "c",
              "label": "They always ask lots of questions."
            },
            {
              "value": "d",
              "label": "I work far harder than I used to."
            },
            {
              "value": "e",
              "label": "I began joking to friends about sending in an application."
            },
            {
              "value": "f",
              "label": "Afterwards, some people were surprised by my decision but I wasn't too worried."
            },
            {
              "value": "g",
              "label": "I decided I needed a break."
            },
            {
              "value": "h",
              "label": "I needed to explain that first."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "G",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "g"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r17",
          "number": 17,
          "prompt": "Gap 17",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "That's why I knew it was a terrible plan."
            },
            {
              "value": "b",
              "label": "I had trained in icy water in the UK so the crystal clear warm water felt amazing."
            },
            {
              "value": "c",
              "label": "They always ask lots of questions."
            },
            {
              "value": "d",
              "label": "I work far harder than I used to."
            },
            {
              "value": "e",
              "label": "I began joking to friends about sending in an application."
            },
            {
              "value": "f",
              "label": "Afterwards, some people were surprised by my decision but I wasn't too worried."
            },
            {
              "value": "g",
              "label": "I decided I needed a break."
            },
            {
              "value": "h",
              "label": "I needed to explain that first."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "E",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "e"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r18",
          "number": 18,
          "prompt": "Gap 18",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "That's why I knew it was a terrible plan."
            },
            {
              "value": "b",
              "label": "I had trained in icy water in the UK so the crystal clear warm water felt amazing."
            },
            {
              "value": "c",
              "label": "They always ask lots of questions."
            },
            {
              "value": "d",
              "label": "I work far harder than I used to."
            },
            {
              "value": "e",
              "label": "I began joking to friends about sending in an application."
            },
            {
              "value": "f",
              "label": "Afterwards, some people were surprised by my decision but I wasn't too worried."
            },
            {
              "value": "g",
              "label": "I decided I needed a break."
            },
            {
              "value": "h",
              "label": "I needed to explain that first."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "F",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "f"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r19",
          "number": 19,
          "prompt": "Gap 19",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "That's why I knew it was a terrible plan."
            },
            {
              "value": "b",
              "label": "I had trained in icy water in the UK so the crystal clear warm water felt amazing."
            },
            {
              "value": "c",
              "label": "They always ask lots of questions."
            },
            {
              "value": "d",
              "label": "I work far harder than I used to."
            },
            {
              "value": "e",
              "label": "I began joking to friends about sending in an application."
            },
            {
              "value": "f",
              "label": "Afterwards, some people were surprised by my decision but I wasn't too worried."
            },
            {
              "value": "g",
              "label": "I decided I needed a break."
            },
            {
              "value": "h",
              "label": "I needed to explain that first."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "B",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "b"
                ],
                "points": 1
              }
            ]
          }
        },
        {
          "id": "spip-y7e-r20",
          "number": 20,
          "prompt": "Gap 20",
          "points": 1,
          "note": "Official answer key verified from the supplied SPIP answer PDF.",
          "type": "singleChoice",
          "choices": [
            {
              "value": "a",
              "label": "That's why I knew it was a terrible plan."
            },
            {
              "value": "b",
              "label": "I had trained in icy water in the UK so the crystal clear warm water felt amazing."
            },
            {
              "value": "c",
              "label": "They always ask lots of questions."
            },
            {
              "value": "d",
              "label": "I work far harder than I used to."
            },
            {
              "value": "e",
              "label": "I began joking to friends about sending in an application."
            },
            {
              "value": "f",
              "label": "Afterwards, some people were surprised by my decision but I wasn't too worried."
            },
            {
              "value": "g",
              "label": "I decided I needed a break."
            },
            {
              "value": "h",
              "label": "I needed to explain that first."
            }
          ],
          "grading": {
            "mode": "auto",
            "display": "D",
            "parts": [
              {
                "id": "answer",
                "accepted": [
                  "d"
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    },
    {
      "id": "writing",
      "label": "Writing",
      "title": "Writing",
      "hint": "Write 35-45 words.",
      "storyTitle": "Writing",
      "story": [
        "Your English friend, Jo, has invited you to a birthday party. You can't go to the party.",
        "Write a card to Jo. In your card, you should:",
        "- apologise for not being able to go to the party",
        "- explain why you can't go",
        "- say what present you are sending Jo",
        "Write 35-45 words on your answer sheet."
      ],
      "questions": [
        {
          "id": "spip-y7e-w1",
          "number": 21,
          "prompt": "Write your card to Jo.",
          "points": 5,
          "note": "This writing task is scored using a 5-mark rubric.",
          "type": "text",
          "inputMode": "textarea",
          "placeholder": "Write 35-45 words.",
          "grading": {
            "mode": "aiSplit",
            "display": "5-mark SPIP writing rubric",
            "contentTerms": [
              "sorry",
              "because",
              "present"
            ]
          }
        }
      ]
    }
  ]
};
