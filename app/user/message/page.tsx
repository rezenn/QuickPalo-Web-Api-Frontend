// "use client";

// import { useState } from "react";
// import { useAuth } from "@/context/authContext";
// import ChatInterface from "@/app/_components/message";
// import OrganizationsList from "@/app/_components/OrganizationsList";

// export default function ChatPage() {
//   const { user, loading } = useAuth();
//   const [activeView, setActiveView] = useState<"chat" | "orgs">("chat");

//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (!user) return <div className="p-8 text-center">Please log in</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="container mx-auto px-4 py-12 max-w-7xl">
//         <div className="flex flex-wrap gap-4 mb-16 justify-center">
//           <button
//             onClick={() => setActiveView("chat")}
//             className={`px-12 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all duration-300 ${
//               activeView === "chat"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105"
//                 : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
//             }`}
//           >
//             📨 Direct Messages
//           </button>
//           <button
//             onClick={() => setActiveView("orgs")}
//             className={`px-12 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all duration-300 ${
//               activeView === "orgs"
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105"
//                 : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
//             }`}
//           >
//             🏥 Organizations
//           </button>
//         </div>

//         <div className="min-h-[600px]">
//           {activeView === "chat" && (
//             <ChatInterface
//               userId={user._id}
//               userName={user.fullName}
//               userImage={user.imageUrl}
//             />
//           )}
//           {activeView === "orgs" && <OrganizationsList />}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/context/authContext";
import ChatInterface from "@/app/_components/message";
import OrganizationsList from "@/app/_components/OrganizationsList";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[600px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<"chat" | "orgs">("chat");

  if (loading) return <LoadingFallback />;
  if (!user) return <div className="p-8 text-center">Please log in</div>;

  // Handle switching to chat view
  const handleSwitchToChat = () => {
    setActiveView("chat");
    // Optional: Add a small delay to ensure the chat component remounts
    setTimeout(() => {
      // You could also trigger a refresh of the chat list here
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white-50 py-1">
      <div className="container mx-auto px-2 py-4 max-w-7xl">
        <div className="flex flex-wrap gap-4 mb-2 justify-center">
          <button
            onClick={() => setActiveView("chat")}
            className={`px-4 py-2 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 ${
              activeView === "chat"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
            }`}
          >
            Direct Messages
          </button>
          <button
            onClick={() => setActiveView("orgs")}
            className={`px-4 py-2 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 ${
              activeView === "orgs"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
            }`}
          >
            Organizations
          </button>
        </div>

        <div className="min-h-[600px]">
          <Suspense fallback={<LoadingFallback />}>
            {activeView === "chat" ? (
              <ChatInterface
                userId={user._id}
                userName={user.fullName}
                userImage={user.imageUrl}
                key={activeView} // Force remount when switching views
              />
            ) : (
              <OrganizationsList />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
