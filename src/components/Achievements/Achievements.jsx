import React from "react";
import useStore from "../../store/useStore";
import {
  Trophy,
  Lock,
  Star,
  Flame,
  Clock,
  Target,
  CheckCircle2,
  Award,
  Medal,
  Footprints,
  Zap,
  BookOpen,
  Pencil,
} from "lucide-react";

const iconMap = {
  footprints: Footprints,
  flame: Flame,
  trophy: Trophy,
  "book-open": BookOpen,
  target: Target,
  zap: Zap,
  star: Star,
  award: Award,
  medal: Medal,
  pencil: Pencil,
};

const Achievements = () => {
  const { achievements } = useStore();

  const unlocked = (achievements || []).filter((a) => a.unlocked);
  const locked = (achievements || []).filter((a) => !a.unlocked);
  const progressPercent =
    (achievements || []).length > 0
      ? Math.round((unlocked.length / achievements.length) * 100)
      : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Trophy size={20} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Achievements
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {unlocked.length}/{(achievements || []).length} Unlocked
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#eef1f6] mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-700 font-medium text-sm">
              Overall Progress
            </span>
            <span className="text-[#5b5fc7] font-semibold text-sm">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-[#f0f2f8] rounded-full h-2.5">
            <div
              className="bg-[#5b5fc7] h-2.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {unlocked.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Unlocked
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unlocked.map((ach) => {
                const Icon = iconMap[ach.icon] || Award;
                return (
                  <div
                    key={ach.id}
                    className="bg-white rounded-2xl p-5 border border-[#eef1f6] hover:shadow-md transition-all text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                      <Icon size={26} className="text-[#5b5fc7]" />
                    </div>
                    <h3 className="text-slate-800 font-semibold text-sm mb-1">
                      {ach.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {ach.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                      <Clock size={11} />
                      {formatDate(ach.unlockedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {locked.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Lock size={16} /> Locked
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {locked.map((ach) => {
                const Icon = iconMap[ach.icon] || Award;
                return (
                  <div
                    key={ach.id}
                    className="bg-white rounded-2xl p-5 border border-[#eef1f6] opacity-50 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#f0f2f8] flex items-center justify-center mx-auto mb-3">
                      <Icon size={26} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-500 font-semibold text-sm mb-1">
                      {ach.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {ach.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-[#f0f2f8] px-2.5 py-1 rounded-full">
                      <Lock size={10} /> Locked
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
