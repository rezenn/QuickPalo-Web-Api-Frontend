"use client";

import { useState } from "react";
import FiltersBar from "./FiltersBar";
const orgFilters = [
  "All",
  "Hospital",
  "Clinic",
  "Government Office",
  "Service Center",
  "Bank",
  "School",
  "College",
  "University",
  "Others",
];

export default function OrganizationFilter() {
  const [filter, setFilter] = useState<(typeof orgFilters)[number]>("All");

  return (
    <>
      <FiltersBar
        filters={orgFilters}
        activeFilter={filter}
        onChange={setFilter}
      />
    </>
  );
}
