import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import {
  BarChart3,
  BookOpen,
  Clock,
  CheckSquare,
  Calendar,
  TrendingUp,
  Timer,
  Brain,
  ArrowRight,
  GraduationCap,
  Flame,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "./StatCard";

// ─── Empty State ──────────────────────────────────
const EmptyState = ({ icon: Icon, title, description, action, actionTo }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3">
      <Icon size={15} className="text-gray-300" />
    </div>
    <p className="text-[13px] font-semibold text-gray-600 mb-1">{title}</p>
    <p className="text-[11px] text-gray-400 mb-4 max-w-[200px] leading-relaxed">
      {description}
    </p>
    {action && (
      <Link
        to={actionTo}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none rounded"
        aria-label={action}
      >
        {action} <ArrowRight size={11} />
      </Link>
    )}
  </div>
);

// ─── Custom Chart Tooltip ─────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111118] text-white rounded-xl shadow-xl px-3.5 py-2.5">
        <p className="text-[10px] font-medium text-white/50 mb-0.5">{label}</p>
        <p className="text-sm font-bold">{payload[0].value}h</p>
      </div>
    );
  }
  return null;
};

// ─── Section Header ───────────────────────────────
const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  iconBg,
  action,
  actionTo,
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={13} className="text-white" />
      </div>
      <div>
        <h2 className="text-[13px] font-bold text-gray-900 leading-none">
          {title}
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
    {action && (
      <Link
        to={actionTo}
        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 transition-colors focus:outline-none rounded"
      >
        {action} <ChevronRight size={11} />
      </Link>
    )}
  </div>
);

// ─── Dashboard ────────────────────────────────────
const Dashboard = () => {
  const {
    subjects,
    streak,
    studySessions,
    userName,
    getOverallProgress,
    getUpcomingExams,
    getPendingTasks,
    getWeeklyChartData,
    getSubjectProgress,
  } = useStore();

  const overallProgress = getOverallProgress();
  const upcomingExams = getUpcomingExams();
  const pendingTasks = getPendingTasks();
  const weeklyData = getWeeklyChartData();
  const displayName = userName || "Student";

  const recentSessions = [...studySessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const subjectPalette = [
    { bar: "bg-indigo-500", chip: "text-indigo-600 bg-indigo-50" },
    { bar: "bg-blue-500", chip: "text-blue-600 bg-blue-50" },
    { bar: "bg-violet-500", chip: "text-violet-600 bg-violet-50" },
    { bar: "bg-amber-500", chip: "text-amber-600 bg-amber-50" },
    { bar: "bg-rose-500", chip: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* ══════════════════ HERO ══════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111118] px-6 py-7 sm:px-8 sm:py-8 text-white">
        {/* ambient glows */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* greeting */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-white/30 uppercase mb-2">
              {today}
            </p>
            <h1 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">
              {greeting()},&nbsp;
              <span className="text-indigo-300">{displayName}</span>
            </h1>
            <p className="mt-2 text-sm text-white/40 max-w-xs leading-relaxed">
              {subjects.length === 0
                ? "Create your first subject to start learning."
                : streak > 0
                  ? `You're on a ${streak}-day streak. Keep it going!`
                  : "Start a study session to build your streak."}
            </p>
          </div>

          {/* stat chips */}
          <div className="flex items-stretch gap-2 shrink-0">
            {[
              {
                icon: BookOpen,
                color: "text-indigo-300",
                label: "Subjects",
                value: subjects.length,
              },
              {
                icon: Flame,
                color: "text-amber-300",
                label: "Streak",
                value: streak,
              },
              {
                icon: TrendingUp,
                color: "text-emerald-300",
                label: "Progress",
                value: `${overallProgress}%`,
              },
            ].map(({ icon: Ic, color, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center bg-white/[0.055] border border-white/[0.08] rounded-xl px-3.5 py-3 min-w-[62px]"
              >
                <Ic size={13} className={`${color} mb-1.5`} />
                <p className="text-[1.1rem] font-bold leading-none tabular-nums">
                  {value}
                </p>
                <p className="text-[9px] text-white/30 mt-1 font-semibold tracking-wide uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ QUICK ACTIONS ══════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Featured */}
        <Link
          to="/subjects"
          aria-label="Go to Subjects"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen size={15} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 bg-white/10 px-1.5 py-0.5 rounded-full">
              Setup
            </span>
          </div>
          <p className="text-[13px] font-bold">Subjects</p>
          <p className="text-[11px] text-white/55 mt-0.5">
            Manage your courses
          </p>
        </Link>

        <Link
          to="/timer"
          aria-label="Open Timer"
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-bg-card border border-border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Timer size={15} className="text-white" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
              Focus
            </span>
          </div>
          <p className="text-[13px] font-bold text-gray-900">Timer</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Start a study session
          </p>
        </Link>

        <Link
          to="/quiz"
          aria-label="Open Quiz"
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-bg-card border border-border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm">
              <Brain size={15} className="text-white" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full">
              Test
            </span>
          </div>
          <p className="text-[13px] font-bold text-gray-900">Quiz</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Test your knowledge
          </p>
        </Link>

        <Link
          to="/planner"
          aria-label="Open Planner"
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-bg-card border border-border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-sm">
              <Calendar size={15} className="text-white" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-full">
              Plan
            </span>
          </div>
          <p className="text-[13px] font-bold text-gray-900">Planner</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Schedule sessions</p>
        </Link>
      </div>

      {/* ══════════════════ STAT CARDS ══════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-indigo-500 to-violet-500"
          progress={overallProgress}
        />
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          icon={Calendar}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={CheckSquare}
          gradient="bg-gradient-to-br from-rose-500 to-pink-500"
        />
      </div>

      {/* ══════════════════ CHART + SUBJECT PROGRESS ══════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Weekly Chart — 3 / 5 */}
        <div className="lg:col-span-3 bg-white dark:bg-bg-card rounded-2xl border border-border p-5 sm:p-6">
          <SectionHeader
            title="Weekly Progress"
            subtitle="Hours studied per day"
            icon={BarChart3}
            iconBg="bg-indigo-500"
          />
          {weeklyData.some((d) => d.hours > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={weeklyData}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f1f5"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="transparent"
                  fontSize={11}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  stroke="transparent"
                  fontSize={11}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#6366f1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#6366f1",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No study data yet"
              description="Start a session to see your weekly progress"
              action="Start Timer"
              actionTo="/timer"
            />
          )}
        </div>

        {/* Subject Progress — 2 / 5 */}
        <div className="lg:col-span-2 bg-white dark:bg-bg-card rounded-2xl border border-border p-5 sm:p-6">
          <SectionHeader
            title="Subject Progress"
            subtitle="Your learning journey"
            icon={GraduationCap}
            iconBg="bg-violet-500"
            action="All subjects"
            actionTo="/subjects"
          />
          {subjects.length > 0 ? (
            <div className="space-y-4">
              {subjects.slice(0, 5).map((subject, i) => {
                const progress = getSubjectProgress(subject.id);
                const p = subjectPalette[i % subjectPalette.length];
                return (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-gray-700 truncate max-w-[120px]">
                        {subject.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-2 shrink-0 tabular-nums ${p.chip}`}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-[3px]">
                      <div
                        className={`h-[3px] rounded-full transition-all duration-700 ${p.bar}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No subjects yet"
              description="Add your first subject to start tracking progress"
              action="Create Subject"
              actionTo="/subjects"
            />
          )}
        </div>
      </div>

      {/* ══════════════════ ACTIVITY + EXAMS ══════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-5 sm:p-6">
          <SectionHeader
            title="Recent Activity"
            subtitle="Last 5 study sessions"
            icon={Clock}
            iconBg="bg-slate-600"
          />
          {recentSessions.length > 0 ? (
            <div className="space-y-1">
              {recentSessions.map((session) => {
                const subject = subjects.find(
                  (s) => s.id === session.subjectId,
                );
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                      <Clock size={12} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-800 truncate">
                        {subject ? subject.name : "Study session"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-text-secondary bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-2 py-1 rounded-lg shrink-0 tabular-nums">
                      {session.duration}m
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No activity yet"
              description="Your recent study sessions will appear here"
              action="Start studying"
              actionTo="/timer"
            />
          )}
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-5 sm:p-6">
          <SectionHeader
            title="Upcoming Exams"
            subtitle="Stay prepared"
            icon={Calendar}
            iconBg="bg-rose-500"
            action="View all"
            actionTo="/planner"
          />
          {upcomingExams.length > 0 ? (
            <div className="space-y-1">
              {upcomingExams.slice(0, 5).map((exam) => {
                const examDate = new Date(exam.examDate);
                const now = new Date();
                const diffMs = examDate.getTime() - now.getTime();
                const daysUntil =
                  diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
                const urgency =
                  daysUntil <= 7
                    ? { chip: "bg-rose-50 text-rose-600", dot: "bg-rose-400" }
                    : daysUntil <= 30
                      ? {
                          chip: "bg-amber-50 text-amber-600",
                          dot: "bg-amber-400",
                        }
                      : {
                          chip: "bg-emerald-50 text-emerald-600",
                          dot: "bg-emerald-400",
                        };
                return (
                  <div
                    key={exam.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${urgency.dot}`}
                    />
                    <span className="text-[12px] font-semibold text-gray-800 flex-1 truncate">
                      {exam.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums ${urgency.chip}`}
                    >
                      {daysUntil}d left
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No exams scheduled"
              description="Add exams to stay on top of your studies"
              action="View Planner"
              actionTo="/planner"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
