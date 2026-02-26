"use client";

import { useState, useEffect, useMemo } from "react";
import FilterBar from "./FiltersBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { handleCheckAvailability } from "@/lib/actions/appointment/appointment";
import { toast } from "sonner";
import { FaMoneyBill } from "react-icons/fa";

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
  id?: string;
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
  fees?: number;
}

export default function OrganizationSidebar({
  departments,
  timeSlots,
  organizationId,
  organizationName,
  organizationType,
  fees,
}: OrganizationSidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterDate, setFilterDate] = useState(DATES[0]);
  const [filterTimeslot, setFilterTimeslot] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [departmentMap, setDepartmentMap] = useState<Map<string, string>>(
    new Map(),
  );

  // Create a map of department names to IDs
  useEffect(() => {
    const map = new Map<string, string>();
    departments.forEach((dept) => {
      const deptId = dept._id || dept.id;
      if (deptId) {
        map.set(dept.name, deptId);
      } else {
        console.warn(`Department "${dept.name}" has no ID`);
      }
    });
    setDepartmentMap(map);
  }, [departments]);

  // Process time slots
  const processedTimeSlots = useMemo(() => {
    return (timeSlots || []).map((slot) => {
      if ("time" in slot) {
        const [startTime, endTime] = slot.time.split(" - ");
        return {
          startTime: startTime || "",
          endTime: endTime || "",
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
  }, [timeSlots]);

  useEffect(() => {
    if (departments.length > 0 && !filterDepartment) {
      const firstDept = departments[0];
      const deptId = firstDept._id || firstDept.id;

      if (deptId) {
        setFilterDepartment(firstDept.name);
        setSelectedDepartment({
          name: firstDept.name,
          id: deptId,
        });
      } else {
        console.error("First department has no ID:", firstDept);
      }
    }
  }, [departments, filterDepartment]);

  // Update selected department when filterDepartment changes
  useEffect(() => {
    if (filterDepartment) {
      const deptId = departmentMap.get(filterDepartment);

      if (deptId) {
        setSelectedDepartment({
          name: filterDepartment,
          id: deptId,
        });
      } else {
        console.error("No ID found for department:", filterDepartment);

        const dept = departments.find((d) => d.name === filterDepartment);
        if (dept) {
          const fallbackId = dept._id || dept.id;
          if (fallbackId) {
            setSelectedDepartment({
              name: dept.name,
              id: fallbackId,
            });
          }
        }
      }
    }
  }, [filterDepartment, departmentMap, departments]);

  // Check availability when changes made
  useEffect(() => {
    const checkAllSlotAvailability = async () => {
      if (!selectedDepartment?.id) {
        console.log("No selected department ID yet", {
          selectedDepartment,
          filterDepartment,
          availableIds: Array.from(departmentMap.entries()),
        });
        return;
      }

      if (!filterDate || !organizationId) {
        console.log("Missing date or organizationId");
        return;
      }

      console.log("Checking availability for:", {
        department: selectedDepartment,
        date: filterDate.fullDate,
        organizationId,
      });

      setIsCheckingAvailability(true);

      try {
        const availabilityMap: { [key: string]: boolean } = {};

        // Check each slot one by one
        for (const slot of processedTimeSlots) {
          try {
            const result = await handleCheckAvailability({
              organizationId: organizationId!,
              date: filterDate.fullDate,
              startTime: slot.startTime,
              endTime: slot.endTime,
              departmentId: selectedDepartment.id,
            });

            if (result.success && result.data) {
              availabilityMap[slot.display] = result.data.isAvailable === true;
            } else {
              availabilityMap[slot.display] = slot.isAvailable;
            }
          } catch (slotError) {
            console.error(`Error checking slot ${slot.display}:`, slotError);
            availabilityMap[slot.display] = slot.isAvailable;
          }
        }

        setAvailabilityStatus(availabilityMap);
      } catch (error) {
        toast.error("Failed to check slot availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAllSlotAvailability();
  }, [
    selectedDepartment,
    filterDate,
    organizationId,
    processedTimeSlots,
    departmentMap,
  ]);

  // Get available time slots based on real-time availability
  const availableTimeSlots = processedTimeSlots
    .filter((slot) => {
      if (Object.keys(availabilityStatus).length > 0) {
        return availabilityStatus[slot.display] === true;
      }
      return slot.isAvailable;
    })
    .map((slot) => slot.display);

  // Update filterTimeslot when available slots change
  useEffect(() => {
    if (availableTimeSlots.length > 0) {
      if (!filterTimeslot || !availableTimeSlots.includes(filterTimeslot)) {
        setFilterTimeslot(availableTimeSlots[0]);
      }
    } else {
      setFilterTimeslot("");
    }
  }, [availableTimeSlots, filterTimeslot]);

  const departmentNames = departments.map((dept) => dept.name);

  const handleDepartmentChange = (deptName: string) => {
    setFilterDepartment(deptName);
    setAvailabilityStatus({});

    // Immediately try to set the selected department
    const deptId = departmentMap.get(deptName);
    if (deptId) {
      setSelectedDepartment({
        name: deptName,
        id: deptId,
      });
    }
  };

  const handleBookAppointment = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/organization/${organizationId}`);
      return;
    }

    if (!filterDepartment) {
      toast.error("Please select a department");
      return;
    }

    if (!filterTimeslot) {
      toast.error("Please select a time slot");
      return;
    }

    // Get department ID
    let departmentId = selectedDepartment?.id;

    if (!departmentId) {
      departmentId = departmentMap.get(filterDepartment);
    }

    if (!departmentId) {
      console.error("No department ID found", {
        selectedDepartment,
        filterDepartment,
        departmentMap: Array.from(departmentMap.entries()),
      });

      const dept = departments.find((d) => d.name === filterDepartment);
      if (dept) {
        departmentId = dept._id || dept.id;
      }

      if (!departmentId) {
        toast.error(
          "Department ID not found. Please try selecting the department again.",
        );
        return;
      }
    }

    // Get selected time slot
    const selectedSlot = processedTimeSlots.find(
      (slot) => slot.display === filterTimeslot,
    );

    if (!selectedSlot) {
      toast.error("Selected time slot not found");
      return;
    }

    setIsBooking(true);

    try {
      const availabilityCheck = await handleCheckAvailability({
        organizationId: organizationId!,
        date: filterDate.fullDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        departmentId: departmentId,
      });

      if (!availabilityCheck.success || !availabilityCheck.data?.isAvailable) {
        toast.error(
          availabilityCheck.message || "This time slot is no longer available",
        );

        setAvailabilityStatus((prev) => ({
          ...prev,
          [selectedSlot.display]: false,
        }));

        setIsBooking(false);
        return;
      }

      // Create booking data
      const bookingData = {
        organizationId,
        organizationName,
        organizationType,
        fees: fees || 0,
        department: {
          name: filterDepartment,
          id: departmentId,
        },
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
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
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
      console.log("Saved booking data:", sessionStorage.getItem("bookingData")); 

      // Navigate to confirmation page
      router.push("/user/appointment");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to process booking");
      setIsBooking(false);
    }
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
            onChange={handleDepartmentChange}
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
            <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              Select Time
              {isCheckingAvailability && (
                <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
              )}
            </h3>
            <FilterBar
              filters={
                availableTimeSlots.length > 0
                  ? availableTimeSlots
                  : ["No slots available"]
              }
              activeFilter={
                availableTimeSlots.includes(filterTimeslot) && filterTimeslot
                  ? filterTimeslot
                  : availableTimeSlots[0] || ""
              }
              onChange={setFilterTimeslot}
              disabled={
                availableTimeSlots.length === 0 || isCheckingAvailability
              }
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
      <div className="mt-3 h-px w-full bg-gray-400" />

      <div className="mt-1 text-sm text-gray-600">
        <h2 className="py-2 font-bold text-xl text-gray-800">
          {" "}
          Appointment Fees
        </h2>
        <div className="flex items-center">
          {" "}
          <FaMoneyBill className="text-green-600 mr-2" />
          <span className="font-medium">Rs {fees}</span>
        </div>
      </div>

      {(filterDepartment || filterTimeslot) && (
        <div className="mt-6 p-3 bg-fuchsia-50 rounded-lg ">
          <h3 className="font-semibold text-[#B61BE1] mb-2">Your Selection</h3>
          <div className="mb-1 rounded-full border bg-[#B61BE1] "></div>
          {filterDepartment && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Department: </span>
              {filterDepartment}
              {selectedDepartment?.id && (
                <span className="text-xs text-gray-500 ml-2">
                  (ID: {selectedDepartment.id.substring(0, 15)}...)
                </span>
              )}
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
            isCheckingAvailability ||
            !filterDepartment ||
            !filterTimeslot ||
            availableTimeSlots.length === 0
          }
          className="flex-1 bg-[#B61BE1] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isBooking ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : isCheckingAvailability ? (
            "Checking Availability..."
          ) : (
            "Book an Appointment"
          )}
        </button>
      </div>
    </div>
  );
}
