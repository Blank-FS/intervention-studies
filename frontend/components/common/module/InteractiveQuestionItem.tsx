import React, { useState, useEffect } from "react";
import { Question, Option } from "@/lib/types/question";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestionProps {
  question: Question;
  idx?: number;
  onAnswer?: (questionId: number, selectedOptionId: number) => void;
}

const InteractiveQuestionItem: React.FC<QuestionProps> = ({
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
    <Card className="p-4">
      <h5 className="font-semibold">{`${
        idx != undefined ? `Q${idx + 1} - ` : ""
      }${question.questionText}`}</h5>

      <ul className="list-none space-y-2">
        {shuffledOptions.map((opt) => {
          // Determine background color after submission
          let optionClass =
            "border p-2 rounded-md bg-muted cursor-pointer transition-colors";

          if (submitted) {
            if (opt.id === question.correctOptionId)
              optionClass += " border-green-400";
            else if (opt.id === selectedOptionId)
              optionClass += " border-red-400";
          } else if (opt.id === selectedOptionId) {
            optionClass += " border-blue-400";
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
        <Button
          onClick={handleSubmit}
          disabled={selectedOptionId === null}
          className="disabled:opacity-50"
        >
          Submit
        </Button>
      ) : (
        <p
          className={`font-medium ${
            selectedOptionId === question.correctOptionId
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {selectedOptionId === question.correctOptionId
            ? "✅ Correct!"
            : "❌ Incorrect."}
        </p>
      )}
    </Card>
  );
};

export default InteractiveQuestionItem;
