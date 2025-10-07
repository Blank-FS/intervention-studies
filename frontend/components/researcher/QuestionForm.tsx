"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const questionSchema = z.object({
  moduleId: z.number(),
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")),
  correctIndex: z.number().min(0, "Pick a correct option"),
});

type FormFields = z.infer<typeof questionSchema>;

export default function QuestionForm({ moduleId }: { moduleId: number }) {
  const methods = useForm<FormFields>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      moduleId,
      questionText: "",
      options: ["", ""], // start with 2 options
      correctIndex: 0,
    },
  });

  const [options, setOptions] = useState<string[]>(
    methods.getValues("options")
  );

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
    methods.setValue("options", [...options, ""]);
  };

  const removeOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    setOptions(newOptions);
    methods.setValue("options", newOptions);
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
    methods.setValue("options", newOptions);
  };

  const onSubmit = async (data: FormFields) => {
    try {
      console.log("Submitting question:", data);
      const res = await fetch(`/api/modules/${moduleId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit question");
      alert("Question created!");
    } catch (err) {
      console.error(err);
      alert("Error creating question");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-2 p-4 border rounded-md"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <label>Question Text</label>
        <input
          {...methods.register("questionText")}
          type="text"
          className="border p-2 rounded"
        />
        {methods.formState.errors.questionText && (
          <p className="text-red-500 text-sm">
            {methods.formState.errors.questionText.message}
          </p>
        )}

        <Separator orientation="horizontal" />

        <label>Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="radio"
              {...methods.register("correctIndex", { valueAsNumber: true })}
              value={idx}
              checked={methods.watch("correctIndex") === idx}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeOption(idx)}
              disabled={options.length <= 2}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addOption}>
          Add Option
        </Button>

        <Separator orientation="horizontal" />

        <Button type="submit" disabled={methods.formState.isSubmitting}>
          {methods.formState.isSubmitting ? "Submitting..." : "Submit Question"}
        </Button>
      </form>
    </FormProvider>
  );
}
