import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { useToast } from "../UI/Toast";
import { useConfirm } from "../UI/ConfirmDialog";
import {
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Target,
} from "lucide-react";

const STATUS_STYLES = {
  not_started: {
    bg: "bg-[#f3f4f6]",
    text: "text-[#6b7280]",
    dot: "bg-[#9ca3af]",
  },
  learning: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", dot: "bg-[#3b82f6]" },
  practicing: {
    bg: "bg-[#fffbeb]",
    text: "text-[#f59e0b]",
    dot: "bg-[#f59e0b]",
  },
  mastered: { bg: "bg-[#ecfdf5]", text: "text-[#10b981]", dot: "bg-[#10b981]" },
};

const STATUS_LABELS = {
  not_started: "Not Started",
  learning: "Learning",
  practicing: "Practicing",
  mastered: "Mastered",
};

const SubjectPage = () => {
  const { id } = useParams();
  const toast = useToast();
  const confirm = useConfirm();
  const subject = useStore((s) => s.subjects.find((sub) => sub.id === id));
  const topics = useStore((s) => s.getTopicsBySubject(id));
  const tasks = useStore((s) => s.getTasksBySubject(id));
  const addTopic = useStore((s) => s.addTopic);
  const deleteTopic = useStore((s) => s.deleteTopic);
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const [showAddTopic, setShowAddTopic] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDesc, setTopicDesc] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  if (!subject) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-white border border-[#eef1f6] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookOpen size={36} className="text-[#9ca3af]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1a1d2e] mb-2">
            Subject not found
          </h3>
          <p className="text-[#6b7280] mb-6">
            The subject you're looking for doesn't exist.
          </p>
          <Link
            to="/subjects"
            className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl font-medium text-sm transition-all hover:shadow-lg whitespace-nowrap"
          >
            <ArrowLeft size={18} />
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedTopics = topics.filter((t) => t.status === "mastered").length;
  const daysUntilExam = subject.examDate
    ? Math.ceil(
        (new Date(subject.examDate) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : null;

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;
    addTopic({
      subjectId: id,
      title: topicTitle.trim(),
      description: topicDesc.trim(),
      notes: "",
      status: "not_started",
      resources: [],
    });
    setTopicTitle("");
    setTopicDesc("");
    setShowAddTopic(false);
    toast.success("Topic added");
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      subjectId: id,
      title: taskTitle.trim(),
      dueDate: taskDueDate || null,
    });
    setTaskTitle("");
    setTaskDueDate("");
    toast.success("Task added");
  };

  const handleDeleteTopic = async (topicId, topicTitle) => {
    const ok = await confirm({
      title: "Delete Topic",
      message: `Delete topic "${topicTitle}"?`,
    });
    if (ok) {
      deleteTopic(topicId);
      toast.success("Topic deleted");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const ok = await confirm({
      title: "Delete Task",
      message: "Delete this task?",
    });
    if (ok) {
      deleteTask(taskId);
      toast.success("Task deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1d2e] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Subjects
        </Link>

        <div className="bg-white rounded-2xl border border-[#eef1f6] shadow-sm mb-6 overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{ backgroundColor: subject.color }}
          />
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: subject.color + "15" }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#1a1d2e]">
                    {subject.name}
                  </h1>
                  <p className="text-[#6b7280] mt-1">
                    {topics.length} {topics.length === 1 ? "topic" : "topics"}
                  </p>
                </div>
              </div>
              <div
                className="text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: subject.color + "18",
                  color: subject.color,
                }}
              >
                {subject.progress || 0}% complete
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#eef1f6]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#eff0ff] flex items-center justify-center">
                    <Target size={16} className="text-[#5b5fc7]" />
                  </div>
                  <span className="text-sm font-medium text-[#6b7280]">
                    Topics
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#1a1d2e]">
                  {completedTopics}/{topics.length}
                </p>
                <p className="text-sm text-[#9ca3af] mt-1">completed</p>
              </div>
              <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#eef1f6]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center">
                    <Clock size={16} className="text-[#f59e0b]" />
                  </div>
                  <span className="text-sm font-medium text-[#6b7280]">
                    Pending Tasks
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#1a1d2e]">
                  {pendingTasks}
                </p>
                <p className="text-sm text-[#9ca3af] mt-1">
                  {completedTasks} completed
                </p>
              </div>
              <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#eef1f6]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
                    <Calendar size={16} className="text-[#10b981]" />
                  </div>
                  <span className="text-sm font-medium text-[#6b7280]">
                    Exam Countdown
                  </span>
                </div>
                {subject.examDate ? (
                  <>
                    <p
                      className={`text-3xl font-bold ${daysUntilExam <= 7 ? "text-[#f59e0b]" : "text-[#1a1d2e]"}`}
                    >
                      {daysUntilExam <= 0 ? "Today!" : `${daysUntilExam}d`}
                    </p>
                    <p className="text-sm text-[#9ca3af] mt-1">
                      {new Date(subject.examDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-[#1a1d2e]">—</p>
                    <p className="text-sm text-[#9ca3af] mt-1">No exam date</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#eef1f6] shadow-sm mb-6 overflow-hidden">
          <div className="p-6 border-b border-[#eef1f6]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1a1d2e]">Topics</h2>
              <button
                onClick={() => setShowAddTopic(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl text-sm font-medium transition-all hover:shadow-lg active:scale-[0.98] whitespace-nowrap"
              >
                <Plus size={16} />
                Add Topic
              </button>
            </div>
          </div>

          {showAddTopic && (
            <div className="p-6 bg-[#f8f9fc] border-b border-[#eef1f6]">
              <form onSubmit={handleAddTopic} className="space-y-3">
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Topic title"
                  className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                  autoFocus
                />
                <input
                  type="text"
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="Short description (optional)"
                  className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTopic(false)}
                    className="bg-white border border-[#eef1f6] hover:bg-[#f0f2f8] text-[#1a1d2e] px-4 py-2 rounded-2xl text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl text-sm font-medium transition-all hover:shadow-lg active:scale-[0.98] whitespace-nowrap"
                  >
                    Add Topic
                  </button>
                </div>
              </form>
            </div>
          )}

          {topics.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f2f8] flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-[#9ca3af]" />
              </div>
              <p className="text-[#6b7280] font-medium mb-1">No topics yet</p>
              <p className="text-[#9ca3af] text-sm">
                Add your first topic above to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eef1f6]">
              {topics.map((topic) => {
                const style =
                  STATUS_STYLES[topic.status] || STATUS_STYLES.not_started;
                return (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fc] transition-colors group"
                  >
                    <Link
                      to={`/topics/${topic.id}`}
                      className="flex items-center gap-4 flex-1 min-w-0"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`}
                      />
                      <div className="min-w-0">
                        <h3 className="font-medium text-[#1a1d2e] group-hover:text-[#5b5fc7] transition-colors truncate">
                          {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-[#9ca3af] text-sm mt-0.5 truncate">
                            {topic.description}
                          </p>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text}`}
                      >
                        {STATUS_LABELS[topic.status]}
                      </span>
                      <button
                        onClick={() => handleDeleteTopic(topic.id, topic.title)}
                        className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight
                        size={16}
                        className="text-[#9ca3af] group-hover:text-[#5b5fc7] transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#eef1f6] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#eef1f6]">
            <h2 className="text-xl font-semibold text-[#1a1d2e]">Tasks</h2>
          </div>

          <div className="p-6 bg-[#f8f9fc] border-b border-[#eef1f6]">
            <form onSubmit={handleAddTask} className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                />
              </div>
              <div className="w-44">
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-white border border-[#eef1f6] rounded-xl px-4 py-3 text-[#1a1d2e] focus:outline-none focus:ring-2 focus:ring-[#5b5fc7]/20 focus:border-[#5b5fc7] transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2.5 bg-[#5b5fc7] hover:bg-[#4a4eb5] text-white px-7 py-3 rounded-2xl font-medium transition-all hover:shadow-lg active:scale-[0.98] whitespace-nowrap"
              >
                Add
              </button>
            </form>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f2f8] flex items-center justify-center mx-auto mb-4">
                <Target size={28} className="text-[#9ca3af]" />
              </div>
              <p className="text-[#6b7280] font-medium mb-1">No tasks yet</p>
              <p className="text-[#9ca3af] text-sm">
                Add tasks above to track your work.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eef1f6]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8f9fc] transition-colors group"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 transition-all hover:scale-110"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-[#10b981]" />
                    ) : (
                      <Circle
                        size={20}
                        className="text-[#d1d5db] hover:text-[#5b5fc7]"
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium transition-colors ${task.completed ? "text-[#9ca3af] line-through" : "text-[#1a1d2e]"}`}
                    >
                      {task.title}
                    </p>
                  </div>
                  {task.dueDate && (
                    <span
                      className={`text-sm shrink-0 ${new Date(task.dueDate) < new Date() && !task.completed ? "text-[#ef4444] font-medium" : "text-[#9ca3af]"}`}
                    >
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
