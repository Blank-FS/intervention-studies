"use client";

import React, { useState } from "react";
import { Trash } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";

const ModuleDeleteForm = ({
  moduleId,
  onDelete,
}: {
  moduleId: number;
  onDelete?: (moduleId: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });
      setIsLoading(false);

      if (!response.ok)
        throw new Error(`Failed to submit: ${await response.text()}`);
      onDelete?.(moduleId);

      toast.success("Module deleted successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to delete module.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button>
              <Trash />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete module</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Module</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this module?
          </DialogDescription>
          <Separator orientation="horizontal" />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              onClick={onSubmit}
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Confirm"}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDeleteForm;
