"use client";

import { useState, useEffect } from "react";
import FilterBar from "./FiltersBar";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    dates.push(`${dayName}\n${dayNumber}`);
  }
  return dates;
};

const DATES = generateDates();

interface Department {
  name: string;
  description?: string;
  _id?: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  _id?: string;
}

interface SimpleTimeSlot {
  time: string;
  isAvailable: boolean;
}

type TimeSlotProp = TimeSlot[] | SimpleTimeSlot[];

interface OrganizationSidebarProps {
  departments: Department[];
  timeSlots: TimeSlotProp;
}

export default function OrganizationSidebar({
  departments,
  timeSlots,
}: OrganizationSidebarProps) {
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterDate, setFilterDate] = useState(DATES[0]);
  const [filterTimeslot, setFilterTimeslot] = useState<string>("");

  const processedTimeSlots = (timeSlots || []).map((slot) => {
    if ("time" in slot) {
      return {
        startTime: slot.time.split(" - ")[0],
        endTime: slot.time.split(" - ")[1],
        isAvailable: slot.isAvailable,
        display: slot.time,
      };
    } else {
      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        display: `${slot.startTime} - ${slot.endTime}`,
      };
    }
  });

  useEffect(() => {
    if (departments.length > 0 && !filterDepartment) {
      setFilterDepartment(departments[0].name);
    }
    if (processedTimeSlots.length > 0 && !filterTimeslot) {
      const firstAvailableSlot =
        processedTimeSlots.find((slot) => slot.isAvailable) ||
        processedTimeSlots[0];
      setFilterTimeslot(firstAvailableSlot.display);
    }
  }, [departments, processedTimeSlots, filterDepartment, filterTimeslot]);

  const departmentNames = departments.map((dept) => dept.name);

  const formattedTimeSlots = processedTimeSlots.map((slot) => slot.display);

  const availableTimeSlots = processedTimeSlots
    .filter((slot) => slot.isAvailable)
    .map((slot) => slot.display);

  if (departments.length === 0 && processedTimeSlots.length === 0) {
    return (
      <div className="flex flex-col justify-start p-4 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500 text-center">
          No departments or time slots available
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {departments.length > 0 && (
        <>
          <h1 className="py-2 font-bold text-2xl text-gray-800">Departments</h1>
          <FilterBar
            filters={departmentNames}
            activeFilter={filterDepartment}
            onChange={setFilterDepartment}
          />
          <div className="mt-3 h-px w-full bg-gray-400" />
        </>
      )}

      <h2 className="py-2 font-bold text-xl text-gray-800">Available Slots</h2>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Select Date
          </h3>
          <FilterBar
            rounded="lg"
            filters={DATES}
            activeFilter={filterDate}
            onChange={setFilterDate}
          />
        </div>

        {processedTimeSlots.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Select Time
            </h3>
            <FilterBar
              filters={
                availableTimeSlots.length > 0
                  ? availableTimeSlots
                  : ["No slots available"]
              }
              activeFilter={
                availableTimeSlots.includes(filterTimeslot)
                  ? filterTimeslot
                  : availableTimeSlots[0] || ""
              }
              onChange={setFilterTimeslot}
              disabled={availableTimeSlots.length === 0}
            />

            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">{availableTimeSlots.length}</span>{" "}
              of{" "}
              <span className="font-medium">{processedTimeSlots.length}</span>{" "}
              slots available
            </div>
          </div>
        )}
      </div>

      {(filterDepartment || filterTimeslot) && (
        <div className="mt-6 p-3 bg-fuchsia-50 rounded-lg">
          <h3 className="font-semibold text-[#B61BE1] mb-2">Your Selection:</h3>
          {filterDepartment && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Department: </span>
              {filterDepartment}
            </p>
          )}
          {filterDate && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Date: </span>{" "}
              {filterDate.replace("\n", " ")}
            </p>
          )}
          {filterTimeslot && availableTimeSlots.length > 0 && (
            <p className="text-sm text-gary-700">
              <span className="font-medium">Time: </span> {filterTimeslot}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
