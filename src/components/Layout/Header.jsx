import { Search, Bell, Flame, Menu, Command } from "lucide-react";
import useStore from "../../store/useStore";

export default function Header({ onMenuToggle }) {
  const { streak, userName, setSearchOpen } = useStore();

  const avatarInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const displayName = userName || "Student";

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-[#eef1f6]">
      <div className="relative max-w-[1640px] mx-auto w-full h-16">
        <div className="flex items-center justify-between h-16 px-5 md:px-7">
          <button
            onClick={onMenuToggle}
            className="p-2.5 rounded-xl hover:bg-[#f0f2f8] text-[#64748b] transition-all duration-150 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3 mr-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
              <Flame size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{streak}</span>
              <span className="text-xs font-medium text-amber-400">days</span>
            </div>

            <button className="relative p-2.5 rounded-xl hover:bg-[#f0f2f8] text-[#64748b] transition-all duration-150">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 pl-1 border-l border-[#eef1f6]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                {avatarInitial}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#1e293b] leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-[#94a3b8]">Student</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute inset-x-0 top-0 h-16 items-center justify-center pointer-events-none">
          <div className="w-full max-w-[320px] px-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl bg-[#f5f6fa] text-base text-[#94a3b8] hover:bg-[#eef0f6] transition-all duration-150 border border-transparent hover:border-[#e4e6ee]"
            >
              <Search size={18} className="text-[#b0b8c9]" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-[#b0b8c9] bg-white rounded-lg border border-[#e4e6ee]">
                <Command size={11} />K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
