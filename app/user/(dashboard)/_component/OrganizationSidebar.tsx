"use client";

import { useState } from "react";
import FilterBar from "./FiltersBar";

const Date = [
  "Sunday\n5",
  "Monday\n6",
  "Tuesday\n7",
  "Wednesday\n8",
  "Thursday\n9",
  "Friday\n10",
  "Saturday\n11",
];

type Props = {
  departments: readonly string[];
  timeSlots: readonly string[];
};

export default function OrganizationSidebar({ departments, timeSlots }: Props) {
  const [filterDepartment, setFilterDepartment] = useState(departments[0]);
  const [filterDate, setFilterDate] = useState(Date[0]);
  const [filterTimeslot, setFilterTimeslot] = useState(timeSlots[0]);

  return (
    <div className="flex flex-col justify-start">
      <h1 className="py-2 font-bold text-2xl">Department</h1>

      <FilterBar
        filters={departments}
        activeFilter={filterDepartment}
        onChange={setFilterDepartment}
      />

      <div className="mt-3 h-px w-xl bg-gray-400" />

      <h2 className="py-2 font-bold text-xl">Slots</h2>

      <div className="flex flex-col gap-4">
        <FilterBar
          rounded="lg"
          filters={Date}
          activeFilter={filterDate}
          onChange={setFilterDate}
        />
        <FilterBar
          filters={timeSlots}
          activeFilter={filterTimeslot}
          onChange={setFilterTimeslot}
        />
      </div>
    </div>
  );
}
