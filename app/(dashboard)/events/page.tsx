'use client'

import { AddressForm } from "@/components/person/address"
import { BankDetailForm } from "@/components/person/bank"
import { EmergencyContactForm } from "@/components/person/contact"
import { CreatePersonForm } from "@/components/person/create-person"
import { NationalIdForm } from "@/components/person/nid"

export default function page() {
    return (
        <div>
            <CreatePersonForm
             />
            <AddressForm
                ownerRef="company"
                ownerType="Person"
                defaultValues={{
                    city: "Kathmandu",
                    country: "Nepal",
                    district: "Kathmandu",
                    isPrimary: true,
                    label: "home",
                    street: "Lazimpat"
                }}
                onCancel={() => { console.log("Cancel clicked") }}
                key={"ell"}
                onSubmit={() => { console.log("Submit clicked") }} />
            <BankDetailForm
                onSubmit={() => console.log("s")}
                ownerRef="company"
                ownerType="Person"
                defaultValues={{
                    accountHolderName: "John Doe",
                    accountNumber: "xxxxxxxxxxxxxxxxxxxxx",
                    bankName: "NIC Asia Bank Limited",
                    isPrimary: true,
                    branch: "Kalanki"
                }}
            />
            <EmergencyContactForm
                ownerRef="company"
                ownerType="Person"
                defaultValues={{
                    name: "John Doe",
                    relation: "Brother",
                    phone: "9812345678",
                    isPrimary: true
                }}
                onSubmit={() => console.log("s")} />
            <NationalIdForm
                ownerRef="company"
                ownerType="Person"
                defaultValues={{
                    expiryDate: "",
                    idNumber: "",
                    idType: "other",
                    issuedDate: "",
                    issuedDistrict: "",
                }}
                isSubmitting
                onCancel={() => console.log("cancel clicked")}
                submitLabel="Save"
                onSubmit={() => console.log("submit clicked")}
            />

        </div>
    )
}