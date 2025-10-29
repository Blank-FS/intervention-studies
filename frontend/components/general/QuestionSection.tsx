"use client";
import { Question } from "@/types/definition";
import React, { useEffect, useState } from "react";
import QuestionComponent from "./QuestionComponent";

const QuestionSection = ({
  moduleId,
  preview = false,
}: {
  moduleId: number;
  preview?: boolean;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Fetch questions for the given moduleId
    const fetchQuestions = async () => {
      const response = await fetch(`/api/modules/${moduleId}/questions`);
      const data = await response.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, [moduleId]);

  const onAnswer = async (questionId: number, selectedOptionId: number) => {
    if (preview) return;

    const response = await fetch("/api/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId, optionId: selectedOptionId }),
    });

    if (!response.ok) {
      console.error("Failed to save response");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-semibold">Questions</h4>
      {questions.map((q, idx) => (
        <QuestionComponent
          key={q.id}
          question={q}
          idx={idx}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
};

export default QuestionSection;
