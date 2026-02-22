"use client";

import { useState, useEffect, useMemo } from "react";
import FilterBar from "./FiltersBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { handleCheckAvailability } from "@/lib/actions/appointment/appointment";
import { toast } from "sonner";

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
  id?: string; // Add id as fallback
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

  // Set initial department
  useEffect(() => {
    if (departments.length > 0 && !filterDepartment) {
      const firstDept = departments[0];
      const deptId = firstDept._id || firstDept.id;

      if (deptId) {
        console.log(
          "Setting initial department:",
          firstDept.name,
          "with ID:",
          deptId,
        );
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
        console.log(
          "Setting selected department:",
          filterDepartment,
          "with ID:",
          deptId,
        );
        setSelectedDepartment({
          name: filterDepartment,
          id: deptId,
        });
      } else {
        console.error("No ID found for department:", filterDepartment);

        // Try to find the department in the original array as fallback
        const dept = departments.find((d) => d.name === filterDepartment);
        if (dept) {
          const fallbackId = dept._id || dept.id;
          if (fallbackId) {
            console.log("Found department ID using fallback:", fallbackId);
            setSelectedDepartment({
              name: dept.name,
              id: fallbackId,
            });
          }
        }
      }
    }
  }, [filterDepartment, departmentMap, departments]);

  // Check availability when department or date changes
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

            console.log(`Slot ${slot.display} availability:`, result);

            if (result.success && result.data) {
              availabilityMap[slot.display] = result.data.isAvailable === true;
            } else {
              console.warn(
                `Failed to check availability for slot ${slot.display}:`,
                result.message,
              );
              availabilityMap[slot.display] = slot.isAvailable;
            }
          } catch (slotError) {
            console.error(`Error checking slot ${slot.display}:`, slotError);
            availabilityMap[slot.display] = slot.isAvailable;
          }
        }

        setAvailabilityStatus(availabilityMap);
      } catch (error) {
        console.error("Error checking availability:", error);
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
        console.log("Setting default timeslot to:", availableTimeSlots[0]);
        setFilterTimeslot(availableTimeSlots[0]);
      }
    } else {
      setFilterTimeslot("");
    }
  }, [availableTimeSlots, filterTimeslot]);

  const departmentNames = departments.map((dept) => dept.name);

  const handleDepartmentChange = (deptName: string) => {
    console.log("Department changed to:", deptName);
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
    console.log("Book appointment clicked", {
      user: !!user,
      filterDepartment,
      filterTimeslot,
      selectedDepartment,
      filterDate,
      organizationId,
    });

    if (!user) {
      router.push(`/auth/login?redirect=/organization/${organizationId}`);
      return;
    }

    // Check if department is selected
    if (!filterDepartment) {
      toast.error("Please select a department");
      return;
    }

    // Check if timeslot is selected
    if (!filterTimeslot) {
      toast.error("Please select a time slot");
      return;
    }

    // Get department ID - either from selectedDepartment or from the map
    let departmentId = selectedDepartment?.id;

    if (!departmentId) {
      // Try to get it from the map as fallback
      departmentId = departmentMap.get(filterDepartment);
    }

    if (!departmentId) {
      console.error("No department ID found", {
        selectedDepartment,
        filterDepartment,
        departmentMap: Array.from(departmentMap.entries()),
      });

      // Last resort: try to find in original departments array
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
      // Final availability check before booking
      const availabilityCheck = await handleCheckAvailability({
        organizationId: organizationId!,
        date: filterDate.fullDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        departmentId: departmentId,
      });

      console.log("Final availability check:", availabilityCheck);

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

      // Create booking data object with proper structure
      const bookingData = {
        organizationId,
        organizationName,
        organizationType,
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

      console.log("Saving booking data:", bookingData);

      // Save to sessionStorage
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

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
                  (ID: {selectedDepartment.id.substring(0, 8)}...)
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
