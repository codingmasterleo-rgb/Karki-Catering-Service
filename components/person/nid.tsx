"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { X } from "lucide-react";

// ----------------------------------------------------------------------
// Types & schema matching the NationalId model
// ----------------------------------------------------------------------
export type NationalIdOwnerType = "Person" | "Company";
export type IdType = "citizenship" | "pan" | "passport" | "registration" | "other";

export interface NationalIdFormValues {
  ownerRef: string;
  ownerType: NationalIdOwnerType;
  idType: IdType;
  idNumber: string;
  issuedDistrict?: string;
  issuedDate?: string; // YYYY-MM-DD for date input
  expiryDate?: string; // YYYY-MM-DD for date input
}

const nationalIdFormSchema = z.object({
  ownerRef: z.string().min(1, "Owner reference is required"),
  ownerType: z.enum(["Person", "Company"]),
  idType: z.enum(["citizenship", "pan", "passport", "registration", "other"]),
  idNumber: z.string().min(1, "ID number is required"),
  issuedDistrict: z.string().optional(),
  issuedDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

// ----------------------------------------------------------------------
// Component props
// ----------------------------------------------------------------------
interface NationalIdFormProps {
  /** ID of the owning entity (Person/Company) */
  ownerRef: string;
  /** Type of the owning entity */
  ownerType: NationalIdOwnerType;
  /** Pre-populate the form (e.g. for editing) */
  defaultValues?: Partial<Omit<NationalIdFormValues, "ownerRef" | "ownerType">>;
  /** Called with validated form data and selected media files on submit */
  onSubmit: (data: NationalIdFormValues, mediaFiles: File[]) => void | Promise<void>;
  /** External submitting state */
  isSubmitting?: boolean;
  /** Text for the submit button */
  submitLabel?: string;
  /** Cancel handler */
  onCancel?: () => void;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
export function NationalIdForm({
  ownerRef,
  ownerType,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save identification",
  onCancel,
}: NationalIdFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NationalIdFormValues>({
    resolver: zodResolver(nationalIdFormSchema),
    defaultValues: {
      ownerRef,
      ownerType,
      idType: "citizenship",
      idNumber: "",
      issuedDistrict: "",
      issuedDate: "",
      expiryDate: "",
      ...defaultValues,
    },
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    // Reset input value so the same file can be re-added if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFormSubmit = async (data: NationalIdFormValues) => {
    await onSubmit(data, mediaFiles);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
      {/* Hidden fields */}
      <input type="hidden" {...register("ownerRef")} />
      <input type="hidden" {...register("ownerType")} />

      {/* ID Type */}
      <div className="space-y-1.5">
        <Label
          htmlFor="idType"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          Identification type <span className="text-red-500">*</span>
        </Label>
        <Select
          defaultValue={defaultValues?.idType ?? "citizenship"}
          onValueChange={(value) =>
            setValue("idType", value as IdType, { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="idType"
            className={cn(
              "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
              "focus:border-red-500 focus:ring-0",
              "h-10 px-3 py-2 text-sm",
              errors.idType
                ? "border-red-500"
                : "border-zinc-300 dark:border-zinc-700"
            )}
          >
            <SelectValue placeholder="Select identification type" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            <SelectItem value="citizenship">Citizenship</SelectItem>
            <SelectItem value="pan">PAN</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="registration">Registration</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.idType && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.idType.message}</p>
        )}
      </div>

      {/* ID Number */}
      <div className="space-y-1.5">
        <Label
          htmlFor="idNumber"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          ID number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="idNumber"
          {...register("idNumber")}
          placeholder="e.g. 1234-5678 or passport number"
          className={cn(
            "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm transition-colors",
            errors.idNumber
              ? "border-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        />
        {errors.idNumber && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.idNumber.message}</p>
        )}
      </div>

      {/* Issued District */}
      <div className="space-y-1.5">
        <Label
          htmlFor="issuedDistrict"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          Issued district
        </Label>
        <Input
          id="issuedDistrict"
          {...register("issuedDistrict")}
          placeholder="e.g. Kathmandu"
          className={cn(
            "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm transition-colors",
            errors.issuedDistrict
              ? "border-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        />
        {errors.issuedDistrict && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.issuedDistrict.message}</p>
        )}
      </div>

      {/* Date fields side-by-side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Issued Date */}
        <div className="space-y-1.5">
          <Label
            htmlFor="issuedDate"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
          >
            Issued date
          </Label>
          <Input
            id="issuedDate"
            type="date"
            {...register("issuedDate")}
            className={cn(
              "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
              "focus-visible:border-red-500 focus-visible:ring-0",
              "h-10 px-3 py-2 text-sm transition-colors",
              "file:mr-2 file:rounded-none file:border-0 file:bg-zinc-200 dark:file:bg-zinc-800 file:px-3 file:py-1 file:text-sm file:text-zinc-700 dark:file:text-zinc-300",
              errors.issuedDate
                ? "border-red-500"
                : "border-zinc-300 dark:border-zinc-700"
            )}
          />
          {errors.issuedDate && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.issuedDate.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="space-y-1.5">
          <Label
            htmlFor="expiryDate"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
          >
            Expiry date
          </Label>
          <Input
            id="expiryDate"
            type="date"
            {...register("expiryDate")}
            className={cn(
              "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
              "focus-visible:border-red-500 focus-visible:ring-0",
              "h-10 px-3 py-2 text-sm transition-colors",
              "file:mr-2 file:rounded-none file:border-0 file:bg-zinc-200 dark:file:bg-zinc-800 file:px-3 file:py-1 file:text-sm file:text-zinc-700 dark:file:text-zinc-300",
              errors.expiryDate
                ? "border-red-500"
                : "border-zinc-300 dark:border-zinc-700"
            )}
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.expiryDate.message}</p>
          )}
        </div>
      </div>

      {/* Media uploads */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">
          Attach documents (scans, photos)
        </Label>
        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className={cn(
              "rounded-none border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
              "focus-visible:border-red-500 focus-visible:ring-0",
              "h-10 px-3 py-2 text-sm transition-colors",
              "file:mr-2 file:rounded-none file:border-0 file:bg-zinc-200 dark:file:bg-zinc-800 file:px-3 file:py-1 file:text-sm file:text-zinc-700 dark:file:text-zinc-300"
            )}
          />
        </div>
        {mediaFiles.length > 0 && (
          <ul className="mt-2 space-y-1">
            {mediaFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-500 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              "rounded-none border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
              "focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0",
              "transition-colors"
            )}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "rounded-none bg-red-600 text-white hover:bg-red-700",
            "focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0",
            "disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          )}
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}