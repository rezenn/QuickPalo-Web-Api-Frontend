import Image from "next/image";
import universityImage from "@/app/assets/images/universityFeatures.jpg";
import hospitalImage from "@/app/assets/images/hospitalFeatures.jpg";
import clinicImage from "@/app/assets/images/clinicsFeatures.jpg";
import corporateImage from "@/app/assets/images/corporateBuildingFeatures.jpg";

export default function Features() {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <h2 className="text-3xl  text-black/65 text-center">
        Everything You Need to Manage Appointments Seamlessly
      </h2>
      <p className="my-2 text-md text-center text-black/50">
        Built for clarity, reliability, and real-world workflows.
      </p>
      <div className="my-10 flex flex-wrap justify-center gap-8">
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden w-[220px] hover:scale-105 ">
          {/* Image */}
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl">
            <Image
              src={universityImage}
              alt="University image"
              className="object-contain rounded-2xl"
              width={200}
              height={120}
            />
          </div>

          {/* Text */}
          <div className="p-4 text-center">
            <h4 className="text-lg font-semibold text-black/80">
              Organization-Based Booking
            </h4>
            <p className="text-sm text-black/50 mt-1">University details</p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden w-[220px] hover:scale-105">
          {/* Image */}
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl">
            <Image
              src={hospitalImage}
              alt="Hospital image"
              className="object-contain rounded-2xl"
              width={200}
              height={120}
            />
          </div>

          {/* Text */}
          <div className="p-4 text-center">
            <h4 className="text-lg font-semibold text-black/80">
              Department & Time Slot Management
            </h4>
            <p className="text-sm text-black/50 mt-1">University details</p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden w-[220px] hover:scale-105">
          {/* Image */}
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl">
            <Image
              src={clinicImage}
              alt="Clinic image"
              className="object-contain rounded-2xl"
              width={200}
              height={120}
            />
          </div>

          {/* Text */}
          <div className="p-4 text-center">
            <h4 className="text-lg font-semibold text-black/80">
              Appointment History & Tracking
            </h4>
            <p className="text-sm text-black/50 mt-1">University details</p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden w-[220px] hover:scale-105">
          {/* Image */}
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-2xl">
            <Image
              src={corporateImage}
              alt="Corporate image"
              className="object-contain rounded-2xl"
              width={200}
              height={120}
            />
          </div>

          {/* Text */}
          <div className="p-4 text-center">
            <h4 className="text-lg font-semibold text-black/80">
              Real-Time Availability
            </h4>
            <p className="text-sm text-black/50 mt-1">University details</p>
          </div>
        </div>
      </div>
    </div>
  );
}
