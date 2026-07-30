insert into public.tests (id, title, subject, level, status, total_points, app_path)
values ('cie-igcse-combined-science-paper-3-core', 'CIE IGCSE Combined Science Paper 3 Core', 'Combined Science', 'Core', 'active', 80, '/tests/cie-igcse-combined-science-paper-3-core/start')
on conflict (id) do update set
  title = excluded.title,
  subject = excluded.subject,
  level = excluded.level,
  status = excluded.status,
  total_points = excluded.total_points,
  app_path = excluded.app_path;

insert into public.test_questions (id, test_id, part, prompt, answer_key, transcript_ref, points, position)
values
  ('cie-igcse-cs-p3-q1a', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a) Complete Table 1.1 for the labelled animal and plant cells.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1a","points":4,"display":"A: cell membrane; D: site of aerobic respiration; G: support (storage accepted)","status":"official","parts":[{"id":"aName","accepted":["cell membrane","cell surface membrane"],"points":1,"normalizer":"text"},{"id":"dFunction","accepted":[],"keywords":[["aerobic","respiration"],["site","respiration"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"vacuoleLetter","accepted":["G"],"points":1,"normalizer":"text"},{"id":"vacuoleFunction","accepted":[],"keywords":[["support"],["storage"],["stores","cell sap"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 4, 1),
  ('cie-igcse-cs-p3-q1b', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(b) Complete the order of increasing size between cell and organism using organ, organ system and tissue.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1b","points":2,"display":"cell → tissue → organ → organ system → organism","status":"official","parts":[{"id":"first","accepted":["tissue"],"points":1,"normalizer":"text"},{"id":"second","accepted":["organ"],"points":1,"normalizer":"text"},{"id":"third","accepted":["organ system"],"points":1,"normalizer":"text"}],"scoreThresholds":[{"minCorrect":2,"points":1},{"minCorrect":3,"points":2}]}'::jsonb, null, 2, 2),
  ('cie-igcse-cs-p3-q1ci', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(c)(i) State the name of an upper chamber of the heart.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1ci","points":1,"display":"atrium / atria","status":"official","parts":[{"id":"answer","accepted":["atrium","atria"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 3),
  ('cie-igcse-cs-p3-q1cii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(c)(ii) State the type of blood vessel that transports blood to the heart.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1cii","points":1,"display":"vein","status":"official","parts":[{"id":"answer","accepted":["vein","veins"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 4),
  ('cie-igcse-cs-p3-q1ciii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(c)(iii) State the function of red blood cells.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1ciii","points":1,"display":"transport oxygen","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["transport","oxygen"],["carry","oxygen"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 5),
  ('cie-igcse-cs-p3-q1d', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(d) State one other way, apart from white blood cells, that the human body defends itself against pathogens.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q1d","points":1,"display":"skin / hairs in the nose / mucus / stomach acid","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["skin"],["hair","nose"],["mucus"],["stomach","acid"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 6),
  ('cie-igcse-cs-p3-q2ai', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(i) Complete the sentences to explain the iodine-test results. Only plant X contains ___, showing that photosynthesis requires ___.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2ai","points":2,"display":"starch; carbon dioxide","status":"official","parts":[{"id":"substance","accepted":["starch"],"points":1,"normalizer":"text"},{"id":"requirement","accepted":["carbon dioxide","co2"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 7),
  ('cie-igcse-cs-p3-q2aii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(ii) State the name of the green pigment needed for photosynthesis.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2aii","points":1,"display":"chlorophyll","status":"official","parts":[{"id":"answer","accepted":["chlorophyll"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 8),
  ('cie-igcse-cs-p3-q2bi', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(b)(i) Identify the temperature at which the rate of photosynthesis for plant Q is highest.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2bi","points":1,"display":"28–30 °C","status":"official","parts":[{"id":"answer","accepted":["28","29","30","28 c","29 c","30 c","28 °c","29 °c","30 °c"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 9),
  ('cie-igcse-cs-p3-q2bii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(b)(ii) Desert temperatures are often higher than 40 °C. Explain why plant S would not survive in a desert. Use the word enzyme.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2bii","points":2,"display":"Its enzyme stops working above its optimum, so photosynthesis and glucose production stop.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["enzyme","lower","temperature"],["enzyme","stop"],["enzyme","denature"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["no","photosynthesis"],["no","glucose"],["no","sugar"],["no","carbohydrate"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 10),
  ('cie-igcse-cs-p3-q2ci', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(c)(i) Identify part X on the carpel.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2ci","points":1,"display":"stigma","status":"official","parts":[{"id":"answer","accepted":["stigma"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 11),
  ('cie-igcse-cs-p3-q2cii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(c)(ii) Describe fertilisation in an ovule.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q2cii","points":1,"display":"A pollen nucleus fuses with a nucleus in the ovule.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["pollen","nucleus","fuses","nucleus","ovule"],["male","nucleus","fuses","female","nucleus"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 12),
  ('cie-igcse-cs-p3-q3ai', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(i) Identify the producer in the food web.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q3ai","points":1,"display":"phytoplankton","status":"official","parts":[{"id":"answer","accepted":["phytoplankton"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 13),
  ('cie-igcse-cs-p3-q3aii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(ii) Select each term that describes the puffin in the food web.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q3aii","points":2,"display":"carnivore; tertiary consumer","status":"official","parts":[{"id":"selected","accepted":["carnivore"],"points":1,"normalizer":"contains"},{"id":"selected","accepted":["tertiary consumer"],"points":1,"normalizer":"contains"}]}'::jsonb, null, 2, 14),
  ('cie-igcse-cs-p3-q3aiii', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(iii) Pollution can kill squid. Explain how this may reduce the number of foxes.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q3aiii","points":2,"display":"Puffins have less squid to eat, then foxes have fewer puffins to eat.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["less","squid","puffin"],["fewer","squid","puffin"],["puffin","less","food"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["less","puffin","fox"],["fewer","puffin","fox"],["fox","less","food"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 15),
  ('cie-igcse-cs-p3-q3aiv', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(a)(iv) State two reasons, other than pollution, why squid may become endangered.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q3aiv","points":2,"display":"Any two approved causes, such as climate change and overharvesting.","status":"official","parts":[{"id":"reason1","accepted":[],"keywords":[["climate","change"],["habitat","destruction"],["hunting"],["overharvesting"],["introduced","species"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"reason2","accepted":[],"keywords":[["climate","change"],["habitat","destruction"],["hunting"],["overharvesting"],["introduced","species"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 16),
  ('cie-igcse-cs-p3-q3b', 'cie-igcse-combined-science-paper-3-core', 'Biology 1–3', '(b) Complete the definition: A decomposer gets its ___ from dead or waste ___ material.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q3b","points":2,"display":"energy; organic","status":"official","parts":[{"id":"first","accepted":["energy"],"points":1,"normalizer":"text"},{"id":"second","accepted":["organic"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 17),
  ('cie-igcse-cs-p3-q4a', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(a) State the name of the positive electrode in the electrolysis apparatus.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4a","points":1,"display":"anode","status":"official","parts":[{"id":"answer","accepted":["anode"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 18),
  ('cie-igcse-cs-p3-q4b', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b) Identify the gases produced at the positive and negative electrodes.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4b","points":2,"display":"positive: chlorine; negative: hydrogen","status":"official","parts":[{"id":"positive","accepted":["chlorine","cl2"],"points":1,"normalizer":"text"},{"id":"negative","accepted":["hydrogen","h2"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 19),
  ('cie-igcse-cs-p3-q4ci', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(c)(i) State what is meant by an alkali.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4ci","points":1,"display":"a soluble base","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["soluble","base"],["soluble","metal","oxide"],["soluble","metal","hydroxide"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 20),
  ('cie-igcse-cs-p3-q4cii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(c)(ii) Methyl orange changes from orange to which colour in an alkali?', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4cii","points":1,"display":"yellow","status":"official","parts":[{"id":"answer","accepted":["yellow"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 21),
  ('cie-igcse-cs-p3-q4di', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(d)(i) Complete the word equation: sodium hydroxide + sulfuric acid → ___ + ___.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4di","points":1,"display":"sodium sulfate + water","status":"official","parts":[{"id":"product1","accepted":["sodium sulfate"],"points":0.5,"normalizer":"text"},{"id":"product2","accepted":["water"],"points":0.5,"normalizer":"text"}],"scoreThresholds":[{"minCorrect":2,"points":1}]}'::jsonb, null, 1, 22),
  ('cie-igcse-cs-p3-q4dii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(d)(ii) State what is meant by an exothermic reaction.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q4dii","points":2,"display":"Thermal energy is transferred to the surroundings, increasing their temperature.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["thermal","energy","surroundings"],["heat","surroundings"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["surroundings","temperature","increase"],["surroundings","warmer"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 23),
  ('cie-igcse-cs-p3-q5a', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(a) State one use of refinery gas and one use of gasoline.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5a","points":2,"display":"refinery gas: heating/cooking; gasoline: fuel for cars, vans or lorries","status":"official","parts":[{"id":"refineryGas","accepted":[],"keywords":[["heating"],["cooking"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"gasoline","accepted":[],"keywords":[["car"],["van"],["lorry"],["vehicle"],["fuel"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 24),
  ('cie-igcse-cs-p3-q5bi', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b)(i) State the molecular formula of hydrocarbon A.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5bi","points":1,"display":"C3H8","status":"official","parts":[{"id":"answer","accepted":["c3h8","C3H8"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 25),
  ('cie-igcse-cs-p3-q5bii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b)(ii) State which hydrocarbon is saturated and give a reason.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5bii","points":1,"display":"A, because all carbon–carbon bonds are single.","status":"official","parts":[{"id":"hydrocarbon","accepted":["A"],"points":0.5,"normalizer":"text"},{"id":"reason","accepted":[],"keywords":[["all","carbon","carbon","single"],["all","c c","single"]],"points":0.5,"normalizer":"keywords","reviewRecommended":true}],"scoreThresholds":[{"minCorrect":2,"points":1}]}'::jsonb, null, 1, 26),
  ('cie-igcse-cs-p3-q5biii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b)(iii) State the chemical test used to distinguish A and B, and the observation for each.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5biii","points":2,"display":"Aqueous bromine remains orange with A and is decolourised by B.","status":"official","parts":[{"id":"test","accepted":[],"keywords":[["aqueous","bromine"],["bromine","water"],["br2"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"aObservation","accepted":[],"keywords":[["stays","orange"],["remains","orange"]],"points":0.5,"normalizer":"keywords","reviewRecommended":true},{"id":"bObservation","accepted":[],"keywords":[["decolour"],["colorless"],["colourless"]],"points":0.5,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 27),
  ('cie-igcse-cs-p3-q5c', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(c) Complete the balanced equation, including missing state symbols: CH4(g) + ___ O2(___) → CO2(___) + ___ H2O(l).', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5c","points":2,"display":"CH4(g) + 2O2(g) → CO2(g) + 2H2O(l)","status":"official","parts":[{"id":"coefficients","accepted":["2, 2","2 2","2,2"],"points":1,"normalizer":"text"},{"id":"states","accepted":["g, g","g g","g,g"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 28),
  ('cie-igcse-cs-p3-q5d', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(d) State one physical property of methane.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q5d","points":1,"display":"low melting point / low boiling point / low electrical conductivity","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["low","melting","point"],["low","boiling","point"],["low","electrical","conductivity"],["poor","electrical","conductor"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 29),
  ('cie-igcse-cs-p3-q6a', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(a) For an iron atom shown as ⁵⁶₂₆Fe, deduce the number of electrons and neutrons.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6a","points":2,"display":"26 electrons; 30 neutrons","status":"official","parts":[{"id":"electrons","accepted":["26"],"points":1,"normalizer":"text"},{"id":"neutrons","accepted":["30"],"points":1,"normalizer":"text"}]}'::jsonb, null, 2, 30),
  ('cie-igcse-cs-p3-q6bi', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b)(i) Describe how Fe²⁺ ions are formed from iron atoms.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6bi","points":1,"display":"An iron atom loses two electrons.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["loses","two","electron"],["lose","2","electron"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 31),
  ('cie-igcse-cs-p3-q6bii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(b)(ii) Describe what is observed when aqueous sodium hydroxide is added to aqueous iron(II) ions.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6bii","points":2,"display":"A green precipitate forms.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["green"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["precipitate"],["ppt"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 32),
  ('cie-igcse-cs-p3-q6ci', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(c)(i) Explain why iron reacting with dilute hydrochloric acid is a chemical change.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6ci","points":1,"display":"A new substance is made.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["new","substance"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 33),
  ('cie-igcse-cs-p3-q6cii', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(c)(ii) State the test for hydrogen and the positive result.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6cii","points":1,"display":"A lighted splint gives a squeaky pop.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["lighted","splint","squeaky","pop"],["burning","splint","pop"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 34),
  ('cie-igcse-cs-p3-q6d', 'cie-igcse-combined-science-paper-3-core', 'Chemistry 4–6', '(d) Describe what is meant by a catalyst.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q6d","points":2,"display":"A catalyst increases reaction rate and is unchanged at the end.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["increase","rate"],["speeds","reaction"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["unchanged","end"],["not","used","up"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 35),
  ('cie-igcse-cs-p3-q7ai', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(i) State the name of component X in the heater circuit.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7ai","points":1,"display":"electric motor","status":"official","parts":[{"id":"answer","accepted":["electric motor","motor"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 36),
  ('cie-igcse-cs-p3-q7aii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(ii) The current in component X is 0.5 A and the current in the heater is 8.3 A. Select the current from the source.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7aii","points":1,"display":"8.8 A","status":"official","parts":[{"id":"answer","accepted":["8.8 A"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 37),
  ('cie-igcse-cs-p3-q7aiii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(iii) A 2.0 kW heater runs for 5.5 hours at $0.15 per kWh. Calculate the cost.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7aiii","points":2,"display":"$1.65 ($1.70 accepted)","status":"official","parts":[{"id":"working","accepted":[],"keywords":[["0.15","2.0","5.5"],["cost","power","time"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":["1.65","1.70","$1.65","$1.70"],"points":2,"normalizer":"text"}]}'::jsonb, null, 2, 38),
  ('cie-igcse-cs-p3-q7b', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(b) A wind turbine produces 2200 W. Calculate the energy transferred in 15 seconds.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7b","points":2,"display":"33 000 J","status":"official","parts":[{"id":"working","accepted":[],"keywords":[["2200","15"],["energy","power","time"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":["33000","33 000","33000 j"],"points":2,"normalizer":"text"}]}'::jsonb, null, 2, 39),
  ('cie-igcse-cs-p3-q7ci', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(c)(i) State the colour of visible light with the longest wavelength.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7ci","points":1,"display":"red","status":"official","parts":[{"id":"answer","accepted":["red"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 40),
  ('cie-igcse-cs-p3-q7cii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(c)(ii) State one other region, apart from visible light, in which most solar energy is radiated.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q7cii","points":1,"display":"infrared or ultraviolet","status":"official","parts":[{"id":"answer","accepted":["infrared","infra-red","ultraviolet","ultra-violet","uv","ir"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 41),
  ('cie-igcse-cs-p3-q8ai', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(i) A spacecraft has a mass of 3.1 × 10³ kg. Calculate its weight on Earth. Include the unit.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8ai","points":3,"display":"30 000 N (30.38 kN or 30.4 kN accepted)","status":"official","parts":[{"id":"working","accepted":[],"keywords":[["weight","mass","gravitational"],["w","m","g"],["3.1","10","9.8"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":["30000 n","30 000 n","30 x 10^3 n","30 × 10^3 n","30380 n","30400 n","30.38 kn","30.4 kn"],"points":3,"normalizer":"text"}]}'::jsonb, null, 3, 42),
  ('cie-igcse-cs-p3-q8aii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(ii) State what is meant by accelerates.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8aii","points":1,"display":"increases in speed","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["increase","speed"],["gets","faster"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 1, 43),
  ('cie-igcse-cs-p3-q8aiii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(iii) Calculate the number of hours in 3.2 days.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8aiii","points":1,"display":"76.8 h","status":"official","parts":[{"id":"answer","accepted":["76.8","76.8 h","76 h 48 min"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 44),
  ('cie-igcse-cs-p3-q8aiv', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(iv) The Earth–Moon distance is 384 000 km. Calculate the spacecraft''s average speed using your answer to (a)(iii).', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8aiv","points":2,"display":"5000 km/h","status":"official","parts":[{"id":"working","accepted":[],"keywords":[["384000","76.8"],["speed","distance","time"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":["5000","5000 km/h","5000 km h"],"points":2,"normalizer":"text"}]}'::jsonb, null, 2, 45),
  ('cie-igcse-cs-p3-q8av', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a)(v) State whether radio waves travel faster, slower or at the same speed as visible light, and give a reason.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8av","points":1,"display":"same speed; both are electromagnetic waves, which travel at the same speed","status":"official","parts":[{"id":"speed","accepted":["same","same speed","at the same speed"],"points":0.5,"normalizer":"text"},{"id":"reason","accepted":[],"keywords":[["both","electromagnetic","same","speed"],["all","electromagnetic","same","speed"]],"points":0.5,"normalizer":"keywords","reviewRecommended":true}],"scoreThresholds":[{"minCorrect":2,"points":1}]}'::jsonb, null, 1, 46),
  ('cie-igcse-cs-p3-q8b', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(b) State the name of the planet that orbits closest to the Sun.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8b","points":1,"display":"Mercury","status":"official","parts":[{"id":"answer","accepted":["Mercury"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 47),
  ('cie-igcse-cs-p3-q8c', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(c) State the name of the galaxy that contains the Sun.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q8c","points":1,"display":"Milky Way / the Milky Way","status":"official","parts":[{"id":"answer","accepted":["Milky Way","the Milky Way"],"points":1,"normalizer":"text"}]}'::jsonb, null, 1, 48),
  ('cie-igcse-cs-p3-q9a', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(a) Use Table 9.1 to state the electrical property of poly(ethene) and give a reason.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q9a","points":1,"display":"insulator, because it is a plastic/polymer and not a metal or carbon","status":"official","parts":[{"id":"property","accepted":["insulator"],"points":0.5,"normalizer":"text"},{"id":"reason","accepted":[],"keywords":[["plastic"],["polymer"],["not","metal"],["not","carbon"]],"points":0.5,"normalizer":"keywords","reviewRecommended":true}],"scoreThresholds":[{"minCorrect":2,"points":1}]}'::jsonb, null, 1, 49),
  ('cie-igcse-cs-p3-q9b', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(b) Predict what happens to a 0.9 g/cm³ poly(ethene) ball in water and in ethanol. Explain using Table 9.1.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q9b","points":2,"display":"It floats in water and sinks in ethanol because its density lies between theirs.","status":"official","parts":[{"id":"answer","accepted":[],"keywords":[["water","float"],["floats","water"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":[],"keywords":[["ethanol","sink"],["sinks","ethanol"],["density","between","water","ethanol"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 50),
  ('cie-igcse-cs-p3-q9c', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(c) Identify which particle diagram shows ethanol and sulfur at 25 °C, and explain in terms of particles.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q9c","points":2,"display":"ethanol Y; sulfur X; a solid is regular/more closely packed and a liquid is irregular/less closely packed","status":"official","parts":[{"id":"ethanol","accepted":["Y"],"points":0.5,"normalizer":"text"},{"id":"sulfur","accepted":["X"],"points":0.5,"normalizer":"text"},{"id":"explanation","accepted":[],"keywords":[["sulfur","solid","ethanol","liquid"],["solid","regular","liquid","irregular"],["solid","closely","packed","liquid","less"]],"points":1,"normalizer":"keywords","reviewRecommended":true}]}'::jsonb, null, 2, 51),
  ('cie-igcse-cs-p3-q9di', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(d)(i) An aluminium mirror has a mass of 9.0 g and density 2.7 g/cm³. Calculate its volume.', '{"source":"mathMultiPart","id":"cie-igcse-cs-p3-q9di","points":2,"display":"3.3 cm³","status":"official","parts":[{"id":"working","accepted":[],"keywords":[["9.0","2.7"],["volume","mass","density"]],"points":1,"normalizer":"keywords","reviewRecommended":true},{"id":"answer","accepted":["3.3","3.33","3.333","3.3 cm3","3.33 cm3","3.333 cm3"],"points":2,"normalizer":"text"}]}'::jsonb, null, 2, 52),
  ('cie-igcse-cs-p3-q9dii', 'cie-igcse-combined-science-paper-3-core', 'Physics 7–9', '(d)(ii) Draw the normal and place i at the angle of incidence. Then draw the reflected ray to show how the eye sees the image.', '{"source":"rayDiagram","id":"cie-igcse-cs-p3-q9dii","points":2,"display":"Normal and angle i; reflected ray to eye","status":"official","geometry":{"incidence":{"x":0.826,"y":0.485},"incidentSource":{"x":0.36,"y":0.1825},"eye":{"x":0.36,"y":0.8175},"normalTolerance":0.045,"labelRegion":{"minX":0.59,"maxX":0.78,"minY":0.34,"maxY":0.49},"eyeTolerance":0.085,"angleToleranceDegrees":10}}'::jsonb, null, 2, 53)
on conflict (id) do update set
  test_id = excluded.test_id,
  part = excluded.part,
  prompt = excluded.prompt,
  answer_key = excluded.answer_key,
  transcript_ref = excluded.transcript_ref,
  points = excluded.points,
  position = excluded.position;

create or replace function math_part_scores(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  part_key jsonb;
  part_id text;
  mode text;
  possible numeric;
  raw_json jsonb;
  raw_text text;
  raw_norm text;
  expected_norm text;
  is_part_correct boolean;
  items jsonb := '[]'::jsonb;
begin
  for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
  loop
    part_id := part_key->>'id';
    mode := coalesce(part_key->>'normalizer', 'text');
    possible := coalesce((part_key->>'points')::numeric, 0);
    is_part_correct := false;
    raw_text := '';
    raw_norm := '';

    if mode in ('set', 'contains') then
      raw_json := coalesce(p_answers->p_question_id->part_id, '[]'::jsonb);
      if jsonb_typeof(raw_json) <> 'array' then
        raw_json := '[]'::jsonb;
      end if;

      select coalesce(string_agg(normalize_math_answer(value, 'text'), ',' order by normalize_math_answer(value, 'text')), '')
      into raw_norm
      from jsonb_array_elements_text(raw_json) as response(value);

      select coalesce(string_agg(normalize_math_answer(value, 'text'), ',' order by normalize_math_answer(value, 'text')), '')
      into expected_norm
      from jsonb_array_elements_text(coalesce(part_key->'accepted', '[]'::jsonb)) as accepted(value);

      select coalesce(string_agg(value, ', ' order by value), '')
      into raw_text
      from jsonb_array_elements_text(raw_json) as response(value);

      if mode = 'contains' then
        is_part_correct := exists (
          select 1
          from jsonb_array_elements_text(raw_json) as response(value)
          cross join jsonb_array_elements_text(coalesce(part_key->'accepted', '[]'::jsonb)) as accepted(value)
          where normalize_math_answer(response.value, 'text') = normalize_math_answer(accepted.value, 'text')
        );
      else
        is_part_correct := raw_norm <> '' and raw_norm = expected_norm;
      end if;
    elsif mode = 'keywords' then
      raw_text := case
        when part_id = 'answer' and jsonb_typeof(p_answers->p_question_id) = 'string'
          then coalesce(p_answers->>p_question_id, '')
        else coalesce(p_answers->p_question_id->>part_id, '')
      end;
      raw_norm := normalize_math_answer(raw_text, 'text');
      is_part_correct := raw_norm <> '' and exists (
        select 1
        from jsonb_array_elements(coalesce(part_key->'keywords', '[]'::jsonb)) as keyword_groups(group_value)
        where not exists (
          select 1
          from jsonb_array_elements_text(keyword_groups.group_value) as words(word)
          where position(normalize_math_answer(words.word, 'text') in raw_norm) = 0
        )
      );
    elsif mode = 'arrowDown' then
      raw_text := coalesce(p_answers->p_question_id->>part_id, '');
      raw_norm := normalize_math_answer(raw_text, 'text');
      is_part_correct := raw_norm = 'down';
    else
      raw_text := case
        when part_id = 'answer' and jsonb_typeof(p_answers->p_question_id) = 'string'
          then coalesce(p_answers->>p_question_id, '')
        else coalesce(p_answers->p_question_id->>part_id, '')
      end;
      raw_norm := normalize_math_answer(raw_text, mode);
      is_part_correct := raw_norm <> '' and exists (
        select 1
        from jsonb_array_elements_text(coalesce(part_key->'accepted', '[]'::jsonb)) as accepted(value)
        where normalize_math_answer(value, mode) = raw_norm
      );
    end if;

    items := items || jsonb_build_array(jsonb_build_object(
      'id', part_id,
      'response', raw_text,
      'score', case when is_part_correct then possible else 0 end,
      'possible', possible,
      'correct', is_part_correct,
      'normalizer', mode,
      'reviewRecommended', coalesce((part_key->>'reviewRecommended')::boolean, mode in ('keywords', 'arrowDown'))
    ));
  end loop;

  return jsonb_build_object('parts', items);
end;
$$;

create or replace function ray_coordinate(p_value text, p_axis integer)
returns numeric
language plpgsql
immutable
as $$
declare
  coordinate text;
begin
  coordinate := btrim(split_part(coalesce(p_value, ''), ',', p_axis));
  if coordinate !~ '^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$' then
    return null;
  end if;
  return coordinate::numeric;
end;
$$;

create or replace function ray_diagram_details(p_question_id text, p_answer_key jsonb, p_answers jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  response jsonb := coalesce(p_answers->p_question_id, '{}'::jsonb);
  geometry jsonb := coalesce(p_answer_key->'geometry', '{}'::jsonb);
  incidence_x numeric := coalesce((geometry->'incidence'->>'x')::numeric, 0);
  incidence_y numeric := coalesce((geometry->'incidence'->>'y')::numeric, 0);
  source_x numeric := coalesce((geometry->'incidentSource'->>'x')::numeric, 0);
  source_y numeric := coalesce((geometry->'incidentSource'->>'y')::numeric, 0);
  eye_x numeric := coalesce((geometry->'eye'->>'x')::numeric, 0);
  eye_y numeric := coalesce((geometry->'eye'->>'y')::numeric, 0);
  normal_tolerance numeric := coalesce((geometry->>'normalTolerance')::numeric, 0.045);
  eye_tolerance numeric := coalesce((geometry->>'eyeTolerance')::numeric, 0.085);
  angle_tolerance numeric := radians(coalesce((geometry->>'angleToleranceDegrees')::numeric, 10));
  normal_x numeric := ray_coordinate(response->>'normalEnd', 1);
  normal_y numeric := ray_coordinate(response->>'normalEnd', 2);
  label_x numeric := ray_coordinate(response->>'labelPoint', 1);
  label_y numeric := ray_coordinate(response->>'labelPoint', 2);
  reflected_x numeric := ray_coordinate(response->>'reflectedEnd', 1);
  reflected_y numeric := ray_coordinate(response->>'reflectedEnd', 2);
  normal_correct boolean;
  label_correct boolean;
  reaches_eye boolean;
  angle_correct boolean;
  incident_angle double precision;
  reflection_angle double precision;
begin
  normal_correct := normal_x is not null and normal_y is not null
    and normal_x < incidence_x
    and abs(normal_y - incidence_y) <= normal_tolerance;
  label_correct := label_x is not null and label_y is not null
    and label_x between (geometry->'labelRegion'->>'minX')::numeric and (geometry->'labelRegion'->>'maxX')::numeric
    and label_y between (geometry->'labelRegion'->>'minY')::numeric and (geometry->'labelRegion'->>'maxY')::numeric;
  reaches_eye := reflected_x is not null and reflected_y is not null
    and sqrt(power(reflected_x - eye_x, 2) + power(reflected_y - eye_y, 2)) <= eye_tolerance;
  incident_angle := atan2(abs(source_y - incidence_y)::double precision, abs(source_x - incidence_x)::double precision);
  reflection_angle := case
    when reflected_x is null or reflected_y is null then null
    else atan2(abs(reflected_y - incidence_y)::double precision, abs(reflected_x - incidence_x)::double precision)
  end;
  angle_correct := reflection_angle is not null and abs(reflection_angle - incident_angle) <= angle_tolerance;

  return jsonb_build_object(
    'parts', jsonb_build_array(
      jsonb_build_object(
        'id', 'normal-and-label',
        'response', concat_ws('; ', response->>'normalEnd', response->>'labelPoint'),
        'score', case when normal_correct and label_correct then 1 else 0 end,
        'possible', 1,
        'correct', normal_correct and label_correct,
        'normalCorrect', normal_correct,
        'labelCorrect', label_correct
      ),
      jsonb_build_object(
        'id', 'reflected-ray',
        'response', coalesce(response->>'reflectedEnd', ''),
        'score', case when reaches_eye and angle_correct then 1 else 0 end,
        'possible', 1,
        'correct', reaches_eye and angle_correct,
        'reachesEye', reaches_eye,
        'angleCorrect', angle_correct
      )
    )
  );
end;
$$;

create or replace function answer_response(p_answer_key jsonb, p_answers jsonb)
returns text
language plpgsql
stable
as $$
declare
  source_name text := p_answer_key->>'source';
begin
  if source_name = 'questionMap' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name = 'aiGrade' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name = 'aiSplitGrade' then
    return coalesce(p_answers->>(p_answer_key->>'id'), '');
  elsif source_name in ('mathMultiPart', 'rayDiagram') then
    return coalesce((p_answers->(p_answer_key->>'id'))::text, '');
  elsif source_name = 'connections' then
    return coalesce(p_answers->'connections'->>(p_answer_key->>'object'), '');
  elsif source_name = 'textAnswers' then
    return coalesce(p_answers->'textAnswers'->>(p_answer_key->>'id'), '');
  elsif source_name = 'choices' then
    return coalesce(p_answers->'choices'->>(p_answer_key->>'id'), '');
  elsif source_name = 'colours' then
    return coalesce(p_answers->'colours'->>(p_answer_key->>'region'), '');
  elsif source_name = 'rwAnswers' then
    return coalesce(p_answers->'rwAnswers'->>(p_answer_key->>'id'), '');
  end if;
  return '';
end;
$$;

create or replace function question_points(p_answer_key jsonb)
returns numeric
language sql
immutable
as $$
  select coalesce(nullif(p_answer_key->>'points', '')::numeric, 1);
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
  elsif source_name = 'aiGrade' then
    raw_score := coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'aiSplitGrade' then
    raw_score := coalesce((p_answers->'aiGrades'->p_question_id->>'score')::numeric, 0);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'mathMultiPart' then
    math_details := math_part_scores(p_question_id, p_answer_key, p_answers);
    if p_answer_key ? 'scoreThresholds' then
      select count(*)
      into correct_count
      from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value)
      where coalesce((value->>'correct')::boolean, false);

      select coalesce(max((value->>'points')::numeric), 0)
      into raw_score
      from jsonb_array_elements(coalesce(p_answer_key->'scoreThresholds', '[]'::jsonb)) as thresholds(value)
      where correct_count >= coalesce((value->>'minCorrect')::integer, 0);

      return least(greatest(raw_score, 0), possible);
    end if;
    select coalesce(sum((value->>'score')::numeric), 0)
    into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'rayDiagram' then
    math_details := ray_diagram_details(p_question_id, p_answer_key, p_answers);
    select coalesce(sum((value->>'score')::numeric), 0)
    into raw_score
    from jsonb_array_elements(coalesce(math_details->'parts', '[]'::jsonb)) as parts(value);
    return least(greatest(raw_score, 0), possible);
  elsif source_name = 'connections' then
    return case when p_response = p_answer_key->>'target' then possible else 0 end;
  elsif source_name = 'textAnswers' then
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
  elsif source_name = 'rwAnswers' then
    if normalize_answer(p_response) in (
      select normalize_answer(value) from jsonb_array_elements_text(p_answer_key->'accepted') as accepted(value)
    ) then
      return possible;
    end if;
    return 0;
  end if;
  return 0;
end;
$$;

create or replace function is_correct_answer(p_question_id text, p_answer_key jsonb, p_response text, p_answers jsonb default '{}'::jsonb)
returns boolean
language plpgsql
stable
as $$
begin
  return answer_score(p_question_id, p_answer_key, p_response, p_answers) >= question_points(p_answer_key);
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
  if p_response is null or p_response = '' then
    return 'No answer';
  end if;
  if p_answer_key->>'source' = 'mathMultiPart' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then
      return 'No answer';
    end if;
    if jsonb_typeof(response_json) = 'string' then
      return coalesce(response_json #>> '{}', 'No answer');
    end if;
    for part_key in select value from jsonb_array_elements(coalesce(p_answer_key->'parts', '[]'::jsonb))
    loop
      part_id := part_key->>'id';
      raw_json := response_json->part_id;
      if raw_json is null then
        raw_text := '';
      elsif jsonb_typeof(raw_json) = 'array' then
        select coalesce(string_agg(value, ', ' order by value), '')
        into raw_text
        from jsonb_array_elements_text(raw_json) as response(value);
      else
        raw_text := response_json->>part_id;
      end if;
      if coalesce(raw_text, '') <> '' then
        items := array_append(items, part_id || ': ' || raw_text);
      end if;
    end loop;
    if array_length(items, 1) is null then
      return 'No answer';
    end if;
    return array_to_string(items, '; ');
  end if;
  if p_answer_key->>'source' = 'rayDiagram' then
    response_json := p_response::jsonb;
    if response_json = '{}'::jsonb then
      return 'No answer';
    end if;
    return concat_ws(
      '; ',
      case when coalesce(response_json->>'normalEnd', '') <> '' then 'normal: ' || response_json->>'normalEnd' end,
      case when coalesce(response_json->>'labelPoint', '') <> '' then 'label i: ' || response_json->>'labelPoint' end,
      case when coalesce(response_json->>'reflectedEnd', '') <> '' then 'reflected ray: ' || response_json->>'reflectedEnd' end
    );
  end if;
  if p_answer_key->>'source' = 'choices' then
    return upper(p_response);
  end if;
  if p_answer_key->>'source' = 'colours' then
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
