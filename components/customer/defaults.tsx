"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type PaymentTerm = "credit" | "cash" | "advance";

export const paymentTermOptions: { value: PaymentTerm; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "credit", label: "Credit" },
  { value: "advance", label: "Advance" },
];

export type DefaultsFormValues = {
  creditLimit?: number;
  interestRateYearly?: number;
  maxCreditDays?: number;
  paymentTerm?: PaymentTerm;
  tdsApplicable?: boolean;
};

export type DefaultsFormErrors = Partial<
  Record<keyof DefaultsFormValues, { message?: string } | string>
>;

export interface DefaultsFormProps {
  value?: DefaultsFormValues;
  onChange: (value: DefaultsFormValues) => void;
  errors?: DefaultsFormErrors;
  disabled?: boolean;
  title?: string;
  /** Prefix for HTML IDs to avoid collisions in multi-instance contexts */
  idPrefix?: string;
}

function errorMessage(
  errors: DefaultsFormErrors | undefined,
  key: keyof DefaultsFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

export function DefaultsForm({
  value = {},
  onChange,
  errors,
  disabled = false,
  title,
  idPrefix = "defaults",
}: DefaultsFormProps) {
  const setField = <K extends keyof DefaultsFormValues>(
    key: K,
    fieldValue: DefaultsFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const creditLimitError = errorMessage(errors, "creditLimit");
  const interestRateError = errorMessage(errors, "interestRateYearly");
  const maxCreditDaysError = errorMessage(errors, "maxCreditDays");
  const paymentTermError = errorMessage(errors, "paymentTerm");
  const tdsApplicableError = errorMessage(errors, "tdsApplicable");

  return (
    <div className="space-y-8">
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      )}

      {/* Credit limit & Interest rate */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-creditLimit`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Credit limit
          </Label>
          <Input
            id={`${idPrefix}-creditLimit`}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0"
            value={value.creditLimit ?? ""}
            onChange={(e) =>
              setField(
                "creditLimit",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
            disabled={disabled}
            aria-invalid={Boolean(creditLimitError)}
            aria-describedby={
              creditLimitError ? `${idPrefix}-creditLimit-error` : undefined
            }
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              creditLimitError && "border-red-500",
            )}
          />
          {creditLimitError && (
            <p
              id={`${idPrefix}-creditLimit-error`}
              className="text-sm text-red-600"
            >
              {creditLimitError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-interestRateYearly`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Interest rate (yearly %)
          </Label>
          <Input
            id={`${idPrefix}-interestRateYearly`}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="0.01"
            placeholder="0"
            value={value.interestRateYearly ?? ""}
            onChange={(e) =>
              setField(
                "interestRateYearly",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
            disabled={disabled}
            aria-invalid={Boolean(interestRateError)}
            aria-describedby={
              interestRateError
                ? `${idPrefix}-interestRateYearly-error`
                : undefined
            }
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              interestRateError && "border-red-500",
            )}
          />
          {interestRateError && (
            <p
              id={`${idPrefix}-interestRateYearly-error`}
              className="text-sm text-red-600"
            >
              {interestRateError}
            </p>
          )}
        </div>
      </div>

      {/* Max credit days & Payment term */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-maxCreditDays`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Max credit days
          </Label>
          <Input
            id={`${idPrefix}-maxCreditDays`}
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            placeholder="0"
            value={value.maxCreditDays ?? ""}
            onChange={(e) =>
              setField(
                "maxCreditDays",
                e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0,
              )
            }
            disabled={disabled}
            aria-invalid={Boolean(maxCreditDaysError)}
            aria-describedby={
              maxCreditDaysError
                ? `${idPrefix}-maxCreditDays-error`
                : undefined
            }
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              maxCreditDaysError && "border-red-500",
            )}
          />
          {maxCreditDaysError && (
            <p
              id={`${idPrefix}-maxCreditDays-error`}
              className="text-sm text-red-600"
            >
              {maxCreditDaysError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-paymentTerm`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Payment term
          </Label>
          <Select
            value={value.paymentTerm ?? "credit"}
            onValueChange={(v) => setField("paymentTerm", v as PaymentTerm)}
            disabled={disabled}
          >
            <SelectTrigger
              id={`${idPrefix}-paymentTerm`}
              aria-invalid={Boolean(paymentTermError)}
              aria-describedby={
                paymentTermError ? `${idPrefix}-paymentTerm-error` : undefined
              }
              className={cn(
                "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                paymentTermError && "border-red-500",
              )}
            >
              <SelectValue placeholder="Select payment term" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700">
              {paymentTermOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {paymentTermError && (
            <p
              id={`${idPrefix}-paymentTerm-error`}
              className="text-sm text-red-600"
            >
              {paymentTermError}
            </p>
          )}
        </div>
      </div>

      {/* TDS applicable */}
      <div className="flex items-center justify-between py-2">
        <div>
          <Label
            htmlFor={`${idPrefix}-tdsApplicable`}
            className="cursor-pointer text-zinc-700 dark:text-zinc-300"
          >
            TDS applicable
          </Label>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Deduct TDS on transactions with this customer.
          </p>
          {tdsApplicableError && (
            <p className="mt-1 text-sm text-red-600">{tdsApplicableError}</p>
          )}
        </div>
        <Switch
          id={`${idPrefix}-tdsApplicable`}
          checked={Boolean(value.tdsApplicable)}
          onCheckedChange={(checked) => setField("tdsApplicable", checked)}
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