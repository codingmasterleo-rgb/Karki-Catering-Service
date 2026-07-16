"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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


export type OwnerType = "Person" | "Company";
export type AddressLabel = "home" | "office" | "warehouse" | "other";

export interface AddressFormValues {
  ownerRef: string;
  ownerType: OwnerType;
  label?: AddressLabel;
  street?: string;
  city?: string;
  district?: string;
  country?: string;
  isPrimary: boolean;
}



const addressFormSchema = z.object({
  ownerRef: z.string().min(1, "Owner reference is required"),
  ownerType: z.enum(["Person", "Company"]),
  label: z
    .enum(["home", "office", "warehouse", "other"])
    .optional()
    .default("office"),
  street: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  isPrimary: z.boolean(),
});


interface AddressFormProps {
  ownerRef: string;
  ownerType: OwnerType;
  defaultValues?: Partial<Omit<AddressFormValues, "ownerRef" | "ownerType">>;
  onSubmit: (data: AddressFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}


export function AddressForm({
  ownerRef,
  ownerType,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save address",
  onCancel,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      ownerRef,
      ownerType,
      label: "office",
      street: "",
      city: "",
      district: "",
      country: "",
      isPrimary: false,
      ...defaultValues,
    },
  });

  // Watch switch value for the Primary toggle
  const isPrimary = watch("isPrimary");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Hidden fields – passed through to the callback */}
      <input type="hidden" {...register("ownerRef")} />
      <input type="hidden" {...register("ownerType")} />

      {/* Label */}
      <div className="space-y-1.5">
        <Label
          htmlFor="label"
          className="text-zinc-800 dark:text-zinc-200 text-sm font-medium"
        >
          Label
        </Label>
        <Select
          defaultValue={defaultValues?.label ?? "office"}
          onValueChange={(value) =>
            setValue("label", value as AddressLabel, { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="label"
            className={cn(
            "rounded-none border-zinc-700 capitalize w-full bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.label && "border-red-500"
          )}
          >
            <SelectValue placeholder="Select label" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.label && (
          <p className="text-red-400 text-sm">{errors.label.message}</p>
        )}
      </div>

      {/* Street */}
      <div className="space-y-1.5">
        <Label
          htmlFor="street"
          className="text-zinc-800 dark:text-zinc-200 text-sm font-medium"
        >
          Street
        </Label>
        <Input
          id="street"
          {...register("street")}
          placeholder="Enter street address"
          className={cn(
            "rounded-none border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.street && "border-red-500"
          )}
        />
        {errors.street && (
          <p className="text-red-400 text-sm">{errors.street.message}</p>
        )}
      </div>

      {/* City & District – side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="city"
            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium"
          >
            City
          </Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="City"
             className={cn(
            "rounded-none border-zinc-700 capitalize w-full bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.city && "border-red-500"
          )}
          />
          {errors.city && (
            <p className="text-red-400 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="district"
            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium"
          >
            District
          </Label>
          <Input
            id="district"
            {...register("district")}
            placeholder="District"
             className={cn(
            "rounded-none border-zinc-700 capitalize w-full bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.district && "border-red-500"
          )}
          />
          {errors.district && (
            <p className="text-red-400 text-sm">{errors.district.message}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="space-y-1.5">
        <Label
          htmlFor="country"
          className="text-zinc-800 dark:text-zinc-200 text-sm font-medium"
        >
          Country
        </Label>
        <Input
          id="country"
          {...register("country")}
          placeholder="Country"
           className={cn(
            "rounded-none border-zinc-700 capitalize w-full bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.country && "border-red-500"
          )}
        />
        {errors.country && (
          <p className="text-red-400 text-sm">{errors.country.message}</p>
        )}
      </div>

      {/* Primary address toggle */}
      <div className="flex items-center justify-between py-2">
        <Label
          htmlFor="isPrimary"
          className="text-zinc-800 dark:text-zinc-200 text-sm font-medium cursor-pointer"
        >
          Set as primary address
        </Label>
        <Switch
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={(checked) =>
            setValue("isPrimary", checked, { shouldValidate: true })
          }
          className={cn(
            "rounded-none", // track
            "border-zinc-600 bg-zinc-700",
            "data-[state=checked]:bg-red-600",
            "h-5 w-9",
            // thumb
            "[&>span]:rounded-none [&>span]:bg-white",
            "[&>span]:data-[state=checked]:translate-x-4"
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              "rounded-none border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-950 dark:text-zinc-50",
              "focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0"
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
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}