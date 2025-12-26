"use client";

import { useState } from "react";
import FilterChip from "./FilterChip";

const filters = [
  "All",
  "Hospital",
  "School",
  "College",
  "University",
  "Service Center",
];

export default function FiltersBar() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div
      className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide px-1 
 "
    >
      {filters.map((filter, index) => (
        <FilterChip
          key={`${filter}-${index}`}
          label={filter}
          isActive={activeFilter === filter}
          onClick={() => setActiveFilter(filter)}
        />
      ))}
    </div>
  );
}
