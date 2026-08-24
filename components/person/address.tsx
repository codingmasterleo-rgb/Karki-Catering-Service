"use client";

import { useFormContext, Controller } from "react-hook-form";
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
import { CustomerFormValues } from "../customer/customer";

export type OwnerType = "Person" | "Company";
export type AddressLabel = "home" | "office" | "warehouse" | "other";

type AddressRoot = "permanentAddress" | "temporaryAddress";

interface AddressFormProps {
  name: AddressRoot;
  title?: string;
}

export function AddressForm({ name, title = "Address" }: AddressFormProps) {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const sectionErrors = (errors[name] ?? {}) as Record<string, { message?: string } | undefined>;

  return (
    <div>
      {/* Section title */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h3>

      {/* Label & Street */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${name}-label`} className="text-zinc-700 dark:text-zinc-300">
            Label
          </Label>
          <Controller<CustomerFormValues, `${AddressRoot}.label`>
            name={`${name}.label`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select onValueChange={onChange} value={value ?? "office"} disabled={isSubmitting}>
                <SelectTrigger
                  id={`${name}-label`}
                  className={cn(
                    "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                    sectionErrors.label && "border-red-500"
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
            )}
          />
          {sectionErrors.label && (
            <p className="text-sm text-red-600">{sectionErrors.label.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${name}-street`} className="text-zinc-700 dark:text-zinc-300">
            Street
          </Label>
          <Controller<CustomerFormValues, `${AddressRoot}.street`>
            name={`${name}.street`}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id={`${name}-street`}
                placeholder="Enter street address"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  sectionErrors.street && "border-red-500"
                )}
              />
            )}
          />
          {sectionErrors.street && (
            <p className="text-sm text-red-600">{sectionErrors.street.message}</p>
          )}
        </div>
      </div>

      {/* City & District */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${name}-city`} className="text-zinc-700 dark:text-zinc-300">
            City
          </Label>
          <Controller<CustomerFormValues, `${AddressRoot}.city`>
            name={`${name}.city`}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id={`${name}-city`}
                placeholder="City"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  sectionErrors.city && "border-red-500"
                )}
              />
            )}
          />
          {sectionErrors.city && (
            <p className="text-sm text-red-600">{sectionErrors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${name}-district`} className="text-zinc-700 dark:text-zinc-300">
            District
          </Label>
          <Controller<CustomerFormValues, `${AddressRoot}.district`>
            name={`${name}.district`}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id={`${name}-district`}
                placeholder="District"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  sectionErrors.district && "border-red-500"
                )}
              />
            )}
          />
          {sectionErrors.district && (
            <p className="text-sm text-red-600">{sectionErrors.district.message}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="mt-6 space-y-2">
        <Label htmlFor={`${name}-country`} className="text-zinc-700 dark:text-zinc-300">
          Country
        </Label>
        <Controller<CustomerFormValues, `${AddressRoot}.country`>
          name={`${name}.country`}
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Input
              id={`${name}-country`}
              placeholder="Country"
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm capitalize transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                sectionErrors.country && "border-red-500"
              )}
            />
          )}
        />
        {sectionErrors.country && (
          <p className="text-sm text-red-600">{sectionErrors.country.message}</p>
        )}
      </div>

      {/* Primary toggle */}
      <div className="mt-6 flex items-center justify-between">
        <Label
          htmlFor={`${name}-isPrimary`}
          className="cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          Set as primary address
        </Label>
        <Controller<CustomerFormValues, `${AddressRoot}.isPrimary`>
          name={`${name}.isPrimary`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch
              id={`${name}-isPrimary`}
              checked={Boolean(value)}
              onCheckedChange={onChange}
              disabled={isSubmitting}
              className={cn(
                "rounded-none",
                "border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-700",
                "data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600",
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