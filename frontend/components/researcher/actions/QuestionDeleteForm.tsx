"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const QuestionDeleteForm = ({
  questionId,
  onDeleted,
}: {
  questionId: number;
  onDeleted?: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());

      toast.success("Question deleted successfully!");
      setOpen(false);
      onDeleted?.(questionId);
    } catch (err) {
      toast.error("Failed to delete question.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button>
              <Trash />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete this question</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this question? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : "Confirm Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDeleteForm;
