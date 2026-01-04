"use client";
import QuestionCreateForm from "@/components/researcher/actions/QuestionCreateForm";
import { Question } from "@/lib/types/question";
import React, { useEffect, useState } from "react";
import EditableQuestionItem from "./EditableQuestionItem";

const EditableQuestionSection = ({ moduleId }: { moduleId: number }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(`/api/modules/${moduleId}/questions`);
      const data = await response.json();
      setQuestions(data);
      console.log(data);
    };

    fetchQuestions();
  }, [moduleId]);

  const handleQuestionCreated = (newQuestion: Question) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleQuestionDeleted = async (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h4 className="text-xl font-semibold">Questions</h4>
        <QuestionCreateForm
          moduleId={moduleId}
          onCreate={handleQuestionCreated}
        />
      </div>
      {questions.map((q, idx) => (
        <EditableQuestionItem
          key={q.id}
          q={q}
          idx={idx}
          onDeleted={handleQuestionDeleted}
        />
      ))}
    </div>
  );
};

export default EditableQuestionSection;
