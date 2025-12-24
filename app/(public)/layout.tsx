import Image from "next/image";
import authImage from "@/app/assets/images/authIllustration.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="min-h-screen w-screen"
      style={{
        background: `
          linear-gradient(
            to bottom,
            #BDDCFF 0%,
            #BCC2FB 13%,
            #BA7BF0 50%,
            #B846E8 78%,
            #B61BE1 100%
          )
        `,
      }}
    >
      <div className="grid min-h-screen md:grid-cols-2">
        {/* Left: Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src={authImage}
            alt="Authentication Illustration"
            width={600}
            height={600}
            priority
          />
        </div>

        {/* Right: Content */}
        <div className="flex items-center justify-center px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </section>
  );
}
