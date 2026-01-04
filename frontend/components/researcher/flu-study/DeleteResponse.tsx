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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";

const DeleteResponse = ({
  id,
  onDelete,
}: {
  id: number;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/proxy?path=/api/flu-study?userId=${id}`,
        {
          method: "DELETE",
        },
      );
      setIsLoading(false);

      console.log("Delete response status:", response.json());
      if (!response.ok)
        throw new Error(`Failed to submit: ${await response.text()}`);
      onDelete();

      toast.success("Response deleted successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to delete response.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-umich-blue">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-umich-maize">
            Delete Response
          </DialogTitle>
          <DialogDescription className="text-white">
            Are you sure you want to delete this response?
          </DialogDescription>
          <Separator orientation="horizontal" />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              variant="destructive"
              disabled={isLoading}
              className="text-umich-maize"
            >
              {isLoading ? <Spinner /> : "Confirm"}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteResponse;
