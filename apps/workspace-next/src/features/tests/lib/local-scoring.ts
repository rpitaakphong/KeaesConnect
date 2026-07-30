import type { SubmitResult, TestAnswers, TestDefinition, TestQuestion } from "@/features/tests/lib/types";

export function scoreTestLocally(test: TestDefinition, answers: TestAnswers): SubmitResult {
  const sections = Object.fromEntries(test.sections.map((section) => {
    const rows = section.questions.map((question) => {
      const scored = scoreQuestion(question, answers[question.id], answers);
      return {
        part: section.label,
        prompt: question.prompt,
        response: formatResponse(answers[question.id]),
        correctAnswer: question.grading?.display || "",
        correct: scored.score >= scored.possible,
        score: scored.score,
        possible: scored.possible,
        gradingDetails: scored.details,
      };
    });
    return [section.id, rows];
  }));
  const possible = test.sections.reduce((sum, section) => sum + section.questions.reduce((partSum, question) => partSum + question.points, 0), 0);
  const total = Object.values(sections)
    .flat()
    .reduce((sum, row) => sum + Number(row.score || 0), 0);
  return {
    attemptId: "demo",
    total,
    possible,
    sections,
  };
}

function scoreQuestion(question: TestQuestion, answer: unknown, answers: TestAnswers) {
  if (question.type === "rayDiagram") return scoreRayDiagram(question, answer);
  if (question.type === "diagramAnnotation") return scoreDiagramAnnotation(question, answer);
  if (question.type === "biologicalDrawing") return scoreBiologicalDrawing(question, answer);
  if (question.type === "practicalGraph") return scorePracticalGraph(question, answer, answers);
  if (question.type === "virtualMeasurement") return scoreVirtualMeasurement(question, answer);
  if (!question.grading) return { score: 0, possible: question.points, details: { parts: [] } };
  if (question.grading.mode === "aiSplit") {
    const raw = typeof answer === "string" ? answer : "";
    const contentCorrect = question.grading.contentTerms.some((term) => normalize(raw).includes(normalize(term)));
    const writingCorrect = normalize(raw).split(/\s+/).filter(Boolean).length >= 2;
    const contentScore = contentCorrect ? 0.5 : 0;
    const writingScore = writingCorrect ? 0.5 : 0;
    return {
      score: contentScore + writingScore,
      possible: question.points,
      details: {
        contentCorrect,
        writingCorrect,
        contentScore,
        writingScore,
        score: contentScore + writingScore,
        feedback: "Local preview split score.",
      },
    };
  }
  if (question.grading.mode === "dependent") return scoreDependentQuestion(question, answer, answers);
  const answerMap = question.type === "singleChoice"
    ? question.responseShape === "object" && typeof answer === "object" && answer
      ? answer as Record<string, string | string[]>
      : { answer: typeof answer === "string" ? answer : "" }
    : question.type === "text"
      ? { answer: typeof answer === "string" ? answer : "" }
      : typeof answer === "object" && answer ? answer as Record<string, string | string[]> : {};
  const parts = question.grading.parts.map((part) => {
    const raw = answerMap[part.id] || "";
    const correct = isCorrectPart(raw, part);
    return {
      id: part.id,
      response: raw,
      score: correct ? part.points : 0,
      possible: part.points,
      correct,
      normalizer: part.normalizer || "text",
      reviewRecommended: part.reviewRecommended ?? (part.normalizer === "keywords" || part.normalizer === "arrowDown"),
    };
  });
  const thresholdScore = question.grading.scoreThresholds?.length
    ? scoreByThreshold(parts.filter((part) => part.correct).length, question.grading.scoreThresholds)
    : null;
  const investigationScore = question.grading.scoringStrategy === "investigationPlan"
    ? scoreInvestigationPlan(parts, question.grading.parts)
    : null;
  const rawScore = investigationScore ?? thresholdScore ?? parts.reduce((sum, part) => sum + part.score, 0);
  return {
    score: Math.min(rawScore, question.points),
    possible: question.points,
    details: { parts },
  };
}

function scoreDiagramAnnotation(question: Extract<TestQuestion, { type: "diagramAnnotation" }>, answer: unknown) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const geometry = question.geometry;
  let correct = false;
  const components: Record<string, boolean> = {};

  if (geometry.variant === "point") {
    const point = parsePoint(values.point);
    const { start, end } = geometry.segment;
    const segmentDistance = point ? distanceToSegment(point, start, end) : Number.POSITIVE_INFINITY;
    correct = segmentDistance <= geometry.tolerance;
    components.onDeceleratingSegment = correct;
  } else if (geometry.variant === "arrow") {
    const start = parsePoint(values.start);
    const end = parsePoint(values.end);
    const label = parsePoint(values.label);
    const startCorrect = Boolean(start && distance(start, geometry.start) <= geometry.endpointTolerance);
    const endCorrect = Boolean(end && distance(end, geometry.peak) <= geometry.endpointTolerance);
    const labelCorrect = Boolean(label && end && distance(label, {
      x: (start?.x ?? geometry.start.x) - 0.025,
      y: ((start?.y ?? geometry.start.y) + end.y) / 2,
    }) <= geometry.labelTolerance);
    components.startCorrect = startCorrect;
    components.peakCorrect = endCorrect;
    components.labelCorrect = labelCorrect;
    correct = startCorrect && endCorrect && labelCorrect;
  } else if (geometry.variant === "doubleArrow") {
    const start = parsePoint(values.start);
    const end = parsePoint(values.end);
    const label = parsePoint(values.label);
    const direct = Boolean(
      start && end &&
      distance(start, geometry.start) <= geometry.endpointTolerance &&
      distance(end, geometry.end) <= geometry.endpointTolerance,
    );
    const reversed = Boolean(
      start && end &&
      distance(start, geometry.end) <= geometry.endpointTolerance &&
      distance(end, geometry.start) <= geometry.endpointTolerance,
    );
    const labelCorrect = Boolean(
      label &&
      label.x >= geometry.labelRegion.minX &&
      label.x <= geometry.labelRegion.maxX &&
      label.y >= geometry.labelRegion.minY &&
      label.y <= geometry.labelRegion.maxY,
    );
    components.endpointsCorrect = direct || reversed;
    components.labelCorrect = labelCorrect;
    correct = (direct || reversed) && labelCorrect;
  } else {
    const points = Array.isArray(values.points) ? values.points.map(parsePoint).filter(Boolean) as Array<{ x: number; y: number }> : [];
    const withinPlot = points.filter((point) => (
      point.x >= geometry.plot.minX && point.x <= geometry.plot.maxX &&
      point.y >= geometry.plot.minY && point.y <= geometry.plot.maxY
    ));
    const apex = withinPlot.reduce<{ x: number; y: number } | null>((best, point) => !best || point.y < best.y ? point : best, null);
    const first = withinPlot[0];
    const last = withinPlot.at(-1);
    const optimumCorrect = Boolean(apex && apex.x >= geometry.optimum.minX && apex.x <= geometry.optimum.maxX);
    const baselineCorrect = Boolean(
      apex && first && last &&
      first.y - apex.y >= geometry.baselineTolerance &&
      last.y - apex.y >= geometry.baselineTolerance,
    );
    const enoughPoints = withinPlot.length >= 8;
    components.enoughPoints = enoughPoints;
    components.optimumCorrect = optimumCorrect;
    components.bellShape = baselineCorrect;
    correct = enoughPoints && optimumCorrect && baselineCorrect;
  }

  return {
    score: correct ? question.points : 0,
    possible: question.points,
    details: {
      parts: [{
        id: question.variant,
        response: formatResponse(values),
        score: correct ? question.points : 0,
        possible: question.points,
        correct,
        ...components,
      }],
    },
  };
}

function scoreBiologicalDrawing(
  question: Extract<TestQuestion, { type: "biologicalDrawing" }>,
  answer: unknown,
) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const strokes = parseDrawingStrokes(values.strokes);
  const outlines = strokes.filter((stroke) => stroke.mode === "outline");
  const core = strokes.filter((stroke) => stroke.mode === "core");
  const pips = strokes.filter((stroke) => stroke.mode === "pip");
  const largestOutline = outlines.reduce<(typeof outlines)[number] | null>((largest, stroke) => {
    if (!largest) return stroke;
    return boundingArea(stroke.points) > boundingArea(largest.points) ? stroke : largest;
  }, null);
  const sizeCorrect = Boolean(largestOutline && boundingArea(largestOutline.points) > 0.5);
  const outlineClosed = Boolean(
    largestOutline &&
    largestOutline.points.length >= 18 &&
    distance(largestOutline.points[0], largestOutline.points.at(-1)!) <= 0.09,
  );
  const outlineSmooth = Boolean(largestOutline && pathSmoothness(largestOutline.points) <= 2.7);
  const noDenseShading = outlines.length <= 3 && strokes.reduce((sum, stroke) => sum + stroke.points.length, 0) <= 900;
  const qualityCorrect = outlineClosed && outlineSmooth && noDenseShading;
  const coreCentres = core.map((stroke) => centroid(stroke.points));
  const spreadAroundCentre = new Set(coreCentres.map((point) => Math.floor((Math.atan2(point.y - 0.5, point.x - 0.5) + Math.PI) / (Math.PI * 2) * 5))).size >= 4;
  const detailCorrect = core.length >= 5 && pips.length >= 2 && spreadAroundCentre;
  const parts = [
    componentPart("size", sizeCorrect, 1, { occupiesMoreThanHalf: sizeCorrect }),
    componentPart("quality", qualityCorrect, 1, { outlineClosed, outlineSmooth, noDenseShading }),
    componentPart("detail", detailCorrect, 1, { coreSections: core.length, pipDetails: pips.length, spreadAroundCentre }),
  ];
  return { score: parts.reduce((sum, part) => sum + part.score, 0), possible: question.points, details: { parts } };
}

function scorePracticalGraph(
  question: Extract<TestQuestion, { type: "practicalGraph" }>,
  answer: unknown,
  answers: TestAnswers,
) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const xMax = Number(values.xMax);
  const yMax = Number(values.yMax);
  const source = answerMap(answers[question.sourceQuestionId]);
  const first = numericValue(source[question.sourceFields.first]) ?? question.fixedXValues[0];
  const last = numericValue(source[question.sourceFields.last]) ?? question.fixedXValues.at(-1)!;
  const xValues = [first, ...question.fixedXValues.slice(1, -1), last];
  const axesCorrect =
    normalize(String(values.xQuantity)) === normalize(question.correctAxes.xQuantity) &&
    normalize(String(values.xUnit)) === normalize(question.correctAxes.xUnit) &&
    normalize(String(values.yQuantity)) === normalize(question.correctAxes.yQuantity) &&
    normalize(String(values.yUnit)) === normalize(question.correctAxes.yUnit);
  const scaleCorrect = Number.isFinite(xMax) && Number.isFinite(yMax) &&
    xMax >= Math.max(...xValues) && yMax >= Math.max(...question.data.map((datum) => datum.y)) &&
    Math.max(...xValues) / xMax > 0.5 && Math.max(...question.data.map((datum) => datum.y)) / yMax > 0.5;
  const plot = { left: 0.13, right: 0.95, top: 0.07, bottom: 0.87 };
  const expected = question.data.map((datum, index) => ({
    x: plot.left + (xValues[index] / xMax) * (plot.right - plot.left),
    y: plot.bottom - (datum.y / yMax) * (plot.bottom - plot.top),
  }));
  const entered = question.data.map((_, index) => parsePoint(values[`p${index}`]));
  const pointsCorrect = Boolean(
    scaleCorrect &&
    entered.every((point, index) => point && distance(point, expected[index]) <= question.pointTolerance),
  );
  const lineStart = parsePoint(values.lineStart);
  const lineEnd = parsePoint(values.lineEnd);
  const lineCorrect = Boolean(
    pointsCorrect && lineStart && lineEnd &&
    lineStart.x < lineEnd.x &&
    lineStart.y > lineEnd.y &&
    distanceToSegment(expected[0], lineStart, lineEnd) <= 0.055 &&
    distanceToSegment(expected.at(-1)!, lineStart, lineEnd) <= 0.055,
  );
  const parts = [
    componentPart("axes", axesCorrect, 1, { orientationAndLabelsCorrect: axesCorrect }),
    componentPart("scale", scaleCorrect, 1, { coversMoreThanHalfGrid: scaleCorrect }),
    componentPart("plots", pointsCorrect, 1, { allFiveWithinTolerance: pointsCorrect, ecfTimes: xValues }),
    componentPart("best-fit-line", lineCorrect, 1, { followsTrend: lineCorrect }),
  ];
  return { score: parts.reduce((sum, part) => sum + part.score, 0), possible: question.points, details: { parts } };
}

function scoreVirtualMeasurement(
  question: Extract<TestQuestion, { type: "virtualMeasurement" }>,
  answer: unknown,
) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const parts = question.measurements.map((measurement) => {
    const measured = measurementValue(values, measurement);
    const correct = measured !== null && Math.abs(measured - measurement.expected) <= measurement.tolerance;
    return componentPart(measurement.id, correct, 1, {
      measured: measured === null ? null : Number(measured.toFixed(2)),
      expected: measurement.expected,
      unit: measurement.unit,
    });
  });
  return { score: parts.reduce((sum, part) => sum + part.score, 0), possible: question.points, details: { parts } };
}

function scoreDependentQuestion(question: TestQuestion, answer: unknown, answers: TestAnswers) {
  if (!question.grading || question.grading.mode !== "dependent") {
    return { score: 0, possible: question.points, details: { parts: [] } };
  }
  const rule = question.grading.rule;
  const response = answerMap(answer);
  const directValue = numericValue(response.answer);
  let expected: number | null = null;

  if (rule.type === "subtractFrom") {
    const source = numericAnswer(answers[rule.sourceQuestionId], rule.sourceField);
    expected = source === null ? null : rule.minuend - source;
  } else if (rule.type === "mean") {
    const source = numericAnswer(answers[rule.sourceQuestionId], rule.sourceField);
    expected = source === null ? null : [...rule.fixedValues, source].reduce((sum, value) => sum + value, 0) / (rule.fixedValues.length + 1);
    if (expected !== null && rule.decimalPlaces !== undefined) expected = Number(expected.toFixed(rule.decimalPlaces));
  } else if (rule.type === "product") {
    const factors = rule.factors.map((factor) => {
      if ("value" in factor) return factor.value;
      const sourceAnswer = answers[factor.sourceQuestionId];
      if (factor.measurementId) {
        return measurementValueById(sourceAnswer, factor.measurementId, factor.measurementCalibration);
      }
      return numericAnswer(sourceAnswer, factor.sourceField);
    });
    expected = factors.every((factor): factor is number => factor !== null)
      ? factors.reduce((product, factor) => product * factor, 1)
      : null;
  } else if (rule.type === "scaledSum") {
    const values = rule.sourceQuestionIds.map((id) => numericAnswer(answers[id]));
    expected = values.every((value): value is number => value !== null)
      ? values.reduce((sum, value) => sum + value, 0) * rule.multiplier
      : null;
  } else if (rule.type === "density") {
    const mass = numericAnswer(answers[rule.massQuestionId]);
    const volume = numericAnswer(answers[rule.volumeQuestionId]);
    expected = mass !== null && volume ? mass / volume : null;
    const value = numericValue(response[rule.valueField]);
    const unit = String(response[rule.unitField] || "");
    const roundedExpected = expected === null ? null : roundSignificant(expected, rule.significantFigures);
    const calculationCorrect = value !== null && expected !== null && (
      Math.abs(value - expected) <= (rule.tolerance ?? 0.005) ||
      roundedExpected !== null && Math.abs(value - roundedExpected) <= (rule.tolerance ?? 0.005)
    );
    const significantFiguresCorrect = value !== null && roundedExpected !== null &&
      Math.abs(value - roundedExpected) <= (rule.tolerance ?? 0.005) &&
      countSignificantFigures(String(response[rule.valueField] || "")) === rule.significantFigures;
    const unitCorrect = rule.unitAccepted.some((accepted) => normalize(unit) === normalize(accepted));
    const parts = [
      componentPart("calculation", calculationCorrect, 1, { expected }),
      componentPart("significant-figures", significantFiguresCorrect, 1, { expected: roundedExpected }),
      componentPart("unit", unitCorrect, 1, { accepted: rule.unitAccepted }),
    ];
    return { score: parts.reduce((sum, part) => sum + part.score, 0), possible: question.points, details: { parts } };
  }

  const accepted = "accepted" in rule ? rule.accepted || [] : [];
  const tolerance = "tolerance" in rule ? rule.tolerance ?? 0.05 : 0.05;
  const correct = (
    directValue !== null &&
    expected !== null &&
    Math.abs(directValue - expected) <= tolerance
  ) || accepted.some((value) => normalize(String(response.answer || "")) === normalize(value));
  const parts = [componentPart("answer", correct, question.points, { expected, ecf: expected !== null })];
  return { score: correct ? question.points : 0, possible: question.points, details: { parts } };
}

function scoreInvestigationPlan(
  scoredParts: Array<{ correct: boolean; score: number }>,
  definitions: Array<{ category?: string }>,
) {
  const categories = ["apparatus", "method", "measurements", "controls", "processing"];
  const correctByCategory = categories.map((category) => scoredParts.filter((part, index) => part.correct && definitions[index].category === category).length);
  const base = correctByCategory.filter((count) => count > 0).length;
  if (base < categories.length) return base;
  const additional = correctByCategory.reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return base + Math.min(2, additional);
}

function scoreRayDiagram(question: Extract<TestQuestion, { type: "rayDiagram" }>, answer: unknown) {
  const values = answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
  const normalEnd = parsePoint(values.normalEnd);
  const labelPoint = parsePoint(values.labelPoint);
  const reflectedEnd = parsePoint(values.reflectedEnd);
  const { incidence, incidentSource, eye, normalTolerance, labelRegion, eyeTolerance, angleToleranceDegrees } = question.geometry;

  const normalCorrect = Boolean(
    normalEnd &&
    normalEnd.x < incidence.x &&
    Math.abs(normalEnd.y - incidence.y) <= normalTolerance,
  );
  const labelCorrect = Boolean(
    labelPoint &&
    labelPoint.x >= labelRegion.minX &&
    labelPoint.x <= labelRegion.maxX &&
    labelPoint.y >= labelRegion.minY &&
    labelPoint.y <= labelRegion.maxY,
  );
  const reachesEye = Boolean(reflectedEnd && distance(reflectedEnd, eye) <= eyeTolerance);
  const incidentAngle = Math.atan2(Math.abs(incidentSource.y - incidence.y), Math.abs(incidentSource.x - incidence.x));
  const reflectionAngle = reflectedEnd
    ? Math.atan2(Math.abs(reflectedEnd.y - incidence.y), Math.abs(reflectedEnd.x - incidence.x))
    : Number.POSITIVE_INFINITY;
  const angleCorrect = Math.abs(reflectionAngle - incidentAngle) * 180 / Math.PI <= angleToleranceDegrees;
  const parts = [
    {
      id: "normal-and-label",
      response: `${values.normalEnd || ""}; ${values.labelPoint || ""}`,
      score: normalCorrect && labelCorrect ? 1 : 0,
      possible: 1,
      correct: normalCorrect && labelCorrect,
      normalCorrect,
      labelCorrect,
    },
    {
      id: "reflected-ray",
      response: String(values.reflectedEnd || ""),
      score: reachesEye && angleCorrect ? 1 : 0,
      possible: 1,
      correct: reachesEye && angleCorrect,
      reachesEye,
      angleCorrect,
    },
  ];
  return {
    score: parts.reduce((sum, part) => sum + part.score, 0),
    possible: question.points,
    details: { parts },
  };
}

type DrawingStroke = { mode: "outline" | "core" | "pip"; points: Array<{ x: number; y: number }> };

function parseDrawingStrokes(value: string | string[] | undefined): DrawingStroke[] {
  if (!Array.isArray(value)) return [];
  return value.map((stroke) => {
    const [rawMode, rawPoints = ""] = stroke.split(":");
    const mode: DrawingStroke["mode"] = rawMode === "core" || rawMode === "pip" ? rawMode : "outline";
    return {
      mode,
      points: rawPoints.split(";").map(parsePoint).filter(Boolean) as Array<{ x: number; y: number }>,
    };
  }).filter((stroke) => stroke.points.length > 1);
}

function boundingArea(points: Array<{ x: number; y: number }>) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

function pathSmoothness(points: Array<{ x: number; y: number }>) {
  if (points.length < 3) return Number.POSITIVE_INFINITY;
  const centre = centroid(points);
  const radius = points.reduce((sum, point) => sum + distance(point, centre), 0) / points.length;
  const pathLength = points.slice(1).reduce((sum, point, index) => sum + distance(points[index], point), 0);
  return radius ? pathLength / (2 * Math.PI * radius) : Number.POSITIVE_INFINITY;
}

function centroid(points: Array<{ x: number; y: number }>) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function componentPart(id: string, correct: boolean, points: number, details: Record<string, unknown> = {}) {
  return {
    id,
    response: "",
    score: correct ? points : 0,
    possible: points,
    correct,
    ...details,
  };
}

function answerMap(answer: unknown): Record<string, string | string[]> {
  if (typeof answer === "string") return { answer };
  return answer && typeof answer === "object" ? answer as Record<string, string | string[]> : {};
}

function numericAnswer(answer: unknown, field = "answer") {
  return numericValue(answerMap(answer)[field]);
}

function numericValue(value: string | string[] | undefined) {
  if (typeof value !== "string") return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function measurementValue(
  values: Record<string, string | string[]>,
  measurement: { id: string; calibration: number },
) {
  return measurementValueById(values, measurement.id, measurement.calibration);
}

function measurementValueById(answer: unknown, id: string, calibration = 1) {
  const values = answerMap(answer);
  const start = parsePoint(values[`${id}Start`]);
  const end = parsePoint(values[`${id}End`]);
  return start && end ? distance(start, end) * calibration : null;
}

function roundSignificant(value: number, significantFigures: number) {
  if (!value) return 0;
  const power = significantFigures - Math.ceil(Math.log10(Math.abs(value)));
  const magnitude = 10 ** power;
  return Math.round(value * magnitude) / magnitude;
}

function countSignificantFigures(value: string) {
  const clean = value.toLowerCase().split("e")[0].replace(/[^0-9.]/g, "").replace(/^0+/, "").replace(".", "");
  return clean.replace(/^0+/, "").length;
}

function parsePoint(value: string | string[] | undefined) {
  if (typeof value !== "string") return null;
  const [x, y] = value.split(",").map(Number);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function distance(left: { x: number; y: number }, right: { x: number; y: number }) {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function distanceToSegment(point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return distance(point, start);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function isCorrectPart(raw: string | string[], part: NonNullable<Extract<TestQuestion["grading"], { mode: "auto" }>["parts"]>[number]) {
  if (part.normalizer === "set") return sameSet(Array.isArray(raw) ? raw : [], part.accepted);
  if (part.normalizer === "contains") {
    return Array.isArray(raw) && part.accepted.some((accepted) => raw.some((item) => normalize(item) === normalize(accepted)));
  }
  if (part.normalizer === "keywords") return matchesKeywords(String(raw), part.keywords || []);
  if (part.normalizer === "arrowDown") return normalize(String(raw)) === "down";
  return part.accepted.some((accepted) => normalize(String(raw), part.normalizer) === normalize(accepted, part.normalizer));
}

function scoreByThreshold(correctCount: number, thresholds: Array<{ minCorrect: number; points: number }>) {
  return thresholds.reduce((best, threshold) => correctCount >= threshold.minCorrect ? Math.max(best, threshold.points) : best, 0);
}

function matchesKeywords(value: string, keywordGroups: string[][]) {
  const raw = normalize(value);
  return Boolean(raw) && keywordGroups.some((group) => group.every((word) => raw.includes(normalize(word))));
}

function normalize(value: string, mode: "text" | "time" | "set" | "contains" | "keywords" | "arrowDown" = "text") {
  const clean = String(value || "")
    .toLowerCase()
    .replace(/[,$]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (mode === "time") {
    return clean
      .replace(/\./g, ":")
      .replace(/\s+/g, "")
      .replace(":00pm", "pm")
      .replace(":00p.m.", "pm");
  }
  return clean.replace(/[^\w./: ]/g, "");
}

function sameSet(response: string[], accepted: string[]) {
  const left = response.map((item) => normalize(item)).sort().join(",");
  const right = accepted.map((item) => normalize(item)).sort().join(",");
  return Boolean(left) && left === right;
}

function formatResponse(answer: unknown) {
  if (typeof answer === "string") return answer;
  if (answer && typeof answer === "object") {
    return Object.entries(answer as Record<string, string | string[]>)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value || "-"}`)
      .join("; ");
  }
  return "";
}
