"use client";

import * as React from "react";
import { X, ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface MultipleImagePickerProps {
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  value?: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export function MultipleImagePicker({
  label,
  description,
  error,
  disabled = false,
  value = [],
  onChange,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = "image/png,image/jpeg,image/webp,image/avif",
  className,
}: MultipleImagePickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Generate object URLs for File instances, or keep existing string URLs
  const previewItems = React.useMemo(() => {
    return value.map((item) => ({
      item,
      url: typeof item === "string" ? item : URL.createObjectURL(item),
    }));
  }, [value]);

  // Clean up blob URLs when component unmounts or value changes
  React.useEffect(() => {
    return () => {
      previewItems.forEach(({ url }) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewItems]);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const fileArray = Array.from(incomingFiles);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`"${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Append up to maxFiles
    const remainingSlots = maxFiles - value.length;
    const toAdd = validFiles.slice(0, remainingSlots);
    onChange([...value, ...toAdd]);
  };

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return;
    onChange(value.filter((_, idx) => idx !== indexToRemove));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files?.length) return;
    handleFiles(e.dataTransfer.files);
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-2.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {label}
          </Label>
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {value.length} / {maxFiles} images
          </span>
        </div>
      )}

      {/* Hidden Native Input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        disabled={disabled || !canAddMore}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
      />

      {/* When no images selected: Full Dropzone */}
      {value.length === 0 ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
            "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
            isDragging && "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-950/20",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-red-500 bg-red-50/40 dark:border-red-500 dark:bg-red-950/10"
          )}
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-none border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Choose images <span className="font-normal text-zinc-500">or drag here</span>
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {description || `PNG, JPG, or WEBP up to ${maxSizeMB}MB each (max ${maxFiles})`}
          </p>
        </div>
      ) : (
        /* Preview Grid */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && canAddMore) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {previewItems.map(({ url }, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative h-28 w-full overflow-hidden rounded-none border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <img
                src={url}
                alt={`Selected image ${idx + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Remove button overlay */}
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                aria-label={`Remove image ${idx + 1}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-none border border-red-200 bg-white text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600 hover:text-white dark:border-red-900 dark:bg-zinc-950 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add More Tile */}
          {canAddMore && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex h-28 flex-col items-center justify-center gap-1 rounded-none border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
                "border-zinc-300 bg-zinc-50 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
                isDragging && "border-red-600 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-950/20",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Add More
              </span>
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}