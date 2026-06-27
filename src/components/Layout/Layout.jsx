import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f2f8] text-[#1e293b]">
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuToggle={() => setIsOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1640px] px-5 md:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
