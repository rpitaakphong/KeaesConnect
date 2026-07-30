insert into public.tests (id, title, subject, level, status, total_points, app_path)
values ('cie-igcse-combined-science-paper-4-extended', 'CIE IGCSE Combined Science Paper 4 Extended', 'Combined Science', 'Extended', 'active', 80, '/tests/cie-igcse-combined-science-paper-4-extended/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('cie-igcse-cs-p4-q1a', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(a) Explain why washing hands before handling food is important for controlling the spread of disease.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1a","points":2,"display":"Pathogens spread disease; washing removes them and prevents their spread to food.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["pathogen","disease"],["microorganism","disease"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["remove","pathogen"],["stop","spread"],["prevent","food","pathogen"],["hygiene"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 1),
  ('cie-igcse-cs-p4-q1bi', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(b)(i) Describe two differences between the antibody response after the initial vaccination and after the booster vaccination.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1bi","points":2,"display":"The initial response is slower and produces fewer antibodies; antibody levels also fall faster and lower.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["initial","fewer","antibod"],["booster","more","antibod"],["initial","lower","peak"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["initial","slower"],["booster","faster"],["initial","decrease","faster"],["initial","lower","after"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 2),
  ('cie-igcse-cs-p4-q1bii', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(b)(ii) Select the term that describes the response shown.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1bii","points":1,"display":"active immunity","status":"official","parts":[{"id":"answer","accepted":["active immunity"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 3),
  ('cie-igcse-cs-p4-q1c', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(c) Explain how platelets in the blood help defend the body against disease.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1c","points":2,"display":"Platelets form a clot that seals the wound and prevents pathogen entry.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["platelet","clot"],["form","clot"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["clot","seal"],["prevent","pathogen","entry"],["stop","pathogen","enter"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 4),
  ('cie-igcse-cs-p4-q1di', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(d)(i) State the name of the arteries in the heart that may become blocked in heart disease.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1di","points":1,"display":"coronary / coronary artery / coronary arteries","status":"official","parts":[{"id":"answer","accepted":["coronary","coronary artery","coronary arteries"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 5),
  ('cie-igcse-cs-p4-q1dii', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(d)(ii) State the name of the blood component that transports oxygen.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q1dii","points":1,"display":"red blood cells","status":"official","parts":[{"id":"answer","accepted":["red blood cell","red blood cells","erythrocyte","erythrocytes"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 6),
  ('cie-igcse-cs-p4-q2ai', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(a)(i) Select the two substances transported by cells Q.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q2ai","points":1,"display":"amino acids; sucrose","status":"official","parts":[{"id":"selected","accepted":["amino acids","sucrose"],"points":1,"normalizer":"set"}]}'::jsonb, null, 1, 7),
  ('cie-igcse-cs-p4-q2aii', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(a)(ii) State one function of xylem other than transport.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q2aii","points":1,"display":"support","status":"official","parts":[{"id":"answer","accepted":["support","supporting the plant","structural support"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 8),
  ('cie-igcse-cs-p4-q2b', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(b) State the balanced symbol equation for photosynthesis.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q2b","points":2,"display":"6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["6co2","6h2o"],["6 co2","6 h2o"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["c6h12o6","6o2"],["c6h12o6","6 o2"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 9),
  ('cie-igcse-cs-p4-q2c', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(c) Explain the results for test-tube A and test-tube C. Use the words respiration and photosynthesis.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q2c","points":4,"display":"A: respiration releases CO₂ and darkness prevents photosynthesis. C: photosynthesis uses CO₂ faster than respiration releases it.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["a","carbon dioxide","respiration"],["dark","carbon dioxide","respiration"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["a","no","photosynthesis"],["dark","no","photosynthesis"],["photosynthesis","light"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["c","carbon dioxide","photosynthesis"],["purple","carbon dioxide","photosynthesis"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["photosynthesis","higher","respiration"],["photosynthesis","greater","respiration"],["photosynthesis","faster","respiration"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 4, 10),
  ('cie-igcse-cs-p4-q2d', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(d) Explain the effect of deforestation on biodiversity.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q2d","points":2,"display":"It removes habitats and food, so some species may become extinct.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["less","food"],["fewer","food"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["species","extinct"],["remove","habitat"],["loss","habitat"],["remove","shelter"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 11),
  ('cie-igcse-cs-p4-q3ai', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(a)(i) State the function of part X in the digestive system.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q3ai","points":1,"display":"egestion","status":"official","parts":[{"id":"answer","accepted":["egestion","egest faeces","egest feces"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 12),
  ('cie-igcse-cs-p4-q3aii', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(a)(ii) Complete the sentences about part Y and digestion of fats and oils.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q3aii","points":3,"display":"pancreas; lipase; fatty acids and glycerol","status":"official","parts":[{"id":"organ","accepted":["pancreas"],"points":1,"normalizer":"text"},{"id":"enzyme","accepted":["lipase"],"points":1,"normalizer":"text"},{"id":"products","accepted":["fatty acids and glycerol","glycerol and fatty acids","fatty acid and glycerol"],"points":1,"normalizer":"text"}]}'::jsonb, null, 3, 13),
  ('cie-igcse-cs-p4-q3bi', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(b)(i) The enzyme shown is active in the mouth. Explain why its activity changes when it reaches the stomach.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q3bi","points":3,"display":"The stomach''s lower pH changes the active-site shape, so the substrate no longer fits.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["stomach","acid"],["stomach","lower","ph"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["active site","change","shape"],["enzyme","denature"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["substrate","no longer","fit"],["not","complementary"],["enzyme substrate","no longer","form"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 3, 14),
  ('cie-igcse-cs-p4-q3bii', 'cie-igcse-combined-science-paper-4-extended', 'Biology 1–3', '(b)(ii) Draw a curve on Fig. 3.2 to show the activity of a protease enzyme found in the stomach.', '{"source":"diagramAnnotation","id":"cie-igcse-cs-p4-q3bii","points":1,"display":"(b)(ii) Draw a curve on Fig. 3.2 to show the activity of a protease enzyme found in the stomach.","status":"official","variant":"curve","geometry":{"variant":"curve","plot":{"minX":0.16,"maxX":0.92,"minY":0.06,"maxY":0.87},"optimum":{"minX":0.235,"maxX":0.39},"baselineTolerance":0.18}}'::jsonb, null, 1, 15),
  ('cie-igcse-cs-p4-q4ai', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a)(i) Define activation energy.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q4ai","points":1,"display":"the minimum energy that colliding particles must have to react","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["minimum","energy","colliding","particles","react"],["minimum","energy","collision","reaction"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 16),
  ('cie-igcse-cs-p4-q4aii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a)(ii) Draw and label an arrow to show the activation energy for reaction 2.', '{"source":"diagramAnnotation","id":"cie-igcse-cs-p4-q4aii","points":1,"display":"(a)(ii) Draw and label an arrow to show the activation energy for reaction 2.","status":"official","variant":"arrow","geometry":{"variant":"arrow","start":{"x":0.775,"y":0.54},"peak":{"x":0.775,"y":0.06},"endpointTolerance":0.1,"labelTolerance":0.15}}'::jsonb, null, 1, 17),
  ('cie-igcse-cs-p4-q4b', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(b) State how the temperature changes during reaction 2 and give a reason.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q4b","points":1,"display":"The temperature decreases because the reaction is endothermic and takes in thermal energy.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["temperature","decrease","endothermic"],["temperature","decrease","takes in","thermal"],["temperature","decrease","products","more","energy"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 18),
  ('cie-igcse-cs-p4-q4ci', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(c)(i) Calcium carbonate reacts with dilute hydrochloric acid to produce calcium chloride. Select the other two products.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q4ci","points":2,"display":"carbon dioxide and water","status":"official","parts":[{"id":"selected","accepted":["carbon dioxide","water"],"points":2,"normalizer":"set"}]}'::jsonb, null, 2, 19),
  ('cie-igcse-cs-p4-q4cii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(c)(ii) Explain, using particle collisions and energy, why increasing the temperature increases the rate of reaction.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q4cii","points":2,"display":"Collisions occur more frequently and more particles have energy above the activation energy.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["collision","more","frequent"],["collision","frequency","increase"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["more","particles","activation","energy"],["more","successful","collision"],["more","energetic","collision"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 20),
  ('cie-igcse-cs-p4-q5ai', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a)(i) Use Table 5.1 to state why aluminium and copper are used in electrical cables.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5ai","points":1,"display":"high electrical conductivity","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["high","electrical","conductivity"],["good","conductor"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 21),
  ('cie-igcse-cs-p4-q5aii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a)(ii) Use Table 5.1 to state why aluminium is used in overhead electrical cables.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5aii","points":1,"display":"Aluminium has a low density and is lightweight.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["aluminium","lower","density"],["aluminium","light"],["low","density"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 22),
  ('cie-igcse-cs-p4-q5aiii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a)(iii) Use Table 5.1 to state why copper is not used to make food containers.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5aiii","points":1,"display":"Some copper compounds are toxic.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["copper","compound","toxic"],["aluminium","not","corrode"],["aluminium","protective","oxide"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 23),
  ('cie-igcse-cs-p4-q5bi', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(b)(i) State what is meant by an alloy.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5bi","points":1,"display":"a mixture of a metal with one or more other elements","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["mixture","metal","element"],["metal","mixed","other","element"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 24),
  ('cie-igcse-cs-p4-q5bii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(b)(ii) Explain why steel is stronger than pure iron.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5bii","points":2,"display":"Different-sized particles prevent the layers from sliding over each other.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["different","size","particles"],["different","size","atoms"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["stop","layers","sliding"],["prevent","layers","slide"],["difficult","layers","slide"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 25),
  ('cie-igcse-cs-p4-q5biii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(b)(iii) Stainless steel is used to make cutlery because it is strong. State one other reason why it is used for cutlery.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5biii","points":1,"display":"hard / resistant to rusting / does not corrode","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["hard"],["resistant","rust"],["does not","corrode"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 26),
  ('cie-igcse-cs-p4-q5c', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(c) Select the principal method used to extract each metal from its ore.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q5c","points":2,"display":"aluminium: electrolysis; copper and iron: heating with carbon","status":"official","parts":[{"id":"aluminium","accepted":["electrolysis"],"points":1,"normalizer":"text"},{"id":"copper","accepted":["carbon"],"points":1,"normalizer":"text"},{"id":"iron","accepted":["carbon"],"points":1,"normalizer":"text"}],"scoreThresholds":[{"minCorrect":2,"points":1},{"minCorrect":3,"points":2}]}'::jsonb, null, 2, 27),
  ('cie-igcse-cs-p4-q6a', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(a) Exhaust emissions contain carbon dioxide, carbon monoxide and carbon particulates. Describe how each of these three substances forms in a car engine.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6a","points":2,"display":"Carbon monoxide and carbon particulates form by incomplete combustion; carbon dioxide forms by complete combustion.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["carbon monoxide","carbon particulate","incomplete combustion"],["carbon monoxide","soot","incomplete combustion"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["carbon dioxide","complete combustion"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 28),
  ('cie-igcse-cs-p4-q6b', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(b) Complete the state symbols in the combustion equations: CO₂(__), CO(__), C(__), C₈H₁₈(__).', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6b","points":2,"display":"CO₂(g), CO(g), C(s), C₈H₁₈(l)","status":"official","parts":[{"id":"gases","accepted":["g, g","g g","g,g"],"points":1,"normalizer":"text"},{"id":"solidLiquid","accepted":["s, l","s l","s,l"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 29),
  ('cie-igcse-cs-p4-q6ci', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(c)(i) Carbon dioxide contains two double bonds. Explain why carbon dioxide is not an unsaturated molecule.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6ci","points":1,"display":"The double bonds are not between two carbon atoms.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["double","bond","not","two","carbon"],["double","bond","between","carbon","oxygen"],["only","one","carbon"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 30),
  ('cie-igcse-cs-p4-q6cii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(c)(ii) Suggest two actions that reduce the effect of carbon dioxide emissions on the environment.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6cii","points":2,"display":"Reduce deforestation and fossil-fuel use; increase renewable energy.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["reduce","deforestation"],["plant","trees"],["reduce","livestock"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["reduce","fossil","fuel"],["renewable"],["wind"],["solar"],["hydrogen"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 31),
  ('cie-igcse-cs-p4-q6di', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(d)(i) Complete and balance the equation: CO + NO → CO₂ + N₂.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6di","points":1,"display":"2CO + 2NO → 2CO₂ + N₂","status":"official","parts":[{"id":"answer","accepted":["2co + 2no -> 2co2 + n2","2co+2no->2co2+n2","2CO + 2NO → 2CO2 + N2"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 32),
  ('cie-igcse-cs-p4-q6dii', 'cie-igcse-combined-science-paper-4-extended', 'Chemistry 4–6', '(d)(ii) Explain how removing oxides of nitrogen from exhaust gases reduces harm to the environment.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q6dii","points":2,"display":"Removing oxides of nitrogen reduces acid rain.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["acid","rain"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["nitrogen","oxide","remove"],["no","removed"],["less","nitrogen","oxide"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 33),
  ('cie-igcse-cs-p4-q7ai', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(i) Determine the time taken by the student to reach maximum speed.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q7ai","points":1,"display":"40 s","status":"official","parts":[{"id":"answer","accepted":["40","40 s","40 seconds"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 34),
  ('cie-igcse-cs-p4-q7aii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(ii) Place X at a point on the graph when the student is decelerating.', '{"source":"diagramAnnotation","id":"cie-igcse-cs-p4-q7aii","points":1,"display":"(a)(ii) Place X at a point on the graph when the student is decelerating.","status":"official","variant":"point","geometry":{"variant":"point","segment":{"start":{"x":0.84,"y":0.11},"end":{"x":0.98,"y":0.77}},"tolerance":0.045}}'::jsonb, null, 1, 35),
  ('cie-igcse-cs-p4-q7aiii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(iii) Determine the distance the student walks at constant speed.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q7aiii","points":3,"display":"1.5 × 60 = 90 m","status":"official","parts":[{"id":"data","accepted":[],"keywords":[["1.5","60"],["40","100"],["constant","1.5"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"working","accepted":[],"keywords":[["distance","speed","time"],["1.5","60"],["area"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":["90","90 m"],"points":3,"normalizer":"text"}]}'::jsonb, null, 3, 36),
  ('cie-igcse-cs-p4-q7b', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(b) A student of mass 55 kg climbs 0.15 m. Calculate the increase in gravitational potential energy.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q7b","points":3,"display":"55 × 9.8 × 0.15 = 81 J","status":"official","parts":[{"id":"formula","accepted":[],"keywords":[["mgh"],["55","9.8","0.15"],["mass","gravity","height"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":["81","80.9","80.85"],"points":2,"normalizer":"text"},{"id":"unit","accepted":["j","joule","joules"],"points":1,"normalizer":"text"}]}'::jsonb, null, 3, 37),
  ('cie-igcse-cs-p4-q8ai', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(i) State the region of the electromagnetic spectrum with the main effect that warms the Earth.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8ai","points":1,"display":"infrared","status":"official","parts":[{"id":"answer","accepted":["infrared","infra-red","ir"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 38),
  ('cie-igcse-cs-p4-q8aii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(ii) Complete the explanation of global warming by selecting the correct term for each blank.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8aii","points":1,"display":"absorbed; greater than; emitted","status":"official","parts":[{"id":"first","accepted":["absorbed"],"points":1,"normalizer":"text"},{"id":"second","accepted":["greater than"],"points":1,"normalizer":"text"},{"id":"third","accepted":["emitted"],"points":1,"normalizer":"text"}],"scoreThresholds":[{"minCorrect":3,"points":1}]}'::jsonb, null, 1, 39),
  ('cie-igcse-cs-p4-q8bi', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(b)(i) State the type of wave that requires a medium to travel.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8bi","points":1,"display":"sound","status":"official","parts":[{"id":"answer","accepted":["sound","sound wave","sound waves"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 40),
  ('cie-igcse-cs-p4-q8bii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(b)(ii) Describe the difference between transverse and longitudinal waves in terms of the direction of vibrations.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8bii","points":2,"display":"Transverse vibrations are perpendicular to propagation; longitudinal vibrations are parallel.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["transverse","perpendicular"],["transverse","right angle"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":[],"keywords":[["longitudinal","parallel"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 2, 41),
  ('cie-igcse-cs-p4-q8c', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(c) The Earth orbits the Sun at radius 1.51 × 10⁸ km in 365.25 days. Calculate its average speed in km/h.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8c","points":3,"display":"1.08 × 10⁵ km/h","status":"official","parts":[{"id":"time","accepted":[],"keywords":[["365.25","24"],["8766"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"formula","accepted":[],"keywords":[["2","pi","radius","time"],["circumference","time"],["2πr","t"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":["108000","1.08 x 10^5","1.08 × 10^5","1.08e5"],"points":3,"normalizer":"text"}]}'::jsonb, null, 3, 42),
  ('cie-igcse-cs-p4-q8di', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(d)(i) State the stage after the main-sequence stage in the life cycle of the Sun.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8di","points":1,"display":"red giant","status":"official","parts":[{"id":"answer","accepted":["red giant"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 43),
  ('cie-igcse-cs-p4-q8dii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(d)(ii) Explain why the Sun will not become a black hole.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q8dii","points":1,"display":"The Sun does not have enough mass; only very massive stars become black holes.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["not","massive","enough"],["small","mass"],["insufficient","mass"],["only","massive","star","black hole"]],"points":1,"normalizer":"keywords","reviewRecommended":false}]}'::jsonb, null, 1, 44),
  ('cie-igcse-cs-p4-q9ai', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(i) Components T and U have resistances 5.4 Ω and 3.5 Ω. Calculate their combined resistance.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q9ai","points":1,"display":"8.9 Ω","status":"official","parts":[{"id":"answer","accepted":["8.9","8.9 ohm","8.9 Ω"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 45),
  ('cie-igcse-cs-p4-q9aii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(ii) The current in R is 2.7 A and in T is 2.5 A. Determine the current in S and U.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q9aii","points":2,"display":"S = 0.2 A; U = 2.5 A","status":"official","parts":[{"id":"s","accepted":["0.2","0.2 a"],"points":1,"normalizer":"text"},{"id":"u","accepted":["2.5","2.5 a"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 46),
  ('cie-igcse-cs-p4-q9aiii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(a)(iii) State the name of component S.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q9aiii","points":1,"display":"light-emitting diode (LED)","status":"official","parts":[{"id":"answer","accepted":["light emitting diode","light-emitting diode","led"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 47),
  ('cie-igcse-cs-p4-q9bi', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(b)(i) Complete the energy-transfer diagram for the toy car: ___ energy in the battery → ___ energy of the car.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q9bi","points":2,"display":"chemical energy → kinetic energy","status":"official","parts":[{"id":"input","accepted":["chemical","chemical energy"],"points":1,"normalizer":"text"},{"id":"output","accepted":["kinetic","kinetic energy"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 48),
  ('cie-igcse-cs-p4-q9bii', 'cie-igcse-combined-science-paper-4-extended', 'Physics 7–9', '(b)(ii) The car transfers 32 J of useful energy in 10 s and the battery power is 3.6 W. Calculate the efficiency.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p4-q9bii","points":3,"display":"3.2 ÷ 3.6 × 100 = 88.9%","status":"official","parts":[{"id":"power","accepted":[],"keywords":[["32","10"],["3.2"],["power","energy","time"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"formula","accepted":[],"keywords":[["3.2","3.6","100"],["useful","power","input","power"]],"points":1,"normalizer":"keywords","reviewRecommended":false},{"id":"answer","accepted":["88.9","88.9%","88.89","88.888"],"points":3,"normalizer":"text"}]}'::jsonb, null, 3, 49)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

delete from public.test_questions
where test_id = 'cie-igcse-combined-science-paper-4-extended'
  and id not in ('cie-igcse-cs-p4-q1a', 'cie-igcse-cs-p4-q1bi', 'cie-igcse-cs-p4-q1bii', 'cie-igcse-cs-p4-q1c', 'cie-igcse-cs-p4-q1di', 'cie-igcse-cs-p4-q1dii', 'cie-igcse-cs-p4-q2ai', 'cie-igcse-cs-p4-q2aii', 'cie-igcse-cs-p4-q2b', 'cie-igcse-cs-p4-q2c', 'cie-igcse-cs-p4-q2d', 'cie-igcse-cs-p4-q3ai', 'cie-igcse-cs-p4-q3aii', 'cie-igcse-cs-p4-q3bi', 'cie-igcse-cs-p4-q3bii', 'cie-igcse-cs-p4-q4ai', 'cie-igcse-cs-p4-q4aii', 'cie-igcse-cs-p4-q4b', 'cie-igcse-cs-p4-q4ci', 'cie-igcse-cs-p4-q4cii', 'cie-igcse-cs-p4-q5ai', 'cie-igcse-cs-p4-q5aii', 'cie-igcse-cs-p4-q5aiii', 'cie-igcse-cs-p4-q5bi', 'cie-igcse-cs-p4-q5bii', 'cie-igcse-cs-p4-q5biii', 'cie-igcse-cs-p4-q5c', 'cie-igcse-cs-p4-q6a', 'cie-igcse-cs-p4-q6b', 'cie-igcse-cs-p4-q6ci', 'cie-igcse-cs-p4-q6cii', 'cie-igcse-cs-p4-q6di', 'cie-igcse-cs-p4-q6dii', 'cie-igcse-cs-p4-q7ai', 'cie-igcse-cs-p4-q7aii', 'cie-igcse-cs-p4-q7aiii', 'cie-igcse-cs-p4-q7b', 'cie-igcse-cs-p4-q8ai', 'cie-igcse-cs-p4-q8aii', 'cie-igcse-cs-p4-q8bi', 'cie-igcse-cs-p4-q8bii', 'cie-igcse-cs-p4-q8c', 'cie-igcse-cs-p4-q8di', 'cie-igcse-cs-p4-q8dii', 'cie-igcse-cs-p4-q9ai', 'cie-igcse-cs-p4-q9aii', 'cie-igcse-cs-p4-q9aiii', 'cie-igcse-cs-p4-q9bi', 'cie-igcse-cs-p4-q9bii');

create or replace function annotation_segment_distance(
  p_x numeric,
  p_y numeric,
  p_start_x numeric,
  p_start_y numeric,
  p_end_x numeric,
  p_end_y numeric
)
returns numeric
language plpgsql
immutable
as $$
declare
  dx numeric := p_end_x - p_start_x;
  dy numeric := p_end_y - p_start_y;
  length_squared numeric := dx * dx + dy * dy;
  projection numeric;
  nearest_x numeric;
  nearest_y numeric;
begin
  if length_squared = 0 then
    return sqrt(power(p_x - p_start_x, 2) + power(p_y - p_start_y, 2));
  end if;
  projection := greatest(0, least(1, ((p_x - p_start_x) * dx + (p_y - p_start_y) * dy) / length_squared));
  nearest_x := p_start_x + projection * dx;
  nearest_y := p_start_y + projection * dy;
  return sqrt(power(p_x - nearest_x, 2) + power(p_y - nearest_y, 2));
end;
$$;

create or replace function diagram_annotation_details(
  p_question_id text,
  p_answer_key jsonb,
  p_answers jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
stable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  geometry jsonb := coalesce(p_answer_key->'geometry', '{}'::jsonb);
  variant text := coalesce(p_answer_key->>'variant', geometry->>'variant');
  possible numeric := question_points(p_answer_key);
  is_correct boolean := false;
  details jsonb := '{}'::jsonb;
  point_text text;
  x numeric;
  y numeric;
  start_x numeric;
  start_y numeric;
  end_x numeric;
  end_y numeric;
  label_x numeric;
  label_y numeric;
  point_count integer := 0;
  first_y numeric;
  last_y numeric;
  apex_x numeric;
  apex_y numeric;
  start_correct boolean := false;
  peak_correct boolean := false;
  label_correct boolean := false;
begin
  if variant = 'point' then
    x := ray_coordinate(response->>'point', 1);
    y := ray_coordinate(response->>'point', 2);
    is_correct := x is not null and y is not null and annotation_segment_distance(
      x,
      y,
      (geometry->'segment'->'start'->>'x')::numeric,
      (geometry->'segment'->'start'->>'y')::numeric,
      (geometry->'segment'->'end'->>'x')::numeric,
      (geometry->'segment'->'end'->>'y')::numeric
    ) <= (geometry->>'tolerance')::numeric;
    details := jsonb_build_object('onDeceleratingSegment', is_correct);
  elsif variant = 'arrow' then
    start_x := ray_coordinate(response->>'start', 1);
    start_y := ray_coordinate(response->>'start', 2);
    end_x := ray_coordinate(response->>'end', 1);
    end_y := ray_coordinate(response->>'end', 2);
    label_x := ray_coordinate(response->>'label', 1);
    label_y := ray_coordinate(response->>'label', 2);

    start_correct := start_x is not null and start_y is not null and
      sqrt(power(start_x - (geometry->'start'->>'x')::numeric, 2) + power(start_y - (geometry->'start'->>'y')::numeric, 2))
      <= (geometry->>'endpointTolerance')::numeric;
    peak_correct := end_x is not null and end_y is not null and
      sqrt(power(end_x - (geometry->'peak'->>'x')::numeric, 2) + power(end_y - (geometry->'peak'->>'y')::numeric, 2))
      <= (geometry->>'endpointTolerance')::numeric;
    label_correct := label_x is not null and label_y is not null and end_y is not null and
      sqrt(
        power(label_x - (coalesce(start_x, (geometry->'start'->>'x')::numeric) - 0.025), 2) +
        power(label_y - ((coalesce(start_y, (geometry->'start'->>'y')::numeric) + end_y) / 2), 2)
      ) <= (geometry->>'labelTolerance')::numeric;
    is_correct := start_correct and peak_correct and label_correct;
    details := jsonb_build_object(
      'startCorrect', start_correct,
      'peakCorrect', peak_correct,
      'labelCorrect', label_correct
    );
  elsif variant = 'curve' then
    for point_text in
      select value from jsonb_array_elements_text(coalesce(response->'points', '[]'::jsonb)) as points(value)
    loop
      x := ray_coordinate(point_text, 1);
      y := ray_coordinate(point_text, 2);
      if x is not null and y is not null and
        x between (geometry->'plot'->>'minX')::numeric and (geometry->'plot'->>'maxX')::numeric and
        y between (geometry->'plot'->>'minY')::numeric and (geometry->'plot'->>'maxY')::numeric
      then
        point_count := point_count + 1;
        if first_y is null then first_y := y; end if;
        last_y := y;
        if apex_y is null or y < apex_y then
          apex_y := y;
          apex_x := x;
        end if;
      end if;
    end loop;
    is_correct := point_count >= 8 and
      apex_x between (geometry->'optimum'->>'minX')::numeric and (geometry->'optimum'->>'maxX')::numeric and
      first_y - apex_y >= (geometry->>'baselineTolerance')::numeric and
      last_y - apex_y >= (geometry->>'baselineTolerance')::numeric;
    details := jsonb_build_object(
      'enoughPoints', point_count >= 8,
      'optimumCorrect', coalesce(apex_x between (geometry->'optimum'->>'minX')::numeric and (geometry->'optimum'->>'maxX')::numeric, false),
      'bellShape', coalesce(
        first_y - apex_y >= (geometry->>'baselineTolerance')::numeric and
        last_y - apex_y >= (geometry->>'baselineTolerance')::numeric,
        false
      )
    );
  end if;

  return jsonb_build_object(
    'parts',
    jsonb_build_array(
      jsonb_build_object(
        'id', variant,
        'response', response,
        'score', case when is_correct then possible else 0 end,
        'possible', possible,
        'correct', is_correct
      ) || details
    )
  );
end;
$$;

create or replace function answer_score(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns numeric
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
  possible numeric := question_points(p_answer_key);
  raw_score numeric := 0;
  math_details jsonb;
  correct_count integer := 0;
begin
  if source_name = 'questionMap' then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  elsif source_name in ('aiGrade', 'aiSplitGrade') then
    raw_score := coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'mathMultiPart' then
    math_details := math_part_scores(p_question_id, p_answer_key, p_answers);
    if p_answer_key ? 'scoreThresholds' then
      select count(*) into correct_count
      from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value)
      where coalesce((value->>'correct')::boolean, false);

      select coalesce(max((value->>'points')::numeric), 0) into raw_score
      from jsonb_array_elements(coalesce(p_answer_key->'scoreThresholds', '[]'::jsonb)) as thresholds(value)
      where correct_count >= coalesce((value->>'minCorrect')::integer, 0);
      return least(greatest(raw_score, 0), possible);
    end if;
    select coalesce(sum((value->>'score')::numeric), 0) into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'rayDiagram' then
    math_details := ray_diagram_details(p_question_id, p_answer_key, p_answers);
    select coalesce(sum((value->>'score')::numeric), 0) into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'diagramAnnotation' then
    math_details := diagram_annotation_details(p_question_id, p_answer_key, p_answers);
    select coalesce(sum((value->>'score')::numeric), 0) into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'connections' then
    return case when p_response = p_answer_key->>'target' then possible else 0 end;
  elsif source_name in ('textAnswers', 'rwAnswers') then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  elsif source_name = 'choices' then
    return case when p_response = p_answer_key->>'correct' then possible else 0 end;
  elsif source_name = 'colours' then
    return case when lower(p_response) = lower(p_answer_key->>'colour') then possible else 0 end;
  end if;
  return 0;
end;
$$;

create or replace function grading_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
begin
  if p_answer_key->>'source' in ('aiGrade', 'aiSplitGrade') then
    return coalesce(p_answers->'aiGrades'->p_question_id, '{}'::jsonb);
  elsif p_answer_key->>'source' = 'mathMultiPart' then
    return math_part_scores(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'rayDiagram' then
    return ray_diagram_details(p_question_id, p_answer_key, p_answers);
  elsif p_answer_key->>'source' = 'diagramAnnotation' then
    return diagram_annotation_details(p_question_id, p_answer_key, p_answers);
  end if;
  return '{}'::jsonb;
end;
$$;

create or replace function response_display(p_question_id text, p_answer_key jsonb, p_response text)
returns text
language plpgsql
stable
as $$
declare
  response_json jsonb;
  part_key jsonb;
  part_id text;
  raw_json jsonb;
  raw_text text;
  items text[] := array[]::text[];
begin
  if p_response is null or p_response = '' then return 'No answer'; end if;
  if p_answer_key->>'source' = 'mathMultiPart' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then return 'No answer'; end if;
    if jsonb_typeof(response_json) = 'string' then return coalesce(response_json #>> '{}', 'No answer'); end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
    loop
      part_id := part_key->>'id';
      raw_json := response_json->part_id;
      if raw_json is null then
        raw_text := '';
      elsif jsonb_typeof(raw_json) = 'array' then
        select coalesce(string_agg(value, ', ' order by value), '') into raw_text
        from jsonb_array_elements_text(raw_json) as response(value);
      else
        raw_text := response_json->>part_id;
      end if;
      if coalesce(raw_text, '') <> '' then items := array_append(items, part_id || ': ' || raw_text); end if;
    end loop;
    if array_length(items, 1) is null then return 'No answer'; end if;
    return array_to_string(items, '; ');
  elsif p_answer_key->>'source' = 'rayDiagram' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then return 'No answer'; end if;
    return concat_ws(
      '; ',
      case when coalesce(response_json->>'normalEnd', '') <> '' then 'normal: ' || response_json->>'normalEnd' end,
      case when coalesce(response_json->>'labelPoint', '') <> '' then 'label i: ' || response_json->>'labelPoint' end,
      case when coalesce(response_json->>'reflectedEnd', '') <> '' then 'reflected ray: ' || response_json->>'reflectedEnd' end
    );
  elsif p_answer_key->>'source' = 'diagramAnnotation' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then return 'No annotation'; end if;
    return initcap(coalesce(p_answer_key->>'variant', 'diagram')) || ' annotation recorded';
  elsif p_answer_key->>'source' = 'choices' then
    return upper(p_response);
  elsif p_answer_key->>'source' = 'colours' then
    return case lower(p_response)
      when '#ef4444' then 'red'
      when '#f97316' then 'orange'
      when '#facc15' then 'yellow'
      when '#22c55e' then 'green'
      when '#38bdf8' then 'blue'
      when '#a855f7' then 'purple'
      when '#f472b6' then 'pink'
      when '#8b5a2b' then 'brown'
      else p_response
    end;
  end if;
  return p_response;
end;
$$;
