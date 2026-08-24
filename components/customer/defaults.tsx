"use client";

import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { FormSection } from "../FormSection";
import { CustomerFormValues } from "./customer";



type PaymentTerm = "credit" | "cash" | "advance";
const paymentTermOptions: { value: PaymentTerm; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "credit", label: "Credit" },
  { value: "advance", label: "Advance" },
];

export function DefaultsForm() {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const defaultsErrors = errors.defaults ?? {};

  return (
    <div className="space-y-10">
      {/* Credit limit & Interest rate */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="defaults-creditLimit" className="text-zinc-700 dark:text-zinc-300">
            Credit limit
          </Label>
          <Controller<CustomerFormValues, "defaults.creditLimit">
            name="defaults.creditLimit"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="defaults-creditLimit"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="0"
                value={value ?? 0}
                onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  defaultsErrors.creditLimit && "border-red-500"
                )}
              />
            )}
          />
          {defaultsErrors.creditLimit && (
            <p className="text-sm text-red-600">{defaultsErrors.creditLimit.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaults-interestRateYearly" className="text-zinc-700 dark:text-zinc-300">
            Interest rate (yearly %)
          </Label>
          <Controller<CustomerFormValues, "defaults.interestRateYearly">
            name="defaults.interestRateYearly"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="defaults-interestRateYearly"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="0.01"
                placeholder="0"
                value={value ?? 0}
                onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  defaultsErrors.interestRateYearly && "border-red-500"
                )}
              />
            )}
          />
          {defaultsErrors.interestRateYearly && (
            <p className="text-sm text-red-600">{defaultsErrors.interestRateYearly.message}</p>
          )}
        </div>
      </div>

      {/* Max credit days & Payment term */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="defaults-maxCreditDays" className="text-zinc-700 dark:text-zinc-300">
            Max credit days
          </Label>
          <Controller<CustomerFormValues, "defaults.maxCreditDays">
            name="defaults.maxCreditDays"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="defaults-maxCreditDays"
                type="number"
                inputMode="numeric"
                min={0}
                step="1"
                placeholder="0"
                value={value ?? 0}
                onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  defaultsErrors.maxCreditDays && "border-red-500"
                )}
              />
            )}
          />
          {defaultsErrors.maxCreditDays && (
            <p className="text-sm text-red-600">{defaultsErrors.maxCreditDays.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-300">Payment term</Label>
          <Controller<CustomerFormValues, "defaults.paymentTerm">
            name="defaults.paymentTerm"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select onValueChange={onChange} value={value ?? "credit"} disabled={isSubmitting}>
                <SelectTrigger
                  className={cn(
                    "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                    defaultsErrors.paymentTerm && "border-red-500"
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
            )}
          />
          {defaultsErrors.paymentTerm && (
            <p className="text-sm text-red-600">{defaultsErrors.paymentTerm.message}</p>
          )}
        </div>
      </div>

      {/* TDS applicable */}
      <div className="flex items-center justify-between py-2">
        <div>
          <Label
            htmlFor="defaults-tdsApplicable"
            className="text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            TDS applicable
          </Label>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Deduct TDS on transactions with this customer.
          </p>
        </div>
        <Controller<CustomerFormValues, "defaults.tdsApplicable">
          name="defaults.tdsApplicable"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch
              id="defaults-tdsApplicable"
              checked={Boolean(value)}
              onCheckedChange={onChange}
              disabled={isSubmitting}
              className={cn(
                "rounded-none",
                "border-zinc-600 bg-zinc-300 dark:bg-zinc-700",
                "data-[state=checked]:bg-red-600",
                "h-5 w-9",
                "[&>span]:rounded-none [&>span]:bg-white",
                "[&>span]:data-[state=checked]:translate-x-4"
              )}
            />
          )}
        />
      </div>
    </div>
  );
}