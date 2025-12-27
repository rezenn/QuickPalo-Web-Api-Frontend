"use client";

import { useState } from "react";
import FiltersBar from "./FiltersBar";
const orgFilters = [
  "All",
  "Hospital",
  "School",
  "College",
  "University",
  "Service Center",
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
