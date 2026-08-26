"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type AddressLabel = "home" | "office" | "warehouse" | "other";

export type AddressFormValues = {
  label?: AddressLabel;
  street?: string;
  city?: string;
  district?: string;
  country?: string;
  isPrimary?: boolean;
};

export type AddressFormErrors = Partial<
  Record<keyof AddressFormValues, { message?: string } | string>
>;

export interface AddressFormProps {
  value?: AddressFormValues;
  onChange: (value: AddressFormValues) => void;
  errors?: AddressFormErrors;
  disabled?: boolean;
  title?: string;
  /** Unique prefix for HTML IDs to prevent collisions when rendering multiple address forms */
  idPrefix?: string;
}

function errorMessage(
  errors: AddressFormErrors | undefined,
  key: keyof AddressFormValues,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

export function AddressForm({
  value = {},
  onChange,
  errors,
  disabled = false,
  title = "Address",
  idPrefix = "address",
}: AddressFormProps) {
  const setField = <K extends keyof AddressFormValues>(
    key: K,
    fieldValue: AddressFormValues[K],
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const labelError = errorMessage(errors, "label");
  const streetError = errorMessage(errors, "street");
  const cityError = errorMessage(errors, "city");
  const districtError = errorMessage(errors, "district");
  const countryError = errorMessage(errors, "country");

  return (
    <div className="space-y-6">
      {/* Section title */}
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      )}

      {/* Label & Street */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-label`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Label
          </Label>
          <Select
            value={value.label}
            onValueChange={(v) => setField("label", v as AddressLabel)}
            disabled={disabled}
          >
            <SelectTrigger
              id={`${idPrefix}-label`}
              aria-invalid={Boolean(labelError)}
              aria-describedby={labelError ? `${idPrefix}-label-error` : undefined}
              className={cn(
                "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                labelError && "border-red-500",
              )}
            >
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700">
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {labelError && (
            <p id={`${idPrefix}-label-error`} className="text-sm text-red-600">
              {labelError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-street`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            Street
          </Label>
          <Input
            id={`${idPrefix}-street`}
            placeholder="Enter street address"
            value={value.street ?? ""}
            onChange={(e) => setField("street", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(streetError)}
            aria-describedby={streetError ? `${idPrefix}-street-error` : undefined}
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              streetError && "border-red-500",
            )}
          />
          {streetError && (
            <p id={`${idPrefix}-street-error`} className="text-sm text-red-600">
              {streetError}
            </p>
          )}
        </div>
      </div>

      {/* City & District */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-city`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            City
          </Label>
          <Input
            id={`${idPrefix}-city`}
            placeholder="City"
            value={value.city ?? ""}
            onChange={(e) => setField("city", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(cityError)}
            aria-describedby={cityError ? `${idPrefix}-city-error` : undefined}
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              cityError && "border-red-500",
            )}
          />
          {cityError && (
            <p id={`${idPrefix}-city-error`} className="text-sm text-red-600">
              {cityError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${idPrefix}-district`}
            className="text-zinc-700 dark:text-zinc-300"
          >
            District
          </Label>
          <Input
            id={`${idPrefix}-district`}
            placeholder="District"
            value={value.district ?? ""}
            onChange={(e) => setField("district", e.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(districtError)}
            aria-describedby={districtError ? `${idPrefix}-district-error` : undefined}
            className={cn(
              "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
              "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
              "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
              districtError && "border-red-500",
            )}
          />
          {districtError && (
            <p id={`${idPrefix}-district-error`} className="text-sm text-red-600">
              {districtError}
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label
          htmlFor={`${idPrefix}-country`}
          className="text-zinc-700 dark:text-zinc-300"
        >
          Country
        </Label>
        <Input
          id={`${idPrefix}-country`}
          placeholder="Country"
          value={value.country ?? ""}
          onChange={(e) => setField("country", e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(countryError)}
          aria-describedby={countryError ? `${idPrefix}-country-error` : undefined}
          className={cn(
            "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
            "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
            countryError && "border-red-500",
          )}
        />
        {countryError && (
          <p id={`${idPrefix}-country-error`} className="text-sm text-red-600">
            {countryError}
          </p>
        )}
      </div>

      {/* Primary toggle */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${idPrefix}-isPrimary`}
          className="cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          Set as primary address
        </Label>
        <Switch
          id={`${idPrefix}-isPrimary`}
          checked={Boolean(value.isPrimary)}
          onCheckedChange={(checked) => setField("isPrimary", checked)}
          disabled={disabled}
          className={cn(
            "h-5 w-9 rounded-none",
            "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-700",
            "data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600",
            "[&>span]:rounded-none [&>span]:bg-white",
            "[&>span]:data-[state=checked]:translate-x-4",
          )}
        />
      </div>
    </div>
  );
}