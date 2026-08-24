"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CustomerFormValues } from "../customer/customer";

type ContactRoot = "contact" | "emergencyContact";

interface ContactFormProps {
  name: ContactRoot;
  title?: string;
}

export function ContactForm({ name, title = "Contact" }: ContactFormProps) {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const sectionErrors = (errors[name] ?? {}) as Record<string, { message?: string } | undefined>;

  // Whether to show the name & relation fields
  const showNameAndRelation = name !== "contact";

  return (
    <div>
      {/* Section title */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h3>

      {/* Name & Relation – shown only for emergency contact */}
      {showNameAndRelation && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${name}-name`} className="text-zinc-700 dark:text-zinc-300">
              Full name <span className="text-red-600">*</span>
            </Label>
            <Controller<CustomerFormValues, `${ContactRoot}.name`>
              name={`${name}.name`}
              control={control}
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <Input
                  id={`${name}-name`}
                  placeholder="Contact person's full name"
                  value={value ?? ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={isSubmitting}
                  className={cn(
                    "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                    sectionErrors.name && "border-red-500"
                  )}
                />
              )}
            />
            {sectionErrors.name && (
              <p className="text-sm text-red-600">{sectionErrors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${name}-relation`} className="text-zinc-700 dark:text-zinc-300">
              Relation <span className="text-red-600">*</span>
            </Label>
            <Controller<CustomerFormValues, `${ContactRoot}.relation`>
              name={`${name}.relation`}
              control={control}
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <Input
                  id={`${name}-relation`}
                  placeholder="e.g. Spouse, Sibling, Parent"
                  value={value ?? ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={isSubmitting}
                  className={cn(
                    "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                    sectionErrors.relation && "border-red-500"
                  )}
                />
              )}
            />
            {sectionErrors.relation && (
              <p className="text-sm text-red-600">{sectionErrors.relation.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Phone & Email */}
      <div className={cn("grid gap-6 sm:grid-cols-2", showNameAndRelation ? "mt-6" : "")}>
        <div className="space-y-2">
          <Label htmlFor={`${name}-phone`} className="text-zinc-700 dark:text-zinc-300">
            Phone number <span className="text-red-600">*</span>
          </Label>
          <Controller<CustomerFormValues, `${ContactRoot}.phone`>
            name={`${name}.phone`}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id={`${name}-phone`}
                placeholder="e.g. 9812345678"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm tabular-nums transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  sectionErrors.phone && "border-red-500"
                )}
              />
            )}
          />
          {sectionErrors.phone && (
            <p className="text-sm text-red-600">{sectionErrors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${name}-email`} className="text-zinc-700 dark:text-zinc-300">
            Email address
          </Label>
          <Controller<CustomerFormValues, `${ContactRoot}.email`>
            name={`${name}.email`}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id={`${name}-email`}
                type="email"
                placeholder="contact@example.com"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  sectionErrors.email && "border-red-500"
                )}
              />
            )}
          />
          {sectionErrors.email && (
            <p className="text-sm text-red-600">{sectionErrors.email.message}</p>
          )}
        </div>
      </div>

      {/* Primary toggle */}
      <div className="mt-6 flex items-center justify-between">
        <Label
          htmlFor={`${name}-isPrimary`}
          className="cursor-pointer text-zinc-700 dark:text-zinc-300"
        >
          Set as primary contact
        </Label>
        <Controller<CustomerFormValues, `${ContactRoot}.isPrimary`>
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