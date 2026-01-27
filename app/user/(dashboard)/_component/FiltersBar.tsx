"use client";

import FilterChip from "./FilterChip";

type FilterBarProps<T extends string> = {
  filters: readonly T[];
  activeFilter: T;
  onChange: (filter: T) => void;
  rounded?: "full" | "lg";
};

export default function FilterBar<T extends string>({
  filters,
  activeFilter,
  onChange,
  rounded = "full",
}: FilterBarProps<T>) {
  return (
    <div className="  flex gap-3 overflow-x-auto scrollbar-hide px-1">
      {filters.map((filter) => (
        <FilterChip
          rounded={rounded}
          key={filter}
          label={filter}
          isActive={activeFilter === filter}
          onClick={() => onChange(filter)}
        />
      ))}
    </div>
  );
}
