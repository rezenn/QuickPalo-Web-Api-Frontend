import Image from "next/image";
import authImage from "@/app/assets/images/authIllustration.png";

export default function Landing() {
  return (
    <div className="p-10 flex items-center justify-center">
      {/* Main div with fixed width and height */}
      <div className="w-[1040px] h-[500px] flex items-center justify-center bg-white/80 rounded-xl ">
        <div className=" grid min-h-[400px] md:grid-cols-[0.9fr_1fr] items-center gap-6 px-8 py-10">
          {/* Left: Illustration */}
          <div className="hidden md:flex  justify-center pr-4">
            <Image
              src={authImage}
              alt="Authentication Illustration"
              className="w-full max-w-125 h-auto"
              priority
            />
          </div>

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
