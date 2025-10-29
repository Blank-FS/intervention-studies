import React, { useState, useEffect } from "react";
import { Question, Option } from "@/types/definition";

interface QuestionProps {
  question: Question;
  idx?: number;
  onAnswer?: (questionId: number, selectedOptionId: number) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  onAnswer,
  idx,
}) => {
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Shuffle options when the question loads
  useEffect(() => {
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
    if (question.selectedOptionId) {
      setSelectedOptionId(question.selectedOptionId);
      setSubmitted(true);
    }
  }, [question]);

  const handleOptionChange = (optionId: number) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (selectedOptionId !== null) {
      setSubmitted(true);
      const isCorrect = selectedOptionId === question.correctOptionId;
      onAnswer?.(question.id, selectedOptionId);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h5 className="font-semibold mb-2">{`${
        idx != undefined ? `Q${idx + 1} - ` : ""
      }${question.questionText}`}</h5>

      <ul className="space-y-2 list-none">
        {shuffledOptions.map((opt) => {
          // Determine background color after submission
          let optionClass =
            "border p-2 rounded cursor-pointer transition-colors";

          if (submitted) {
            if (opt.id === question.correctOptionId)
              optionClass += " bg-green-500";
            else if (opt.id === selectedOptionId) optionClass += " bg-red-500";
          } else if (opt.id === selectedOptionId) {
            optionClass += " bg-blue-600";
          } else {
            optionClass += " hover:bg-neutral-600";
          }

          return (
            <li key={opt.id}>
              <label className={`${optionClass} flex items-center space-x-2`}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={opt.id}
                  checked={selectedOptionId === opt.id}
                  onChange={() => handleOptionChange(opt.id)}
                  disabled={submitted}
                />
                <span>{opt.text}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOptionId === null}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Submit
        </button>
      ) : (
        <p
          className={`mt-2 font-medium ${
            selectedOptionId === question.correctOptionId
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {selectedOptionId === question.correctOptionId
            ? "✅ Correct!"
            : "❌ Incorrect."}
        </p>
      )}
    </div>
  );
};

export default QuestionComponent;
