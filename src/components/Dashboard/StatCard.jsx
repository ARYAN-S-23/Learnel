import React from "react";

const StatCard = ({ title, value, icon: Icon, color, trend, progress }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#eef1f6] p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={16} className="sm:hidden text-white" />
        <Icon size={20} className="hidden sm:block text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <p className="text-base sm:text-xl font-bold text-[#1a1d26] tracking-tight">
            {value}
          </p>
          {trend && (
            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#636e72] mt-0.5 truncate">
          {title}
        </p>
      </div>
      {typeof progress === "number" && (
        <div className="w-10 sm:w-16 shrink-0">
          <div className="w-full bg-[#f0f1f5] rounded-full h-1 sm:h-1.5">
            <div
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${color}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
