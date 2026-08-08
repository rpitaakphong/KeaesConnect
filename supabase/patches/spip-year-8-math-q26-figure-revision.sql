-- SPIP Year 8 Math: recalibrate Q26 geometry for the replacement figure.
update public.test_questions
set
  prompt = 'The diagram shows two sides of a regular pentagon. Draw three more straight lines to complete the pentagon.',
  answer_key = '{"source":"geometryConstruction","id":"spip-y8m-q26","points":2,"display":"Complete regular pentagon with 6 cm sides and 108 degree angles (2 marks or 0)","variant":"regularPentagon","givenVertices":[{"x":0.176,"y":0.07},{"x":0.679,"y":0.07},{"x":0.835,"y":0.622}],"aspectRatio":0.867,"sideTolerance":0.008,"angleToleranceDegrees":1,"closeTolerance":0.025}'::jsonb
where id = 'spip-y8m-q26'
  and test_id = 'spip-year-8-math-pre';
