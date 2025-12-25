import Image from "next/image";
import logo from "@/app/assets/images/quickpalo_logo.png";
import authImage from "@/app/assets/images/authIllustration.png";
import localFont from "next/font/local";

const poppins = localFont({
  src: [{ path: "../assets/fonts/Poppins/Poppins-Bold.woff2", weight: "700" }],
  variable: "--font-poppins",
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`min-h-screen w-screen flex items-center justify-center ${poppins.className} font-poppins `}
      style={{
        background: `linear-gradient(
          to bottom,
          #BDDCFF 0%,
          #BCC2FB 13%,
          #BA7BF0 50%,
          #B846E8 78%,
          #B61BE1 100%
        )`,
      }}
    >
      <div className="p-6 flex items-center justify-center w-full">
        {/* Responsive card */}
        <div className="w-full max-w-[1040px] flex items-center justify-center bg-white/80 rounded-xl overflow-hidden">
          <div className="grid min-h-[400px] md:grid-cols-[0.9fr_0.1fr_1fr] items-center gap-6 px-6 py-8 w-full">
            {/* Left: Illustration */}
            <div className="hidden md:flex justify-center">
              <Image
                src={authImage}
                alt="Authentication Illustration"
                className="w-full max-w-[450px] h-auto object-contain"
                priority
              />
            </div>

            {/* Vertical line */}
            <div className="hidden md:block w-[1px] bg-gray-400 h-full mx-2"></div>

            {/* Right: Content */}
            <div className="flex flex-col justify-center items-center gap-4">
              <Image
                src={logo}
                alt="logo"
                className="w-[150px] h-auto rounded-bl-2xl rounded-tr-2xl"
              />
              <div className={`${poppins.variable}`}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
