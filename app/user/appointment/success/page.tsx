// app/user/appointment/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AppointmentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Clear any leftover booking data
    sessionStorage.removeItem("bookingData");
  }, []);

  return (
    <div className="min-h-screen bg-white-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Confirmed!
          </h1>

          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. We've sent a
            confirmation email to your inbox.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Booking Reference:</span>
            </div>
            <p className="text-2xl font-mono font-bold text-gray-900">
              {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/user/appointments"
              className="block w-full bg-[#B61BE1] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300"
            >
              View My Appointments
            </Link>

            <Link
              href="/user/organizations"
              className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              Book Another Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
