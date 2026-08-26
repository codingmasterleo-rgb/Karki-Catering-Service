"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type ContactFormValues = {
  name?: string;
  relation?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
};

export type ContactFormErrors = Partial<
  Record<keyof ContactFormValues, { message?: string } | string>
>;

export interface ContactFormProps {
  value?: ContactFormValues;
  onChange: (value: ContactFormValues) => void;
  errors?: ContactFormErrors;
  disabled?: boolean;
  title?: string;
  /** Set to true when rendering as an Emergency Contact or secondary contact requiring person info */
  showNameAndRelation?: boolean;
  /** Prefix for HTML IDs to prevent collisions when rendering multiple contact forms */
  idPrefix?: string;
}

function errorMessage(
  errors: ContactFormErrors | undefined,
  key: keyof ContactFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

export function ContactForm({
  value = {},
  onChange,
  errors,
  disabled = false,
  title = "Contact",
  showNameAndRelation = false,
  idPrefix = "contact",
}: ContactFormProps) {
  const setField = <K extends keyof ContactFormValues>(
    key: K,
    fieldValue: ContactFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const nameError = errorMessage(errors, "name");
  const relationError = errorMessage(errors, "relation");
  const phoneError = errorMessage(errors, "phone");
  const emailError = errorMessage(errors, "email");

  return (
    <div>
      {/* Section title */}
      {title && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      )}

      {/* Name & Relation – shown for emergency contacts */}
      {showNameAndRelation && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor={`${idPrefix}-name`}
              className="text-zinc-700 dark:text-zinc-300"
            >
              Full name <span className="text-red-600">*</span>
            </Label>
            <Input
              id={`${idPrefix}-name`}
              placeholder="Contact person's full name"
              value={value.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
              disabled={disabled}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? `${idPrefix}-name-error` : undefined}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                nameError && "border-red-500",
              )}
            />
            {nameError && (
              <p id={`${idPrefix}-name-error`} className="text-sm text-red-600">
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`${idPrefix}-relation`}
              className="text-zinc-700 dark:text-zinc-300"
            >
              Relation <span className="text-red-600">*</span>
            </Label>
            <Input
              id={`${idPrefix}-relation`}
              placeholder="e.g. Spouse, Sibling, Parent"
              value={value.relation ?? ""}
              onChange={(e) => setField("relation", e.target.value)}
              disabled={disabled}
              aria-invalid={Boolean(relationError)}
              aria-describedby={relationError ? `${idPrefix}-relation-error` : undefined}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                relationError && "border-red-500",
              )}
            />
            {relationError && (
              <p id={`${idPrefix}-relation-error`} className="text-sm text-red-600">
                {relationError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Phone & Email */}
      <div className={cn("grid gap-6 sm:grid-cols-2", showNameAndRelation ? "mt-6" : "")}>
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-phone`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Phone number <span className="text-red-600">*</span>
          </Label>
          <Input
            id={`${idPrefix}-phone`}
            placeholder="e.g. 9812345678"
            value={value.phone ?? ""}
            onChange={(e) => setField("phone", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? `${idPrefix}-phone-error` : undefined}
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm tabular-nums transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              phoneError && "border-red-500",
            )}
          />
          {phoneError && (
            <p id={`${idPrefix}-phone-error`} className="text-sm text-red-600">
              {phoneError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-email`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Email address
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            placeholder="contact@example.com"
            value={value.email ?? ""}
            onChange={(e) => setField("email", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? `${idPrefix}-email-error` : undefined}
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              emailError && "border-red-500",
            )}
          />
          {emailError && (
            <p id={`${idPrefix}-email-error`} className="text-sm text-red-600">
              {emailError}
            </p>
          )}
        </div>
      </div>

      {/* Primary toggle */}
      <div className="mt-6 flex items-center justify-between">
        <Label
          htmlFor={`${idPrefix}-isPrimary`}
          className="cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          Set as primary contact
        </Label>
        <Switch
          id={`${idPrefix}-isPrimary`}
          checked={Boolean(value.isPrimary)}
          onCheckedChange={(checked) => setField("isPrimary", checked)}
          disabled={disabled}
          className={cn(
            "rounded-none",
            "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-700",
            "data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600",
            "h-5 w-9",
            "[&>span]:rounded-none [&>span]:bg-white",
            "[&>span]:data-[state=checked]:translate-x-4",
          )}
        />
      </div>
    </div>
  );
}