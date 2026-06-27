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
      active: { bg: "bg-[#e8e9f8]", text: "text-[#5b5fc7]", label: "Active" },
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
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8e9f8] flex items-center justify-center">
              <Target size={22} className="text-[#5b5fc7]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Study Goals</h1>
              <p className="text-[#64748b] text-sm mt-1">
                Track your learning goals and milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-8 py-3 rounded-2xl font-medium text-sm transition-all hover:shadow-lg active:scale-[0.98] min-w-[190px]"
          >
            <Plus size={16} /> New Goal
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-[#eef1f6] mb-6">
            <h3 className="text-lg font-semibold text-[#1e293b] mb-4">
              New Goal
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#64748b] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full bg-[#f8f9fd] border border-[#eef1f6] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#64748b] mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, deadline: e.target.value }))
                    }
                    className="w-full bg-[#f8f9fd] border border-[#eef1f6] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#64748b] mb-2">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSubject(s.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        newGoal.subjectIds.includes(s.id)
                          ? "bg-[#5b5fc7] text-white"
                          : "bg-[#f0f2f8] text-[#64748b] hover:bg-[#e8e9f8]"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#64748b] mb-2">
                  Sub-goals
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subGoalInput}
                    onChange={(e) => setSubGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubGoal()}
                    className="flex-1 bg-[#f8f9fd] border border-[#eef1f6] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] outline-none transition-all"
                    placeholder="Add sub-goal"
                  />
                  <button
                    onClick={addSubGoal}
                    className="px-4 py-2 rounded-xl bg-white border border-[#eef1f6] text-[#1e293b] hover:bg-[#f0f2f8] transition-all text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
                {newGoal.subGoals.length > 0 && (
                  <div className="space-y-2">
                    {newGoal.subGoals.map((sg) => (
                      <div
                        key={sg.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[#f8f9fd] border border-[#eef1f6]"
                      >
                        <Circle size={14} className="text-[#94a3b8]" />
                        <span className="text-[#1e293b] text-sm flex-1">
                          {sg.title}
                        </span>
                        <button
                          onClick={() => removeSubGoal(sg.id)}
                          className="text-[#94a3b8] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={!newGoal.title || !newGoal.deadline}
                  className="px-6 py-2 rounded-xl bg-[#5b5fc7] text-white hover:bg-[#4a4eb5] transition-all text-sm font-medium disabled:opacity-40"
                >
                  Save Goal
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-xl bg-white border border-[#eef1f6] text-[#1e293b] hover:bg-[#f0f2f8] transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#eef1f6] text-center">
            <Target size={48} className="text-[#c5c7e8] mx-auto mb-4" />
            <p className="text-[#64748b]">
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
                  className="bg-white rounded-2xl p-5 border border-[#eef1f6]"
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
                              className="text-[#94a3b8] hover:text-[#5b5fc7] transition-colors"
                            />
                          )}
                        </button>
                        <h3
                          className={`text-lg font-semibold ${goal.completed ? "text-[#94a3b8] line-through" : "text-[#1e293b]"}`}
                        >
                          {goal.title}
                        </h3>
                        {statusBadge(status)}
                      </div>
                      <div className="flex items-center gap-4 ml-8 mt-1">
                        <span className="flex items-center gap-1 text-[#64748b] text-sm">
                          <Calendar size={14} /> {goal.deadline}
                          <span className="text-[#94a3b8] mx-1">|</span>
                          <Clock size={14} /> {getDaysLeft(goal.deadline)}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap ml-8 mt-2">
                        {goal.subjectIds.map((sid) => (
                          <span
                            key={sid}
                            className="text-xs px-2 py-0.5 rounded-full bg-[#f0f2f8] text-[#64748b] font-medium"
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
                        className="text-[#94a3b8] hover:text-[#1e293b] transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-[#94a3b8] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {totalCount > 0 && (
                    <div className="ml-8 mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#64748b]">
                          {completedCount}/{totalCount} sub-goals
                        </span>
                        <span className="text-[#64748b]">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#eef1f6] rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            goal.completed ? "bg-emerald-500" : "bg-[#5b5fc7]"
                          }`}
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
                          className="w-full flex items-center gap-2 p-2 rounded-xl bg-[#f8f9fd] border border-[#eef1f6] hover:bg-[#f0f2f8] transition-colors text-left"
                        >
                          <input
                            type="checkbox"
                            checked={sg.completed}
                            readOnly
                            className="w-4 h-4 rounded border-[#d1d5db] text-[#5b5fc7] focus:ring-[#5b5fc7]/20 accent-[#5b5fc7]"
                          />
                          <span
                            className={`text-sm ${sg.completed ? "text-[#94a3b8] line-through" : "text-[#1e293b]"}`}
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
