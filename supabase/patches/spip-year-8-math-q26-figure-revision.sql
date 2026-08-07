-- SPIP Year 8 Math: recalibrate Q26 geometry for the replacement figure.
update public.test_questions
set answer_key = '{"source":"geometryConstruction","id":"spip-y8m-q26","points":2,"display":"Regular pentagon with 6 cm sides and 108 degree angles","variant":"regularPentagon","givenVertices":[{"x":0.176,"y":0.07},{"x":0.679,"y":0.07},{"x":0.835,"y":0.622}],"aspectRatio":0.867,"sideTolerance":0.008,"angleToleranceDegrees":1,"closeTolerance":0.025}'::jsonb
where id = 'spip-y8m-q26'
  and test_id = 'spip-year-8-math-pre';
