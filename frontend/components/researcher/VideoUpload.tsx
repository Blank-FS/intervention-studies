"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const VideoUpload = () => {
  const { setValue, register, control } = useFormContext();
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Watch the current value of video field (can be File or null)
  const file: File | null = useWatch({ control, name: "video" });

  const [preview, setPreview] = useState<string | null>(null);

  // Update preview whenever file changes
  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setValue("video", droppedFile, { shouldValidate: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setValue("video", selectedFile, { shouldValidate: true });
    }
  };

  return (
    <>
      <label className="mb-1 block" htmlFor="video">
        Video (Max 50 MB)
      </label>
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100"
      >
        {preview ? (
          <video
            src={preview}
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-gray-500">
            Drag and drop or click to upload
          </span>
        )}
      </div>
      <input
        type="file"
        accept="video/*"
        id="video"
        className="hidden"
        ref={(e) => {
          fileRef.current = e;
          register("video").ref(e);
        }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default VideoUpload;
