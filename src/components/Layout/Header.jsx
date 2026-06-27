import { Search, Bell, Flame, Menu, Command, Sun, Moon } from "lucide-react";
import useStore from "../../store/useStore";

export default function Header({ onMenuToggle }) {
  const { streak, userName, setSearchOpen, darkMode, toggleDarkMode } =
    useStore();

  const avatarInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const displayName = userName || "Student";

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-bg-card border-b border-border">
      <div className="relative max-w-[1640px] mx-auto w-full h-16">
        <div className="flex items-center justify-between h-16 px-5 md:px-7">
          <button
            onClick={onMenuToggle}
            className="p-2.5 rounded-xl hover:bg-bg text-gray-400 transition-all duration-150 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3 mr-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <Flame size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {streak}
              </span>
              <span className="text-xs font-medium text-amber-400 dark:text-amber-500">
                days
              </span>
            </div>

            <button className="relative p-2.5 rounded-xl hover:bg-bg text-gray-400 transition-all duration-150">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-bg text-gray-400 transition-all duration-150"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-2 pl-1 border-l border-border">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                {avatarInitial}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute inset-x-0 top-0 h-16 items-center justify-center pointer-events-none">
          <div className="w-full max-w-[320px] px-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl bg-[#f5f6fa] dark:bg-white/10 text-base text-gray-400 hover:bg-[#eef0f6] dark:hover:bg-white/15 transition-all duration-150 border border-transparent hover:border-[#e4e6ee] dark:hover:border-white/20"
            >
              <Search size={18} className="text-[#b0b8c9] dark:text-gray-400" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-[#b0b8c9] dark:text-white/40 bg-white dark:bg-bg-card rounded-lg border border-[#e4e6ee] dark:border-white/10">
                <Command size={11} />K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
