"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Role = "customer" | "vendor" | "employee";
const roleOptions: Role[] = ["customer", "vendor", "employee"];

export type Gender = "male" | "female" | "other";

export type IdentityFormValues = {
  fullName: string;
  phone: string;
  email?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  roles: Role[];
  notes?: string;
  // Kept for type compatibility with parent, though not rendered here
  avatarUrl?: string;
  avatar?: File | string | null;
};

export type IdentityFormErrors = Partial<
  Record<keyof IdentityFormValues, { message?: string } | string>
>;

export interface IdentityFormProps {
  value: IdentityFormValues;
  onChange: (value: IdentityFormValues) => void;
  errors?: IdentityFormErrors;
  disabled?: boolean;
}

function errorMessage(
  errors: IdentityFormErrors | undefined,
  key: keyof IdentityFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

export function IdentityForm({
  value,
  onChange,
  errors,
  disabled = false,
}: IdentityFormProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const formId = React.useId();

  const getFieldId = (field: string) => `${formId}-${field}`;
  const getErrorId = (field: string) => `${formId}-${field}-error`;

  const setField = <K extends keyof IdentityFormValues>(
    key: K,
    fieldValue: IdentityFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const inputClasses = cn(
    "h-11 w-full rounded-none border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
    "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20 focus-visible:outline-none",
    "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
    "disabled:cursor-not-allowed disabled:opacity-50",
  );

  const errorInputClasses =
    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20";
  const labelClasses =
    "text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400";
  const errorTextClasses = "text-xs text-red-600 dark:text-red-500 mt-1.5";

  return (
    <div className="flex flex-col gap-10">
      {/* SECTION 1: Personal Details */}
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={getFieldId("fullName")} className={labelClasses}>
              Full Name{" "}
              <span className="text-red-600 dark:text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id={getFieldId("fullName")}
              autoComplete="name"
              placeholder="e.g. Sujan Karki"
              value={value.fullName ?? ""}
              onChange={(e) => setField("fullName", e.target.value)}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage(errors, "fullName"))}
              aria-describedby={
                errorMessage(errors, "fullName")
                  ? getErrorId("fullName")
                  : undefined
              }
              className={cn(
                inputClasses,
                errorMessage(errors, "fullName") && errorInputClasses,
              )}
            />
            {errorMessage(errors, "fullName") && (
              <p id={getErrorId("fullName")} className={errorTextClasses}>
                {errorMessage(errors, "fullName")}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor={getFieldId("gender")} className={labelClasses}>
              Gender
            </Label>
            <Select
              onValueChange={(v) => setField("gender", v as Gender)}
              value={value.gender}
              disabled={disabled}
            >
              <SelectTrigger
                id={getFieldId("gender")}
                className={cn("capitalize",
                  inputClasses,
                  errorMessage(errors, "gender") && errorInputClasses,
                )}
                aria-invalid={Boolean(errorMessage(errors, "gender"))}
                aria-describedby={
                  errorMessage(errors, "gender")
                    ? getErrorId("gender")
                    : undefined
                }
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="rounded-none capitalize border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errorMessage(errors, "gender") && (
              <p id={getErrorId("gender")} className={errorTextClasses}>
                {errorMessage(errors, "gender")}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor={getFieldId("dob")} className={labelClasses}>
              Date of Birth
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger className={"w-full"}>
                <Button
                  type="button"
                  variant="outline"
                  id={getFieldId("dob")}
                  disabled={disabled}
                  className={cn(
                    inputClasses,
                    "justify-start text-left font-normal w-full",
                    !value.dateOfBirth && "text-zinc-400 dark:text-zinc-600",
                    errorMessage(errors, "dateOfBirth") && errorInputClasses,
                  )}
                  aria-invalid={Boolean(errorMessage(errors, "dateOfBirth"))}
                  aria-describedby={
                    errorMessage(errors, "dateOfBirth")
                      ? getErrorId("dateOfBirth")
                      : undefined
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  {value.dateOfBirth && !isNaN(value.dateOfBirth.getTime())
                    ? format(value.dateOfBirth, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto rounded-none border-zinc-200 p-0 dark:border-zinc-800"
                align="start"
              >
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={value.dateOfBirth}
                  onSelect={(date) => {
                    setField("dateOfBirth", date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  
                  className="rounded-none"
                />
              </PopoverContent>
            </Popover>
            {errorMessage(errors, "dateOfBirth") && (
              <p id={getErrorId("dateOfBirth")} className={errorTextClasses}>
                {errorMessage(errors, "dateOfBirth")}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor={getFieldId("email")} className={labelClasses}>
              Email Address
            </Label>
            <Input
              id={getFieldId("email")}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={value.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage(errors, "email"))}
              aria-describedby={
                errorMessage(errors, "email") ? getErrorId("email") : undefined
              }
              className={cn(
                inputClasses,
                errorMessage(errors, "email") && errorInputClasses,
              )}
            />
            {errorMessage(errors, "email") && (
              <p id={getErrorId("email")} className={errorTextClasses}>
                {errorMessage(errors, "email")}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor={getFieldId("phone")} className={labelClasses}>
              Phone Number{" "}
              <span className="text-red-600 dark:text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id={getFieldId("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={value.phone ?? ""}
              onChange={(e) => setField("phone", e.target.value)}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage(errors, "phone"))}
              aria-describedby={
                errorMessage(errors, "phone") ? getErrorId("phone") : undefined
              }
              className={cn(
                inputClasses,
                errorMessage(errors, "phone") && errorInputClasses,
              )}
            />
            {errorMessage(errors, "phone") && (
              <p id={getErrorId("phone")} className={errorTextClasses}>
                {errorMessage(errors, "phone")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={getFieldId("notes")} className={labelClasses}>
            Internal Notes & Preferences
          </Label>
          <Textarea
            id={getFieldId("notes")}
            placeholder="e.g. Tax exempt status, specific billing cycles, VIP handling..."
            rows={4}
            value={value.notes ?? ""}
            onChange={(e) => setField("notes", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errorMessage(errors, "notes"))}
            aria-describedby={
              errorMessage(errors, "notes") ? getErrorId("notes") : undefined
            }
            className={cn(
              inputClasses,
              "resize-none min-h-[100px] py-3",
              errorMessage(errors, "notes") && errorInputClasses,
            )}
          />
          {errorMessage(errors, "notes") && (
            <p id={getErrorId("notes")} className={errorTextClasses}>
              {errorMessage(errors, "notes")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
