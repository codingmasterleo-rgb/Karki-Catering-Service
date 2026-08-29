"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { MultipleImagePicker } from "../multiple-image-picker";

export const documentTypeOptions = [
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

export type DocumentType = (typeof documentTypeOptions)[number]["value"];

export type DocumentFormValues = {
  documentType?: DocumentType | string;
  documentNumber?: string;
  title?: string;
  description?: string;
  issuedBy?: string;
  issuedDistrict?: string;
  issuedDate?: Date | string | null;
  expiryDate?: Date | string | null;
  mediaRefs?: (File | string)[];
};

export type DocumentFormErrors = Partial<
  Record<keyof DocumentFormValues, { message?: string } | string>
> & {
  mediaRefs?:
    | { message?: string }
    | string
    | ({ message?: string } | string | undefined)[];
};

export interface DocumentFormProps {
  value?: DocumentFormValues;
  onChange: (value: DocumentFormValues) => void;
  errors?: DocumentFormErrors;
  disabled?: boolean;
}

function errorMessage(
  errors: DocumentFormErrors | undefined,
  key: keyof DocumentFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : (err as { message?: string }).message;
}

export function DocumentForm({
  value = {},
  onChange,
  errors,
  disabled = false,
}: DocumentFormProps) {
  const [issuedDateOpen, setIssuedDateOpen] = React.useState(false);
  const [expiryDateOpen, setExpiryDateOpen] = React.useState(false);

  const setField = <K extends keyof DocumentFormValues>(
    key: K,
    fieldValue: DocumentFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const toValidDate = (val?: Date | string | null): Date | undefined => {
    if (!val) return undefined;
    const dateObj = typeof val === "string" ? new Date(val) : val;
    return isValid(dateObj) ? dateObj : undefined;
  };

  const documentTypeError = errorMessage(errors, "documentType");
  const documentNumberError = errorMessage(errors, "documentNumber");
  const titleError = errorMessage(errors, "title");
  const descriptionError = errorMessage(errors, "description");
  const issuedByError = errorMessage(errors, "issuedBy");
  const issuedDistrictError = errorMessage(errors, "issuedDistrict");
  const issuedDateError = errorMessage(errors, "issuedDate");
  const expiryDateError = errorMessage(errors, "expiryDate");
  const mediaRefsError = errorMessage(errors, "mediaRefs");

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Document Details & Verification Files
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Provide identification details, issuing credentials, and document scans (e.g. Front & Back).
        </p>
      </div>

      {/* Document Type & Document Number */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="doc-documentType"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Document type <span className="text-red-600 dark:text-red-500">*</span>
          </Label>
          <Select
            value={value.documentType ?? ""}
            onValueChange={(val) => setField("documentType", val as string)}
            disabled={disabled}
          >
            <SelectTrigger
              id="doc-documentType"
              aria-invalid={Boolean(documentTypeError)}
              className={cn(
                "h-11 w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors",
                "focus:border-red-500 focus:ring-1 focus:ring-red-500/20",
                "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100",
                documentTypeError && "border-red-500",
              )}
            >
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {documentTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {documentTypeError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {documentTypeError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="doc-documentNumber"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Document number <span className="text-red-600 dark:text-red-500">*</span>
          </Label>
          <Input
            id="doc-documentNumber"
            placeholder="e.g. 12-34-56789"
            value={value.documentNumber ?? ""}
            onChange={(e) => setField("documentNumber", e.target.value.toUpperCase())}
            disabled={disabled}
            aria-invalid={Boolean(documentNumberError)}
            className={cn(
              "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm uppercase text-zinc-900 transition-colors placeholder:text-zinc-400 placeholder:normal-case",
              "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
              "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              documentNumberError && "border-red-500",
            )}
          />
          {documentNumberError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {documentNumberError}
            </p>
          )}
        </div>
      </div>

      {/* Document Title */}
      <div className="space-y-2">
        <Label
          htmlFor="doc-title"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
        >
          Document Title / Caption
        </Label>
        <Input
          id="doc-title"
          placeholder="e.g. Citizenship Certificate (Front & Back)"
          maxLength={200}
          value={value.title ?? ""}
          onChange={(e) => setField("title", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(titleError)}
          className={cn(
            "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
            "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
            titleError && "border-red-500",
          )}
        />
        {titleError && (
          <p className="text-xs text-red-600 dark:text-red-500">{titleError}</p>
        )}
      </div>

      {/* Description & Remarks */}
      <div className="space-y-2">
        <Label
          htmlFor="doc-description"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
        >
          Description & Remarks
        </Label>
        <Textarea
          id="doc-description"
          placeholder="Any additional notes or legal stipulations regarding this certificate..."
          rows={3}
          maxLength={2000}
          value={value.description ?? ""}
          onChange={(e) => setField("description", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(descriptionError)}
          className={cn(
            "resize-none rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
            "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
            descriptionError && "border-red-500",
          )}
        />
        {descriptionError && (
          <p className="text-xs text-red-600 dark:text-red-500">
            {descriptionError}
          </p>
        )}
      </div>

      {/* Issued by & Issued District */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="doc-issuedBy"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Issuing Authority / Agency
          </Label>
          <Input
            id="doc-issuedBy"
            placeholder="e.g. District Administration Office"
            maxLength={200}
            value={value.issuedBy ?? ""}
            onChange={(e) => setField("issuedBy", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(issuedByError)}
            className={cn(
              "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
              "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
              "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              issuedByError && "border-red-500",
            )}
          />
          {issuedByError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {issuedByError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="doc-issuedDistrict"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Issuing District / State
          </Label>
          <Input
            id="doc-issuedDistrict"
            placeholder="e.g. Kathmandu"
            maxLength={100}
            value={value.issuedDistrict ?? ""}
            onChange={(e) => setField("issuedDistrict", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(issuedDistrictError)}
            className={cn(
              "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
              "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
              "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              issuedDistrictError && "border-red-500",
            )}
          />
          {issuedDistrictError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {issuedDistrictError}
            </p>
          )}
        </div>
      </div>

      {/* Issued Date & Expiry Date */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            Issued date
          </Label>
          <Popover open={issuedDateOpen} onOpenChange={setIssuedDateOpen}>
            <PopoverTrigger>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                aria-invalid={Boolean(issuedDateError)}
                className={cn(
                  "h-11 w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left text-sm font-normal text-zinc-900 transition-colors",
                  "hover:border-red-400 hover:bg-red-50/50",
                  "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
                  "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-800",
                  !value.issuedDate && "text-zinc-400 dark:text-zinc-600",
                  issuedDateError && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-red-600 dark:text-red-500" />
                {toValidDate(value.issuedDate)
                  ? format(toValidDate(value.issuedDate)!, "PPP")
                  : "Pick issue date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto rounded-none border-zinc-200 p-0 dark:border-zinc-800"
              align="start"
            >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={toValidDate(value.issuedDate)}
                onSelect={(date) => {
                  setField("issuedDate", date ?? null);
                  setIssuedDateOpen(false);
                }}
                disabled={(date) => date > new Date()}
                className="rounded-none"
              />
            </PopoverContent>
          </Popover>
          {issuedDateError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {issuedDateError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            Expiry date
          </Label>
          <Popover open={expiryDateOpen} onOpenChange={setExpiryDateOpen}>
            <PopoverTrigger>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                aria-invalid={Boolean(expiryDateError)}
                className={cn(
                  "h-11 w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left text-sm font-normal text-zinc-900 transition-colors",
                  "hover:border-red-400 hover:bg-red-50/50",
                  "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
                  "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-800",
                  !value.expiryDate && "text-zinc-400 dark:text-zinc-600",
                  expiryDateError && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-red-600 dark:text-red-500" />
                {toValidDate(value.expiryDate)
                  ? format(toValidDate(value.expiryDate)!, "PPP")
                  : "Pick expiry date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto rounded-none border-zinc-200 p-0 dark:border-zinc-800"
              align="start"
            >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={toValidDate(value.expiryDate)}
                onSelect={(date) => {
                  setField("expiryDate", date ?? null);
                  setExpiryDateOpen(false);
                }}
                className="rounded-none"
              />
            </PopoverContent>
          </Popover>
          {expiryDateError && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {expiryDateError}
            </p>
          )}
        </div>
      </div>

      {/* Multiple Image Picker for Document Scans */}
      <div className="pt-2">
        <MultipleImagePicker
          label="Attached Verification Scans & Documents"
          description="Select document scans (e.g. Front & Back pages, up to 5MB each)"
          value={value.mediaRefs ?? []}
          onChange={(files) => setField("mediaRefs", files)}
          error={mediaRefsError}
          disabled={disabled}
          maxFiles={6}
          maxSizeMB={5}
        />
      </div>
    </div>
  );
}