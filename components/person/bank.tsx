"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type OwnerType = "Person" | "Company";

export type BankDetailFormValues = {
  ownerRef?: string;
  ownerType?: OwnerType;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branch?: string;
  isPrimary?: boolean;
};

export type BankDetailFormErrors = Partial<
  Record<keyof BankDetailFormValues, { message?: string } | string>
>;

export interface BankDetailFormProps {
  value?: BankDetailFormValues;
  onChange: (value: BankDetailFormValues) => void;
  errors?: BankDetailFormErrors;
  disabled?: boolean;
  title?: string;
  /** Prefix for HTML IDs to prevent collisions when rendering multiple bank accounts */
  idPrefix?: string;
}

function errorMessage(
  errors: BankDetailFormErrors | undefined,
  key: keyof BankDetailFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

export function BankDetailForm({
  value = {},
  onChange,
  errors,
  disabled = false,
  title = "Bank details",
  idPrefix = "bank",
}: BankDetailFormProps) {
  const setField = <K extends keyof BankDetailFormValues>(
    key: K,
    fieldValue: BankDetailFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const bankNameError = errorMessage(errors, "bankName");
  const accountHolderNameError = errorMessage(errors, "accountHolderName");
  const accountNumberError = errorMessage(errors, "accountNumber");
  const branchError = errorMessage(errors, "branch");

  return (
    <div className="space-y-6">
      {/* Section title */}
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      )}

      {/* Bank name */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`${idPrefix}-bankName`}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Bank name <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${idPrefix}-bankName`}
          placeholder="e.g. Nepal SBI Bank"
          value={value.bankName ?? ""}
          onChange={(e) => setField("bankName", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(bankNameError)}
          aria-describedby={bankNameError ? `${idPrefix}-bankName-error` : undefined}
          className={cn(
            "h-10 rounded-none border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            bankNameError && "border-red-500",
          )}
        />
        {bankNameError && (
          <p id={`${idPrefix}-bankName-error`} className="text-sm text-red-500">
            {bankNameError}
          </p>
        )}
      </div>

      {/* Account holder name */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`${idPrefix}-accountHolderName`}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Account holder name <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${idPrefix}-accountHolderName`}
          placeholder="Full name as per bank records"
          value={value.accountHolderName ?? ""}
          onChange={(e) => setField("accountHolderName", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(accountHolderNameError)}
          aria-describedby={
            accountHolderNameError ? `${idPrefix}-accountHolderName-error` : undefined
          }
          className={cn(
            "h-10 rounded-none border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            accountHolderNameError && "border-red-500",
          )}
        />
        {accountHolderNameError && (
          <p
            id={`${idPrefix}-accountHolderName-error`}
            className="text-sm text-red-500"
          >
            {accountHolderNameError}
          </p>
        )}
      </div>

      {/* Account number */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`${idPrefix}-accountNumber`}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Account number <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${idPrefix}-accountNumber`}
          placeholder="e.g. 1234567890123456"
          value={value.accountNumber ?? ""}
          onChange={(e) => setField("accountNumber", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(accountNumberError)}
          aria-describedby={
            accountNumberError ? `${idPrefix}-accountNumber-error` : undefined
          }
          className={cn(
            "h-10 rounded-none border-zinc-300 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            accountNumberError && "border-red-500",
          )}
        />
        {accountNumberError && (
          <p
            id={`${idPrefix}-accountNumber-error`}
            className="text-sm text-red-500"
          >
            {accountNumberError}
          </p>
        )}
      </div>

      {/* Branch (optional) */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`${idPrefix}-branch`}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Branch
        </Label>
        <Input
          id={`${idPrefix}-branch`}
          placeholder="e.g. Durbar Marg, Kathmandu"
          value={value.branch ?? ""}
          onChange={(e) => setField("branch", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(branchError)}
          aria-describedby={branchError ? `${idPrefix}-branch-error` : undefined}
          className={cn(
            "h-10 rounded-none border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400",
            "focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            branchError && "border-red-500",
          )}
        />
        {branchError && (
          <p id={`${idPrefix}-branch-error`} className="text-sm text-red-500">
            {branchError}
          </p>
        )}
      </div>

      {/* Primary account toggle */}
      <div className="flex items-center justify-between py-2">
        <Label
          htmlFor={`${idPrefix}-isPrimary`}
          className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Set as primary bank account
        </Label>
        <Switch
          id={`${idPrefix}-isPrimary`}
          checked={Boolean(value.isPrimary)}
          onCheckedChange={(checked) => setField("isPrimary", checked)}
          disabled={disabled}
          className={cn(
            "h-5 w-9 rounded-none",
            "border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700",
            "data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600",
            "[&>span]:rounded-none [&>span]:bg-white",
            "[&>span]:data-[state=checked]:translate-x-4",
          )}
        />
      </div>
    </div>
  );
}