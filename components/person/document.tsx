"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Plus, X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CustomerFormValues } from "../customer/customer";
import { ChangeEvent, useState } from "react";

const documentTypeOptions = [
  { value: "citizenship", label: "Citizenship" },
  { value: "pan", label: "PAN" },
  { value: "passport", label: "Passport" },
  { value: "registration", label: "Registration" },
  { value: "license", label: "License" },
  { value: "agreement", label: "Agreement" },
  { value: "contract", label: "Contract" },
  { value: "certificate", label: "Certificate" },
  { value: "insurance", label: "Insurance" },
  { value: "tax", label: "Tax" },
  { value: "other", label: "Other" },
] as const;

export function DocumentForm() {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const docErrors = errors.documents ?? {};

  // Fixed type-safe useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents.mediaRefs",
  });

  // State for upload progress (optional)
  const [uploading, setUploading] = useState(false);

  // Handle file upload – calls your API and appends returned mediaId
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      // Assume response: { mediaId: string }
      append(data.mediaId);
    } catch (error) {
      console.error("Upload error:", error);
      // You might want to show a toast here
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-uploaded
      e.target.value = "";
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Document
      </h3>

      {/* Document type & Document number */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-300">
            Document type <span className="text-red-600">*</span>
          </Label>
          <Controller<CustomerFormValues, "documents.documentType">
            name="documents.documentType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select onValueChange={onChange} value={value} disabled={isSubmitting}>
                <SelectTrigger
                  className={cn(
                    "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                    docErrors.documentType && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700">
                  {documentTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {docErrors.documentType && (
            <p className="text-sm text-red-600">{docErrors.documentType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="documents-documentNumber" className="text-zinc-700 dark:text-zinc-300">
            Document number <span className="text-red-600">*</span>
          </Label>
          <Controller<CustomerFormValues, "documents.documentNumber">
            name="documents.documentNumber"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="documents-documentNumber"
                placeholder="e.g. 12-34-56789"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm uppercase transition-colors placeholder:text-zinc-400 placeholder:normal-case",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  docErrors.documentNumber && "border-red-500"
                )}
              />
            )}
          />
          {docErrors.documentNumber && (
            <p className="text-sm text-red-600">{docErrors.documentNumber.message}</p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mt-6 space-y-2">
        <Label htmlFor="documents-title" className="text-zinc-700 dark:text-zinc-300">
          Title
        </Label>
        <Controller<CustomerFormValues, "documents.title">
          name="documents.title"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Input
              id="documents-title"
              placeholder="e.g. Citizenship certificate"
              maxLength={200}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                docErrors.title && "border-red-500"
              )}
            />
          )}
        />
        {docErrors.title && (
          <p className="text-sm text-red-600">{docErrors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mt-6 space-y-2">
        <Label htmlFor="documents-description" className="text-zinc-700 dark:text-zinc-300">
          Description
        </Label>
        <Controller<CustomerFormValues, "documents.description">
          name="documents.description"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Textarea
              id="documents-description"
              placeholder="Any additional information..."
              rows={4}
              maxLength={2000}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "resize-none rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                docErrors.description && "border-red-500"
              )}
            />
          )}
        />
        {docErrors.description && (
          <p className="text-sm text-red-600">{docErrors.description.message}</p>
        )}
      </div>

      {/* Issued by & Issued district */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="documents-issuedBy" className="text-zinc-700 dark:text-zinc-300">
            Issued by
          </Label>
          <Controller<CustomerFormValues, "documents.issuedBy">
            name="documents.issuedBy"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="documents-issuedBy"
                placeholder="e.g. District Administration Office"
                maxLength={200}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  docErrors.issuedBy && "border-red-500"
                )}
              />
            )}
          />
          {docErrors.issuedBy && (
            <p className="text-sm text-red-600">{docErrors.issuedBy.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="documents-issuedDistrict" className="text-zinc-700 dark:text-zinc-300">
            Issued district
          </Label>
          <Controller<CustomerFormValues, "documents.issuedDistrict">
            name="documents.issuedDistrict"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="documents-issuedDistrict"
                placeholder="e.g. Kathmandu"
                maxLength={100}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  docErrors.issuedDistrict && "border-red-500"
                )}
              />
            )}
          />
          {docErrors.issuedDistrict && (
            <p className="text-sm text-red-600">{docErrors.issuedDistrict.message}</p>
          )}
        </div>
      </div>

      {/* Issued date & Expiry date */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-300">Issued date</Label>
          <Controller<CustomerFormValues, "documents.issuedDate">
            name="documents.issuedDate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Popover>
                <PopoverTrigger className={"w-full"}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left font-normal transition-colors",
                      "hover:border-red-400 hover:bg-red-50/50",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                      "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                      !value && "text-zinc-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                    {value ? format(value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={value ?? undefined}
                    onSelect={onChange}
                    disabled={(date) => date > new Date()}
                    className="w-full rounded-none"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {docErrors.issuedDate && (
            <p className="text-sm text-red-600">{docErrors.issuedDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-300">Expiry date</Label>
          <Controller<CustomerFormValues, "documents.expiryDate">
            name="documents.expiryDate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Popover>
                <PopoverTrigger className={"w-full"}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left font-normal transition-colors",
                      "hover:border-red-400 hover:bg-red-50/50",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                      "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                      !value && "text-zinc-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                    {value ? format(value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={value ?? undefined}
                    onSelect={onChange}
                    className="w-full rounded-none"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {docErrors.expiryDate && (
            <p className="text-sm text-red-600">{docErrors.expiryDate.message}</p>
          )}
        </div>
      </div>

      {/* Media refs – with file upload button */}
      <div className="mt-6 space-y-2">
        <Label className="text-zinc-700 dark:text-zinc-300">Attached media</Label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Controller<CustomerFormValues, `documents.mediaRefs.${number}`>
                name={`documents.mediaRefs.${index}`}
                control={control}
                render={({ field: { value, onChange, onBlur, ref } }) => (
                  <Input
                    placeholder="Media reference ID"
                    value={value ?? ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={isSubmitting}
                    className={cn(
                      "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                      "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
                    )}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={isSubmitting}
                aria-label="Remove media reference"
                className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-zinc-300 text-zinc-600 transition-colors hover:border-red-500 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => append("")}
              disabled={isSubmitting}
              className="flex items-center gap-2 border-2 border-dashed border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-red-400 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500"
            >
              <Plus className="h-4 w-4" />
              Add media reference (manual)
            </button>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isSubmitting || uploading}
                accept="image/*,application/pdf"
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex cursor-pointer items-center gap-2 border-2 border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors",
                  "hover:border-red-400 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  uploading && "opacity-60"
                )}
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload file"}
              </label>
            </div>
          </div>
        </div>
        {docErrors.mediaRefs && (
          <p className="text-sm text-red-600">{docErrors.mediaRefs.message as string}</p>
        )}
      </div>
    </div>
  );
}