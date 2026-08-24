"use client";

import { useFormContext, Controller } from "react-hook-form";
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
import { CustomerFormValues } from "../customer/customer";

type Role = "customer" | "vendor" | "employee";
const roleOptions: Role[] = ["customer", "vendor", "employee"];

export function IdentityForm() {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const identityErrors = errors.identity ?? {};

  return (
    <div className="space-y-6">
      {/* Full name & Phone */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="identity-fullName" className="text-zinc-700 dark:text-zinc-300">
            Full name <span className="text-red-600">*</span>
          </Label>
          <Controller<CustomerFormValues, "identity.fullName">
            name="identity.fullName"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="identity-fullName"
                placeholder="e.g. Sujan Karki"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  identityErrors.fullName && "border-red-500"
                )}
              />
            )}
          />
          {identityErrors.fullName && (
            <p className="text-sm text-red-600">{identityErrors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="identity-phone" className="text-zinc-700 dark:text-zinc-300">
            Phone number <span className="text-red-600">*</span>
          </Label>
          <Controller<CustomerFormValues, "identity.phone">
            name="identity.phone"
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <Input
                id="identity-phone"
                placeholder="98XXXXXXXX"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                disabled={isSubmitting}
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                  identityErrors.phone && "border-red-500"
                )}
              />
            )}
          />
          {identityErrors.phone && (
            <p className="text-sm text-red-600">{identityErrors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="identity-email" className="text-zinc-700 dark:text-zinc-300">
          Email
        </Label>
        <Controller<CustomerFormValues, "identity.email">
          name="identity.email"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Input
              id="identity-email"
              type="email"
              placeholder="name@example.com"
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                identityErrors.email && "border-red-500"
              )}
            />
          )}
        />
        {identityErrors.email && (
          <p className="text-sm text-red-600">{identityErrors.email.message}</p>
        )}
      </div>

      {/* Gender & Date of birth */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-700 dark:text-zinc-300">Gender</Label>
          <Controller<CustomerFormValues, "identity.gender">
            name="identity.gender"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select onValueChange={onChange} value={value ?? "male"} disabled={isSubmitting}>
                <SelectTrigger
                  className={cn(
                    "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                    identityErrors.gender && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {identityErrors.gender && (
            <p className="text-sm text-red-600">{identityErrors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-700 w-full dark:text-zinc-300">Date of birth</Label>
          <Controller<CustomerFormValues, "identity.dateOfBirth">
            name="identity.dateOfBirth"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Popover>
                <PopoverTrigger className={"w-full"}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left font-normal transition-colors",
                      "hover:border-red-400 hover:bg-red-50/50",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                      "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                      !value && "text-zinc-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                    {value ? format(value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={value ?? undefined}
                    onSelect={onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    className="w-full rounded-none"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {identityErrors.dateOfBirth && (
            <p className="text-sm text-red-600">{identityErrors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      {/* Avatar URL */}
      <div className="space-y-2">
        <Label htmlFor="identity-avatarUrl" className="text-zinc-700 dark:text-zinc-300">
          Avatar URL
        </Label>
        <Controller<CustomerFormValues, "identity.avatarUrl">
          name="identity.avatarUrl"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Input
              id="identity-avatarUrl"
              placeholder="https://..."
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                identityErrors.avatarUrl && "border-red-500"
              )}
            />
          )}
        />
        {identityErrors.avatarUrl && (
          <p className="text-sm text-red-600">{identityErrors.avatarUrl.message}</p>
        )}
      </div>

      {/* Roles */}
      <div>
        <Label className="pb-3 text-zinc-700 dark:text-zinc-300">Roles</Label>
        <Controller<CustomerFormValues, "identity.roles">
          name="identity.roles"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {roleOptions.map((role) => {
                const checked = (value ?? []).includes(role);
                return (
                  <label key={role} className="flex cursor-pointer items-center space-x-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => {
                        const updated = c
                          ? [...(value ?? []), role]
                          : (value ?? []).filter((r) => r !== role);
                        onChange(updated);
                      }}
                      disabled={isSubmitting}
                      className={cn(
                        "rounded-none border-zinc-400 transition-colors",
                        "data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white",
                        "data-[state=checked]:[&_svg]:text-white",
                        "focus-visible:ring-2 focus-visible:ring-red-500/20"
                      )}
                    />
                    <span className="text-sm font-medium capitalize text-zinc-700 dark:text-zinc-300">
                      {role}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {identityErrors.roles && (
          <p className="mt-2 text-sm text-red-600">{identityErrors.roles.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="identity-notes" className="pb-3 text-zinc-700 dark:text-zinc-300">
          Notes
        </Label>
        <Controller<CustomerFormValues, "identity.notes">
          name="identity.notes"
          control={control}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <Textarea
              id="identity-notes"
              placeholder="Any additional information..."
              rows={4}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={isSubmitting}
              className={cn(
                "resize-none rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                identityErrors.notes && "border-red-500"
              )}
            />
          )}
        />
        {identityErrors.notes && (
          <p className="text-sm text-red-600">{identityErrors.notes.message}</p>
        )}
      </div>
    </div>
  );
}