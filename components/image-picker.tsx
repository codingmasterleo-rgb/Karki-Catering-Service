"use client";

import * as React from "react";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export type SingleImagePickerProps = {
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  idPrefix?: string;
  className?: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
};

export function SingleImagePicker({
  label,
  description,
  error,
  disabled = false,
  maxSizeMB = 5,
  accept = "image/png,image/jpeg,image/webp,image/avif",
  idPrefix = "img-picker",
  className,
  value,
  onChange,
}: SingleImagePickerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Compute preview URL and handle cleanup for File objects
  const previewUrl = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") return value;
    console.log(value)
    return URL.createObjectURL(value);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (file: File) => {
    setLocalError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }

    onChange(file);
  };
// console.log(value)
  const handleRemove = () => {
    if (disabled) return;
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error || localError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={`${idPrefix}-input`}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </Label>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        id={`${idPrefix}-input`}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelectFile(file);
          e.target.value = "";
        }}
        className="sr-only"
      />

      {/* Preview View */}
      {previewUrl ? (
        <div className="group relative h-40 w-full max-w-xs overflow-hidden border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-1.5 border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="flex items-center gap-1.5 border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Select Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const file = e.dataTransfer.files?.[0];
            if (file) handleSelectFile(file);
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
            "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50",
            isDragging && "border-red-600 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20",
            disabled && "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-800",
            displayError && "border-red-500/80 bg-red-50/30 dark:border-red-500/60 dark:bg-red-950/10"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Click to select <span className="font-normal text-zinc-500 dark:text-zinc-400">or drag & drop</span>
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {description || `Image file up to ${maxSizeMB}MB`}
          </p>
        </div>
      )}

      {/* Validation Error */}
      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-500">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}