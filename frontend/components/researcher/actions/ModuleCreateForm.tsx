"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";

import VideoUpload from "@/components/researcher/VideoUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Module } from "@/lib/types/module";
import { toast } from "sonner";

// Validation schema
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  paragraph: z.string().min(1, "Paragraph is required"),
  video: z.instanceof(File, { message: "Video file is required" }),
});

type FormFields = z.infer<typeof schema>;

const ModuleCreateForm = ({
  onCreate,
}: {
  onCreate?: (module: Module) => void;
}) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormFields) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("paragraph", data.paragraph);
      formData.append("video", data.video);

      const response = await fetch(`/api/modules`, {
        method: "POST",
        body: formData,
        credentials: "include", // send cookie
      });

      if (!response.ok) throw new Error(await response.text());

      const createdModule = await response.json();
      toast.success("Module created successfully!");
      methods.reset();
      setOpen(false);
      onCreate?.(createdModule);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to create module.");
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
          <p>Create a new module</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Module</DialogTitle>
          <DialogDescription>
            Create a new module by filling out the form below.
          </DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-2"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {/* Title */}
            <label htmlFor="title">Title</label>
            <Input {...methods.register("title")} type="text" id="title" />
            {methods.formState.errors.title && (
              <p className="text-sm text-red-500">
                {methods.formState.errors.title.message}
              </p>
            )}

            {/* Paragraph */}
            <label htmlFor="paragraph">Paragraph</label>
            <Textarea {...methods.register("paragraph")} id="paragraph" />
            {methods.formState.errors.paragraph && (
              <p className="text-sm text-red-500">
                {methods.formState.errors.paragraph.message}
              </p>
            )}

            {/* Video Upload */}
            <VideoUpload />
            {methods.formState.errors.video && (
              <p className="text-sm text-red-500">
                {methods.formState.errors.video.message}
              </p>
            )}

            <Separator orientation="horizontal" />

            <Button
              disabled={methods.formState.isSubmitting}
              type="submit"
              className="mt-2"
            >
              {methods.formState.isSubmitting ? "Saving..." : "Submit"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleCreateForm;
