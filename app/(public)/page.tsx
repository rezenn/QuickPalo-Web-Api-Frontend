import Image from "next/image";
import authImage from "@/app/assets/images/authIllustration.png";
import Hero from "./_components/Hero";
import CredibilitySection from "./_components/CredibilitySection";
import Features from "./_components/Features";

export default function Landing() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <CredibilitySection />
      <Features />
      {/* <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#60a5fa" // background wave color
          d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,122.7C672,107,768,85,864,101.3C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg> */}
    </div>
  );
}
