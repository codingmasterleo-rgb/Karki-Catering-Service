"use client";

import * as React from "react";
import { useCallback, useMemo, useState, useRef, useEffect, type KeyboardEvent } from "react";
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
  Keyboard as KeyboardIcon,
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

export type CustomerFormValues = Omit<z.infer<typeof customerFormSchema>, "identity" | "documents"> & {
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
  accessIndex: number;
}

const tabList: TabConfig[] = [
  { key: CustomerTab.Identity, label: "Identity & Roles", icon: UserRound, accessIndex: 1 },
  { key: CustomerTab.Defaults, label: "Commercial Terms", icon: Settings2, accessIndex: 2 },
  { key: CustomerTab.Address, label: "Addresses & Venues", icon: MapPin, accessIndex: 3 },
  { key: CustomerTab.Contacts, label: "Event Contacts", icon: Contact, accessIndex: 4 },
  { key: CustomerTab.Document, label: "KYC & Documents", icon: FileText, accessIndex: 5 },
  { key: CustomerTab.SocialProfile, label: "Communication", icon: Share2, accessIndex: 6 },
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
  const [showKeyTips, setShowKeyTips] = useState<boolean>(false);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema) as Resolver<CustomerFormValues>,
    defaultValues: initial_data,
    mode: "onBlur",
  });

  // Dynamic Array Handlers
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
    async (tab: CustomerTab, shouldFocus = false) => {
      if (tab === openedTab) return;
      await trigger(tabFieldMap[openedTab]);
      setOpenedTab(tab);
      if (shouldFocus) {
        setTimeout(() => tabRefs.current[tab]?.focus(), 10);
      }
    },
    [openedTab, trigger],
  );

  // Focus the first interactive field inside the current form panel
  const focusFirstPanelField = useCallback(() => {
    if (!panelRef.current) return;
    const focusable = panelRef.current.querySelector<HTMLElement>(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
    );
    focusable?.focus();
  }, []);

  // Keyboard navigation within the Tablist (Roving Tabindex)
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
        goToTab(nextTab, true);
      }
    },
    [goToTab],
  );

  // Multipart/Form-Data Submission Pipeline
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
            avatar: typeof data.identity.avatar === "string" ? data.identity.avatar : undefined,
          },
          documents: data.documents.map((doc) => ({
            ...doc,
            // Keep existing string URLs if editing/pre-filled, omit raw File instances
            mediaRefs: Array.isArray(doc.mediaRefs)
              ? doc.mediaRefs.filter((ref): ref is string => typeof ref === "string")
              : [],
          })),
        };

        // Append the JSON payload as a string
        formData.append("customerData", JSON.stringify(metadataPayload));

        // 4. Send Multipart Request (Browser sets boundary automatically)
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
            if (textError) errorMessage = `Server error (${response.status}): ${textError.slice(0, 100)}`;
          }
          throw new Error(errorMessage);
        }

        toast.success("Client account and assets registered successfully!");
        reset(initial_data);
        setOpenedTab(CustomerTab.Identity);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(error instanceof Error ? error.message : "Submission failed");
      }
    },
    [reset],
  );

  const onInvalid = useCallback(() => {
    const firstErroredTab = tabList.find((t) => tabErrorMap[t.key]);
    if (firstErroredTab) setOpenedTab(firstErroredTab.key);
    toast.error("Please resolve the flagged errors before submitting.");
  }, [tabErrorMap]);

  // Contextual Add Item Helper (Alt + N)
  const handleContextualAdd = useCallback(() => {
    if (openedTab === CustomerTab.Contacts) {
      appendEmergencyContact({ isPrimary: false, name: "", phone: "", relation: "", email: "" });
      toast.info("Added new emergency contact row");
    } else if (openedTab === CustomerTab.Document) {
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
      });
      toast.info("Added new document upload row");
    }
  }, [openedTab, appendEmergencyContact, appendDocument]);

  // Modern Windows Desktop Keyboard Shortcuts Manager
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // 1. Toggle Access KeyTips when pressing Alt
      if (e.key === "Alt") {
        setShowKeyTips((prev) => !prev);
      }

      // 2. Ctrl+S: Save Record
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit(onSubmit, onInvalid)();
        return;
      }

      // 3. Ctrl + 1..6: Direct Tab Jumps
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= tabList.length) {
          e.preventDefault();
          const targetTab = tabList[num - 1].key;
          goToTab(targetTab, true);
          return;
        }
      }

      // 4. Ctrl + PageDown / PageUp: Sequential Tab Switching
      if (e.ctrlKey && (e.key === "PageDown" || e.key === "PageUp")) {
        e.preventDefault();
        const currentIndex = tabList.findIndex((t) => t.key === openedTab);
        const nextIndex =
          e.key === "PageDown"
            ? (currentIndex + 1) % tabList.length
            : (currentIndex - 1 + tabList.length) % tabList.length;
        goToTab(tabList[nextIndex].key, true);
        return;
      }

      // 5. F6 / Shift+F6: Pane Switching
      if (e.key === "F6") {
        e.preventDefault();
        const isFocusInPanel = panelRef.current?.contains(document.activeElement);
        if (isFocusInPanel) {
          tabRefs.current[openedTab]?.focus();
        } else {
          focusFirstPanelField();
        }
        return;
      }

      // 6. Alt + N: Contextual Add Row
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleContextualAdd();
        return;
      }

      // 7. Escape: Clear focus back to Active Tab
      if (e.key === "Escape") {
        tabRefs.current[openedTab]?.focus();
        setShowKeyTips(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [openedTab, goToTab, focusFirstPanelField, handleSubmit, onSubmit, onInvalid, handleContextualAdd]);

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
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-zinc-900 sm:text-base dark:text-zinc-100">
                  Client Registration
                </h1>
                <button
                  type="button"
                  onClick={() => setShowKeyTips((v) => !v)}
                  title="Toggle Keyboard Shortcuts Help (Alt)"
                  className="hidden rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 sm:inline-flex dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <KeyboardIcon className="h-4 w-4" />
                </button>
              </div>
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
                  <kbd className="ml-1.5 hidden rounded bg-red-800/60 px-1 py-0.5 text-[10px] font-normal tracking-normal text-red-200 lg:inline-block">
                    Ctrl+S
                  </kbd>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 2. HORIZONTAL NAVIGATION BAR (ROVING FOCUS & KEYTIPS) */}
        <div className="overflow-x-auto border-t border-zinc-200 bg-zinc-50/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:border-zinc-800 dark:bg-zinc-900/50">
          <nav
            role="tablist"
            aria-label="Catering Account Tabs (Use arrow keys or Ctrl+1..6 to navigate)"
            className="flex min-w-max px-2 sm:px-6"
          >
            {tabList.map(({ key, label, icon: Icon, accessIndex }, index) => {
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
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goToTab(key)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
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

                  {showKeyTips && (
                    <span className="absolute -top-1 right-2 z-20 rounded border border-zinc-400 bg-zinc-900 px-1 py-0.2 text-[9px] font-bold text-white shadow dark:border-zinc-600 dark:bg-zinc-100 dark:text-zinc-900">
                      ^{accessIndex}
                    </span>
                  )}

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
          ref={panelRef}
          role="tabpanel"
          id={`panel-${openedTab}`}
          aria-labelledby={`tab-${openedTab}`}
          tabIndex={-1}
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
                <div className="space-y-2">
                  <Label
                    htmlFor="customerCode"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
                  >
                    Client / Account ID <span className="text-red-600 dark:text-red-500">*</span>
                  </Label>
                  <Controller
                    name="customerCode"
                    control={control}
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <Input
                        id="customerCode"
                        placeholder="e.g. CAT-2026-0089"
                        value={value ?? ""}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
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
                    <p className="text-xs text-red-600 dark:text-red-500">
                      {errors.customerCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="displayName"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400"
                  >
                    Display Name / Organization <span className="text-red-600 dark:text-red-500">*</span>
                  </Label>
                  <Controller
                    name="displayName"
                    control={control}
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <Input
                        id="displayName"
                        placeholder="e.g. Grand Horizon Banquets & Events"
                        value={value ?? ""}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
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
                    <p className="text-xs text-red-600 dark:text-red-500">
                      {errors.displayName.message}
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-zinc-200 dark:border-zinc-800" />

              <Controller
                name="identity"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <IdentityForm
                    value={value}
                    onChange={onChange}
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
                render={({ field: { value, onChange } }) => (
                  <DefaultsForm
                    value={value}
                    onChange={onChange}
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
                  render={({ field: { value, onChange } }) => (
                    <AddressForm
                      title="Principal Billing Headquarters"
                      idPrefix="permanent-address"
                      value={value}
                      onChange={onChange}
                      errors={errors.permanentAddress as any}
                      disabled={isSubmitting}
                    />
                  )}
                />

                <hr className="border-zinc-200 dark:border-zinc-800" />

                <Controller
                  name="temporaryAddress"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <AddressForm
                      title="Default Event / Delivery Venue"
                      idPrefix="temporary-address"
                      value={value}
                      onChange={onChange}
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
                render={({ field: { value, onChange } }) => (
                  <ContactForm
                    title="Primary Booking Representative"
                    idPrefix="personal-contact"
                    showNameAndRelation={false}
                    value={value}
                    onChange={onChange}
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
                    <kbd className="ml-1 text-[10px] text-zinc-400">Alt+N</kbd>
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
                        render={({ field: { value, onChange } }) => (
                          <ContactForm
                            title=""
                            idPrefix={`emergency-contact-${index}`}
                            showNameAndRelation={true}
                            value={value}
                            onChange={onChange}
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
              <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Compliance & Verification Documents
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Catering service contracts, tax exemption permits, PAN cards, and agreements.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-2 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Uploaded Documents ({documentFields.length})
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Files attached to the client portfolio.
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
                    className="flex h-8 items-center gap-1.5 self-start rounded-none border-2 border-dashed border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:border-red-600 hover:bg-zinc-50 hover:text-red-600 sm:self-auto dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-zinc-900 dark:hover:text-red-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Document
                    <kbd className="ml-1 text-[10px] text-zinc-400">Alt+N</kbd>
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {documentFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-none border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
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
                        render={({ field: { value, onChange } }) => (
                          <DocumentForm
                            value={value}
                            onChange={onChange}
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
                render={({ field: { value, onChange } }) => (
                  <SocialProfileForm
                    value={value}
                    onChange={onChange}
                    errors={errors.socialMediaProfiles as any}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          )}
        </div>
      </main>

      {/* 4. FOOTER STATUS BAR (WINDOWS APP TRAY STYLE) */}
      <footer className="hidden items-center justify-between border-t border-zinc-200 bg-zinc-100/80 px-8 py-2 text-[11px] text-zinc-500 sm:flex dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">F6</kbd> Switch Pane
          </span>
          <span>
            <kbd className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Ctrl+1..6</kbd> Jump Tab
          </span>
          <span>
            <kbd className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Ctrl+PgUp/PgDn</kbd> Next/Prev Tab
          </span>
          <span>
            <kbd className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Alt</kbd> KeyTips
          </span>
        </div>
        <div>
          <span>Editing: <strong>{tabList.find((t) => t.key === openedTab)?.label}</strong></span>
        </div>
      </footer>

      {/* 5. MOBILE FLOATING ACTION BAR */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t-2 border-zinc-300 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        <div>
          <span className="block text-[10px] font-bold uppercase text-zinc-400">Active Tab</span>
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