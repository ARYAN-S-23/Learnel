import { NavLink, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Network,
  BarChart3,
  Brain,
  Target,
  FolderOpen,
  Trophy,
  Timer,
  RefreshCw,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "bg-indigo-50 text-indigo-500",
  },
  {
    to: "/subjects",
    label: "Subjects",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-500",
  },
  {
    to: "/planner",
    label: "Planner",
    icon: Calendar,
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    to: "/timer",
    label: "Timer",
    icon: Timer,
    color: "bg-amber-50 text-amber-500",
  },
  {
    to: "/knowledge-graph",
    label: "Knowledge Graph",
    icon: Network,
    color: "bg-purple-50 text-purple-500",
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "bg-pink-50 text-pink-500",
  },
  {
    to: "/quiz",
    label: "Quiz",
    icon: Brain,
    color: "bg-cyan-50 text-cyan-500",
  },
  {
    to: "/goals",
    label: "Goals",
    icon: Target,
    color: "bg-rose-50 text-rose-500",
  },
  {
    to: "/revision",
    label: "Revision",
    icon: RefreshCw,
    color: "bg-teal-50 text-teal-500",
  },
  {
    to: "/weak-topics",
    label: "Weak Topics",
    icon: AlertTriangle,
    color: "bg-orange-50 text-orange-500",
  },
  {
    to: "/resources",
    label: "Resources",
    icon: FolderOpen,
    color: "bg-violet-50 text-violet-500",
  },
  {
    to: "/achievements",
    label: "Achievements",
    icon: Trophy,
    color: "bg-yellow-50 text-yellow-600",
  },
];

export default function Sidebar({ collapsed, onCollapse, isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-[#eef1f6] z-50 flex flex-col transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? "lg:w-[72px]" : "lg:w-64"}
          w-64
        `}
      >
        {/* Logo */}
        <div
          className={`border-b border-[#eef1f6] ${collapsed ? "px-2 py-4" : "px-5 py-5"}`}
        >
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-[#1e293b] leading-tight">
                    Learning OS
                  </h1>
                  <p className="text-xs text-[#94a3b8]">Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => onCollapse(!collapsed)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#f0f2f8] text-[#94a3b8] transition-all duration-150"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => onCollapse(false)}
            className="hidden lg:flex items-center justify-center py-2 border-b border-[#eef1f6] text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f8f9fd] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {navItems.map(({ to, label, icon: Icon, color }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => window.innerWidth < 1024 && onClose?.()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-[#475569] hover:bg-[#f8f9fd] hover:text-[#1e293b]"
                  }
                `}
                title={collapsed ? label : undefined}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
                >
                  <Icon size={17} />
                </div>
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div
          className={`border-t border-[#eef1f6] ${collapsed ? "px-2 py-3" : "px-3 py-4"}`}
        >
          <NavLink
            to="/settings"
            onClick={() => window.innerWidth < 1024 && onClose?.()}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-[#f8f9fd] hover:text-[#1e293b] transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Settings" : undefined}
          >
            <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400">
              <Settings size={17} />
            </div>
            {!collapsed && <span>Settings</span>}
          </NavLink>
          {!collapsed && (
            <p className="text-center text-[11px] text-[#c5c7d4] mt-2">
              Learning OS v1.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
