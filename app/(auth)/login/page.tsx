import Image from "next/image";

import authImg from "@/app/assets/images/authIllustration.png";
export default function Login() {
  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center"
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
      <Image src={authImg} alt="img" width={200} height={200}></Image>
    </div>
  );
}
