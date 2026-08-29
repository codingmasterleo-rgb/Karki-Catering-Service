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
import { SingleImagePicker } from "../image-picker";

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
  onAvatarChange?: (file: File | null) => void;
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
  onAvatarChange,
}: IdentityFormProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const setField = <K extends keyof IdentityFormValues>(
    key: K,
    fieldValue: IdentityFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const handleAvatarChange = (file: File | null) => {
    if (onAvatarChange) {
      onAvatarChange(file);
    }
    onChange({
      ...value,
      avatar: file,
      avatarUrl: file ? URL.createObjectURL(file) : "",
    });
  };

  const avatarError =
    errorMessage(errors, "avatarUrl") || errorMessage(errors, "avatar");

  return (
    <div className="space-y-6">
      {/* Profile Photo / Avatar Picker */}
      <SingleImagePicker
        label="Profile Photo & Avatar"
        description="JPG, PNG, or WEBP up to 5MB"
        value={value.avatar ?? value.avatarUrl ?? null}
        onChange={handleAvatarChange}
        error={avatarError}
        disabled={disabled}
        maxSizeMB={5}
      />

      {/* Full Name & Phone */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="identity-fullName"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Full name <span className="text-red-600 dark:text-red-500">*</span>
          </Label>
          <Input
            id="identity-fullName"
            placeholder="e.g. Sujan Karki"
            value={value.fullName ?? ""}
            onChange={(e) => setField("fullName", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errorMessage(errors, "fullName"))}
            className={cn(
              "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
              "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
              "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              errorMessage(errors, "fullName") && "border-red-500",
            )}
          />
          {errorMessage(errors, "fullName") && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {errorMessage(errors, "fullName")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="identity-phone"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
          >
            Phone number <span className="text-red-600 dark:text-red-500">*</span>
          </Label>
          <Input
            id="identity-phone"
            placeholder="98XXXXXXXX"
            value={value.phone ?? ""}
            onChange={(e) => setField("phone", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errorMessage(errors, "phone"))}
            className={cn(
              "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm tabular-nums text-zinc-900 transition-colors placeholder:text-zinc-400",
              "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
              "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
              errorMessage(errors, "phone") && "border-red-500",
            )}
          />
          {errorMessage(errors, "phone") && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {errorMessage(errors, "phone")}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="identity-email"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
        >
          Email address
        </Label>
        <Input
          id="identity-email"
          type="email"
          placeholder="name@example.com"
          value={value.email ?? ""}
          onChange={(e) => setField("email", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errorMessage(errors, "email"))}
          className={cn(
            "h-11 rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
            "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
            errorMessage(errors, "email") && "border-red-500",
          )}
        />
        {errorMessage(errors, "email") && (
          <p className="text-xs text-red-600 dark:text-red-500">
            {errorMessage(errors, "email")}
          </p>
        )}
      </div>

      {/* Gender & Date of Birth */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            Gender
          </Label>
          <Select
            onValueChange={(v) => setField("gender", v as Gender)}
            value={value.gender}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "h-11 w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors",
                "focus:border-red-500 focus:ring-1 focus:ring-red-500/20",
                "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100",
                errorMessage(errors, "gender") && "border-red-500",
              )}
            >
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errorMessage(errors, "gender") && (
            <p className="text-xs text-red-600 dark:text-red-500">
              {errorMessage(errors, "gender")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
            Date of birth
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-11 w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left text-sm font-normal text-zinc-900 transition-colors",
                  "hover:border-red-400 hover:bg-red-50/50",
                  "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
                  "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-800",
                  !value.dateOfBirth && "text-zinc-400 dark:text-zinc-600",
                  errorMessage(errors, "dateOfBirth") && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-red-600 dark:text-red-500" />
                {value.dateOfBirth
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
            <p className="text-xs text-red-600 dark:text-red-500">
              {errorMessage(errors, "dateOfBirth")}
            </p>
          )}
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
          Account Roles
        </Label>
        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
          {roleOptions.map((role) => {
            const checked = (value.roles ?? []).includes(role);
            return (
              <label
                key={role}
                className="flex cursor-pointer items-center space-x-2"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    const currentRoles = value.roles ?? [];
                    const updated = c
                      ? Array.from(new Set([...currentRoles, role]))
                      : currentRoles.filter((r) => r !== role);
                    setField("roles", updated);
                  }}
                  disabled={disabled}
                />
                <span className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-300">
                  {role}
                </span>
              </label>
            );
          })}
        </div>
        {errorMessage(errors, "roles") && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-500">
            {errorMessage(errors, "roles")}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label
          htmlFor="identity-notes"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
        >
          Special Notes & Preferences
        </Label>
        <Textarea
          id="identity-notes"
          placeholder="Dietary requirements, billing instructions, VIP catering notes..."
          rows={4}
          value={value.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errorMessage(errors, "notes"))}
          className={cn(
            "resize-none rounded-none border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20",
            "dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-600",
            errorMessage(errors, "notes") && "border-red-500",
          )}
        />
        {errorMessage(errors, "notes") && (
          <p className="text-xs text-red-600 dark:text-red-500">
            {errorMessage(errors, "notes")}
          </p>
        )}
      </div>
    </div>
  );
}