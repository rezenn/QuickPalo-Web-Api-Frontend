import Header from "./_component/Header";
import SideNavigation from "./_component/SideNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`min-h-screen w-screen bg-white/90 text-gray-800 flex flex-col `}
    >
      {/* Header */}
      <Header />
      {/* Sidebar and content */}
      <div className="flex flex-1">
        {/* sidebar */}
        <SideNavigation />
        <div className=" md:block w-px bg-gray-400"></div>

        {/* main content */}
        <main className=" flex-1 px-6 ">{children}</main>
      </div>
    </section>
  );
}
