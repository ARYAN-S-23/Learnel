import { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { Plus, BookOpen, Calendar, ChevronRight, X } from "lucide-react";

const PRESET_COLORS = [
  "#6366F1",
  "#3B82F6",
  "#14B8A6",
  "#22C55E",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#EC4899",
];

const SubjectList = () => {
  const subjects = useStore((s) => s.subjects);
  const topics = useStore((s) => s.topics);
  const addSubject = useStore((s) => s.addSubject);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [examDate, setExamDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSubject({
      name: name.trim(),
      color,
      examDate: examDate || null,
      icon: "book",
    });
    setName("");
    setColor(PRESET_COLORS[0]);
    setExamDate("");
    setShowModal(false);
  };

  const getTopicCount = (subjectId) =>
    topics.filter((t) => t.subjectId === subjectId).length;

  const getDaysUntil = (date) => {
    if (!date) return null;
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[1.4rem] font-extrabold text-gray-900 tracking-tight">
            My Subjects
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Organize and track your learning
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-[12px] transition-all hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus size={14} />
          Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-bg-card rounded-2xl border border-border">
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
            <BookOpen size={20} className="text-gray-300" />
          </div>
          <h3 className="text-[13px] font-semibold text-gray-600 mb-1">
            No subjects yet
          </h3>
          <p className="text-[11px] text-gray-400 mb-5 max-w-55 leading-relaxed">
            Create your first subject to get started with organized learning.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none rounded"
          >
            <Plus size={12} /> Create Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((subject) => {
            const topicCount = getTopicCount(subject.id);
            const daysLeft = getDaysUntil(subject.examDate);
            return (
              <Link
                key={subject.id}
                to={`/subjects/${subject.id}`}
                className="bg-white dark:bg-bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {subject.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {topicCount} {topicCount === 1 ? "topic" : "topics"}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1"
                  />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-bold text-gray-700 tabular-nums">
                      {subject.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-0.75">
                    <div
                      className="h-0.75 rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.progress || 0}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <BookOpen size={11} />
                    {topicCount} {topicCount === 1 ? "topic" : "topics"}
                  </span>
                  {subject.examDate ? (
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${daysLeft !== null && daysLeft <= 7 ? "text-amber-600" : "text-gray-400"}`}
                    >
                      <Calendar size={11} />
                      {daysLeft !== null && daysLeft <= 0
                        ? "Today"
                        : daysLeft !== null
                          ? `${daysLeft}d left`
                          : ""}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-300">No exam</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-bg-card rounded-2xl w-full max-w-md shadow-xl border border-border">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-lg font-bold text-gray-900">
                Add New Subject
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  autoFocus
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${color === c ? "border-gray-900 scale-110 ring-2 ring-offset-2" : "border-transparent"}`}
                      style={{
                        backgroundColor: c,
                        "--tw-ring-color": c + "40",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Date{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white dark:bg-bg-card border border-border hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-2xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
