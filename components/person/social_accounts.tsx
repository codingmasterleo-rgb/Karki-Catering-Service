"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CustomerFormValues } from "../customer/customer";

// Import icons from react-icons
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSkype,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

type SocialField = keyof CustomerFormValues["socialMediaProfiles"];

const socialFields: {
  name: SocialField;
  label: string;
  placeholder: string;
  icon: React.ElementType;
}[] = [
  { name: "facebook", label: "Facebook", placeholder: "facebook.com/username", icon: FaFacebook },
  { name: "instagram", label: "Instagram", placeholder: "@username", icon: FaInstagram },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username", icon: FaLinkedin },
  { name: "skype", label: "Skype", placeholder: "skype username", icon: FaSkype },
  { name: "telegram", label: "Telegram", placeholder: "@username", icon: FaTelegram },
  { name: "tiktok", label: "TikTok", placeholder: "@username", icon: FaTiktok },
  { name: "whatsapp", label: "WhatsApp", placeholder: "98XXXXXXXX", icon: FaWhatsapp },
];

export function SocialProfileForm() {
  const {
    control,
    formState: { errors, disabled: formDisabled },
  } = useFormContext<CustomerFormValues>();

  const isSubmitting = Boolean(formDisabled);
  const sectionErrors = (errors.socialMediaProfiles ?? {}) as Record<
    string,
    { message?: string } | undefined
  >;

  return (
    <div>
      {/* Section title */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Social Profiles
      </h3>

      <div className="grid gap-6 sm:grid-cols-2">
        {socialFields.map(({ name, label, placeholder, icon: Icon }) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={`social-${name}`} className="text-zinc-700 dark:text-zinc-300">
              {label}
            </Label>
            <Controller<CustomerFormValues, `socialMediaProfiles.${SocialField}`>
              name={`socialMediaProfiles.${name}`}
              control={control}
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                  <Input
                    id={`social-${name}`}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={isSubmitting}
                    className={cn(
                      "rounded-none border-zinc-300 bg-white pl-9 pr-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                      "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                      sectionErrors[name] && "border-red-500"
                    )}
                  />
                </div>
              )}
            />
            {sectionErrors[name] && (
              <p className="text-sm text-red-600">{sectionErrors[name]?.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}