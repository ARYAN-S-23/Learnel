import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import useStore from "../../store/useStore";

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }) => (
  <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      {trend !== undefined && (
        <div
          className={`flex items-center gap-0.5 text-xs font-medium ${trendUp ? "text-emerald-500" : "text-red-500"}`}
        >
          {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {trend}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

const SubjectBar = ({ name, progress, isWeak }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-24 truncate text-sm text-gray-400">{name}</div>
    <div className="flex-1 h-2.5 bg-gray-50 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${isWeak ? (progress < 30 ? "bg-red-400" : "bg-amber-400") : "bg-emerald-400"}`}
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 w-10 text-right">
      {progress}%
    </span>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-bg-card border border-border rounded-xl shadow-sm px-3 py-2">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-indigo-500">{payload[0].value} hours</p>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <BarChart3 size={40} className="text-gray-300 mb-3" />
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

export default function Analytics() {
  const { studySessions, topics } = useStore();

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalHours =
      studySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

    const weeklyHours =
      studySessions
        .filter((s) => new Date(s.date) >= weekStart)
        .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

    const monthlyHours =
      studySessions
        .filter((s) => new Date(s.date) >= monthStart)
        .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

    const avgProgress =
      topics.length > 0
        ? Math.round(
            topics.reduce((sum, t) => sum + (t.progress || 0), 0) /
              topics.length,
          )
        : 0;

    return { totalHours, weeklyHours, monthlyHours, avgProgress };
  }, [studySessions, topics]);

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return days.map((day, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dayStr = date.toISOString().split("T")[0];
      const hours =
        studySessions
          .filter((s) => s.date === dayStr)
          .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
      return { day, hours: Number(hours.toFixed(1)) };
    });
  }, [studySessions]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();

    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const hours =
        studySessions
          .filter((s) => s.date?.startsWith(monthStr))
          .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
      return {
        month: months[date.getMonth()],
        hours: Number(hours.toFixed(1)),
      };
    });
  }, [studySessions]);

  const subjectProgress = useMemo(() => {
    return topics
      .map((t) => ({ name: t.name, progress: t.progress || 0 }))
      .sort((a, b) => b.progress - a.progress);
  }, [topics]);

  const strongSubjects = subjectProgress.filter((s) => s.progress >= 50);
  const weakSubjects = subjectProgress.filter((s) => s.progress < 50);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Clock}
            label="Total Hours"
            value={stats.totalHours.toFixed(1)}
            color="bg-indigo-400"
          />
          <StatCard
            icon={Calendar}
            label="Weekly Hours"
            value={stats.weeklyHours.toFixed(1)}
            trend={12}
            trendUp={true}
            color="bg-emerald-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Monthly Hours"
            value={stats.monthlyHours.toFixed(1)}
            trend={8}
            trendUp={true}
            color="bg-amber-400"
          />
          <StatCard
            icon={Target}
            label="Avg Progress"
            value={`${stats.avgProgress}%`}
            color="bg-rose-400"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={18} className="text-indigo-500" />
                <h2 className="font-semibold text-gray-900">
                  Study Hours This Week
                </h2>
              </div>
              {studySessions.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weeklyData} barSize={32}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f2f8"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hours" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No study data yet" />
              )}
            </div>

            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-indigo-500" />
                <h2 className="font-semibold text-gray-900">Monthly Trend</h2>
              </div>
              {studySessions.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#a78bfa"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#a78bfa"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f2f8"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      fill="url(#gradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No trend data yet" />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-emerald-500" />
                <h2 className="font-semibold text-gray-900">Strong Subjects</h2>
              </div>
              {strongSubjects.length > 0 ? (
                <div className="space-y-1">
                  {strongSubjects.map((s) => (
                    <SubjectBar
                      key={s.name}
                      name={s.name}
                      progress={s.progress}
                      isWeak={false}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No strong subjects yet" />
              )}
            </div>

            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-amber-500" />
                <h2 className="font-semibold text-gray-900">
                  Needs Improvement
                </h2>
              </div>
              {weakSubjects.length > 0 ? (
                <div className="space-y-1">
                  {weakSubjects.map((s) => (
                    <SubjectBar
                      key={s.name}
                      name={s.name}
                      progress={s.progress}
                      isWeak={true}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="All subjects are on track" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
