"use client";

import { useCallback, useMemo, useState, useRef, type KeyboardEvent } from "react";
import { contactFormSchema, emergencyContactFormSchema } from "@/zod/person/contact";
import { customerDefaultsFormSchema } from "@/zod/person/customer/customer_defaults";
import { DocumentFormSchema } from "@/zod/person/documents";
import { identitySchema } from "@/zod/person/identity";
import { socialMediaAccountFormSchema } from "@/zod/person/social_accounts";
import { Controller, FormProvider, useForm, Resolver } from "react-hook-form"; // ✅ added Resolver
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  UserRound,
  Settings2,
  MapPin,
  Contact,
  FileText,
  Share2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IdentityForm } from "../person/identity";
import { DefaultsForm } from "./defaults";
import { AddressForm } from "../person/address";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ContactForm } from "../person/contact";
import { SocialProfileForm } from "../person/social_accounts";
import { DocumentForm } from "../person/document";
import { toast } from "sonner";
import { addressFormSchema } from "@/zod/person/address";

// ---------- Schema ----------
const customerFormSchema = z.object({
  identity: identitySchema,
  customerCode: z.string()
    .min(6, "Customer Code Can't Be Less Than 6 Character")
    .max(20, "Customer Code Can't Be More Than 20 Character"),
  displayName: z.string()
    .min(3, "Customer Code Can't Be Less Than 3 Character")
    .max(42, "Customer Code Can't Be More Than 42 Character"),
  permanentAddress: addressFormSchema,
  temporaryAddress: addressFormSchema,
  contact: contactFormSchema,
  emergencyContact: emergencyContactFormSchema,
  documents: DocumentFormSchema,
  socialMediaProfiles: socialMediaAccountFormSchema,
  defaults: customerDefaultsFormSchema,
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// ---------- Initial data ----------
const initial_data: CustomerFormValues = {
  identity: {
    fullName: "",
    phone: "",
    roles: ["customer"],
    avatarUrl: "",
    dateOfBirth: undefined,
    email: "",
    gender: "male",
    notes: "",
  },
  contact: {
    isPrimary: true,
    name: "",
    phone: "",
    relation: "",
    email: "",
  },
  customerCode: "",
  defaults: {
    creditLimit: 0,
    interestRateYearly: 0,
    maxCreditDays: 0,
    paymentTerm: "credit",
    tdsApplicable: false,
  },
  displayName: "",
  documents: {
    documentNumber: "",
    documentType: "citizenship",
    mediaRefs: [],
    description: "",
    expiryDate: undefined,
    issuedBy: "",
    issuedDate: undefined,
    issuedDistrict: "",
    title: "",
  },
  emergencyContact: {
    isPrimary: true,
    name: "",
    phone: "",
    relation: "",
    email: "",
  },
  permanentAddress: {
    isPrimary: true,
    label: "home",
    city: "",
    country: "",
    district: "",
    street: "",
  },
  socialMediaProfiles: {
    facebook: "",
    instagram: "",
    linkedin: "",
    skype: "",
    telegram: "",
    tiktok: "",
    whatsapp: "",
  },
  temporaryAddress: {
    isPrimary: true,
    label: "home",
    city: "",
    country: "",
    district: "",
    street: "",
  },
};

// ---------- Tabs ----------
export enum CustomerTab {
  Identity = "identity",
  Defaults = "defaults",
  Address = "address",
  Contacts = "contacts",
  Document = "document",
  SocialProfile = "social_profile",
}

const tabList: { key: CustomerTab; label: string; icon: React.ElementType }[] = [
  { key: CustomerTab.Identity, label: "Identity", icon: UserRound },
  { key: CustomerTab.Defaults, label: "Defaults", icon: Settings2 },
  { key: CustomerTab.Address, label: "Address", icon: MapPin },
  { key: CustomerTab.Contacts, label: "Contacts", icon: Contact },
  { key: CustomerTab.Document, label: "Document", icon: FileText },
  { key: CustomerTab.SocialProfile, label: "Social Profile", icon: Share2 },
];

const tabFieldMap: Record<CustomerTab, (keyof CustomerFormValues)[]> = {
  [CustomerTab.Identity]: ["identity", "customerCode", "displayName"],
  [CustomerTab.Defaults]: ["defaults"],
  [CustomerTab.Address]: ["permanentAddress", "temporaryAddress"],
  [CustomerTab.Contacts]: ["contact", "emergencyContact"],
  [CustomerTab.Document]: ["documents"],
  [CustomerTab.SocialProfile]: ["socialMediaProfiles"],
};

// ---------- Main Component ----------
export default function CustomerForm() {
  const [openedTab, setOpenedTab] = useState<CustomerTab>(CustomerTab.Identity);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema) as Resolver<CustomerFormValues>, // ✅ cast here
    defaultValues: initial_data,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const tabErrorMap = useMemo(() => {
    const map: Record<CustomerTab, boolean> = {} as Record<CustomerTab, boolean>;
    for (const tab of Object.values(CustomerTab)) {
      map[tab] = tabFieldMap[tab].some((field) => Boolean(errors[field]));
    }
    return map;
  }, [errors]);

  const goToTab = useCallback(
    async (tab: CustomerTab) => {
      if (tab === openedTab) return;
      await trigger(tabFieldMap[openedTab]);
      setOpenedTab(tab);
    },
    [openedTab, trigger]
  );

  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (index + 1) % tabList.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (index - 1 + tabList.length) % tabList.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabList.length - 1;
      }
      if (nextIndex !== null) {
        e.preventDefault();
        const nextTab = tabList[nextIndex].key;
        goToTab(nextTab);
        tabRefs.current[nextTab]?.focus();
      }
    },
    [goToTab]
  );

  // ---------- API Submission ----------
  const onSubmit = async (data: CustomerFormValues) => {
    try {
        console.log(data)
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create customer");
      }

      const result = await response.json();
      toast.success("Customer created successfully!");
      reset(initial_data);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const onInvalid = () => {
    const firstErroredTab = tabList.find((t) => tabErrorMap[t.key]);
    if (firstErroredTab) setOpenedTab(firstErroredTab.key);
    toast.error("Please fix all errors before submitting.");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex min-h-dvh flex-col bg-zinc-50 dark:bg-zinc-950"
      >
        {/* Sticky header */}
        <header className="sticky top-0 z-20 border-b-2 border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/80">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl">
              New Customer
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              Fill out each section below. Fields with errors are flagged on their tab.
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
            <nav
              role="tablist"
              aria-label="Customer form sections"
              className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-2 lg:grid-cols-6"
            >
              {tabList.map(({ key, label, icon: Icon }, index) => {
                const isActive = openedTab === key;
                const hasError = tabErrorMap[key];

                return (
                  <button
                    key={key}
                    type="button"
                    ref={(el) => {
                      tabRefs.current[key] = el;
                    }}
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${key}`}
                    aria-current={isActive ? "true" : undefined}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => goToTab(key)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={cn(
                      "flex shrink-0 items-center justify-center gap-2 border-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors sm:justify-start sm:px-4",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900",
                      isActive
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive
                          ? "text-white"
                          : "text-zinc-400 dark:text-zinc-500"
                      )}
                    />
                    <span>{label}</span>
                    {hasError && (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0",
                          isActive ? "bg-white" : "bg-red-600"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Panels */}
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div
            role="tabpanel"
            id={`panel-${openedTab}`}
            aria-labelledby={`tab-${openedTab}`}
          >
            {openedTab === CustomerTab.Identity && (
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerCode" className="text-zinc-700 dark:text-zinc-300">
                      Customer code <span className="text-red-600">*</span>
                    </Label>
                    <Controller<CustomerFormValues, "customerCode">
                      name="customerCode"
                      control={control}
                      render={({ field: { value, onChange, onBlur, ref } }) => (
                        <Input
                          id="customerCode"
                          placeholder="e.g. CUST0001"
                          value={value ?? ""}
                          onChange={onChange}
                          onBlur={onBlur}
                          ref={ref}
                          disabled={isSubmitting}
                          className={cn(
                            "rounded-none border-zinc-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-zinc-400",
                            "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                            "dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500",
                            errors.customerCode && "border-red-500"
                          )}
                        />
                      )}
                    />
                    {errors.customerCode && (
                      <p className="text-sm text-red-600">{errors.customerCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-zinc-700 dark:text-zinc-300">
                      Display name <span className="text-red-600">*</span>
                    </Label>
                    <Controller<CustomerFormValues, "displayName">
                      name="displayName"
                      control={control}
                      render={({ field: { value, onChange, onBlur, ref } }) => (
                        <Input
                          id="displayName"
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
                            errors.displayName && "border-red-500"
                          )}
                        />
                      )}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-red-600">{errors.displayName.message}</p>
                    )}
                  </div>
                </div>

                <IdentityForm />
              </div>
            )}
            {openedTab === CustomerTab.Defaults && <DefaultsForm />}
            {openedTab === CustomerTab.SocialProfile && <SocialProfileForm />}
            {openedTab === CustomerTab.Document && <DocumentForm />}
            {openedTab === CustomerTab.Address && (
              <div className="flex flex-col space-y-6">
                <AddressForm name="permanentAddress" title="Permanent Address" />
                <AddressForm name="temporaryAddress" title="Temporary Address" />
              </div>
            )}
            {openedTab === CustomerTab.Contacts && (
              <div className="flex flex-col space-y-6">
                <ContactForm name="contact" title="Personal Contact" />
                <ContactForm name="emergencyContact" title="Emergency Contact" />
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <footer className="sticky bottom-0 z-20 border-t-2 border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/80">
          <div className="mx-auto flex max-w-7xl flex-col-reverse gap-3 px-4 py-3 sm:flex-row sm:justify-end sm:px-5 sm:py-4 lg:px-6">
            <button
              type="button"
              onClick={() => reset(initial_data)}
              disabled={isSubmitting}
              className={cn(
                "w-full border-2 border-zinc-300 bg-transparent px-6 py-2.5 font-semibold text-zinc-700 transition-colors sm:w-auto",
                "hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex w-full items-center justify-center gap-2 border-2 border-red-600 bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors sm:w-auto",
                "hover:bg-red-700 hover:border-red-700",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </footer>
      </form>
    </FormProvider>
  );
}