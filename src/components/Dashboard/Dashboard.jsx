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
  Sparkles,
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

// ---------- EMPTY STATE ----------
const EmptyState = ({ icon: Icon, title, description, action, actionTo }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
      style={{ backgroundColor: "var(--color-primary-50)" }}
    >
      <Icon size={24} style={{ color: "var(--color-text-muted)" }} />
    </div>
    <p
      className="text-base font-semibold mb-1.5"
      style={{ color: "var(--color-text)" }}
    >
      {title}
    </p>
    <p
      className="text-sm mb-5 max-w-xs"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {description}
    </p>
    {action && (
      <Link
        to={actionTo}
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2"
        style={{
          color: "var(--color-primary)",
          "--tw-ring-color": "var(--color-primary)",
        }}
        aria-label={`${action} – ${description}`}
      >
        {action}
        <ArrowRight size={14} />
      </Link>
    )}
  </div>
);

// ---------- CUSTOM TOOLTIP ----------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl shadow-lg px-4 py-2.5"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: `1px solid var(--color-border)`,
        }}
      >
        <p
          className="text-xs font-medium mb-0.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-base font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          {payload[0].value}h
        </p>
      </div>
    );
  }
  return null;
};

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
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10 text-white shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          boxShadow: "0 10px 40px -10px rgba(var(--color-primary), 0.3)",
        }}
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(255,255,255,0.15), transparent 50%)",
          }}
        />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <Sparkles
                size={16}
                style={{ color: "var(--color-accent)" }}
                className="shrink-0"
              />
              <span className="text-sm font-medium text-white/70">{today}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {greeting()}, {displayName}
            </h1>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-white/80 max-w-xl">
              {subjects.length === 0
                ? "Create your first subject to start learning."
                : streak > 0
                  ? `You're on a ${streak}-day streak. Keep it going!`
                  : "Start a study session to build your streak."}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-8 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold">{subjects.length}</p>
              <p className="text-xs text-white/60 mt-1">Subjects</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div className="text-center">
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-xs text-white/60 mt-1">Day Streak</p>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div className="text-center">
              <p className="text-3xl font-bold">
                {overallProgress}
                <span className="text-lg">%</span>
              </p>
              <p className="text-xs text-white/60 mt-1">Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ QUICK ACTIONS ═══════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/subjects"
          aria-label="Create a new subject"
          className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <BookOpen size={22} />
            </div>
            <ArrowRight
              size={16}
              className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </div>
          <h3 className="text-sm sm:text-base font-bold mb-1">
            Create Subject
          </h3>
          <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
            Organize your lessons and build your knowledge base.
          </p>
          <span
            className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{
              color: "var(--color-accent)",
              backgroundColor: "rgba(245,166,35,0.2)",
            }}
          >
            Setup
          </span>
        </Link>

        {/* Standard quick action cards */}
        <Link
          to="/timer"
          aria-label="Start focus timer"
          className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: `1px solid var(--color-border)`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent), #f97316)",
              }}
            >
              <Timer size={22} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                color: "var(--color-accent)",
                backgroundColor: "rgba(245,166,35,0.1)",
              }}
            >
              Focus
            </span>
          </div>
          <h3
            className="text-sm sm:text-base font-bold mb-1"
            style={{ color: "var(--color-text)" }}
          >
            Start Timer
          </h3>
          <p
            className="text-[11px] sm:text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Start a focused countdown and keep your session on track.
          </p>
        </Link>

        <Link
          to="/quiz"
          aria-label="Take a quiz"
          className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: `1px solid var(--color-border)`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
              }}
            >
              <Brain size={22} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                color: "#8b5cf6",
                backgroundColor: "rgba(139,92,246,0.1)",
              }}
            >
              Challenge
            </span>
          </div>
          <h3
            className="text-sm sm:text-base font-bold mb-1"
            style={{ color: "var(--color-text)" }}
          >
            Take Quiz
          </h3>
          <p
            className="text-[11px] sm:text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Test your knowledge and track mastery.
          </p>
        </Link>

        <Link
          to="/planner"
          aria-label="Open study planner"
          className="group relative overflow-hidden rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: `1px solid var(--color-border)`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
              }}
            >
              <Calendar size={22} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                color: "#06b6d4",
                backgroundColor: "rgba(6,182,212,0.1)",
              }}
            >
              Plan
            </span>
          </div>
          <h3
            className="text-sm sm:text-base font-bold mb-1"
            style={{ color: "var(--color-text)" }}
          >
            View Planner
          </h3>
          <p
            className="text-[11px] sm:text-xs leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Schedule and manage your study sessions.
          </p>
        </Link>
      </div>

      {/* ═══════════════════ STAT CARDS ═══════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          icon={TrendingUp}
          color="var(--color-primary)"
          progress={overallProgress}
        />
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={BookOpen}
          color="var(--color-info)"
        />
        <StatCard
          title="Upcoming Exams"
          value={upcomingExams.length}
          icon={Clock}
          color="var(--color-accent)"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={CheckSquare}
          color="var(--color-danger)"
        />
      </div>

      {/* ═══════════════════ WEEKLY CHART ═══════════════════ */}
      <div
        className="rounded-2xl p-5 sm:p-7"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: `1px solid var(--color-border)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Weekly Progress
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Hours studied per day
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-50)" }}
          >
            <BarChart3 size={20} style={{ color: "var(--color-primary)" }} />
          </div>
        </div>
        {weeklyData.some((d) => d.hours > 0) ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary-light)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary-light)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="day"
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHours)"
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

      {/* ═══════════════════ SUBJECT PROGRESS ═══════════════════ */}
      <div
        className="rounded-2xl p-5 sm:p-7"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: `1px solid var(--color-border)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Subject Progress
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Your learning journey
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-50)" }}
          >
            <GraduationCap
              size={20}
              style={{ color: "var(--color-primary)" }}
            />
          </div>
        </div>
        {subjects.length > 0 ? (
          <div className="space-y-5">
            {subjects.map((subject) => {
              const progress = getSubjectProgress(subject.id);
              const barColors = [
                "var(--color-primary)",
                "var(--color-info)",
                "#8b5cf6",
                "var(--color-accent)",
                "var(--color-danger)",
              ];
              const barColor =
                barColors[subjects.indexOf(subject) % barColors.length];
              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {subject.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="w-full rounded-full h-2.5"
                    style={{ backgroundColor: "var(--color-border)" }}
                  >
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: barColor,
                      }}
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

      {/* ═══════════════════ RECENT ACTIVITY ═══════════════════ */}
      <div
        className="rounded-2xl p-5 sm:p-7"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: `1px solid var(--color-border)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Recent Activity
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Last 5 study sessions
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-50)" }}
          >
            <Clock size={20} style={{ color: "var(--color-text-muted)" }} />
          </div>
        </div>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const subject = subjects.find((s) => s.id === session.subjectId);
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors border border-transparent hover:border-[var(--color-border)]"
                  style={{ backgroundColor: "var(--color-bg-card)" }}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--color-text)" }}
                    >
                      {subject ? `Studied ${subject.name}` : "Study session"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {session.duration} min ·{" "}
                      {new Date(session.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1.5 rounded-lg shrink-0"
                    style={{
                      color: "var(--color-text-secondary)",
                      backgroundColor: "var(--color-border)",
                    }}
                  >
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

      {/* ═══════════════════ UPCOMING EXAMS ═══════════════════ */}
      <div
        className="rounded-2xl p-5 sm:p-7"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: `1px solid var(--color-border)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Upcoming Exams
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Stay prepared
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-50)" }}
          >
            <Calendar size={20} style={{ color: "var(--color-primary)" }} />
          </div>
        </div>
        {upcomingExams.length > 0 ? (
          <div className="space-y-3">
            {upcomingExams.slice(0, 5).map((exam) => {
              const examDate = new Date(exam.examDate);
              const today = new Date();
              const diffTime = examDate.getTime() - today.getTime();
              const daysUntil =
                diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
              let badgeStyle = {};
              if (daysUntil <= 7) {
                badgeStyle = {
                  color: "var(--color-danger)",
                  backgroundColor: "rgba(239,68,68,0.1)",
                };
              } else if (daysUntil <= 30) {
                badgeStyle = {
                  color: "var(--color-accent)",
                  backgroundColor: "rgba(245,166,35,0.1)",
                };
              } else {
                badgeStyle = {
                  color: "var(--color-success)",
                  backgroundColor: "rgba(16,185,129,0.1)",
                };
              }
              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 rounded-xl border transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg-card)",
                  }}
                >
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--color-text)" }}
                  >
                    {exam.name}
                  </span>
                  <span
                    className="text-sm font-bold px-3 py-1.5 rounded-lg shrink-0 ml-4"
                    style={badgeStyle}
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
            description="Add exams to stay on top"
            action="View Planner"
            actionTo="/planner"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
