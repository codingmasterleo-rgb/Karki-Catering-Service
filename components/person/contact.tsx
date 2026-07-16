"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FormSection } from "./create-person";

// ----------------------------------------------------------------------
// Types & schema matching the EmergencyContact model
// ----------------------------------------------------------------------
export type OwnerType = "Person" | "Company";

export interface EmergencyContactFormValues {
  ownerRef: string;
  ownerType: OwnerType;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

const emergencyContactFormSchema = z.object({
  ownerRef: z.string().min(1, "Owner reference is required"),
  ownerType: z.enum(["Person", "Company"]),
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^9\d{9}$/, "Enter a valid Nepali phone number (e.g. 9812345678)"),
  isPrimary: z.boolean(),
});

// ----------------------------------------------------------------------
// Component props
// ----------------------------------------------------------------------
interface EmergencyContactFormProps {
  /** ID of the owning entity (Person/Company) – passed in from parent */
  ownerRef: string;
  /** Type of the owning entity – passed in from parent */
  ownerType: OwnerType;
  /** Pre-populate the form (e.g. for editing) */
  defaultValues?: Partial<Omit<EmergencyContactFormValues, "ownerRef" | "ownerType">>;
  /** Called with validated form data on submit */
  onSubmit: (data: EmergencyContactFormValues) => void | Promise<void>;
  /** External submitting state to disable the button and show loading */
  isSubmitting?: boolean;
  /** Text for the submit button – defaults to "Save emergency contact" */
  submitLabel?: string;
  /** Cancel handler (button hidden if not provided) */
  onCancel?: () => void;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
export function EmergencyContactForm({
  ownerRef,
  ownerType,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save emergency contact",
  onCancel,
}: EmergencyContactFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactFormSchema),
    defaultValues: {
      ownerRef,
      ownerType,
      name: "",
      relation: "",
      phone: "",
      isPrimary: false,
      ...defaultValues,
    },
  });

  const isPrimary = watch("isPrimary");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormSection label="Emergency contact details">
        {/* Hidden fields – necessary to pass through to the callback */}
      <input type="hidden" {...register("ownerRef")} />
      <input type="hidden" {...register("ownerType")} />

      {/* Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          Full name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Contact person's full name"
          className={cn(
            "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm transition-colors",
            errors.name
              ? "border-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Relation */}
      <div className="space-y-1.5">
        <Label
          htmlFor="relation"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          Relation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="relation"
          {...register("relation")}
          placeholder="e.g. Spouse, Sibling, Parent"
          className={cn(
            "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm transition-colors",
            errors.relation
              ? "border-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        />
        {errors.relation && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.relation.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label
          htmlFor="phone"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
        >
          Phone number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="e.g. 9812345678"
          className={cn(
            "rounded-none border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm tabular-nums transition-colors",
            errors.phone
              ? "border-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
        )}
      </div>

      {/* Primary contact toggle */}
      <div className="flex items-center justify-between py-2">
        <Label
          htmlFor="isPrimary"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-400 cursor-pointer"
        >
          Set as primary emergency contact
        </Label>
        <Switch
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={(checked) =>
            setValue("isPrimary", checked, { shouldValidate: true })
          }
          className={cn(
            "rounded-none",
            "border-zinc-300 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-700",
            "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600",
            "h-5 w-9",
            "[&>span]:rounded-none [&>span]:bg-white dark:[&>span]:bg-zinc-100",
            "[&>span]:data-[state=checked]:translate-x-4"
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              "rounded-none border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
              "focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0",
              "transition-colors"
            )}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "rounded-none bg-red-600 text-white hover:bg-red-700",
            "focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0",
            "disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          )}
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
      </FormSection>
    </form>
  );
}