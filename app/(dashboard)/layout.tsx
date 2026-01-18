import Header from "./_component/Header";
import SideNavigation from "./_component/SideNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`h-screen w-screen bg-white text-gray-800 flex flex-col `}
    >
      {/* Header */}
      <Header />
      {/* Sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <SideNavigation />
        <div className=" w-px bg-gray-400"></div>

        {/* main content */}
        <main className=" flex-1 px-2 overflow-y-auto custom-scroll ">
          {children}
        </main>
      </div>
    </section>
  );
}
