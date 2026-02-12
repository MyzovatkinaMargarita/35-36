import React, { useState, useMemo } from 'react';
import { checkQuestion } from "../../utils/checkQuestion";
import { type CheckResult, QuestionBlock } from "../../components/tests/QuestionBlock";

const StudentRunTests = ({ questions, durationSec }) => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const results = useMemo<CheckResult[]>(() => {
    return questions.map((q) => checkQuestion(q, answers[q.id]));
  }, [questions, answers]);

  const totalScore = useMemo(() => 
    results.reduce((sum, r) => sum + r.earned, 0), [results]);

  const maxScore = useMemo(() => 
    results.reduce((sum, r) => sum + r.max, 0), [results]);

  const handleAnswerChange = (questionId, value) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  function handleSubmit() {
    setShowResult(true);
  }

  return (
    <div>
      <TimerBox 
        durationSec={durationSec} 
        finished={showResult} 
        onFinish={handleSubmit} 
      />

      {questions.map((q, i) => (
        <QuestionBlock
          key={q.id}
          index={i}
          question={q}
          value={answers[q.id]?.value ?? null}
          result={results[i]}
          showResult={showResult}
          onChange={handleAnswerChange}
        />
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={showResult}
      >
        Отправить
      </button>

      {showResult && (
        <div className="total-score">
          Итог: {totalScore} / {maxScore}
        </div>
      )}
    </div>
  );
};

export default StudentRunTests;
