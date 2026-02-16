"use client";

import { useState, useEffect } from "react";
import FilterBar from "./FiltersBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    dates.push({
      display: `${dayName}\n${dayNumber}`,
      fullDate: `${year}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${dayNumber.toString().padStart(2, "0")}`,
      dayName,
      dayNumber,
      month: monthName,
      monthNumber: date.getMonth() + 1,
      year,
    });
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
  organizationId?: string;
  organizationName?: string;
  organizationType?: string;
}

export default function OrganizationSidebar({
  departments,
  timeSlots,
  organizationId,
  organizationName,
  organizationType,
}: OrganizationSidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterDate, setFilterDate] = useState(DATES[0]);
  const [filterTimeslot, setFilterTimeslot] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

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

  const handleBookAppointment = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/organization/${organizationId}`);
      return;
    }

    if (!filterDepartment || !filterTimeslot) {
      alert("Please select both department and time slot");
      return;
    }

    setIsBooking(true);

    const selectedSlot = processedTimeSlots.find(
      (slot) => slot.display === filterTimeslot,
    );

    const bookingData = {
      organizationId,
      organizationName,
      organizationType,
      department: filterDepartment,
      date: {
        display: filterDate.display,
        fullDate: filterDate.fullDate,
        dayName: filterDate.dayName,
        dayNumber: filterDate.dayNumber,
        month: filterDate.month,
        year: filterDate.year,
      },
      timeSlot: {
        display: filterTimeslot,
        startTime: selectedSlot?.startTime,
        endTime: selectedSlot?.endTime,
      },
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      bookingTime: new Date().toISOString(),
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

    router.push("/user/appointment");
  };

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
            Select Date for {filterDate.month}
          </h3>
          <FilterBar
            rounded="lg"
            filters={DATES.map((d) => d.display)}
            activeFilter={filterDate.display}
            onChange={(selected) => {
              const selectedDateObj = DATES.find((d) => d.display === selected);
              if (selectedDateObj) {
                setFilterDate(selectedDateObj);
              }
            }}
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
        <div className="mt-6 p-3 bg-fuchsia-50 rounded-lg ">
          <h3 className="font-semibold text-[#B61BE1] mb-2">Your Selection</h3>
          <div className="mb-1 rounded-full border bg-[#B61BE1] "></div>
          {filterDepartment && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Department: </span>
              {filterDepartment}
            </p>
          )}
          {filterDate && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Date: </span>{" "}
              {filterDate.display.replace("\n", " ")}, {filterDate.month}
            </p>
          )}
          {filterTimeslot && availableTimeSlots.length > 0 && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Time: </span> {filterTimeslot}
            </p>
          )}
        </div>
      )}

      <div className="my-5 flex items-center justify-center">
        <button
          onClick={handleBookAppointment}
          disabled={
            isBooking ||
            !filterDepartment ||
            !filterTimeslot ||
            availableTimeSlots.length === 0
          }
          className="flex-1 bg-[#B61BE1] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isBooking ? "Processing..." : "Book an Appointment"}
        </button>
      </div>
    </div>
  );
}
