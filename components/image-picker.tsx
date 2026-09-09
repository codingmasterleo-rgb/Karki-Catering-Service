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
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    if (typeof value === "string") {
      setPreviewUrl(value);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const handleSelectFile = (file: File) => {
    setLocalError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds the ${maxSizeMB}MB limit.`);
      return;
    }
    onChange(file);
  };

  const handleRemove = () => {
    if (disabled) return;
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error || localError;

  return (
    <div className={cn("space-y-2 h-full", className)}>
      {label && (
        <Label
          htmlFor={`${idPrefix}-input`}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </Label>
      )}

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

      {previewUrl ? (
        <div className="group relative h-44 w-full overflow-hidden border-2 border-zinc-200 bg-zinc-100 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              disabled={disabled}
              className="flex items-center gap-1.5 border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-lg transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled}
              className="flex items-center gap-1.5 border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-lg transition-all hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
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
            "flex h-44 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
            "border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80",
            isDragging && "border-red-500 bg-red-50/80 ring-2 ring-red-500/20 dark:border-red-500 dark:bg-red-950/30",
            disabled && "cursor-not-allowed border-zinc-200 bg-zinc-100/50 opacity-60 dark:border-zinc-800",
            displayError && "border-red-400 bg-red-50/60 dark:border-red-500/60 dark:bg-red-950/20"
          )}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center border bg-white shadow-sm transition-colors dark:bg-zinc-900",
              isDragging
                ? "border-red-200 text-red-500 dark:border-red-800 dark:text-red-400"
                : "border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
            )}
          >
            <ImageIcon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Click or drag
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {description || `Up to ${maxSizeMB}MB`}
          </p>
        </div>
      )}

      {displayError && (
        <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="leading-relaxed">{displayError}</span>
        </div>
      )}
    </div>
  );
}