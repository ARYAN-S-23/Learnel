import { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, Trash2, Calendar, Clock, BookOpen, X } from "lucide-react";
import useStore from "../../store/useStore";

const PlanModal = ({ isOpen, onClose, onSave, selectedDate, subjects }) => {
  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    startTime: "09:00",
    endTime: "10:00",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subjectId || !form.title) return;
    onSave({
      ...form,
      date: selectedDate,
      subject: subjects.find((s) => s.id === form.subjectId),
    });
    setForm({ subjectId: "", title: "", startTime: "09:00", endTime: "10:00" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-gray-900">Add Study Session</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Subject
            </label>
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. Review chapter 5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl font-medium text-sm bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl font-medium text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-all"
            >
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpcomingPlan = ({ plan, onDelete, subjects }) => {
  const subject = subjects.find((s) => s.id === plan.subjectId);
  const dateStr = new Date(plan.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
      <div
        className="w-2 h-2 rounded-full mt-2 shrink-0"
        style={{ backgroundColor: subject?.color || "#5b5fc7" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {plan.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{dateStr}</span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-400">
            {plan.startTime} - {plan.endTime}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(plan.id)}
        className="p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default function Planner() {
  const { studyPlans, addStudyPlan, deleteStudyPlan, subjects } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const upcomingPlans = useMemo(() => {
    const now = new Date();
    return studyPlans
      .filter((p) => new Date(p.date) >= new Date(now.toDateString()))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [studyPlans]);

  const calendarEvents = useMemo(() => {
    return studyPlans.map((p) => ({
      id: p.id,
      title: p.title,
      start: `${p.date}T${p.startTime || "09:00"}`,
      end: `${p.date}T${p.endTime || "10:00"}`,
      backgroundColor:
        subjects.find((s) => s.id === p.subjectId)?.color || "#5b5fc7",
      borderColor: "transparent",
      extendedProps: {
        subjectId: p.subjectId,
      },
    }));
  }, [studyPlans, subjects]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleSavePlan = (planData) => {
    addStudyPlan(planData);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Study Planner
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Schedule your study sessions
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-medium text-sm transition-all shadow-lg whitespace-nowrap hover:shadow-xl active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Session
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-6">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                dateClick={handleDateClick}
                height="auto"
                contentHeight={500}
                dayMaxEvents={3}
                buttonText={{
                  today: "Today",
                  month: "Month",
                  week: "Week",
                  day: "Day",
                }}
                buttonClass={{
                  today:
                    "!bg-indigo-50 !text-indigo-500 !border-[#d1d5f0] hover:!bg-[#dddef5]",
                  prev: "!text-gray-500 hover:!bg-gray-50",
                  next: "!text-gray-500 hover:!bg-gray-50",
                  dayGridMonth: "!text-gray-500 hover:!bg-gray-50",
                  timeGridWeek: "!text-gray-500 hover:!bg-gray-50",
                  timeGridDay: "!text-gray-500 hover:!bg-gray-50",
                }}
                headerToolbarClass="!border-b !border-border !pb-4 !mb-4"
                titleClass="!text-lg !font-semibold !text-gray-900"
                dayHeaderClass="!text-xs !font-medium !text-gray-300 !uppercase"
                dayCellClass="!border-border hover:!bg-gray-50"
                eventClass="!rounded-xl !text-xs !font-medium !px-2 !py-1"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                  <Calendar size={16} className="text-indigo-500" />
                </span>
                <h2 className="font-semibold text-gray-900">
                  Upcoming Sessions
                </h2>
              </div>
              {upcomingPlans.length > 0 ? (
                <div className="space-y-1">
                  {upcomingPlans.map((plan) => (
                    <UpcomingPlan
                      key={plan.id}
                      plan={plan}
                      onDelete={deleteStudyPlan}
                      subjects={subjects}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen size={32} className="text-indigo-300 mb-2" />
                  <p className="text-gray-400 text-sm">No upcoming sessions</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Click a day to add one
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                  <Clock size={16} className="text-amber-500" />
                </span>
                <h2 className="font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Sessions</span>
                  <span className="text-sm font-medium text-gray-900">
                    {studyPlans.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">This Week</span>
                  <span className="text-sm font-medium text-gray-900">
                    {
                      studyPlans.filter((p) => {
                        const d = new Date(p.date);
                        const now = new Date();
                        const weekStart = new Date(now);
                        weekStart.setDate(now.getDate() - now.getDay());
                        weekStart.setHours(0, 0, 0, 0);
                        return d >= weekStart;
                      }).length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Subjects</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Set(studyPlans.map((p) => p.subjectId)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        selectedDate={selectedDate}
        subjects={subjects}
      />
    </div>
  );
}
