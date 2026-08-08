import { englishLiteracy1 } from "@/features/tests/content/english-literacy/level-1";
import { englishLiteracy2 } from "@/features/tests/content/english-literacy/level-2";
import { englishLiteracy3 } from "@/features/tests/content/english-literacy/level-3";
import { englishLiteracy4 } from "@/features/tests/content/english-literacy/level-4";
import { englishLiteracy5 } from "@/features/tests/content/english-literacy/level-5";
import {
  cieIgcseCombinedSciencePaper1Core,
  cieIgcseCombinedSciencePaper2Extended,
} from "@/features/tests/content/igcse-combined-science/combined-science";
import { cieIgcseCombinedSciencePaper3Core } from "@/features/tests/content/igcse-combined-science/paper-3-core";
import { cieIgcseCombinedSciencePaper4Extended } from "@/features/tests/content/igcse-combined-science/paper-4-extended";
import { cieIgcseCombinedSciencePaper6AlternativeToPractical } from "@/features/tests/content/igcse-combined-science/paper-6-alternative-to-practical";
import { mathOlympiad1 } from "@/features/tests/content/math-olympiad/level-1";
import { mathOlympiad2 } from "@/features/tests/content/math-olympiad/level-2";
import { mathOlympiad3 } from "@/features/tests/content/math-olympiad/level-3";
import { mathOlympiad4 } from "@/features/tests/content/math-olympiad/level-4";
import { mathOlympiad5 } from "@/features/tests/content/math-olympiad/level-5";
import { mathOlympiad6 } from "@/features/tests/content/math-olympiad/level-6";
import { spipYear7EnglishPre } from "@/features/tests/content/spip/english-pre";
import { spipYear7MathPre } from "@/features/tests/content/spip/math-pre";
import { spipYear7SciencePre } from "@/features/tests/content/spip/science-pre";
import { spipYear8EnglishPre } from "@/features/tests/content/spip/year-8-english-pre";
import { spipYear8MathPre } from "@/features/tests/content/spip/year-8-math-pre";
import { spipYear8SciencePre } from "@/features/tests/content/spip/year-8-science-pre";
import { starterProgressListening } from "@/features/tests/content/starter/listening";
import { starterProgressReadingWriting } from "@/features/tests/content/starter/reading-writing";
import { summerEnglishLevel1Pretest } from "@/features/tests/content/summer-english/level-1-pretest";
import { summerEnglishLevel2Pretest } from "@/features/tests/content/summer-english/level-2-pretest";
import { summerEnglishLevel3Pretest } from "@/features/tests/content/summer-english/level-3-pretest";
import { summerMathLevel1Pretest } from "@/features/tests/content/summer-math/level-1-pretest";
import { summerMathLevel2Pretest } from "@/features/tests/content/summer-math/level-2-pretest";
import { summerMathLevel3Pretest } from "@/features/tests/content/summer-math/level-3-pretest";
import type { TestDefinition } from "@/features/tests/lib/types";

const tests: Record<string, TestDefinition> = {
  [englishLiteracy1.id]: englishLiteracy1,
  [englishLiteracy2.id]: englishLiteracy2,
  [englishLiteracy3.id]: englishLiteracy3,
  [englishLiteracy4.id]: englishLiteracy4,
  [englishLiteracy5.id]: englishLiteracy5,
  [cieIgcseCombinedSciencePaper1Core.id]: cieIgcseCombinedSciencePaper1Core,
  [cieIgcseCombinedSciencePaper2Extended.id]: cieIgcseCombinedSciencePaper2Extended,
  [cieIgcseCombinedSciencePaper3Core.id]: cieIgcseCombinedSciencePaper3Core,
  [cieIgcseCombinedSciencePaper4Extended.id]: cieIgcseCombinedSciencePaper4Extended,
  [cieIgcseCombinedSciencePaper6AlternativeToPractical.id]: cieIgcseCombinedSciencePaper6AlternativeToPractical,
  [mathOlympiad1.id]: mathOlympiad1,
  [mathOlympiad2.id]: mathOlympiad2,
  [mathOlympiad3.id]: mathOlympiad3,
  [mathOlympiad4.id]: mathOlympiad4,
  [mathOlympiad5.id]: mathOlympiad5,
  [mathOlympiad6.id]: mathOlympiad6,
  [spipYear7EnglishPre.id]: spipYear7EnglishPre,
  [spipYear7MathPre.id]: spipYear7MathPre,
  [spipYear7SciencePre.id]: spipYear7SciencePre,
  [spipYear8EnglishPre.id]: spipYear8EnglishPre,
  [spipYear8MathPre.id]: spipYear8MathPre,
  [spipYear8SciencePre.id]: spipYear8SciencePre,
  [starterProgressListening.id]: starterProgressListening,
  [starterProgressReadingWriting.id]: starterProgressReadingWriting,
  [summerEnglishLevel1Pretest.id]: summerEnglishLevel1Pretest,
  [summerEnglishLevel2Pretest.id]: summerEnglishLevel2Pretest,
  [summerEnglishLevel3Pretest.id]: summerEnglishLevel3Pretest,
  [summerMathLevel1Pretest.id]: summerMathLevel1Pretest,
  [summerMathLevel2Pretest.id]: summerMathLevel2Pretest,
  [summerMathLevel3Pretest.id]: summerMathLevel3Pretest,
};

export function getTestDefinition(testId: string) {
  return tests[testId] || null;
}

export function getAllTestDefinitions() {
  return Object.values(tests).sort((a, b) => {
    const subjectOrder = a.subject.localeCompare(b.subject);
    if (subjectOrder !== 0) return subjectOrder;
    return a.title.localeCompare(b.title);
  });
}
