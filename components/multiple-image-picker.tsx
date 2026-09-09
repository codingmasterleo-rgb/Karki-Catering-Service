"use client";

import * as React from "react";
import { X, Plus, AlertCircle, FileText } from "lucide-react";
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
  idPrefix?: string;
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
  idPrefix = "multi-img-picker",
}: MultipleImagePickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const formId = React.useId();

  // Use a Map to track File objects to their Blob URLs.
  // This prevents memory leaks and avoids recreating URLs (which causes image flickering)
  // when the parent component passes a new array reference with the same File objects.
  const urlMapRef = React.useRef(new Map<File, string>());
  const [previewItems, setPreviewItems] = React.useState<{ item: File | string; url: string }[]>([]);

  const displayError = error || localError;
  const canAddMore = value.length < maxFiles;

  React.useEffect(() => {
    const newItems: { item: File | string; url: string }[] = [];
    const activeFiles = new Set<File>();

    value.forEach((item) => {
      if (typeof item === "string") {
        newItems.push({ item, url: item });
      } else {
        activeFiles.add(item);
        let url = urlMapRef.current.get(item);
        if (!url) {
          url = URL.createObjectURL(item);
          urlMapRef.current.set(item, url);
        }
        newItems.push({ item, url });
      }
    });

    setPreviewItems(newItems);

    // Cleanup files that are no longer in the value array
    urlMapRef.current.forEach((url, file) => {
      if (!activeFiles.has(file)) {
        URL.revokeObjectURL(url);
        urlMapRef.current.delete(file);
      }
    });

    // Cleanup all blob URLs on unmount
    return () => {
      urlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlMapRef.current.clear();
    };
  }, [value]);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    setLocalError(null);
    const fileArray = Array.from(incomingFiles);
    const validFiles: File[] = [];
    const rejectedSize: string[] = [];

    for (const file of fileArray) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        rejectedSize.push(file.name);
        continue;
      }
      validFiles.push(file);
    }

    if (rejectedSize.length > 0) {
      setLocalError(`${rejectedSize.length} file(s) exceeded the ${maxSizeMB}MB limit.`);
    }

    if (validFiles.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    if (remainingSlots <= 0) {
      setLocalError(`Maximum limit of ${maxFiles} files reached.`);
      return;
    }

    const toAdd = validFiles.slice(0, remainingSlots);
    if (validFiles.length > remainingSlots) {
      setLocalError(`Limit reached. ${validFiles.length - remainingSlots} file(s) were ignored.`);
    }

    onChange([...value, ...toAdd]);
  };

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return;
    setLocalError(null);
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files?.length) return;
    handleFiles(e.dataTransfer.files);
  };

  const getInputId = () => `${idPrefix}-${formId}-input`;
  const getErrorId = () => `${idPrefix}-${formId}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={getInputId()} className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            {label}
          </Label>
          <span className="text-[11px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
            {value.length} / {maxFiles} files
          </span>
        </div>
      )}

      {/* Hidden Native Input */}
      <input
        ref={inputRef}
        id={getInputId()}
        type="file"
        accept={accept}
        multiple
        disabled={disabled || !canAddMore}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
        aria-describedby={displayError ? getErrorId() : undefined}
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
            "flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
            "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
            isDragging && "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-950/20",
            disabled && "cursor-not-allowed opacity-50",
            displayError && "border-red-500 bg-red-50/40 dark:border-red-500 dark:bg-red-950/10"
          )}
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-none border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <FileText className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Upload document scans <span className="font-normal text-zinc-500">or drag here</span>
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {description || `Citizenship, PAN, or certificates. Max ${maxSizeMB}MB each (${maxFiles} max)`}
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
          {previewItems.map(({ url, item }, idx) => (
            <div
              key={url}
              className="group relative h-28 w-full overflow-hidden rounded-none border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <img
                src={url}
                alt={`Document scan ${idx + 1}`}
                className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
              />

              {/* Remove button overlay */}
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                aria-label={`Remove document ${idx + 1}`}
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

      {/* Validation Error */}
      {displayError && (
        <div id={getErrorId()} className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-500">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}