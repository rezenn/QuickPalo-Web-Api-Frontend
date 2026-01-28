// "use client";

// import Image from "next/image";
// import logo from "@/app/assets/images/quickpalo_logo.png";
// import { Search, BellDot, User } from "lucide-react";
// import { useAuth } from "@/context/authContext";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Header() {
//   const { user, loading } = useAuth();
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     setImageError(false);
//   }, [user]);

//   if (loading) return null;
//   const getProfileImageUrl = () => {
//     if (!user) return null;

//     // Check imageUrl first
//     if (user.imageUrl) {
//       return user.imageUrl;
//     }

//     if (user.profilePicture) {
//       return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/uploads/profile/${user.profilePicture}`;
//     }

//     return null;
//   };

//   const profileImageUrl = getProfileImageUrl();

//   return (
//     <section>
//       <div className="ml-13 md:mx-auto max-w-screen-2xl px-4 py-4">
//         <header className="flex items-center gap-4 md:justify-between">
//           <div className="flex items-center gap-2">
//             <Link href="/user/dashboard">
//               <Image
//                 src={logo}
//                 alt="logo"
//                 className="w-[230px] h-auto rounded-bl-2xl rounded-tr-2xl "
//                 priority
//               />
//             </Link>

//             <div className="hidden sm:flex flex-col px-4 leading-tight">
//               <span className="text-fuchsia-700 text-sm md:text-lg">
//                 Hello,
//               </span>

//               <span
//                 className="
//       font-extrabold
//       text-lg md:text-2xl
//       max-w-[200px]
//       truncate
//     "
//                 style={{ textTransform: "capitalize" }}
//                 title={user?.fullName}
//               >
//                 {user?.fullName || "User"}
//               </span>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative flex-1 max-w-[250px] sm:max-w-xs md:max-w-md lg:max-w-3xl">
//             <input
//               type="search"
//               placeholder="Search organization..."
//               className="w-full h-12 rounded-xl border border-black/20 bg-white px-4 pr-11 text-black placeholder:text-black/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition"
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-purple-700 transition"
//             >
//               <Search />
//             </button>
//           </div>

//           {/* Icons */}
//           <div className="flex gap-4">
//             <button className="text-gray-600 hover:text-purple-700 transition">
//               <BellDot size={24} />
//             </button>

//             <div className="relative h-12 w-12">
//               <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-fuchsia-400 hover:border-purple-600 transition-colors">
//                 <Link href="/user/profile">
//                   {" "}
//                   {profileImageUrl && !imageError ? (
//                     <Image
//                       src={profileImageUrl}
//                       alt="Profile"
//                       fill
//                       className="object-cover"
//                       unoptimized
//                       onError={() => {
//                         console.error(
//                           "Header image failed to load:",
//                           profileImageUrl,
//                         );
//                         setImageError(true);
//                       }}
//                       sizes="48px"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-100 to-pink-100">
//                       <User className="text-purple-500" size={24} />
//                     </div>
//                   )}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="mt-3 h-px w-full bg-gray-400" />
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import logo from "@/app/assets/images/quickpalo_logo.png";
import { Search, BellDot, User } from "lucide-react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, loading } = useAuth();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user]);

  if (loading) return null;
  const getProfileImageUrl = () => {
    if (!user) return null;

    // Check imageUrl first
    if (user.imageUrl) {
      return user.imageUrl;
    }

    if (user.profilePicture) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/uploads/profile/${user.profilePicture}`;
    }

    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <section className="ml-15 md:ml-0 transition-margin duration-300">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <header className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section - Greeting and Name */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink">
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-fuchsia-700 text-lg sm:text-sm md:text-lg whitespace-nowrap">
                Hello,
              </span>
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="font-extrabold text-md sm:text-base md:text-2xl truncate min-w-0 max-w-[200px]"
                  style={{ textTransform: "capitalize" }}
                  title={user?.fullName}
                >
                  {user?.fullName || "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section - Search */}
          <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[300px] md:max-w-md lg:max-w-2xl mx-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-full h-10 sm:h-12 rounded-xl border border-black/20 bg-white px-3 sm:px-4 pr-10 text-sm sm:text-base text-black placeholder:text-black/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition"
              />
              <button
                type="button"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-purple-700 transition"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="text-gray-600 hover:text-purple-700 transition p-1">
              <BellDot size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="relative">
              <div className="relative h-12 w-12 sm:h-15 sm:w-15 rounded-full overflow-hidden border-2 border-fuchsia-400 hover:border-purple-600 transition-colors">
                <Link href="/user/profile">
                  {profileImageUrl && !imageError ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => setImageError(true)}
                      sizes="(max-width: 640px) 36px, 48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <User className="text-purple-500" size={18} />
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* <div className="mt-3 h-px w-full bg-gray-400" /> */}
      </div>
    </section>
  );
}
