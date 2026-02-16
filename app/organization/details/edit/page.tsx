"use client";

import { useState } from "react";
import EditOrganizationForm from "../_components/EditOrganizationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const sampleData = {
  organizationName: "ABC Hospital",
  organizationType: "hospital",
  description: "24/7 emergency",
  street: "Gyaneshwor",
  city: "Kathmandu",
  state: "Bagmati",
  contactEmail: "info@abchospital.com",
  contactPhone: "9844648395",
  workingHours: [
    {
      day: "sunday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "monday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "tuesday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "wednesday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "thursday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "friday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
    },
    {
      day: "saturday",
      openingTime: "00:00",
      closingTime: "00:00",
      isWorking: false,
    },
  ],
  departments: [
    { name: "ER", description: "for emergency patients only" },
    { name: "General" },
    { name: "Neuro", description: "for neurologist only" },
  ],
  appointmentDuration: 20,
  advanceBookingDays: 7,
  timeSlots: [
    { startTime: "08:00", endTime: "08:30", isAvailable: true },
    { startTime: "08:30", endTime: "09:00", isAvailable: true },
    { startTime: "09:00", endTime: "09:30", isAvailable: true },
    { startTime: "09:30", endTime: "10:00", isAvailable: true },
    { startTime: "10:00", endTime: "10:30", isAvailable: true },
    { startTime: "14:00", endTime: "14:30", isAvailable: true },
    { startTime: "14:30", endTime: "15:00", isAvailable: true },
    { startTime: "17:30", endTime: "18:00", isAvailable: false },
  ],
};

export default function Page() {
  const [data, setData] = useState(sampleData);

  const handleSave = (updatedData: any) => {
    setData(updatedData);
    console.log("Saved:", updatedData);
  };

  return (
    <div>
      {/* Back button at the top */}
      <div style={{ padding: "20px 20px 0 20px" }}>
        <Link
          href="/organization/details"
          className="w-25 bg-[#B61BE1] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
      </div>

      {/* Edit Form */}
      <EditOrganizationForm
        initialData={data}
        onSave={handleSave}
        onCancel={() => console.log("cancel")}
      />
    </div>
  );
}
