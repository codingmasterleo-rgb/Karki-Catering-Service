"use client";

import * as React from "react";
import { Upload, X, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type SingleImagePickerProps = {
  multiple?: false;
  value?: string;
  onChange: (value: string) => void;
};

type MultipleImagePickerProps = {
  multiple: true;
  value?: string[];
  onChange: (value: string[]) => void;
};

type BaseImagePickerProps = {
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  idPrefix?: string;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
};

export type ImagePickerProps = BaseImagePickerProps &
  (SingleImagePickerProps | MultipleImagePickerProps);

export function ImagePicker({
  label,
  description,
  error,
  disabled = false,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = "image/png,image/jpeg,image/webp,image/avif,application/pdf",
  idPrefix = "img-picker",
  onUpload,
  className,
  ...props
}: ImagePickerProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Normalize active items into an array
  const currentImages: string[] = React.useMemo(() => {
    if (!props.value) return [];
    return Array.isArray(props.value) ? props.value : [props.value];
  }, [props.value]);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => {
      const isUnderLimit = file.size <= maxSizeMB * 1024 * 1024;
      return isUnderLimit;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
        if (onUpload) {
          const url = await onUpload(file);
          if (url) uploadedUrls.push(url);
        } else {
          // Default upload fallback
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          const url = data.url || data.mediaId;
          if (url) uploadedUrls.push(url);
        }

        // If single image picker, only take the first uploaded file
        if (!multiple) break;
      }

      if (uploadedUrls.length > 0) {
        if (multiple) {
          const combined = [...currentImages, ...uploadedUrls].slice(0, maxFiles);
          (props.onChange as (v: string[]) => void)(combined);
        } else {
          (props.onChange as (v: string) => void)(uploadedUrls[0]);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (disabled || isUploading) return;
    if (multiple) {
      const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
      (props.onChange as (v: string[]) => void)(updated);
    } else {
      (props.onChange as (v: string) => void)("");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const canUploadMore = multiple
    ? currentImages.length < maxFiles
    : currentImages.length === 0;

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={`${idPrefix}-input`}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            {label}
          </Label>
          {multiple && (
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
              {currentImages.length} / {maxFiles} files
            </span>
          )}
        </div>
      )}

      {/* Hidden Native Input */}
      <input
        ref={inputRef}
        id={`${idPrefix}-input`}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || isUploading || !canUploadMore}
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
        className="sr-only"
      />

      {/* Single Mode Preview Tile */}
      {!multiple && currentImages.length > 0 ? (
        <div className="group relative h-40 w-full rounded-none border-2 border-zinc-200 bg-zinc-100/60 p-1 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 sm:w-64">
          <img
            src={currentImages[0]}
            alt="Single Upload Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex items-center gap-1.5 rounded-none border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-sm transition-colors hover:border-zinc-400 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-white"
            >
              <Upload className="h-3 w-3" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => handleRemove(0)}
              disabled={disabled || isUploading}
              className="flex items-center gap-1.5 rounded-none border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/80 dark:text-red-300 dark:hover:bg-red-900"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Area */
        canUploadMore && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !disabled && !isUploading && inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed p-6 text-center transition-all",
              "border-zinc-300 bg-zinc-50/60 hover:border-red-500/60 hover:bg-red-50/30 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-red-500/50 dark:hover:bg-zinc-900/40",
              isDragging && "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-950/20",
              (disabled || isUploading) &&
                "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-800/50",
              error && "border-red-500/80 bg-red-50/40 dark:border-red-500/80 dark:bg-red-950/10"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-red-600 dark:text-red-500" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Uploading assets...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-none border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Click to browse{" "}
                    <span className="font-normal text-zinc-500 dark:text-zinc-400">
                      or drag & drop
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {description ||
                      `${multiple ? "Images / PDF files" : "Single image file"} up to ${maxSizeMB}MB`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Multiple Mode: Thumbnail Grid */}
      {multiple && currentImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {currentImages.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative h-28 w-full rounded-none border border-zinc-200 bg-zinc-100/60 p-1 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
            >
              <img
                src={url}
                alt={`Media ref #${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                disabled={disabled || isUploading}
                aria-label={`Remove image ${idx + 1}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-none border border-red-200 bg-white/95 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600 hover:text-white dark:border-red-900 dark:bg-red-950/90 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add more button tile in grid */}
          {canUploadMore && !isUploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="flex h-28 flex-col items-center justify-center gap-1 rounded-none border border-dashed border-zinc-300 bg-zinc-50/50 text-zinc-500 transition-colors hover:border-red-500/60 hover:bg-red-50/30 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-500 dark:hover:border-red-500/50 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-300"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Add More
              </span>
            </button>
          )}
        </div>
      )}

      {/* Error Output */}
      {error && <p className="text-xs text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}