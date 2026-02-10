export type CheckResult = {
  earned: number;
  max: number;
  status?: "correct" | "wrong" | "partial";
};

export function checkQuestion(
  question: Question,
  answer:
    | {
        type: "single" | "multiple" | "text";
        value: string | string[] | null;
      }
    | undefined
): CheckResult {}

if (!answer) {
  return { earned: 0, max: question.score };
}

if (question.type === "text") {
  return { earned: 0, max: question.score };
}

const correct = question.correct;
if (!correct) {
  return { earned: 0, max: question.score };
}

if (question.type === "single") {
  const ok = answer.value === correct;
  return {
    earned: ok ? question.score : 0,
    max: question.score,
    status: ok ? "correct" : "wrong",
  };
}

const user = Array.isArray(answer.value) ? answer.value : [];
const right = Array.isArray(correct) ? correct : [];

const correctCount = user.filter(v => right.includes(v)).length;
const wrongCount = user.filter(v => !right.includes(v)).length;

if (wrongCount > 0) {
  return { earned: 0, max: question.score, status: "wrong" };
}
if (correctCount === right.length) {
  return {
    earned: question.score,
    max: question.score,
    status: "correct",
  };
}

const earned = Math.round(
  (correctCount / right.length) * question.score
);

return {
  earned,
  max: question.score,
  status: "partial",
};
return { earned: 0, max: question.score };
