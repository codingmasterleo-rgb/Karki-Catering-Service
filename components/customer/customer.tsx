"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, Resolver } from "react-hook-form";
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
  Plus,
  Trash2,
  AlertCircle,
  PhoneCall,
  FileCheck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { IdentityForm, type IdentityFormValues } from "../person/identity";
import { DefaultsForm } from "./defaults";
import { AddressForm } from "../person/address";
import { ContactForm } from "../person/contact";
import { SocialProfileForm } from "../person/social_accounts";
import { DocumentForm, type DocumentFormValues } from "../person/document";
import { customerFormSchema } from "@/zod/person/customer/customer";
import { SingleImagePicker } from "../image-picker";

export type CustomerFormValues = Omit<
  z.infer<typeof customerFormSchema>,
  "identity" | "documents"
> & {
  identity: IdentityFormValues;
  documents: DocumentFormValues[];
};

const initial_data: CustomerFormValues = {
  identity: {
    fullName: "",
    phone: "",
    roles: ["customer"],
    avatarUrl: "",
    avatar: null,
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
  documents: [
    {
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
  ],
  emergencyContact: [
    {
      isPrimary: false,
      name: "",
      phone: "",
      relation: "",
      email: "",
    },
  ],
  permanentAddress: {
    isPrimary: true,
    label: "office",
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
    isPrimary: false,
    label: "other",
    city: "",
    country: "",
    district: "",
    street: "",
  },
};

export enum CustomerTab {
  Identity = "identity",
  Defaults = "defaults",
  Address = "address",
  Contacts = "contacts",
  Document = "document",
  SocialProfile = "social_profile",
}

interface TabConfig {
  key: CustomerTab;
  label: string;
  icon: React.ElementType;
}

const tabList: TabConfig[] = [
  { key: CustomerTab.Identity, label: "Identity & Roles", icon: UserRound },
  { key: CustomerTab.Defaults, label: "Commercial Terms", icon: Settings2 },
  { key: CustomerTab.Address, label: "Addresses & Venues", icon: MapPin },
  { key: CustomerTab.Contacts, label: "Event Contacts", icon: Contact },
  { key: CustomerTab.Document, label: "KYC & Documents", icon: FileText },
  { key: CustomerTab.SocialProfile, label: "Communication", icon: Share2 },
];

const tabFieldMap: Record<CustomerTab, (keyof CustomerFormValues)[]> = {
  [CustomerTab.Identity]: ["identity", "customerCode", "displayName"],
  [CustomerTab.Defaults]: ["defaults"],
  [CustomerTab.Address]: ["permanentAddress", "temporaryAddress"],
  [CustomerTab.Contacts]: ["contact", "emergencyContact"],
  [CustomerTab.Document]: ["documents"],
  [CustomerTab.SocialProfile]: ["socialMediaProfiles"],
};

export default function CustomerForm() {
  const [openedTab, setOpenedTab] = useState<CustomerTab>(CustomerTab.Identity);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema) as Resolver<CustomerFormValues>,
    defaultValues: initial_data,
    mode: "onBlur",
  });

  const avatarUrl = watch("identity.avatarUrl");

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: "documents",
  });

  const {
    fields: emergencyFields,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({
    control,
    name: "emergencyContact",
  });

  const tabErrorMap = useMemo(() => {
    const map: Record<CustomerTab, boolean> = {} as Record<CustomerTab, boolean>;
    for (const tab of Object.values(CustomerTab)) {
      map[tab] = tabFieldMap[tab].some((field) => Boolean(errors[field]));
    }
    return map;
  }, [errors]);

  const totalErrors = useMemo(() => {
    return Object.keys(errors).length;
  }, [errors]);

  const goToTab = useCallback(
    async (tab: CustomerTab) => {
      if (tab === openedTab) return;
      // Validate current tab fields before allowing navigation away
      await trigger(tabFieldMap[openedTab]);
      setOpenedTab(tab);
    },
    [openedTab, trigger],
  );

  const onSubmit = useCallback(
    async (data: CustomerFormValues) => {
      try {
        const formData = new FormData();

        // 1. Extract & Append Avatar Binary File (if picked as File)
        if (data.identity.avatar instanceof File) {
          formData.append("avatar", data.identity.avatar);
        }

        // 2. Extract & Append Document Binary Files (preserving document index association)
        data.documents.forEach((doc, docIndex) => {
          if (Array.isArray(doc.mediaRefs)) {
            doc.mediaRefs.forEach((ref) => {
              if (ref instanceof File) {
                formData.append(`documents[${docIndex}][files]`, ref);
              }
            });
          }
        });

        // 3. Prepare JSON metadata (sanitizing non-serializable File objects)
        const metadataPayload = {
          ...data,
          identity: {
            ...data.identity,
            avatar:
              typeof data.identity.avatar === "string"
                ? data.identity.avatar
                : undefined,
          },
          documents: data.documents.map((doc) => ({
            ...doc,
            mediaRefs: Array.isArray(doc.mediaRefs)
              ? doc.mediaRefs.filter(
                  (ref): ref is string => typeof ref === "string",
                )
              : [],
          })),
        };

        formData.append("customerData", JSON.stringify(metadataPayload));
        console.log(formData)
        // 4. Send Multipart Request
        const response = await fetch("/api/customers", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMessage = "Failed to register customer";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            const textError = await response.text();
            if (textError)
              errorMessage = `Server error (${response.status}): ${textError.slice(0, 100)}`;
          }
          throw new Error(errorMessage);
        }

        toast.success("Client account and assets registered successfully!");
        reset(initial_data);
        setOpenedTab(CustomerTab.Identity);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error instanceof Error ? error.message : "Submission failed",
        );
      }
    },
    [reset],
  );

  const onInvalid = useCallback(() => {
    const firstErroredTab = tabList.find((t) => tabErrorMap[t.key]);
    if (firstErroredTab) setOpenedTab(firstErroredTab.key);
    toast.error("Please resolve the flagged errors before submitting.");
  }, [tabErrorMap]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-zinc-50 font-sans text-zinc-900 transition-colors selection:bg-red-600 selection:text-white dark:bg-zinc-950 dark:text-zinc-100"
    >
      {/* 1. TOP COMMAND BAR */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900 sm:text-base dark:text-zinc-100">
                Client Registration
              </h1>
              <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
                Enterprise Catering Account & Event Portfolio
              </p>
            </div>
            {totalErrors > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                {totalErrors} {totalErrors === 1 ? "issue" : "issues"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting || !isDirty}
              onClick={() => {
                if (window.confirm("Discard unsaved changes?")) {
                  reset(initial_data);
                  setOpenedTab(CustomerTab.Identity);
                }
              }}
              className="hidden h-9 items-center gap-1.5 rounded-none border-zinc-300 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-zinc-950 sm:flex dark:border-zinc-700 dark:focus-visible:ring-zinc-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="group relative hidden h-9 items-center gap-1.5 rounded-none bg-red-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-50 sm:flex dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Save Record
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 2. HORIZONTAL NAVIGATION BAR (Standard Default Behavior) */}
        <div className="overflow-x-auto border-t border-zinc-200 bg-zinc-50/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:border-zinc-800 dark:bg-zinc-900/50">
          <nav
            role="tablist"
            aria-label="Catering Account Tabs"
            className="flex min-w-max px-2 sm:px-6"
          >
            {tabList.map(({ key, label, icon: Icon }) => {
              const isActive = openedTab === key;
              const hasError = tabErrorMap[key];

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`tab-${key}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${key}`}
                  tabIndex={0}
                  onClick={() => goToTab(key)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all focus-visible:z-10 focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none sm:px-4 sm:py-3 dark:focus-visible:bg-zinc-800",
                    isActive
                      ? "border-red-600 bg-white text-red-600 dark:bg-zinc-950 dark:text-red-500"
                      : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-red-600 dark:text-red-500"
                        : "text-zinc-400 dark:text-zinc-500",
                    )}
                  />
                  <span>{label}</span>

                  {hasError && (
                    <span
                      aria-label="Validation error in this tab"
                      className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 3. CENTER FORM CANVAS */}
      <main className="w-full flex-1 px-4 py-6 sm:px-0">
        <div
          role="tabpanel"
          id={`panel-${openedTab}`}
          aria-labelledby={`tab-${openedTab}`}
          className="border border-zinc-200 bg-white p-5 shadow-sm focus-visible:outline-none sm:border-2 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* TAB 1: IDENTITY */}
          {openedTab === CustomerTab.Identity && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Client Core Identification
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Primary credentials, account reference ID, and corporate ERP permissions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerCode" className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
                      Client / Account ID <span className="text-red-600 dark:text-red-500">*</span>
                    </Label>
                    <Controller
                      name="customerCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="customerCode"
                          placeholder="e.g. CAT-2026-0089"
                          {...field}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(errors.customerCode)}
                          className={cn(
                            "h-11 rounded-none border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600",
                            errors.customerCode && "border-red-500",
                          )}
                        />
                      )}
                    />
                    {errors.customerCode && (
                      <p className="text-xs text-red-600 dark:text-red-500">{errors.customerCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
                      Display Name / Organization <span className="text-red-600 dark:text-red-500">*</span>
                    </Label>
                    <Controller
                      name="displayName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="displayName"
                          placeholder="e.g. Grand Horizon Banquets & Events"
                          {...field}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(errors.displayName)}
                          className={cn(
                            "h-11 rounded-none border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600",
                            errors.displayName && "border-red-500",
                          )}
                        />
                      )}
                    />
                    {errors.displayName && (
                      <p className="text-xs text-red-600 dark:text-red-500">{errors.displayName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 h-full">
                  <Controller
                    name="identity.avatar"
                    control={control}
                    render={({ field }) => (
                      <SingleImagePicker
                        label="Profile Photo"
                        description="JPG, PNG or WEBP. Max 5MB."
                        value={field.value ?? avatarUrl ?? null}
                        onChange={(file) => {
                          field.onChange(file);
                          if (!file) {
                            setValue("identity.avatarUrl", "", { shouldDirty: true });
                          }
                        }}
                        error={(errors.identity?.avatar as any)?.message as string | undefined}
                        disabled={isSubmitting}
                        maxSizeMB={5}
                      />
                    )}
                  />
                </div>
              </div>

              <Controller
                name="identity"
                control={control}
                render={({ field }) => (
                  <IdentityForm
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors.identity as any}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}

          {/* TAB 2: COMMERCIAL TERMS */}
          {openedTab === CustomerTab.Defaults && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Commercial Terms & Catering Parameters
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Configure automated credit limits, billing terms, and statutory TDS rules.
                </p>
              </div>

              <Controller
                name="defaults"
                control={control}
                render={({ field }) => (
                  <DefaultsForm
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors.defaults as any}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {openedTab === CustomerTab.Address && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Addresses & Dispatch Locations
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Billing headquarters and default banquet/event drop-off locations.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <Controller
                  name="permanentAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressForm
                      title="Principal Billing Headquarters"
                      idPrefix="permanent-address"
                      value={field.value}
                      onChange={field.onChange}
                      errors={errors.permanentAddress as any}
                      disabled={isSubmitting}
                    />
                  )}
                />

                <hr className="border-zinc-200 dark:border-zinc-800" />

                <Controller
                  name="temporaryAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressForm
                      title="Default Event / Delivery Venue"
                      idPrefix="temporary-address"
                      value={field.value}
                      onChange={field.onChange}
                      errors={errors.temporaryAddress as any}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* TAB 4: CONTACTS */}
          {openedTab === CustomerTab.Contacts && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Event Coordinators & Emergency Contacts
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Primary booking representative and day-of-event on-site supervisors.
                </p>
              </div>

              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <ContactForm
                    title="Primary Booking Representative"
                    idPrefix="personal-contact"
                    showNameAndRelation={false}
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors.contact as any}
                    disabled={isSubmitting}
                  />
                )}
              />

              <hr className="border-zinc-200 dark:border-zinc-800" />

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-2 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      On-Site Emergency Contacts ({emergencyFields.length})
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Reachable during live event logistics and kitchen operations.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendEmergencyContact({
                        isPrimary: false,
                        name: "",
                        phone: "",
                        relation: "",
                        email: "",
                      })
                    }
                    disabled={isSubmitting}
                    className="flex h-8 items-center gap-1.5 self-start rounded-none border-2 border-dashed border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:border-red-600 hover:bg-zinc-50 hover:text-red-600 sm:self-auto dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-zinc-900 dark:hover:text-red-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Contact
                  </Button>
                </div>

                <div className="space-y-4">
                  {emergencyFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-none border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800/60">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-400">
                          <PhoneCall className="h-3.5 w-3.5 text-red-600 dark:text-red-500" />
                          Contact #{index + 1}
                        </span>
                        {emergencyFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmergencyContact(index)}
                            disabled={isSubmitting}
                            aria-label={`Remove emergency contact #${index + 1}`}
                            className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-red-600 focus-visible:ring-1 focus-visible:ring-red-600 dark:text-zinc-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <Controller
                        name={`emergencyContact.${index}`}
                        control={control}
                        render={({ field }) => (
                          <ContactForm
                            title=""
                            idPrefix={`emergency-contact-${index}`}
                            showNameAndRelation={true}
                            value={field.value}
                            onChange={field.onChange}
                            errors={
                              Array.isArray(errors.emergencyContact)
                                ? (errors.emergencyContact[index] as any)
                                : undefined
                            }
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & KYC */}
          {openedTab === CustomerTab.Document && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
                <div className="sm:col-span-3">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Compliance & Verification Documents ({documentFields.length})
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Catering service contracts, tax exemption permits, PAN cards, and agreements.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendDocument({
                      documentNumber: "",
                      documentType: "citizenship",
                      mediaRefs: [],
                      description: "",
                      expiryDate: undefined,
                      issuedBy: "",
                      issuedDate: undefined,
                      issuedDistrict: "",
                      title: "",
                    })
                  }
                  disabled={isSubmitting}
                  className="flex h-9 items-center gap-1.5 self-start rounded-none border-2 border-dashed border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:border-red-600 hover:bg-zinc-50 hover:text-red-600 sm:self-auto dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-zinc-900 dark:hover:text-red-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Document
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {documentFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800/60">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-400">
                        <FileCheck className="h-3.5 w-3.5 text-red-600 dark:text-red-500" />
                        Document #{index + 1}
                      </span>
                      {documentFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          disabled={isSubmitting}
                          aria-label={`Remove document #${index + 1}`}
                          className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-red-600 focus-visible:ring-1 focus-visible:ring-red-600 dark:text-zinc-500 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <Controller
                      name={`documents.${index}`}
                      control={control}
                      render={({ field }) => (
                        <DocumentForm
                          value={field.value}
                          onChange={field.onChange}
                          errors={
                            Array.isArray(errors.documents)
                              ? (errors.documents[index] as any)
                              : undefined
                          }
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SOCIAL MEDIA */}
          {openedTab === CustomerTab.SocialProfile && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Digital & Communication Channels
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Direct WhatsApp dispatch lines and social media handles for event coordination.
                </p>
              </div>

              <Controller
                name="socialMediaProfiles"
                control={control}
                render={({ field }) => (
                  <SocialProfileForm
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors.socialMediaProfiles as any}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}
        </div>
      </main>

      {/* 4. MOBILE FLOATING ACTION BAR */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t-2 border-zinc-300 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        <div>
          <span className="block text-[10px] font-bold uppercase text-zinc-400">
            Active Tab
          </span>
          <span className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">
            {tabList.find((t) => t.key === openedTab)?.label}
          </span>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 rounded-none border border-red-600 bg-red-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Record"
          )}
        </Button>
      </div>
    </form>
  );
}