import React from "react";

const StatCard = ({ title, value, icon: Icon, gradient, progress }) => {
  return (
    <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="mb-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${gradient}`}
        >
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-[1.6rem] font-extrabold text-gray-900 tracking-tight leading-none tabular-nums">
        {value}
      </p>
      <p className="text-[11px] font-medium text-gray-400 mt-1.5">{title}</p>
      {typeof progress === "number" && (
        <div className="mt-3.5">
          <div className="w-full bg-gray-100 rounded-full h-[3px]">
            <div
              className={`h-[3px] rounded-full transition-all duration-700 ${gradient}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
