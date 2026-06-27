import React, { useState } from "react";
import useStore from "../../store/useStore";
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
} from "lucide-react";

const Goals = () => {
  const {
    goals,
    subjects,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoal,
    toggleSubGoal,
  } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    deadline: "",
    subjectIds: [],
    subGoals: [],
  });
  const [subGoalInput, setSubGoalInput] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const getSubjectName = (id) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  const getDaysLeft = (deadline) => {
    const diff = Math.ceil(
      (new Date(deadline) - new Date(today)) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Due today";
    return `${diff}d left`;
  };

  const getStatus = (goal) => {
    if (goal.completed) return "completed";
    if (goal.deadline < today) return "overdue";
    const daysLeft = Math.ceil(
      (new Date(goal.deadline) - new Date(today)) / (1000 * 60 * 60 * 24),
    );
    if (daysLeft <= 7) return "upcoming";
    return "active";
  };

  const statusBadge = (status) => {
    const map = {
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        label: "Completed",
      },
      overdue: { bg: "bg-red-50", text: "text-red-600", label: "Overdue" },
      upcoming: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        label: "Due Soon",
      },
      active: { bg: "bg-indigo-50", text: "text-indigo-500", label: "Active" },
    };
    const s = map[status];
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}
      >
        {s.label}
      </span>
    );
  };

  const addSubGoal = () => {
    if (!subGoalInput.trim()) return;
    setNewGoal((prev) => ({
      ...prev,
      subGoals: [
        ...prev.subGoals,
        {
          id: `sub-${Date.now()}`,
          title: subGoalInput.trim(),
          completed: false,
        },
      ],
    }));
    setSubGoalInput("");
  };

  const removeSubGoal = (id) => {
    setNewGoal((prev) => ({
      ...prev,
      subGoals: prev.subGoals.filter((sg) => sg.id !== id),
    }));
  };

  const toggleSubject = (id) => {
    setNewGoal((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id)
        ? prev.subjectIds.filter((s) => s !== id)
        : [...prev.subjectIds, id],
    }));
  };

  const handleSave = () => {
    if (!newGoal.title || !newGoal.deadline) return;
    addGoal(newGoal);
    setNewGoal({ title: "", deadline: "", subjectIds: [], subGoals: [] });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              <Target size={22} className="text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Study Goals
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Track your learning goals and milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-medium text-sm transition-all hover:shadow-lg active:scale-[0.98]"
          >
            <Plus size={16} /> New Goal
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-6 border border-border mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              New Goal
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, deadline: e.target.value }))
                    }
                    className="w-full bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${newGoal.subjectIds.includes(s.id) ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-400 hover:bg-indigo-50"}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Sub-goals
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subGoalInput}
                    onChange={(e) => setSubGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubGoal()}
                    className="flex-1 bg-gray-50 border border-border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Add sub-goal"
                  />
                  <button
                    onClick={addSubGoal}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-bg-card border border-border text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                {newGoal.subGoals.length > 0 && (
                  <div className="space-y-2">
                    {newGoal.subGoals.map((sg) => (
                      <div
                        key={sg.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-border"
                      >
                        <Circle size={14} className="text-gray-300" />
                        <span className="text-gray-900 text-sm flex-1">
                          {sg.title}
                        </span>
                        <button
                          onClick={() => removeSubGoal(sg.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleSave}
                  disabled={!newGoal.title || !newGoal.deadline}
                  className="px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-sm font-medium disabled:opacity-40"
                >
                  Save Goal
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-xl bg-white dark:bg-bg-card border border-border text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="bg-white dark:bg-bg-card rounded-2xl p-12 border border-border text-center">
            <Target size={48} className="text-indigo-300 mx-auto mb-4" />
            <p className="text-gray-400">
              No goals set yet. Create your first goal!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const status = getStatus(goal);
              const completedCount = goal.subGoals.filter(
                (sg) => sg.completed,
              ).length;
              const totalCount = goal.subGoals.length;
              const progress =
                totalCount > 0
                  ? Math.round((completedCount / totalCount) * 100)
                  : 0;
              const isExpanded = expandedGoal === goal.id;

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-bg-card rounded-2xl p-4 sm:p-5 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <button
                          onClick={() => toggleGoal(goal.id)}
                          className="shrink-0"
                        >
                          {goal.completed ? (
                            <CheckCircle2
                              size={22}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Circle
                              size={22}
                              className="text-gray-300 hover:text-indigo-500 transition-colors"
                            />
                          )}
                        </button>
                        <h3
                          className={`text-lg font-semibold ${goal.completed ? "text-gray-300 line-through" : "text-gray-900"}`}
                        >
                          {goal.title}
                        </h3>
                        {statusBadge(status)}
                      </div>
                      <div className="flex items-center gap-4 ml-0 mt-1 sm:ml-8">
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar size={14} /> {goal.deadline}
                          <span className="text-gray-300 mx-1">|</span>
                          <Clock size={14} /> {getDaysLeft(goal.deadline)}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap ml-0 mt-2 sm:ml-8">
                        {goal.subjectIds.map((sid) => (
                          <span
                            key={sid}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 font-medium"
                          >
                            {getSubjectName(sid)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedGoal(isExpanded ? null : goal.id)
                        }
                        className="text-gray-300 hover:text-gray-900 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {totalCount > 0 && (
                    <div className="ml-8 mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">
                          {completedCount}/{totalCount} sub-goals
                        </span>
                        <span className="text-gray-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${goal.completed ? "bg-emerald-500" : "bg-indigo-500"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isExpanded && goal.subGoals.length > 0 && (
                    <div className="ml-8 space-y-2 mt-3">
                      {goal.subGoals.map((sg) => (
                        <button
                          key={sg.id}
                          onClick={() => toggleSubGoal(goal.id, sg.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-border hover:bg-gray-50 transition-colors text-left"
                        >
                          <input
                            type="checkbox"
                            checked={sg.completed}
                            readOnly
                            className="w-4 h-4 rounded border-border dark:border-white/30 text-indigo-500 focus:ring-indigo-500/20 accent-indigo-500"
                          />
                          <span
                            className={`text-sm ${sg.completed ? "text-gray-300 line-through" : "text-gray-900"}`}
                          >
                            {sg.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {goal.completed && (
                    <div className="ml-8 mt-2 flex items-center gap-1 text-emerald-500 text-sm font-medium">
                      <Award size={14} /> Goal completed!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
