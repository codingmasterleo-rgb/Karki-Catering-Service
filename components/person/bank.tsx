"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FormSection } from "../FormSection";


export type OwnerType = "Person" | "Company";

export interface BankDetailFormValues {
  ownerRef: string;
  ownerType: OwnerType;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  isPrimary: boolean;
}

const bankDetailFormSchema = z.object({
  ownerRef: z.string().min(1, "Owner reference is required"),
  ownerType: z.enum(["Person", "Company"]),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  branch: z.string().optional(),
  isPrimary: z.boolean(),
});


interface BankDetailFormProps {
  ownerRef: string;
  ownerType: OwnerType;
  defaultValues?: Partial<Omit<BankDetailFormValues, "ownerRef" | "ownerType">>;
  onSubmit: (data: BankDetailFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function BankDetailForm({
  ownerRef,
  ownerType,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save bank details",
  onCancel,
}: BankDetailFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankDetailFormValues>({
    resolver: zodResolver(bankDetailFormSchema),
    defaultValues: {
      ownerRef,
      ownerType,
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      branch: "",
      isPrimary: false,
      ...defaultValues,
    },
  });

  const isPrimary = watch("isPrimary");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormSection label="Bank details">
        <input type="hidden" {...register("ownerRef")} />
      <input type="hidden" {...register("ownerType")} />

      {/* Bank name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="bankName"
          className="text-zinc-400 text-sm font-medium"
        >
          Bank name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="bankName"
          {...register("bankName")}
          placeholder="e.g. Nepal SBI Bank"
          className={cn(
            "rounded-none border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.bankName && "border-red-500"
          )}
        />
        {errors.bankName && (
          <p className="text-red-400 text-sm">{errors.bankName.message}</p>
        )}
      </div>

      {/* Account holder name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="accountHolderName"
          className="text-zinc-400 text-sm font-medium"
        >
          Account holder name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accountHolderName"
          {...register("accountHolderName")}
          placeholder="Full name as per bank records"
          className={cn(
            "rounded-none border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm",
            errors.accountHolderName && "border-red-500"
          )}
        />
        {errors.accountHolderName && (
          <p className="text-red-400 text-sm">
            {errors.accountHolderName.message}
          </p>
        )}
      </div>

      {/* Account number */}
      <div className="space-y-1.5">
        <Label
          htmlFor="accountNumber"
          className="text-zinc-400 text-sm font-medium"
        >
          Account number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accountNumber"
          {...register("accountNumber")}
          placeholder="e.g. 1234567890123456"
          className={cn(
            "rounded-none border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm tabular-nums",
            errors.accountNumber && "border-red-500"
          )}
        />
        {errors.accountNumber && (
          <p className="text-red-400 text-sm">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* Branch (optional) */}
      <div className="space-y-1.5">
        <Label
          htmlFor="branch"
          className="text-zinc-400 text-sm font-medium"
        >
          Branch
        </Label>
        <Input
          id="branch"
          {...register("branch")}
          placeholder="e.g. Durbar Marg, Kathmandu"
          className={cn(
            "rounded-none border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:border-red-500 focus-visible:ring-0",
            "h-10 px-3 py-2 text-sm"
          )}
        />
        {errors.branch && (
          <p className="text-red-400 text-sm">{errors.branch.message}</p>
        )}
      </div>

      {/* Primary account toggle */}
      <div className="flex items-center justify-between py-2">
        <Label
          htmlFor="isPrimary"
          className="text-zinc-400 text-sm font-medium cursor-pointer"
        >
          Set as primary bank account
        </Label>
        <Switch
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={(checked) =>
            setValue("isPrimary", checked, { shouldValidate: true })
          }
          className={cn(
            "rounded-none",
            "border-zinc-600 bg-zinc-700",
            "data-[state=checked]:bg-red-600",
            "h-5 w-9",
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
              "rounded-none border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
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
      </FormSection>
    </form>
  );
}