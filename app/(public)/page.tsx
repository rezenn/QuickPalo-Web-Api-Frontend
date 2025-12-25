import Image from "next/image";
import authImage from "@/app/assets/images/authIllustration.png";

export default function Landing() {
  return (
    <div className="p-10 flex items-center justify-center">
      {/* Main div with fixed width and height */}
      <div className="w-full max-w-[1040px] flex items-center justify-center bg-white/80 rounded-xl overflow-hidden">
        <div className=" grid min-h-[400px] md:grid-cols-[0.9fr_0.1fr_1fr] items-center gap-6 px-8 py-10">
          {/* Left: Illustration */}
          <div className="hidden md:flex  justify-center">
            <Image
              src={authImage}
              alt="Authentication Illustration"
              className="w-full max-w-[500px] h-auto"
              priority
            />
          </div>

          {/* Vertical line */}
          <div className="hidden md:block w-[1px] bg-gray-400 h-full mx-4"></div>

          {/* Right: Content */}
          <div className="flex flex-col gap-4">
            <p className="text-5xl font-bold text-black/80 ">
              Welcome to <span className="text-purple-700">QuickPalo</span>,
            </p>
            <p className="text-5xl text-black/80 font-bold">
              &nbsp;&nbsp;Where Booking
            </p>
            <p className="text-5xl text-black/80 font-bold">
              &nbsp;&nbsp;&nbsp;&nbsp;Meets Efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
