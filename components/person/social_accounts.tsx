"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSkype,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

export type SocialMediaProfiles = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  skype?: string;
  telegram?: string;
  tiktok?: string;
  whatsapp?: string;
};

export type SocialField = keyof SocialMediaProfiles;

export type SocialProfileFormErrors = Partial<
  Record<SocialField, { message?: string } | string>
>;

export interface SocialProfileFormProps {
  value?: SocialMediaProfiles;
  onChange: (value: SocialMediaProfiles) => void;
  errors?: SocialProfileFormErrors;
  disabled?: boolean;
}

function errorMessage(
  errors: SocialProfileFormErrors | undefined,
  key: SocialField,
): string | undefined {
  const err = errors?.[key];
  if (!err) return undefined;
  return typeof err === "string" ? err : err.message;
}

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

export function SocialProfileForm({
  value = {},
  onChange,
  errors,
  disabled = false,
}: SocialProfileFormProps) {
  const setField = (key: SocialField, rawValue: string) => {
    const next = { ...value };
    if (rawValue === "") {
      delete next[key];
    } else {
      next[key] = rawValue;
    }
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Social Profiles
      </h3>

      <div className="grid gap-6 sm:grid-cols-2">
        {socialFields.map(({ name, label, placeholder, icon: Icon }) => {
          const error = errorMessage(errors, name);
          const inputId = `social-${name}`;
          const errorId = `social-${name}-error`;

          return (
            <div key={name} className="space-y-2">
              <Label
                htmlFor={inputId}
                className="text-zinc-700 dark:text-zinc-300"
              >
                {label}
              </Label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                <Input
                  id={inputId}
                  placeholder={placeholder}
                  value={value[name] ?? ""}
                  onChange={(e) => setField(name, e.target.value)}
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  autoComplete="off"
                  className={cn(
                    "rounded-none border-zinc-300 bg-white pl-9 pr-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                    "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                    "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                    error && "border-red-500",
                  )}
                />
              </div>
              {error && (
                <p id={errorId} className="text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}