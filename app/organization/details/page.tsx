// import OrganizationsDetailsCard from "../_component/OrganizationDetailCard";
// import OrganizationFilter from "../_component/OrganizationFilter";

// export default function Organizations() {
//   return (
//     <div>
//       {/* <h1 className=" px-2 pb-3 text-2xl font-semibold ">Organizations</h1> */}
//       <div className="flex flex-row overflow-x-auto pb-5">
//         <OrganizationFilter />
//       </div>
//       <div className="flex flow-col overflow-y-auto pb-5">
//         <OrganizationsDetailsCard />
//       </div>
//     </div>
//   );
// }

// app/dashboard/organization/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  handleGetMyOrganizationDetails,
  handleUpdateOrganizationDetails,
} from "../../../lib/actions/organization/organization-action";
import OrganizationProfile from "./_components/OrganizationProfile";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
// Sample data based on your JSON
const sampleData = {
  _id: "698ec78d74ef78a1654a1005",
  userId: "698ec72274ef78a1654a1000",
  organizationName: "ABC Hospital",
  organizationType: "hospital",
  description: "24/7 emergency service for the people",
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
      _id: "69901055ade5c3de34303f74",
    },
    {
      day: "monday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
      _id: "69901055ade5c3de34303f75",
    },
    {
      day: "tuesday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
      _id: "69901055ade5c3de34303f76",
    },
    {
      day: "wednesday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
      _id: "69901055ade5c3de34303f77",
    },
    {
      day: "thursday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
      _id: "69901055ade5c3de34303f78",
    },
    {
      day: "friday",
      openingTime: "08:00",
      closingTime: "18:00",
      isWorking: true,
      _id: "69901055ade5c3de34303f79",
    },
    {
      day: "saturday",
      openingTime: "00:00",
      closingTime: "00:00",
      isWorking: false,
      _id: "69901055ade5c3de34303f7a",
    },
  ],
  departments: [
    {
      name: "ER",
      description: "for emergency patients only",
      _id: "69901055ade5c3de34303f7b",
    },
    {
      name: "General",
      _id: "69901055ade5c3de34303f7c",
    },
    {
      name: "Neuro",
      description: "for neurologist only",
      _id: "69901055ade5c3de34303f7d",
    },
  ],
  appointmentDuration: 20,
  advanceBookingDays: 7,
  timeSlots: [
    {
      startTime: "08:00",
      endTime: "08:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f7e",
    },
    {
      startTime: "08:30",
      endTime: "09:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f7f",
    },
    {
      startTime: "09:00",
      endTime: "09:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f80",
    },
    {
      startTime: "09:30",
      endTime: "10:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f81",
    },
    {
      startTime: "10:00",
      endTime: "10:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f82",
    },
    {
      startTime: "10:30",
      endTime: "11:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f83",
    },
    {
      startTime: "11:00",
      endTime: "11:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f84",
    },
    {
      startTime: "11:30",
      endTime: "12:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f85",
    },
    {
      startTime: "14:00",
      endTime: "14:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f86",
    },
    {
      startTime: "14:30",
      endTime: "15:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f87",
    },
    {
      startTime: "15:00",
      endTime: "15:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f88",
    },
    {
      startTime: "15:30",
      endTime: "16:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f89",
    },
    {
      startTime: "16:00",
      endTime: "16:30",
      isAvailable: true,
      _id: "69901055ade5c3de34303f8a",
    },
    {
      startTime: "16:30",
      endTime: "17:00",
      isAvailable: true,
      _id: "69901055ade5c3de34303f8b",
    },
    {
      startTime: "17:00",
      endTime: "17:30",
      isAvailable: false,
      _id: "69901055ade5c3de34303f8c",
    },
    {
      startTime: "17:30",
      endTime: "18:00",
      isAvailable: false,
      _id: "69901055ade5c3de34303f8d",
    },
  ],
  isActive: true,
  isVerified: false,
  createdAt: "2026-02-13T06:41:17.555Z",
  updatedAt: "2026-02-14T06:04:05.529Z",
  user: {
    _id: "698ec72274ef78a1654a1000",
    fullName: "ABC Hospital",
    email: "info@abchospital.com",
    phoneNumber: "+9779895230782",
    role: "organization",
    profilePicture: "f97933a8-8273-4dcc-b534-a21db23b78df.jpg",
  },
};

export default function OrganizationDashboard() {
  return (
    <div>
      <OrganizationProfile data={sampleData} />{" "}
    </div>
  );
}
