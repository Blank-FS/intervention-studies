"use client";

import React, { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "../../ui/spinner";
import { Question } from "@/lib/types/question";
import { toast } from "sonner";

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
});

const questionsSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(optionSchema).min(2, "At least two options are required"),
  correctOptionIndex: z.coerce.number().min(1, "Select the correct option"),
  moduleId: z.number(),
});

type QuestionFormFields = z.input<typeof questionsSchema>;

const QuestionCreateForm = ({
  moduleId,
  onCreate,
}: {
  moduleId: number;
  onCreate?: (question: Question) => void;
}) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<QuestionFormFields>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      questionText: "",
      options: [{ text: "" }, { text: "" }],
      correctOptionIndex: undefined,
      moduleId: moduleId,
    },
  });

  const { control, handleSubmit, register, formState, watch, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = async (data: QuestionFormFields) => {
    try {
      const payload = {
        questionText: data.questionText,
        moduleId: data.moduleId,
        options: data.options.map((o, idx) => ({
          text: o.text,
          isCorrect: idx + 1 === data.correctOptionIndex,
        })),
      };
      console.log("Submitting payload:", payload);

      const response = await fetch(`/api/modules/${moduleId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      const createdQuestion = await response.json();
      toast.success("Question created successfully!");
      methods.reset();
      setOpen(false);
      onCreate?.(createdQuestion);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to create question.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) methods.reset();
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button>
              <Plus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new question</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="flex max-h-[96vh] flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Create a new multiple-choice question.
          </DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <div className="flex-1 overflow-y-auto pr-2">
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
              id="question-form"
            >
              {/* Question Text */}
              <div className="flex flex-col gap-2">
                <label htmlFor="questionText" className="font-medium">
                  Question Text
                </label>
                <Input {...register("questionText")} id="questionText" />
                {formState.errors.questionText && (
                  <p className="text-sm text-red-500">
                    {formState.errors.questionText.message}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Options</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => append({ text: "" })}
                  >
                    + Add Option
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <input
                        type="radio"
                        value={index + 1}
                        {...register("correctOptionIndex")}
                      />
                      <Input
                        {...register(`options.${index}.text`)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          methods.setValue("correctOptionIndex", 0);
                          remove(index);
                        }}
                        disabled={fields.length <= 2}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                {formState.errors.options && (
                  <p className="text-sm text-red-500">
                    {formState.errors.options.message}
                  </p>
                )}
                {formState.errors.correctOptionIndex && (
                  <p className="text-sm text-red-500">
                    {formState.errors.correctOptionIndex.message}
                  </p>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
        <Separator orientation="horizontal" />

        <Button
          form="question-form"
          type="submit"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionCreateForm;
