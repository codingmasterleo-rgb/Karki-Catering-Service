"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, UploadCloud, X } from "lucide-react";

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

// ─── Constants ──────────────────────────────
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

// ─── Zod schema ─────────────────────────────
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(120),
  phone: z.string().regex(/^9\d{9}$/, "Enter a valid Nepali phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.date().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  roles: z
    .array(z.enum(["customer", "vendor", "employee"]))
    .min(1, "Select at least one role"),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Role = FormValues["roles"][number];

const roleOptions: Role[] = ["customer", "vendor", "employee"];

// ─── API response shapes (so fetch().json() never resolves to `any`) ──
interface UploadResponse {
  url: string;
}

interface UploadErrorResponse {
  message?: string;
}

// ─── Section wrapper: thick red rail + zinc eyebrow label ─────────
export function FormSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="w-1 shrink-0 bg-red-600" aria-hidden="true" />
      <div className="flex-1 space-y-6 py-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export function CreatePersonForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      gender: undefined,
      dateOfBirth: undefined,
      avatarUrl: "",
      roles: [],
      notes: "",
    },
  });

  // Revoke the blob URL whenever it changes AND on unmount — no leaks either way.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setUploadError(null);

    if (selected && selected.size > MAX_AVATAR_BYTES) {
      setUploadError("Image must be under 5MB.");
      e.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setUploadError(null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    let avatarUrl = values.avatarUrl ?? "";
    let uploadedThisRun = false;

    // 1. Upload image first, if selected
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const body = (await uploadRes
            .json()
            .catch(() => ({}))) as UploadErrorResponse;
          throw new Error(body.message ?? "Image upload failed");
        }
        const data = (await uploadRes.json()) as UploadResponse;
        avatarUrl = data.url;
        uploadedThisRun = true;
      } catch {
        setUploadError("Failed to upload image. Please try again.");
        return;
      }
    }

    // 2. Create the person
    const payload: FormValues = { ...values, avatarUrl };
    try {
      const response = await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create person");

      setSubmitSuccess(true);
      reset();
      clearFile();
    } catch {
      setSubmitError(
        "Failed to create person. The uploaded photo was saved — you won't need to re-upload it if you retry."
      );
      // Note: if this retry path becomes common, wire a DELETE /api/upload
      // rollback here keyed on the uploaded URL so orphaned files don't pile up.
      void uploadedThisRun;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          New Person
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Add a customer, vendor, or employee to Karki Catering Service.
        </p>
      </div>

      <div className="space-y-10 px-8 py-10">
        {/* Identity */}
        <FormSection label="Identity">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300">
                Full name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Sujan Karki"
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
                )}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-700 dark:text-zinc-300">
                Phone number <span className="text-red-600">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="98XXXXXXXX"
                className={cn(
                  "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                  "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
                )}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn(
                "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "w-full rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors",
                        "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                        "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
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
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">Date of birth</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger >
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start rounded-none border-zinc-300 bg-white px-4 py-3 text-left font-normal transition-colors",
                          "hover:border-red-400 hover:bg-red-50/50",
                          "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                          "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                          !field.value && "text-zinc-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        
                        className="w-full rounded-none"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Avatar */}
        <FormSection label="Photo">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label
                htmlFor="avatar-upload"
                className={cn(
                  "flex cursor-pointer items-center justify-center border-2 border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-500 transition-colors",
                  "hover:border-red-400 hover:text-red-600",
                  "dark:border-zinc-700 dark:hover:border-red-500"
                )}
              >
                <UploadCloud className="mr-2 h-5 w-5" />
                {file ? file.name : "Click to upload or drag & drop"}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                PNG or JPG, up to 5MB.
              </p>
              {uploadError && (
                <p className="mt-1 text-sm text-red-600">{uploadError}</p>
              )}
            </div>
            {preview && (
              <div className="relative h-24 w-24 shrink-0 border border-zinc-300 dark:border-zinc-700">
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border border-zinc-300 bg-white text-zinc-600 hover:border-red-500 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </FormSection>

        {/* Roles */}
        <FormSection label="Roles">
          <div>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {roleOptions.map((role) => (
                <Controller
                  key={role}
                  control={control}
                  name="roles"
                  render={({ field }) => {
                    const checked = field.value.includes(role);
                    return (
                      <label className="flex cursor-pointer items-center space-x-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            const updated: Role[] = c
                              ? [...field.value, role]
                              : field.value.filter((r) => r !== role);
                            field.onChange(updated);
                          }}
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
                  }}
                />
              ))}
            </div>
            {errors.roles && (
              <p className="mt-2 text-sm text-red-600">{errors.roles.message}</p>
            )}
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection label="Notes">
          <div className="space-y-2">
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              rows={4}
              className={cn(
                "resize-none rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
              )}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </FormSection>
      </div>

      {/* Footer */}
      <div className="space-y-3 border-t border-zinc-200 bg-zinc-50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-900">
        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Person created.
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full cursor-pointer rounded-none bg-red-600 py-3 text-sm font-semibold text-white transition-all",
            "hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </span>
          ) : (
            "Create person"
          )}
        </Button>
      </div>
    </form>
  );
}