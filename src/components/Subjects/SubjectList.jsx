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
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1d2e]">My Subjects</h1>
            <p className="text-[#6b7280] mt-1">
              Organize and track your learning
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-8 py-3 rounded-2xl font-medium transition-all hover:shadow-lg active:scale-[0.98] min-w-[190px]"
          >
            <Plus size={18} />
            <span className="inline-flex">Add Subject</span>
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#eef1f6] shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-[#f0f2f8] flex items-center justify-center mx-auto mb-6">
              <BookOpen size={36} className="text-[#5b5fc7]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1a1d2e] mb-2">
              No subjects yet
            </h3>
            <p className="text-[#6b7280] mb-6 max-w-sm mx-auto">
              Create your first subject to get started with organized learning.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl font-medium transition-all hover:shadow-lg active:scale-[0.98] min-w-[190px] whitespace-nowrap"
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {subjects.map((subject) => {
              const topicCount = getTopicCount(subject.id);
              const daysLeft = getDaysUntil(subject.examDate);
              return (
                <Link
                  key={subject.id}
                  to={`/subjects/${subject.id}`}
                  className="bg-white rounded-2xl border border-[#eef1f6] p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group overflow-hidden"
                >
                  <div className="flex items-stretch gap-3 mb-4">
                    <div
                      className="w-1 shrink-0 rounded-full self-stretch"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-[#1a1d2e] group-hover:text-[#5b5fc7] transition-colors leading-tight truncate">
                        {subject.name}
                      </h3>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-[#d1d5db] group-hover:text-[#5b5fc7] transition-colors mt-1 shrink-0 ml-2"
                    />
                  </div>

                  <div className="mb-4 pl-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#6b7280]">Progress</span>
                      <span className="font-medium text-[#1a1d2e]">
                        {subject.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f0f2f8] rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${subject.progress || 0}%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pl-4">
                    <span className="text-[#6b7280] flex items-center gap-1">
                      <BookOpen size={14} />
                      {topicCount} {topicCount === 1 ? "topic" : "topics"}
                    </span>
                    {subject.examDate ? (
                      <span
                        className={`flex items-center gap-1 font-medium ${daysLeft !== null && daysLeft <= 7 ? "text-[#f59e0b]" : "text-[#9ca3af]"}`}
                      >
                        <Calendar size={14} />
                        {daysLeft !== null && daysLeft <= 0
                          ? "Today"
                          : daysLeft !== null
                            ? `${daysLeft}d left`
                            : ""}
                      </span>
                    ) : (
                      <span className="text-[#9ca3af]">No exam</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-xl font-bold text-[#1a1d2e]">
                  Add New Subject
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-[#9ca3af] hover:text-[#1a1d2e] hover:bg-[#f0f2f8] rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#1a1d2e] mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full bg-[#f8f9fc] border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                    autoFocus
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#1a1d2e] mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-8 gap-2.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${color === c ? "border-[#1a1d2e] scale-110 ring-2 ring-offset-2" : "border-transparent"}`}
                        style={{
                          backgroundColor: c,
                          "--tw-ring-color": c + "40",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#1a1d2e] mb-2">
                    Exam Date{" "}
                    <span className="text-[#9ca3af] font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-[#f8f9fc] border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white border border-[#eef1f6] hover:bg-[#f0f2f8] text-[#1a1d2e] px-4 py-3 rounded-2xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl font-medium transition-all hover:shadow-lg active:scale-[0.98] min-w-[170px] whitespace-nowrap"
                  >
                    Create Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
