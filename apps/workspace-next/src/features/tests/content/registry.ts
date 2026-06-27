import { englishLiteracy1 } from "@/features/tests/content/english-literacy/level-1";
import { englishLiteracy2 } from "@/features/tests/content/english-literacy/level-2";
import { englishLiteracy3 } from "@/features/tests/content/english-literacy/level-3";
import { englishLiteracy4 } from "@/features/tests/content/english-literacy/level-4";
import { englishLiteracy5 } from "@/features/tests/content/english-literacy/level-5";
import { mathOlympiad1 } from "@/features/tests/content/math-olympiad/level-1";
import { mathOlympiad2 } from "@/features/tests/content/math-olympiad/level-2";
import { mathOlympiad3 } from "@/features/tests/content/math-olympiad/level-3";
import { mathOlympiad4 } from "@/features/tests/content/math-olympiad/level-4";
import { mathOlympiad5 } from "@/features/tests/content/math-olympiad/level-5";
import { mathOlympiad6 } from "@/features/tests/content/math-olympiad/level-6";
import { spipYear7EnglishPre } from "@/features/tests/content/spip/english-pre";
import { spipYear7MathPre } from "@/features/tests/content/spip/math-pre";
import { spipYear7SciencePre } from "@/features/tests/content/spip/science-pre";
import { starterProgressListening } from "@/features/tests/content/starter/listening";
import { starterProgressReadingWriting } from "@/features/tests/content/starter/reading-writing";
import type { TestDefinition } from "@/features/tests/lib/types";

const tests: Record<string, TestDefinition> = {
  [englishLiteracy1.id]: englishLiteracy1,
  [englishLiteracy2.id]: englishLiteracy2,
  [englishLiteracy3.id]: englishLiteracy3,
  [englishLiteracy4.id]: englishLiteracy4,
  [englishLiteracy5.id]: englishLiteracy5,
  [mathOlympiad1.id]: mathOlympiad1,
  [mathOlympiad2.id]: mathOlympiad2,
  [mathOlympiad3.id]: mathOlympiad3,
  [mathOlympiad4.id]: mathOlympiad4,
  [mathOlympiad5.id]: mathOlympiad5,
  [mathOlympiad6.id]: mathOlympiad6,
  [spipYear7EnglishPre.id]: spipYear7EnglishPre,
  [spipYear7MathPre.id]: spipYear7MathPre,
  [spipYear7SciencePre.id]: spipYear7SciencePre,
  [starterProgressListening.id]: starterProgressListening,
  [starterProgressReadingWriting.id]: starterProgressReadingWriting,
};

export function getTestDefinition(testId: string) {
  return tests[testId] || null;
}
